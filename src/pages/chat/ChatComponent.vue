<template>
  <div class="chat-box" :class="{ 'mobile-view': isMobileView }">
    <div
      class="column left-column"
      :style="{ width: `${leftWidth}%` }"
      :class="{ 'mobile-full': isMobileView && !showMessageBox }"
    >
      <!-- 侧边导航栏 -->
      <ChatNavbar @nav-items-list-loaded="navItemsList = $event" />

      <!-- 联系人列表 -->
      <ChatContactList
        :style="{ width: `calc(${100}% - 65px)` }"
        :nav-items-list="navItemsList!"
        @contact-selected="handleContactSelected"
      />
    </div>

    <!-- 分割符 -->
    <div
      v-if="!isMobileView"
      class="resizer"
      :class="{ resizing: isResizing }"
      @mousedown="startResize($event)"
    ></div>

    <!-- 聊天区域 -->
    <div
      class="column right-column"
      :style="{ width: isMobileView ? '100%' : `${rightWidth}%` }"
      :class="{ 'mobile-show': isMobileView && showMessageBox }"
    >
      <ChatMessageBox :show-back-button="isMobileView" @back-clicked="showMessageBox = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContactGroup } from './Chat.type';
import ChatContactList from './components/ChatContactList.vue';
import ChatMessageBox from './components/ChatMessageBox.vue';
import ChatNavbar from './components/ChatNavbar.vue';
import { ref, onUnmounted, computed, onMounted, watch } from 'vue';
import { useChatStore } from '@/stores/chat';

// 组件之间传递数据的中间变量
const navItemsList = ref<ContactGroup[]>();

interface ResizeState {
  isResizing: boolean;
  startX: number;
  startLeftWidth: number;
}

const leftWidth = ref<number>(40);
const isResizing = ref<boolean>(false);
const isMobileView = ref<boolean>(false);
const showMessageBox = ref<boolean>(false);
const chatStore = useChatStore();

// 计算右列宽度
const rightWidth = computed<number>(() => 100 - leftWidth.value);

// 最小和最大宽度限制
const MIN_WIDTH = 30;
const MAX_WIDTH = 50;

const resizeState = ref<ResizeState>({
  isResizing: false,
  startX: 0,
  startLeftWidth: 0,
});

const startResize = (event: MouseEvent): void => {
  event.preventDefault(); // 阻止默认事件
  isResizing.value = true;

  resizeState.value = {
    isResizing: true,
    startX: event.clientX,
    startLeftWidth: leftWidth.value,
  };

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};

// 处理调整大小
const handleResize = (event: MouseEvent): void => {
  if (!isResizing.value) return;

  const container = document.querySelector('.chat-box') as HTMLElement;
  if (!container) return;

  const containerWidth = container.clientWidth;
  const deltaX = event.clientX - resizeState.value.startX;
  const deltaPercent = (deltaX / containerWidth) * 100;

  const newLeftWidth = resizeState.value.startLeftWidth + deltaPercent;

  // 应用宽度限制
  leftWidth.value = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newLeftWidth));
};

// 停止调整大小
const stopResize = (): void => {
  isResizing.value = false;

  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

// 检查窗口大小并设置响应式状态
const checkWindowSize = () => {
  isMobileView.value = window.innerWidth <= 768;
};

// 处理联系人选择
const handleContactSelected = () => {
  if (isMobileView.value) {
    showMessageBox.value = true;
  }
};

// 监听聊天信息变化，在移动端自动显示消息框
watch(
  () => chatStore.chatInfo,
  (newVal) => {
    if (newVal && isMobileView.value) {
      showMessageBox.value = true;
    }
  }
);

onMounted(() => {
  checkWindowSize();
  window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
  window.removeEventListener('resize', checkWindowSize);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
});
</script>

<style scoped lang="scss">
.chat-box {
  width: 100%;
  max-width: 1000px;
  min-width: 1000px;
  max-height: 900px;
  margin: 20rem 0;
  height: 90%;
  background: white;
  border-radius: $border-radius-extra-large;
  border: 1px solid #ededed;
  display: flex;
  box-shadow: $box-shadow-base;
  position: relative;
  transition: all 0.3s ease;
}

.column {
  display: flex;
  overflow: hidden;
  flex-shrink: 0;
}

.resizer {
  width: 2px;
  background-color: #e2e8f0;
  cursor: col-resize;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background-color: $primary-color;
    width: 2px;
  }

  &.resizing {
    background-color: $primary-color;
    width: 2px;
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -3px;
    right: -3px;
    bottom: 0;
    background-color: transparent;
  }

  // 添加拖拽指示器
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 45px;
    background-color: rgb(255, 255, 255);
    border: 1px solid #ededed;
    box-shadow: $box-shadow-base;
    border-radius: 3px;
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 10;
  }

  &:hover::after,
  &.resizing::after {
    opacity: 1;
  }
}

/* 平板模式 */
@media (max-width: $desktop_layout_breakpoint) {
  .chat-box {
    min-width: auto;
    width: 100%;
    margin: 0;
    height: 100%;
    border-radius: 0;
  }
}

/* 手机模式 */
@media (max-width: $pad_layout_breakpoint) {
  .chat-box {
    &.mobile-view {
      .left-column {
        width: 100% !important;

        &.mobile-full {
          display: flex;
        }
      }

      .right-column {
        position: fixed;
        top: 0;
        left: 0;
        width: 100% !important;
        height: 100%;
        z-index: 100;
        background: white;
        transform: translateX(100%);
        transition: transform 0.3s ease;

        &.mobile-show {
          transform: translateX(0);
        }
      }
    }
  }
}
</style>
