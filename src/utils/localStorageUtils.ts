// 缓存数据结构
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// localStorage 缓存管理类
export class LocalStorageCache {
  private prefix: string;
  private defaultExpiry: number;

  constructor(prefix: string, defaultExpiry: number = 24 * 60 * 60 * 1000) {
    this.prefix = prefix;
    this.defaultExpiry = defaultExpiry;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  // 设置缓存
  set<T>(key: string, data: T, customExpiry?: number): void {
    try {
      const expiry = customExpiry || this.defaultExpiry;
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + expiry,
      };
      localStorage.setItem(this.getKey(key), JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('缓存设置失败:', error);
    }
  }

  // 获取缓存
  get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(this.getKey(key));
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      
      // 检查是否过期
      if (Date.now() > cacheItem.expiry) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('缓存读取失败:', error);
      this.remove(key);
      return null;
    }
  }

  // 删除缓存
  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.warn('缓存删除失败:', error);
    }
  }

  // 清除所有相关缓存
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('缓存清除失败:', error);
    }
  }

  // 检查缓存是否存在且未过期
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // 清除指定模式的缓存
  clearByPattern(pattern: string): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes(`${this.prefix}${pattern}`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('缓存清除失败:', error);
    }
  }
}

// 公共错误处理函数
export const handleApiError = (error: unknown, operation: string): string => {
  console.error(`${operation}失败:`, error);
  return '';
};

// 创建缓存实例的工厂函数
export const createCache = (prefix: string, expiry?: number): LocalStorageCache => {
  return new LocalStorageCache(prefix, expiry);
};