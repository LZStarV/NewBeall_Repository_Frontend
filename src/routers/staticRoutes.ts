import type { RouteRecordRaw } from 'vue-router';

const staticRoutes: RouteRecordRaw[] = [
    // 可在此添加静态路由，页面不会加到MainLayout下面
    {
        name: 'Chat',
        path: '/chat',
        component: () => import('@/pages/chat/index.vue'),
    },
];

export default staticRoutes;
