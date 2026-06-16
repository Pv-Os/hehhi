// ─── User / Auth ────────────────────────────────────────────────────────────
export interface User {
  id: string;
  githubId: string;
  username: string;
  name: string;
  avatarUrl: string;
  email: string;
  createdAt: Date;
}

// ─── Portfolio ───────────────────────────────────────────────────────────────
export interface Portfolio {
  id: string;
  userId: string;
  username: string;
  bio: string;
  theme: 'minimal' | 'dark-tech' | 'warm';
  customDomain?: string;
  amaEnabled: boolean;
  amaContext: AMAContext;
  projects: Project[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AMAContext {
  aboutMe: string;
  aboutMyWork: string;
  manualQAPairs: QAPair[];
}

export interface QAPair {
  id: string;
  question: string;
  answer: string;
}

// ─── Projects ────────────────────────────────────────────────────────────────
export type ProjectType = 'github-repo' | 'database-schema' | 'api-spec' | 'live-app';

export interface Project {
  id: string;
  portfolioId: string;
  type: ProjectType;
  url: string;
  title: string;
  description: string;
  techStack: string[];
  primaryLanguage?: string;
  isRunnable: boolean;
  order: number;
  metadata: RepoMetadata | SchemaMetadata | APIMetadata;
  createdAt: Date;
}

export interface RepoMetadata {
  stars: number;
  forks: number;
  lastUpdated: Date;
  languageBreakdown: Record<string, number>;
  topics: string[];
}

export interface SchemaMetadata {
  tableCount: number;
  erdDiagram: string;
}

export interface APIMetadata {
  endpointCount: number;
  openApiSpec: object;
}

// ─── AMA ─────────────────────────────────────────────────────────────────────
export interface AMAQuestion {
  id: string;
  portfolioId: string;
  question: string;
  answer: string;
  answeredFromContext: boolean;
  visitorId: string;
  askedAt: Date;
}

// ─── Terminal / Sandbox ──────────────────────────────────────────────────────
export interface SandboxSession {
  id: string;
  projectId: string;
  sandboxId: string;
  status: 'starting' | 'ready' | 'error' | 'terminated';
  startedAt: Date;
  expiresAt: Date;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface PortfolioAnalytics {
  portfolioId: string;
  period: 'day' | 'week' | 'month';
  pageviews: number;
  terminalSessions: number;
  amaQuestions: number;
  topReferrers: Array<{ source: string; count: number }>;
}
