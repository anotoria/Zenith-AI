
import React from 'react';
import type { User } from '../types';

interface UserManagementProps {
    users: User[];
    onUpdatePermission: (userId: string, permission: keyof User['permissions']) => void;
    onToggleStatus: (userId: string) => void;
}

const Toggle: React.FC<{ checked: boolean, onChange: () => void, disabled?: boolean, activeColor?: string }> = ({ checked, onChange, disabled = false, activeColor = "bg-primary" }) => (
    <label className="relative inline-flex items-center cursor-pointer justify-center">
        <input 
            type="checkbox" 
            checked={checked} 
            onChange={onChange} 
            className="sr-only peer" 
            disabled={disabled} 
        />
        <div className={`w-9 h-5 bg-background border border-border rounded-full peer ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} peer-focus:ring-2 peer-focus:ring-primary/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:${activeColor} peer-checked:after:bg-white`}></div>
    </label>
);

export const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdatePermission, onToggleStatus }) => {
    return (
        <div>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Gestão de Usuários</h2>
                    <p className="text-text-secondary mt-1">Controle total de acesso, status e permissões.</p>
                </div>
                <div className="text-text-secondary text-sm">
                    Total: <span className="font-bold text-text-primary">{users.length}</span>
                </div>
            </div>
            
            <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-background/50">
                            <tr>
                                <th scope="col" className="px-4 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Usuário</th>
                                <th scope="col" className="px-4 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-4 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">Blog</th>
                                <th scope="col" className="px-4 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">Planner</th>
                                <th scope="col" className="px-4 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">Criador IA</th>
                                <th scope="col" className="px-4 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">Trilhas</th>
                                <th scope="col" className="px-4 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">Admin</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-surface">
                            {users.map(user => (
                                <tr key={user.id} className={`hover:bg-background/50 transition-colors ${!user.isActive ? 'opacity-60 bg-red-900/10' : ''}`}>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover ring-2 ring-border" src={user.avatar} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-text-primary flex items-center">
                                                    {user.name}
                                                    {user.role === 'Admin' && <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/20">ADM</span>}
                                                </div>
                                                <div className="text-xs text-text-secondary">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                        <Toggle 
                                            checked={user.isActive} 
                                            onChange={() => onToggleStatus(user.id)} 
                                            activeColor="bg-green-600"
                                            disabled={user.role === 'Admin' && users.filter(u => u.role === 'Admin' && u.isActive).length <= 1} // Prevent locking out last admin
                                        />
                                        <div className="text-[10px] mt-1 font-medium">{user.isActive ? <span className="text-green-400">Ativo</span> : <span className="text-red-400">Inativo</span>}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                        <Toggle 
                                            checked={user.permissions.canAccessArticles} 
                                            onChange={() => onUpdatePermission(user.id, 'canAccessArticles')} 
                                            disabled={!user.isActive}
                                        />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                        <Toggle 
                                            checked={user.permissions.canAccessPlanner} 
                                            onChange={() => onUpdatePermission(user.id, 'canAccessPlanner')} 
                                            disabled={!user.isActive}
                                        />
                                    </td>
                                     <td className="px-4 py-4 whitespace-nowrap text-center">
                                        <Toggle 
                                            checked={user.permissions.canAccessAICreator} 
                                            onChange={() => onUpdatePermission(user.id, 'canAccessAICreator')} 
                                            disabled={!user.isActive}
                                            activeColor="bg-purple-600"
                                        />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                        <Toggle 
                                            checked={user.permissions.canCreateTrails} 
                                            onChange={() => onUpdatePermission(user.id, 'canCreateTrails')} 
                                            disabled={!user.isActive}
                                        />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                        <Toggle 
                                            checked={user.permissions.canManageUsers} 
                                            onChange={() => onUpdatePermission(user.id, 'canManageUsers')} 
                                            disabled={user.role !== 'Admin' || !user.isActive} // Only allow toggling if user is active (logic choice)
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
