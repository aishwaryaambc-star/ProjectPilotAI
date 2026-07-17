import { useState, useEffect, useMemo } from 'react';
import { Search, Star, Copy, Trash2, FileText, Download, Plus, Filter, Layers, Clock, TrendingUp, Sparkles, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { EmptyState, Skeleton } from '../components/ui/Loading';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import type { Project, Favorite } from '../types';
import { formatRelativeTime, exportMarkdown, downloadFile, exportPDF } from '../lib/utils';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onViewProject: (project: Project) => void;
}

export function DashboardPage({ onNavigate, onViewProject }: DashboardPageProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites' | 'recent'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: projs, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProjects((projs as Project[]) || []);

      const { data: favs } = await supabase
        .from('favorites')
        .select('project_id')
        .eq('user_id', user.id);
      setFavorites(new Set((favs as Favorite[])?.map((f) => f.project_id) || []));
    } catch (e) {
      toast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (projectId: string) => {
    if (!user) return;
    const isFav = favorites.has(projectId);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (isFav) next.delete(projectId);
      else next.add(projectId);
      return next;
    });

    try {
      let error;
      if (isFav) {
        ({ error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('project_id', projectId));
      } else {
        ({ error } = await supabase.from('favorites').insert({ user_id: user.id, project_id: projectId }));
      }
      if (error) throw error;
      toast(isFav ? 'Removed from favorites' : 'Added to favorites', isFav ? 'info' : 'success');
    } catch {
      toast('Failed to update favorite', 'error');
      setFavorites((prev) => {
        const next = new Set(prev);
        if (isFav) next.add(projectId);
        else next.delete(projectId);
        return next;
      });
    }
  };

  const duplicateProject = async (project: Project) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: `${project.title} (Copy)`,
          idea: project.idea,
          blueprint: project.blueprint,
          status: 'completed',
          tags: project.tags,
        });
      if (error) throw error;
      toast('Project duplicated successfully', 'success');
      loadProjects();
    } catch {
      toast('Failed to duplicate project', 'error');
    }
  };

  const deleteProject = async () => {
    if (!deleteTarget || !user) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      toast('Project deleted', 'success');
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      toast('Failed to delete project', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportMD = (project: Project) => {
    const md = exportMarkdown(project);
    downloadFile(`${project.title.replace(/\s+/g, '-').toLowerCase()}.md`, md, 'text/markdown');
    toast('Markdown exported', 'success');
  };

  const handleExportPDF = (project: Project) => {
    if (exportPDF(project)) {
      toast('PDF export opened in new window', 'success');
    } else {
      toast('Popup blocked. Please allow popups to export PDF.', 'error');
    }
  };

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (filter === 'favorites') result = result.filter((p) => favorites.has(p.id));
    if (filter === 'recent') result = result.slice(0, 6);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.idea.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [projects, favorites, filter, search]);

  const stats = useMemo(() => ({
    total: projects.length,
    favorites: favorites.size,
    thisMonth: projects.filter((p) => {
      const d = new Date(p.created_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
  }), [projects, favorites]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Developer'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your AI-generated project blueprints</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => onNavigate('generate')}>
          New Blueprint
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: stats.total, icon: Layers, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' },
          { label: 'Favorites', value: stats.favorites, icon: Star, color: 'text-warning-600 bg-warning-50 dark:bg-warning-900/20' },
          { label: 'This Month', value: stats.thisMonth, icon: TrendingUp, color: 'text-success-600 bg-success-50 dark:bg-success-900/20' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} hover={false} className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search projects by name, idea, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {(['all', 'favorites', 'recent'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} hover={false} className="p-5">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="w-10 h-10" />}
          title={search ? 'No projects found' : 'No projects yet'}
          description={search ? 'Try a different search term' : 'Generate your first AI project blueprint to get started'}
          action={
            !search && (
              <Button icon={<Plus className="w-4 h-4" />} onClick={() => onNavigate('generate')}>
                Create Your First Blueprint
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="p-5 group flex flex-col animate-fade-in-up">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">{project.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(project.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => toggleFavorite(project.id)}
                  className={`p-1.5 rounded-lg transition-all ${favorites.has(project.id) ? 'text-warning-500' : 'text-gray-300 dark:text-gray-600 hover:text-warning-500'}`}
                >
                  <Star className={`w-5 h-5 ${favorites.has(project.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 flex-1">{project.idea}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="default">{tag}</Badge>
                ))}
              </div>

              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="secondary" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => onViewProject(project)}>
                  View
                </Button>
                <Button size="sm" variant="ghost" icon={<Copy className="w-3.5 h-3.5" />} onClick={() => duplicateProject(project)} />
                <Button size="sm" variant="ghost" icon={<FileText className="w-3.5 h-3.5" />} onClick={() => handleExportMD(project)} />
                <Button size="sm" variant="ghost" icon={<Download className="w-3.5 h-3.5" />} onClick={() => handleExportPDF(project)} />
                <Button size="sm" variant="ghost" className="text-error-500 hover:text-error-600" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => setDeleteTarget(project)} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Project" size="sm">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete <strong className="text-gray-900 dark:text-gray-100">{deleteTarget?.title}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <Button variant="danger" className="flex-1" loading={deleting} onClick={deleteProject}>
            Delete
          </Button>
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
