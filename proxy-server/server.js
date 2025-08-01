import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { URL } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PROXY_PORT || 3001;
const TARGET_HOST = process.env.TARGET_HOST || '120.78.76.80:8080';
const TARGET_PROTOCOL = process.env.TARGET_PROTOCOL || 'http';
const WS_TARGET_PROTOCOL = process.env.WS_TARGET_PROTOCOL || 'ws';

// 启用CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// 解析JSON
app.use(express.json());

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    target: `${TARGET_PROTOCOL}://${TARGET_HOST}`,
    wsTarget: `${WS_TARGET_PROTOCOL}://${TARGET_HOST}`
  });
});

// HTTP API代理
const apiProxy = createProxyMiddleware('/api', {
  target: `${TARGET_PROTOCOL}://${TARGET_HOST}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // 移除/api前缀
  },
  onProxyReq: (proxyReq, req) => {
    // 设置正确的Origin
    proxyReq.setHeader('Origin', `${TARGET_PROTOCOL}://${TARGET_HOST}`);
    proxyReq.setHeader('Referer', `${TARGET_PROTOCOL}://${TARGET_HOST}`);

    // 转发Cookie
    if (req.headers.cookie) {
      proxyReq.setHeader('Cookie', req.headers.cookie);
    }

    // 添加自定义头部
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }

    console.log(`[API代理] ${req.method} ${req.url} -> ${proxyReq.getHeader('Host')}${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error(`[API代理错误] ${req.url}:`, err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
});

app.use(apiProxy);

// 创建HTTP服务器
const server = createServer(app);

// WebSocket代理处理
const wss = new WebSocketServer({
  server,
  path: '/ws'
});

wss.on('connection', (clientWs, req) => {
  console.log('[WebSocket] 客户端连接:', req.url);

  // 解析查询参数
  const url = new URL(req.url, `http://${req.headers.host}`);
  const targetPath = url.searchParams.get('path') || '';
  const customOrigin = url.searchParams.get('origin') || '';

  // 优先从HTTP请求头获取Cookie（支持HttpOnly cookies）
  const cookiesFromHeader = req.headers.cookie || '';
  // 备选：从查询参数获取Cookie（向后兼容）
  const cookiesFromQuery = url.searchParams.get('cookies') || '';

  // 使用HTTP请求头中的cookie，如果没有则使用查询参数中的
  const cookies = cookiesFromHeader || cookiesFromQuery;

  // 构建目标WebSocket URL
  let targetWsUrl = `${WS_TARGET_PROTOCOL}://${TARGET_HOST}${targetPath}`;

  console.log(`[WebSocket] 代理到: ${targetWsUrl}`);
  console.log(`[WebSocket] Cookies (来源: ${cookiesFromHeader ? 'HTTP头' : '查询参数'}): ${cookies ? cookies.substring(0, 100) + '...' : '无'}`);
  console.log(`[WebSocket] Origin: ${customOrigin}`);

  // 创建到目标服务器的WebSocket连接
  import('ws').then(({ default: WebSocket }) => {
    const targetWs = new WebSocket(targetWsUrl, [], {
      headers: {
        'Origin': customOrigin || `${TARGET_PROTOCOL}://${TARGET_HOST}`,
        'User-Agent': req.headers['user-agent'] || 'WebSocket-Proxy/1.0',
        'Cookie': cookies,
        'Host': TARGET_HOST,
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Version': '13',
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
        // 转发所有原始请求头
        ...(req.headers['sec-websocket-key'] && { 'Sec-WebSocket-Key': req.headers['sec-websocket-key'] }),
        ...(req.headers['sec-websocket-protocol'] && { 'Sec-WebSocket-Protocol': req.headers['sec-websocket-protocol'] }),
        ...(req.headers['sec-websocket-extensions'] && { 'Sec-WebSocket-Extensions': req.headers['sec-websocket-extensions'] })
      }
    });

    // 目标服务器连接成功
    targetWs.on('open', () => {
      console.log('[WebSocket] 目标服务器连接成功');
    });

    // 转发消息：客户端 -> 目标服务器
    clientWs.on('message', (message) => {
      if (targetWs.readyState === WebSocket.OPEN) {
        // 处理不同类型的消息数据
        let messageStr;
        let messageToSend;

        if (Buffer.isBuffer(message)) {
          // 如果是Buffer，转换为字符串
          messageStr = message.toString('utf8');
          messageToSend = messageStr; // 发送文本格式
        } else if (message instanceof ArrayBuffer) {
          // 如果是ArrayBuffer，转换为字符串
          messageStr = Buffer.from(message).toString('utf8');
          messageToSend = messageStr; // 发送文本格式
        } else {
          // 如果已经是字符串
          messageStr = message.toString();
          messageToSend = messageStr; // 发送文本格式
        }

        // 检查是否是心跳消息
        try {
          const data = JSON.parse(messageStr);
          if (data.type === 'ping') {
            console.log('[WebSocket] 客户端心跳 -> 服务器: ping');

            // 转发ping到服务器（确保是JSON格式）
            targetWs.send(JSON.stringify(data));

            // 设置一个超时，如果服务器在3秒内没有回复pong，代理服务器自动回复
            const pongTimeout = setTimeout(() => {
              if (clientWs.readyState === WebSocket.OPEN) {
                console.log('[WebSocket] 服务器未及时回复心跳，代理服务器自动回复pong');
                const pongResponse = JSON.stringify({ type: 'pong', timestamp: Date.now(), source: 'proxy' });
                clientWs.send(pongResponse);
              }
            }, 3000);

            // 标记这个超时，以便在收到真实pong时取消
            clientWs._lastPongTimeout = pongTimeout;
            return;
          } else {
            console.log('[WebSocket] 客户端 -> 服务器:', messageStr.substring(0, 100) + '...');
          }
        } catch {
          console.log('[WebSocket] 客户端消息解析失败，作为文本处理:', messageStr.substring(0, 100) + '...');
        }

        // 发送JSON格式的消息到目标服务器
        targetWs.send(messageToSend);
      } else {
        console.warn('[WebSocket] 目标服务器连接不可用，消息被丢弃');
      }
    });

    // 转发消息：目标服务器 -> 客户端
    targetWs.on('message', (message) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        // 处理不同类型的消息数据
        let messageStr;
        let messageToSend;

        if (Buffer.isBuffer(message)) {
          // 如果是Buffer，转换为字符串
          messageStr = message.toString('utf8');
          messageToSend = messageStr; // 发送文本格式
          console.log('[WebSocket] 收到服务端Buffer数据，已转换为文本:', messageStr.substring(0, 100) + '...');
        } else if (message instanceof ArrayBuffer) {
          // 如果是ArrayBuffer，转换为字符串
          messageStr = Buffer.from(message).toString('utf8');
          messageToSend = messageStr; // 发送文本格式
          console.log('[WebSocket] 收到服务端ArrayBuffer数据，已转换为文本:', messageStr.substring(0, 100) + '...');
        } else {
          // 如果已经是字符串
          messageStr = message.toString();
          messageToSend = messageStr; // 发送文本格式
          console.log('[WebSocket] 收到服务端文本数据:', messageStr.substring(0, 100) + '...');
        }

        // 检查是否是心跳响应
        try {
          const data = JSON.parse(messageStr);
          if (data.type === 'pong') {
            console.log('[WebSocket] 服务器心跳响应 -> 客户端: pong (来自真实服务器)');

            // 取消代理服务器的自动回复
            if (clientWs._lastPongTimeout) {
              clearTimeout(clientWs._lastPongTimeout);
              clientWs._lastPongTimeout = null;
            }

            // 确保发送JSON格式的pong响应
            const pongResponse = JSON.stringify(data);
            clientWs.send(pongResponse);
            return;
          } else {
            console.log('[WebSocket] 服务器 -> 客户端 (JSON):', messageStr.substring(0, 100) + '...');
          }

          // 如果是有效的JSON，确保发送格式化的JSON
          messageToSend = JSON.stringify(data);
        } catch {
          console.log('[WebSocket] 服务器消息不是JSON格式，作为文本发送:', messageStr.substring(0, 100) + '...');
          messageToSend = messageStr;
        }

        // 确保发送给客户端的是JSON格式
        clientWs.send(messageToSend);
      } else {
        console.warn('[WebSocket] 客户端连接不可用，消息被丢弃');
      }
    });

    // 处理客户端断开
    clientWs.on('close', (code, reason) => {
      console.log(`[WebSocket] 客户端断开: code=${code}, reason="${reason}"`);

      // 清理心跳超时器
      if (clientWs._lastPongTimeout) {
        clearTimeout(clientWs._lastPongTimeout);
        clientWs._lastPongTimeout = null;
      }

      // 正确关闭到目标服务器的连接
      if (targetWs.readyState === WebSocket.OPEN) {
        console.log('[WebSocket] 关闭到目标服务器的连接');
        targetWs.close(1000, '客户端断开连接');
      } else if (targetWs.readyState === WebSocket.CONNECTING) {
        console.log('[WebSocket] 目标服务器正在连接中，等待连接后关闭');
        targetWs.onopen = () => {
          targetWs.close(1000, '客户端断开连接');
        };
      }
    });

    // 处理目标服务器断开
    targetWs.on('close', (code, reason) => {
      console.log(`[WebSocket] 目标服务器断开: code=${code}, reason="${reason}"`);

      // 清理心跳超时器
      if (clientWs._lastPongTimeout) {
        clearTimeout(clientWs._lastPongTimeout);
        clientWs._lastPongTimeout = null;
      }

      if (clientWs.readyState === WebSocket.OPEN) {
        console.log('[WebSocket] 通知客户端目标服务器已断开');
        clientWs.close(code, reason || '目标服务器断开连接');
      }
    });

    // 处理目标服务器错误
    targetWs.on('error', (error) => {
      console.error('[WebSocket] 目标服务器错误:', error.message);
      console.error('[WebSocket] 完整错误信息:', error);
      console.error('[WebSocket] 尝试连接的URL:', targetWsUrl);
      console.error('[WebSocket] 发送的头部:', {
        'Origin': customOrigin || `${TARGET_PROTOCOL}://${TARGET_HOST}`,
        'Cookie': cookies ? cookies.substring(0, 100) + '...' : 'None',
        'Host': TARGET_HOST
      });

      // 清理心跳超时器
      if (clientWs._lastPongTimeout) {
        clearTimeout(clientWs._lastPongTimeout);
        clientWs._lastPongTimeout = null;
      }

      if (clientWs.readyState === WebSocket.OPEN) {
        console.log('[WebSocket] 通知客户端目标服务器错误');
        clientWs.close(1002, '目标服务器连接错误');
      }
    });

    // 处理客户端错误
    clientWs.on('error', (error) => {
      console.error('[WebSocket] 客户端错误:', error.message);

      // 清理心跳超时器
      if (clientWs._lastPongTimeout) {
        clearTimeout(clientWs._lastPongTimeout);
        clientWs._lastPongTimeout = null;
      }

      if (targetWs.readyState === WebSocket.OPEN) {
        targetWs.close();
      }
    });
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`🚀 WebSocket代理服务器启动成功！`);
  console.log(`📍 HTTP代理: http://localhost:${PORT}/api -> ${TARGET_PROTOCOL}://${TARGET_HOST}`);
  console.log(`🔌 WebSocket代理: ws://localhost:${PORT}/ws -> ${WS_TARGET_PROTOCOL}://${TARGET_HOST}`);
  console.log(`🏥 健康检查: http://localhost:${PORT}/health`);
  console.log(`⚙️  目标服务器: ${TARGET_HOST}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('收到SIGINT信号，正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});
