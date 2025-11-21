
import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../types';

interface ProfileProps {
    user: User;
    onSave: (updatedUser: User) => void;
}

const ProfileInput: React.FC<{label: string, id: string, value: string, onChange: (val: string) => void, type?: string, className?: string, placeholder?: string}> = ({ label, id, value, onChange, type = 'text', className = '', placeholder }) => (
    <div className={className}>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <input 
            type={type} 
            id={id} 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="bg-background border border-border text-text-primary sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 outline-none transition-all" 
        />
    </div>
);

export const Profile: React.FC<ProfileProps> = ({ user, onSave }) => {
    // Local state for the form to allow editing without immediately committing to global state
    const [formData, setFormData] = useState(user);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setFormData(prev => ({ ...prev, avatar: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-text-primary">Meu Perfil</h2>
            <p className="text-text-secondary mt-1 mb-6">Atualize suas informações pessoais e foto de perfil.</p>
            
            <div className="bg-surface border border-border rounded-lg p-6 shadow-lg max-w-4xl">
                {/* Hidden File Input for Image Upload */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    className="hidden" 
                />

                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 mb-8 p-6 bg-background rounded-lg border border-border">
                    <div 
                        className="relative group cursor-pointer"
                        onClick={triggerFileInput}
                        title="Clique para alterar a foto do dispositivo"
                    >
                        <img className="h-32 w-32 rounded-full object-cover ring-4 ring-surface" src={formData.avatar} alt="User avatar" />
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-text-primary">{formData.name}</h3>
                        <p className="text-text-secondary mb-3">{formData.role}</p>
                        <button 
                            type="button"
                            onClick={triggerFileInput}
                            className="text-sm bg-border hover:bg-gray-600 text-text-primary px-3 py-1.5 rounded-md transition-colors flex items-center mx-auto md:mx-0"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            Alterar Foto (Upload)
                        </button>
                        <p className="text-xs text-text-secondary mt-2">JPG ou PNG do seu dispositivo.</p>
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

                         {/* New Fields */}
                         <ProfileInput 
                            label="WhatsApp" 
                            id="whatsapp" 
                            value={formData.whatsapp || ''} 
                            onChange={(v) => handleInputChange('whatsapp', v)} 
                            placeholder="+55 11 99999-9999"
                        />

                         <ProfileInput 
                            label="Endereço Completo" 
                            id="address" 
                            value={formData.address || ''} 
                            onChange={(v) => handleInputChange('address', v)} 
                            // className="md:col-span-2" // Optional layout choice
                        />

                        <div className="md:col-span-2 border-t border-border mt-2 pt-4">
                            <h4 className="text-lg font-semibold text-text-primary mb-4">Redes Sociais</h4>
                        </div>

                        {/* Updated Social Fields */}
                        <ProfileInput 
                            label="Instagram (URL)" 
                            id="instagram" 
                            value={formData.socials.instagram || ''} 
                            onChange={(v) => handleInputChange('socials.instagram', v)} 
                            placeholder="instagram.com/seu-perfil"
                        />
                        <ProfileInput 
                            label="Facebook (URL)" 
                            id="facebook" 
                            value={formData.socials.facebook || ''} 
                            onChange={(v) => handleInputChange('socials.facebook', v)} 
                            placeholder="facebook.com/seu-perfil"
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
