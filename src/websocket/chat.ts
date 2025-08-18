/**
 * 聊天WebSocket客户端 - 专门用于聊天功能的WebSocket连接
 */

import { WebSocketClient } from '@/utils/websocket';
import type { ChatMessage } from '@/pages/chat/Chat.type';
import { useChatStore } from '@/stores/chat';
import { setMessageRead } from '@/api/chat/chatApi';
import notify from '@/utils/notify';

/**
 * 创建聊天WebSocket连接
 * @param userId 用户ID
 * @returns WebSocketClient
 */
export function createChatWebSocket(userId: string | number): WebSocketClient {
  const chatStore = useChatStore();
  return new WebSocketClient({
    targetPath: `/chatServe/${userId}`,
    onOpen: () => {
      console.log('🎉 聊天连接已建立，可以开始聊天了!');
    },
    onMessage: (event) => {
      console.log('💬 收到新的聊天消息:', event.data);
      // 这里可以添加消息处理逻辑，如更新聊天记录
      const message = JSON.parse(event.data) as ChatMessage;
      const isCurrentMessage =
        chatStore.currentToKey && message.toId == chatStore.currentToKey; //是否在当前聊天框中
      if (isCurrentMessage) {
        // 插入消息
        if (chatStore.chatInfo) {
          chatStore.setChatInfo({
            ...chatStore.chatInfo,
            lastMessage: message.content,
            lastTime: message.sendTime,
          });
        }
        // 设置消息已读
        setMessageRead(chatStore.currentToKey, String(message.id));
      } else {
        // 不在当前聊天框中，提醒用户
        notify.info({
          title: '您有新消息',
          content: message.chatName,
        });
        // 更新列表
        chatStore.updateTempChatList();
      }
    },
    onClose: (event) => {
      console.log('😔 聊天连接已断开:', event.code, event.reason);
    },
    onError: (event) => {
      console.error('💥 聊天连接出错，请检查网络:', event);
    },
  });
}
