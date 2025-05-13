import { createRouter, createWebHistory } from 'vue-router'

import routes from './routes'

const router = createRouter({
    history: createWebHistory(),  // HTML5模式
    routes: routes
})

// 全局前置守卫
router.beforeEach((_to, _from, next) => {
    // 返回 false 以取消导航
    next()
})

// 全局后置钩子
router.afterEach((_to, _from) => {
    
})

export default router