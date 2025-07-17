import type { RouteRecordRaw } from 'vue-router';

const staticRoutes: RouteRecordRaw[] = [
  // 可在此添加静态路由，页面不会加到MainLayout下面
  {
    path: '/default',
    component: () => import('@/pages/default/default.vue'),
    meta: { title: 'Default' },
  },
];

export default staticRoutes;
