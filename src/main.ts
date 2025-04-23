import { createApp } from 'vue'
import { createPinia } from "pinia";
import router from '@/routers/index.ts'
import Layui from '@layui/layui-vue'
import '@layui/layui-vue/lib/index.css'
import App from '@/App.vue'

const pinia = createPinia()

createApp(App)
    .use(router)
    .use(pinia)
    .use(Layui)
    .mount('#app')
