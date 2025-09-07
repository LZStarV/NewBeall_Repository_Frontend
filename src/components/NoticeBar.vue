<template>
  <!-- 通知栏容器：Flex 布局，左侧图标 + 右侧翻动文本 -->
  <div
    :style="{
      width: `${width}px`,
    }"
    class="notice-bar"
  >
    <div
      :style="{
        width: `${width < 16 ? 0 : width}px`,
      }"
      class="notice-bar__logo"
    >
      <Notify class="notice-bar__logo-icon" />
    </div>

    <!-- 右侧垂直翻动文本区，添加tooltip功能 -->
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
          :content="text"
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

const props = defineProps({
  width: {
    type: Number,
    required: false,
    default: 200,
  },
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
.notice-bar {
  width: 100%;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  min-width: 0;
}

.notice-bar__logo {
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 24px;
  width: 100%;

  .notice-bar__logo-icon {
    color: #fff;
  }
}

.notice-bar__content {
  height: 100%;
  overflow: hidden; /* 隐藏超出的文本 */
  position: relative;
}

.notice-bar__list {
  width: 100%;
  height: 100%;
}

/* 单个文本条目：单行显示，溢出用省略号 */
.notice-bar__item {
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ffffff;
  font-size: 14px;
}
</style>
