import dayjs from 'dayjs';

export function useFormatDate() {
  /**
   * 将输入解析为标准格式：YYYY-MM-DD HH:mm:ss
   * @param input 时间字符串、时间戳（秒或毫秒）
   * @returns 解析后的字符串
   */
  function parseDateTime(input: number): string {
    const date = dayjs(input);
    return date.format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   * @param input - 格式为 "YYYY-MM-DD HH:mm:ss" 的时间字符串或时间戳（number）
   * @returns 格式化后的友好字符串
   */
  function formatDateTime(input: string | number): string {
    const date =
      typeof input === 'number'
        ? dayjs(input)
        : dayjs(input, 'YYYY-MM-DD HH:mm:ss');

    if (!date.isValid()) return String(input);

    const now = dayjs();
    const diffMinutes = now.diff(date, 'minute');

    if (diffMinutes < 1) {
      return '刚刚';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    }

    const startOfToday = now.startOf('day');
    const startOfYesterday = startOfToday.subtract(1, 'day');

    if (date.isSame(startOfToday, 'day')) {
      return date.format('HH:mm');
    } else if (date.isSame(startOfYesterday, 'day')) {
      return '昨天';
    } else {
      // 如果是今年，只显示 MM-DD，否则显示完整日期
      return date.year() === now.year()
        ? date.format('MM-DD')
        : date.format('YYYY-MM-DD');
    }
  }

  /**
   * 比较两个时间的先后（用于排序）
   * @param a - 时间字符串或时间戳
   * @param b - 时间字符串或时间戳
   * @returns a < b 返回负数，a == b 返回 0，a > b 返回正数
   */
  function compareDateTime(a: string | number, b: string | number): number {
    const dateA = dayjs(typeof a === 'number' || /^\d+$/.test(a) ? +a : a);
    const dateB = dayjs(typeof b === 'number' || /^\d+$/.test(b) ? +b : b);

    if (!dateA.isValid() && !dateB.isValid()) return 0;
    if (!dateA.isValid()) return -1;
    if (!dateB.isValid()) return 1;

    return dateA.valueOf() - dateB.valueOf();
  }

  return { parseDateTime, formatDateTime, compareDateTime };
}
