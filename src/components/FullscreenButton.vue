<template>
  <div>
    <button @click="() => toggleFullscreen()" :disabled="!isSupported" class="fullscreen-btn" :title="titleText">
      <span class="btn-text">{{ buttonText }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFullscreen } from '@/composables/useFullscreen'; // 引入你的Composable

const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();

// 创建一个计算属性来动态改变按钮文字
const buttonText = computed(() => {
  return isFullscreen.value ? '退出全屏' : '进入全屏';
});

const titleText = computed(() => {
  return isSupported ? buttonText.value : '此浏览器不支持全屏'
})
</script>

<style lang="scss" scoped>
.fullscreen-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  /* 图标和文字之间的间距 */
  background: white;
  border: 1px solid #e3e3e3;
  padding: 8px 12px;
  border-radius: $border-radius-middle;
  cursor: pointer;

  &:hover {
    background-color: #e3e3e3;
  }

  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
}
</style>
