# NewBeall Frontend Project

这里是NewBeall前端项目的README文档。

## 技术栈

1. 框架：[Vite](https://cn.vitejs.dev/) + [Vue3](https://cn.vuejs.org/) + [TypeScript](https://www.typescriptlang.org/zh/) + [Scss](https://www.sass.hk/)

2. UI库：[Layui-Vue](https://www.layui-vue.com/zh-CN/index)

3. 代码管理：[Github](https://github.com/)

4. 基础依赖：Vue-router, axios, pinia, jwt-decode

5. 代码规范：[Eslint](https://eslint.org/)

## 配置须知

1. 已定义别名：

   ```TypeScript
   // vite.config.ts
   alias: {
       '@': path.resolve(__dirname, 'src'),
       '@com': path.resolve(__dirname, './src/components'),
       }
   ```

2. 已省略导入文件后缀名：

   ```TypeScript
   // vite.config.ts
   extensions: ['.js', '.ts', '.json', '.tsx']
   ```

## 开发规范

### 1. TypeScript Type 开发规范

#### 代码示例

```TypeScript
/**
 * Xxx 数据类型定义
 * @property {type} xxx - 属性描述
 */
export interface XxxType {
  xxx: string | number | boolean;  // 替换为具体类型
  yyy?: SomeOtherType;             // 可选属性
  zzz: {
    nestedProp: number;            // 嵌套对象
  };
}
```

### 2. Pinia Store 开发规范

#### 代码示例

```TypeScript
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import type { XxxType } from '@/types/xxx'; // 替换成你的类型文件

/**
 * Xxx Store (例如: useUserStore, useAuthStore)
 * 遵循标准化 Pinia Store 结构
 * 使用箭头函数
 */
export const useXxxStore = defineStore('xxx', () => {
  // ========== State (存储的数据) ==========
  const xxxData: Ref<XxxType | null> = ref(null); //如有默认值则填写默认值

  // ========== Getters (计算属性) ==========
  const hasXxx = (): boolean => !!xxx.value;

  // ========== Actions (操作方法) ==========
  /** 设置数据 */
  const setXxx = (newXxx: XxxType) => {
    xxx.value = newXxx;
    localStorage.setItem('xxx', JSON.stringify(newXxx)); // 可选：持久化存储
  };

  /** 清除数据 */
  const clearXxx = () => {
    xxx.value = null;
    localStorage.removeItem('xxx'); // 可选：清除持久化存储
  };

  // ========== 返回 State + Actions ==========
  return {
    xxxData,
    hasXxx,
    setXxx,
    clearXxx,
  };
});
```

#### 总结

| 部分             | 命名规范               | 示例                                |
| :------------- | :----------------- | :-------------------------------- |
| Store 名称       | useXxxStore        | useUserStore, useAuthStore        |
| State (数据)     | xxxData 或 xxxInfo  | userInfo, authData                |
| Getters (计算属性) | hasXxx, isXxx      | hasUser, isAuthenticated          |
| Actions (方法)   | setXxx, clearXxx   | setUser, clearAuth                |
| 持久化存储          | 使用 localStorage 同步 | localStorage.setItem('auth', ...) |

## 注意

1. 导入vue文件时须携带.vue后缀名，否则会报错

