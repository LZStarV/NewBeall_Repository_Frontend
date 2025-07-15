import Layui from '@layui/layui-vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/routers/index.ts';
// 引入全局样式
import '@layui/layui-vue/lib/index.css';
import '@/styles/index.scss';
//全局注册面包屑组件
import BaseBreadcrumb from '@/components/Breadcrumb.vue';

// svg图标插件
import 'virtual:svg-icons-register';

const pinia = createPinia();
const app = createApp(App);
app.component('BaseBreadcrumb', BaseBreadcrumb);

app.use(router).use(pinia).use(Layui).mount('#app');
