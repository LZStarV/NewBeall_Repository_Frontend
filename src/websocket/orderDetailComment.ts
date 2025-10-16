/**
 * 订单详情页面的评论记录
 */

import { WebSocketClient } from '@/utils/websocket';

export interface CommentMessage {
  avatar: string;
  content: string;
  fromOid: string;
  fromUid: number;
  topicId: number;
  topicTime: number;
  topicType: number;
  userName: string;
}

/**
 * 创建订单详情页面的评论记录WebSocket连接
 * @param userId 用户ID
 * @param orderId 订单ID
 * @param type 类型1
 * @param onMessageReceived 消息接收回调函数
 * @returns WebSocketClient
 */
export function createOrderDetailCommentWebSocket(
  userId: string | number,
  orderId: string,
  type: '1',
  onMessageReceived: (data: { topicList: CommentMessage[] }) => void,
): WebSocketClient {
  return new WebSocketClient({
    targetPath: `/TopicServer/${userId}/${orderId}/${type}`,
    onOpen: () => {
      console.log('订单详情评论连接已建立');
    },
    onMessage: (event) => {
      if (event.data === '') {
        // 收到服务器发来的空消息 - 不处理
        return;
      }
      const data = JSON.parse(event.data);
      if (onMessageReceived) {
        onMessageReceived(data);
      }
    },
    onClose: (event) => {
      console.log('订单详情评论连接已断开:', event.code, event.reason);
    },
    onError: (event) => {
      console.error('订单详情评论连接出错，请检查网络:', event);
    },
  });
}
