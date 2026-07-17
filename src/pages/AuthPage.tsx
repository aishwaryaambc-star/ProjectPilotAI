import { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/layout/Logo';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onNavigate: (page: string) => void;
}

export function AuthPage({ mode, onNavigate }: AuthPageProps) {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (isSignup && !fullName.trim()) e.fullName = 'Full name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isSignup) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast(error, 'error');
        } else {
          toast('Account created! Welcome to ProjectPilot AI.', 'success');
          onNavigate('dashboard');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast(error, 'error');
        } else {
          toast('Welcome back!', 'success');
          onNavigate('dashboard');
        }
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : 'An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-20 -right-20 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative">
          <button onClick={() => onNavigate('home')}>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ProjectPilot AI</span>
            </div>
          </button>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Plan your next project with AI precision
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Generate complete technical blueprints — architecture, database schemas, API designs, and deployment guides — in seconds.
          </p>
          <div className="mt-8 space-y-3">
            {['15+ blueprint sections', 'Export to Markdown & PDF', 'Interactive diagrams & code blocks', 'Sprint planning & roadmaps'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-primary-100">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-primary-200 text-sm">
          Trusted by developers worldwide
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-950 relative">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <button onClick={() => onNavigate('home')}>
              <Logo size="lg" />
            </button>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isSignup ? 'Start generating blueprints for free' : 'Sign in to access your blueprints'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {isSignup && (
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                icon={<UserIcon className="w-4 h-4" />}
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock className="w-4 h-4" />}
            />

            <Button type="submit" className="w-full" size="lg" loading={loading} icon={!loading ? <Sparkles className="w-5 h-5" /> : undefined}>
              {isSignup ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => onNavigate(isSignup ? 'login' : 'signup')}
              className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>

          <button
            onClick={() => onNavigate('home')}
            className="mt-8 w-full text-center text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
