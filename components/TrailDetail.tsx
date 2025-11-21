
import React, { useState } from 'react';
import type { LearningTrail, Module, ModuleContent } from '../types';
import { ModuleContentType } from '../types';

interface TrailDetailProps {
    trail: LearningTrail;
    onBack: () => void;
}

const ModuleContentDisplay: React.FC<{ content: ModuleContent }> = ({ content }) => {
    switch (content.type) {
        case ModuleContentType.VIDEO:
            return (
                <div className="aspect-video my-4 rounded-lg overflow-hidden border border-border">
                    <iframe 
                        className="w-full h-full" 
                        src={content.url} 
                        title={content.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                    </iframe>
                </div>
            );
        case ModuleContentType.IMAGE:
             return (
                <div className="my-4">
                    <img src={content.url} alt={content.title} className="max-w-full h-auto rounded-lg border border-border" />
                </div>
             );
        case ModuleContentType.DOCUMENT:
            return (
                <a href={content.url} download={content.fileName} className="inline-flex items-center my-2 bg-primary/20 text-primary py-2 px-4 rounded-lg hover:bg-primary/30 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    {content.fileName}
                </a>
            );
        case ModuleContentType.TEXT:
            return <div className="prose prose-invert max-w-none my-2 text-text-secondary" dangerouslySetInnerHTML={{ __html: content.content || '' }} />;
        default:
            return null;
    }
}

const ModuleDisplay: React.FC<{ module: Module }> = ({ module }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-surface border border-border rounded-lg mb-4">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left">
                <h3 className="text-lg font-semibold text-text-primary">{module.title}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-border">
                    {module.content.map(c => <ModuleContentDisplay key={c.id} content={c} />)}
                </div>
            )}
        </div>
    )
}

export const TrailDetail: React.FC<TrailDetailProps> = ({ trail, onBack }) => {
    return (
        <div>
            <button onClick={onBack} className="flex items-center text-text-secondary hover:text-text-primary mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Voltar para Trilhas
            </button>

            <h2 className="text-3xl font-bold text-text-primary">{trail.title}</h2>
            <p className="text-text-secondary mt-2 mb-8">{trail.description}</p>
            
            <div>
                {trail.modules.length > 0 ? (
                    trail.modules.map(module => <ModuleDisplay key={module.id} module={module}/>)
                ) : (
                    <div className="text-center text-text-secondary py-10 bg-surface rounded-lg">
                        <p>Nenhum módulo foi adicionado a esta trilha ainda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
