import type { Component } from 'vue';
import { type RouteRecordRaw } from 'vue-router';

// 递归构建嵌套路由
export function addRouteRecursive(
    segments: string[],
    component: Component,
    parentRoutes: RouteRecordRaw[],
) {
    const [current, ...rest] = segments;
    if (!current) return;

    const isIndexFile = current.toLowerCase() === 'index.vue';

    // 如果是 index.vue，说明是当前路径的组件
    if (isIndexFile) {
        const existingRoot = parentRoutes.find((r) => r.path === '');
        if (existingRoot) {
            existingRoot.component = component;
        } else {
            parentRoutes.push({
                path: '',
                component,
                meta: { title: '首页' },
            });
        }
        return;
    }

    const pathSegment =
        current
            .replace(/\.vue$/, '')
            .replace(/\[(\w+)\]/g, ':$1') // 动态参数
            .replace(/Page$/, '') // 移除Page后缀
            .replace(/home$/i, '') // index.vue 代表父级路径
            .toLowerCase() || '';

    let existingRoute = parentRoutes.find(
        (route) => route.path === pathSegment,
    );

    if (!existingRoute) {
        existingRoute = {
            path: pathSegment,
            children: [],
            meta: { title: generateTitle(current) }, // 动态生成 meta.title
        };
        console.log(existingRoute);
        parentRoutes.push(existingRoute);
    }

    if (
        (rest.length === 1 && rest[0].toLowerCase() === 'index.vue') ||
        rest.length === 0
    ) {
        existingRoute.component = component;
        if (!existingRoute.meta) existingRoute.meta = {};
        existingRoute.meta.title = generateTitle(current); // 为叶子节点设置 title
    } else {
        if (!existingRoute.children) existingRoute.children = [];
        addRouteRecursive(rest, component, existingRoute.children);
    }
}

// 根据文件名生成标题
function generateTitle(segment: string): string {
    return segment
        .replace(/\.vue$/, '')
        .replace(/\[(\w+)\]/g, '$1') // 动态参数名作为标题部分
        .replace(/Page$/, '')
        .replace(/index$/i, '首页')
        .replace(/(^\w|-\w)/g, (match) =>
            match.toLowerCase().replace('-', ' '),
        );
}
