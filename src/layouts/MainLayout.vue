<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="main-layout">
    <!-- 左侧边栏 -->
    <div class="sidebar-wrapper" :class="{ collapsed: sidebarCollapsed }">
      <Sidebar :collapsed="sidebarCollapsed" />
    </div>

    <!-- 右侧主内容区域 -->
    <div class="main-content-layout">
      <div class="full-header-wrapper">
        <div class="header-wrapper">
          <Header @toggle-sidebar="handleHeaderToggle" />
        </div>

        <div class="tabs-wrapper">
          <Tabs />
        </div>
      </div>

      <div class="content-wrapper">
        <RouterView />
      </div>
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
.main-layout {
  height: 100vh;
  display: flex;
  width: 100%;

  .sidebar-wrapper {
    width: 240px;
    height: 100%;

    &.collapsed {
      width: 60px;
    }
  }

  .main-content-layout {
    flex: 1;
    height: 100%;
    display: flex;

    flex-direction: column;
    min-width: 0;

    .full-header-wrapper {
      background-image: url('@/assets/image/default/background.png');
    }

    .header-wrapper {
      height: 60px;
    }

    .tabs-wrapper {
      height: 40px;
    }

    .content-wrapper {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      // 为右侧弹窗提供定位参考
      position: relative;
    }
  }
}
</style>
