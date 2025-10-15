import { ref } from 'vue';
import env from './env';

// 默认配置常量
export const DEFAULT_RECONNECT_ATTEMPTS = 5; // 默认重连尝试次数
export const DEFAULT_RECONNECT_INTERVAL = 2000; // 默认重连间隔时间（毫秒）
export const DEFAULT_HEARTBEAT_INTERVAL = 36000; // 默认发起心跳请求间隔时间（毫秒）- 36秒
export const DEFAULT_HEARTBEAT_TIMEOUT = 5000; // 默认心跳超时时间（毫秒）- 5秒
// export const DEFAULT_PING_MESSAGE = JSON.stringify({ type: 'ping' }); // 默认心跳消息
export const DEFAULT_PING_MESSAGE = 'ping'; // 默认心跳消息
export const DEFAULT_PONG_MESSAGE = 'ping'; // 默认心跳回复消息

// WebSocket 关闭状态码
export const WEBSOCKET_NORMAL_CLOSE_CODE = 1000; // 正常关闭
export const WEBSOCKET_HEARTBEAT_TIMEOUT_CODE = 4000; // 心跳超时（自定义代码）
export const WEBSOCKET_MANUAL_DISCONNECT_CODE = 1000; // 手动断开连接

export interface WebSocketOptions {
  // 基础配置
  targetPath: string; // WebSocket路径，如 '/chatServe/176'
  url?: string; // WebSocket 服务器的 URL（可选，会根据环境自动构建）
  protocols?: string | string[]; // 可选的子协议
  // 重连配置
  reconnectAttempts?: number; // 重连尝试次数
  reconnectInterval?: number; // 重连间隔时间（毫秒）
  // 心跳配置
  heartbeatInterval?: number; // 心跳间隔时间（毫秒）
  heartbeatTimeout?: number; // 心跳超时时间（毫秒）
  pingMessage?: string; // 心跳消息内容
  // 事件回调
  onOpen?: (event: Event) => void; // 连接成功时的回调
  onMessage?: (event: MessageEvent) => void; // 收到消息时的回调函数
  onClose?: (event: CloseEvent) => void; // 连接关闭时的回调函数
  onError?: (event: Event) => void; // 发生错误时的回调函数

  // 开发环境配置 - Dev only
  customOrigin?: string; // 开发环境的目标Origin
  cookies?: Record<string, string> | string; // 额外的cookies（可选）

  // 生产环境配置 - Prod only
  productionWSUrl?: string; // 生产环境的WebSocket URL
}

/**
 * WebSocket客户端实例
 */
export class WebSocketClient {
  protected socket: WebSocket | null = null; // WebSocket 实例
  protected url: string;
  protected protocols?: string | string[];
  private reconnectAttempts: number;
  private reconnectInterval: number;
  private reconnectCount = 0; // 当前已重连次数
  private reconnectTimer: number | null = null; // 重连定时器

  // 心跳检测相关
  private heartbeatInterval: number;
  private heartbeatTimeout: number;
  private pingMessage: string;
  private heartbeatTimer: number | null = null; // 心跳定时器，定时发送心跳请求
  private heartbeatTimeoutTimer: number | null = null; // 发送心跳请求后启动的超时计时器
  private lastHeartbeatTime = 0; // 上次心跳时间
  private isManualDisconnect = false; // 是否为手动断开连接

  public isConnected = ref(false); // 是否已连接
  public isConnecting = ref(false); // 是否正在连接中

  // 配置选项
  private options: WebSocketOptions;
  private targetPath: string;
  private isDevelopment: boolean;

  private isDestroyed = false;

  private onOpenCallback?: (event: Event) => void;
  private onMessageCallback?: (event: MessageEvent) => void;
  private onCloseCallback?: (event: CloseEvent) => void;
  private onErrorCallback?: (event: Event) => void;

  constructor(options: WebSocketOptions) {
    this.options = options;
    this.targetPath = options.targetPath;
    this.protocols = options.protocols;
    this.isDevelopment = env.isDevelopment();

    // 构建WebSocket URL
    this.url = this.buildWebSocketUrl();

    this.reconnectAttempts =
      options.reconnectAttempts || DEFAULT_RECONNECT_ATTEMPTS;
    this.reconnectInterval =
      options.reconnectInterval || DEFAULT_RECONNECT_INTERVAL;

    // 心跳检测配置
    this.heartbeatInterval =
      options.heartbeatInterval || DEFAULT_HEARTBEAT_INTERVAL;
    this.heartbeatTimeout =
      options.heartbeatTimeout || DEFAULT_HEARTBEAT_TIMEOUT;
    this.pingMessage = options.pingMessage || DEFAULT_PING_MESSAGE;

    this.onOpenCallback = options.onOpen;
    this.onMessageCallback = options.onMessage;
    this.onCloseCallback = options.onClose;
    this.onErrorCallback = options.onError;

    // 调试代码，未来可删除
    console.log(`🌍 当前环境: ${env.getAppEnv()}`);
    console.log(
      `🔌 WebSocket模式: ${this.isDevelopment ? '开发代理模式' : '生产直连模式'}`,
    );
    console.log(`🔗 WebSocket URL: ${this.url}`);

    // 监听网络状态变化
    this.setupNetworkListeners();
  }

  /**
   * 构建WebSocket URL - 根据环境自动选择代理或直连
   */
  private buildWebSocketUrl(): string {
    // 如果手动指定了URL，直接使用
    if (this.options.url) {
      return this.options.url;
    }

    if (this.isDevelopment) {
      // 开发环境：使用代理模式
      return this.buildProxyUrl();
    } else {
      // 生产环境：直连模式
      return this.buildProductionUrl();
    }
  }

  /**
   * 构建开发环境的代理URL
   */
  private buildProxyUrl(): string {
    const proxyUrl = env.getWsProxyUrl();

    const url = new URL(proxyUrl + this.targetPath, window.location.href);

    console.log('🚀 开发环境代理URL:', url.toString());
    return url.toString();
  }

  /**
   * 构建生产环境的直连URL
   */
  private buildProductionUrl(): string {
    // 优先级1: 参数中指定的生产环境URL
    if (this.options.productionWSUrl) {
      const wsUrl = this.options.productionWSUrl + this.targetPath;
      console.log('🏭 生产环境URL (手动指定):', wsUrl);
      return wsUrl;
    }

    // 优先级2: 环境变量中配置的WebSocket基础URL
    const envWsUrl = env.getWsBaseUrl();
    if (envWsUrl) {
      const wsUrl = envWsUrl + this.targetPath;
      console.log('🏭 生产环境URL (环境配置):', wsUrl);
      return wsUrl;
    }

    // 优先级3: 根据当前页面URL自动构建
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}${this.targetPath}`;

    console.log('🏭 生产环境URL (自动构建):', wsUrl);
    return wsUrl;
  }

  /**
   * 连接 WebSocket 服务器。
   * 如果已连接或正在连接中，则不执行任何操作。
   */
  public connect(): void {
    if (this.isDestroyed) {
      console.warn('⚠️ WebSocket客户端已销毁，无法连接');
      return;
    }

    if (this.isConnected.value || this.isConnecting.value) {
      return;
    }

    // 重置手动断开标志
    this.isManualDisconnect = false;
    this.isConnecting.value = true;

    try {
      console.log('🔌 连接到WebSocket:', this.url);

      this.socket = this.protocols
        ? new WebSocket(this.url, this.protocols)
        : new WebSocket(this.url);

      // 绑定事件处理函数
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket 连接错误:', error);
      this.isConnecting.value = false;
      this.attemptReconnect(); // 尝试重连
    }
  }

  /**
   * 断开与 WebSocket 服务器的连接。
   * 清除重连定时器并重置重连次数。
   */
  public disconnect(): void {
    if (this.isDestroyed) {
      console.log('✅ WebSocket客户端已经销毁，无需重复操作');
      return;
    }

    console.log('[WebSocket] 开始断开连接并清理所有资源...');

    // 标记为手动断开，防止自动重连
    this.isManualDisconnect = true;

    this.clearReconnectTimer(); // 清除重连定时器
    this.clearHeartbeat(); // 清除心跳定时器
    this.reconnectCount = 0; // 重置重连次数

    if (this.socket) {
      // 移除事件监听器，防止触发重连
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;

      // 如果连接还在，发送正常关闭
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.close(WEBSOCKET_MANUAL_DISCONNECT_CODE, '手动断开连接');
      } else if (this.socket.readyState === WebSocket.CONNECTING) {
        // 如果正在连接中，等待连接后再关闭
        this.socket.onopen = () => {
          this.socket?.close(WEBSOCKET_MANUAL_DISCONNECT_CODE, '手动断开连接');
        };
      }

      this.socket = null;
    }

    // 重置状态
    this.isConnected.value = false;
    this.isConnecting.value = false;
    this.lastHeartbeatTime = 0;
    this.isDestroyed = true;

    console.log('✅ WebSocket客户端已完全销毁，所有资源已清理');
  }

  /**
   * 向 WebSocket 服务器发送数据。
   * @param data 要发送的数据，可以是字符串、ArrayBufferLike、Blob 或 ArrayBufferView。
   * @returns 发送是否成功。
   */
  public send(
    data: string | ArrayBufferLike | Blob | ArrayBufferView,
  ): boolean {
    if (this.isDestroyed) {
      console.warn('⚠️ WebSocket客户端已销毁，无法发送消息');
      return false;
    }

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket 未连接');
      return false;
    }

    try {
      this.socket.send(data); // 发送数据
      return true;
    } catch (error) {
      console.error('发送消息失败:', error);
      return false;
    }
  }

  /**
   * 处理 WebSocket 连接打开事件。
   * @param event Event 对象。
   */
  protected handleOpen(event: Event): void {
    this.isConnected.value = true;
    this.isConnecting.value = false;
    this.reconnectCount = 0;

    this.startHeartbeat(); // 开始心跳检测

    if (this.onOpenCallback) {
      this.onOpenCallback(event);
    }
  }

  /**
   * 处理 WebSocket 收到消息事件。
   * @param event MessageEvent 对象。
   */
  protected handleMessage(event: MessageEvent): void {
    // 更新最后心跳时间
    this.lastHeartbeatTime = Date.now();

    // 检查是否是服务器回复的心跳ping消息
    const data = event.data;
    if (data === DEFAULT_PONG_MESSAGE) {
      console.log(`✅ 收到心跳回复${DEFAULT_PONG_MESSAGE} 连接正常`);
      // 结束心跳超时检测计时器
      this.clearHeartbeatTimeoutTimer();
      return; // 不传递心跳回复消息给业务回调
    } else {
      // 不是心跳回复消息，也更新心跳时间（任何消息都表示连接活跃）
      this.clearHeartbeatTimeoutTimer();
      console.log('收到其他消息，连接活跃');
    }

    if (this.onMessageCallback) {
      this.onMessageCallback(event);
    }
  }

  /**
   * 处理 WebSocket 连接关闭事件。
   * 如果连接意外关闭（非正常关闭），则尝试重连。
   * @param event CloseEvent 对象。
   */
  protected handleClose(event: CloseEvent): void {
    console.log(
      `[WebSocket] 连接关闭: code=${event.code}, reason="${event.reason}", wasClean=${event.wasClean}`,
    );

    this.isConnected.value = false;
    this.isConnecting.value = false;

    this.clearHeartbeat(); // 清除心跳检测

    if (this.onCloseCallback) {
      this.onCloseCallback(event);
    }

    // 只有在非手动断开且非正常关闭时才尝试重连
    // 4000是心跳超时，应该触发重连；1000是正常关闭，不应该重连
    if (
      !this.isManualDisconnect &&
      event.code !== WEBSOCKET_NORMAL_CLOSE_CODE &&
      event.code !== WEBSOCKET_MANUAL_DISCONNECT_CODE
    ) {
      console.log('[WebSocket] 意外断开，准备重连...');
      this.attemptReconnect();
    } else if (event.code === WEBSOCKET_HEARTBEAT_TIMEOUT_CODE) {
      console.log('[WebSocket] 心跳超时断开，准备重连...');
      this.attemptReconnect();
    } else {
      console.log('[WebSocket] 主动断开连接或正常关闭');
    }
  }

  /**
   * 处理 WebSocket 错误事件。
   * @param event Event 对象。
   */
  protected handleError(event: Event): void {
    console.error('WebSocket 连接错误:', event);

    // 清除心跳检测，避免在错误状态下继续发送心跳
    this.clearHeartbeat();

    if (this.onErrorCallback) {
      this.onErrorCallback(event);
    }
  }

  /**
   * 尝试重新连接 WebSocket 服务器。
   * 如果重连次数达到上限，则停止尝试。
   */
  protected attemptReconnect(): void {
    if (this.reconnectCount >= this.reconnectAttempts) {
      console.error(
        `WebSocket 重连失败，已尝试 ${this.reconnectAttempts} 次，达到重连上限！`,
      );
      return;
    }

    this.clearReconnectTimer();

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectCount++;
      console.log(`WebSocket 正在重连... 尝试次数: ${this.reconnectCount}`);
      this.connect();
    }, this.reconnectInterval);
  }

  /**
   * 清除重连定时器。
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * 设置心跳超时检测定时器
   * 用于检测连接是否超时，超时后关闭连接触发重连
   */
  private setHeartbeatTimeoutTimer(): void {
    // 清除已存在的心跳超时检测定时器
    this.clearHeartbeatTimeoutTimer();
    this.heartbeatTimeoutTimer = window.setTimeout(() => {
      const now = Date.now();
      const timeSinceLastHeartbeat = now - this.lastHeartbeatTime;
      console.log(
        `心跳检查: 距离上次消息 ${timeSinceLastHeartbeat}ms (超时阈值: ${this.heartbeatTimeout}ms)`,
      );

      if (timeSinceLastHeartbeat > this.heartbeatTimeout) {
        console.warn(
          `心跳超时，连接可能已断开 (${timeSinceLastHeartbeat}ms > ${this.heartbeatTimeout}ms)`,
        );
        this.socket?.close(WEBSOCKET_HEARTBEAT_TIMEOUT_CODE, '心跳超时'); // 关闭连接，触发重连
      } else {
        console.log('心跳检查正常');
      }
    }, this.heartbeatTimeout);
  }

  /**
   * 开始心跳检测。
   * 定期发送ping消息并检查连接状态。
   */
  private startHeartbeat(): void {
    this.clearHeartbeat();
    this.lastHeartbeatTime = Date.now();

    this.heartbeatTimer = window.setInterval(() => {
      if (this.isConnected.value && this.socket) {
        // 发送心跳消息
        const pingResult = this.send(this.pingMessage);
        console.log(
          `发送心跳消息 ${this.pingMessage} `,
          pingResult ? '成功' : '失败',
        );

        // 设置心跳超时检测计时器
        this.setHeartbeatTimeoutTimer();
      }
    }, this.heartbeatInterval);
  }

  /**
   * 清除心跳超时检测定时器。
   */
  private clearHeartbeatTimeoutTimer(): void {
    if (this.heartbeatTimeoutTimer !== null) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  /**
   * 清除心跳相关定时器。
   */
  private clearHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    this.clearHeartbeatTimeoutTimer();
  }

  /**
   * 设置网络状态监听器。
   * 在网络恢复时自动尝试重连。
   */
  private setupNetworkListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('网络已恢复，尝试重新连接WebSocket');
        if (
          !this.isDestroyed &&
          !this.isConnected.value &&
          !this.isConnecting.value
        ) {
          this.reconnectCount = 0; // 重置重连次数
          this.connect();
        }
      });

      window.addEventListener('offline', () => {
        console.log('网络已断开');
        this.clearHeartbeat();
      });
    }
  }
}

/**
 * 创建通用WebSocket连接 - 完全自定义配置
 * 自动根据环境选择代理或直连模式
 */
export function createWebSocket(
  options: Omit<WebSocketOptions, 'url'>,
): WebSocketClient {
  return new WebSocketClient(options);
}
