
import React, { useState } from 'react';
import type { User, LearningTrail } from '../types';
import { TrailDetail } from './TrailDetail';
import { TrailEditor } from './TrailEditor';

interface LearningTrailsProps {
    currentUser: User;
    trails: LearningTrail[];
    onSaveTrail: (trail: LearningTrail) => void;
}

type ViewMode = 'list' | 'detail' | 'create' | 'edit';

export const LearningTrails: React.FC<LearningTrailsProps> = ({ currentUser, trails, onSaveTrail }) => {
    const [mode, setMode] = useState<ViewMode>('list');
    const [selectedTrail, setSelectedTrail] = useState<LearningTrail | null>(null);

    const availableTrails = trails.filter(trail => trail.isPublic || currentUser.permissions.canCreateTrails);

    const handleCreateClick = () => {
        setSelectedTrail(null);
        setMode('create');
    };

    const handleEditClick = (trail: LearningTrail, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedTrail(trail);
        setMode('edit');
    };

    const handleSave = (trail: LearningTrail) => {
        onSaveTrail(trail);
        setMode('list');
        setSelectedTrail(null);
    };

    const handleTrailClick = (trail: LearningTrail) => {
        setSelectedTrail(trail);
        setMode('detail');
    };

    if (mode === 'detail' && selectedTrail) {
        return <TrailDetail trail={selectedTrail} onBack={() => { setMode('list'); setSelectedTrail(null); }} />;
    }

    if ((mode === 'create' || mode === 'edit')) {
        return <TrailEditor trail={selectedTrail || undefined} onSave={handleSave} onCancel={() => setMode('list')} />;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Trilhas de Aprendizagem</h2>
                    <p className="text-text-secondary mt-1">Aprimore suas habilidades com nossos guias e tutoriais.</p>
                </div>
                {currentUser.permissions.canCreateTrails && (
                    <button 
                        onClick={handleCreateClick}
                        className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                    >
                        Criar Nova Trilha
                    </button>
                )}
            </div>
            
            {availableTrails.length === 0 ? (
                <div className="text-center py-12 bg-surface rounded-lg border border-border">
                    <p className="text-text-secondary">Nenhuma trilha disponível no momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableTrails.map(trail => (
                        <div key={trail.id} onClick={() => handleTrailClick(trail)} className="bg-surface rounded-lg border border-border overflow-hidden cursor-pointer group hover:shadow-xl transition-all relative">
                            <div className="aspect-video overflow-hidden">
                               <img src={trail.imageUrl} alt={trail.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                     {!trail.isPublic && <p className="text-xs font-bold uppercase text-yellow-400 mb-1 bg-yellow-400/10 px-2 py-0.5 rounded">Privado</p>}
                                     {/* Edit button only for admins/creators */}
                                     {currentUser.permissions.canCreateTrails && (
                                        <button 
                                            onClick={(e) => handleEditClick(trail, e)} 
                                            className="text-text-secondary hover:text-primary p-1"
                                            title="Editar Trilha"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                     )}
                                </div>
                                <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors">{trail.title}</h3>
                                <p className="text-sm text-text-secondary mt-1 line-clamp-2">{trail.description}</p>
                                <p className="text-xs text-text-secondary mt-3">{trail.modules.length} módulos</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
