const routes = [
    {
        path: '/',
        name: 'index',
        title: '首页',
        component: () => import('@/pages/HomePage.vue')
    }
]
export default routes