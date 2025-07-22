import type { RouteRecordRaw } from 'vue-router';

const staticRoutes: RouteRecordRaw[] = [
  // 可在此添加静态路由，页面不会加到MainLayout下面
  {
    path: '/default',
    component: () => import('@/pages/default/index.vue'),
    meta: { title: 'default' },
  },
  {
    path: '/login',
    component: () => import('@/pages/login/index.vue'),
    meta: { title: 'login' },
  },
  {
    path: '/register',
    component: () => import('@/pages/register/index.vue'),
    meta: { title: 'register' },
  },
  {
    path: '/chat',
    component: () => import('@/pages/chat/index.vue'),
    meta: { title: 'chat' },
  },
];

export default staticRoutes;
