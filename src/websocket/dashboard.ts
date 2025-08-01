import { WebSocketClient } from '@/utils/websocket';

/**
 * 创建首页仪表盘WebSocket连接
 * @param userId 用户ID
 * @param index 仪表盘索引
 * @returns WebSocketClient
 */
export function createDashBoardWebSocket(userId: string | number, index: number): WebSocketClient {
  return new WebSocketClient({
    targetPath: `/imserver/${userId}/${index}`,
    onOpen: (() => {
      console.log('仪表盘连接已建立!');
    }),
    onMessage: ((event) => {
      console.log('收到新的仪表盘消息:', event.data);
      // 这里可以添加处理逻辑
    }),
    onClose: ((event) => {
      console.log('仪表盘连接已断开:', event.code, event.reason);
    }),
    onError: ((event) => {
      console.error('仪表盘连接出错，请检查网络:', event);
    })
  });
}
