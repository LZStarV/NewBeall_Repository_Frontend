import areaApi from '@/api/area/areaApi';
import ordersApi from '@/api/orders/ordersApi';
import type { Province, City, Area } from '@/api/area/areaApi.type';

// 缓存地区数据，避免重复请求
const areaCache = {
  provinces: new Map<number, Province>(),
  cities: new Map<number, City>(),
  areas: new Map<number, Area>(),
  quoteTypes: new Map<number, Map<number, { name: string; value: number }>>(),
};

// 公共错误处理函数
const handleApiError = (error: unknown, operation: string) => {
  console.error(`${operation}失败:`, error);
  return '';
};

// 公共缓存检查函数
const getFromCache = <T>(
  cache: Map<number, T>,
  key: number,
  nameKey: keyof T,
): string => {
  const item = cache.get(key);
  return item ? String(item[nameKey]) : '';
};

/**
 * 获取省份名称
 * @param provinceCode 省份代码
 * @returns 省份名称，如果未找到则返回空字符串
 */
export async function getProvinceName(provinceCode: number): Promise<string> {
  if (!provinceCode) return '';

  // 检查缓存
  const cached = getFromCache(
    areaCache.provinces,
    provinceCode,
    'provinceName',
  );
  if (cached) return cached;

  try {
    const provinces = await areaApi.getProvince();
    if (provinces && Array.isArray(provinces)) {
      // 更新缓存
      provinces.forEach((province) => {
        areaCache.provinces.set(province.provinceCode, province);
      });

      const province = provinces.find((p) => p.provinceCode === provinceCode);
      return province?.provinceName || '';
    }
  } catch (error) {
    return handleApiError(error, '获取省份数据');
  }

  return '';
}

/**
 * 获取城市名称
 * @param cityCode 城市代码
 * @param provinceCode 省份代码（可选，用于优化请求）
 * @returns 城市名称，如果未找到则返回空字符串
 */
export async function getCityName(
  cityCode: number,
  provinceCode?: number,
): Promise<string> {
  if (!cityCode) return '';

  // 检查缓存
  const cached = getFromCache(areaCache.cities, cityCode, 'cityName');
  if (cached) return cached;

  try {
    if (!provinceCode) {
      // 获取所有省份的城市
      const provinces = await areaApi.getProvince();
      if (provinces && Array.isArray(provinces)) {
        // 更新省份缓存
        provinces.forEach((province) => {
          areaCache.provinces.set(province.provinceCode, province);
        });

        // 遍历所有省份获取城市
        for (const province of provinces) {
          const cities = await areaApi.getCityOfProvince(
            province.provinceCode.toString(),
          );
          if (cities && Array.isArray(cities)) {
            cities.forEach((city) => {
              areaCache.cities.set(city.cityCode, city);
            });
          }
        }
      }
    } else {
      // 直接获取指定省份的城市
      const cities = await areaApi.getCityOfProvince(provinceCode.toString());
      if (cities && Array.isArray(cities)) {
        cities.forEach((city) => {
          areaCache.cities.set(city.cityCode, city);
        });
      }
    }

    return getFromCache(areaCache.cities, cityCode, 'cityName');
  } catch (error) {
    return handleApiError(error, '获取城市数据');
  }
}

/**
 * 获取区县名称
 * @param areaCode 区县代码
 * @param cityCode 城市代码（可选，用于优化请求）
 * @returns 区县名称，如果未找到则返回空字符串
 */
export async function getAreaName(
  areaCode: number,
  cityCode?: number,
): Promise<string> {
  if (!areaCode) return '';

  // 检查缓存
  const cached = getFromCache(areaCache.areas, areaCode, 'areaName');
  if (cached) return cached;

  try {
    if (!cityCode) {
      // 获取所有地区数据
      const provinces = await areaApi.getProvince();
      if (provinces && Array.isArray(provinces)) {
        // 更新省份缓存
        provinces.forEach((province) => {
          areaCache.provinces.set(province.provinceCode, province);
        });

        // 遍历所有省份和城市获取区县
        for (const province of provinces) {
          const cities = await areaApi.getCityOfProvince(
            province.provinceCode.toString(),
          );
          if (cities && Array.isArray(cities)) {
            cities.forEach((city) => {
              areaCache.cities.set(city.cityCode, city);
            });

            // 获取每个城市的区县
            for (const city of cities) {
              const areas = await areaApi.getAreaOfCity(
                city.cityCode.toString(),
              );
              if (areas && Array.isArray(areas)) {
                areas.forEach((area) => {
                  areaCache.areas.set(area.areaCode, area);
                });
              }
            }
          }
        }
      }
    } else {
      // 直接获取指定城市的区县
      const areas = await areaApi.getAreaOfCity(cityCode.toString());
      if (areas && Array.isArray(areas)) {
        areas.forEach((area) => {
          areaCache.areas.set(area.areaCode, area);
        });
      }
    }

    return getFromCache(areaCache.areas, areaCode, 'areaName');
  } catch (error) {
    return handleApiError(error, '获取区县数据');
  }
}

/**
 * 批量获取地区名称
 * @param provinceCode 省份代码
 * @param cityCode 城市代码
 * @param areaCode 区县代码
 * @returns 包含省份、城市、区县名称的对象
 */
export async function getAreaNames(
  provinceCode?: number,
  cityCode?: number,
  areaCode?: number,
): Promise<{ province: string; city: string; area: string }> {
  const [province, city, area] = await Promise.all([
    provinceCode ? getProvinceName(provinceCode) : Promise.resolve(''),
    cityCode ? getCityName(cityCode, provinceCode) : Promise.resolve(''),
    areaCode ? getAreaName(areaCode, cityCode) : Promise.resolve(''),
  ]);

  return { province, city, area };
}

// 公共报价类型处理函数
const fetchQuoteTypes = async (category: number, ordersId?: string) => {
  try {
    const response = await ordersApi.getOrderType(category, ordersId);
    if (response.data && Array.isArray(response.data)) {
      // 更新缓存
      const categoryCache = new Map<number, { name: string; value: number }>();
      response.data.forEach((item: { name: string; value: number }) => {
        categoryCache.set(item.value, item);
      });
      areaCache.quoteTypes.set(category, categoryCache);
      return response.data;
    }
  } catch (error) {
    handleApiError(error, `获取报价类型数据 (category: ${category})`);
  }
  return [];
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

  // 检查缓存
  if (areaCache.quoteTypes.has(category)) {
    const categoryCache = areaCache.quoteTypes.get(category)!;
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
 * 清除地区缓存
 */
export function clearAreaCache(): void {
  areaCache.provinces.clear();
  areaCache.cities.clear();
  areaCache.areas.clear();
}

/**
 * 清除报价类型缓存
 */
export function clearQuoteTypeCache(): void {
  areaCache.quoteTypes.clear();
}

/**
 * 清除所有缓存
 */
export function clearAllCache(): void {
  clearAreaCache();
  clearQuoteTypeCache();
}
