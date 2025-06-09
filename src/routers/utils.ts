import type { Component } from 'vue';
import { type RouteRecordRaw } from 'vue-router';

// 递归构建嵌套路由
export function addRouteRecursive(
    segments: string[],
    component: Component,
    parentRoutes: RouteRecordRaw[]
) {
    const [current, ...rest] = segments;
    if (!current) return;

    const isIndexFile = current.toLowerCase() === 'index.vue';

    // 如果是 index.vue，说明是当前路径的组件
    if (isIndexFile) {
        const existingRoot = parentRoutes.find(r => r.path === '');
        if (existingRoot) {
            existingRoot.component = component;
        } else {
            parentRoutes.push({
                path: '',
                component: component
            });
        }
        return;
    }

    const pathSegment = current
        .replace(/\.vue$/, '')
        .replace(/\[(\w+)\]/g, ':$1')     // 动态参数
        .replace(/Page$/, '')             // 移除Page后缀
        .replace(/home$/i, '')   // index.vue 代表父级路径
        .toLowerCase() || '';

    let existingRoute = parentRoutes.find(route => route.path === pathSegment);

    if (!existingRoute) {
        existingRoute = {
            path: pathSegment,
            children: []
        };
        parentRoutes.push(existingRoute);
    }

    if ((rest.length === 1 && rest[0].toLowerCase() === 'index.vue') || rest.length === 0) {
        existingRoute.component = component;
    } else {
        if (!existingRoute.children) existingRoute.children = [];
        addRouteRecursive(rest, component, existingRoute.children);
    }
}
