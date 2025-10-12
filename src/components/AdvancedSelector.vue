<template>
  <lay-select
    :model-value="modelValue"
    :placeholder="placeholder"
    :disabled="loading"
    :auto-fit-width="false"
    @update:model-value="handleValueChange"
    allow-clear
  >
    <template #header>
      <div class="advanced-selector-header">
        <div class="search-row">
          <lay-input
            v-model="state.searchKeyword"
            placeholder="搜索..."
            size="sm"
            class="search-input"
          />
          <lay-button
            v-if="modelValue && clearable"
            size="sm"
            type="primary"
            class="clear-btn"
            @click="handleClear"
          >
            清空选择
          </lay-button>
        </div>
      </div>
    </template>

    <div class="advanced-selector-options">
      <lay-select-option
        v-for="option in state.filteredOptions"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
        :label="getOptionLabel(option)"
      />
    </div>

    <template #footer>
      <div v-if="state.totalPages > 1" class="advanced-selector-footer">
        <lay-button
          size="xs"
          :disabled="state.currentPage <= 1"
          @click="handlePageChange(state.currentPage - 1)"
        >
          上一页
        </lay-button>
        <span class="page-info">
          {{ state.currentPage }}/{{ state.totalPages }}
        </span>
        <lay-button
          size="xs"
          :disabled="state.currentPage >= state.totalPages"
          @click="handlePageChange(state.currentPage + 1)"
        >
          下一页
        </lay-button>
      </div>
    </template>
  </lay-select>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface SelectorOption {
  [key: string]: string | number | boolean | null | undefined;
}

interface SelectorState {
  filteredOptions: SelectorOption[];
  currentPage: number;
  searchKeyword: string;
  totalPages: number;
}

interface Props {
  modelValue?: number | string;
  placeholder?: string;
  options?: SelectorOption[];
  loading?: boolean;
  clearable?: boolean;
  pageSize?: number;
  valueKey?: string;
  labelKey?: string;
}

interface Emits {
  (e: 'update:modelValue', value: number | string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请选择',
  options: () => [],
  loading: false,
  clearable: true,
  pageSize: 10,
  valueKey: 'value',
  labelKey: 'label',
});

const emit = defineEmits<Emits>();

// 组件状态
const state = ref<SelectorState>({
  filteredOptions: [],
  currentPage: 1,
  searchKeyword: '',
  totalPages: 0,
});

// 获取选项的值
const getOptionValue = (option: SelectorOption): number | string => {
  const value = option[props.valueKey];
  return (value as number | string) ?? '';
};

// 获取选项的标签
const getOptionLabel = (option: SelectorOption): string => {
  const label = option[props.labelKey] || option[props.valueKey];
  return String(label ?? '');
};

// 过滤选项数据
const filteredData = computed(() => {
  let filtered = props.options;

  // 搜索过滤
  if (state.value.searchKeyword.trim()) {
    filtered = props.options.filter((option) => {
      const label = getOptionLabel(option);
      return String(label)
        .toLowerCase()
        .includes(state.value.searchKeyword.toLowerCase());
    });
  }

  return filtered;
});

// 过滤和分页处理
const filterOptions = () => {
  const filtered = filteredData.value;

  // 计算总页数
  state.value.totalPages = Math.ceil(filtered.length / props.pageSize);

  // 确保当前页面在有效范围内
  if (
    state.value.currentPage > state.value.totalPages &&
    state.value.totalPages > 0
  ) {
    state.value.currentPage = state.value.totalPages;
  }

  // 分页处理
  const startIndex = (state.value.currentPage - 1) * props.pageSize;
  const endIndex = startIndex + props.pageSize;
  let pageOptions = filtered.slice(startIndex, endIndex);

  // 确保当前选中的选项始终在选项列表中（解决切页后选中内容消失的问题）
  if (props.modelValue) {
    const selectedOption = props.options.find(
      (option) => getOptionValue(option) === props.modelValue,
    );

    if (selectedOption) {
      const isSelectedInCurrentPage = pageOptions.some(
        (option) => getOptionValue(option) === props.modelValue,
      );

      // 如果选中的选项不在当前页面，将其添加到列表开头
      if (!isSelectedInCurrentPage) {
        pageOptions = [selectedOption, ...pageOptions];
      }
    }
  }

  state.value.filteredOptions = pageOptions;
};

// 搜索处理
const handleSearch = () => {
  state.value.currentPage = 1; // 重置到第一页
  filterOptions();
};

// 翻页处理
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= state.value.totalPages) {
    state.value.currentPage = page;
    filterOptions();
  }
};

// 值变化处理
const handleValueChange = (value: number | string | object) => {
  emit('update:modelValue', value as number | string);
};

// 清空选择
const handleClear = () => {
  emit('update:modelValue', '');
};

// 监听选项数据变化
watch(
  () => props.options,
  () => {
    state.value.currentPage = 1;
    filterOptions();
  },
  { immediate: true, deep: true },
);

// 监听搜索关键词变化
watch(
  () => state.value.searchKeyword,
  () => {
    handleSearch();
  },
);
</script>

<style scoped lang="scss">
.advanced-selector-header {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;

  .search-row {
    display: flex;
    align-items: center;
    gap: 8px;

    .search-input {
      flex: 1;
    }
  }
}

.advanced-selector-options {
  max-height: 200px;
  overflow-y: auto;
  padding: 2px 0;
}

.advanced-selector-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid #f0f0f0;

  .page-info {
    font-size: 12px;
    color: #666;
    padding: 0 8px;
  }

  :deep(.layui-btn) {
    min-width: 50px;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    padding: 0 8px;
  }
}
</style>
