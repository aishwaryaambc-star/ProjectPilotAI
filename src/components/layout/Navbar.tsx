import { useState } from 'react';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const navLinks = [
    { label: 'Features', action: () => scrollToSection('features') },
    { label: 'How it Works', action: () => scrollToSection('how-it-works') },
    { label: 'Pricing', action: () => scrollToSection('pricing') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate(user ? 'dashboard' : 'home')}>
            <Logo />
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" icon={<LayoutDashboard className="w-4 h-4" />} onClick={() => onNavigate('dashboard')}>
                  Dashboard
                </Button>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={() => onNavigate('login')}>Log in</Button>
                <Button size="sm" onClick={() => onNavigate('signup')}>Get Started</Button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-fade-in-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => { link.action(); setMobileOpen(false); }}
                  className="px-4 py-2.5 text-left text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                {user ? (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => { onNavigate('dashboard'); setMobileOpen(false); }}>Dashboard</Button>
                    <Button size="sm" variant="ghost" onClick={() => { signOut(); setMobileOpen(false); }}>Sign out</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => { onNavigate('login'); setMobileOpen(false); }}>Log in</Button>
                    <Button size="sm" onClick={() => { onNavigate('signup'); setMobileOpen(false); }}>Get Started</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
