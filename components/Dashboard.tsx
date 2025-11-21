
import React from 'react';
import type { View } from '../App';
import { ArticleIcon, PlannerIcon, LearningIcon, SettingsIcon, MagicWandIcon, LibraryIcon, HistoryIcon } from './icons/Icon';

interface DashboardProps {
    setView: (view: View) => void;
}

const FeatureCard: React.FC<{
    icon: React.ElementType,
    title: string,
    description: string,
    view: View,
    onClick: (view: View) => void;
}> = ({ icon: Icon, title, description, view, onClick }) => (
    <button
        onClick={() => onClick(view)}
        className="bg-surface p-6 rounded-lg border border-border hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 text-left h-full flex flex-col"
    >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 flex-shrink-0">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary text-sm flex-1">{description}</p>
    </button>
);


export const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  return (
    <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Bem-vindo ao Zenith!</h1>
        <p className="text-text-secondary mb-8 text-sm md:text-base">Sua central de comando para criação e distribuição de conteúdo.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <FeatureCard
                icon={ArticleIcon}
                title="Artigos do Blog"
                description="Importe artigos do seu WordPress e gere conteúdo para redes sociais com IA."
                view="articles"
                onClick={setView}
            />
             <FeatureCard
                icon={PlannerIcon}
                title="Social Planner"
                description="Agende e visualize suas postagens em um calendário completo e intuitivo."
                view="planner"
                onClick={setView}
            />
            <FeatureCard
                icon={MagicWandIcon}
                title="Criando com IA"
                description="Gere imagens, vídeos e copys de alta conversão utilizando Inteligência Artificial."
                view="ai-creator"
                onClick={setView}
            />
            <FeatureCard
                icon={LibraryIcon}
                title="Minha Biblioteca"
                description="Acesse todo o seu histórico de conteúdos gerados e salvos no sistema."
                view="saved-content"
                onClick={setView}
            />
            <FeatureCard
                icon={HistoryIcon}
                title="Histórico de Auto-Posts"
                description="Visualize todas as postagens automáticas enviadas do WP para as redes."
                view="auto-posts"
                onClick={setView}
            />
             <FeatureCard
                icon={LearningIcon}
                title="Trilhas de Aprendizagem"
                description="Acesse conteúdos e tutoriais exclusivos para aprimorar suas habilidades."
                view="learning"
                onClick={setView}
            />
             <FeatureCard
                icon={SettingsIcon}
                title="Configurações"
                description="Gerencie suas integrações com redes sociais, blogs e outras ferramentas."
                view="settings"
                onClick={setView}
            />
        </div>

        <div className="mt-8 md:mt-10 bg-surface border border-border rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-text-primary mb-4">Próximos Passos</h2>
            <ul className="space-y-3">
                <li className="flex items-start md:items-center text-text-secondary text-sm md:text-base">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-background font-bold text-xs md:text-sm mr-3 mt-0.5 md:mt-0">1</span>
                    <span>Conecte seu blog WordPress na tela de <button onClick={() => setView('settings')} className="text-primary font-semibold hover:underline mx-1">Configurações</button> para começar.</span>
                </li>
                <li className="flex items-start md:items-center text-text-secondary text-sm md:text-base">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-background font-bold text-xs md:text-sm mr-3 mt-0.5 md:mt-0">2</span>
                    <span>Vá para <button onClick={() => setView('articles')} className="text-primary font-semibold hover:underline mx-1">Artigos do Blog</button> e gere sua primeira postagem com IA.</span>
                </li>
                 <li className="flex items-start md:items-center text-text-secondary text-sm md:text-base">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-background font-bold text-xs md:text-sm mr-3 mt-0.5 md:mt-0">3</span>
                    <span>Explore as <button onClick={() => setView('learning')} className="text-primary font-semibold hover:underline mx-1">Trilhas de Aprendizagem</button> para dominar a plataforma.</span>
                </li>
            </ul>
        </div>
    </div>
  );
};
