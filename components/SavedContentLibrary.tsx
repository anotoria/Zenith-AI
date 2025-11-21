
import React, { useState, useMemo } from 'react';
import type { SavedItem, User } from '../types';
import { SavedItemType } from '../types';

interface SavedContentLibraryProps {
    currentUser: User;
    savedItems: SavedItem[];
}

type FilterType = 'ALL' | SavedItemType;
type FilterDate = 'ALL' | 'THIS_MONTH' | 'LAST_MONTH';

export const SavedContentLibrary: React.FC<SavedContentLibraryProps> = ({ currentUser, savedItems }) => {
    const [filterType, setFilterType] = useState<FilterType>('ALL');
    const [filterDate, setFilterDate] = useState<FilterDate>('ALL');

    const filteredItems = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return savedItems
            .filter(item => item.userId === currentUser.id) // Isolation by user
            .filter(item => filterType === 'ALL' || item.type === filterType)
            .filter(item => {
                if (filterDate === 'ALL') return true;
                
                const itemDate = new Date(item.createdAt);
                if (filterDate === 'THIS_MONTH') {
                    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
                }
                if (filterDate === 'LAST_MONTH') {
                    const lastMonthDate = new Date(now);
                    lastMonthDate.setMonth(now.getMonth() - 1);
                    return itemDate.getMonth() === lastMonthDate.getMonth() && itemDate.getFullYear() === lastMonthDate.getFullYear();
                }
                return true;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [savedItems, currentUser.id, filterType, filterDate]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copiado para a área de transferência!");
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Minha Biblioteca</h2>
                    <p className="text-text-secondary mt-1 text-sm md:text-base">Seus conteúdos gerados por IA, salvos e organizados.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <select 
                        value={filterType} 
                        onChange={(e) => setFilterType(e.target.value as FilterType)}
                        className="bg-surface border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none flex-1 lg:flex-none"
                    >
                        <option value="ALL">Todos os Tipos</option>
                        <option value={SavedItemType.IMAGE}>Imagens</option>
                        <option value={SavedItemType.VIDEO}>Vídeos</option>
                        <option value={SavedItemType.COPY}>Copys/Texto</option>
                    </select>

                    <select 
                        value={filterDate} 
                        onChange={(e) => setFilterDate(e.target.value as FilterDate)}
                        className="bg-surface border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none flex-1 lg:flex-none"
                    >
                        <option value="ALL">Todo Período</option>
                        <option value="THIS_MONTH">Este Mês</option>
                        <option value="LAST_MONTH">Mês Passado</option>
                    </select>
                </div>
            </div>

            {filteredItems.length === 0 ? (
                <div className="text-center py-16 bg-surface border border-border rounded-lg">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background border border-border flex items-center justify-center">
                        <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <h3 className="text-lg font-medium text-text-primary">Nenhum item encontrado</h3>
                    <p className="text-text-secondary mt-1">Você ainda não salvou nenhum conteúdo ou os filtros não correspondem.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map(item => (
                        <div key={item.id} className="bg-surface border border-border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group flex flex-col h-full">
                            {/* Media Display */}
                            <div className="relative aspect-square bg-background border-b border-border overflow-hidden">
                                {item.type === SavedItemType.IMAGE && (
                                    <img src={item.content} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                )}
                                {item.type === SavedItemType.VIDEO && (
                                    <video src={item.content} controls className="w-full h-full object-cover" />
                                )}
                                {item.type === SavedItemType.COPY && (
                                    <div className="p-6 h-full flex flex-col">
                                        <div className="flex-1 overflow-y-auto custom-scrollbar text-sm text-text-primary whitespace-pre-wrap italic">
                                            "{item.content}"
                                        </div>
                                    </div>
                                )}
                                
                                {/* Type Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm ${
                                        item.type === SavedItemType.IMAGE ? 'bg-purple-600 text-white' :
                                        item.type === SavedItemType.VIDEO ? 'bg-red-600 text-white' :
                                        'bg-blue-600 text-white'
                                    }`}>
                                        {item.type === SavedItemType.IMAGE ? 'Imagem' : item.type === SavedItemType.VIDEO ? 'Vídeo' : 'Copy'}
                                    </span>
                                </div>
                            </div>

                            {/* Content Info */}
                            <div className="p-4 flex flex-col flex-1">
                                <div className="mb-3 flex-1">
                                    <p className="text-xs text-text-secondary mb-1">
                                        {new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </p>
                                    <p className="text-sm font-medium text-text-primary line-clamp-2" title={item.prompt}>
                                        <span className="text-text-secondary">Prompt:</span> {item.prompt}
                                    </p>
                                    {item.description && (
                                        <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                                            {item.description}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                                    {item.type === SavedItemType.COPY ? (
                                        <button onClick={() => copyToClipboard(item.content)} className="flex-1 bg-background hover:bg-border border border-border text-text-primary text-xs font-bold py-2 rounded transition-colors">
                                            Copiar Texto
                                        </button>
                                    ) : (
                                        <a href={item.content} download className="flex-1 bg-background hover:bg-border border border-border text-text-primary text-xs font-bold py-2 rounded transition-colors text-center">
                                            Download
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
