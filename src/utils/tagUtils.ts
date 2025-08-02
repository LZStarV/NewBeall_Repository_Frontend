/**
 * 标签相关工具函数
 */

import type { TagType } from '@/types/tag';

/**
 * 解析标签样式，提取颜色信息
 * @param styleString 样式字符串，支持CSS变量格式和直接CSS格式
 * @returns 解析后的样式对象
 */
export const parseTagStyle = (styleString: string): Record<string, string> => {
  const styles: Record<string, string> = {};
  if (!styleString) return styles;

  // 解析 CSS 变量格式的样式
  // 例如: "--color:#409eff;--background-color: #ebf5ff"
  const cssVarMatches = styleString.match(/--[\w-]+\s*:\s*[^;]+/g);
  if (cssVarMatches) {
    cssVarMatches.forEach((match) => {
      const [property, value] = match.split(':').map((s) => s.trim());
      if (property === '--color') {
        styles.color = value;
      } else if (property === '--background-color') {
        styles.backgroundColor = value;
      }
    });
  }

  // 如果没有找到 CSS 变量，尝试直接解析样式
  // 例如: "color:#409eff;background-color: #ebf5ff"
  const directMatches = styleString.match(
    /color\s*:\s*[^;]+|background-color\s*:\s*[^;]+/gi,
  );
  if (directMatches) {
    directMatches.forEach((match) => {
      const [property, value] = match.split(':').map((s) => s.trim());
      styles[
        property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      ] = value;
    });
  }

  return styles;
};

/**
 * 获取标签的样式对象，用于主页面标签选择器
 * @param tag 标签对象
 * @returns 包含颜色、背景色、边框色的样式对象
 */
export const getTagStyle = (tag: TagType): Record<string, string> => {
  if (!tag || !tag.style) {
    return {
      color: '#333',
      backgroundColor: '#f5f5f5',
      borderColor: '#d9d9d9',
    };
  }

  const parsedStyles = parseTagStyle(tag.style);
  return {
    color: parsedStyles.color || '#333',
    backgroundColor: parsedStyles.backgroundColor || '#f5f5f5',
    borderColor: parsedStyles.color || '#d9d9d9',
  };
};

/**
 * 获取标签的样式对象，用于卡片组件中的标签
 * @param tag 标签对象（可能来自不同的数据结构）
 * @returns 包含颜色、背景色、边框色的样式对象，未定义时返回undefined以使用默认样式
 */
export const getTagStyleForCard = (
  tag: TagType,
): Record<string, string | undefined> => {
  if (!tag || !tag.style) {
    return {};
  }

  const parsedStyles = parseTagStyle(tag.style);
  return {
    color: parsedStyles.color || undefined,
    backgroundColor: parsedStyles.backgroundColor || undefined,
  };
};

/**
 * 获取标签选项的样式（带透明度），用于编辑表单
 * @param tag 标签对象
 * @returns 包含颜色、背景色、边框色和悬停背景色的样式对象
 */
export const getTagOptionStyle = (tag: TagType): Record<string, string> => {
  if (!tag.style) {
    return {
      color: '#333',
      backgroundColor: '#f9f9f9',
    };
  }

  const parsedStyles = parseTagStyle(tag.style);
  const baseColor = parsedStyles.color || '#333';
  const baseBackground = parsedStyles.backgroundColor || '#f9f9f9';

  return {
    color: baseColor,
    backgroundColor: baseBackground,
    borderColor: baseColor,
    '--hover-bg': baseBackground + '20', // 添加透明度
  };
};

/**
 * 计算颜色的变淡版本（用于背景色）
 * @param color 原始颜色（十六进制格式）
 * @param amount 变淡程度（0-1之间，默认0.8）
 * @returns 变淡后的颜色
 */
export const lightenColor = (color: string, amount: number = 0.8): string => {
  // 移除 # 号
  const hex = color.replace('#', '');

  // 转换为 RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // 计算变淡后的颜色
  const lightR = Math.round(r + (255 - r) * amount);
  const lightG = Math.round(g + (255 - g) * amount);
  const lightB = Math.round(b + (255 - b) * amount);

  // 转换回十六进制
  return `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
};

/**
 * 生成标签样式字符串
 * @param color 文字颜色
 * @param backgroundColor 背景颜色（可选，不传则自动计算）
 * @returns CSS变量格式的样式字符串
 */
export const generateTagStyleString = (
  color: string,
  backgroundColor?: string,
): string => {
  const bgColor = backgroundColor || lightenColor(color);
  return `--color:${color};--background-color:${bgColor}`;
};
