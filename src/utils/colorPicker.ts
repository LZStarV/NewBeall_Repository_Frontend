// 颜色解析结果接口
interface RgbValues {
  r: number;
  g: number;
  b: number;
}

// 内部工具函数：解析颜色字符串为RGB数值
const parseColorToRgb = (colorString: string): RgbValues | null => {
  if (!colorString) return null;

  // 匹配 rgb(r, g, b) 或 rgba(r, g, b, a) 格式
  const rgbMatch = colorString.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+)?\s*\)/,
  );

  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return {
      r: parseInt(r, 10),
      g: parseInt(g, 10),
      b: parseInt(b, 10),
    };
  }

  // 如果是十六进制颜色，转换为 RGB
  const hexMatch = colorString.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((char) => char + char)
        .join('');
    }
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16),
    };
  }

  return null;
};

// RGB 颜色提取函数
export const extractRgbColor = (colorString: string): string => {
  if (!colorString) return '';

  // 使用内部工具函数解析颜色
  const rgbValues = parseColorToRgb(colorString);
  if (rgbValues) {
    return `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`;
  }

  // 如果已经是 rgb 格式，直接返回
  if (colorString.startsWith('rgb(')) {
    return colorString;
  }

  // 如果是命名颜色或其他格式，返回原值
  return colorString;
};

// 提取RGB数值函数（返回逗号分隔的RGB值，不包含alpha通道）
export const extractRGBValues = (colorString: string): string => {
  if (!colorString) return '';

  // 使用内部工具函数解析颜色
  const rgbValues = parseColorToRgb(colorString);
  if (rgbValues) {
    return `${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}`;
  }

  // 如果是命名颜色或其他格式，返回空字符串
  return '';
};
