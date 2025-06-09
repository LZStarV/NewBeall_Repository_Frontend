import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import staticRoutes from './staticRoutes';
import type { Component } from 'vue';
import { addRouteRecursive } from './utils';

// 导入所有布局组件
const layouts = import.meta.glob('../layouts/*.vue', { eager: true }) as Record<string, { default: Component }>;

// 导入所有页面组件
const pages = import.meta.glob('../pages/**/*.vue');

// 存放布局组件的路由
const layoutRoutes: RouteRecordRaw[] = [];

for (const layoutPath in layouts) {
    // MainLayout.vue -> 'main'
    const match = layoutPath.match(/\.\.\/layouts\/(.*)Layout\.vue$/);
    const layoutName = match ? match[1] : null;
    const layoutFolderName = layoutName?.toLowerCase();

    // 约定 'main'文件夹对应根路径'/'，其他文件夹对应'/foldername'
    const routePath = layoutFolderName === 'main' ? '/' : `/${layoutFolderName}`;

    const route: RouteRecordRaw = {
        path: routePath,
        component: layouts[layoutPath].default,
        children: [],
        meta: { layoutName }  // 添加标识，便于后续查找
    }

    layoutRoutes.push(route);
}

// 用于存放其他独立的顶级路由
const otherRoutes: RouteRecordRaw[] = [];

// 遍历所有页面，添加到对应的布局或顶层路由中
for (const path in pages) {
    const component = pages[path];
    const pagePath = path.replace('../pages/', '');
    const segments = pagePath.split('/');

    const layoutSegment = segments.shift(); // 第一级作为布局目录
    const layoutRoute = layoutRoutes.find(
        route => (route.meta as any)?.layoutName?.toLowerCase() === layoutSegment?.toLowerCase()
    );

    if (layoutRoute && layoutRoute.children) {
        addRouteRecursive(segments, component, layoutRoute.children);
    } else {
        // 非布局页面作为顶级路由
        const routePath = [layoutSegment, ...segments]
            .join('/')
            .replace(/\.vue$/, '')
            .replace(/Page$/, '')
            .replace(/\[(\w+)\]/g, ':$1')
            .replace(/index$/i, '')
            .toLowerCase();

        otherRoutes.push({
            path: `/${routePath}`,
            component: component,
        });
    }
}

// 合并最终路由
const routes: RouteRecordRaw[] = [
    ...layoutRoutes,
    ...otherRoutes,
    ...staticRoutes,
]

const router = createRouter({
    history: createWebHistory(),  // HTML5模式
    routes: routes
});

// 全局前置守卫
router.beforeEach((_to, _from, next) => {
    // 返回 false 以取消导航
    next();
});

// 全局后置钩子
router.afterEach((_to, _from) => {
    
});

export default router;