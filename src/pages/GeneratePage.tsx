import { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, Lightbulb, Wand2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { generateMockBlueprint } from '../lib/mockBlueprint';
import type { Project } from '../types';

interface GeneratePageProps {
  onProjectGenerated: (project: Project) => void;
}

const examples = [
  'A real-time collaboration tool for remote design teams with shared whiteboards and live cursors',
  'An AI-powered personal finance tracker that categorizes expenses and predicts monthly budgets',
  'A marketplace connecting local farmers with restaurants for fresh produce delivery',
  'A habit tracking app with social accountability, streaks, and AI-generated coaching tips',
  'A code review platform that uses AI to suggest improvements and detect security vulnerabilities',
];

export function GeneratePage({ onProjectGenerated }: GeneratePageProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!user) return;
    if (idea.trim().length < 5) {
      setError('Please describe your project idea in at least 5 characters');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      let project: Project | null = null;

      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/generate-blueprint`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ idea: idea.trim() }),
        });

        if (response.ok) {
          const data = await response.json();
          if (!data.error) {
            project = data.project as Project;
          }
        }
      } catch (fetchErr) {
        console.warn('Edge function call failed, using client-side fallback:', fetchErr);
      }

      // Client-side fallback: generate blueprint locally and save to DB
      if (!project) {
        const blueprint = generateMockBlueprint(idea.trim());
        const { data, error: dbError } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            title: blueprint.projectOverview.name,
            idea: idea.trim(),
            blueprint,
            status: 'completed',
            tags: blueprint.projectOverview.tags,
          })
          .select()
          .single();

        if (dbError) throw new Error(dbError.message);
        project = data as Project;

        // Create notification
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'success',
          title: 'Blueprint Generated',
          message: `Your project "${blueprint.projectOverview.name}" blueprint is ready!`,
          metadata: { project_id: (data as any).id },
        });
      }

      toast('Blueprint generated successfully!', 'success');
      onProjectGenerated(project);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to generate blueprint';
      toast(msg, 'error');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 mb-4">
          <Wand2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">AI Blueprint Generator</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Describe Your Project Idea</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Tell us what you want to build. Our AI architect will generate a complete technical blueprint with architecture, database schema, API design, and more.
        </p>
      </div>

      <Card hover={false} className="p-6">
        <Textarea
          label="Your Project Idea"
          placeholder="e.g. A SaaS platform for managing remote team standups with AI-generated summaries and action item tracking..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          error={error}
          rows={6}
          className="text-base"
        />

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-400">{idea.length} characters</span>
          <Button
            size="lg"
            loading={loading}
            onClick={handleGenerate}
            icon={!loading ? <Sparkles className="w-5 h-5" /> : undefined}
          >
            {loading ? 'Generating Blueprint...' : 'Generate Blueprint'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </Button>
        </div>
      </Card>

      {loading && (
        <div className="mt-8 space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
            <span>AI is analyzing your idea and designing the architecture...</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['Analyzing project requirements', 'Designing architecture', 'Creating database schema', 'Planning API endpoints', 'Generating sprint plan', 'Writing documentation'].map((step, i) => (
              <div key={step} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: `${i * 300}ms` }}>
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-warning-500" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Need inspiration? Try these:</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setIdea(ex)}
                className="text-left p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all text-sm text-gray-600 dark:text-gray-400"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
