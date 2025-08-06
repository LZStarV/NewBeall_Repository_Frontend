<template>
  <section class="chat-container">
    <ChatComponent />
    <CompanyInfo />
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import ChatComponent from './ChatComponent.vue';
import CompanyInfo from './CompanyInfo.vue';
import { createChatWebSocket } from '@/websocket/chat';
import type { WebSocketClient } from '@/utils/websocket';
import { useChatStore } from '@/stores/chat';

let wsClient: WebSocketClient;
const userStore = useChatStore();
const userId = ref('');

onMounted(async () => {
  await userStore.setUserInfo();
  userId.value = userStore.userInfoData?.id.toString() ?? '';
  console.log('userId', userId.value);
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
@use "sass:color";

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
