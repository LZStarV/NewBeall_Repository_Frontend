/// <reference types="vite/client" />

// 环境变量类型定义
interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_APP_ENV: string;
    readonly VITE_DEBUG: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// 解决Vue文件导入报红
declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<unknown, unknown, unknown>;
    export default component;
}

// 支持别名路径类型识别
declare module '@/*' {
    export default any;
}

declare module 'virtual:svg-icons-register';
