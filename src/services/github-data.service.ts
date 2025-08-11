import { GitHubApiService } from './github-api.service';
import type { GitHubRepository, GitHubUser } from './github-api.service';

export interface GitHubDataConfig {
  username?: string;
  repositories?: string[];
  searchQueries?: string[];
  updateInterval?: number;
}

export interface GitHubDataSnapshot {
  user?: GitHubUser;
  repositories: GitHubRepository[];
  searchResults: Array<{
    query: string;
    results: GitHubRepository[];
    total_count: number;
  }>;
  rateLimit: {
    limit: number;
    remaining: number;
    reset: number;
    used: number;
  };
  timestamp: number;
}

// 简化的GitHub数据服务，专注于基本功能
export class GitHubDataService {
  private apiService: GitHubApiService;
  private config: Required<GitHubDataConfig>;
  private cache: Map<string, { data: unknown; timestamp: number; ttl: number }> = new Map();

  constructor(apiConfig: Record<string, unknown> = {}, dataConfig: GitHubDataConfig = {}) {
    this.apiService = new GitHubApiService(apiConfig);
    
    this.config = {
      username: dataConfig.username || '',
      repositories: dataConfig.repositories || [],
      searchQueries: dataConfig.searchQueries || [],
      updateInterval: dataConfig.updateInterval || 5 * 60 * 1000 // 5分钟
    };
  }

  private isExpired(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return true;
    return Date.now() - item.timestamp > item.ttl;
  }

  private setCache(key: string, data: unknown, ttl: number = this.config.updateInterval): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getCache<T>(key: string): T | null {
    if (this.isExpired(key)) {
      this.cache.delete(key);
      return null;
    }
    const item = this.cache.get(key);
    return item ? item.data : null;
  }

  async getUserInfo(username: string): Promise<GitHubUser | null> {
    const cacheKey = `user:${username}`;
    const cached = this.getCache<GitHubUser>(cacheKey);
    if (cached) return cached;

    try {
      const user = await this.apiService.getUserInfo(username);
      this.setCache(cacheKey, user);
      return user;
    } catch (error) {
      console.error(`获取用户信息失败: ${username}`, error);
      return null;
    }
  }

  async getUserRepositories(username: string): Promise<GitHubRepository[]> {
    const cacheKey = `repos:${username}`;
    const cached = this.getCache<GitHubRepository[]>(cacheKey);
    if (cached) return cached;

    try {
      const repos = await this.apiService.getUserRepositories(username, {
        per_page: 100,
        sort: 'updated'
      });
      this.setCache(cacheKey, repos);
      return repos;
    } catch (error) {
      console.error(`获取用户仓库失败: ${username}`, error);
      return [];
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository | null> {
    const cacheKey = `repo:${owner}/${repo}`;
    const cached = this.getCache<GitHubRepository>(cacheKey);
    if (cached) return cached;

    try {
      const repository = await this.apiService.getRepository(owner, repo);
      this.setCache(cacheKey, repository);
      return repository;
    } catch (error) {
      console.error(`获取仓库信息失败: ${owner}/${repo}`, error);
      return null;
    }
  }

  clearCache(): void {
    this.cache.clear();
    console.log('缓存已清除');
  }

  getStatus(): {
    cacheSize: number;
    config: Required<GitHubDataConfig>;
  } {
    return {
      cacheSize: this.cache.size,
      config: this.config
    };
  }
}