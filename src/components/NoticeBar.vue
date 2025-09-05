<template>
  <!-- 通知栏容器：Flex 布局，左侧图标 + 右侧翻动文本 -->
  <div class="notice-bar">
    <!-- 左侧本地图标：直接引入 SVG 文件，不用任何类名 -->
    <div class="notice-bar__logo">
      <!-- 直接使用导入的 SVG 组件（Vue3 支持直接导入 SVG 为组件） -->
      <Notify class="notice-bar__logo-icon" />
    </div>

    <!-- 右侧垂直翻动文本区（核心逻辑不变） -->
    <div class="notice-bar__content">
      <div
        class="notice-bar__list"
        :style="{
          transform: `translateY(-${currentIndex * 100}%)`,
          transition: 'transform 0.4s ease',
        }"
      >
        <div
          v-for="(text, idx) in textlist"
          :key="idx"
          class="notice-bar__item"
        >
          {{ text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Notify from '@assets/icons/notify.svg';

import { ref, onMounted, onUnmounted, watch } from 'vue';

// 2. 仅保留核心 props：通知文本列表（必传）
const props = defineProps({
  textlist: {
    type: Array,
    required: true,
    validator: (val) => Array.isArray(val) && val.length > 0,
  },
});

// 4. 垂直翻动核心逻辑
const currentIndex = ref(0);
let pageTimer = null;

// 启动翻页定时器
const startPageTimer = () => {
  if (pageTimer) clearInterval(pageTimer);
  pageTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.textlist.length;
  }, 5000);
};

// 生命周期：挂载启动定时器，卸载清除定时器（避免内存泄漏）
onMounted(() => startPageTimer());
onUnmounted(() => pageTimer && clearInterval(pageTimer));

// 监听文本列表变化：如果 textlist 变了，重置到第一条重新翻页
watch(
  () => props.textlist,
  () => {
    currentIndex.value = 0;
    startPageTimer();
  },
  { deep: true },
);
</script>

<style scoped>
/* 通知栏容器：基础样式，想改直接调 */
.notice-bar {
  width: 100%;
  height: 40px; /* 固定高度，确保只显示一条文本 */
  line-height: 40px; /* 文本垂直居中 */
  padding: 0 16px; /* 左右内边距，避免贴边 */
  box-sizing: border-box;
  display: flex; /* 让图标和文本横向排列 */
  align-items: center; /* 垂直居中对齐 */
}

/* 图标容器：控制图标和文本的间距 */
.notice-bar__logo {
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  .notice-bar__logo-icon {
    color: #fff;
  }
}

/* 文本内容区：确保只显示当前条文本，溢出隐藏 */
.notice-bar__content {
  flex: 1; /* 占满剩余宽度，避免文本被挤压 */
  height: 100%;
  overflow: hidden; /* 隐藏超出的文本 */
  position: relative;
}

/* 文本列表：控制翻转动画的容器 */
.notice-bar__list {
  width: 100%;
  height: 100%;
}

/* 单个文本条目：单行显示，溢出用省略号 */
.notice-bar__item {
  width: 100%;
  height: 100%;
  white-space: nowrap; /* 禁止文本换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出显示省略号（...） */
  color: #ffffff;
  font-size: 14px;
}
</style>
