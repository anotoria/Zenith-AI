import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { SocialPlanner } from '@/components/SocialPlanner';
import type { ScheduledPostUI, PlatformType, PostStatus, MediaType } from '@/lib/types';
import { toast } from 'sonner';

export const SocialPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ScheduledPostUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scheduled_posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      const formattedPosts: ScheduledPostUI[] = (data || []).map((post) => ({
        id: post.id,
        articleId: post.article_id || undefined,
        platform: post.platform as PlatformType,
        content: post.content,
        scheduledAt: new Date(post.scheduled_at),
        status: post.status as PostStatus,
        imageUrl: post.image_url || undefined,
        mediaType: post.media_type as MediaType | undefined,
        errorMessage: post.error_message || undefined,
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Erro ao carregar posts agendados');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async (post: ScheduledPostUI) => {
    try {
      const { data, error } = await supabase
        .from('scheduled_posts')
        .insert({
          user_id: user?.id,
          article_id: post.articleId || null,
          platform: post.platform,
          content: post.content,
          scheduled_at: post.scheduledAt.toISOString(),
          status: post.status,
          image_url: post.imageUrl || null,
          media_type: post.mediaType || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newPost: ScheduledPostUI = {
        id: data.id,
        articleId: data.article_id || undefined,
        platform: data.platform as PlatformType,
        content: data.content,
        scheduledAt: new Date(data.scheduled_at),
        status: data.status as PostStatus,
        imageUrl: data.image_url || undefined,
        mediaType: data.media_type as MediaType | undefined,
      };

      setPosts([...posts, newPost]);
      toast.success('Post agendado com sucesso!');
    } catch (error) {
      console.error('Error adding post:', error);
      toast.error('Erro ao agendar post');
    }
  };

  const handleUpdatePost = async (post: ScheduledPostUI) => {
    try {
      const { error } = await supabase
        .from('scheduled_posts')
        .update({
          platform: post.platform,
          content: post.content,
          scheduled_at: post.scheduledAt.toISOString(),
          status: post.status,
          image_url: post.imageUrl || null,
          media_type: post.mediaType || null,
        })
        .eq('id', post.id);

      if (error) throw error;

      setPosts(posts.map((p) => (p.id === post.id ? post : p)));
      toast.success('Post atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Erro ao atualizar post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Planejador Social</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie e agende seus posts para redes sociais
        </p>
      </div>

      <SocialPlanner 
        posts={posts} 
        onAddPost={handleAddPost} 
        onUpdatePost={handleUpdatePost} 
      />
    </div>
  );
};
