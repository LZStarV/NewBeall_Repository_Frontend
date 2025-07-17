import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import staticRoutes from './staticRoutes';
import type { Component } from 'vue';
import { addRouteRecursive } from './utils';
import { hasToken, removeToken } from '../stores/auth';
import { validateToken } from '../api/auth';

// 导入所有布局组件
const layouts = import.meta.glob('../layouts/*.vue', { eager: true }) as Record<
  string,
  { default: Component }
>;

// 导入所有页面组件
const pages = import.meta.glob('../pages/**/*.vue');

// 过滤掉components和component文件夹下的vue文件，不生成路由
const filteredPages: Record<string, () => Promise<unknown>> = {};
for (const path in pages) {
  if (!path.includes('/components/') && !path.includes('/component/')) {
    filteredPages[path] = pages[path];
  }
}

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
for (const path in filteredPages) {
  const component = filteredPages[path];
  const pagePath = path.replace('../pages/', '');
  const segments = pagePath.split('/');

  // 将所有页面路由嵌套到 MainLayout 的 children
  addRouteRecursive(segments, component, mainLayoutRoute.children!);
}

// 移除与静态路由重复的页面路由
const staticPaths = new Set(staticRoutes.map((route) => route.path.slice(1))); // 裁切掉第一个'/'
mainLayoutRoute.children = mainLayoutRoute.children!.filter(
  (route) => !staticPaths.has(route.path),
);

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
router.beforeEach(async (to, _from, next) => {
  // // 定义不需要token验证的路由
  // const publicRoutes = ['/default', '/login'];

  // // 如果是公开路由，直接放行
  // if (publicRoutes.includes(to.path)) {
  //     next();
  //     return;
  // }

  // // 检查是否有token
  // if (!hasToken()) {
  //     // 没有token，跳转到默认页面
  //     next('/default');
  //     return;
  // }

  // try {
  //     // 验证token有效性
  //     const isValid = await validateToken();

  //     if (isValid) {
  //         // token有效，放行
  //         next();
  //     } else {
  //         // token无效，跳转到登录页面
  //         next('/login');
  //     }
  // } catch (error) {
  //     // 验证过程出错，清除token并跳转到登录页面
  //     removeToken();
  //     next('/login');
  // }
  next();
});

// 全局后置钩子
router.afterEach((_to, _from) => {
  // 可在此添加页面加载后的逻辑
});

export default router;
