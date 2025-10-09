# NewBeall Frontend Project

NewBeall 前端项目是基于现代化前端技术栈构建的企业级应用，采用 Vue 3 + TypeScript + Vite 技术架构，提供了完整的项目管理、产品库、报价单、聊天等功能模块。

## 🚀 技术栈

- **核心框架**: Vue 3.5.13
- **状态管理**: Pinia 3.0.2
- **路由管理**: Vue Router 4.5.0
- **构建工具**: Vite 6.3.1
- **编程语言**: TypeScript 5.7.2
- **UI 组件库**: @layui/layui-vue 2.22.0, Bootstrap 5.3.8
- **HTTP 客户端**: Axios 1.8.4
- **代码规范**: ESLint 9.x, Prettier 3.5.3, StyleLint
- **提交规范**: Husky, Commitlint, Lint-staged

## 🌐 环境要求

- **Node.js**: 推荐 v18.0.0 或更高版本
- **npm**: 8.0.0 或更高版本
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 📦 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/LZStarV/NewBeall_Repository_Frontend.git
cd NewBeall_Repository_Frontend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

项目将在开发模式下运行，访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 4. 构建生产版本

```bash
npm run build
```

构建后的文件将生成在 `dist` 目录中，可用于部署到生产环境。

### 5. 预览生产构建

```bash
npm run preview
```

在本地预览生产构建的效果。

## 🛠️ 开发工作流

### 代码风格检查

```bash
# 检查代码风格
npm run lint

# 自动修复代码风格问题
npm run lint:fix

# 严格模式检查（不允许警告）
npm run lint:strict
```

### 代码提交

项目使用 Commitizen 和 Commitlint 规范提交信息：

```bash
git add .
npm run commit
```

按照提示填写提交信息，将自动生成符合规范的 commit message。

## 📁 项目结构

```
src/
├── api/            # API 请求接口定义
├── assets/         # 静态资源（图标、图片等）
├── components/     # 公共组件
├── composables/    # 可组合函数
├── layouts/        # 页面布局
├── pages/          # 页面组件
├── routers/        # 路由配置
├── stores/         # Pinia 状态管理
├── styles/         # 全局样式
├── types/          # TypeScript 类型定义
├── utils/          # 工具函数
├── websocket/      # WebSocket 相关实现
├── App.vue         # 应用根组件
└── main.ts         # 应用入口文件
```

## 🔧 环境配置

项目使用 `.env` 文件管理环境变量：

- **.env**: 基础环境变量，所有环境共享
- **.env.development**: 开发环境配置
- **.env.production**: 生产环境配置

### 主要环境变量

| 变量名 | 说明 | 开发环境默认值 |
|-------|------|--------------|
| VITE_APP_TITLE | 应用标题 | NewBeall Repository |
| VITE_API_BASE_URL | API 基础地址 | /api |
| VITE_WS_BASE_URL | WebSocket 地址 | ws://120.78.76.80:8080 |
| VITE_BASE_STATIC_URL | 静态资源前缀 | https://yx.newbeall.com/softLink/ |
| VITE_REQUEST_TIMEOUT | 请求超时时间 | 10000 |

## 📝 代理配置

开发环境中，API 和 WebSocket 请求通过 Vite 代理转发：

- API 请求：`/api/*` → `http://120.78.76.80:8080/*`
- WebSocket 请求：`/ws/*` → `ws://120.78.76.80:8080/*`

## 💡 开发提示

1. **组件自动导入**：项目使用 `unplugin-vue-components` 插件，`src/components` 目录下的组件会自动导入，无需手动注册

2. **路径别名**：
   - `@/` → `src/`
   - `@com/` → `src/components/`
   - `@pages/` → `src/pages/`
   - `@assets/` → `src/assets/`
   - `@stores/` → `src/stores/`
   - `@styles/` → `src/styles/`

3. **SVG 图标**：项目使用 `vite-plugin-svg-icons` 插件，`src/assets/icons` 目录下的 SVG 文件会自动注册为组件

## 📋 常见问题

### 1. 依赖安装失败

如果遇到依赖安装问题，可以尝试：

```bash
npm cache clean --force
npm install
```

### 2. 代理配置问题

如需修改代理配置，请编辑 `vite.config.ts` 文件中的 `server.proxy` 部分。

### 3. 代码提交失败

确保安装了 husky hooks：

```bash
npx husky install
```

## 📄 版权信息

广州壹新网络科技有限公司
电话: 020-32030561
广州市黄埔区科学城南翔一路68号1栋1C07房
Copyright © 2018-2022 广州壹新网络科技
