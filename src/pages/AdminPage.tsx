import { useState, useEffect } from 'react';
import { Users, FileText, Star, TrendingUp, Shield, Activity, Clock, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/Loading';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { formatDate } from '../lib/utils';

export function AdminPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalFavorites: 0,
    recentUsers: [] as { id: string; email: string; full_name: string; created_at: string }[],
    recentProjects: [] as { id: string; title: string; created_at: string; user_id: string }[],
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [usersRes, projectsRes, favsRes, recentUsersRes, recentProjectsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('favorites').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id, email, full_name, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('projects').select('id, title, created_at, user_id').order('created_at', { ascending: false }).limit(10),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalProjects: projectsRes.count || 0,
        totalFavorites: favsRes.count || 0,
        recentUsers: (recentUsersRes.data as any[]) || [],
        recentProjects: (recentProjectsRes.data as any[]) || [],
      });
    } catch (e) {
      console.error('Admin stats error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card hover={false} className="p-12 text-center">
          <Shield className="w-12 h-12 text-error-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Access Denied</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">You need admin privileges to view this page.</p>
        </Card>
      </div>
    );
  }

  if (loading) return <LoadingSpinner size="lg" className="py-20" />;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Total Projects', value: stats.totalProjects, icon: FileText, color: 'text-accent-600 bg-accent-50 dark:bg-accent-900/20' },
    { label: 'Total Favorites', value: stats.totalFavorites, icon: Star, color: 'text-warning-600 bg-warning-50 dark:bg-warning-900/20' },
    { label: 'Avg Projects/User', value: stats.totalUsers > 0 ? (stats.totalProjects / stats.totalUsers).toFixed(1) : '0', icon: TrendingUp, color: 'text-success-600 bg-success-50 dark:bg-success-900/20' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="w-6 h-6 text-error-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Platform analytics and user management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} hover={false} className="p-5">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Activity chart placeholder */}
      <Card hover={false} className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary-500" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Platform Activity</h3>
        </div>
        <div className="flex items-end justify-between gap-2 h-40">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-accent-500 transition-all duration-500 hover:opacity-80"
                style={{ height: `${h}%`, animationDelay: `${i * 50}ms` }}
              />
              <span className="text-xs text-gray-400">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <Card hover={false} className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Users</h3>
          </div>
          <div className="space-y-2">
            {stats.recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {u.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{u.full_name || 'Unknown'}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(u.created_at)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent projects */}
        <Card hover={false} className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-accent-500" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Projects</h3>
          </div>
          <div className="space-y-2">
            {stats.recentProjects.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-accent-50 dark:bg-accent-900/20 flex items-center justify-center text-accent-600 dark:text-accent-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400">{formatDate(p.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
