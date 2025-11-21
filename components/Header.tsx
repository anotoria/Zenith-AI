
import React, { useState } from 'react';
import type { User } from '../types';
import type { View } from '../App';
import { Role } from '../types';
import { SettingsIcon, LogoutIcon } from './icons/Icon';

interface HeaderProps {
  user: User;
  setView: (view: View) => void;
  toggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, setView, toggleMobileMenu }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-surface p-4 border-b border-border flex justify-between md:justify-end items-center">
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMobileMenu}
        className="md:hidden text-text-secondary hover:text-text-primary p-1 rounded-md hover:bg-background"
      >
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>

      <div className="relative">
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-3 focus:outline-none">
          <img className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover border border-border" src={user.avatar} alt="User avatar" />
          <div className="text-left hidden md:block">
            <p className="font-semibold text-text-primary text-sm">{user.name}</p>
            <p className="text-xs text-text-secondary">{user.role}</p>
          </div>
          <svg className="w-4 h-4 text-text-secondary hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        
        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg py-1 border border-border z-20 animate-fade-in">
              <div className="md:hidden px-4 py-2 border-b border-border mb-1">
                <p className="text-sm font-bold text-text-primary">{user.name}</p>
                <p className="text-xs text-text-secondary">{user.role}</p>
              </div>
              <button
                onClick={() => { setView('profile'); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background transition-colors"
              >
                Meu Perfil
              </button>
               <button
                onClick={() => { setView('settings'); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background flex items-center transition-colors"
              >
                <SettingsIcon className="w-4 h-4 mr-2" /> Configurações
              </button>
              <div className="border-t border-border my-1"></div>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-background flex items-center transition-colors"
              >
               <LogoutIcon className="w-4 h-4 mr-2" /> Sair
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
