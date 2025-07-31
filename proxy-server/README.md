# WebSocket 代理服务器

一个专门用于代理WebSocket连接的Node.js服务器，支持Cookie转发、Origin修改和完整的HTTP API代理。

## 功能特性

- ✅ WebSocket代理转发
- ✅ HTTP API代理
- ✅ Cookie自动转发
- ✅ Origin头部修改
- ✅ 跨域支持 (CORS)
- ✅ 健康检查端点
- ✅ 详细的连接日志
- ✅ 优雅关闭
- ✅ 环境变量配置

## 快速开始

### 1. 安装依赖

```bash
cd proxy-server
npm install
```

### 2. 配置环境变量

复制 `config.js` 文件并根据需要修改配置：

```javascript
export const config = {
  port: 3001,
  target: {
    host: '120.78.76.80:8080',  // 你的目标服务器
    protocol: 'http',
    wsProtocol: 'ws'
  }
};
```

### 3. 启动服务器

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

## 使用方法

### HTTP API代理

所有发送到 `/api/*` 的请求将被代理到目标服务器：

```javascript
// 前端请求
fetch('http://localhost:3001/api/users')
// 实际请求 -> http://120.78.76.80:8080/users
```

### WebSocket代理

连接到代理服务器的WebSocket端点：

```javascript
// 基本连接
const ws = new WebSocket('ws://localhost:3001/ws');

// 带参数连接
const ws = new WebSocket('ws://localhost:3001/ws?path=/chat&cookies=sessionId=abc123&origin=http://yourapp.com');
```

#### 支持的查询参数

- `path`: 目标服务器的WebSocket路径
- `cookies`: 要转发的Cookie字符串
- `origin`: 自定义Origin头部

### 健康检查

```bash
curl http://localhost:3001/health
```

## 配置选项

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `port` | 3001 | 代理服务器端口 |
| `target.host` | 120.78.76.80:8080 | 目标服务器地址 |
| `target.protocol` | http | 目标服务器协议 |
| `target.wsProtocol` | ws | WebSocket协议 |

## 日志说明

服务器会输出详细的代理日志：

```
[API代理] GET /api/users -> 120.78.76.80:8080/users
[WebSocket] 客户端连接: /ws?path=/chat
[WebSocket] 代理到: ws://120.78.76.80:8080/chat
[WebSocket] 客户端 -> 服务器: {"type":"message","data":"hello"}
[WebSocket] 服务器 -> 客户端: {"type":"response","data":"world"}
```

## 前端集成

修改你的前端应用，使用代理服务器：

```javascript
// WebSocket连接
const wsClient = new WebSocketClient({
  url: 'ws://localhost:3001/ws?path=/your-websocket-path&cookies=sessionId=123',
  // ... 其他配置
});

// HTTP请求
axios.defaults.baseURL = 'http://localhost:3001/api';
```

## 生产部署

1. 使用PM2或Docker部署
2. 配置Nginx反向代理
3. 设置HTTPS证书
4. 配置防火墙规则

```bash
# PM2部署示例
pm2 start server.js --name websocket-proxy
pm2 save
pm2 startup
```
