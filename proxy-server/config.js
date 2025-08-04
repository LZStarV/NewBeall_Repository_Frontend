// 代理服务器配置
export const config = {
  // 代理服务器端口
  port: process.env.PROXY_PORT || 3001,

  // 目标服务器配置
  target: {
    host: process.env.TARGET_HOST || '120.78.76.80:8080',
    protocol: process.env.TARGET_PROTOCOL || 'http',
    wsProtocol: process.env.WS_TARGET_PROTOCOL || 'ws'
  },

  // CORS配置
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },

  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLog: true,
    enableWebSocketLog: true
  }
};
