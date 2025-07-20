import type { RouteRecordRaw } from 'vue-router';
import CoverLayout from '@/layouts/CoverLayout.vue';

const staticRoutes: RouteRecordRaw[] = [
  // 可在此添加静态路由，页面不会加到MainLayout下面
  {
    path: '/',
    component: CoverLayout,
    children: [
      {
        path: 'default',
        component: () => import('@/pages/default/default.vue'),
        meta: { title: 'default', layout: 'CoverLayout' },
      },
      {
        path: 'login',
        component: () => import('@/pages/login/login.vue'),
        meta: { title: 'login', layout: 'CoverLayout' },
      },
      {
        path: 'register',
        component: () => import('@/pages/register/register.vue'),
        meta: { title: 'register', layout: 'CoverLayout' },
      },
    ],
  },
];

export default staticRoutes;
