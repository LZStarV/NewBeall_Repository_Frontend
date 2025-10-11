<template>
    <!-- 右侧滑入弹窗组件 -->
    <teleport to="body" :disabled="!isTeleport">
        <div
v-if="modalVisible" class="right-side-modal-overlay" :class="{
            'show': modalVisible,
            'teleport-enabled': isTeleport,
            'content-wrapper-positioned': modalElement?.parentElement?.classList.contains('content-wrapper-positioned')
        }">
            <!-- 左侧可点击的遮罩区域 -->
            <div class="mask-clickable-area" @click="handleMaskClick"></div>
            <!-- 右侧弹窗 -->
            <div ref="modalElement" class="right-side-modal" :style="{ width: width }" @click.stop>
                <!-- 弹窗头部 -->
                <div class="modal-header">
                    <h3 class="modal-title">{{ title }}</h3>
                    <div class="header-actions">
                        <button class="action-btn close-btn" title="关闭" @click="handleClose">
                            <lay-icon type="layui-icon-close" />
                        </button>
                    </div>
                </div>

                <!-- 弹窗内容 -->
                <div class="modal-content">
                    <slot></slot>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';

const modalVisible = ref(false);

const {
    visible,
    title,
    width = '35%',
    isTeleport = false,
    maskClosable = true,
} = defineProps<{
    visible: boolean;
    title: string;
    width?: string;
    isTeleport?: boolean;
    maskClosable?: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const modalElement = ref<HTMLElement>();

// 处理遮罩点击
const handleMaskClick = () => {
    if (maskClosable) {
        handleClose();
    }
};

// 处理关闭
const handleClose = () => {
    emit('close');
};

// 处理滚动穿透
const handleWheelEvent = (event: WheelEvent) => {
    // 检查滚动事件是否发生在弹窗外的区域
    const modalEl = modalElement.value;
    if (modalEl) {
        const rect = modalEl.getBoundingClientRect();
        const mouseX = event.clientX;

        // 如果鼠标在弹窗左侧（透明遮罩区域）
        if (mouseX < rect.left) {
            // 阻止默认行为
            event.preventDefault();

            // 找到 content-wrapper 并手动触发滚动
            const contentWrapper = document.querySelector('.content-wrapper') as HTMLElement;
            if (contentWrapper) {
                // 手动滚动 content-wrapper
                contentWrapper.scrollTop += event.deltaY;
            }
        }
    }
};

// 设置基于content-wrapper的定位
const setContentWrapperPosition = (overlay: HTMLElement) => {
    if (isTeleport) return; // teleport模式不需要调整

    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
        const rect = contentWrapper.getBoundingClientRect();
        overlay.style.position = 'fixed';
        overlay.style.left = `${rect.left}px`;
        overlay.style.top = `${rect.top}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
        overlay.classList.add('content-wrapper-positioned');
    }
};

// 清除定位样式
const clearPosition = (overlay: HTMLElement) => {
    if (isTeleport) return;

    overlay.style.position = '';
    overlay.style.left = '';
    overlay.style.top = '';
    overlay.style.width = '';
    overlay.style.height = '';
    overlay.classList.remove('content-wrapper-positioned');
};

// 监听外部visible的变化
watch(
    () => visible,
    (newVal) => {
        if (newVal) {
            modalVisible.value = true;

            nextTick(() => {
                const modalEl = modalElement.value;
                const overlay = modalEl?.parentElement;

                if (modalEl && overlay) {
                    // 设置CSS自定义属性，传递弹窗宽度
                    overlay.style.setProperty('--modal-width', width);

                    // 立即设置基于content-wrapper的定位
                    setContentWrapperPosition(overlay);

                    // 添加滚动事件监听
                    overlay.addEventListener('wheel', handleWheelEvent, { passive: false });

                    // 延迟触发滑入动画
                    setTimeout(() => {
                        modalEl.classList.add('slide-in');
                    }, 10);
                }
            });
        } else {
            const modalEl = modalElement.value;
            if (modalEl) {
                modalEl.classList.remove('slide-in');

                // 等待动画完成后清除定位和隐藏
                setTimeout(() => {
                    const overlay = modalEl.parentElement;
                    if (overlay) {
                        // 移除滚动事件监听
                        overlay.removeEventListener('wheel', handleWheelEvent);

                        clearPosition(overlay);
                        // 清除CSS自定义属性
                        overlay.style.removeProperty('--modal-width');
                    }
                    modalVisible.value = false;
                }, 300);
            }
        }
    },
    { immediate: true }
);

// 监听窗口大小变化，更新定位
const handleResize = () => {
    if (modalVisible.value) {
        const modalEl = modalElement.value;
        const overlay = modalEl?.parentElement;
        if (overlay && overlay.classList.contains('content-wrapper-positioned')) {
            setContentWrapperPosition(overlay);
        }
    }
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
// 遮罩层样式
.right-side-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
    transition: background-color 0.3s ease;
    // 改为接收事件，这样可以监听滚动
    pointer-events: auto;

    // teleport模式使用fixed定位（相对于整个视口）
    &.teleport-enabled {
        position: fixed;
    }

    // 基于content-wrapper的定位
    &.content-wrapper-positioned {
        position: fixed;
        // 位置通过JavaScript动态设置
        z-index: 1000;
    }

    &.show {
        background-color: rgba(0, 0, 0, 0.3);
        // 接收事件，包括滚动和点击
        pointer-events: auto;
    }
}

// 左侧可点击的遮罩区域（现在主要用于视觉区分）
.mask-clickable-area {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - var(--modal-width, 35%));
    height: 100%;
    pointer-events: auto;
    background: transparent;
    z-index: 0;
}

// 右侧弹窗主体样式
.right-side-modal {
    background: white;
    height: 100%;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    overflow: hidden;
    // 弹窗本身必须能接收事件
    pointer-events: auto;
    position: relative;
    z-index: 1;

    // teleport模式使用100vh
    .teleport-enabled & {
        height: 100vh;
    }

    // 基于content-wrapper定位时使用100%
    .content-wrapper-positioned & {
        height: 100%;
    }

    &.slide-in {
        transform: translateX(0);
    }
}

// 弹窗头部样式
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e8e8e8;
    background: #fafafa;
    flex-shrink: 0;

    .modal-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
    }

    .header-actions {
        display: flex;
        align-items: center;

        .action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border: none;
            border-radius: 4px;
            background: transparent;
            color: #666;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                background: #e8e8e8;
                color: #333;
            }

            &.close-btn:hover {
                background: #ff4d4f;
                color: white;
            }

            .layui-icon {
                font-size: 14px;
            }
        }
    }
}

// 弹窗内容样式
.modal-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    overflow-x: hidden;

    // 滚动条样式
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 3px;

        &:hover {
            background: #bbb;
        }
    }
}

// 响应式设计
@media screen and (max-width: 768px) {
    .right-side-modal {
        width: 85% !important;
    }
}

@media screen and (max-width: 480px) {
    .right-side-modal {
        width: 95% !important;
    }
}
</style>