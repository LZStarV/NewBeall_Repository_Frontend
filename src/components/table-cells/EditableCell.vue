<template>
  <div v-if="data !== undefined" class="editable-cell" :class="[`align-${column.align || 'center'}`]">
    <!-- 文本输入框 -->
    <lay-input v-if="isEditing && inputType === 'text'" ref="inputRef" v-model="editValue" size="sm"
      :style="{ textAlign: column.align || 'center' }" @blur="handleSave" @keyup.enter="handleSave"
      @keyup.esc="handleCancel" />

    <!-- 数字输入框 -->
    <lay-input-number v-else-if="isEditing && inputType === 'number'" v-model="editValue as unknown as number"
      ref="inputRef" position="right" type="number" size="xs" :style="{ textAlign: column.align || 'center' }"
      :min="column.min" :max="column.max" :step="column.step" @blur="handleSave" @keyup.enter="handleSave"
      @keyup.esc="handleCancel" />

    <!-- 选择器 -->
    <lay-select v-else-if="isEditing && inputType === 'select'" ref="inputRef" v-model="editValue" size="xs"
      @change="handleSave" @blur="handleCancel">
      <lay-select-option v-for="option in column.options" :key="option.value" :value="option.value"
        :label="option.label" />
    </lay-select>

    <div v-else-if="isSubProjectRow"></div>

    <!-- 显示模式 -->
    <div v-else class="cell-display" :class="[`align-${column.align || 'center'}`]" @click="handleEdit">
      <span>{{ getDisplayText() }}</span>
      <SvgIcon :name="editIconName" class="edit-icon" width="12" height="12" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, watch } from 'vue';
import SvgIcon from '../SvgIcon.vue';

interface Props {
  data: Record<string, unknown>;
  index: number;
  column: {
    key: string;
    align?: 'left' | 'center' | 'right';
    inputType?: 'text' | 'number' | 'select';
    options?: Array<{ value: string | number; label: string }>;
    min?: number;
    max?: number;
    step?: number;
    rows?: number;
  };
  placeholder?: string;
  validator?: (value: string | number) => boolean | string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '点击编辑',
});

const emit = defineEmits<{
  'update:value': [value: string | number];
}>();

const isEditing = ref(false);
const editValue = ref<string>('');
const inputRef = ref();

// 计算输入类型，默认为文本
const inputType = computed(() => props.column.inputType || 'text');

const displayValue = computed(() => {
  const value = props.column.key
    .split('.')
    .reduce((obj: unknown, k: string) => {
      return obj && typeof obj === 'object' && k in obj
        ? (obj as Record<string, unknown>)[k]
        : undefined;
    }, props.data);
  return String(value ?? '');
});

const handleEdit = () => {
  isEditing.value = true;
  editValue.value = displayValue.value;

  nextTick(() => {
    inputRef.value?.focus();
  });
};

const handleSave = () => {
  if (props.validator) {
    const result = props.validator(editValue.value);
    if (result !== true) {
      // 这里可以显示错误提示
      console.warn(typeof result === 'string' ? result : '输入值无效');
      return;
    }
  }

  emit('update:value', editValue.value);
  isEditing.value = false;
};

const handleCancel = () => {
  editValue.value = displayValue.value;
  isEditing.value = false;
};

// 获取显示文本
const getDisplayText = () => {
  if (inputType.value === 'select' && props.column.options) {
    const option = props.column.options.find(
      (opt) => opt.value == displayValue.value,
    );
    return option ? option.label : displayValue.value;
  }
  return displayValue.value || props.placeholder;
};

// 监听数据变化，更新显示值
watch(
  () => displayValue.value,
  (newValue) => {
    if (!isEditing.value) {
      editValue.value = newValue;
    }
  },
);

const editIconName = computed(() => {
  return inputType.value === 'select' ? 'expand' : 'pen';
});

// 判断是否为子项目行
const isSubProjectRow = computed(() => {
  return props.data.isSubProject === true;
});
</script>

<style scoped lang="scss">
@use 'sass:color';

.editable-cell {
  width: 100%;
  display: flex;
  align-items: center;

  // 整体对齐方式
  &.align-left {
    justify-content: flex-start;
  }

  &.align-center {
    justify-content: center;
  }

  &.align-right {
    justify-content: flex-end;
  }

  .cell-display {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: $spacing-small;
    border-radius: $border-radius-base;
    transition: all 0.3s ease;
    min-height: 32px;
    width: 100%;
    position: relative;

    // 对齐方式
    &.align-left {
      justify-content: flex-start;
      text-align: left;

      span {
        margin-right: auto;
      }
    }

    &.align-center {
      justify-content: center;
      text-align: center;

      span {
        flex: 1;
        text-align: center;
      }
    }

    &.align-right {
      justify-content: flex-end;
      text-align: right;

      span {
        margin-left: auto;
      }
    }

    &:hover {
      background: color.adjust($border-color-extra-light, $lightness: -5%);

      .edit-icon {
        opacity: 1;
      }
    }

    .edit-icon {
      position: absolute;
      right: 2px;
      opacity: 0;
      font-size: 12px;
      color: $text-secondary;
      transition: opacity 0.3s ease;
      flex-shrink: 0;
      margin-left: 4px;
    }
  }

  // 编辑模式下的输入框
  :deep(.layui-input) {
    width: 100%;
  }

  :deep(.layui-input-number) {
    width: 100%;

    .layui-input-number-input {
      text-align: inherit;
    }
  }

  :deep(.layui-select) {
    width: 100%;
  }
}
</style>
