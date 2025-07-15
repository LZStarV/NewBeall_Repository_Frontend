/// <reference types="vite/client" />

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
