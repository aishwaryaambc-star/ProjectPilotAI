import { ArrowRight, Sparkles, Layers, Database, GitBranch, Code2, FileText, Rocket, Zap, Shield, Clock, CheckCircle2, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onGetStarted: () => void;
}

export function LandingPage({ onNavigate, onGetStarted }: LandingPageProps) {
  const features = [
    { icon: Layers, title: 'Complete Architecture', description: 'Get component diagrams, data flow, and system design tailored to your idea.' },
    { icon: Database, title: 'Database Schema', description: 'Auto-generated tables, columns, relationships, and constraints with RLS policies.' },
    { icon: GitBranch, title: 'API Endpoints', description: 'RESTful API design with request/response schemas for every endpoint.' },
    { icon: Code2, title: 'Folder Structure', description: 'Production-ready project organization following industry best practices.' },
    { icon: FileText, title: 'README & Docs', description: 'GitHub-ready README, deployment guides, and testing strategies.' },
    { icon: Rocket, title: 'Sprint Planning', description: 'Agile roadmap broken into sprints with tasks, goals, and deliverables.' },
  ];

  const steps = [
    { num: '01', title: 'Describe Your Idea', description: 'Enter your project concept in plain English. No technical jargon required.' },
    { num: '02', title: 'AI Analyzes & Generates', description: 'Our AI architect analyzes your idea and generates a comprehensive blueprint in seconds.' },
    { num: '03', title: 'Review & Export', description: 'Explore interactive sections, copy code, export to Markdown or PDF, and start building.' },
  ];

  const pricing = [
    { name: 'Starter', price: '$0', period: 'forever', features: ['5 blueprints/month', 'Markdown export', 'Basic tech stack', 'Community support'], cta: 'Get Started', highlight: false },
    { name: 'Pro', price: '$19', period: 'per month', features: ['Unlimited blueprints', 'PDF & Markdown export', 'Advanced analytics', 'Priority support', 'Custom templates', 'API access'], cta: 'Start Pro', highlight: true },
    { name: 'Team', price: '$49', period: 'per month', features: ['Everything in Pro', '5 team members', 'Shared workspaces', 'Admin dashboard', 'SSO authentication', 'Dedicated support'], cta: 'Start Team', highlight: false },
  ];

  const stats = [
    { value: '15+', label: 'Blueprint Sections' },
    { value: '<5s', label: 'Generation Time' },
    { value: '100%', label: 'Custom Output' },
    { value: '∞', label: 'Possibilities' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-50 dark:opacity-20" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-accent-500/10 dark:bg-accent-500/15 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 animate-fade-in-down">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">AI-Powered Project Blueprint Generator</span>
          </div>

          <h1 className="mt-8 text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance animate-fade-in-up">
            Your <span className="gradient-text">AI Software</span>
            <br />
            Architect
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-balance animate-fade-in-up animate-delay-100">
            Transform your project ideas into complete technical blueprints. Get architecture, database schemas, API designs, sprint plans, and deployment guides — all powered by AI.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-200">
            <Button size="lg" icon={<Sparkles className="w-5 h-5" />} onClick={onGetStarted} className="group">
              Generate Your Blueprint
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => onNavigate('how-it-works')}>
              See How It Works
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 animate-fade-in-up animate-delay-300">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{s.value}</div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="primary">Features</Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Everything you need to plan your next project
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              From architecture to deployment, ProjectPilot AI generates a complete blueprint with 15+ sections of production-ready documentation.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="p-6 group animate-fade-in-up" >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 text-primary-600 dark:text-primary-400 w-fit group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <Badge variant="accent">How It Works</Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
              From idea to blueprint in 3 steps
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative animate-fade-in-up" >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary-300 to-transparent dark:from-primary-700 -translate-x-8" />
                )}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg shadow-primary-600/30">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" icon={<Sparkles className="w-5 h-5" />} onClick={onGetStarted}>
              Try It Now — It's Free
            </Button>
          </div>
        </div>
      </section>

      {/* Showcase / Blueprint Sections Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="success">What You Get</Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
              15+ sections of detailed documentation
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Every blueprint includes comprehensive, interactive, and exportable documentation.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              'Project Overview', 'Tech Stack', 'Architecture', 'Database Schema', 'API Endpoints',
              'Folder Structure', 'Dev Roadmap', 'UI Pages', 'Sprint Plan', 'README',
              'Deployment Guide', 'Testing Strategy', 'Cost Estimation', 'Future Enhancements', 'Interactive Diagrams',
            ].map((section, i) => (
              <div
                key={section}
                className="px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 text-center hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {section}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <Badge variant="warning">Pricing</Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Start free. Upgrade when you need more.</p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((plan) => (
              <Card key={plan.name} className={`p-6 relative ${plan.highlight ? 'border-primary-500 dark:border-primary-600 ring-2 ring-primary-500/20' : ''}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary" size="md">Most Popular</Badge>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">{plan.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">/{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-8"
                  variant={plan.highlight ? 'primary' : 'secondary'}
                  onClick={onGetStarted}
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card hover={false} className="p-12 text-center relative overflow-hidden bg-gradient-to-br from-primary-600 to-accent-600 border-0">
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="relative">
              <Zap className="w-12 h-12 text-white mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Ready to build your next project?
              </h2>
              <p className="mt-4 text-lg text-primary-100">
                Join thousands of developers using ProjectPilot AI to plan and ship faster.
              </p>
              <Button
                size="lg"
                onClick={onGetStarted}
                className="mt-8 bg-white text-primary-700 hover:bg-gray-100 shadow-xl"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Get Started for Free
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-2"><Shield className="w-5 h-5" /><span className="text-sm font-medium">Secure Auth</span></div>
          <div className="flex items-center gap-2"><Clock className="w-5 h-5" /><span className="text-sm font-medium">Instant Generation</span></div>
          <div className="flex items-center gap-2"><Star className="w-5 h-5" /><span className="text-sm font-medium">Production Ready</span></div>
          <div className="flex items-center gap-2"><GitBranch className="w-5 h-5" /><span className="text-sm font-medium">GitHub Ready</span></div>
        </div>
      </section>
    </div>
  );
}
