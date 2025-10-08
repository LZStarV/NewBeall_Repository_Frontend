/**
 * 防抖函数 - 用于延迟执行函数，直到在指定时间内没有新的触发
 * @param func 需要防抖的函数
 * @param delay 延迟时间(毫秒)
 * @returns 防抖处理后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    // 清除之前的定时器
    clearTimeout(timeoutId);
    // 设置新的定时器
    timeoutId = setTimeout(
      () =>
        func.apply<ThisParameterType<T>, Parameters<T>, ReturnType<T>>(
          this,
          args,
        ),
      delay,
    );
  };
}
