export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  role: 'user' | 'admin';
  preferences: { theme?: 'light' | 'dark'; emailNotifications?: boolean };
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  idea: string;
  blueprint: Blueprint;
  status: 'completed' | 'draft' | 'failed';
  is_public: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  project_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  is_read: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Blueprint {
  projectOverview: { name: string; tagline: string; description: string; targetAudience: string; tags: string[] };
  techStack: TechStackItem[];
  architecture: { description: string; components: ArchitectureComponent[]; dataFlow: string };
  databaseSchema: DatabaseTable[];
  apiEndpoints: ApiEndpoint[];
  folderStructure: FolderItem[];
  developmentRoadmap: RoadmapPhase[];
  uiPages: UiPage[];
  sprintPlan: Sprint[];
  readme: string;
  deploymentGuide: DeploymentStep[];
  testingStrategy: { unit: string; integration: string; e2e: string; performance: string; tools: string[] };
  costEstimation: CostItem[];
  futureEnhancements: Enhancement[];
}

export interface TechStackItem { category: string; technology: string; reason: string }
export interface ArchitectureComponent { name: string; responsibility: string; connections: string[] }
export interface DatabaseTable { table: string; columns: { name: string; type: string; constraints: string }[]; relationships: string }
export interface ApiEndpoint { method: string; path: string; description: string; requestBody: string; responseBody: string }
export interface FolderItem { path: string; description: string }
export interface RoadmapPhase { phase: string; duration: string; goals: string[]; deliverables: string[] }
export interface UiPage { name: string; purpose: string; components: string[]; wireframe: string }
export interface Sprint { sprint: string; duration: string; tasks: string[]; goal: string }
export interface DeploymentStep { step: string; platform: string; instructions: string; commands: string[] }
export interface CostItem { resource: string; monthlyCost: string; notes: string }
export interface Enhancement { feature: string; priority: string; description: string }
