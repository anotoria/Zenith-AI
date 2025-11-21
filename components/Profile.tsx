
import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface ProfileProps {
    user: User;
    onSave: (updatedUser: User) => void;
}

const ProfileInput: React.FC<{label: string, id: string, value: string, onChange: (val: string) => void, type?: string}> = ({ label, id, value, onChange, type = 'text' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <input 
            type={type} 
            id={id} 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="bg-background border border-border text-text-primary sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 outline-none transition-all" 
        />
    </div>
);

export const Profile: React.FC<ProfileProps> = ({ user, onSave }) => {
    // Local state for the form to allow editing without immediately committing to global state
    const [formData, setFormData] = useState(user);

    // Sync local state if user prop changes (e.g. refetch)
    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleInputChange = (field: keyof User | string, value: string) => {
        if (field.includes('.')) {
            // Handle nested social fields simple implementation
            const socialField = field.split('.')[1];
            setFormData(prev => ({
                ...prev,
                socials: { ...prev.socials, [socialField]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-text-primary">Meu Perfil</h2>
            <p className="text-text-secondary mt-1 mb-6">Atualize suas informações pessoais e foto de perfil.</p>
            
            <div className="bg-surface border border-border rounded-lg p-6 shadow-lg max-w-4xl">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 mb-8 p-6 bg-background rounded-lg border border-border">
                    <div className="relative group cursor-pointer">
                        <img className="h-32 w-32 rounded-full object-cover ring-4 ring-surface" src={formData.avatar} alt="User avatar" />
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-text-primary">{formData.name}</h3>
                        <p className="text-text-secondary mb-3">{formData.role}</p>
                        <button className="text-sm bg-border hover:bg-gray-600 text-text-primary px-3 py-1.5 rounded-md transition-colors">
                            Alterar Foto
                        </button>
                        <p className="text-xs text-text-secondary mt-2">JPG ou PNG, máx. 5MB.</p>
                    </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileInput 
                            label="Nome Completo" 
                            id="fullName" 
                            value={formData.name} 
                            onChange={(v) => handleInputChange('name', v)} 
                        />
                        <ProfileInput 
                            label="Email" 
                            id="email" 
                            value={formData.email} 
                            onChange={(v) => handleInputChange('email', v)} 
                            type="email" 
                        />
                        <ProfileInput 
                            label="Twitter (URL)" 
                            id="twitter" 
                            value={formData.socials.twitter || ''} 
                            onChange={(v) => handleInputChange('socials.twitter', v)} 
                        />
                        <ProfileInput 
                            label="LinkedIn (URL)" 
                            id="linkedin" 
                            value={formData.socials.linkedin || ''} 
                            onChange={(v) => handleInputChange('socials.linkedin', v)} 
                        />
                        <ProfileInput 
                            label="Website" 
                            id="website" 
                            value={formData.socials.website || ''} 
                            onChange={(v) => handleInputChange('socials.website', v)} 
                        />
                    </div>

                    <div className="mt-8 pt-6 border-t border-border flex justify-end">
                        <button 
                            type="submit"
                            className="bg-primary text-white font-bold py-2 px-8 rounded-lg hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 active:scale-95"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
