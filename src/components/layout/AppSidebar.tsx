import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Sparkles,
  BookOpen,
  Library,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface AppSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Artigos', path: '/articles' },
  { icon: Calendar, label: 'Planner', path: '/planner' },
  { icon: Sparkles, label: 'IA Creator', path: '/ai-creator' },
  { icon: Library, label: 'Biblioteca', path: '/library' },
  { icon: BookOpen, label: 'Trilhas', path: '/learning' },
];

export const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onCollapse }) => {
  const { signOut } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => onCollapse(true)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 0 : 280 }}
        className={cn(
          'bg-card border-r border-border flex-shrink-0 flex flex-col fixed md:relative inset-y-0 left-0 z-50 overflow-hidden',
          collapsed && 'md:w-0'
        )}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Zenith</h1>
              <p className="text-xs text-muted-foreground">AI Platform</p>
            </div>
          </div>
          <button
            onClick={() => onCollapse(!collapsed)}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )
            }
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </NavLink>
          <button
            onClick={signOut}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-error hover:bg-error/10 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};
