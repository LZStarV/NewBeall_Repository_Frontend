import ordersApi from '@/api/orders/ordersApi';
import { createCache, handleApiError } from './localStorageUtils';

// localStorage 缓存配置
const CACHE_CONFIG = {
  KEYS: {
    QUOTE_TYPES: 'quote_types',
  },
};

// 创建缓存实例
const cache = createCache('order_type_cache_');

// 内存缓存报价类型数据，避免重复请求
const orderTypeCache = {
  quoteTypes: new Map<number, Map<number, QuoteTypeOption>>(),
};

export interface QuoteTypeOption {
  name: string;
  value: number;
  selected: boolean;
}

// 获取报价类型数据（带缓存）
export async function getQuoteTypes(category: number, ordersId?: string): Promise<QuoteTypeOption[]> {
  try {
    // 检查 localStorage 缓存
    const cacheKey = `${CACHE_CONFIG.KEYS.QUOTE_TYPES}_${category}${ordersId ? `_${ordersId}` : ''}`;
    const cachedData = cache.get<QuoteTypeOption[]>(cacheKey);
    if (cachedData) {
      // 更新内存缓存
      const categoryCache = new Map<number, QuoteTypeOption>();
      cachedData.forEach((item) => {
        categoryCache.set(item.value, item);
      });
      orderTypeCache.quoteTypes.set(category, categoryCache);
      return cachedData;
    }

    // 从 API 获取数据
    const response = await ordersApi.getOrderType(category, ordersId);
    if (response.data && Array.isArray(response.data)) {
      // 更新内存缓存
      const categoryCache = new Map<number, QuoteTypeOption>();
      response.data.forEach((item: QuoteTypeOption) => {
        categoryCache.set(item.value, item);
      });
      orderTypeCache.quoteTypes.set(category, categoryCache);

      // 更新 localStorage 缓存
      cache.set(cacheKey, response.data);

      return response.data;
    }
  } catch (error) {
    handleApiError(error, `获取报价类型数据 (category: ${category})`);
  }
  return [];
}

// 内部函数：获取报价类型数据（保持向后兼容）
const fetchQuoteTypes = async (category: number, ordersId?: string) => {
  return await getQuoteTypes(category, ordersId);
};

/**
 * 获取报价类型名称
 * @param quoteTypeId 报价类型ID
 * @param category 报价类型分类 (1-7)
 * @param ordersId 订单ID（可选）
 * @returns 报价类型名称，如果未找到则返回空字符串
 */
export async function getQuoteTypeName(
  quoteTypeId: number,
  category: number,
  ordersId?: string,
): Promise<string> {
  if (!quoteTypeId || !category) return '';

  // 检查内存缓存
  if (orderTypeCache.quoteTypes.has(category)) {
    const categoryCache = orderTypeCache.quoteTypes.get(category)!;
    if (categoryCache.has(quoteTypeId)) {
      return categoryCache.get(quoteTypeId)!.name;
    }
  }

  const quoteTypes = await fetchQuoteTypes(category, ordersId);
  const quoteType = quoteTypes.find(
    (item: { value: number }) => item.value === quoteTypeId,
  );
  return quoteType?.name || '';
}

/**
 * 批量获取报价类型名称
 * @param quoteTypeIds 报价类型ID数组
 * @param category 报价类型分类 (1-7)
 * @param ordersId 订单ID（可选）
 * @returns 报价类型名称数组
 */
export async function getQuoteTypeNames(
  quoteTypeIds: number[],
  category: number,
  ordersId?: string,
): Promise<string[]> {
  if (!quoteTypeIds.length || !category) return [];

  const quoteTypes = await fetchQuoteTypes(category, ordersId);
  return quoteTypeIds.map((id) => {
    const quoteType = quoteTypes.find(
      (item: { value: number }) => item.value === id,
    );
    return quoteType?.name || '';
  });
}

/**
 * 清除报价类型缓存
 */
export function clearQuoteTypeCache(): void {
  orderTypeCache.quoteTypes.clear();

  // 清除 localStorage 中的报价类型缓存
  cache.clearByPattern(CACHE_CONFIG.KEYS.QUOTE_TYPES);
}

/**
 * 清除所有订单类型缓存
 */
export function clearAllOrderTypeCache(): void {
  clearQuoteTypeCache();
  cache.clear();
}
