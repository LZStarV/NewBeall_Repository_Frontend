import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from 'vue-router';
import staticRoutes from './staticRoutes';
import type { Component } from 'vue';
import { addRouteRecursive } from './utils';

// 导入所有布局组件
const layouts = import.meta.glob('../layouts/*.vue', { eager: true }) as Record<
    string,
    { default: Component }
>;

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
    const routePath =
        layoutFolderName === 'main' ? '/' : `/${layoutFolderName}`;

    const route: RouteRecordRaw = {
        path: routePath,
        component: layouts[layoutPath].default,
        children: [],
        meta: { layoutName }, // 添加标识，便于后续查找
    };

    layoutRoutes.push(route);
}

// 假设 MainLayout 是默认布局，统一将页面路由嵌套到其 children
const mainLayoutRoute = layoutRoutes.find(
    (route) => route.meta?.layoutName === 'Main',
);
if (!mainLayoutRoute) {
    throw new Error('MainLayout not found');
}

// 遍历所有页面，添加到 MainLayout 的子路由
for (const path in pages) {
    const component = pages[path];
    const pagePath = path.replace('../pages/', '');
    const segments = pagePath.split('/');

    // 将所有页面路由嵌套到 MainLayout 的 children
    addRouteRecursive(segments, component, mainLayoutRoute.children!);
}

// 移除 otherRoutes，因为所有页面已嵌套到 MainLayout
const otherRoutes: RouteRecordRaw[] = [];

// 合并最终路由
const routes: RouteRecordRaw[] = [
    ...layoutRoutes,
    ...otherRoutes,
    ...staticRoutes,
];
console.log('Final routes:', routes);

const router = createRouter({
    history: createWebHistory(), // HTML5模式
    routes: routes,
});

// 全局前置守卫
router.beforeEach((_to, _from, next) => {
    next(); // 确保导航继续
});

// 全局后置钩子
router.afterEach((_to, _from) => {
    // 可在此添加页面加载后的逻辑
});

export default router;
