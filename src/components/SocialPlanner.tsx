
import React, { useState, useMemo } from 'react';
import type { ScheduledPostUI, PlatformType, PostStatus } from '@/lib/types';

type PlannerView = 'calendar' | 'list';
type CalendarMode = 'month' | 'week';
type StatusFilter = 'All' | PostStatus;
type TimeFilter = 'All' | 'Month' | 'Week';

interface SocialPlannerProps {
    posts: ScheduledPostUI[];
    onAddPost: (post: ScheduledPostUI) => void;
    onUpdatePost: (post: ScheduledPostUI) => void;
}

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-surface border border-border sm:rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in rounded-t-2xl sm:rounded-b-lg">
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h3 className="text-lg sm:text-xl font-bold text-text-primary">{title}</h3>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                     {children}
                </div>
            </div>
        </div>
    );
};

export const SocialPlanner: React.FC<SocialPlannerProps> = ({ posts, onAddPost, onUpdatePost }) => {
    const [view, setView] = useState<PlannerView>('calendar');
    const [calendarMode, setCalendarMode] = useState<CalendarMode>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Filter States
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('All');

    // Form State
    const [editingPost, setEditingPost] = useState<ScheduledPostUI | null>(null);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostDate, setNewPostDate] = useState('');
    const [newPostTime, setNewPostTime] = useState('');
    const [newPostPlatform, setNewPostPlatform] = useState<PlatformType>('Facebook');
    const [newPostStatus, setNewPostStatus] = useState<PostStatus>('Scheduled');
    // Media State
    const [newPostMediaUrl, setNewPostMediaUrl] = useState('');
    const [newPostMediaType, setNewPostMediaType] = useState<'image' | 'video'>('image');

    // --- Helpers for Navigation ---
    const nextPeriod = () => {
        const newDate = new Date(currentDate);
        if (view === 'calendar' && calendarMode === 'week') {
            newDate.setDate(newDate.getDate() + 7);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const prevPeriod = () => {
        const newDate = new Date(currentDate);
        if (view === 'calendar' && calendarMode === 'week') {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setMonth(newDate.getMonth() - 1);
        }
        setCurrentDate(newDate);
    };

    const resetToToday = () => {
        setCurrentDate(new Date());
    };

    // --- List View Filtering & Sorting Logic ---
    const filteredAndSortedPosts = useMemo(() => {
        let result = [...posts];

        if (statusFilter !== 'All') {
            result = result.filter(p => p.status === statusFilter);
        }

        const now = new Date();
        if (timeFilter === 'Month') {
            result = result.filter(p => 
                p.scheduledAt.getMonth() === now.getMonth() && 
                p.scheduledAt.getFullYear() === now.getFullYear()
            );
        } else if (timeFilter === 'Week') {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            const endOfWeek = new Date(now);
            endOfWeek.setDate(now.getDate() + (6 - now.getDay()));
            result = result.filter(p => p.scheduledAt >= startOfWeek && p.scheduledAt <= endOfWeek);
        }

        result.sort((a, b) => {
            const score = (s: string) => {
                if (s === 'Error') return 0;
                if (s === 'Scheduled') return 1;
                if (s === 'Draft') return 2;
                return 3; 
            };
            
            if (score(a.status) !== score(b.status)) {
                return score(a.status) - score(b.status);
            }
            return a.scheduledAt.getTime() - b.scheduledAt.getTime();
        });

        return result;
    }, [posts, statusFilter, timeFilter]);


    // --- Form Handlers ---
    const resetForm = () => {
        setEditingPost(null);
        setNewPostContent('');
        setNewPostDate('');
        setNewPostTime('');
        setNewPostPlatform('Facebook');
        setNewPostStatus('Scheduled');
        setNewPostMediaUrl('');
        setNewPostMediaType('image');
        setIsModalOpen(false);
    };

    const handleOpenCreate = () => {
        setEditingPost(null);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setNewPostDate(tomorrow.toISOString().split('T')[0]);
        setNewPostTime('10:00');
        setNewPostPlatform('Facebook');
        setNewPostStatus('Scheduled');
        setNewPostMediaUrl('');
        setNewPostMediaType('image');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (post: ScheduledPostUI) => {
        setEditingPost(post);
        setNewPostContent(post.content);
        setNewPostDate(post.scheduledAt.toISOString().split('T')[0]);
        const hours = post.scheduledAt.getHours().toString().padStart(2, '0');
        const minutes = post.scheduledAt.getMinutes().toString().padStart(2, '0');
        setNewPostTime(`${hours}:${minutes}`);
        setNewPostPlatform(post.platform);
        setNewPostStatus(post.status);
        setNewPostMediaUrl(post.imageUrl || '');
        setNewPostMediaType(post.mediaType || 'image');
        setIsModalOpen(true);
    };

    const handleSavePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent || !newPostDate || !newPostTime) return;

        const scheduledAt = new Date(`${newPostDate}T${newPostTime}`);
        
        const commonData = {
            platform: newPostPlatform,
            content: newPostContent,
            scheduledAt: scheduledAt,
            status: newPostStatus,
            imageUrl: newPostMediaUrl || undefined,
            mediaType: newPostMediaUrl ? newPostMediaType : undefined,
        };

        if (editingPost) {
            const updatedPost: ScheduledPostUI = {
                ...editingPost,
                ...commonData,
            };
            onUpdatePost(updatedPost);
        } else {
            const newPost: ScheduledPostUI = {
                id: `manual-${Date.now()}`,
                articleId: 'manual',
                ...commonData,
            };
            onAddPost(newPost);
        }

        resetForm();
    };

    // --- Calendar Render Logic ---
    const getDaysForCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        if (calendarMode === 'week') {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const days = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(startOfWeek);
                d.setDate(startOfWeek.getDate() + i);
                days.push(d);
            }
            return { days, prefixEmptySlots: 0, totalDays: 7 };
        } else {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const days = [];
            for(let i = 1; i <= daysInMonth; i++) {
                days.push(new Date(year, month, i));
            }
            return { days, prefixEmptySlots: firstDayOfMonth, totalDays: daysInMonth };
        }
    };

    const renderCalendar = () => {
        const { days, prefixEmptySlots } = getDaysForCalendar();
        
        const calendarCells = [];
        
        if (calendarMode === 'month') {
            for (let i = 0; i < prefixEmptySlots; i++) {
                calendarCells.push(<div key={`empty-${i}`} className="h-20 sm:h-24 bg-background/30 border border-border/50 rounded-md hidden sm:block"></div>);
            }
        }

        days.forEach((date) => {
            const dayPosts = posts.filter(p => 
                p.scheduledAt.getDate() === date.getDate() && 
                p.scheduledAt.getMonth() === date.getMonth() && 
                p.scheduledAt.getFullYear() === date.getFullYear()
            );

            calendarCells.push(
                <div key={date.toISOString()} className={`min-h-[5rem] sm:min-h-[6rem] border border-border rounded-md bg-background p-1 relative overflow-hidden hover:border-primary transition-colors group flex flex-col ${dayPosts.some(p => p.status === 'Error') ? 'border-red-500/30' : ''}`}>
                    <div className="flex justify-between items-start">
                        <span className={`text-xs font-bold ml-1 ${date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() ? 'bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full' : 'text-text-secondary'}`}>{date.getDate()}</span>
                        {calendarMode === 'week' && <span className="text-[10px] text-text-secondary mr-1">{date.toLocaleDateString('pt-BR', { weekday: 'short' })}</span>}
                    </div>
                    <div className="mt-1 space-y-1 overflow-y-auto flex-1 pb-1 custom-scrollbar">
                        {dayPosts.map(post => (
                            <div 
                                key={post.id} 
                                onClick={(e) => { e.stopPropagation(); handleOpenEdit(post); }}
                                className={`text-[10px] p-1 rounded border truncate cursor-pointer transition-colors flex items-center gap-1
                                    ${post.status === 'Error' ? 'bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500 hover:text-white' : 
                                      post.status === 'Published' ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white' : 
                                      'bg-surface border-border text-text-primary hover:bg-primary hover:text-white'}`}
                                title={post.content}
                            >
                                {post.status === 'Error' && <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                                {post.mediaType === 'video' ? (
                                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                ) : (
                                     <span className="truncate font-medium hidden sm:inline">{post.scheduledAt.getHours()}:{post.scheduledAt.getMinutes().toString().padStart(2, '0')}</span>
                                )}
                                <span className="truncate">{post.platform}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        });

        return calendarCells;
    };

    const headerTitle = calendarMode === 'week' 
        ? `Semana de ${currentDate.toLocaleDateString('pt-BR')}`
        : currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    return (
        <div>
            {/* Top Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center bg-surface border border-border rounded-lg p-1 w-full sm:w-auto justify-between sm:justify-start">
                        <button onClick={prevPeriod} className="p-2 hover:bg-background rounded-md transition-colors">
                             <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button onClick={resetToToday} className="px-3 text-sm font-bold text-text-primary hover:text-primary transition-colors min-w-[120px] text-center capitalize">
                            {headerTitle}
                        </button>
                        <button onClick={nextPeriod} className="p-2 hover:bg-background rounded-md transition-colors">
                            <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                    {view === 'calendar' && (
                        <div className="bg-surface border border-border p-1 rounded-lg flex w-full sm:w-auto">
                            <button onClick={() => setCalendarMode('month')} className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-all ${calendarMode === 'month' ? 'bg-primary text-white shadow' : 'text-text-secondary hover:text-text-primary'}`}>Mês</button>
                            <button onClick={() => setCalendarMode('week')} className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-all ${calendarMode === 'week' ? 'bg-primary text-white shadow' : 'text-text-secondary hover:text-text-primary'}`}>Semana</button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto justify-end">
                    {view === 'list' && (
                        <div className="flex gap-2 w-full sm:w-auto">
                            <select 
                                value={timeFilter} 
                                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                                className="flex-1 sm:flex-none bg-surface border border-border text-text-secondary text-sm rounded-lg p-2 outline-none focus:border-primary"
                            >
                                <option value="All">Tudo</option>
                                <option value="Month">Mês</option>
                                <option value="Week">Semana</option>
                            </select>
                             <select 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                                className="flex-1 sm:flex-none bg-surface border border-border text-text-secondary text-sm rounded-lg p-2 outline-none focus:border-primary"
                            >
                                <option value="All">Status</option>
                                <option value="Scheduled">Agendado</option>
                                <option value="Draft">Rascunho</option>
                                <option value="Published">Publicado</option>
                                <option value="Error">Erro</option>
                            </select>
                        </div>
                    )}

                     <div className="bg-surface border border-border p-1 rounded-lg flex w-full sm:w-auto justify-center">
                        <button onClick={() => setView('calendar')} className={`flex-1 sm:flex-none px-4 sm:px-3 py-1.5 text-sm font-medium rounded-md transition-all flex justify-center ${view === 'calendar' ? 'bg-primary text-white shadow' : 'text-text-secondary hover:text-text-primary'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </button>
                        <button onClick={() => setView('list')} className={`flex-1 sm:flex-none px-4 sm:px-3 py-1.5 text-sm font-medium rounded-md transition-all flex justify-center ${view === 'list' ? 'bg-primary text-white shadow' : 'text-text-secondary hover:text-text-primary'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>

                     <button onClick={handleOpenCreate} className="w-full sm:w-auto bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Criar Post
                    </button>
                </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4 sm:p-6 shadow-lg">
                {view === 'list' && (
                    <div className="space-y-4">
                        {filteredAndSortedPosts.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-text-secondary text-lg">Nenhuma postagem encontrada com os filtros atuais.</p>
                                <button onClick={handleOpenCreate} className="text-primary hover:underline mt-2">Criar nova postagem</button>
                            </div>
                        )}
                        {filteredAndSortedPosts.map(post => (
                            <div key={post.id} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-background rounded-lg hover:bg-surface border transition-all group ${post.status === 'Error' ? 'border-red-500/50 bg-red-900/5' : 'border-transparent hover:border-border'}`}>
                                <div className="flex items-center space-x-4 mb-3 md:mb-0 w-full md:w-auto">
                                     <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-surface rounded-md border border-border overflow-hidden flex items-center justify-center">
                                         {post.imageUrl ? (
                                            post.mediaType === 'video' ? (
                                                <video src={post.imageUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={post.imageUrl} alt="Visual do post" className="w-full h-full object-cover" />
                                            )
                                         ) : (
                                             <span className="text-[10px] text-text-secondary p-1 text-center">Sem Mídia</span>
                                         )}
                                     </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center flex-wrap gap-2">
                                            <span className="font-bold text-text-primary text-sm uppercase tracking-wide">{post.platform}</span>
                                            
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap
                                                ${post.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-400' : 
                                                  post.status === 'Published' ? 'bg-green-500/20 text-green-400' : 
                                                  post.status === 'Error' ? 'bg-red-500/20 text-red-400 font-bold' :
                                                  'bg-gray-500/20 text-gray-400'}`}>
                                                {post.status === 'Error' ? 'Erro no envio' : post.status}
                                            </span>

                                            {post.mediaType === 'video' && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Vídeo</span>}
                                        </div>
                                        <p className="text-sm text-text-secondary line-clamp-2 max-w-md mt-1">{post.content}</p>
                                        {post.status === 'Error' && post.errorMessage && (
                                            <p className="text-xs text-red-400 mt-1">Motivo: {post.errorMessage}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full md:w-auto md:justify-end mt-2 md:mt-0 space-x-4">
                                    <div className="text-left md:text-right">
                                         <p className="text-sm font-medium text-text-primary">{post.scheduledAt.toLocaleDateString('pt-BR')}</p>
                                         <p className="text-xs text-text-secondary">{post.scheduledAt.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleOpenEdit(post)}
                                        className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                                        title="Editar Post"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {view === 'calendar' && (
                    <div className="animate-fade-in">
                         <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-2">
                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                                <div key={day} className="font-semibold text-text-secondary text-[10px] sm:text-xs uppercase tracking-wider">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 sm:gap-2">
                            {renderCalendar()}
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Post Modal */}
            <Modal isOpen={isModalOpen} onClose={resetForm} title={editingPost ? "Editar Agendamento" : "Novo Agendamento"}>
                <form onSubmit={handleSavePost} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Plataforma</label>
                            <select 
                                value={newPostPlatform} 
                                onChange={(e) => setNewPostPlatform(e.target.value as any)}
                                className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="Facebook">Facebook</option>
                                <option value="Instagram">Instagram</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="TikTok">TikTok</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                            <select 
                                value={newPostStatus} 
                                onChange={(e) => setNewPostStatus(e.target.value as any)}
                                className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="Scheduled">Agendado</option>
                                <option value="Draft">Rascunho</option>
                                <option value="Published">Publicado</option>
                                <option value="Error">Erro</option>
                            </select>
                        </div>
                    </div>
                   
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Conteúdo / Legenda</label>
                        <textarea 
                            value={newPostContent} 
                            onChange={(e) => setNewPostContent(e.target.value)}
                            className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 h-24 resize-none focus:ring-2 focus:ring-primary outline-none"
                            placeholder="O que você quer postar?"
                        ></textarea>
                    </div>

                    {/* Media Section */}
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <label className="block text-sm font-bold text-text-secondary mb-2">Mídia (Imagem ou Vídeo)</label>
                        
                        <div className="flex flex-col sm:flex-row gap-2 mb-3">
                            <select 
                                value={newPostMediaType}
                                onChange={(e) => setNewPostMediaType(e.target.value as 'image' | 'video')}
                                className="bg-surface border border-border text-text-primary text-sm rounded-lg p-2 outline-none"
                            >
                                <option value="image">Imagem</option>
                                <option value="video">Vídeo</option>
                            </select>
                            <input 
                                type="text"
                                value={newPostMediaUrl}
                                onChange={(e) => setNewPostMediaUrl(e.target.value)}
                                placeholder="URL da mídia..."
                                className="flex-1 bg-surface border border-border text-text-primary text-sm rounded-lg p-2 outline-none"
                            />
                        </div>

                        {newPostMediaUrl ? (
                            <div className="relative mt-2 rounded-lg overflow-hidden bg-black/20 flex justify-center border border-border">
                                {newPostMediaType === 'image' ? (
                                    <img src={newPostMediaUrl} alt="Preview" className="max-h-48 object-contain" />
                                ) : (
                                    <video src={newPostMediaUrl} controls className="max-h-48 w-full" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => setNewPostMediaUrl('')}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-lg"
                                    title="Remover mídia"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-4 border-2 border-dashed border-border rounded-lg text-text-secondary text-sm">
                                Nenhuma mídia selecionada
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Data</label>
                            <input 
                                type="date" 
                                value={newPostDate}
                                onChange={(e) => setNewPostDate(e.target.value)}
                                className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Hora</label>
                            <input 
                                type="time" 
                                value={newPostTime}
                                onChange={(e) => setNewPostTime(e.target.value)}
                                className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end space-x-3 border-t border-border mt-4">
                        <button type="button" onClick={resetForm} className="px-4 py-2 text-text-secondary hover:text-text-primary font-medium transition-colors">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-bold transition-colors">
                            {editingPost ? 'Salvar' : 'Agendar'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
