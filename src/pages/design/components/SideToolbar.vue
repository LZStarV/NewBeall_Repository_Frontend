<template>
  <div class="side-toolbar">
    <lay-tooltip position="left" content="返回顶部">
      <div class="side-toolbar-item" @click="scrollToTop">
        <SvgIcon name="expand_light_reverse" />
      </div>
    </lay-tooltip>

    <lay-tooltip position="left" v-for="btn of sideToolbarConfig" :key="btn.name" :content="btn.name">
      <div class="side-toolbar-item" @click="btn.btnAction">
        <SvgIcon :name="btn.iconName" />
      </div>
    </lay-tooltip>

    <lay-tooltip position="left" content="返回底部">
      <div class="side-toolbar-item" @click="scrollToBottom">
        <SvgIcon name="expand_light" />
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

const emits = defineEmits(['scrollToTop', 'collapseAllSubItems', 'toggleTotalPricePreview', 'extractModule', 'toggleSchemeCloud', 'toggleImportModulePanel', 'loadTempProductIntoDatabase', 'scrollToBottom']);

const scrollToTop = () => {
  emits('scrollToTop');
};

const isAllSubItemsCollapsed = ref(false);

const collapseAllSubItems = () => {
  isAllSubItemsCollapsed.value = !isAllSubItemsCollapsed.value;
  emits('collapseAllSubItems', isAllSubItemsCollapsed.value);
};

const toggleTotalPricePreview = () => {
  emits('toggleTotalPricePreview');
};

const extractModule = () => {
  emits('extractModule');
};

const toggleSchemeCloud = () => {
  emits('toggleSchemeCloud');
};

const toggleImportModulePanel = () => {
  emits('toggleImportModulePanel');
};

const loadTempProductIntoDatabase = () => {
  emits('loadTempProductIntoDatabase');
};

const scrollToBottom = () => {
  emits('scrollToBottom');
};

const sideToolbarConfig: ComputedRef<SideToolbarItem[]> = computed(() => [
  {
    iconName: isAllSubItemsCollapsed.value ? 'enlarge_item' : 'shrink_item',
    name: isAllSubItemsCollapsed.value ? '展开所有子项目' : '折叠所有子项目',
    btnAction: collapseAllSubItems,
  },
  {
    iconName: 'rmb',
    name: '总价预览',
    btnAction: toggleTotalPricePreview,
  },
  {
    iconName: 'plus',
    name: '提取模块',
    btnAction: extractModule,
  },
  {
    iconName: 'query',
    name: '查看方案云',
    btnAction: toggleSchemeCloud,
  },
  {
    iconName: 'order_receive_order',
    name: '导入模块',
    btnAction: toggleImportModulePanel,
  },
  {
    iconName: 'house_manager',
    name: '临时产品载入数据库',
    btnAction: loadTempProductIntoDatabase,
  },
]);
</script>

<style scoped lang="scss">
.side-toolbar {
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
  right: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .side-toolbar-item {
    width: 40px;
    height: 40px;
    background-color: #f6f6f6;
    color: #a1a1a1;
    border-radius: 12px 0 0 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;

    &:hover {
      color: #000;
      background-color: #f0f0f0;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
