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
    path: '/forget',
    component: () => import('@/pages/forget/index.vue'),
    meta: { title: 'forget' },
  },
  {
    path: '/chat',
    component: () => import('@/pages/chat/index.vue'),
    meta: { title: 'chat' },
  },
  // 添加独立的会员续费路由，不使用MainLayout
  {
    path: '/member-standalone',
    component: () => import('@/pages/member/renewal/index.vue'),
    meta: { title: '会员续费' },
  },
];

export default staticRoutes;
