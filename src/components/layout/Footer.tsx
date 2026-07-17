import { Rocket, Github, Twitter, Linkedin } from 'lucide-react';
import { Logo } from './Logo';

export function Footer({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Your AI Software Architect. Transform ideas into complete project blueprints in seconds.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Product</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('features')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pricing</button></li>
              <li><button onClick={() => onNavigate('how-it-works')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">How it Works</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Company</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('home')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</button></li>
              <li><button onClick={() => onNavigate('home')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</button></li>
              <li><button onClick={() => onNavigate('home')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Careers</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><Github className="w-5 h-5" /></a>
              <a href="#" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} ProjectPilot AI. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Rocket className="w-3.5 h-3.5" />
            <span>Built with React, TypeScript & Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
