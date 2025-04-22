import { createRouter, createWebHistory } from 'vue-router'

// 导入路由页面的配置
import routes from './routes'

// 路由参数配置
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // 返回 false 以取消导航
    next()
})

// 全局后置钩子
router.afterEach((to, from) => {
    const _title = to.meta.title
})

export default router