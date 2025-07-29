<template>
  <section class="chat-container">
    <ChatComponent />
    <CompanyInfo />
  </section>
</template>

<script setup lang="ts">
import ChatComponent from './ChatComponent.vue';
import CompanyInfo from './CompanyInfo.vue';
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
