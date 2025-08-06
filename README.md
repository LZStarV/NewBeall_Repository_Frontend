# NewBeall Frontend Project

这里是NewBeall前端项目的README文档。

## 配置须知

### 1. 安装依赖

```bash
npm i
```

### 2. 启动项目

```bash
npm run dev
```

**注意**：此命令会一并启动WebSocket代理服务器，如果只想单独启动其一，请使用下面命令：

不启动WebSocket代理服务器：

```bash
npm run dev:page
```

单独启动WebSocket代理服务器：

```bash
npm run dev:proxy
```

### 3. 打包项目

```bash
npm run build
```

### 4. 运行测试

```bash
npm run test
```

### 5. 代码样式检查

```bash
npm run lint
npm run lint:fix
npm run lint:strict
```

### 6. 代码提交

```bash
git add .
npm run commit
```
