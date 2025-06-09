/// <reference types="vitest" />
import path from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  test: {
    globals: true
  },
  resolve: {
    // 导入时想要省略的扩展名列表。注意，不建议忽略自定义导入类型的扩展名（例如：.vue），因为它会影响 IDE 和类型支持。
    extensions: ['.js', '.ts', '.json', '.tsx'],
    // 导入别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@com': path.resolve(__dirname, './src/components'),
    }
  },
  css: {
    preprocessorOptions: {
      // scss全局文件引入
      scss: {
        additionalData: '@use "@/styles/global.scss" as *;'
      },
    },
  },
});
