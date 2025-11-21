
import React from 'react';
import type { View } from '../App';
import type { User } from '../types';
import { Role } from '../types';
import { DashboardIcon, ArticleIcon, PlannerIcon, LearningIcon, UsersIcon, SettingsIcon, LogoutIcon, SparklesIcon, MagicWandIcon, LibraryIcon, HistoryIcon } from './icons/Icon';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  currentUser: User;
  isMobileOpen: boolean;
  closeMobileMenu: () => void;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  view: View;
  currentView: View;
  setView: (view: View) => void;
}> = ({ icon: Icon, label, view, currentView, setView }) => {
  const isActive = currentView === view;
  return (
    <li>
      <button
        onClick={() => setView(view)}
        className={`flex items-center p-3 my-1 w-full text-sm rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-primary text-white shadow-lg'
            : 'text-text-secondary hover:bg-surface hover:text-text-primary'
        }`}
      >
        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
        <span className="font-medium truncate">{label}</span>
      </button>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, currentUser, isMobileOpen, closeMobileMenu }) => {
  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      />

      {/* Sidebar Content */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-50 w-64 bg-surface flex-shrink-0 p-4 border-r border-border flex flex-col transition-transform duration-300 ease-in-out transform
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center">
             <SparklesIcon className="w-8 h-8 text-primary" />
             <h1 className="text-xl font-bold ml-2 text-text-primary">Zenith</h1>
          </div>
          {/* Mobile Close Button */}
          <button onClick={closeMobileMenu} className="md:hidden text-text-secondary hover:text-text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          <ul>
            <NavItem icon={DashboardIcon} label="Dashboard" view="dashboard" currentView={currentView} setView={setView} />
            
            {currentUser.permissions.canAccessArticles && (
              <NavItem icon={ArticleIcon} label="Artigos do Blog" view="articles" currentView={currentView} setView={setView} />
            )}
            
            {currentUser.permissions.canAccessPlanner && (
              <NavItem icon={PlannerIcon} label="Social Planner" view="planner" currentView={currentView} setView={setView} />
            )}

            {currentUser.permissions.canAccessAICreator && (
               <NavItem icon={MagicWandIcon} label="Criando com IA" view="ai-creator" currentView={currentView} setView={setView} />
            )}

            <NavItem icon={LibraryIcon} label="Minha Biblioteca" view="saved-content" currentView={currentView} setView={setView} />
            
            <NavItem icon={HistoryIcon} label="Histórico de Auto-Posts" view="auto-posts" currentView={currentView} setView={setView} />

            <NavItem icon={LearningIcon} label="Trilhas de Aprendizagem" view="learning" currentView={currentView} setView={setView} />
            
            {currentUser.role === Role.ADMIN && currentUser.permissions.canManageUsers && (
              <NavItem icon={UsersIcon} label="Gestão de Usuários" view="users" currentView={currentView} setView={setView} />
            )}
          </ul>
        </nav>
        
        <div className="pt-4 mt-2 border-t border-border">
          <ul>
            <NavItem icon={SettingsIcon} label="Configurações" view="settings" currentView={currentView} setView={setView} />
             <li>
               <button className="flex items-center p-3 my-1 w-full text-sm rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary transition-colors duration-200">
                  <LogoutIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="font-medium">Sair</span>
               </button>
             </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
