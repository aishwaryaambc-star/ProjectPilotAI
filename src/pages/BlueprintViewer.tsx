import { useState, useEffect } from 'react';
import {
  ArrowLeft, FileText, Download, Copy, Trash2, Star, Layers, Database,
  GitBranch, FolderTree, Map, Layout, Calendar, Rocket, Shield,
  DollarSign, Sparkles, Server, CheckCircle2, ChevronRight, Code2, TrendingUp,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { CodeBlock } from '../components/ui/CodeBlock';
import { CopyButton } from '../components/ui/CopyButton';
import { ExpandableCard } from '../components/ui/ExpandableCard';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import type { Project, Blueprint } from '../types';
import { exportMarkdown, downloadFile, exportPDF, formatDate } from '../lib/utils';

interface BlueprintViewerProps {
  project: Project;
  onBack: () => void;
  onProjectDeleted: () => void;
}

const methodColors: Record<string, string> = {
  GET: 'text-success-600 bg-success-50 dark:bg-success-900/30',
  POST: 'text-primary-600 bg-primary-50 dark:bg-primary-900/30',
  PUT: 'text-warning-600 bg-warning-50 dark:bg-warning-900/30',
  DELETE: 'text-error-600 bg-error-50 dark:bg-error-900/30',
  PATCH: 'text-accent-600 bg-accent-50 dark:bg-accent-900/30',
};

export function BlueprintViewer({ project, onBack, onProjectDeleted }: BlueprintViewerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const sectionIds = sections.map((s) => s.id);
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionIds.indexOf(entry.target.id);
            if (idx >= 0) setActiveSection(idx);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const bp: Blueprint = project.blueprint;

  useEffect(() => {
    if (user) {
      supabase.from('favorites').select('id').eq('user_id', user.id).eq('project_id', project.id).maybeSingle()
        .then(({ data, error }) => { if (!error) setIsFavorite(!!data); });
    }
  }, [user, project.id]);

  const sections = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'techstack', label: 'Tech Stack', icon: Layers },
    { id: 'architecture', label: 'Architecture', icon: Server },
    { id: 'database', label: 'Database Schema', icon: Database },
    { id: 'api', label: 'API Endpoints', icon: GitBranch },
    { id: 'folders', label: 'Folder Structure', icon: FolderTree },
    { id: 'roadmap', label: 'Dev Roadmap', icon: Map },
    { id: 'uipages', label: 'UI Pages', icon: Layout },
    { id: 'sprints', label: 'Sprint Plan', icon: Calendar },
    { id: 'readme', label: 'README', icon: FileText },
    { id: 'deployment', label: 'Deployment', icon: Rocket },
    { id: 'testing', label: 'Testing', icon: Shield },
    { id: 'cost', label: 'Cost Estimation', icon: DollarSign },
    { id: 'future', label: 'Future Enhancements', icon: Sparkles },
  ];

  const toggleFavorite = async () => {
    if (!user) return;
    setFavLoading(true);
    const wasFav = isFavorite;
    try {
      let error;
      if (wasFav) {
        ({ error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('project_id', project.id));
      } else {
        ({ error } = await supabase.from('favorites').insert({ user_id: user.id, project_id: project.id }));
      }
      if (error) throw error;
      setIsFavorite(!wasFav);
      toast(wasFav ? 'Removed from favorites' : 'Added to favorites', wasFav ? 'info' : 'success');
    } catch {
      toast('Failed to update favorite', 'error');
    } finally {
      setFavLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', project.id);
      if (error) throw error;
      toast('Project deleted', 'success');
      onProjectDeleted();
    } catch {
      toast('Failed to delete project', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportMD = () => {
    const md = exportMarkdown(project);
    downloadFile(`${project.title.replace(/\s+/g, '-').toLowerCase()}.md`, md, 'text/markdown');
    toast('Markdown exported', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <div className="sticky top-0 z-30 glass border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onBack} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">{project.title}</h1>
              <p className="text-xs text-gray-400">Generated {formatDate(project.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleFavorite}
              disabled={favLoading}
              className={`p-2 rounded-lg transition-all ${isFavorite ? 'text-warning-500' : 'text-gray-400 hover:text-warning-500'}`}
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <Button size="sm" variant="ghost" icon={<FileText className="w-4 h-4" />} onClick={handleExportMD}>MD</Button>
            <Button size="sm" variant="ghost" icon={<Download className="w-4 h-4" />} onClick={() => { if (exportPDF(project)) toast('PDF export opened', 'success'); else toast('Popup blocked. Allow popups to export.', 'error'); }}>PDF</Button>
            <Button size="sm" variant="ghost" className="text-error-500" icon={<Trash2 className="w-4 h-4" />} onClick={() => setShowDelete(true)} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Section sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            {sections.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(i);
                    document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSection === i
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-6 pb-12">
          {/* Project Overview */}
          <section id="section-overview" className="scroll-mt-24">
            <Card hover={false} className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Project Overview</h2>
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-2">{bp.projectOverview.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">{bp.projectOverview.tagline}</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{bp.projectOverview.description}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs font-medium text-gray-400 mb-1">Target Audience</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{bp.projectOverview.targetAudience}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs font-medium text-gray-400 mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {bp.projectOverview.tags.map((tag) => <Badge key={tag} variant="primary">{tag}</Badge>)}
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Tech Stack */}
          <section id="section-techstack" className="scroll-mt-24">
            <ExpandableCard title="Recommended Tech Stack" icon={<Layers className="w-5 h-5" />} defaultOpen badge={`${bp.techStack.length} items`}>
              <div className="grid sm:grid-cols-2 gap-3">
                {bp.techStack.map((tech) => (
                  <div key={tech.technology} className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{tech.technology}</span>
                      <Badge variant="accent">{tech.category}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tech.reason}</p>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          </section>

          {/* Architecture */}
          <section id="section-architecture" className="scroll-mt-24">
            <ExpandableCard title="System Architecture" icon={<Server className="w-5 h-5" />} defaultOpen>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{bp.architecture.description}</p>
              {/* Component diagram */}
              <div className="space-y-3 mb-6">
                {bp.architecture.components.map((comp, i) => (
                  <div key={comp.name} className="relative">
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                          {i + 1}
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{comp.name}</h4>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{comp.responsibility}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {comp.connections.map((conn) => (
                          <span key={conn} className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <ChevronRight className="w-3 h-3 text-primary-500" />
                            {conn}
                          </span>
                        ))}
                      </div>
                    </div>
                    {i < bp.architecture.components.length - 1 && (
                      <div className="flex justify-center py-1">
                        <div className="w-px h-4 bg-gradient-to-b from-primary-300 to-transparent dark:from-primary-700" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                <p className="text-xs font-medium text-primary-700 dark:text-primary-300 mb-1">Data Flow</p>
                <code className="text-xs text-gray-700 dark:text-gray-300 font-mono">{bp.architecture.dataFlow}</code>
              </div>
            </ExpandableCard>
          </section>

          {/* Database Schema */}
          <section id="section-database" className="scroll-mt-24">
            <ExpandableCard title="Database Schema" icon={<Database className="w-5 h-5" />} badge={`${bp.databaseSchema.length} tables`}>
              <div className="space-y-4">
                {bp.databaseSchema.map((table) => (
                  <div key={table.table} className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 font-mono">{table.table}</span>
                      <CopyButton text={`CREATE TABLE ${table.table} (\n${table.columns.map(c => `  ${c.name} ${c.type} ${c.constraints}`).join(',\n')}\n);`} />
                    </div>
                    <div className="overflow-x-auto scrollbar-thin">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 dark:border-gray-800">
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Column</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Constraints</th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.columns.map((col) => (
                            <tr key={col.name} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                              <td className="px-4 py-2 font-mono text-primary-600 dark:text-primary-400">{col.name}</td>
                              <td className="px-4 py-2 font-mono text-gray-600 dark:text-gray-400">{col.type}</td>
                              <td className="px-4 py-2 font-mono text-xs text-gray-500 dark:text-gray-500">{col.constraints}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/30 text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Relationships:</span> {table.relationships}
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          </section>

          {/* API Endpoints */}
          <section id="section-api" className="scroll-mt-24">
            <ExpandableCard title="API Endpoints" icon={<GitBranch className="w-5 h-5" />} badge={`${bp.apiEndpoints.length} endpoints`}>
              <div className="space-y-2">
                {bp.apiEndpoints.map((ep) => (
                  <div key={`${ep.method}-${ep.path}`} className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold font-mono shrink-0 ${methodColors[ep.method] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                      {ep.method}
                    </span>
                    <div className="flex-1 min-w-0">
                      <code className="text-sm font-mono text-gray-900 dark:text-gray-100">{ep.path}</code>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ep.description}</p>
                      {(ep.requestBody !== 'None' || ep.responseBody !== 'None') && (
                        <div className="mt-2 flex flex-wrap gap-4 text-xs">
                          {ep.requestBody !== 'None' && (
                            <div><span className="text-gray-400">Request:</span> <code className="text-gray-600 dark:text-gray-400">{ep.requestBody}</code></div>
                          )}
                          {ep.responseBody !== 'None' && (
                            <div><span className="text-gray-400">Response:</span> <code className="text-gray-600 dark:text-gray-400">{ep.responseBody}</code></div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          </section>

          {/* Folder Structure */}
          <section id="section-folders" className="scroll-mt-24">
            <ExpandableCard title="Folder Structure" icon={<FolderTree className="w-5 h-5" />}>
              <div className="font-mono text-sm space-y-1">
                {bp.folderStructure.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded px-2 py-1 transition-colors">
                    <span className="text-primary-500 shrink-0">📁</span>
                    <div>
                      <code className="text-gray-900 dark:text-gray-100">{item.path}</code>
                      <span className="text-gray-400 ml-2 text-xs">— {item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          </section>

          {/* Development Roadmap */}
          <section id="section-roadmap" className="scroll-mt-24">
            <ExpandableCard title="Development Roadmap" icon={<Map className="w-5 h-5" />} badge={`${bp.developmentRoadmap.length} phases`}>
              <div className="relative">
                {bp.developmentRoadmap.map((phase, i) => (
                  <div key={i} className="relative pl-8 pb-6 last:pb-0">
                    {/* Timeline line */}
                    {i < bp.developmentRoadmap.length - 1 && (
                      <div className="absolute left-3 top-8 bottom-0 w-px bg-gradient-to-b from-primary-400 to-transparent dark:from-primary-700" />
                    )}
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{phase.phase}</h4>
                        <Badge variant="default">{phase.duration}</Badge>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-1">Goals</p>
                          <ul className="space-y-1">
                            {phase.goals.map((g) => (
                              <li key={g} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-success-500 shrink-0 mt-0.5" />
                                {g}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-1">Deliverables</p>
                          <ul className="space-y-1">
                            {phase.deliverables.map((d) => (
                              <li key={d} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                                <ChevronRight className="w-3 h-3 text-primary-500 shrink-0 mt-0.5" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          </section>

          {/* UI Pages */}
          <section id="section-uipages" className="scroll-mt-24">
            <ExpandableCard title="UI Pages" icon={<Layout className="w-5 h-5" />} badge={`${bp.uiPages.length} pages`}>
              <div className="grid sm:grid-cols-2 gap-3">
                {bp.uiPages.map((page) => (
                  <div key={page.name} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{page.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{page.purpose}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {page.components.map((c) => <Badge key={c} variant="default">{c}</Badge>)}
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {page.wireframe}
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          </section>

          {/* Sprint Plan */}
          <section id="section-sprints" className="scroll-mt-24">
            <ExpandableCard title="Sprint Plan" icon={<Calendar className="w-5 h-5" />} badge={`${bp.sprintPlan.length} sprints`}>
              <div className="space-y-3">
                {bp.sprintPlan.map((sprint) => (
                  <div key={sprint.sprint} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{sprint.sprint}</h4>
                      <Badge variant="primary">{sprint.duration}</Badge>
                    </div>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-3">Goal: {sprint.goal}</p>
                    <div className="space-y-1">
                      {sprint.tasks.map((task, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <div className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600 shrink-0 mt-0.5" />
                          {task}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          </section>

          {/* README */}
          <section id="section-readme" className="scroll-mt-24">
            <ExpandableCard title="GitHub README" icon={<FileText className="w-5 h-5" />}>
              <CodeBlock code={bp.readme} language="markdown" title="README.md" />
            </ExpandableCard>
          </section>

          {/* Deployment Guide */}
          <section id="section-deployment" className="scroll-mt-24">
            <ExpandableCard title="Deployment Guide" icon={<Rocket className="w-5 h-5" />} badge={`${bp.deploymentGuide.length} steps`}>
              <div className="space-y-3">
                {bp.deploymentGuide.map((step, i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{step.step}</h4>
                      <Badge variant="accent">{step.platform}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{step.instructions}</p>
                    {step.commands.length > 0 && (
                      <CodeBlock code={step.commands.join('\n')} language="bash" />
                    )}
                  </div>
                ))}
              </div>
            </ExpandableCard>
          </section>

          {/* Testing Strategy */}
          <section id="section-testing" className="scroll-mt-24">
            <ExpandableCard title="Testing Strategy" icon={<Shield className="w-5 h-5" />}>
              <div className="space-y-3">
                {[
                  { label: 'Unit Testing', value: bp.testingStrategy.unit, icon: Code2 },
                  { label: 'Integration Testing', value: bp.testingStrategy.integration, icon: Layers },
                  { label: 'End-to-End Testing', value: bp.testingStrategy.e2e, icon: GitBranch },
                  { label: 'Performance Testing', value: bp.testingStrategy.performance, icon: TrendingUp },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <div key={t.label} className="p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.label}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{t.value}</p>
                    </div>
                  );
                })}
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs font-medium text-gray-400 mb-2">Recommended Tools</p>
                  <div className="flex flex-wrap gap-1.5">
                    {bp.testingStrategy.tools.map((tool) => <Badge key={tool} variant="default">{tool}</Badge>)}
                  </div>
                </div>
              </div>
            </ExpandableCard>
          </section>

          {/* Cost Estimation */}
          <section id="section-cost" className="scroll-mt-24">
            <ExpandableCard title="Cost Estimation" icon={<DollarSign className="w-5 h-5" />}>
              <div className="space-y-2">
                {bp.costEstimation.map((cost, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{cost.resource}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{cost.notes}</p>
                    </div>
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400 shrink-0 ml-3">{cost.monthlyCost}</span>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          </section>

          {/* Future Enhancements */}
          <section id="section-future" className="scroll-mt-24">
            <ExpandableCard title="Future Enhancements" icon={<Sparkles className="w-5 h-5" />} badge={`${bp.futureEnhancements.length} ideas`}>
              <div className="space-y-2">
                {bp.futureEnhancements.map((enh, i) => (
                  <div key={i} className="p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{enh.feature}</h4>
                      <Badge variant={enh.priority === 'High' ? 'error' : enh.priority === 'Medium' ? 'warning' : 'default'}>
                        {enh.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{enh.description}</p>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          </section>

          {/* Export bar */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button variant="secondary" icon={<FileText className="w-4 h-4" />} onClick={handleExportMD}>Export as Markdown</Button>
            <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={() => exportPDF(project)}>Export as PDF</Button>
            <Button variant="secondary" icon={<Copy className="w-4 h-4" />} onClick={() => { navigator.clipboard.writeText(exportMarkdown(project)); toast('Blueprint copied to clipboard', 'success'); }}>
              Copy Blueprint
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Project" size="sm">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete <strong className="text-gray-900 dark:text-gray-100">{project.title}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDelete}>Delete</Button>
          <Button variant="secondary" className="flex-1" onClick={() => setShowDelete(false)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}


