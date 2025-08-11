// GitHub API 相关类型定义

export interface GitHubApiError extends Error {
  status?: number;
  response?: {
    headers?: Record<string, string>;
    data?: Record<string, unknown>;
  };
}

export interface RateLimitInfo {
  core: {
    limit: number;
    remaining: number;
    reset: number;
    used: number;
  };
  search: {
    limit: number;
    remaining: number;
    reset: number;
    used: number;
  };
  graphql: {
    limit: number;
    remaining: number;
    reset: number;
    used: number;
  };
  integration_manifest: {
    limit: number;
    remaining: number;
    reset: number;
    used: number;
  };
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: GitHubUser | null;
  committer: GitHubUser | null;
  html_url: string;
}

// 构建提交信息接口
export interface BuildCommitInfo {
  sha: string;
  author: {
    name: string;
    email: string;
    avatar_url?: string;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  message: string;
  shortMessage: string;
  html_url: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  user: GitHubUser;
  assignee: GitHubUser | null;
  assignees: GitHubUser[];
  labels: Array<{
    id: number;
    name: string;
    color: string;
    description: string | null;
  }>;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  html_url: string;
  comments: number;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed' | 'merged';
  user: GitHubUser;
  assignee: GitHubUser | null;
  assignees: GitHubUser[];
  head: {
    ref: string;
    sha: string;
    repo: GitHubRepository | null;
  };
  base: {
    ref: string;
    sha: string;
    repo: GitHubRepository;
  };
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  html_url: string;
  draft: boolean;
  mergeable: boolean | null;
  mergeable_state: string;
  comments: number;
  review_comments: number;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string | null;
  author: GitHubUser;
  html_url: string;
  tarball_url: string;
  zipball_url: string;
  assets: Array<{
    id: number;
    name: string;
    size: number;
    download_count: number;
    created_at: string;
    updated_at: string;
    browser_download_url: string;
  }>;
}

// 缓存相关类型
export interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  clears: number;
  hitRate: number;
}

export interface CacheStats extends CacheMetrics {
  size: number;
  maxSize: number;
  memoryUsage: number;
  oldestItem?: {
    key: string;
    age: number;
  };
  newestItem?: {
    key: string;
    age: number;
  };
}

// 调度器相关类型
export interface TaskExecutionResult {
  success: boolean;
  duration: number;
  error?: string;
  timestamp: number;
}

export interface TaskStatistics {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageDuration: number;
  lastExecutionResult?: TaskExecutionResult;
  successRate: number;
}

// 服务状态类型
export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  version: string;
  timestamp: string;
  checks: {
    github_api: boolean;
    cache: boolean;
    scheduler: boolean;
    memory: boolean;
  };
}

export interface SystemMetrics {
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  uptime: number;
  timestamp: number;
}

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// 配置类型
export interface AppConfig {
  server: {
    port: number;
    host: string;
    cors: {
      origin: string | string[];
      credentials: boolean;
    };
  };
  github: {
    token: string;
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  cache: {
    ttl: number;
    maxSize: number;
    cleanupInterval: number;
  };
  scheduler: {
    updateInterval: number;
    maxConcurrentTasks: number;
    errorRetryDelay: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableConsole: boolean;
    enableFile: boolean;
    filePath?: string;
  };
}

// 事件类型
export interface ServiceEvent {
  type: 'sync_start' | 'sync_complete' | 'sync_error' | 'cache_clear' | 'task_start' | 'task_complete' | 'task_error';
  timestamp: number;
  data?: Record<string, unknown>;
  error?: string;
}

export type EventHandler = (event: ServiceEvent) => void;

// GitHub API 相关基础类型（从服务文件中复制过来避免循环依赖）
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

// 路由相关类型
export interface RouteConfig {
  path: string;
  name: string;
  component: () => Promise<{ default: unknown }>;
  meta?: {
    title?: string;
    requiresAuth?: boolean;
  };
}

// 缓存相关类型定义
export interface CacheItem<T = unknown> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
  cleanupInterval?: number;
}

// 调度器相关类型定义
export interface SchedulerTask {
  id: string;
  name: string;
  interval: number;
  handler: () => Promise<void> | void;
  enabled: boolean;
  lastRun?: number;
  nextRun?: number;
  runCount: number;
  errorCount: number;
  lastError?: string;
}

export interface SchedulerOptions {
  maxConcurrentTasks?: number;
  errorRetryDelay?: number;
  enableLogging?: boolean;
}

// GitHub数据服务相关类型
export interface GitHubDataSnapshot {
  user?: GitHubUser;
  repositories: GitHubRepository[];
  searchResults: Array<{
    query: string;
    results: GitHubRepository[];
    total_count: number;
  }>;
  rateLimit: RateLimitInfo;
  timestamp: number;
}

export interface GitHubDataConfig {
  username?: string;
  repositories?: string[];
  searchQueries?: string[];
  updateInterval?: number;
}
