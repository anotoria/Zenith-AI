import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Sparkles,
  BookmarkPlus,
  GraduationCap,
  Users,
  Settings,
  User,
  History,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface AppSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Artigos', path: '/articles' },
  { icon: Calendar, label: 'Planejador', path: '/planner' },
  { icon: Sparkles, label: 'AI Creator', path: '/ai-creator' },
  { icon: BookmarkPlus, label: 'Conteúdos Salvos', path: '/saved-content' },
  { icon: GraduationCap, label: 'Aprendizagem', path: '/learning' },
  { icon: History, label: 'Histórico', path: '/auto-posts' },
  { icon: Users, label: 'Usuários', path: '/users' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

export const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside
      className={cn(
        'bg-card border-r border-border h-screen sticky top-0 transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-xl font-bold text-primary">Synapse</h1>
        )}
        <button
          onClick={() => onCollapse(!collapsed)}
          className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className={cn('w-5 h-5 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => signOut()}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full',
            'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sair</span>}
        </button>
      </div>
    </aside>
  );
};
