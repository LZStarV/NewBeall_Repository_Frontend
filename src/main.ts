import Layui from '@layui/layui-vue'
import { createPinia } from "pinia";
import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/routers/index.ts';
import '@layui/layui-vue/lib/index.css';


const pinia = createPinia()

createApp(App)
    .use(router)
    .use(pinia)
    .use(Layui)
    .mount('#app')
