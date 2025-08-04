<template>
  <BaseCard title="用户成员">
    <template #actions>
      <lay-icon type="layui-icon-reply-fill" class="action-icon" />
    </template>
    <div class="member-content">
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './BaseCard.vue';

</script>

<style lang="scss" scoped>
.member-content {
  height: 100%;
  @include flex(column);
}
</style>
