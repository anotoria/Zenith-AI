-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'moderator');
CREATE TYPE public.platform_type AS ENUM ('Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'WordPress');
CREATE TYPE public.post_status AS ENUM ('Scheduled', 'Published', 'Draft', 'Error');
CREATE TYPE public.auto_post_status AS ENUM ('PENDING', 'SUCCESS', 'ERROR', 'NONE');
CREATE TYPE public.media_type AS ENUM ('image', 'video');
CREATE TYPE public.saved_item_type AS ENUM ('IMAGE', 'VIDEO', 'COPY');
CREATE TYPE public.module_content_type AS ENUM ('VIDEO', 'IMAGE', 'DOCUMENT', 'TEXT');

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  address TEXT,
  whatsapp TEXT,
  twitter TEXT,
  linkedin TEXT,
  website TEXT,
  instagram TEXT,
  facebook TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- User roles table (security critical)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- User permissions table
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  can_manage_users BOOLEAN DEFAULT false NOT NULL,
  can_create_trails BOOLEAN DEFAULT false NOT NULL,
  can_access_articles BOOLEAN DEFAULT true NOT NULL,
  can_access_planner BOOLEAN DEFAULT true NOT NULL,
  can_access_ai_creator BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Social profiles/integrations table
CREATE TABLE public.social_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  platform platform_type NOT NULL,
  username TEXT,
  is_connected BOOLEAN DEFAULT false NOT NULL,
  site_url TEXT,
  api_username TEXT,
  api_key TEXT, -- encrypted
  app_id TEXT,
  client_secret TEXT, -- encrypted
  selected_page_id TEXT,
  selected_page_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, platform)
);

-- Articles table
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  selected_copy_id TEXT,
  selected_image_id TEXT,
  is_scheduled BOOLEAN DEFAULT false NOT NULL,
  auto_post_status auto_post_status DEFAULT 'NONE' NOT NULL,
  auto_posted_at TIMESTAMPTZ,
  auto_post_platform platform_type,
  original_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Article copies table (AI generated)
CREATE TABLE public.article_copies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Article images table (AI generated)
CREATE TABLE public.article_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Scheduled posts table
CREATE TABLE public.scheduled_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
  platform platform_type NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  media_type media_type DEFAULT 'image',
  scheduled_at TIMESTAMPTZ NOT NULL,
  status post_status DEFAULT 'Scheduled' NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Learning trails table
CREATE TABLE public.learning_trails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Trail modules table
CREATE TABLE public.trail_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trail_id UUID REFERENCES public.learning_trails(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Module content table
CREATE TABLE public.module_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES public.trail_modules(id) ON DELETE CASCADE NOT NULL,
  type module_content_type NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  content TEXT,
  file_name TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Saved items library table
CREATE TABLE public.saved_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type saved_item_type NOT NULL,
  content TEXT NOT NULL,
  prompt TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_copies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trail_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id)
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  -- Create default permissions
  INSERT INTO public.user_permissions (
    user_id,
    can_manage_users,
    can_create_trails,
    can_access_articles,
    can_access_planner,
    can_access_ai_creator
  )
  VALUES (new.id, false, false, true, true, true);
  
  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_permissions_updated_at BEFORE UPDATE ON public.user_permissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_social_integrations_updated_at BEFORE UPDATE ON public.social_integrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scheduled_posts_updated_at BEFORE UPDATE ON public.scheduled_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_learning_trails_updated_at BEFORE UPDATE ON public.learning_trails FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trail_modules_updated_at BEFORE UPDATE ON public.trail_modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all user roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage user roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_permissions
CREATE POLICY "Users can view their own permissions"
  ON public.user_permissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all permissions"
  ON public.user_permissions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for social_integrations
CREATE POLICY "Users can manage their own integrations"
  ON public.social_integrations FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for articles
CREATE POLICY "Users can view their own articles"
  ON public.articles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own articles"
  ON public.articles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own articles"
  ON public.articles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own articles"
  ON public.articles FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for article_copies
CREATE POLICY "Users can manage copies of their articles"
  ON public.article_copies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.articles
      WHERE articles.id = article_copies.article_id
      AND articles.user_id = auth.uid()
    )
  );

-- RLS Policies for article_images
CREATE POLICY "Users can manage images of their articles"
  ON public.article_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.articles
      WHERE articles.id = article_images.article_id
      AND articles.user_id = auth.uid()
    )
  );

-- RLS Policies for scheduled_posts
CREATE POLICY "Users can manage their own posts"
  ON public.scheduled_posts FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for learning_trails
CREATE POLICY "Everyone can view public trails"
  ON public.learning_trails FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Admins can create trails"
  ON public.learning_trails FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update trails"
  ON public.learning_trails FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete trails"
  ON public.learning_trails FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for trail_modules
CREATE POLICY "Users can view modules of accessible trails"
  ON public.trail_modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.learning_trails
      WHERE learning_trails.id = trail_modules.trail_id
      AND (learning_trails.is_public = true OR learning_trails.created_by = auth.uid())
    )
  );

CREATE POLICY "Admins can manage trail modules"
  ON public.trail_modules FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for module_content
CREATE POLICY "Users can view content of accessible modules"
  ON public.module_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trail_modules
      JOIN public.learning_trails ON learning_trails.id = trail_modules.trail_id
      WHERE trail_modules.id = module_content.module_id
      AND (learning_trails.is_public = true OR learning_trails.created_by = auth.uid())
    )
  );

CREATE POLICY "Admins can manage module content"
  ON public.module_content FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for saved_items
CREATE POLICY "Users can manage their own saved items"
  ON public.saved_items FOR ALL
  USING (auth.uid() = user_id);