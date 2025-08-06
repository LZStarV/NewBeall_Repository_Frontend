<template>
  <span class="text-cell" :class="[`style-${styleType}`]">
    {{ displayValue }}
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  data: any;
  index: number;
  column: any;
  styleType?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  formatter?: (value: any, data: any) => string;
}

const props = withDefaults(defineProps<Props>(), {
  styleType: 'default',
});

const displayValue = computed(() => {
  const value = props.column.key
    .split('.')
    .reduce((obj: any, k: string) => obj?.[k], props.data);

  if (props.formatter) {
    return props.formatter(value, props.data);
  }

  return value ?? '';
});
</script>

<style scoped lang="scss">
@import '@/styles/variables';

.text-cell {
  &.style-primary {
    color: $primary-color;
    font-weight: 500;
  }

  &.style-success {
    color: $success-color;
    font-weight: 500;
  }

  &.style-warning {
    color: $warning-color;
    font-weight: 500;
  }

  &.style-danger {
    color: $danger-color;
    font-weight: 500;
  }
}
</style>
