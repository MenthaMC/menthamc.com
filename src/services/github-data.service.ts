import { GitHubApiService } from './github-api.service';
import { cacheFirstRequest, createCacheKey } from './cache-first-request.service';
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
    return item ? item.data as T : null;
  }

  async getUserInfo(username: string): Promise<GitHubUser | null> {
    const cacheKey = createCacheKey('github-data:user', { username });
    
    try {
      const response = await cacheFirstRequest.request<GitHubUser>(cacheKey, {
        url: `${this.apiService['config'].baseUrl}/users/${username}`,
        method: 'GET',
        cacheTtl: 10 * 60 * 1000 // 10分钟缓存
      });
      
      return response.data;
    } catch (error) {
      console.error(`获取用户信息失败: ${username}`, error);
      return null;
    }
  }

  async getUserRepositories(username: string): Promise<GitHubRepository[]> {
    const cacheKey = createCacheKey('github-data:user-repos', { username });
    
    try {
      const response = await cacheFirstRequest.request<GitHubRepository[]>(cacheKey, {
        url: `${this.apiService['config'].baseUrl}/users/${username}/repos?per_page=100&sort=updated`,
        method: 'GET',
        cacheTtl: 5 * 60 * 1000 // 5分钟缓存
      });
      
      return response.data;
    } catch (error) {
      console.error(`获取用户仓库失败: ${username}`, error);
      return [];
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository | null> {
    const cacheKey = createCacheKey('github-data:repo', { owner, repo });
    
    try {
      const response = await cacheFirstRequest.request<GitHubRepository>(cacheKey, {
        url: `${this.apiService['config'].baseUrl}/repos/${owner}/${repo}`,
        method: 'GET',
        cacheTtl: 10 * 60 * 1000 // 10分钟缓存
      });
      
      return response.data;
    } catch (error) {
      console.error(`获取仓库信息失败: ${owner}/${repo}`, error);
      return null;
    }
  }

  clearCache(): void {
    // 清除缓存优先服务的相关缓存
    const cacheStats = cacheFirstRequest.getCacheStats();
    let clearedCount = 0;
    
    cacheStats.items.forEach(item => {
      if (item.key.startsWith('github-data:')) {
        if (cacheFirstRequest.clearCache(item.key)) {
          clearedCount++;
        }
      }
    });
    
    // 清除本地缓存
    this.cache.clear();
    console.log(`GitHub数据服务缓存已清除: ${clearedCount} 项全局缓存 + ${this.cache.size} 项本地缓存`);
  }

  getStatus(): {
    cacheSize: number;
    globalCacheSize: number;
    config: Required<GitHubDataConfig>;
    cacheKeys: string[];
  } {
    const cacheStats = cacheFirstRequest.getCacheStats();
    const githubDataCaches = cacheStats.items.filter(item => item.key.startsWith('github-data:'));
    
    return {
      cacheSize: this.cache.size,
      globalCacheSize: githubDataCaches.length,
      config: this.config,
      cacheKeys: githubDataCaches.map(item => item.key)
    };
  }
import { GitHubApiService } from './github-api.service';
import { cacheFirstRequest, createCacheKey } from './cache-first-request.service';
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
    return item ? item.data as T : null;
  }

  async getUserInfo(username: string): Promise<GitHubUser | null> {
    const cacheKey = createCacheKey('github-data:user', { username });
    
    try {
      const response = await cacheFirstRequest.request<GitHubUser>(cacheKey, {
        url: `${this.apiService['config'].baseUrl}/users/${username}`,
        method: 'GET',
        cacheTtl: 10 * 60 * 1000 // 10分钟缓存
      });
      
      return response.data;
    } catch (error) {
      console.error(`获取用户信息失败: ${username}`, error);
      return null;
    }
  }

  async getUserRepositories(username: string): Promise<GitHubRepository[]> {
    const cacheKey = createCacheKey('github-data:user-repos', { username });
    
    try {
      const response = await cacheFirstRequest.request<GitHubRepository[]>(cacheKey, {
        url: `${this.apiService['config'].baseUrl}/users/${username}/repos?per_page=100&sort=updated`,
        method: 'GET',
        cacheTtl: 5 * 60 * 1000 // 5分钟缓存
      });
      
      return response.data;
    } catch (error) {
      console.error(`获取用户仓库失败: ${username}`, error);
      return [];
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository | null> {
    const cacheKey = createCacheKey('github-data:repo', { owner, repo });
    
    try {
      const response = await cacheFirstRequest.request<GitHubRepository>(cacheKey, {
        url: `${this.apiService['config'].baseUrl}/repos/${owner}/${repo}`,
        method: 'GET',
        cacheTtl: 10 * 60 * 1000 // 10分钟缓存
      });
      
      return response.data;
    } catch (error) {
      console.error(`获取仓库信息失败: ${owner}/${repo}`, error);
      return null;
    }
  }

import { GitHubApiService } from './github-api.service';
import { cacheFirstRequest, createCacheKey } from './cache-first-request.service';
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
    return item ? item.data as T : null;
  }

  async getUserInfo(username: string): Promise<GitHubUser | null> {
    const cacheKey = createCacheKey('github-data:user', { username });
    
    try {
      const response = await cacheFirstRequest.request<GitHubUser>(cacheKey, {
        url: `${this.apiService['config'].baseUrl}/users/${username}`,
        method: 'GET',
        cacheTtl: 10 * 60 * 1000 // 10分钟缓存
      });
      
      return response.data;
    } catch (error) {
      console.error(`获取用户信息失败: ${username}`, error);
      return null;
    }
  }

  async getUserRepositories(username: string): Promise<GitHubRepository[]> {
    const cacheKey = createCacheKey('github-data:user-repos', { username });
    
    try {
      const response = await cacheFirstRequest.request<GitHubRepository[]>(cacheKey, {
        url: `${this.apiService['config'].baseUrl}/users/${username}/repos?per_page=100&sort=updated`,
        method: 'GET',
        cacheTtl: 5 * 60 * 1000 // 5分钟缓存
      });
      
      return response.data;
    } catch (error) {
      console.error(`获取用户仓库失败: ${username}`, error);
      return [];
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository | null> {
    const cacheKey = createCacheKey('github-data:repo', { owner, repo });
    
    try {
      const response = await cacheFirstRequest.request<GitHubRepository>(cacheKey, {
        url: `${this.apiService['config'].baseUrl}/repos/${owner}/${repo}`,
        method: 'GET',
        cacheTtl: 10 * 60 * 1000 // 10分钟缓存
      });
      
      return response.data;
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