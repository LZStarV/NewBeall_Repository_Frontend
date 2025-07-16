/**
 * 环境配置
 */

export interface EnvConfig {
    API_BASE_URL: string;
    APP_TITLE: string;
    APP_VERSION: string;
    APP_ENV: string;
    DEBUG: boolean;
}

class Environment {
    private config: EnvConfig;

    constructor() {
        this.config = {
            API_BASE_URL:
                import.meta.env.VITE_API_BASE_URL ||
                'http://localhost:3000/api',
            APP_TITLE: import.meta.env.VITE_APP_TITLE || 'NewBeall Repository',
            APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
            APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
            DEBUG: import.meta.env.VITE_DEBUG === 'true' || false,
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
}

const env = new Environment();

export default env;
