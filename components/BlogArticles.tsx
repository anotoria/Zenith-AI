
import React, { useState } from 'react';
import type { Article } from '../types';
import { ArticleCard } from './ArticleCard';

interface BlogArticlesProps {
    articles: Article[];
    onUpdateArticle: (updatedArticle: Article) => void;
    onSchedulePost: (article: Article) => void;
    onSync?: () => void; // New Prop for syncing
}

export const BlogArticles: React.FC<BlogArticlesProps> = ({ articles, onUpdateArticle, onSchedulePost, onSync }) => {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSyncClick = async () => {
        if (onSync) {
            setIsSyncing(true);
            await onSync(); // Assume onSync might be async
            setTimeout(() => setIsSyncing(false), 2000); // Ensure spinner shows for a bit
        }
    };

    if (!articles.length) {
        return <div className="text-center text-text-secondary p-10">Sincronizando com o blog...</div>;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary mb-1">Artigos do Blog</h2>
                    <p className="text-text-secondary">
                        Importe e automatize suas postagens.
                    </p>
                </div>
                <button 
                    onClick={handleSyncClick}
                    disabled={isSyncing}
                    className={`bg-primary text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-primary/20 flex items-center transition-all ${isSyncing ? 'opacity-75 cursor-wait' : 'hover:bg-primary-hover'}`}
                >
                    {isSyncing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Verificando Blog...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            Sincronizar e Auto-Publicar
                        </>
                    )}
                </button>
            </div>

            <div className="space-y-6">
                {articles.map(article => (
                    <ArticleCard 
                        key={article.id} 
                        article={article} 
                        onUpdate={onUpdateArticle} 
                        onSchedule={onSchedulePost}
                    />
                ))}
            </div>
        </div>
    );
};
