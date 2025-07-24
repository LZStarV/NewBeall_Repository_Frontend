/**
 * 图片预加载工具函数
 * 批量预加载图片资源到浏览器缓存，避免后续使用时的加载延迟
 * 适用于轮播图、动画序列帧等需要提前加载图片资源的场景
 *
 * @param {Array<string>} imagesToPreload - 需要预加载的图片URL数组
 * @example
 * // 预加载首页轮播图图片
 * preloadImages([
 *   '/assets/image/banner1.jpg',
 *   '/assets/image/banner2.jpg',
 *   '/assets/image/banner3.jpg'
 * ]);
 *
 * // 在Vue组件中使用
 * onMounted(() => {
 *   preloadImages(productImages.value);
 * });
 */
const preloadImages = (imagesToPreload: string[]) => {
  if (!imagesToPreload || imagesToPreload.length === 0) {
    console.warn('预加载图片列表为空，无需执行预加载');
    return;
  }

  // 遍历图片URL列表，通过Image对象加载图片
  imagesToPreload.forEach((imgUrl) => {
    // 跳过空URL，避免无效请求
    if (!imgUrl) {
      console.warn('检测到空的图片URL，已跳过');
      return;
    }

    const img = new Image();
    img.src = imgUrl;

    // 监听加载失败事件
    img.onerror = () => {
      console.warn(`图片预加载失败: ${imgUrl}`);
    };

    // 可选：添加加载成功回调
    // img.onload = () => {
    //   console.log(`图片预加载成功: ${imgUrl}`);
    // };
  });
};

export default preloadImages;
