<template>
  <div>
    Hello, {{ userInfo.username }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { useUserStore } from '@/store/user';
// import type { UserType } from '@/types/user';

const userStore = useUserStore();

const userInfo = ref(userStore.userData)

</script>

<style lang="scss" scoped></style>