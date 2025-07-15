<!-- Svg图片组件 -->
<template>
  <svg
    aria-hidden="true"
    :width="width"
    :height="height"
  >
    <use
      :xlink:href="symbolId"
      :fill="color"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string
  prefix?: string
  width?: string
  height?: string
  color?: string
}

const { name, prefix = 'icon', width = '1rem', height = '1rem', color = 'currentColor' } = defineProps<Props>();

const symbolId = computed(() => `#${prefix}-${name}`);
</script>
