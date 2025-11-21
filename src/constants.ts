
// FIX: ModuleContentType is an enum used as a value, so it must be imported as a value, not a type.
import type { User, Article, LearningTrail, SocialProfile, ScheduledPost, SavedItem } from './types';
import { Role, ModuleContentType, SavedItemType, AutoPostStatus } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alex D.',
    email: 'admin@zenith.com',
    avatar: 'https://picsum.photos/seed/user1/200/200',
    role: Role.ADMIN,
    isActive: true,
    socials: {
      linkedin: 'linkedin.com/in/alex-d',
      website: 'alexd.com',
    },
    permissions: {
      canManageUsers: true,
      canCreateTrails: true,
      canAccessArticles: true,
      canAccessPlanner: true,
      canAccessAICreator: true,
    },
  },
  {
    id: '2',
    name: 'Maria V.',
    email: 'user@zenith.com',
    avatar: 'https://picsum.photos/seed/user2/200/200',
    role: Role.USER,
    isActive: true,
    socials: {
      twitter: 'twitter.com/maria-v',
    },
    permissions: {
      canManageUsers: false,
      canCreateTrails: false,
      canAccessArticles: true,
      canAccessPlanner: true,
      canAccessAICreator: true,
    },
  },
  {
    id: '3',
    name: 'Carlos S.',
    email: 'carlos.s@example.com',
    avatar: 'https://picsum.photos/seed/user3/200/200',
    role: Role.USER,
    isActive: true,
    socials: {},
    permissions: {
      canManageUsers: false,
      canCreateTrails: false,
      canAccessArticles: false, // Example: No access to articles
      canAccessPlanner: true,
      canAccessAICreator: true,
    },
  },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art1',
    title: '10 Dicas Essenciais para Marketing de Conteúdo em 2024',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isGenerating: false,
    autoPostStatus: AutoPostStatus.NONE,
  },
  {
    id: 'art2',
    title: 'O Guia Definitivo para SEO em Vídeos no YouTube',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isGenerating: false,
    autoPostStatus: AutoPostStatus.SUCCESS,
    autoPostedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    autoPostPlatform: 'Facebook'
  },
  {
    id: 'art3',
    title: 'Como Utilizar a Psicologia das Cores no seu Branding',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isGenerating: false,
    autoPostStatus: AutoPostStatus.ERROR,
  },
];

export const MOCK_TRAILS: LearningTrail[] = [
    {
        id: 'trail1',
        title: 'Onboarding para Novos Usuários',
        description: 'Comece sua jornada com o Zenith. Aprenda o básico para configurar sua conta e criar seu primeiro post.',
        imageUrl: 'https://picsum.photos/seed/trail1/600/400',
        isPublic: true,
        modules: [
            {
                id: 'm1-1', title: 'Bem-vindo ao Zenith!', content: [
                    { id: 'c1-1-1', type: ModuleContentType.VIDEO, title: 'Visão Geral da Plataforma', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                    { id: 'c1-1-2', type: ModuleContentType.TEXT, title: 'Nossa Missão', content: '<p>Nossa missão é <strong>empoderar</strong> criadores de conteúdo com ferramentas de IA para otimizar e automatizar seu fluxo de trabalho. Saiba mais em <a href="#" class="text-primary hover:underline">nosso site</a>.</p>' },
                ]
            },
            {
                id: 'm1-2', title: 'Configurando Suas Integrações', content: [
                    { id: 'c1-2-1', type: ModuleContentType.VIDEO, title: 'Conectando seu Blog WordPress', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                    { id: 'c1-2-2', type: ModuleContentType.DOCUMENT, title: 'Guia de Conexão (PDF)', fileName: 'guia_wordpress.pdf', url: '#' },
                ]
            }
        ]
    },
    {
        id: 'trail2',
        title: 'Mestres do Conteúdo com IA',
        description: 'Aprenda técnicas avançadas para gerar cópias e imagens de alta conversão usando o poder da IA.',
        imageUrl: 'https://picsum.photos/seed/trail2/600/400',
        isPublic: true,
        modules: [
            {
                id: 'm2-1', title: 'Engenharia de Prompt para Imagens', content: [
                    { id: 'c2-1-1', type: ModuleContentType.IMAGE, title: 'Exemplo de Imagem "Caseira"', url: 'https://picsum.photos/seed/prompt/800/600' },
                    { id: 'c2-1-2', type: ModuleContentType.TEXT, title: 'Dicas para Prompts Eficazes', content: '<ul><li>Seja descritivo e específico.</li><li>Use adjetivos para definir o estilo (ex: "caseiro", "cinematográfico").</li><li>Mencione a iluminação e o ângulo da câmera.</li></ul>' },
                ]
            }
        ]
    },
    {
        id: 'trail3',
        title: 'Planejamento de Lançamento (Privado)',
        description: 'Estratégias internas para o lançamento do nosso próximo recurso.',
        imageUrl: 'https://picsum.photos/seed/trail3/600/400',
        isPublic: false,
        modules: []
    }
];

export const MOCK_SOCIAL_PROFILES: SocialProfile[] = [
    { 
        id: 'sp1', 
        platform: 'Wordpress', 
        username: 'meu-blog-incrivel', 
        isConnected: true,
        config: {
            siteUrl: 'https://meublog.com',
            username: 'admin_wp'
        }
    },
    { 
        id: 'sp2', 
        platform: 'Facebook', 
        username: 'MeuNegocio', 
        isConnected: true,
        config: {
            appId: '1234567890',
            selectedPageId: 'pg-1',
            selectedPageName: 'Minha Página Oficial'
        }
    },
    { 
        id: 'sp3', 
        platform: 'Instagram', 
        username: '@meunegocio', 
        isConnected: false,
        config: {}
    },
    { 
        id: 'sp4', 
        platform: 'TikTok', 
        username: '@meunegociocriativo', 
        isConnected: true,
        config: {}
    },
    { 
        id: 'sp5', 
        platform: 'LinkedIn', 
        username: 'Meu Negócio Company', 
        isConnected: false,
        config: {}
    },
];

export const MOCK_SCHEDULED_POSTS: ScheduledPost[] = [];

export const MOCK_SAVED_ITEMS: SavedItem[] = [
  {
    id: 'save-1',
    userId: '1',
    type: SavedItemType.COPY,
    content: 'Descubra o segredo para triplicar suas vendas em 30 dias! #MarketingDigital',
    prompt: 'Copy AIDA para vendas',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'save-2',
    userId: '1',
    type: SavedItemType.IMAGE,
    content: 'https://picsum.photos/seed/saved1/800/800',
    prompt: 'Gato futurista cyberpunk',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'save-3',
    userId: '2',
    type: SavedItemType.COPY,
    content: 'Apenas um teste de usuário 2',
    prompt: 'Teste simples',
    createdAt: new Date()
  }
];

export const MOCK_FB_PAGES = [
    { id: 'pg-1', name: 'Minha Página Oficial' },
    { id: 'pg-2', name: 'Comunidade de Fãs' },
    { id: 'pg-3', name: 'Loja Online - Vitrine' },
];

// --- New Constants for AI Creator ---

export const IMAGE_TYPES = [
    "Fotorealista", "Cinematográfico", "Caseiro/Amador", "Ilustração 3D", 
    "Cartoon", "Minimalista", "Cyberpunk", "Aquarela", "Pop Art", "Esboço a lápis"
];

export const VIDEO_TYPES = [
    "Cinematográfico", "Animação 3D", "Cartoon", "Drone", "Timelapse", 
    "Estilo Vlog", "Comercial de TV", "Futurista", "Vintage/Retro", "Documentário"
];

export const COPY_TYPES = [
    "Landing Page", "Headlines (Títulos)", "Descrição de Post (Social)", 
    "Roteiro para Reels/Shorts", "BIO para Instagram", "E-mail Marketing", 
    "Texto para Anúncio (Ads)", "Descrição de Vídeo (Youtube)", "Mensagem para WhatsApp"
];

export const COPY_METHODS = [
    "AIDA (Atenção, Interesse, Desejo, Ação)",
    "PAS (Problema, Agitação, Solução)",
    "BAB (Before, After, Bridge)",
    "Pain-Solution",
    "Features & Benefits",
    "Storytelling",
    "Social Proof",
    "Urgência e Escassez",
    "SPIN Selling",
    "Kahneman (Fast & Slow)"
];
