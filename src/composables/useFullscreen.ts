import screenfull from "screenfull";
import { onMounted, onUnmounted, readonly, ref } from "vue";

export function useFullscreen() {
  const isFullscreen = ref(false);
  const isSupported = screenfull.isEnabled;

  const handleChange = () => {
    if (isSupported) {
      isFullscreen.value = screenfull.isFullscreen;
    }
  };

  const handleError = (event: Event) => {
    console.error('进入全屏模式失败', event);
    isFullscreen.value = false;
  };

  // 在全屏/非全屏中切换
  // 如果提供了元素，则让该元素全屏; 未提供元素，则让整个页面全屏
  const toggleFullscreen = async (element?: HTMLElement | null) => {
    if (!isSupported) {
      console.warn('全屏模式不支持当前浏览器');
      return;
    }

    try {
      if (element) {
        await screenfull.toggle(element);
      } else {
        await screenfull.toggle();
      }
    } catch (error) {
      handleError(error as Event);
    }
  };

  // 切换到全屏模式
  // 如果提供了元素，则让该元素全屏; 未提供元素，则让整个页面全屏
  const enterFullscreen = async (element?: HTMLElement | null) => {
    if (!isSupported) {
      console.warn('全屏模式不支持当前浏览器');
      return;
    }
    try {
        if (element) {
            await screenfull.request(element);
        } else {
            await screenfull.request();
        }
    } catch (error) {
        handleError(error as Event);
    }
  };

  // 退出全屏模式
  const exitFullscreen = async () => {
    if (!isSupported) return;
    if (screenfull.isFullscreen) {
      try {
        await screenfull.exit();
      } catch (error) {
        handleError(error as Event);
      }
    }
  };

  // 监听change和error事件
  onMounted(() => {
    if (isSupported) {
      screenfull.on('change', handleChange);
      screenfull.on('error', handleError);
    }
  });

  // 移除监听器
  onUnmounted(() => {
    if (isSupported) {
      screenfull.off('change', handleChange);
      screenfull.off('error', handleError);
    }
  });

  return {
    isFullscreen: readonly(isFullscreen),
    isSupported,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
  };
}
