import { useState, useEffect } from 'react';
import { Star, Eye, FileText, Download, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { LoadingSpinner, EmptyState } from '../components/ui/Loading';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import type { Project, Favorite } from '../types';
import { formatRelativeTime, exportMarkdown, downloadFile, exportPDF } from '../lib/utils';

interface FavoritesPageProps {
  onNavigate: (page: string) => void;
  onViewProject: (project: Project) => void;
}

export function FavoritesPage({ onNavigate, onViewProject }: FavoritesPageProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: favs, error: favErr } = await supabase.from('favorites').select('project_id').eq('user_id', user.id);
      if (favErr) throw favErr;
      const favIds = (favs as Favorite[])?.map((f) => f.project_id) || [];
      if (favIds.length === 0) { setProjects([]); return; }
      const { data: projs, error: projErr } = await supabase.from('projects').select('*').in('id', favIds).order('created_at', { ascending: false });
      if (projErr) throw projErr;
      setProjects((projs as Project[]) || []);
    } catch (e) {
      console.error('Failed to load favorites:', e);
      toast('Failed to load favorites', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = search.trim()
    ? projects.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.idea.toLowerCase().includes(search.toLowerCase()))
    : projects;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Star className="w-6 h-6 text-warning-500 fill-current" />
            Favorites
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{projects.length} favorited projects</p>
        </div>
      </div>

      {projects.length > 0 && (
        <div className="mb-6">
          <Input placeholder="Search favorites..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
        </div>
      )}

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Star className="w-10 h-10" />}
          title={search ? 'No favorites found' : 'No favorites yet'}
          description={search ? 'Try a different search' : 'Star your favorite projects to find them quickly here'}
          action={!search && <Button onClick={() => onNavigate('dashboard')}>Browse Projects</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <Card key={project.id} className="p-5 group flex flex-col animate-fade-in-up">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate flex-1">{project.title}</h3>
                <Star className="w-5 h-5 text-warning-500 fill-current shrink-0 ml-2" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 flex-1">{project.idea}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}
              </div>
              <p className="text-xs text-gray-400 mb-3">{formatRelativeTime(project.created_at)}</p>
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="secondary" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => onViewProject(project)}>View</Button>
                <Button size="sm" variant="ghost" icon={<FileText className="w-3.5 h-3.5" />} onClick={() => { downloadFile(`${project.title.replace(/\s+/g, '-')}.md`, exportMarkdown(project), 'text/markdown'); toast('Exported', 'success'); }} />
                <Button size="sm" variant="ghost" icon={<Download className="w-3.5 h-3.5" />} onClick={() => { if (exportPDF(project)) toast('PDF export opened', 'success'); else toast('Popup blocked. Allow popups to export.', 'error'); }} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
