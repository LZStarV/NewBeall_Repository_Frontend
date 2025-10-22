import clinetApi from '@/api/client/clinetApi';
import { createCache, handleApiError } from './localStorageUtils';
import type { ClientCategoryNameRes } from '@/api/client/clinetApi.type';

// localStorage 缓存配置
const CACHE_CONFIG = {
  KEYS: {
    CLIENT_CATEGORY: 'client_category',
  },
};

// 创建缓存实例
const cache = createCache('client_cache_');

// 获取客户分类数据
export async function getClientCategoryList(): Promise<ClientCategoryNameRes[]> {
  try {
    // 检查 localStorage 缓存
    const cacheKey = `${CACHE_CONFIG.KEYS.CLIENT_CATEGORY}`;
    const cachedData = cache.get<ClientCategoryNameRes[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // 从 API 获取数据
    const response = await clinetApi.getClientCategoryName();
    if (response.data && Array.isArray(response.data)) {
      // 更新 localStorage 缓存
      cache.set(cacheKey, response.data);
      return response.data;
    }
  } catch (error) {
    handleApiError(error, `获取客户分类数据错误`);
  }
  return [];
}

/**
 * 清除所有客户分类缓存
 */
export function clearAllClientCategoryCache(): void {
  cache.clearByPattern(CACHE_CONFIG.KEYS.CLIENT_CATEGORY); // 清除客户分类缓存
  cache.clear();
}

/**
 * 获取人员规模数据
 */
export function getClientSizeList(clientSizeId: number): string {
  switch (clientSizeId) {
    case 0:
      return '<10人';
    case 1:
      return '10-20人';
    case 2:
      return '20-50人';
    case 3:
      return '50-100人';
    case 4:
      return '100-500人';
    case 5:
      return '500人';
    case 6:
      return '待查';
    default:
      return '';
  }
}