
import React, { useState, useMemo } from 'react';
import type { Article } from '../types';
import { AutoPostStatus } from '../types';
import { HistoryIcon } from './icons/Icon';

interface AutoPostHistoryProps {
    articles: Article[];
}

type StatusFilter = 'ALL' | AutoPostStatus.SUCCESS | AutoPostStatus.ERROR;
type DateFilter = 'ALL' | 'THIS_MONTH' | 'LAST_MONTH';

export const AutoPostHistory: React.FC<AutoPostHistoryProps> = ({ articles }) => {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
    const [dateFilter, setDateFilter] = useState<DateFilter>('ALL');

    // Only get articles that have attempted an auto-post (not NONE)
    const autoPostedArticles = useMemo(() => {
        return articles.filter(a => a.autoPostStatus && a.autoPostStatus !== AutoPostStatus.NONE);
    }, [articles]);

    const filteredData = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return autoPostedArticles.filter(article => {
            // Filter by Status
            if (statusFilter !== 'ALL' && article.autoPostStatus !== statusFilter) return false;

            // Filter by Date
            if (dateFilter === 'ALL') return true;
            
            // Use autoPostedAt if available, otherwise fallback to createdAt
            const postDate = article.autoPostedAt ? new Date(article.autoPostedAt) : new Date(article.createdAt);
            
            if (dateFilter === 'THIS_MONTH') {
                return postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear;
            }
            if (dateFilter === 'LAST_MONTH') {
                const lastMonthDate = new Date(now);
                lastMonthDate.setMonth(now.getMonth() - 1);
                return postDate.getMonth() === lastMonthDate.getMonth() && postDate.getFullYear() === lastMonthDate.getFullYear();
            }
            return true;
        }).sort((a, b) => {
            const dateA = a.autoPostedAt ? new Date(a.autoPostedAt).getTime() : 0;
            const dateB = b.autoPostedAt ? new Date(b.autoPostedAt).getTime() : 0;
            return dateB - dateA;
        });
    }, [autoPostedArticles, statusFilter, dateFilter]);

    const getStatusBadge = (status: AutoPostStatus) => {
        switch (status) {
            case AutoPostStatus.SUCCESS:
                return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">Sucesso</span>;
            case AutoPostStatus.ERROR:
                return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">Erro</span>;
            case AutoPostStatus.PENDING:
                return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">Pendente</span>;
            default:
                return null;
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary flex items-center">
                        <HistoryIcon className="w-8 h-8 mr-2 text-primary" />
                        Histórico de Auto-Posts
                    </h2>
                    <p className="text-text-secondary mt-1">Visualize todas as postagens automáticas enviadas do WordPress para as redes sociais.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                     <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                        className="bg-surface border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                    >
                        <option value="ALL">Todos os Status</option>
                        <option value={AutoPostStatus.SUCCESS}>Sucesso</option>
                        <option value={AutoPostStatus.ERROR}>Erro</option>
                    </select>

                    <select 
                        value={dateFilter} 
                        onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                        className="bg-surface border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                    >
                        <option value="ALL">Todo o Período</option>
                        <option value="THIS_MONTH">Este Mês</option>
                        <option value="LAST_MONTH">Mês Passado</option>
                    </select>
                </div>
            </div>

            <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-background/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Data</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Artigo (Wordpress)</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Destino</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-surface">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-text-secondary">
                                        Nenhum registro de postagem automática encontrado com os filtros selecionados.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((article) => (
                                    <tr key={article.id} className="hover:bg-background/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                            {article.autoPostedAt 
                                                ? new Date(article.autoPostedAt).toLocaleString('pt-BR')
                                                : <span className="italic">Processando...</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-text-primary line-clamp-1" title={article.title}>
                                                {article.title}
                                            </div>
                                            {article.originalLink && (
                                                <a href={article.originalLink} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                                                    Ver original
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                            {article.autoPostPlatform || 'Facebook'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {getStatusBadge(article.autoPostStatus || AutoPostStatus.NONE)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-background/30 px-6 py-3 border-t border-border flex items-center justify-between">
                     <span className="text-xs text-text-secondary">
                        Mostrando {filteredData.length} registros
                     </span>
                </div>
            </div>
        </div>
    );
};
