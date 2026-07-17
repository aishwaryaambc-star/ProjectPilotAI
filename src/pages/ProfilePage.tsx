import { useState, useEffect } from 'react';
import { User, Mail, Save, Shield, Calendar, Sparkles, Star, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import type { Project, Favorite } from '../types';
import { formatDate } from '../lib/utils';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  onViewProject: (project: Project) => void;
}

export function ProfilePage({ onNavigate, onViewProject }: ProfilePageProps) {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ projects: 0, favorites: 0, recentProjects: [] as Project[] });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: projs, error: projErr }, { data: favs, error: favErr }] = await Promise.all([
        supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('favorites').select('project_id').eq('user_id', user.id),
      ]);
      if (projErr) throw projErr;
      if (favErr) throw favErr;
      setStats({
        projects: (projs as Project[])?.length || 0,
        favorites: (favs as Favorite[])?.length || 0,
        recentProjects: (projs as Project[]) || [],
      });
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile({ full_name: fullName, bio });
      if (error) toast(error, 'error');
      else toast('Profile updated successfully', 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <LoadingSpinner size="lg" className="py-20" />;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Profile Settings</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Manage your account and preferences</p>

      {/* Profile header card */}
      <Card hover={false} className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {profile.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{profile.full_name || 'User'}</h2>
              {profile.role === 'admin' && <Badge variant="error"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Member since {formatDate(profile.created_at)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary-600 dark:text-primary-400">
              <FileText className="w-4 h-4" />
              <span className="text-2xl font-bold">{stats.projects}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Projects</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-warning-600 dark:text-warning-400">
              <Star className="w-4 h-4" />
              <span className="text-2xl font-bold">{stats.favorites}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Favorites</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-accent-600 dark:text-accent-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-2xl font-bold">∞</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Ideas</p>
          </div>
        </div>
      </Card>

      {/* Edit form */}
      <Card hover={false} className="p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Edit Profile</h3>
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User className="w-4 h-4" />}
            placeholder="Your full name"
          />
          <Input
            label="Email"
            value={profile.email}
            disabled
            icon={<Mail className="w-4 h-4" />}
            className="opacity-60"
          />
          <Textarea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell us about yourself..."
          />
          <div className="flex justify-end">
            <Button icon={<Save className="w-4 h-4" />} loading={saving} onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent projects */}
      {stats.recentProjects.length > 0 && (
        <Card hover={false} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Projects</h3>
            <Button size="sm" variant="ghost" onClick={() => onNavigate('dashboard')}>View All</Button>
          </div>
          <div className="space-y-2">
            {stats.recentProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => onViewProject(p)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all text-left"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400">{formatDate(p.created_at)}</p>
                </div>
                <div className="flex gap-1.5 shrink-0 ml-3">
                  {p.tags.slice(0, 2).map((t) => <Badge key={t}>{t}</Badge>)}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
