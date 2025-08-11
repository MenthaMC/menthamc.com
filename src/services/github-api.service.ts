export interface GitHubConfig {
  token?: string;
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
      token: config.token || import.meta.env.VITE_GITHUB_TOKEN || '',
      baseUrl: config.baseUrl || 'https://api.github.com',
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

      // 安全地添加认证头
      if (this.config.token && this.config.token.trim()) {
        headers['Authorization'] = `Bearer ${this.config.token}`;
      }

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
        
        console.warn(`GitHub API ${context} 失败 (尝试 ${attempt}/${this.config.retryAttempts}):`, error);

        // 检查是否是速率限制或权限错误
        if (error instanceof Error && 'status' in error) {
          const status = (error as Error & { status: number }).status;
          if (status === 403) {
            // 403错误可能是速率限制或权限问题
            const delayMs = this.config.retryDelay * Math.pow(2, attempt - 1); // 指数退避
            console.log(`API访问受限 (403)，等待 ${delayMs}ms 后重试... (尝试 ${attempt}/${this.config.retryAttempts})`);
            await this.delay(delayMs);
            continue;
          }
          if (status === 429) {
            // 429是明确的速率限制
            const delayMs = this.config.retryDelay * Math.pow(2, attempt - 1);
            console.log(`API速率限制 (429)，等待 ${delayMs}ms 后重试... (尝试 ${attempt}/${this.config.retryAttempts})`);
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
    return this.executeWithRetry(async () => {
      const response = await this.fetchWithTimeout(`${this.config.baseUrl}/users/${username}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json() as GitHubUser;
    }, `获取用户信息 (${username})`);
  }

  async getUserRepositories(username: string, options: {
    per_page?: number;
    page?: number;
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
  } = {}): Promise<GitHubRepository[]> {
    return this.executeWithRetry(async () => {
      const params = new URLSearchParams({
        per_page: (options.per_page || 30).toString(),
        page: (options.page || 1).toString(),
        sort: options.sort || 'updated',
        direction: options.direction || 'desc'
      });

      const response = await this.fetchWithTimeout(
        `${this.config.baseUrl}/users/${username}/repos?${params}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json() as GitHubRepository[];
    }, `获取用户仓库 (${username})`);
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.executeWithRetry(async () => {
      const response = await this.fetchWithTimeout(`${this.config.baseUrl}/repos/${owner}/${repo}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json() as GitHubRepository;
    }, `获取仓库信息 (${owner}/${repo})`);
  }

  async searchRepositories(query: string, options: {
    sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
    order?: 'desc' | 'asc';
    per_page?: number;
    page?: number;
  } = {}): Promise<{ items: GitHubRepository[]; total_count: number }> {
    return this.executeWithRetry(async () => {
      const params = new URLSearchParams({
        q: query,
        sort: options.sort || 'stars',
        order: options.order || 'desc',
        per_page: (options.per_page || 30).toString(),
        page: (options.page || 1).toString()
      });

      const response = await this.fetchWithTimeout(
        `${this.config.baseUrl}/search/repositories?${params}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        items: data.items as GitHubRepository[],
        total_count: data.total_count
      };
    }, `搜索仓库 (${query})`);
  }

  async getBranches(owner: string, repo: string, options: {
    per_page?: number;
    page?: number;
  } = {}): Promise<GitHubBranch[]> {
    return this.executeWithRetry(async () => {
      const params = new URLSearchParams({
        per_page: (options.per_page || 30).toString(),
        page: (options.page || 1).toString()
      });

      const response = await this.fetchWithTimeout(
        `${this.config.baseUrl}/repos/${owner}/${repo}/branches?${params}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json() as GitHubBranch[];
    }, `获取分支列表 (${owner}/${repo})`);
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
    return this.executeWithRetry(async () => {
      const response = await this.fetchWithTimeout(`${this.config.baseUrl}/rate_limit`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    }, '获取API限制信息');
  }
}
