<template>
  <!-- 封装layui-vue模态框弹窗 -->
  <lay-layer v-model="windowVisible" :teleport-disabled="!isTeleport" :maxmin="maxmin" :title="title" :resize="resize"
    :area="sizeArgs" :btn="btn" @close="emit('close')">
    <div ref="contentElement" class="modal-content" :style="syncHeight ? { height: contentHeight } : {}">
      <slot></slot>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import ResizeObserver from 'resize-observer-polyfill';
import { debounce } from '@/utils/debounce';

let currentLayerContent: HTMLElement | null = null;
let originalOverflow: string = '';

// 设置元素样式
const setLayerContentStyle = (element: HTMLElement) => {
  if (currentLayerContent === element) return; // 避免重复设置
  // 保存原始样式
  originalOverflow = element.style.overflow || 'auto';
  // 设置新样式
  element.style.overflow = 'hidden';
  element.style.setProperty('overflow', 'hidden', 'important');
  currentLayerContent = element;
};

// 恢复元素样式
const restoreLayerContentStyle = () => {
  if (currentLayerContent) {
    // 恢复原始样式
    if (originalOverflow) {
      currentLayerContent.style.overflow = originalOverflow;
    } else {
      currentLayerContent.style.removeProperty('overflow');
    }

    currentLayerContent = null;
    originalOverflow = '';
  }
};

type BtnType = {
  text: string;
  style?: string;
  class?: string;
  disabled?: boolean;
  callback: (id: string, ...args: unknown[]) => void;
};

const windowVisible = ref(false);

const {
  visible,
  title,
  isTeleport = true, // 是否可以提升到整个页面，如果不可以，那就要求上层组件position: relative
  btn = ref([]), // 传入的按钮配置
  syncHeight = false, // 是否让内容高度与layui-layer-content保持一致
  maxmin = true, // 默认可以最大化/最小化
  resize = true, // 默认可以调整大小
  sizeArgs = ['80%', '80vh'],
} = defineProps<{
  visible: boolean;
  title: string;
  btn?: BtnType[]; // 需要传入响应式按钮变量
  isTeleport?: boolean;
  syncHeight?: boolean; // 是否同步高度
  maxmin?: boolean; // 是否可以最大化/最小化
  resize?: boolean; // 是否可以调整大小
  sizeArgs?: [string, string]; // 弹窗大小
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

// 高度同步相关
const contentElement = ref<HTMLElement>();
const contentHeight = ref<string>('auto');
let resizeObserver: ResizeObserver | null = null;

// 设置高度监听器
const setupHeightObserver = () => {
  if (!syncHeight || typeof window === 'undefined') return;

  // 等待 DOM 渲染完成
  nextTick(() => {
    // 查找 layui-layer-content 元素
    const layerContent = document.querySelector(
      '.layui-layer-content',
    ) as HTMLElement;

    if (layerContent && contentElement.value) {
      // 设置元素样式，隐藏滚动条
      setLayerContentStyle(layerContent);
      // 立即同步一次高度
      syncContentHeight(layerContent);
      // 创建 ResizeObserver 监听高度变化
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          debouncedSyncContentHeight(target);
        }
      });
      // 开始监听
      resizeObserver.observe(layerContent);
    }
  });
};

// 同步内容高度
const syncContentHeight = (layerContent: HTMLElement) => {
  if (!contentElement.value) return;

  const layerContentHeight = layerContent.clientHeight;
  const layerContentPaddingTop =
    parseInt(getComputedStyle(layerContent).paddingTop, 10) || 0;
  const layerContentPaddingBottom =
    parseInt(getComputedStyle(layerContent).paddingBottom, 10) || 0;

  // 计算可用高度（减去内边距）
  const availableHeight =
    layerContentHeight - layerContentPaddingTop - layerContentPaddingBottom;

  // 设置内容高度
  contentHeight.value = `${availableHeight}px`;

  // 直接设置样式确保立即生效
  contentElement.value.style.height = contentHeight.value;
};

// 防抖的syncContentHeight函数
const debouncedSyncContentHeight = debounce(syncContentHeight, 50);

// 清理高度监听器
const cleanupHeightObserver = () => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  // 恢复元素样式
  restoreLayerContentStyle();
};

// 监听外部visible的变化
watch(
  () => visible,
  (newVal) => {
    windowVisible.value = newVal;

    if (syncHeight) {
      if (newVal) {
        // 弹窗显示时设置高度监听器
        setTimeout(setupHeightObserver, 200);
      } else {
        // 弹窗隐藏时清理监听器
        cleanupHeightObserver();
      }
    }
  },
);

watch(
  () => syncHeight,
  (newVal) => {
    if (newVal) {
      setupHeightObserver();
    } else {
      cleanupHeightObserver();
    }
  },
);

// 生命周期钩子
onMounted(() => {
  // 组件挂载时，如果弹窗已经显示，则设置监听器
  if (syncHeight && visible) {
    setTimeout(setupHeightObserver, 200);
  }
});

onUnmounted(() => {
  cleanupHeightObserver();
});
</script>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  // 当启用高度同步时，确保内容能够正确填充和滚动
  &[style*='height'] {
    min-height: 0;
  }
}
</style>
