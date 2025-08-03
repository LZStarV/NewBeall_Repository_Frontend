<template>
  <BaseCard title="最新动态">
    <template #actions>
      <lay-icon type="layui-icon-clean" class="action-icon" />
      <lay-icon
        :type="isExpanded ? 'layui-icon-left' : 'layui-icon-right'"
        class="action-icon expand-icon"
        @click="toggleExpand"
      />
    </template>

    <div class="dynamic-list"></div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './BaseCard.vue';

interface Props {
  isExpanded: boolean;
}
defineProps<Props>();

const emit = defineEmits<{
  toggleExpand: [];
}>();

const toggleExpand = () => {
  emit('toggleExpand');
};
</script>

<style lang="scss" scoped></style>
