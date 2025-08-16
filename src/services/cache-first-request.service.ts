import { globalCache } from './cache.service';

export interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  cacheTtl?: number; // 自定义缓存时间（毫秒）
  skipCache?: boolean; // 跳过缓存，强制请求
}

export interface CacheFirstResponse<T = any> {
  data: T;
  fromCache: boolean;
  timestamp: number;
  error?: string;
}

export class CacheFirstRequestService {
  private readonly DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5分钟

  /**
   * 缓存优先的请求策略
   * @param key 缓存键
   * @param requestOptions 请求选项
   * @returns Promise<CacheFirstResponse<T>>
   */
  async request<T = any>(
    key: string,
    requestOptions: RequestOptions
  ): Promise<CacheFirstResponse<T>> {
    try {
      // 1. 检查是否跳过缓存
      if (!requestOptions.skipCache) {
        // 2. 尝试从缓存获取数据
        const cachedData = this.getCachedData<T>(key);
        if (cachedData) {
          console.log(`缓存命中: ${key}`);
          return {
            data: cachedData,
            fromCache: true,
            timestamp: Date.now()
          };
        }
      }

      // 3. 缓存未命中或已过期，发起API请求
      console.log(`缓存未命中，发起API请求: ${key}`);
      const apiData = await this.makeApiRequest<T>(requestOptions);

      // 4. 更新缓存
      this.updateCache(key, apiData, requestOptions.cacheTtl);

      return {
        data: apiData,
        fromCache: false,
        timestamp: Date.now()
      };

    } catch (error) {
      // 5. API请求失败时的错误处理
      return this.handleRequestError<T>(key, error);
    }
  }

  /**
   * 从缓存获取数据
   */
  private getCachedData<T>(key: string): T | null {
    try {
      return globalCache.get<T>(key);
    } catch (error) {
      console.error(`缓存读取失败: ${key}`, error);
      return null;
    }
  }

  /**
   * 发起API请求
   */
  private async makeApiRequest<T>(options: RequestOptions): Promise<T> {
    const {
      url,
      method = 'GET',
      headers = {},
      body
    } = options;

    const requestConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body && method !== 'GET') {
      requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(url, requestConfig);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text() as T;
    }
  }

  /**
   * 更新缓存
   */
  private updateCache<T>(key: string, data: T, customTtl?: number): void {
    try {
      const ttl = customTtl || this.DEFAULT_CACHE_TTL;
      globalCache.set(key, data, ttl);
      console.log(`缓存更新: ${key} (TTL: ${ttl}ms)`);
    } catch (error) {
      console.error(`缓存写入失败: ${key}`, error);
    }
  }

  /**
   * 处理请求错误
   */
  private handleRequestError<T>(key: string, error: any): CacheFirstResponse<T> {
    console.error(`API请求失败: ${key}`, error);

    // 尝试返回过期的缓存数据作为降级方案
    const staleData = this.getStaleData<T>(key);
    if (staleData) {
      console.warn(`API请求失败，返回过期缓存数据: ${key}`);
      return {
        data: staleData,
        fromCache: true,
        timestamp: Date.now(),
        error: `API请求失败，返回过期数据: ${error.message || error}`
      };
    }

    // 如果没有任何缓存数据，抛出错误
    throw new Error(`请求失败且无缓存数据可用: ${error.message || error}`);
  }

  /**
   * 获取过期的缓存数据（用于降级）
   */
  private getStaleData<T>(key: string): T | null {
    try {
      // 直接从缓存Map中获取，不检查过期时间
      const cache = (globalCache as any).cache;
      const item = cache.get(key);
      return item ? item.data : null;
    } catch (error) {
      console.error(`获取过期缓存数据失败: ${key}`, error);
      return null;
    }
  }

  /**
   * 预热缓存
   */
  async warmupCache<T>(key: string, requestOptions: RequestOptions): Promise<void> {
    try {
      await this.request<T>(key, { ...requestOptions, skipCache: true });
      console.log(`缓存预热完成: ${key}`);
    } catch (error) {
      console.error(`缓存预热失败: ${key}`, error);
    }
  }

  /**
   * 清除特定缓存
   */
  clearCache(key: string): boolean {
    return globalCache.delete(key);
  }

  /**
   * 检查缓存是否存在且有效
   */
  isCacheValid(key: string): boolean {
    return globalCache.has(key);
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats() {
    return globalCache.getStats();
  }
}

// 单例实例
export const cacheFirstRequest = new CacheFirstRequestService();

// 便捷方法
export const cachedFetch = <T = any>(
  key: string,
  url: string,
  options?: Omit<RequestOptions, 'url'>
): Promise<CacheFirstResponse<T>> => {
  return cacheFirstRequest.request<T>(key, { url, ...options });
};

// 使用示例和类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// 常用的缓存键生成器
export const createCacheKey = (prefix: string, params: Record<string, any>): string => {
  const paramString = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');
  
  return `${prefix}:${paramString}`;
};