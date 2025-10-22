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
import { computed, ref, type ComputedRef } from 'vue';

interface SideToolbarItem {
  iconName: string;
  name: string;
  btnAction: () => void;
}

const emits = defineEmits([
  'scrollToTop',
  'collapseAllSubItems',
  'toggleTotalPricePreview',
  'extractModule',
  'toggleSchemeCloud',
  'toggleImportModulePanel',
  'loadTempProductIntoDatabase',
  'scrollToBottom',
]);

const isAllSubItemsCollapsed = ref(false);

const sideToolbarConfig: ComputedRef<SideToolbarItem[]> = computed(() => [
  {
    iconName: 'expand_light_reverse',
    name: '返回顶部',
    btnAction: () => {
      emits('scrollToTop');
    },
  },
  {
    iconName: isAllSubItemsCollapsed.value ? 'enlarge_item' : 'shrink_item',
    name: isAllSubItemsCollapsed.value ? '展开所有子项目' : '折叠所有子项目',
    btnAction: () => {
      isAllSubItemsCollapsed.value = !isAllSubItemsCollapsed.value;
      emits('collapseAllSubItems', isAllSubItemsCollapsed.value);
    },
  },
  {
    iconName: 'rmb',
    name: '总价预览',
    btnAction: () => {
      emits('toggleTotalPricePreview');
    },
  },
  {
    iconName: 'plus',
    name: '提取模块',
    btnAction: () => {
      emits('extractModule');
    },
  },
  {
    iconName: 'query',
    name: '查看方案云',
    btnAction: () => {
      emits('toggleSchemeCloud');
    },
  },
  {
    iconName: 'order_receive_order',
    name: '导入模块',
    btnAction: () => {
      emits('toggleImportModulePanel');
    },
  },
  {
    iconName: 'house_manager',
    name: '临时产品载入数据库',
    btnAction: () => {
      emits('loadTempProductIntoDatabase');
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
