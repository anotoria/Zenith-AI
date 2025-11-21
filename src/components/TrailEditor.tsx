
import React, { useState, useEffect } from 'react';
import type { LearningTrail, Module, ModuleContent } from '../types';
import { ModuleContentType } from '../types';

interface TrailEditorProps {
    trail?: LearningTrail; // If undefined, it's a new trail
    onSave: (trail: LearningTrail) => void;
    onCancel: () => void;
}

export const TrailEditor: React.FC<TrailEditorProps> = ({ trail, onSave, onCancel }) => {
    const [title, setTitle] = useState(trail?.title || '');
    const [description, setDescription] = useState(trail?.description || '');
    const [imageUrl, setImageUrl] = useState(trail?.imageUrl || '');
    const [isPublic, setIsPublic] = useState(trail?.isPublic ?? false);
    
    // Initialize modules. If trail exists, deep copy modules to avoid mutating parent state directly during edits.
    const [modules, setModules] = useState<Module[]>(
        trail ? JSON.parse(JSON.stringify(trail.modules)) : []
    );

    // Effect to update state if the 'trail' prop changes (e.g., switching from Create to Edit)
    useEffect(() => {
        if (trail) {
            setTitle(trail.title);
            setDescription(trail.description);
            setImageUrl(trail.imageUrl);
            setIsPublic(trail.isPublic);
            setModules(JSON.parse(JSON.stringify(trail.modules)));
        } else {
            // Reset if switching to Create mode
            setTitle('');
            setDescription('');
            setImageUrl('');
            setIsPublic(false);
            setModules([]);
        }
    }, [trail]);

    // Generate ID helpers
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const handleAddModule = () => {
        const newModule: Module = {
            id: `mod-${generateId()}`,
            title: 'Novo Módulo',
            content: []
        };
        setModules([...modules, newModule]);
    };

    const handleUpdateModuleTitle = (id: string, newTitle: string) => {
        setModules(modules.map(m => m.id === id ? { ...m, title: newTitle } : m));
    };

    const handleDeleteModule = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este módulo e todo o seu conteúdo?")) {
            setModules(modules.filter(m => m.id !== id));
        }
    };

    const handleAddContent = (moduleId: string, type: ModuleContentType) => {
        const newContent: ModuleContent = {
            id: `cnt-${generateId()}`,
            type,
            title: type === ModuleContentType.TEXT ? 'Texto Explicativo' : 'Novo Conteúdo',
            url: '',
            content: '', // for text
            fileName: '' // for doc
        };

        setModules(modules.map(m => 
            m.id === moduleId ? { ...m, content: [...m.content, newContent] } : m
        ));
    };

    const handleUpdateContent = (moduleId: string, contentId: string, field: keyof ModuleContent, value: string) => {
        setModules(modules.map(m => {
            if (m.id !== moduleId) return m;
            return {
                ...m,
                content: m.content.map(c => c.id === contentId ? { ...c, [field]: value } : c)
            };
        }));
    };

    const handleDeleteContent = (moduleId: string, contentId: string) => {
        setModules(modules.map(m => {
            if (m.id !== moduleId) return m;
            return {
                ...m,
                content: m.content.filter(c => c.id !== contentId)
            };
        }));
    };

    const handleSave = () => {
        if (!title) return alert("O título é obrigatório.");

        const newTrail: LearningTrail = {
            id: trail?.id || `trail-${generateId()}`,
            title,
            description,
            imageUrl: imageUrl || 'https://picsum.photos/seed/new/600/400',
            isPublic,
            modules
        };
        onSave(newTrail);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-border pb-4">
                <h2 className="text-2xl font-bold text-text-primary">{trail ? 'Editar Trilha' : 'Criar Nova Trilha'}</h2>
                <div className="space-x-3">
                    <button onClick={onCancel} className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-bold transition-colors shadow-lg shadow-primary/20">Salvar Trilha</button>
                </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface p-6 rounded-lg border border-border">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Título da Trilha</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-background border border-border text-text-primary rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Ex: Marketing Digital 101" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Descrição</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-background border border-border text-text-primary rounded-lg p-2 h-24 resize-none focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Sobre o que é esta trilha?" />
                    </div>
                     <div className="flex items-center pt-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-background border border-border rounded-full peer peer-focus:ring-4 peer-focus:ring-primary/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-text-secondary after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-white"></div>
                            <span className="ml-3 text-sm font-medium text-text-primary">Trilha Pública (visível para todos)</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">URL da Imagem de Capa</label>
                    <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-background border border-border text-text-primary rounded-lg p-2 mb-2 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="https://..." />
                    <div className="aspect-video rounded-lg overflow-hidden bg-background border border-border flex items-center justify-center">
                        {imageUrl ? <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-text-secondary text-sm">Pré-visualização da capa</span>}
                    </div>
                </div>
            </div>

            {/* Modules Management */}
            <div className="space-y-4">
                <div className="flex justify-between items-center pt-4 border-t border-border">
                    <h3 className="text-xl font-bold text-text-primary">Módulos e Conteúdo</h3>
                    <button onClick={handleAddModule} className="text-sm bg-secondary text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors flex items-center shadow-lg shadow-green-500/20">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Adicionar Módulo
                    </button>
                </div>

                {modules.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-border rounded-lg text-text-secondary bg-surface/50">
                        Nenhum módulo criado. Comece adicionando um módulo!
                    </div>
                )}

                {modules.map((module, index) => (
                    <div key={module.id} className="bg-surface border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <div className="bg-background/50 p-4 flex justify-between items-center border-b border-border">
                            <div className="flex items-center flex-1 mr-4">
                                <span className="text-text-secondary font-bold mr-3">#{index + 1}</span>
                                <input 
                                    type="text" 
                                    value={module.title} 
                                    onChange={(e) => handleUpdateModuleTitle(module.id, e.target.value)}
                                    className="bg-transparent text-text-primary font-bold text-lg outline-none border-b border-transparent focus:border-primary w-full transition-colors"
                                    placeholder="Nome do Módulo"
                                />
                            </div>
                            <button onClick={() => handleDeleteModule(module.id)} className="text-text-secondary hover:text-red-500 transition-colors p-1" title="Excluir Módulo">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Content List */}
                            {module.content.map(content => (
                                <div key={content.id} className="flex flex-col gap-2 p-4 bg-background rounded border border-border relative group hover:border-primary/30 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <span className={`text-[10px] font-bold uppercase mb-1 block px-2 py-0.5 rounded w-fit ${
                                            content.type === ModuleContentType.VIDEO ? 'bg-blue-500/10 text-blue-400' :
                                            content.type === ModuleContentType.IMAGE ? 'bg-purple-500/10 text-purple-400' :
                                            content.type === ModuleContentType.DOCUMENT ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-gray-500/10 text-gray-400'
                                        }`}>{content.type}</span>
                                        <button onClick={() => handleDeleteContent(module.id, content.id)} className="text-text-secondary hover:text-red-400 transition-colors" title="Remover Conteúdo">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs text-text-secondary mb-1">Título</label>
                                        <input 
                                            type="text" 
                                            value={content.title} 
                                            onChange={(e) => handleUpdateContent(module.id, content.id, 'title', e.target.value)}
                                            className="bg-surface border border-border text-text-primary text-sm rounded px-2 py-1 w-full focus:border-primary outline-none"
                                            placeholder="Título do conteúdo"
                                        />
                                    </div>

                                    {content.type === ModuleContentType.TEXT ? (
                                        <div>
                                            <label className="block text-xs text-text-secondary mb-1">Texto (HTML permitido)</label>
                                            <textarea
                                                value={content.content}
                                                onChange={(e) => handleUpdateContent(module.id, content.id, 'content', e.target.value)}
                                                className="bg-surface border border-border text-text-secondary text-sm rounded px-2 py-1 w-full h-24 resize-y focus:border-primary outline-none"
                                                placeholder="Escreva seu texto explicativo aqui..."
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-xs text-text-secondary mb-1">URL {content.type === ModuleContentType.VIDEO ? '(Youtube/Vimeo)' : ''}</label>
                                            <input 
                                                type="text" 
                                                value={content.url} 
                                                onChange={(e) => handleUpdateContent(module.id, content.id, 'url', e.target.value)}
                                                className="bg-surface border border-border text-text-secondary text-sm rounded px-2 py-1 w-full focus:border-primary outline-none"
                                                placeholder={content.type === ModuleContentType.VIDEO ? "https://www.youtube.com/watch?v=..." : "https://..."}
                                            />
                                        </div>
                                    )}
                                    
                                    {content.type === ModuleContentType.DOCUMENT && (
                                         <div>
                                            <label className="block text-xs text-text-secondary mb-1">Nome do Arquivo</label>
                                            <input 
                                                type="text" 
                                                value={content.fileName} 
                                                onChange={(e) => handleUpdateContent(module.id, content.id, 'fileName', e.target.value)}
                                                className="bg-surface border border-border text-text-secondary text-sm rounded px-2 py-1 w-full focus:border-primary outline-none"
                                                placeholder="Ex: apostila.pdf"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Add Content Buttons */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                <button onClick={() => handleAddContent(module.id, ModuleContentType.VIDEO)} className="text-xs bg-surface hover:bg-primary hover:text-white border border-border hover:border-primary text-text-secondary px-3 py-1.5 rounded-full transition-all flex items-center">
                                    + Vídeo
                                </button>
                                <button onClick={() => handleAddContent(module.id, ModuleContentType.IMAGE)} className="text-xs bg-surface hover:bg-primary hover:text-white border border-border hover:border-primary text-text-secondary px-3 py-1.5 rounded-full transition-all flex items-center">
                                    + Imagem
                                </button>
                                <button onClick={() => handleAddContent(module.id, ModuleContentType.TEXT)} className="text-xs bg-surface hover:bg-primary hover:text-white border border-border hover:border-primary text-text-secondary px-3 py-1.5 rounded-full transition-all flex items-center">
                                    + Texto
                                </button>
                                <button onClick={() => handleAddContent(module.id, ModuleContentType.DOCUMENT)} className="text-xs bg-surface hover:bg-primary hover:text-white border border-border hover:border-primary text-text-secondary px-3 py-1.5 rounded-full transition-all flex items-center">
                                    + Arquivo
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
