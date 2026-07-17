import { useState, type ReactNode } from 'react';
import { LayoutDashboard, Plus, Star, User, Bell, Shield, LogOut, X, Menu } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  notificationCount?: number;
  children?: ReactNode;
}

export function Sidebar({ currentPage, onNavigate, notificationCount = 0, children }: SidebarProps) {
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generate', label: 'New Blueprint', icon: Plus },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notificationCount > 0 ? notificationCount : undefined },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (profile?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: Shield });
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
        <button onClick={() => onNavigate('dashboard')}>
          <Logo />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {item.badge && <Badge variant="primary" size="sm">{item.badge}</Badge>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => { onNavigate('profile'); setMobileOpen(false); }}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{profile?.email}</p>
          </div>
        </button>
        <div className="flex items-center justify-between mt-2 px-1">
          <ThemeToggle />
          <button onClick={() => signOut()} className="p-2 rounded-lg text-gray-500 hover:text-error-600 dark:hover:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all" aria-label="Sign out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col z-30">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 animate-slide-in-left flex flex-col">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 z-10">
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Mobile top bar with menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 glass h-14 flex items-center justify-between px-4">
        <Logo size="sm" />
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        {children}
      </div>
    </>
  );
}
