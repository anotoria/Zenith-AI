import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface AppHeaderProps {
  onMenuClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick }) => {
  const { profile } = useProfile();

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="md:hidden text-muted-foreground hover:text-foreground p-2 -ml-2"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center space-x-4">
        <button className="text-muted-foreground hover:text-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-border">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">
              {profile?.name || 'Usuário'}
            </p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
