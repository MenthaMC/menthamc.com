import { cachedFetch, cacheFirstRequest, createCacheKey, type ApiResponse } from '../cache-first-request.service';
import { logger } from '../../utils/logger';

// 示例1: 基本用法 - 获取用户信息
export async function getUserInfo(userId: string) {
  const cacheKey = `user:${userId}`;
  
  try {
    const response = await cachedFetch<ApiResponse<{ id: string; name: string; email: string }>>(
      cacheKey,
      `https://api.example.com/users/${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer your-token'
        },
        cacheTtl: 10 * 60 * 1000 // 10分钟缓存
      }
    );

    logger.info('用户信息获取结果', {
      fromCache: response.fromCache,
      timestamp: new Date(response.timestamp).toLocaleString(),
      data: response.data
    });

    return response.data;
  } catch (error) {
    logger.error('获取用户信息失败', error);
    throw error;
  }
}

// 示例2: 带参数的API请求
export async function searchProducts(query: string, page: number = 1, limit: number = 20) {
  const cacheKey = createCacheKey('products:search', { query, page, limit });
  
  try {
    const response = await cacheFirstRequest.request<ApiResponse<Array<{ id: string; name: string; price: number }>>>(
      cacheKey,
      {
        url: 'https://api.example.com/products/search',
        method: 'POST',
        body: { query, page, limit },
        cacheTtl: 3 * 60 * 1000 // 3分钟缓存
      }
    );

    if (response.error) {
      logger.warn('API请求有问题，但返回了缓存数据', response.error);
    }

    return {
      products: response.data.data || [],
      fromCache: response.fromCache,
      timestamp: response.timestamp
    };
  } catch (error) {
    logger.error('搜索产品失败', error);
    return {
      products: [],
      fromCache: false,
      timestamp: Date.now(),
      error: error.message
    };
  }
}

// 示例3: 强制刷新数据
export async function refreshUserInfo(userId: string) {
  const cacheKey = `user:${userId}`;
  
  try {
    // 跳过缓存，强制请求最新数据
    const response = await cachedFetch<ApiResponse<{ id: string; name: string; email: string }>>(
      cacheKey,
      `https://api.example.com/users/${userId}`,
      {
        skipCache: true, // 强制刷新
        cacheTtl: 10 * 60 * 1000
      }
    );

    logger.info('强制刷新用户信息完成');
    return response.data;
  } catch (error) {
    logger.error('强制刷新用户信息失败', error);
    throw error;
  }
}

// 示例4: 批量预热缓存
export async function preloadUserData(userIds: string[]) {
  logger.info('开始预热用户数据缓存...');
  
  const promises = userIds.map(async (userId) => {
    const cacheKey = `user:${userId}`;
    try {
      await cacheFirstRequest.warmupCache(cacheKey, {
        url: `https://api.example.com/users/${userId}`,
        method: 'GET'
      });
      return { userId, success: true };
    } catch (error) {
      logger.error(`预热用户 ${userId} 数据失败`, error);
      return { userId, success: false, error: error.message };
    }
  });

  const results = await Promise.allSettled(promises);
  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  
  logger.info(`缓存预热完成: ${successful}/${userIds.length} 成功`);
  return results;
}

// 示例5: 缓存管理工具
export class CacheManager {
  // 清除用户相关的所有缓存
  static clearUserCaches(userId: string) {
    const patterns = [
      `user:${userId}`,
      `user:${userId}:profile`,
      `user:${userId}:settings`,
      `user:${userId}:orders`
    ];

    let clearedCount = 0;
    patterns.forEach(pattern => {
      if (cacheFirstRequest.clearCache(pattern)) {
        clearedCount++;
      }
    });

    logger.info(`清除用户 ${userId} 相关缓存: ${clearedCount} 项`);
    return clearedCount;
  }

  // 获取缓存状态报告
  static getCacheReport() {
    const stats = cacheFirstRequest.getCacheStats();
    
    return {
      总缓存项数: stats.size,
      最大容量: stats.maxSize,
      使用率: `${((stats.size / stats.maxSize) * 100).toFixed(1)}%`,
      缓存项详情: stats.items.map(item => ({
        键: item.key,
        剩余时间: `${Math.max(0, Math.floor(item.ttl / 1000))}秒`,
        创建时间: new Date(item.timestamp).toLocaleString()
      }))
    };
  }

  // 检查特定缓存的状态
  static checkCacheStatus(key: string) {
    const isValid = cacheFirstRequest.isCacheValid(key);
    return {
      缓存键: key,
      状态: isValid ? '有效' : '无效/不存在',
      检查时间: new Date().toLocaleString()
    };
  }
}

// 示例6: 错误处理和降级策略
export async function getRobustData(dataId: string) {
  const cacheKey = `data:${dataId}`;
  
  try {
    const response = await cachedFetch<ApiResponse<{ id: string; value: unknown }>>(
      cacheKey,
      `https://api.example.com/data/${dataId}`,
      {
        cacheTtl: 5 * 60 * 1000 // 5分钟缓存
      }
    );

    // 检查是否是降级数据
    if (response.error) {
      logger.warn('使用了降级数据', response.error);
      // 可以在UI中显示警告信息
    }

    return {
      data: response.data,
      isStale: !!response.error,
      fromCache: response.fromCache,
      timestamp: response.timestamp
    };

  } catch (error) {
    logger.error('获取数据完全失败', error);
    
    // 返回默认数据或空数据
    return {
      data: null,
      isStale: false,
      fromCache: false,
      timestamp: Date.now(),
      error: error.message
    };
  }
}