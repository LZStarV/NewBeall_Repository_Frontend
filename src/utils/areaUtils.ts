import areaApi from '@/api/area/areaApi';
import type { Province, City, Area } from '@/api/area/areaApi.type';
import { createCache, handleApiError } from './localStorageUtils';

// localStorage 缓存配置
const CACHE_CONFIG = {
  KEYS: {
    PROVINCES: 'provinces',
    CITIES: 'cities',
    AREAS: 'areas',
  },
};

// 创建缓存实例
const cache = createCache('area_cache_');

// 内存缓存地区数据，避免重复请求
const areaCache = {
  provinces: new Map<number, Province>(),
  cities: new Map<number, City>(),
  areas: new Map<number, Area>(),
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
 * 获取所有省份数据（带缓存）
 * @returns 省份数组
 */
export async function getProvinces(): Promise<Province[]> {
  // 先检查 localStorage 缓存
  const cachedProvinces = cache.get<Province[]>(CACHE_CONFIG.KEYS.PROVINCES);
  if (cachedProvinces) {
    // 更新内存缓存
    cachedProvinces.forEach((province) => {
      areaCache.provinces.set(province.provinceCode, province);
    });
    return cachedProvinces;
  }

  try {
    const provinces = await areaApi.getProvince();
    if (provinces && Array.isArray(provinces)) {
      // 更新 localStorage 缓存
      cache.set(CACHE_CONFIG.KEYS.PROVINCES, provinces);
      
      // 更新内存缓存
      provinces.forEach((province) => {
        areaCache.provinces.set(province.provinceCode, province);
      });

      return provinces;
    }
  } catch (error) {
    handleApiError(error, '获取省份数据');
  }

  return [];
}

/**
 * 获取省份名称
 * @param provinceCode 省份代码
 * @returns 省份名称，如果未找到则返回空字符串
 */
export async function getProvinceName(provinceCode: number): Promise<string> {
  if (!provinceCode) return '';

  // 检查内存缓存
  const cached = getFromCache(
    areaCache.provinces,
    provinceCode,
    'provinceName',
  );
  if (cached) return cached;

  // 获取所有省份数据
  const provinces = await getProvinces();
  const province = provinces.find((p) => p.provinceCode === provinceCode);
  return province?.provinceName || '';
}

/**
 * 获取省份下的城市数据（带缓存）
 * @param provinceCode 省份代码
 * @returns 城市数组
 */
export async function getCitiesOfProvince(provinceCode: number): Promise<City[]> {
  if (!provinceCode) return [];

  const cacheKey = `${CACHE_CONFIG.KEYS.CITIES}_${provinceCode}`;
  
  // 先检查 localStorage 缓存
  const cachedCities = cache.get<City[]>(cacheKey);
  if (cachedCities) {
    // 更新内存缓存
    cachedCities.forEach((city) => {
      areaCache.cities.set(city.cityCode, city);
    });
    return cachedCities;
  }

  try {
    const cities = await areaApi.getCityOfProvince(provinceCode.toString());
    if (cities && Array.isArray(cities)) {
      // 更新 localStorage 缓存
      cache.set(cacheKey, cities);
      
      // 更新内存缓存
      cities.forEach((city) => {
        areaCache.cities.set(city.cityCode, city);
      });

      return cities;
    }
  } catch (error) {
    handleApiError(error, '获取城市数据');
  }

  return [];
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

  // 检查内存缓存
  const cached = getFromCache(areaCache.cities, cityCode, 'cityName');
  if (cached) return cached;

  try {
    if (!provinceCode) {
      // 获取所有省份的城市
      const provinces = await getProvinces();
      
      // 遍历所有省份获取城市
      for (const province of provinces) {
        const cities = await getCitiesOfProvince(province.provinceCode);
        const city = cities.find((c) => c.cityCode === cityCode);
        if (city) {
          return city.cityName;
        }
      }
    } else {
      // 直接获取指定省份的城市
      const cities = await getCitiesOfProvince(provinceCode);
      const city = cities.find((c) => c.cityCode === cityCode);
      if (city) {
        return city.cityName;
      }
    }

    return getFromCache(areaCache.cities, cityCode, 'cityName');
  } catch (error) {
    return handleApiError(error, '获取城市数据');
  }
}

/**
 * 获取城市下的区县数据（带缓存）
 * @param cityCode 城市代码
 * @returns 区县数组
 */
export async function getAreasOfCity(cityCode: number): Promise<Area[]> {
  if (!cityCode) return [];

  const cacheKey = `${CACHE_CONFIG.KEYS.AREAS}_${cityCode}`;
  
  // 先检查 localStorage 缓存
  const cachedAreas = cache.get<Area[]>(cacheKey);
  if (cachedAreas) {
    // 更新内存缓存
    cachedAreas.forEach((area) => {
      areaCache.areas.set(area.areaCode, area);
    });
    return cachedAreas;
  }

  try {
    const areas = await areaApi.getAreaOfCity(cityCode.toString());
    if (areas && Array.isArray(areas)) {
      // 更新 localStorage 缓存
      cache.set(cacheKey, areas);
      
      // 更新内存缓存
      areas.forEach((area) => {
        areaCache.areas.set(area.areaCode, area);
      });

      return areas;
    }
  } catch (error) {
    handleApiError(error, '获取区县数据');
  }

  return [];
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

  // 检查内存缓存
  const cached = getFromCache(areaCache.areas, areaCode, 'areaName');
  if (cached) return cached;

  try {
    if (!cityCode) {
      // 获取所有地区数据
      const provinces = await getProvinces();
      
      // 遍历所有省份和城市获取区县
      for (const province of provinces) {
        const cities = await getCitiesOfProvince(province.provinceCode);
        
        // 获取每个城市的区县
        for (const city of cities) {
          const areas = await getAreasOfCity(city.cityCode);
          const area = areas.find((a) => a.areaCode === areaCode);
          if (area) {
            return area.areaName;
          }
        }
      }
    } else {
      // 直接获取指定城市的区县
      const areas = await getAreasOfCity(cityCode);
      const area = areas.find((a) => a.areaCode === areaCode);
      if (area) {
        return area.areaName;
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

/**
 * 清除地区缓存
 */
export function clearAreaCache(): void {
  areaCache.provinces.clear();
  areaCache.cities.clear();
  areaCache.areas.clear();
  
  // 清除 localStorage 中的地区缓存
  cache.remove(CACHE_CONFIG.KEYS.PROVINCES);
  
  // 清除所有城市和区县缓存
  cache.clearByPattern(CACHE_CONFIG.KEYS.CITIES);
  cache.clearByPattern(CACHE_CONFIG.KEYS.AREAS);
}

/**
 * 清除所有地区缓存
 */
export function clearAllCache(): void {
  clearAreaCache();
  cache.clear();
}

/**
 * 根据省份名称查找省份代码
 * @param provinceName 省份名称
 * @returns 省份代码，如果未找到则返回undefined
 */
export async function getProvinceCode(provinceName: string): Promise<number | undefined> {
  if (!provinceName) return undefined;

  try {
    // 使用带缓存的 getProvinces 函数
    const provinces = await getProvinces();
    if (provinces && Array.isArray(provinces)) {
      const province = provinces.find((p) => p.provinceName === provinceName);
      return province?.provinceCode;
    }
  } catch (error) {
    handleApiError(error, '获取省份数据');
  }

  return undefined;
}

/**
 * 根据城市名称查找城市代码
 * @param cityName 城市名称
 * @param provinceCode 省份代码（可选，用于优化请求）
 * @returns 城市代码，如果未找到则返回undefined
 */
export async function getCityCode(
  cityName: string,
  provinceCode?: number,
): Promise<number | undefined> {
  if (!cityName) return undefined;

  try {
    if (!provinceCode) {
      // 获取所有省份，使用带缓存的函数
      const provinces = await getProvinces();
      if (provinces && Array.isArray(provinces)) {
        // 遍历所有省份获取城市
        for (const province of provinces) {
          const cities = await getCitiesOfProvince(province.provinceCode);
          if (cities && Array.isArray(cities)) {
            // 查找匹配的城市
            const city = cities.find((c) => c.cityName === cityName);
            if (city) {
              return city.cityCode;
            }
          }
        }
      }
    } else {
      // 直接获取指定省份的城市，使用带缓存的函数
      const cities = await getCitiesOfProvince(provinceCode);
      if (cities && Array.isArray(cities)) {
        const city = cities.find((c) => c.cityName === cityName);
        return city?.cityCode;
      }
    }
  } catch (error) {
    handleApiError(error, '获取城市数据');
  }

  return undefined;
}

/**
 * 根据区县名称查找区县代码
 * @param areaName 区县名称
 * @param cityCode 城市代码（可选，用于优化请求）
 * @returns 区县代码，如果未找到则返回undefined
 */
export async function getAreaCode(
  areaName: string,
  cityCode?: number,
): Promise<number | undefined> {
  if (!areaName) return undefined;

  try {
    if (!cityCode) {
      // 获取所有地区数据，使用带缓存的函数
      const provinces = await getProvinces();
      if (provinces && Array.isArray(provinces)) {
        // 遍历所有省份和城市获取区县
        for (const province of provinces) {
          const cities = await getCitiesOfProvince(province.provinceCode);
          if (cities && Array.isArray(cities)) {
            // 获取每个城市的区县
            for (const city of cities) {
              const areas = await getAreasOfCity(city.cityCode);
              if (areas && Array.isArray(areas)) {
                // 查找匹配的区县
                const area = areas.find((a) => a.areaName === areaName);
                if (area) {
                  return area.areaCode;
                }
              }
            }
          }
        }
      }
    } else {
      // 直接获取指定城市的区县，使用带缓存的函数
      const areas = await getAreasOfCity(cityCode);
      if (areas && Array.isArray(areas)) {
        const area = areas.find((a) => a.areaName === areaName);
        return area?.areaCode;
      }
    }
  } catch (error) {
    handleApiError(error, '获取区县数据');
  }

  return undefined;
}

/**
 * 批量根据地区名称查找对应编号
 * @param provinceName 省份名称
 * @param cityName 城市名称
 * @param areaName 区县名称
 * @returns 包含省份、城市、区县编号的对象
 */
export async function getAreaCodes(
  provinceName?: string,
  cityName?: string,
  areaName?: string,
): Promise<{ province?: number; city?: number; area?: number }> {
  let provinceCode: number | undefined;
  let cityCode: number | undefined;
  let areaCode: number | undefined;

  // 按级联关系依次查找
  if (provinceName) {
    provinceCode = await getProvinceCode(provinceName);
  }

  if (cityName && provinceCode) {
    cityCode = await getCityCode(cityName, provinceCode);
  } else if (cityName) {
    cityCode = await getCityCode(cityName);
  }

  if (areaName && cityCode) {
    areaCode = await getAreaCode(areaName, cityCode);
  } else if (areaName) {
    areaCode = await getAreaCode(areaName);
  }

  return { 
    province: provinceCode, 
    city: cityCode, 
    area: areaCode 
  };
}
