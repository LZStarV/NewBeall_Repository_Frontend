/// <reference types="vitest" />
import path from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import Components from 'unplugin-vue-components/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), './src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    // 自动引入src/components组件
    Components({
      // 指定组件位置，默认是src/components
      dirs: ['src/components'],
      extensions: ['vue'],
      // 配置文件生成位置
      dts: 'src/components.d.ts',
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
      '@stores': path.resolve(__dirname, './src/stores'),
      '@styles': path.resolve(__dirname, './src/styles'),
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
  // 服务器配置 - 使用第三方代理服务器
  server: {
    host: '0.0.0.0', // 允许外部访问
    proxy: {
      '/api': {
        target: 'http://120.78.76.80:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 通过本地自建第三方代理服务器代理WebSocket连接
      '/ws': {
        target: 'ws://localhost:3001', // 指向代理服务器
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws/, ''),
      },
    },
  },
});
