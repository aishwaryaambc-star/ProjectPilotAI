import type { Blueprint } from '../types';

export function generateMockBlueprint(idea: string): Blueprint {
  const cleanIdea = idea.trim();
  const words = cleanIdea.split(/\s+/);
  const name = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('') || 'ProjectApp';
  const lowerName = name.charAt(0).toLowerCase() + name.slice(1);

  return {
    projectOverview: {
      name,
      tagline: `A modern platform for ${cleanIdea.toLowerCase()}`,
      description: `${name} is a full-featured web application designed to ${cleanIdea.toLowerCase()}. It provides users with an intuitive interface, robust backend services, and seamless data management. The platform is built with scalability, security, and user experience as core priorities.`,
      targetAudience: 'Developers, product teams, and end-users looking for a streamlined solution in this domain.',
      tags: extractTags(cleanIdea),
    },
    techStack: [
      { category: 'Frontend', technology: 'React 18 + TypeScript', reason: 'Component-based architecture with type safety for maintainable UI' },
      { category: 'Styling', technology: 'Tailwind CSS', reason: 'Utility-first CSS for rapid, consistent design' },
      { category: 'Backend', technology: 'Supabase (PostgreSQL)', reason: 'Managed database with auth, realtime, and storage out of the box' },
      { category: 'Authentication', technology: 'Supabase Auth', reason: 'Secure email/password and OAuth authentication' },
      { category: 'Hosting', technology: 'Vercel', reason: 'Optimized for React with edge CDN and automatic deployments' },
      { category: 'State Management', technology: 'React Context + Hooks', reason: 'Lightweight state management without external dependencies' },
      { category: 'API Layer', technology: 'Supabase Edge Functions', reason: 'Serverless functions for custom backend logic' },
      { category: 'Testing', technology: 'Vitest + Playwright', reason: 'Unit and end-to-end testing coverage' },
    ],
    architecture: {
      description: `${name} follows a client-server architecture with a React SPA frontend communicating with Supabase for data, auth, and serverless functions. The frontend handles UI rendering and client-side routing, while Supabase manages data persistence, authentication, and business logic via edge functions.`,
      components: [
        { name: 'Frontend SPA', responsibility: 'Renders UI, manages client state, handles user interactions', connections: ['Supabase Client', 'Edge Functions'] },
        { name: 'Supabase Auth', responsibility: 'Manages user sessions, JWT tokens, and authentication flows', connections: ['Frontend SPA', 'Database'] },
        { name: 'PostgreSQL Database', responsibility: 'Stores all application data with row-level security', connections: ['Edge Functions', 'Frontend SPA'] },
        { name: 'Edge Functions', responsibility: 'Handles server-side logic, third-party API calls, and complex operations', connections: ['Database', 'External APIs'] },
        { name: 'Storage', responsibility: 'Manages file uploads and media assets', connections: ['Frontend SPA', 'Database'] },
      ],
      dataFlow: 'User → React SPA → Supabase Client → PostgreSQL (with RLS) / Edge Functions → Response → React State → UI Update',
    },
    databaseSchema: [
      {
        table: 'users',
        columns: [
          { name: 'id', type: 'uuid', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()' },
          { name: 'email', type: 'text', constraints: 'UNIQUE NOT NULL' },
          { name: 'full_name', type: 'text', constraints: 'NOT NULL' },
          { name: 'created_at', type: 'timestamptz', constraints: 'DEFAULT now()' },
        ],
        relationships: 'Referenced by all user-owned tables',
      },
      {
        table: 'items',
        columns: [
          { name: 'id', type: 'uuid', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()' },
          { name: 'user_id', type: 'uuid', constraints: 'REFERENCES users(id) ON DELETE CASCADE' },
          { name: 'title', type: 'text', constraints: 'NOT NULL' },
          { name: 'description', type: 'text', constraints: "DEFAULT ''" },
          { name: 'status', type: 'text', constraints: "DEFAULT 'active' CHECK (status IN ('active', 'archived'))" },
          { name: 'created_at', type: 'timestamptz', constraints: 'DEFAULT now()' },
          { name: 'updated_at', type: 'timestamptz', constraints: 'DEFAULT now()' },
        ],
        relationships: 'Belongs to users via user_id',
      },
      {
        table: 'activity_logs',
        columns: [
          { name: 'id', type: 'uuid', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()' },
          { name: 'user_id', type: 'uuid', constraints: 'REFERENCES users(id) ON DELETE CASCADE' },
          { name: 'action', type: 'text', constraints: 'NOT NULL' },
          { name: 'metadata', type: 'jsonb', constraints: "DEFAULT '{}'" },
          { name: 'created_at', type: 'timestamptz', constraints: 'DEFAULT now()' },
        ],
        relationships: 'Belongs to users; tracks user actions',
      },
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/items', description: 'Retrieve all items for the authenticated user', requestBody: 'None', responseBody: '{ items: Item[] }' },
      { method: 'POST', path: '/api/items', description: 'Create a new item', requestBody: '{ title: string, description: string }', responseBody: '{ item: Item }' },
      { method: 'GET', path: '/api/items/:id', description: 'Get a single item by ID', requestBody: 'None', responseBody: '{ item: Item }' },
      { method: 'PUT', path: '/api/items/:id', description: 'Update an existing item', requestBody: '{ title?: string, description?: string, status?: string }', responseBody: '{ item: Item }' },
      { method: 'DELETE', path: '/api/items/:id', description: 'Delete an item', requestBody: 'None', responseBody: '{ success: boolean }' },
      { method: 'GET', path: '/api/users/profile', description: 'Get current user profile', requestBody: 'None', responseBody: '{ user: User }' },
      { method: 'PUT', path: '/api/users/profile', description: 'Update user profile', requestBody: '{ full_name?: string, avatar_url?: string }', responseBody: '{ user: User }' },
    ],
    folderStructure: [
      { path: 'src/', description: 'Main application source code' },
      { path: 'src/components/', description: 'Reusable React components' },
      { path: 'src/components/ui/', description: 'Base UI primitives (Button, Card, Input, etc.)' },
      { path: 'src/pages/', description: 'Page-level components for each route' },
      { path: 'src/hooks/', description: 'Custom React hooks' },
      { path: 'src/lib/', description: 'Utility functions and configuration' },
      { path: 'src/lib/supabase.ts', description: 'Supabase client initialization' },
      { path: 'src/contexts/', description: 'React context providers (Auth, Theme)' },
      { path: 'src/types/', description: 'TypeScript type definitions' },
      { path: 'supabase/functions/', description: 'Supabase Edge Functions' },
      { path: 'supabase/migrations/', description: 'Database migration SQL files' },
      { path: 'public/', description: 'Static assets (images, icons)' },
    ],
    developmentRoadmap: [
      { phase: 'Phase 1: Foundation', duration: 'Week 1-2', goals: ['Set up project scaffolding', 'Configure Supabase', 'Implement authentication'], deliverables: ['Working dev environment', 'Login/Signup flows', 'Database schema deployed'] },
      { phase: 'Phase 2: Core Features', duration: 'Week 3-5', goals: ['Build CRUD operations', 'Create main UI pages', 'Implement data layer'], deliverables: ['Dashboard', 'Item management', 'API integration'] },
      { phase: 'Phase 3: Polish', duration: 'Week 6-7', goals: ['Add animations', 'Responsive design', 'Error handling'], deliverables: ['Mobile-friendly UI', 'Loading states', 'Form validation'] },
      { phase: 'Phase 4: Launch', duration: 'Week 8', goals: ['Deploy to production', 'Write documentation', 'Set up monitoring'], deliverables: ['Live application', 'README', 'Analytics dashboard'] },
    ],
    uiPages: [
      { name: 'Landing Page', purpose: 'Showcase the product with hero, features, and CTA', components: ['Hero', 'FeatureGrid', 'Pricing', 'Footer'], wireframe: 'Full-width hero → Feature cards → Testimonials → Pricing tiers → Footer CTA' },
      { name: 'Dashboard', purpose: 'Main user interface after login', components: ['Sidebar', 'StatCards', 'ItemList', 'QuickActions'], wireframe: 'Sidebar nav → Top bar with search → Stat cards → Data table with filters' },
      { name: 'Item Detail', purpose: 'View and edit individual items', components: ['ItemHeader', 'ItemForm', 'ActivityFeed'], wireframe: 'Breadcrumbs → Item title → Edit form → Activity timeline' },
      { name: 'Settings', purpose: 'User preferences and account management', components: ['ProfileForm', 'Preferences', 'DangerZone'], wireframe: 'Tab nav → Profile fields → Theme toggle → Delete account' },
      { name: 'Auth Pages', purpose: 'Login and signup', components: ['AuthForm', 'SocialButtons', 'Divider'], wireframe: 'Centered card → Logo → Form fields → Submit → Social auth → Link to toggle' },
    ],
    sprintPlan: [
      { sprint: 'Sprint 1', duration: '2 weeks', tasks: ['Initialize Vite + React + TS project', 'Set up Tailwind CSS', 'Configure Supabase client', 'Create database migrations', 'Build auth UI components'], goal: 'Working auth flow with database' },
      { sprint: 'Sprint 2', duration: '2 weeks', tasks: ['Build dashboard layout', 'Create item CRUD pages', 'Implement search and filters', 'Add form validation', 'Build reusable UI components'], goal: 'Core CRUD functionality' },
      { sprint: 'Sprint 3', duration: '2 weeks', tasks: ['Add dark/light mode', 'Implement animations', 'Build mobile responsive layout', 'Add loading states', 'Error boundary integration'], goal: 'Polished, responsive UI' },
      { sprint: 'Sprint 4', duration: '2 weeks', tasks: ['Deploy to Vercel', 'Write documentation', 'Set up analytics', 'Create admin dashboard', 'Final testing pass'], goal: 'Production deployment' },
    ],
    readme: `# ${name}\n\n${cleanIdea}\n\n## Features\n- User authentication and authorization\n- Dashboard with data management\n- Responsive design with dark/light mode\n- Real-time updates\n- RESTful API\n\n## Tech Stack\n- **Frontend:** React 18, TypeScript, Tailwind CSS\n- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)\n- **Hosting:** Vercel\n\n## Getting Started\n\n\`\`\`bash\ngit clone https://github.com/yourusername/${lowerName}.git\ncd ${lowerName}\nnpm install\ncp .env.example .env  # Add your Supabase keys\nnpm run dev\n\`\`\`\n\n## Database Setup\n\nRun the migrations in \`supabase/migrations/\` against your Supabase project.\n\n## Scripts\n\n- \`npm run dev\` - Start dev server\n- \`npm run build\` - Production build\n- \`npm run test\` - Run tests\n- \`npm run lint\` - Lint code\n\n## License\n\nMIT`,
    deploymentGuide: [
      { step: '1. Set up Supabase', platform: 'Supabase', instructions: 'Create a new project at supabase.com, get your URL and anon key from Settings > API', commands: [] },
      { step: '2. Run migrations', platform: 'Supabase', instructions: 'Execute the SQL migrations in the Supabase SQL Editor or via CLI', commands: ['supabase db push'] },
      { step: '3. Configure environment', platform: 'Local', instructions: 'Copy .env.example to .env and fill in your Supabase credentials', commands: ['cp .env.example .env'] },
      { step: '4. Deploy to Vercel', platform: 'Vercel', instructions: 'Connect your GitHub repo to Vercel, add environment variables, and deploy', commands: ['npm run build', 'vercel --prod'] },
      { step: '5. Set up custom domain', platform: 'Vercel', instructions: 'Add your custom domain in Vercel project settings and configure DNS', commands: [] },
    ],
    testingStrategy: {
      unit: 'Test individual components and utility functions with Vitest. Cover edge cases for form validation, data transformation, and state management.',
      integration: 'Test component interactions and Supabase client calls using MSW for mocking. Verify auth flows and data fetching.',
      e2e: 'Use Playwright to test critical user journeys: signup, login, create item, edit item, delete item, logout.',
      performance: 'Run Lighthouse audits for performance, accessibility, and SEO. Target 90+ scores across all categories.',
      tools: ['Vitest', 'Playwright', 'MSW', 'Lighthouse', 'React Testing Library'],
    },
    costEstimation: [
      { resource: 'Supabase (Free Tier)', monthlyCost: '$0', notes: '50,000 monthly active users, 500MB database, 1GB storage' },
      { resource: 'Vercel (Hobby)', monthlyCost: '$0', notes: '100GB bandwidth, serverless functions included' },
      { resource: 'Custom Domain', monthlyCost: '$10-15', notes: 'Annual domain registration cost' },
      { resource: 'Supabase Pro', monthlyCost: '$25', notes: '8GB database, 100GB storage, daily backups (when scaling)' },
      { resource: 'Email Service', monthlyCost: '$0-20', notes: 'Transaction emails (Resend/Postmark free tier covers most apps)' },
    ],
    futureEnhancements: [
      { feature: 'Real-time collaboration', priority: 'Medium', description: 'Multi-user editing with live cursors and presence indicators' },
      { feature: 'Mobile app (React Native)', priority: 'High', description: 'Native mobile experience for iOS and Android' },
      { feature: 'AI-powered insights', priority: 'Medium', description: 'Smart recommendations and predictive analytics based on usage patterns' },
      { feature: 'Team workspaces', priority: 'High', description: 'Shared spaces with role-based permissions for team collaboration' },
      { feature: 'Webhook integrations', priority: 'Low', description: 'Connect with Slack, Discord, Zapier for automated workflows' },
      { feature: 'Advanced analytics', priority: 'Medium', description: 'Custom dashboards with charts, reports, and data exports' },
    ],
  };
}

function extractTags(idea: string): string[] {
  const keywords = idea.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'a', 'an', 'for', 'to', 'and', 'or', 'with', 'that', 'this', 'is', 'are', 'was', 'will', 'be', 'of', 'in', 'on', 'at', 'by', 'it', 'as', 'we', 'you', 'i', 'my', 'our']);
  const unique = [...new Set(keywords.filter(w => w.length > 3 && !stopWords.has(w)))].slice(0, 5);
  return unique.length > 0 ? unique : ['web-app', 'saas', 'react'];
}
