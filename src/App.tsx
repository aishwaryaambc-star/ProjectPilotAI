import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { FullPageLoader } from './components/ui/Loading';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { GeneratePage } from './pages/GeneratePage';
import { BlueprintViewer } from './pages/BlueprintViewer';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AdminPage } from './pages/AdminPage';
import { supabase } from './lib/supabase';
import type { Project } from './types';

type Page = 'home' | 'features' | 'how-it-works' | 'pricing' | 'login' | 'signup' | 'dashboard' | 'generate' | 'blueprint' | 'profile' | 'notifications' | 'favorites' | 'admin';

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<Page>('home');
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleNavigate = useCallback((p: string) => {
    if ((p === 'dashboard' || p === 'generate' || p === 'profile' || p === 'notifications' || p === 'favorites' || p === 'admin' || p === 'blueprint') && !user) {
      setPage('login');
      return;
    }
    setPage(p as Page);
    if (p !== 'blueprint') setViewingProject(null);
    window.scrollTo(0, 0);
  }, [user]);

  // Load unread notification count
  useEffect(() => {
    if (!user) { setUnreadCount(0); return; }
    const loadCount = async () => {
      const { count } = await supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false);
      setUnreadCount(count || 0);
    };
    loadCount();
    const interval = setInterval(loadCount, 30000);
    return () => clearInterval(interval);
  }, [user, page]);

  // Redirect after auth
  useEffect(() => {
    if (loading) return;
    if (user && (page === 'login' || page === 'signup')) {
      setPage('dashboard');
    }
    if (!user && (page === 'dashboard' || page === 'generate' || page === 'profile' || page === 'notifications' || page === 'favorites' || page === 'admin')) {
      setPage('home');
    }
  }, [user, loading, page]);

  if (loading) return <FullPageLoader label="Loading ProjectPilot AI..." />;

  const handleGetStarted = () => {
    if (user) setPage('generate');
    else setPage('signup');
  };

  const handleViewProject = (project: Project) => {
    setViewingProject(project);
    setPage('blueprint');
    window.scrollTo(0, 0);
  };

  const handleProjectGenerated = (project: Project) => {
    setViewingProject(project);
    setPage('blueprint');
    setUnreadCount((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  // Auth pages — no nav/footer
  if (page === 'login' || page === 'signup') {
    return <AuthPage mode={page} onNavigate={handleNavigate} />;
  }

  // Blueprint viewer — full screen, no sidebar
  if (page === 'blueprint' && viewingProject) {
    return (
      <>
        <BlueprintViewer
          project={viewingProject}
          onBack={() => handleNavigate('dashboard')}
          onProjectDeleted={() => handleNavigate('dashboard')}
        />
      </>
    );
  }

  // App pages with sidebar
  if (page === 'dashboard' || page === 'generate' || page === 'profile' || page === 'notifications' || page === 'favorites' || page === 'admin') {
    return (
      <Sidebar currentPage={page} onNavigate={handleNavigate} notificationCount={unreadCount}>
        {page === 'dashboard' && <DashboardPage onNavigate={handleNavigate} onViewProject={handleViewProject} />}
        {page === 'generate' && <GeneratePage onProjectGenerated={handleProjectGenerated} />}
        {page === 'profile' && <ProfilePage onNavigate={handleNavigate} onViewProject={handleViewProject} />}
        {page === 'notifications' && <NotificationsPage />}
        {page === 'favorites' && <FavoritesPage onNavigate={handleNavigate} onViewProject={handleViewProject} />}
        {page === 'admin' && <AdminPage />}
      </Sidebar>
    );
  }

  // Landing page with nav/footer
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={handleNavigate} currentPage={page} />
      <main className="flex-1">
        <LandingPage onNavigate={handleNavigate} onGetStarted={handleGetStarted} />
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
