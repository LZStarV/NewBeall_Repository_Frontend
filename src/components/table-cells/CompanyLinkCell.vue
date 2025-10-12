<template>
  <lay-tooltip position="top" :content="displayValue">
    <span class="text-cell" @click="handleClick">
      {{ displayValue }}
    </span>
  </lay-tooltip>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  data: any;
  index: number;
  column: any;
}

const props = defineProps<Props>();

const displayValue = computed(() => {
  const company = props.data[props.column.key];

  return typeof company === 'string' ? company : company?.abbreviation || '';
});

const handleClick = () => {
  window.open(displayValue.value, '_blank');
};
</script>

<style scoped lang="scss">
@use 'sass:color';

.text-cell {
  color: $primary-color;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: color.adjust($primary-color, $lightness: -10%);
  }
}
</style>
