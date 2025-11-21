import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: 'Artigos do Blog',
      description: 'Importe artigos e gere conteúdo para redes sociais com IA',
      link: '/articles',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Calendar,
      title: 'Social Planner',
      description: 'Agende e visualize suas postagens em um calendário completo',
      link: '/planner',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Sparkles,
      title: 'IA Creator',
      description: 'Gere imagens, vídeos e copys com Inteligência Artificial',
      link: '/ai-creator',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const stats = [
    { label: 'Artigos Publicados', value: '0', icon: FileText },
    { label: 'Posts Agendados', value: '0', icon: Calendar },
    { label: 'Conteúdos Gerados', value: '0', icon: Sparkles },
    { label: 'Taxa de Crescimento', value: '+0%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Bem-vindo ao Zenith! ✨
        </h1>
        <p className="text-muted-foreground text-lg">
          Sua central de comando para criação e distribuição de conteúdo
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Funcionalidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link
                to={feature.link}
                className="group bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all h-full flex flex-col"
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 flex-1">
                  {feature.description}
                </p>
                <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Acessar
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Próximos Passos</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mr-3 mt-0.5">
              1
            </div>
            <div>
              <p className="text-foreground font-medium">Configure suas integrações</p>
              <p className="text-muted-foreground text-sm">
                Conecte WordPress e redes sociais nas Configurações
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mr-3 mt-0.5">
              2
            </div>
            <div>
              <p className="text-foreground font-medium">Importe seu primeiro artigo</p>
              <p className="text-muted-foreground text-sm">
                Vá para Artigos e gere conteúdo com IA
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mr-3 mt-0.5">
              3
            </div>
            <div>
              <p className="text-foreground font-medium">Explore as Trilhas de Aprendizagem</p>
              <p className="text-muted-foreground text-sm">
                Aprenda a dominar a plataforma
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
