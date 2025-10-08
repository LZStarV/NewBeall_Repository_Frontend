<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="main-layout">
    <lay-header class="main-header">
      <div class="header-wrapper">
        <Header @toggle-sidebar="handleHeaderToggle" />
      </div>
      <div class="tabs-wrapper">
        <Tabs />
      </div>
    </lay-header>

    <div class="main-content">
      <lay-side
        :width="sidebarCollapsed ? '50px' : '220px'"
        class="main-aside"
        :style="sidebarCollapsed ? { padding: '0' } : {}"
      >
        <div class="sidebar-wrapper" :class="{ collapsed: sidebarCollapsed }">
          <Sidebar :collapsed="sidebarCollapsed" />
        </div>
      </lay-side>

      <lay-body class="main-body">
        <RouterView />
      </lay-body>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import Tabs from '@/components/Tabs.vue';
import env from '@/utils/env.ts';

const sidebarCollapsed = ref(false);
const handleHeaderToggle = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed;
};

onMounted(() => {
  if (window.innerWidth <= env.getPadLayoutBreakpoint()) {
    sidebarCollapsed.value = true;
  }
});
</script>

<style scoped lang="scss">
$headerHeight: 64px;
$tabsHeight: 100px;
$totalHeaderHeight: $headerHeight + $tabsHeight;
$mainContentMarginTop: $headerHeight + $tabsHeight / 2;
$sidebarWidth: 300px;
$sidebarWidthCollapsed: 80px;

.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;

  .main-header {
    width: 100%;
    height: $totalHeaderHeight;
    background-image: url('@/assets/image/default/background.png');
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;

    .header-wrapper {
      height: $headerHeight;
      flex-shrink: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tabs-wrapper {
      height: $tabsHeight;
      flex-shrink: 0;
      width: 100%;
      padding: 0 20px;
      display: flex;
      align-items: flex-start;
    }
  }

  .main-content {
    flex: 1;
    display: flex;
    position: fixed;
    top: $mainContentMarginTop;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;

    .main-aside {
      width: $sidebarWidth;
      flex-shrink: 0;
      z-index: 90;
      padding: 0 20px;
      transition:
        width 0.3s ease,
        padding 0.3s ease;
      overflow: visible;

      &.collapsed {
        width: $sidebarWidthCollapsed;
      }

      .sidebar-wrapper {
        height: 100%;
        transition:
          width 0.3s ease,
          padding 0.3s ease;
        padding-bottom: 20px;
        width: 100%;
      }
    }

    .main-body {
      flex: 1;
      height: calc(100vh - $mainContentMarginTop - 20px);
      padding-right: 20px;
      border-radius: $border-radius-extra-large;
      transition: margin-left 0.3s ease;
      z-index: 80;

      .sidebar-wrapper.collapsed + & {
        margin-left: $sidebarWidthCollapsed;
      }
    }
  }
}
</style>
