<template>
  <section class="container">
    <ChatComponent @update-active-id="updateActiveId" />
    <CompanyInfo v-if="activeItemId" />
  </section>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';
import ChatComponent from './ChatComponent.vue';
import CompanyInfo from './CompanyInfo.vue';

const activeItemId = ref('');
provide('chat-info-tokey', activeItemId);

const updateActiveId = (id: string) => {
  activeItemId.value = id;
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
