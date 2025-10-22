<template>
  <div class="side-toolbar">
    <lay-tooltip
      position="left"
      v-for="btn of sideToolbarConfig"
      :key="btn.name"
      :content="btn.name"
    >
      <div class="side-toolbar-item" @click="btn.btnAction">
        <SvgIcon :name="btn.iconName" />
      </div>
    </lay-tooltip>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';
import { computed, type ComputedRef } from 'vue';

interface SideToolbarItem {
  iconName: string;
  name: string;
  btnAction: () => void;
}

const emits = defineEmits([
  'exportExcel',
  'printOrderInfo',
  'scrollToTop',
  'scrollToBottom',
  'toggleCommentPanel',
  'toggleTotalPricePreview',
]);

const sideToolbarConfig: ComputedRef<SideToolbarItem[]> = computed(() => [
  {
    iconName: 'export',
    name: '导出 Excel',
    btnAction: () => {
      emits('exportExcel');
    },
  },
  {
    iconName: 'print',
    name: '打印',
    btnAction: () => {
      emits('printOrderInfo');
    },
  },
  {
    iconName: 'message_2',
    name: '评论',
    btnAction: () => {
      emits('toggleCommentPanel');
    },
  },
  {
    iconName: 'rmb',
    name: '报价单总价详情',
    btnAction: () => {
      emits('toggleTotalPricePreview');
    },
  },
  {
    iconName: 'expand_light_reverse',
    name: '返回顶部',
    btnAction: () => {
      emits('scrollToTop');
    },
  },
  {
    iconName: 'expand_light',
    name: '返回底部',
    btnAction: () => {
      emits('scrollToBottom');
    },
  },
]);
</script>

<style scoped lang="scss">
@use './side_toolbar.scss' as *;
</style>
