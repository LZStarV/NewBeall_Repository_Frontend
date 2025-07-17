/// <reference types="vitest" />
import path from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), './src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  test: {
    globals: true,
  },
  resolve: {
    // 导入时想要省略的扩展名列表。注意，不建议忽略自定义导入类型的扩展名（例如：.vue），因为它会影响 IDE 和类型支持。
    extensions: ['.js', '.ts', '.json', '.tsx'],
    // 导入别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@com': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@store': path.resolve(__dirname, './src/store'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  css: {
    preprocessorOptions: {
      // scss全局文件引入
      scss: {
        additionalData: `
          @use "@styles/variables.scss" as *;
          @use "@styles/mixins.scss" as *;
        `,
      },
    },
    modules: {
      // css modules 配置
      localsConvention: 'camelCaseOnly',
      // 使用css modules时，需要用驼峰式来访问类名，如style.buttonColor而不是style['button-color']
    },
  },
});
