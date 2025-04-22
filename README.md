# NewBeall Frontend Project

这里是NewBeall前端项目的README文档。

## 技术栈

1. 框架：[Vite](https://cn.vitejs.dev/) + [Vue3](https://cn.vuejs.org/) + [TypeScript](https://www.typescriptlang.org/zh/) + [Scss](https://www.sass.hk/)

2. UI库：[BootStrapVue](https://bootstrap-vue.org/) + [Layui-Vue](https://www.layui-vue.com/zh-CN/index)

3. 代码管理：[Github](https://github.com/)

4. 基础依赖：Vue-router, axios, pinia, jwt-decode

5. 代码规范：[Eslint](https://eslint.org/)

## 配置须知

1. 已定义别名：

   ```JavaScript
   // vite.config.ts
   alias: {
       '@': path.resolve(__dirname, 'src'),
       '@com': path.resolve(__dirname, './src/components'),
       }
   ```

2. 已省略导入文件后缀名：

   ```
   // vite.config.ts
   extensions: ['.js', '.ts', '.json', '.tsx']
   ```

## 注意

1. 导入vue文件时一定要携带vue后缀名，否则会报错

