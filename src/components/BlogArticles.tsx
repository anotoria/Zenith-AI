
import React, { useState, useMemo } from 'react';
import type { Article } from '../types';
import { AutoPostStatus } from '../types';
import { ArticleCard } from './ArticleCard';

interface BlogArticlesProps {
    articles: Article[];
    onUpdateArticle: (updatedArticle: Article) => void;
    onSchedulePost: (article: Article) => void;
    onSync?: () => void;
}

type DateFilter = 'ALL' | 'THIS_MONTH' | 'LAST_MONTH';

export const BlogArticles: React.FC<BlogArticlesProps> = ({ articles, onUpdateArticle, onSchedulePost, onSync }) => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [dateFilter, setDateFilter] = useState<DateFilter>('ALL');

    const handleSyncClick = async () => {
        if (onSync) {
            setIsSyncing(true);
            await onSync();
            setTimeout(() => setIsSyncing(false), 2000);
        }
    };

    // Lógica de Filtragem
    const filteredArticles = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return articles.filter(article => {
            // 1. Filtro de Status
            if (statusFilter !== 'ALL') {
                // Se o filtro for específico, verifica se bate com o status do artigo
                // Se o artigo não tiver status (undefined), tratamos como NONE
                const artStatus = article.autoPostStatus || AutoPostStatus.NONE;
                if (artStatus !== statusFilter) {
                    return false;
                }
            }

            // 2. Filtro de Data
            if (dateFilter !== 'ALL') {
                const articleDate = new Date(article.createdAt);
                
                if (dateFilter === 'THIS_MONTH') {
                    if (articleDate.getMonth() !== currentMonth || articleDate.getFullYear() !== currentYear) {
                        return false;
                    }
                }
                
                if (dateFilter === 'LAST_MONTH') {
                    const lastMonthDate = new Date(now);
                    lastMonthDate.setMonth(now.getMonth() - 1);
                    // Ajuste para virada de ano (se jan, mês anterior é dez do ano anterior)
                    const targetMonth = lastMonthDate.getMonth();
                    const targetYear = lastMonthDate.getFullYear();

                    if (articleDate.getMonth() !== targetMonth || articleDate.getFullYear() !== targetYear) {
                        return false;
                    }
                }
            }

            return true;
        });
    }, [articles, statusFilter, dateFilter]);

    if (!articles.length) {
        return <div className="text-center text-text-secondary p-10">Sincronizando com o blog...</div>;
    }

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary mb-1">Artigos do Blog</h2>
                    <p className="text-text-secondary">
                        Importe e automatize suas postagens.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
                    {/* Filtro de Status */}
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto bg-surface border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none text-sm"
                    >
                        <option value="ALL">Todos os Status</option>
                        <option value={AutoPostStatus.NONE}>Sem Auto-Post</option>
                        <option value={AutoPostStatus.SUCCESS}>Sucesso (Auto)</option>
                        <option value={AutoPostStatus.ERROR}>Erro (Auto)</option>
                        <option value={AutoPostStatus.PENDING}>Pendente</option>
                    </select>

                    {/* Filtro de Data */}
                    <select 
                        value={dateFilter} 
                        onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                        className="w-full sm:w-auto bg-surface border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none text-sm"
                    >
                        <option value="ALL">Todo o Período</option>
                        <option value="THIS_MONTH">Este Mês</option>
                        <option value="LAST_MONTH">Mês Passado</option>
                    </select>

                    {/* Botão de Sync */}
                    <button 
                        onClick={handleSyncClick}
                        disabled={isSyncing}
                        className={`w-full sm:w-auto bg-primary text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center transition-all ${isSyncing ? 'opacity-75 cursor-wait' : 'hover:bg-primary-hover'}`}
                    >
                        {isSyncing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Verificando...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                Sincronizar
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {filteredArticles.length === 0 ? (
                    <div className="text-center py-12 bg-surface border border-border rounded-lg">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background border border-border flex items-center justify-center">
                            <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h3 className="text-lg font-medium text-text-primary">Nenhum artigo encontrado</h3>
                        <p className="text-text-secondary mt-1">Tente ajustar os filtros de status ou data.</p>
                    </div>
                ) : (
                    filteredArticles.map(article => (
                        <ArticleCard 
                            key={article.id} 
                            article={article} 
                            onUpdate={onUpdateArticle} 
                            onSchedule={onSchedulePost}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
