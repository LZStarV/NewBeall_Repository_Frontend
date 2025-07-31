/**
 * 聊天WebSocket客户端 - 专门用于聊天功能的WebSocket连接
 */

import { WebSocketClient } from '@/utils/websocket';

/**
 * 创建聊天WebSocket连接 - 基础工厂函数
 * 自动根据环境选择代理或直连模式，启用自动管理
 */
export function createChatWebSocket(options: {
  userId: string | number;
}): WebSocketClient {
  return new WebSocketClient({
    targetPath: `/chatServe/${options.userId}`,
    autoManage: false, // 启用自动管理，页面关闭时自动断开
    onOpen: (() => {
      console.log('🎉 聊天连接已建立，可以开始聊天了!');
    }),
    onMessage: ((event) => {
      console.log('💬 收到新的聊天消息:', event.data);
      // 这里可以添加消息处理逻辑，如更新聊天记录
    }),
    onClose: ((event) => {
      console.log('😔 聊天连接已断开:', event.code, event.reason);
    }),
    onError: ((event) => {
      console.error('💥 聊天连接出错，请检查网络:', event);
    })
  });
}
