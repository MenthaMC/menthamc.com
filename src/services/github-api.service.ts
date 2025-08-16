import { api } from '@/main'
import { cacheFirstRequest, createCacheKey, type CacheFirstResponse } from './cache-first-request.service'

export interface GitHubConfig {
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

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

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export class GitHubApiService {
  private config: Required<GitHubConfig>;

  constructor(config: GitHubConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || `${api}/github`,
      timeout: config.timeout || 15000,
      retryAttempts: config.retryAttempts || 5,
      retryDelay: config.retryDelay || 2000
    };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithTimeout(url: string, options: Record<string, unknown> = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'MenthaMC-Website',
        ...(options.headers as Record<string, string> || {})
      };

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // 使用新的日志系统替代console.warn
        // console.warn(`GitHub API ${context} 失败 (尝试 ${attempt}/${this.config.retryAttempts}):`, error);

        // 检查是否是速率限制或权限错误
        if (error instanceof Error && 'status' in error) {
          const status = (error as Error & { status: number }).status;
          if (status === 403) {
            // 403错误可能是速率限制或权限问题
            const delayMs = this.config.retryDelay * Math.pow(2, attempt - 1); // 指数退避
            // console.log(`API访问受限 (403)，等待 ${delayMs}ms 后重试... (尝试 ${attempt}/${this.config.retryAttempts})`);
            await this.delay(delayMs);
            continue;
          }
          if (status === 429) {
            // 429是明确的速率限制
            const delayMs = this.config.retryDelay * Math.pow(2, attempt - 1);
            // console.log(`API速率限制 (429)，等待 ${delayMs}ms 后重试... (尝试 ${attempt}/${this.config.retryAttempts})`);
            await this.delay(delayMs);
            continue;
          }
        }

        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay * attempt);
        }
      }
    }

    throw new Error(`GitHub API ${context} 在 ${this.config.retryAttempts} 次尝试后仍然失败: ${lastError!.message}`);
  }

  async getUserInfo(username: string): Promise<GitHubUser> {
    const cacheKey = createCacheKey('github:user', { username });
    
    const response = await cacheFirstRequest.request<GitHubUser>(cacheKey, {
      url: `${this.config.baseUrl}/users/${username}`,
      method: 'GET',
      cacheTtl: 10 * 60 * 1000 // 10分钟缓存
    });

    return response.data;
  }

  async getUserRepositories(username: string, options: {
    per_page?: number;
    page?: number;
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
  } = {}): Promise<GitHubRepository[]> {
    const cacheKey = createCacheKey('github:user-repos', { username, ...options });
    const params = new URLSearchParams({
      per_page: (options.per_page || 30).toString(),
      page: (options.page || 1).toString(),
      sort: options.sort || 'updated',
      direction: options.direction || 'desc'
    });

    const response = await cacheFirstRequest.request<GitHubRepository[]>(cacheKey, {
      url: `${this.config.baseUrl}/users/${username}/repos?${params}`,
      method: 'GET',
      cacheTtl: 5 * 60 * 1000 // 5分钟缓存
    });

    return response.data;
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    const cacheKey = createCacheKey('github:repo', { owner, repo });
    
    const response = await cacheFirstRequest.request<GitHubRepository>(cacheKey, {
      url: `${this.config.baseUrl}/repos/${owner}/${repo}`,
      method: 'GET',
      cacheTtl: 10 * 60 * 1000 // 10分钟缓存
    });

    return response.data;
  }

  async searchRepositories(query: string, options: {
    sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
    order?: 'desc' | 'asc';
    per_page?: number;
    page?: number;
  } = {}): Promise<{ items: GitHubRepository[]; total_count: number }> {
    const cacheKey = createCacheKey('github:search', { query, ...options });
    const params = new URLSearchParams({
      q: query,
      sort: options.sort || 'stars',
      order: options.order || 'desc',
      per_page: (options.per_page || 30).toString(),
      page: (options.page || 1).toString()
    });

    const response = await cacheFirstRequest.request<{ items: GitHubRepository[]; total_count: number }>(cacheKey, {
      url: `${this.config.baseUrl}/search/repositories?${params}`,
      method: 'GET',
      cacheTtl: 3 * 60 * 1000 // 3分钟缓存（搜索结果变化较快）
    });

    return response.data;
  }

  async getBranches(owner: string, repo: string, options: {
    per_page?: number;
    page?: number;
  } = {}): Promise<GitHubBranch[]> {
    const cacheKey = createCacheKey('github:branches', { owner, repo, ...options });
    const params = new URLSearchParams({
      per_page: (options.per_page || 30).toString(),
      page: (options.page || 1).toString()
    });

    const response = await cacheFirstRequest.request<GitHubBranch[]>(cacheKey, {
      url: `${this.config.baseUrl}/repos/${owner}/${repo}/branches?${params}`,
      method: 'GET',
      cacheTtl: 5 * 60 * 1000 // 5分钟缓存
    });

    return response.data;
  }

  async getRateLimit(): Promise<{
    resources: {
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
    };
    rate: {
      limit: number;
      remaining: number;
      reset: number;
      used: number;
    };
  }> {
    const cacheKey = 'github:rate-limit';
    
    const response = await cacheFirstRequest.request(cacheKey, {
      url: `${this.config.baseUrl}/rate_limit`,
      method: 'GET',
      cacheTtl: 30 * 1000 // 30秒缓存（速率限制信息变化较快）
    });

    return response.data;
  }
}
