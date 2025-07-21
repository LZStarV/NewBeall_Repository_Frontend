import {
  ROUTE_CONFIG_MAP,
  getRouteConfigByPath,
  getRouteKeyByPath,
  type RouteConfig,
} from './routeConfig';
import type { Router } from 'vue-router';

/**
 * 路由导航工具类
 */
export class RouteNavigator {
  private router: Router;
  private tabsStore: any; // 根据实际的store类型调整

  constructor(router: Router, tabsStore: any) {
    this.router = router;
    this.tabsStore = tabsStore;
  }

  /**
   * 导航到指定路由
   */
  navigateTo(path: string): void {
    const config = getRouteConfigByPath(path);
    if (!config) {
      console.warn(`Route config not found for path: ${path}`);
      return;
    }

    // 添加标签页
    this.tabsStore.addTab({
      path: config.path,
      title: config.title,
      icon: config.icon,
    });

    // 路由跳转
    this.router.push(path);
  }

  /**
   * 获取当前路由的选中状态key
   */
  getSelectedKey(currentPath: string): string {
    return getRouteKeyByPath(currentPath) || 'dashboard';
  }
}

/**
 * 为路由添加meta信息的工具函数
 * 这个函数可以在路由自动导入时使用，为每个路由添加对应的meta信息
 */
export const addRouteMetaInfo = (routes: any[]): any[] => {
  return routes.map((route) => {
    const config = getRouteConfigByPath(route.path);
    if (config) {
      route.meta = {
        ...route.meta,
        title: config.title,
        icon: config.icon,
      };
    }

    // 递归处理子路由
    if (route.children && route.children.length > 0) {
      route.children = addRouteMetaInfo(route.children);
    }

    return route;
  });
};
