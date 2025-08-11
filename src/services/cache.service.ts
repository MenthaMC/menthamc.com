export interface CacheItem<T = unknown> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheOptions {
  ttl?: number; // 生存时间（毫秒）
  maxSize?: number; // 最大缓存项数量
  cleanupInterval?: number; // 清理间隔（毫秒）
}

export class CacheService {
  private cache = new Map<string, CacheItem>();
  private cleanupTimer?: ReturnType<typeof setInterval>;
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 默认5分钟
      maxSize: options.maxSize || 1000,
      cleanupInterval: options.cleanupInterval || 60 * 1000 // 默认1分钟清理一次
    };

    this.startCleanupTimer();
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.options.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    // 使用更高效的迭代方式
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        keysToDelete.push(key);
      }
    }

    // 批量删除过期项
    let deletedCount = 0;
    for (const key of keysToDelete) {
      if (this.cache.delete(key)) {
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(`缓存清理: 删除了 ${deletedCount} 个过期项`);
    }

    // 如果缓存大小仍然超过限制，删除最旧的项
    if (this.cache.size > this.options.maxSize) {
      const entries = Array.from(this.cache.entries());
      // 按时间戳排序，最旧的在前
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const excessCount = this.cache.size - this.options.maxSize;
      const itemsToRemove = entries.slice(0, excessCount);
      
      let removedCount = 0;
      for (const [key] of itemsToRemove) {
        if (this.cache.delete(key)) {
          removedCount++;
        }
      }

      if (removedCount > 0) {
        console.log(`缓存大小限制: 删除了 ${removedCount} 个最旧项`);
      }
    }
  }

  set<T>(key: string, data: T, customTtl?: number): void {
    const now = Date.now();
    const ttl = customTtl || this.options.ttl;
    
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl
    };

    this.cache.set(key, item);
    console.log(`缓存设置: ${key} (TTL: ${ttl}ms)`);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now > item.expiresAt) {
      this.cache.delete(key);
      console.log(`缓存过期: ${key}`);
      return null;
    }

    console.log(`缓存命中: ${key}`);
    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    const now = Date.now();
    if (now > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`缓存删除: ${key}`);
    }
    return deleted;
  }

  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`缓存清空: 删除了 ${size} 个项`);
  }

  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    items: Array<{ key: string; timestamp: number; expiresAt: number; ttl: number }>;
  } {
    const now = Date.now();
    const items = Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      timestamp: item.timestamp,
      expiresAt: item.expiresAt,
      ttl: item.expiresAt - now
    }));

    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
      hitRate: 0, // 可以添加命中率统计
      items
    };
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    this.clear();
  }
}

// 单例模式的全局缓存实例
export const globalCache = new CacheService({
  ttl: 5 * 60 * 1000, // 5分钟
  maxSize: 500,
  cleanupInterval: 60 * 1000 // 1分钟清理一次
});