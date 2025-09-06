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
      <lay-side width="230px" class="main-aside">
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
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import Tabs from '@/components/Tabs.vue';

const sidebarCollapsed = ref(false);

const handleHeaderToggle = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed;
};
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
      transition: width 0.3s ease;

      &.collapsed {
        width: $sidebarWidthCollapsed;
      }

      .sidebar-wrapper {
        height: 100%;
        transition: width 0.3s ease;
        padding-bottom: 20px;
      }
    }

    .main-body {
      flex: 1;
      height: calc(100vh - $mainContentMarginTop - 20px);
      padding-right: 20px;
      border-radius: $border-radius-extra-large;
      transition: margin-left 0.3s ease;
      z-index: 80;

      .main-layout &.collapsed {
        margin-left: $sidebarWidthCollapsed;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .main-layout {
    > lay-layout {
      .lay-body {
        padding: 16px;
      }
    }
  }
}

@media (max-width: 768px) {
  $headerHeight: 56px;
  $tabsHeight: 40px;
  $totalHeaderHeight: $headerHeight + $tabsHeight;

  .main-layout {
    .main-header {
      height: $totalHeaderHeight;

      .header-wrapper {
        height: $headerHeight;
      }

      .tabs-wrapper {
        height: $tabsHeight;
        padding: 0 12px;
      }
    }

    > lay-layout {
      .lay-body {
        padding: 12px;
      }
    }
  }
}
</style>
