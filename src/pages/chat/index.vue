<template>
  <section class="container">
    <ChatComponent />
    <CompanyInfo />
  </section>
</template>

<script setup lang="ts">
import ChatComponent from './ChatComponent.vue';
import CompanyInfo from './CompanyInfo.vue';
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
