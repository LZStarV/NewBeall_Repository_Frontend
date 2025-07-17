<template>
  <div>
    Hello, {{ userInfo.username }}
    <p>aaa</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/modules/user';
// import type { UserType } from '@/types/user';

const userStore = useUserStore();

const userInfo = ref(userStore.userData);
</script>

<style lang="scss" scoped></style>
