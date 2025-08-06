<template>
  <div class="status-cell">
    <lay-badge :color="statusConfig.color" :text="statusConfig.text" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface StatusConfig {
  value: any;
  text: string;
  color: string;
}

interface Props {
  data: any;
  index: number;
  column: any;
  statusMap: StatusConfig[];
}

const props = defineProps<Props>();

const currentValue = computed(() => {
  return props.column.key
    .split('.')
    .reduce((obj: any, k: string) => obj?.[k], props.data);
});

const statusConfig = computed(() => {
  const config = props.statusMap.find(
    (item) => item.value === currentValue.value,
  );
  return config || { text: '未知', color: 'gray' };
});
</script>

<style scoped lang="scss">
.status-cell {
  display: flex;
  align-items: center;
}
</style>
