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

  // 多个备用API端点配置
  private readonly API_ENDPOINTS = [
    `${api}/github`, // 主要代理API
    'https://api.github.com', // GitHub官方API
    'https://github.com/api/v3', // GitHub备用端点
    // 可以添加更多备用API端点
  ];

  // 带多个备用API的请求方法
  private async fetchWithMultipleFallbacks(path: string, timeout: number = 8000): Promise<Response> {
    const errors: Error[] = [];
    
    for (let i = 0; i < this.API_ENDPOINTS.length; i++) {
      const baseUrl = this.API_ENDPOINTS[i];
      const fullUrl = path.startsWith('http') ? path : `${baseUrl}/${path.replace(/^\//, '')}`;
      
      try {
        console.log(`尝试API端点 ${i + 1}/${this.API_ENDPOINTS.length}: ${baseUrl}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(fullUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'MenthaMC-Website'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`API端点 ${i + 1} 调用成功: ${baseUrl}`);
          return response;
        }
        
        const error = new Error(`API端点 ${i + 1} 响应失败: ${response.status} ${response.statusText}`);
        errors.push(error);
        console.warn(error.message);
        
        // 如果是速率限制，等待一下再尝试下一个端点
        if (response.status === 429) {
          await this.delay(1000 * (i + 1)); // 递增延迟
        }
        
      } catch (error) {
        const apiError = new Error(`API端点 ${i + 1} 请求失败: ${error instanceof Error ? error.message : String(error)}`);
        errors.push(apiError);
        console.warn(apiError.message);
        
        // 在尝试下一个端点前短暂延迟
        if (i < this.API_ENDPOINTS.length - 1) {
          await this.delay(500 * (i + 1));
        }
      }
    }
    
    // 所有端点都失败了
    const allErrors = errors.map(e => e.message).join('; ');
    throw new Error(`所有 ${this.API_ENDPOINTS.length} 个API端点都失败了: ${allErrors}`);
  }

  // 智能API选择器 - 根据历史成功率选择最佳端点
  private apiSuccessRates = new Map<string, { success: number; total: number; lastUsed: number }>();
  
  private updateApiStats(endpoint: string, success: boolean): void {
    const stats = this.apiSuccessRates.get(endpoint) || { success: 0, total: 0, lastUsed: 0 };
    stats.total++;
    if (success) stats.success++;
    stats.lastUsed = Date.now();
    this.apiSuccessRates.set(endpoint, stats);
  }
  
  private getBestEndpoint(): string {
    let bestEndpoint = this.API_ENDPOINTS[0];
    let bestScore = 0;
    
    for (const endpoint of this.API_ENDPOINTS) {
      const stats = this.apiSuccessRates.get(endpoint);
      if (!stats) continue;
      
      const successRate = stats.success / stats.total;
      const recency = Math.max(0, 1 - (Date.now() - stats.lastUsed) / (24 * 60 * 60 * 1000)); // 24小时内的权重
      const score = successRate * 0.7 + recency * 0.3;
      
      if (score > bestScore) {
        bestScore = score;
        bestEndpoint = endpoint;
      }
    }
    
    return bestEndpoint;
  }

  // 优化的备用API请求方法
  private async fetchWithSmartFallback(path: string, timeout: number = 8000): Promise<Response> {
    // 首先尝试最佳端点
    const bestEndpoint = this.getBestEndpoint();
    const bestIndex = this.API_ENDPOINTS.indexOf(bestEndpoint);
    
    // 重新排序端点，将最佳端点放在前面
    const orderedEndpoints = [
      bestEndpoint,
      ...this.API_ENDPOINTS.filter(ep => ep !== bestEndpoint)
    ];
    
    const errors: Error[] = [];
    
    for (let i = 0; i < orderedEndpoints.length; i++) {
      const baseUrl = orderedEndpoints[i];
      const fullUrl = path.startsWith('http') ? path : `${baseUrl}/${path.replace(/^\//, '')}`;
      
      try {
        console.log(`尝试API端点 ${i + 1}/${orderedEndpoints.length}: ${baseUrl} ${i === 0 ? '(最佳)' : ''}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(fullUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'MenthaMC-Website'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`API端点调用成功: ${baseUrl}`);
          this.updateApiStats(baseUrl, true);
          return response;
        }
        
        this.updateApiStats(baseUrl, false);
        const error = new Error(`API端点响应失败: ${response.status} ${response.statusText}`);
        errors.push(error);
        console.warn(error.message);
        
        // 如果是速率限制，等待一下再尝试下一个端点
        if (response.status === 429) {
          await this.delay(1000 * (i + 1));
        }
        
      } catch (error) {
        this.updateApiStats(baseUrl, false);
        const apiError = new Error(`API端点请求失败: ${error instanceof Error ? error.message : String(error)}`);
        errors.push(apiError);
        console.warn(apiError.message);
        
        // 在尝试下一个端点前短暂延迟
        if (i < orderedEndpoints.length - 1) {
          await this.delay(500 * (i + 1));
        }
      }
    }
    
    // 所有端点都失败了
    const allErrors = errors.map(e => e.message).join('; ');
    throw new Error(`所有 ${orderedEndpoints.length} 个API端点都失败了: ${allErrors}`);
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

  // 使用智能备用API的缓存请求方法
  private async requestWithFallback<T>(cacheKey: string, apiPath: string, cacheTtl: number = 5 * 60 * 1000): Promise<T> {
    try {
      // 首先尝试从缓存获取数据
      const { globalCache } = await import('./cache.service');
      const cachedData = globalCache.get<T>(cacheKey);
      
      if (cachedData) {
        console.log(`缓存命中: ${cacheKey}`);
        return cachedData;
      }
      
      console.log(`缓存未命中，使用智能备用API: ${cacheKey}`);
      
      // 如果缓存未命中，使用智能备用API
      // 提取API路径（移除baseUrl前缀）
      const cleanPath = apiPath.replace(`${this.config.baseUrl}/`, '');
      const fallbackResponse = await this.fetchWithSmartFallback(cleanPath);
      const data = await fallbackResponse.json();
      
      // 手动更新缓存
      globalCache.set(cacheKey, data, cacheTtl);
      console.log(`缓存更新: ${cacheKey}`);
      
      return data;
    } catch (error) {
      console.error(`API请求失败: ${apiPath}`, error);
      
      // 尝试返回过期的缓存数据作为最后的回退
      try {
        const { globalCache } = await import('./cache.service');
        const cache = (globalCache as any).cache;
        const item = cache.get(cacheKey);
        if (item && item.data) {
          console.warn(`所有API都失败，返回过期缓存数据: ${cacheKey}`);
          return item.data;
        }
      } catch (cacheError) {
        console.error('获取过期缓存数据也失败:', cacheError);
      }
      
      throw error;
    }
  }

  async getUserInfo(username: string): Promise<GitHubUser> {
    const cacheKey = createCacheKey('github:user', { username });
    return this.requestWithFallback<GitHubUser>(
      cacheKey,
      `${this.config.baseUrl}/users/${username}`,
      10 * 60 * 1000 // 10分钟缓存
    );
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

    return this.requestWithFallback<GitHubRepository[]>(
      cacheKey,
      `${this.config.baseUrl}/users/${username}/repos?${params}`,
      5 * 60 * 1000 // 5分钟缓存
    );
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    const cacheKey = createCacheKey('github:repo', { owner, repo });
    return this.requestWithFallback<GitHubRepository>(
      cacheKey,
      `${this.config.baseUrl}/repos/${owner}/${repo}`,
      10 * 60 * 1000 // 10分钟缓存
    );
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

    return this.requestWithFallback<{ items: GitHubRepository[]; total_count: number }>(
      cacheKey,
      `${this.config.baseUrl}/search/repositories?${params}`,
      3 * 60 * 1000 // 3分钟缓存（搜索结果变化较快）
    );
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

    return this.requestWithFallback<GitHubBranch[]>(
      cacheKey,
      `${this.config.baseUrl}/repos/${owner}/${repo}/branches?${params}`,
      5 * 60 * 1000 // 5分钟缓存
    );
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
    return this.requestWithFallback(
      cacheKey,
      `${this.config.baseUrl}/rate_limit`,
      30 * 1000 // 30秒缓存（速率限制信息变化较快）
    );
  }
}
