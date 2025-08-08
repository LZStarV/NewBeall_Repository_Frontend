/**
 * 工作台留言WebSocket
 */

import { WebSocketClient } from '@/utils/websocket';

/**
 *工作台留言WebSocket
 * @param myuserId 用户id
 * @param receptionUserid 被留言用户id
 * @param type 类型1/2
 * @param onMessageReceived 消息接收回调
 * @returns
 */
export function createMemberChatWebSocket(
  myuserId: string | number,
  receptionUserid: number | string,
  type: 1 | 2,
  onMessageReceived?: (data: unknown) => void,
): WebSocketClient {
  return new WebSocketClient({
    targetPath: `/TopicServer/${myuserId}/${receptionUserid}/${type}`,
    onOpen: () => {
      console.log('🎉 聊天连接已建立，可以开始聊天了!');
    },
    onMessage: (event) => {
      console.log('💬收到工作台留言消息:', event.data);
      const data = JSON.parse(event.data);
      if (onMessageReceived) {
        onMessageReceived(data);
      }
    },
    onClose: (event) => {
      console.log('工作台留言连接已断开:', event.code, event.reason);
    },
    onError: (event) => {
      console.error('工作台留言连接出错，请检查网络:', event);
    },
  });
}
