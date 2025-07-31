/**
 * 环境配置
 */

export interface EnvConfig {
  API_BASE_URL: string;
  APP_TITLE: string;
  APP_VERSION: string;
  APP_ENV: string;
  DEBUG: boolean;
  PAD_LAYOUT_BREAKPOINT: number;
  DESKTOP_LAYOUT_BREAKPOINT: number;
  REQUEST_TIMEOUT: number;
  // WebSocket相关配置
  WS_BASE_URL: string;
  WS_PROXY_URL: string;
  WS_TARGET_ORIGIN: string;
}

class Environment {
  private config: EnvConfig;

  constructor() {
    this.config = {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
      APP_TITLE: import.meta.env.VITE_APP_TITLE || 'NewBeall Repository',
      APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
      APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
      DEBUG: import.meta.env.VITE_DEBUG === 'true' || false,
      PAD_LAYOUT_BREAKPOINT: import.meta.env.VITE_PAD_LAYOUT_BREAKPOINT || 768,
      DESKTOP_LAYOUT_BREAKPOINT:
        import.meta.env.VITE_DESKTOP_LAYOUT_BREAKPOINT || 1024,
      REQUEST_TIMEOUT: import.meta.env.VITE_REQUEST_TIMEOUT || 10000,
      // WebSocket配置
      WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || '',
      WS_PROXY_URL: import.meta.env.VITE_WS_PROXY_URL || '',
      WS_TARGET_ORIGIN: import.meta.env.VITE_WS_TARGET_ORIGIN || '',
    };
  }

  /**
   * 获取 API 基础 URL
   */
  getApiBaseUrl(): string {
    return this.config.API_BASE_URL;
  }

  /**
   * 获取应用标题
   */
  getAppTitle(): string {
    return this.config.APP_TITLE;
  }

  /**
   * 获取应用版本
   */
  getAppVersion(): string {
    return this.config.APP_VERSION;
  }

  /**
   * 获取当前环境
   */
  getAppEnv(): string {
    return this.config.APP_ENV;
  }

  /**
   * 是否为开发环境
   */
  isDevelopment(): boolean {
    return this.config.APP_ENV === 'development';
  }

  /**
   * 是否为生产环境
   */
  isProduction(): boolean {
    return this.config.APP_ENV === 'production';
  }

  /**
   * 是否开启调试模式
   */
  isDebug(): boolean {
    return this.config.DEBUG;
  }

  /**
   * 获取完整配置
   */
  getConfig(): EnvConfig {
    return { ...this.config };
  }

  /**
   * 获取平板布局断点
   */
  getPadLayoutBreakpoint(): number {
    return this.config.PAD_LAYOUT_BREAKPOINT;
  }

  /**
   * 获取桌面布局断点
   */
  getDesktopLayoutBreakpoint(): number {
    return this.config.DESKTOP_LAYOUT_BREAKPOINT;
  }

  /**
   * 获取请求超时时间
   */
  getRequestTimeout(): number {
    return this.config.REQUEST_TIMEOUT;
  }

  /**
   * 获取WebSocket基础URL（生产环境）
   */
  getWsBaseUrl(): string {
    return this.config.WS_BASE_URL;
  }

  /**
   * 获取WebSocket代理URL（开发环境）
   */
  getWsProxyUrl(): string {
    return this.config.WS_PROXY_URL;
  }

  /**
   * 获取WebSocket目标Origin（开发环境代理目标）
   */
  getWsTargetOrigin(): string {
    return this.config.WS_TARGET_ORIGIN;
  }
}
const env = new Environment();

export default env;
