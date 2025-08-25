<template>
  <section class="chat-container">
    <ChatComponent />
    <CompanyInfo />
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ChatComponent from './ChatComponent.vue';
import CompanyInfo from './CompanyInfo.vue';
import { createChatWebSocket } from '@/websocket/chat';
import type { WebSocketClient } from '@/utils/websocket';
import { useChatStore } from '@/stores/chat';
import { saveTempWindow } from '@/api/chat/chatApi';
import type { ChatInfo } from './Chat.type';

let wsClient: WebSocketClient;
const userStore = useChatStore();
const userId = ref('');
const route = useRoute();

// 处理URL参数并跳转到指定聊天室
const handleUrlParams = async () => {
  const { prefix, toId, chatName } = route.query;

  if (prefix && toId) {
    // 构建currentToKey
    const currentToKey = `${prefix}-${toId}`;

    // 构建聊天信息
    const chatInfo: ChatInfo = {
      toKey: currentToKey,
      chatName: chatName ? `${chatName}` : `聊天室-${toId}`,
      described: '',
      avatar: '',
      lastMessage: '',
      lastTime: new Date().toISOString(),
      prefix: prefix as string,
      type: prefix !== 'PY', // PY为单聊，其他为群聊
      unreadCount: 0,
    };

    // 保存临时聊天窗口
    const params = {
      prefix: prefix as string,
      toId: toId as string,
      fromId: userStore.userInfoData?.id.toString() ?? '',
      chatName: chatInfo.chatName,
      described: chatInfo.described,
      avatar: chatInfo.avatar,
    };

    await saveTempWindow(params);
    // 设置聊天信息到store
    userStore.setChatInfo(chatInfo);
  }
};

onMounted(async () => {
  await userStore.setUserInfo();
  userId.value = userStore.userInfoData?.id.toString() ?? '';
  console.log('userId', userId.value);

  // 处理URL参数
  await handleUrlParams();

  if (userId.value.length > 0) {
    console.log('🚀 初始化聊天页面WebSocket连接...');
    // 创建聊天WebSocket实例，传入用户ID
    wsClient = createChatWebSocket(userId.value);
    // 启动WebSocket连接
    wsClient.connect();
    console.log('✅ 聊天WebSocket实例已创建并启动');
  }
});

// Vue组件卸载时断开WebSocket连接
onUnmounted(() => {
  console.log('🧹 页面卸载，断开聊天WebSocket连接');
  wsClient?.disconnect();
});
</script>

<style scoped lang="scss">
@use 'sass:color';

.chat-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 2rem;
  background-color: color.adjust($primary-color, $lightness: 20%, $alpha: -0.9);
}

/* 平板模式 */
@media (max-width: $desktop_layout_breakpoint) {
  .chat-container {
    padding: 0;
    position: relative;
    overflow: hidden;
  }
}
</style>
