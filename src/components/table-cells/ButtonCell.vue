<template>
  <div class="button-cell">
    <!-- 普通按钮 -->
    <lay-button
      v-for="(button, btnIndex) in buttonList"
      :key="btnIndex"
      :type="getButtonType(button.type)"
      :size="button.size || 'xs'"
      :disabled="button.disabled?.(data, index) || false"
      @click="handleClick(button, data, index)"
    >
      <lay-icon v-if="button.icon" :type="button.icon" />
      {{ button.label || button.text }}
    </lay-button>

    <!-- 自定义按钮 -->
    <button
      v-for="(button, btnIndex) in customButtonList"
      :key="`custom-${btnIndex}`"
      class="custom-button"
      :class="[
        button.customClass,
        button.size ? `size-${button.size}` : 'size-xs',
      ]"
      :style="getCustomButtonStyle(button)"
      :disabled="button.disabled?.(data, index) || false"
      @click="handleClick(button, data, index)"
    >
      <lay-icon v-if="button.icon" :type="button.icon" />
      {{ button.label || button.text }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface ButtonConfig {
  label?: string;
  text?: string;
  type?: 'primary' | 'normal' | 'warm' | 'danger' | 'custom' | 'default';
  size?: 'lg' | 'md' | 'sm' | 'xs';
  icon?: string;
  action?: string;
  disabled?: (data: Record<string, unknown>, index: number) => boolean;
  onClick?: (data: Record<string, unknown>, index: number) => void;
  // 自定义按钮的样式配置
  customStyle?: {
    backgroundColor?: string;
    color?: string;
    borderColor?: string;
    borderRadius?: string;
    padding?: string;
    fontSize?: string;
    fontWeight?: string;
  };
  // 自定义按钮的 CSS 类名
  customClass?: string;
}

interface Props {
  data: Record<string, unknown>;
  index: number;
  column: {
    key: string;
    [key: string]: unknown;
  };
}

const props = defineProps<Props>();

// 定义事件
const emit = defineEmits<{
  'button-click': [
    action: string,
    data: Record<string, unknown>,
    index: number,
  ];
}>();

// 获取所有按钮列表 - 从 data 中的字段获取按钮配置
const allButtonList = computed(() => {
  const columnKey = props.column.key;
  const buttons = props.data[columnKey];

  if (Array.isArray(buttons)) {
    return buttons as ButtonConfig[];
  }

  // 如果不是数组，返回空数组
  return [];
});

// 获取普通按钮列表
const buttonList = computed(() => {
  return allButtonList.value.filter((button) => button.type !== 'custom');
});

// 获取自定义按钮列表
const customButtonList = computed(() => {
  return allButtonList.value.filter((button) => button.type === 'custom');
});

// 处理按钮类型映射，确保类型正确
const getButtonType = (type?: string) => {
  const typeMap = {
    primary: 'primary' as const,
    danger: 'danger' as const,
    normal: 'normal' as const,
    warm: 'warm' as const,
    default: 'default' as const,
  };

  return typeMap[type as keyof typeof typeMap] || 'normal';
};

// 获取自定义按钮样式
const getCustomButtonStyle = (button: ButtonConfig) => {
  const defaultStyle = {
    backgroundColor: 'transparent',
    color: 'var(--global-primary-color)',
    borderColor: 'transparent',
    padding: '0',
    fontSize: '100%',
    fontWeight: 'normal',
  };

  return {
    ...defaultStyle,
    ...button.customStyle,
  };
};

const handleClick = (
  button: ButtonConfig,
  data: Record<string, unknown>,
  rowIndex: number,
) => {
  console.log('按钮点击:', {
    button: { ...button, type: button.type },
    data,
    rowIndex,
  });

  // 如果有自定义的 onClick 函数，优先调用它
  if (button.onClick) {
    button.onClick(data, rowIndex);
    return;
  }

  // 发出按钮点击事件给父组件
  if (button.action) {
    emit('button-click', button.action, data, rowIndex);
  }
};
</script>

<style scoped lang="scss">
.button-cell {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  flex-wrap: wrap;

  justify-content: center;

  .custom-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    text-decoration: none;
    outline: none;
    user-select: none;
    gap: 4px;

    &:hover:not(:disabled) {
      opacity: 0.8;
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    // 自定义按钮的默认尺寸
    &:not([class*='size-']) {
      min-height: 24px;
      padding: 4px 8px;
      font-size: 12px;
    }

    // 不同尺寸的自定义按钮
    &.size-lg {
      min-height: 40px;
      padding: 10px 16px;
      font-size: 16px;
    }

    &.size-md {
      min-height: 32px;
      padding: 6px 12px;
      font-size: 14px;
    }

    &.size-sm {
      min-height: 28px;
      padding: 5px 10px;
      font-size: 13px;
    }

    &.size-xs {
      min-height: 24px;
      padding: 4px 8px;
      font-size: 12px;
    }
  }
}
</style>
