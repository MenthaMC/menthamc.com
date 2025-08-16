import { ref, computed, type Ref } from 'vue';
import { cacheFirstRequest, type RequestOptions, type CacheFirstResponse } from '@/services/cache-first-request.service';

export interface UseCachedRequestOptions extends Omit<RequestOptions, 'url'> {
  immediate?: boolean; // 是否立即执行
  onSuccess?: (data: any, fromCache: boolean) => void;
  onError?: (error: Error) => void;
}

export interface UseCachedRequestReturn<T> {
  data: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  fromCache: Ref<boolean>;
  timestamp: Ref<number>;
  execute: () => Promise<void>;
  refresh: () => Promise<void>;
  clear: () => void;
}

/**
 * Vue组合式函数：缓存优先的请求
 */
export function useCachedRequest<T = any>(
  cacheKey: string,
  url: string,
  options: UseCachedRequestOptions = {}
): UseCachedRequestReturn<T> {
  
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const fromCache = ref(false);
  const timestamp = ref(0);

  const {
    immediate = false,
    onSuccess,
    onError,
    ...requestOptions
  } = options;

  // 执行请求
  const execute = async (): Promise<void> => {
    if (loading.value) return;

    loading.value = true;
    error.value = null;

    try {
      const response: CacheFirstResponse<T> = await cacheFirstRequest.request<T>(
        cacheKey,
        {
          url,
          ...requestOptions
        }
      );

      data.value = response.data;
      fromCache.value = response.fromCache;
      timestamp.value = response.timestamp;

      if (response.error) {
        error.value = response.error;
      }

      onSuccess?.(response.data, response.fromCache);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      error.value = errorMessage;
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      loading.value = false;
    }
  };

  // 强制刷新（跳过缓存）
  const refresh = async (): Promise<void> => {
    const originalSkipCache = requestOptions.skipCache;
    requestOptions.skipCache = true;
    
    await execute();
    
    requestOptions.skipCache = originalSkipCache;
  };

  // 清除缓存和数据
  const clear = (): void => {
    cacheFirstRequest.clearCache(cacheKey);
    data.value = null;
    error.value = null;
    fromCache.value = false;
    timestamp.value = 0;
  };

  // 计算属性
  const isStale = computed(() => !!error.value && fromCache.value);
  const lastUpdateTime = computed(() => 
    timestamp.value ? new Date(timestamp.value).toLocaleString() : ''
  );

  // 立即执行
  if (immediate) {
    execute();
  }

  return {
    data,
    loading,
    error,
    fromCache,
    timestamp,
    execute,
    refresh,
    clear,
    // 额外的计算属性
    isStale,
    lastUpdateTime
  } as UseCachedRequestReturn<T> & {
    isStale: Ref<boolean>;
    lastUpdateTime: Ref<string>;
  };
}

/**
 * 专门用于列表数据的缓存请求
 */
export function useCachedList<T = any>(
  cacheKey: string,
  url: string,
  options: UseCachedRequestOptions & {
    initialData?: T[];
  } = {}
) {
  const { initialData = [], ...restOptions } = options;
  
  const result = useCachedRequest<T[]>(cacheKey, url, restOptions);
  
  // 初始化数据
  if (!result.data.value) {
    result.data.value = initialData;
  }

  // 列表特有的方法
  const addItem = (item: T) => {
    if (result.data.value) {
      result.data.value.push(item);
    }
  };

  const removeItem = (predicate: (item: T) => boolean) => {
    if (result.data.value) {
      const index = result.data.value.findIndex(predicate);
      if (index > -1) {
        result.data.value.splice(index, 1);
      }
    }
  };

  const updateItem = (predicate: (item: T) => boolean, updates: Partial<T>) => {
    if (result.data.value) {
      const index = result.data.value.findIndex(predicate);
      if (index > -1) {
        result.data.value[index] = { ...result.data.value[index], ...updates };
      }
    }
  };

  return {
    ...result,
    addItem,
    removeItem,
    updateItem,
    isEmpty: computed(() => !result.data.value || result.data.value.length === 0),
    count: computed(() => result.data.value?.length || 0)
  };
}

/**
 * 用于分页数据的缓存请求
 */
export function useCachedPagination<T = any>(
  baseCacheKey: string,
  baseUrl: string,
  options: UseCachedRequestOptions & {
    pageSize?: number;
  } = {}
) {
  const { pageSize = 20, ...restOptions } = options;
  
  const currentPage = ref(1);
  const totalPages = ref(0);
  const totalItems = ref(0);
  
  const cacheKey = computed(() => `${baseCacheKey}:page:${currentPage.value}`);
  const url = computed(() => `${baseUrl}?page=${currentPage.value}&limit=${pageSize}`);
  
  const result = useCachedRequest<{
    items: T[];
    pagination: {
      page: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>(cacheKey.value, url.value, {
    ...restOptions,
    onSuccess: (data, fromCache) => {
      if (data.pagination) {
        totalPages.value = data.pagination.totalPages;
        totalItems.value = data.pagination.totalItems;
      }
      restOptions.onSuccess?.(data, fromCache);
    }
  });

  const goToPage = async (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      await result.execute();
    }
  };

  const nextPage = () => goToPage(currentPage.value + 1);
  const prevPage = () => goToPage(currentPage.value - 1);

  return {
    ...result,
    currentPage,
    totalPages,
    totalItems,
    pageSize: ref(pageSize),
    goToPage,
    nextPage,
    prevPage,
    hasNext: computed(() => currentPage.value < totalPages.value),
    hasPrev: computed(() => currentPage.value > 1),
    items: computed(() => result.data.value?.items || [])
  };
}