<template>
  <div class="advanced-table">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="table-toolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left"></slot>
      </div>
      <div class="toolbar-right">
        <!-- 列显示设置 -->
        <lay-dropdown>
          <lay-button size="sm">
            <lay-icon type="layui-icon-cols" />
            列设置
          </lay-button>
          <template #content>
            <lay-dropdown-menu>
              <div class="column-settings">
                <div v-for="col in localColumns" :key="col.key" class="column-setting-item">
                  <lay-checkbox v-model="col.visible" :disabled="col.required" value="visible" skin="primary">
                    {{ col.title }}
                  </lay-checkbox>
                </div>
              </div>
            </lay-dropdown-menu>
          </template>
        </lay-dropdown>
        <slot name="toolbar-right"></slot>
      </div>
    </div>

    <!-- 表格容器 -->
    <div class="table-container" :class="{ 'responsive-': responsive }">
      <!-- 表头 -->
      <div class="table-header">
        <div class="header-row">
          <div
v-for="col in visibleColumns" :key="col.key" class="header-cell" :style="{
            width: col.width
              ? typeof col.width === 'number'
                ? `${col.width}px`
                : col.width
              : 'auto',
          }">
            <div class="table-header-cell">
              <span class="header-title">{{ col.title }}</span>

              <!-- 排序按钮 -->
              <div v-if="col.sortable" class="sort-controls">
                <div
class="sort-btn" :class="{
                  active:
                    sortState.key === col.key && sortState.order === 'asc',
                }" @click="handleSort(col.key, 'asc')">
                  <SvgIcon name="expand_light_reverse" width="10" height="10" />
                </div>
                <div
class="sort-btn" :class="{
                  active:
                    sortState.key === col.key && sortState.order === 'desc',
                }" @click="handleSort(col.key, 'desc')">
                  <SvgIcon name="expand_light" width="10" height="10" />
                </div>
              </div>

              <!-- 筛选按钮 -->
              <div v-if="col.filterable" class="filter-dropdown">
                <lay-dropdown>
                  <div class="filter-btn" :class="{ active: hasFilter(col.key) }">
                    <SvgIcon name="expand" width="10" height="10" />
                  </div>
                  <template #content>
                    <div class="filter-content">
                      <AdvancedSelector
v-model="filterState[col.key]" :placeholder="`筛选 ${col.title}`"
                        :options="getFilterOptions(col.key)" :clearable="true" :page-size="8"
                        @update:model-value="handleFilter" />
                    </div>
                  </template>
                </lay-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <draggable
v-if="enableDrag" v-model="localData" :item-key="props.rowKey" tag="div" class="draggable-container"
          :animation="200" :ghost-class="'drag-ghost'" :chosen-class="'drag-chosen'" :drag-class="'drag-moving'"
          @end="handleDragEnd">
          <template #item="{ element, index }">
            <div
class="table-row" :class="{
              selected: isRowSelected(element),
              clickable: clickable || rowSelection,
              'sub-project-row': element.isSubProject,
            }" :style="{
                '--sub-project-color': element.backgroundColor || '',
              }" @click="handleRowClick(element, index)">
              <div
v-for="col in visibleColumns" :key="col.key" class="table-cell"
                :class="[`align-${col.align || 'center'}`]" :style="{
                  width: col.width
                    ? typeof col.width === 'number'
                      ? `${col.width}px`
                      : col.width
                    : 'auto',
                }">
                <!-- 自定义渲染器 -->
                <component
:is="col.customRender" v-if="col.customRender" :data="element" :index="index" :column="col"
                  @update:value="handleCellUpdate(index, col.key, $event)" @button-click="handleButtonClick" />

                <!-- 名称列的特殊处理：子项目行显示删除按钮 -->
                <template
v-else-if="
                  col.key === 'name' && element.isSubProject && element.name
                ">
                  <div class="sub-project-name">
                    <span class="sub-project-title">{{
                      getColumnValue(element, col.key)
                    }}</span>
                    <SvgIcon
name="garbage" class="delete-sub-project-btn"
                      title="删除子项目" width="14" height="14" @click.stop="handleDeleteSubProject(element, index)" />
                  </div>
                </template>

                <!-- 默认文本渲染 -->
                <span v-else>{{ getColumnValue(element, col.key) }}</span>
              </div>
            </div>
          </template>
        </draggable>

        <!-- 非拖拽模式 -->
        <div v-else class="static-container">
          <div
v-for="(row, index) in sortedData" :key="index" class="table-row" :class="{
            selected: isRowSelected(row),
            clickable: clickable || rowSelection,
            'sub-project-row': row.isSubProject,
          }" :style="{
              '--sub-project-color': row.backgroundColor || '',
            }" @click="handleRowClick(row, index)">
            <div
v-for="col in visibleColumns" :key="col.key" class="table-cell"
              :class="[`align-${col.align || 'center'}`]" :style="{
                width: col.width
                  ? typeof col.width === 'number'
                    ? `${col.width}px`
                    : col.width
                  : 'auto',
              }">
              <!-- 自定义渲染器 -->
              <component
:is="col.customRender" v-if="col.customRender" :data="row" :index="index" :column="col"
                @update:value="handleCellUpdate(index, col.key, $event)" @button-click="handleButtonClick" />

              <!-- 名称列的特殊处理：子项目行显示删除按钮 -->
              <template v-else-if="col.key === 'name' && row.isSubProject && row.name">
                <div class="sub-project-name">
                  <span class="sub-project-title">{{
                    getColumnValue(row, col.key)
                  }}</span>
                  <SvgIcon
name="garbage" class="delete-sub-project-btn"
                    title="删除子项目" width="14" height="14" @click.stop="handleDeleteSubProject(row, index)" />
                </div>
              </template>

              <!-- 默认文本渲染 -->
              <span v-else>{{ getColumnValue(row, col.key) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="pagination" class="table-pagination">
      <lay-page
v-model="currentPage" :total="filteredData.length" :limit="pageSize" :show-count="true"
        :show-limit="true" :show-page="true" :show-skip="true" @change="handlePageChange"
        @limit="handlePageSizeChange" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  ref,
  reactive,
  watch,
  type Component,
  type ComponentOptions,
} from 'vue';
import draggable from 'vuedraggable';
import AdvancedSelector from './AdvancedSelector.vue';
import SvgIcon from './SvgIcon.vue';

// 类型定义
export interface TableColumn {
  key: string;
  title: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  visible?: boolean;
  required?: boolean;
  customRender?: ComponentOptions<unknown> | Component | null;
}

export interface RowSelection {
  type?: 'checkbox' | 'radio';
  selectedRowKeys?: (string | number)[];
  onChange?: (
    selectedRowKeys: (string | number)[],
    selectedRows: Record<string, unknown>[],
  ) => void;
}

export interface TableProps {
  columns?: TableColumn[];
  dataSource?: Record<string, unknown>[];
  rowSelection?: RowSelection;
  enableDrag?: boolean;
  pagination?: boolean;
  pageSize?: number;
  showToolbar?: boolean;
  scroll?: { x?: number | string; y?: number | string };
  rowKey?: string;
  clickable?: boolean; // 是否启用行点击事件
  responsive?: boolean; // 是否启用响应式布局
}

// Props
const props = withDefaults(defineProps<TableProps>(), {
  columns: () => [],
  dataSource: () => [],
  rowSelection: undefined,
  enableDrag: false,
  pagination: true,
  pageSize: 10,
  showToolbar: true,
  scroll: () => ({ x: 'auto' }),
  rowKey: 'id',
  clickable: false,
  responsive: true,
});

// Emits
const emit = defineEmits<{
  'update:dataSource': [data: Record<string, unknown>[]];
  'row-drag': [oldIndex: number, newIndex: number];
  'cell-update': [rowIndex: number, columnKey: string, value: unknown];
  'row-select': [
    selectedRowKeys: (string | number)[],
    selectedRows: Record<string, unknown>[],
  ];
  'button-click': [
    action: string,
    data: Record<string, unknown>,
    index: number,
  ];
  'row-click': [data: Record<string, unknown>, index: number];
}>();

// 响应式数据
const currentPage = ref(1);
const selectedRowKeys = ref<(string | number)[]>([]);
const sortState = reactive({
  key: '',
  order: '' as 'asc' | 'desc' | '',
});
const filterState = reactive<Record<string, string | number>>({});

// 本地列配置，用于控制列的显示/隐藏
const localColumns = ref<TableColumn[]>([]);

// 本地数据，用于拖拽
const localData = computed({
  get: () => (props.enableDrag ? sortedData.value : []),
  set: () => {
    // 拖拽时直接更新显示的数据，实际的数据源更新由 handleDragEnd 处理
    // 这里不做任何操作，避免重复更新
  },
});

// 计算属性
const visibleColumns = computed(() => {
  let cols = localColumns.value.filter((col) => col.visible !== false);
  return cols;
});

const filteredData = computed(() => {
  let data = [...(props.dataSource || [])];

  // 应用筛选
  Object.keys(filterState).forEach((key) => {
    const filterValue = filterState[key];
    if (
      filterValue !== '' &&
      filterValue !== null &&
      filterValue !== undefined
    ) {
      data = data.filter((row) => {
        const cellValue = getColumnValue(row, key);
        // 精确匹配值（而不是字符串包含）
        return String(cellValue) === String(filterValue);
      });
    }
  });

  return data;
});

const sortedData = computed(() => {
  let data = [...filteredData.value];

  // 应用排序
  if (sortState.key && sortState.order) {
    data.sort((a, b) => {
      const aValue = getColumnValue(a, sortState.key);
      const bValue = getColumnValue(b, sortState.key);

      let comparison = 0;
      if (aValue != null && bValue != null) {
        if (aValue > bValue) comparison = 1;
        if (aValue < bValue) comparison = -1;
      }

      return sortState.order === 'asc' ? comparison : -comparison;
    });
  }

  // 应用分页
  if (props.pagination) {
    const start = (currentPage.value - 1) * props.pageSize;
    const end = start + props.pageSize;
    return data.slice(start, end);
  }

  return data;
});

// 方法
const getColumnValue = (row: Record<string, unknown>, key: string): unknown => {
  return key.split('.').reduce((obj: unknown, k: string) => {
    return obj && typeof obj === 'object' && k in obj
      ? (obj as Record<string, unknown>)[k]
      : undefined;
  }, row);
};

// 获取筛选选项
const getFilterOptions = (columnKey: string) => {
  const allValues = (props.dataSource || [])
    .map((row) => getColumnValue(row, columnKey))
    .filter((value) => value !== null && value !== undefined && value !== '');

  // 获取唯一值
  const uniqueValues = [...new Set(allValues)];

  // 转换为AdvancedSelector需要的格式
  const options = uniqueValues.map((value) => ({
    value: value as string | number,
    label: String(value),
  }));

  // 添加"全选"选项到开头
  return [
    { value: '', label: '全部' },
    ...options.sort((a, b) => a.label.localeCompare(b.label)),
  ];
};

const getRowKey = (row: Record<string, unknown>): string | number => {
  const key = getColumnValue(row, props.rowKey);
  return typeof key === 'string' || typeof key === 'number' ? key : String(key);
};

const isRowSelected = (row: Record<string, unknown>): boolean => {
  const key = getRowKey(row);
  return selectedRowKeys.value.includes(key);
};

const handleRowClick = (row: Record<string, unknown>, index?: number) => {
  // 如果启用了行点击事件，发出事件
  if (props.clickable && index !== undefined) {
    let actualIndex = index;
    if (props.pagination) {
      actualIndex = (currentPage.value - 1) * props.pageSize + index;
    }
    emit('row-click', row, actualIndex);
  }

  // 如果没有行选择功能，直接返回
  if (!props.rowSelection) return;

  const key = getRowKey(row);
  const selectedIndex = selectedRowKeys.value.indexOf(key);

  if (props.rowSelection.type === 'radio') {
    selectedRowKeys.value = selectedIndex > -1 ? [] : [key];
  } else {
    if (selectedIndex > -1) {
      selectedRowKeys.value.splice(selectedIndex, 1);
    } else {
      selectedRowKeys.value.push(key);
    }
  }

  const selectedRows = (props.dataSource || []).filter((item) =>
    selectedRowKeys.value.includes(getRowKey(item)),
  );

  emit('row-select', [...selectedRowKeys.value], selectedRows);
  props.rowSelection?.onChange?.(selectedRowKeys.value, selectedRows);
};

const handleSort = (key: string, order: 'asc' | 'desc') => {
  if (sortState.key === key && sortState.order === order) {
    // 如果是同一列同一方向，取消排序
    sortState.key = '';
    sortState.order = '';
  } else {
    sortState.key = key;
    sortState.order = order;
  }
};

const handleFilter = () => {
  currentPage.value = 1; // 筛选时重置到第一页
};

const hasFilter = (key: string) => {
  return (
    filterState[key] !== '' &&
    filterState[key] !== null &&
    filterState[key] !== undefined
  );
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handlePageSizeChange = () => {
  currentPage.value = 1;
  // 这里可以触发父组件更新 pageSize
  // 目前不使用 size 参数，因为 pageSize 是通过 props 传入的
};

const handleCellUpdate = (
  rowIndex: number,
  columnKey: string,
  value: unknown,
) => {
  let actualIndex = rowIndex;

  if (props.pagination) {
    actualIndex = (currentPage.value - 1) * props.pageSize + rowIndex;
  }

  const newData = [...(props.dataSource || [])];

  // 使用路径设置嵌套属性
  const keys = columnKey.split('.');
  let target: Record<string, unknown> = newData[actualIndex] as Record<
    string,
    unknown
  >;
  for (let i = 0; i < keys.length - 1; i++) {
    const nextTarget = target[keys[i]];
    if (nextTarget && typeof nextTarget === 'object') {
      target = nextTarget as Record<string, unknown>;
    }
  }
  target[keys[keys.length - 1]] = value;

  emit('update:dataSource', newData);
  emit('cell-update', actualIndex, columnKey, value);
};

const handleButtonClick = (
  action: string,
  data: Record<string, unknown>,
  index: number,
) => {
  // 计算实际索引（考虑分页）
  let actualIndex = index;
  if (props.pagination) {
    actualIndex = (currentPage.value - 1) * props.pageSize + index;
  }

  console.log('表格按钮点击:', { action, data, actualIndex });
  emit('button-click', action, data, actualIndex);
};

// 处理子项目删除
const handleDeleteSubProject = (
  data: Record<string, unknown>,
  index: number,
) => {
  // 计算实际索引（考虑分页）
  let actualIndex = index;
  if (props.pagination) {
    actualIndex = (currentPage.value - 1) * props.pageSize + index;
  }

  console.log('删除子项目:', { data, actualIndex });
  emit('button-click', 'delete-sub-project', data, actualIndex);
};

const handleDragEnd = (event: { oldIndex: number; newIndex: number }) => {
  const { oldIndex, newIndex } = event;

  if (oldIndex === newIndex) return;

  // 获取当前显示的数据
  const currentData = sortedData.value;
  const draggedItem = currentData[oldIndex];
  const targetItem = currentData[newIndex];

  if (!draggedItem || !targetItem) return;

  // 在原始数据源中找到对应的索引
  const draggedItemKey = getRowKey(draggedItem);
  const targetItemKey = getRowKey(targetItem);

  const originalDraggedIndex = (props.dataSource || []).findIndex(
    (item) => getRowKey(item) === draggedItemKey,
  );
  const originalTargetIndex = (props.dataSource || []).findIndex(
    (item) => getRowKey(item) === targetItemKey,
  );

  if (originalDraggedIndex === -1 || originalTargetIndex === -1) return;

  // 创建新的数据源副本
  const newDataSource = [...(props.dataSource || [])];

  // 移除拖拽的项目
  const [draggedOriginalItem] = newDataSource.splice(originalDraggedIndex, 1);

  // 在新位置插入
  newDataSource.splice(originalTargetIndex, 0, draggedOriginalItem);

  // 更新数据源
  emit('update:dataSource', newDataSource);
  emit('row-drag', originalDraggedIndex, originalTargetIndex);
};

// 监听数据源变化，初始化筛选状态和本地列配置
watch(
  () => props.columns,
  (newColumns) => {
    // 初始化本地列配置（深拷贝以避免修改原始props）
    localColumns.value = newColumns.map((col) => ({
      ...col,
      visible: col.visible !== false, // 默认为true，除非明确设置为false
    }));

    // 初始化筛选状态
    newColumns.forEach((col) => {
      if (col.filterable && !(col.key in filterState)) {
        filterState[col.key] = '';
      }
    });
  },
  { immediate: true },
);

// 监听 rowSelection 变化
watch(
  () => props.rowSelection?.selectedRowKeys,
  (newKeys) => {
    if (newKeys) {
      selectedRowKeys.value = [...newKeys];
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
@use '@/styles/table/tables' as *;
@use 'sass:color';

:deep(.column-settings) {
  min-width: 150px;
  display: flex;
  flex-direction: column;

  .column-setting-item {
    display: flex;
    align-items: center;
    height: 30px;
  }
}

.advanced-table {
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-base;
    background: $card-background-color;
    border: none;
    border-radius: $border-radius-base $border-radius-base 0 0;

    .toolbar-left,
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: $spacing-base;
    }
  }

  .table-container {
    border: none;
    border-radius: $border-radius-base;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    // 响应式布局
    &.responsive-table {
      @media (max-width: 1280px) {
        overflow-x: auto;

        .table-header .header-row,
        .table-body .table-row {
          min-width: 1280px; // 设置最小宽度，确保表格不会过度压缩
        }

        // 自定义滚动条样式
        &::-webkit-scrollbar {
          height: 8px;
        }

        &::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        &::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;

          &:hover {
            background: #a8a8a8;
          }
        }
      }
    }

    .table-header {
      border: none;

      .header-row {
        display: flex;
        min-height: 48px;

        .header-cell {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 $spacing-base;
          background: $table-header-bg;
          border: none;

          &:not(:last-child) {
            position: relative;

            &::after {
              content: '';
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 1px;
              height: 20px;
              background: rgba($border-color-light, 0.5);
            }
          }
        }
      }
    }

    .table-body {

      .draggable-container,
      .static-container {
        .table-row {
          display: flex;
          min-height: 48px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;

          border-radius: $table-row-border-radius;

          // 斑马线样式
          &:nth-child(even) {
            background: $light-blue-background-color;
          }

          &:nth-child(odd) {
            background: white;
          }

          &:hover {
            background: rgba($primary-color, 0.08) !important;
            box-shadow: 0 2px 8px rgba($primary-color, 0.15);
          }

          &.selected {
            background: rgba($primary-color, 0.15) !important;
            box-shadow: 2px 2px 8px rgba($primary-color, 0.2);
          }

          &.clickable {
            cursor: pointer;

            &:hover {
              background: rgba($primary-color, 0.05) !important;
            }
          }

          // 子项目行样式
          &.sub-project-row {
            border-left: 4px solid var(--sub-project-color, #{$primary-color});
            background-color: var(--sub-project-color,
              #{color.adjust($primary-color, $lightness: 40%)});

            &:hover {
              background: rgba(64, 158, 255, 0.15) !important;
              box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
            }

            .sub-project-name {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;

              .sub-project-title {
                font-weight: 500;
                color: #333;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .delete-sub-project-btn {
                cursor: pointer;
                color: #ff4757;
                margin-left: 8px;
                padding: 2px;
                border-radius: 2px;
                transition: all 0.3s ease;
                flex-shrink: 0;

                &:hover {
                  color: #ff3742;
                  background-color: rgba(255, 71, 87, 0.1);
                  transform: scale(1.1);
                }
              }
            }
          }
        }
      }

      // 拖拽相关样式
      .draggable-container {
        .table-row {
          position: relative;

          &.drag-chosen {
            background: rgba($primary-color, 0.2) !important;
            box-shadow: 0 4px 16px rgba($primary-color, 0.4);
            z-index: 999;
          }

          &.drag-ghost {
            opacity: 0.5;
            background: rgba($primary-color, 0.1) !important;
            border: 2px dashed $primary-color;
          }

          &.drag-moving {
            background: rgba($primary-color, 0.25) !important;
            transform: rotate(2deg);
            box-shadow: 0 8px 24px rgba($primary-color, 0.4);
          }
        }
      }
    }
  }

  .table-cell {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 $spacing-base;
    border: none;
    min-height: 48px;
    overflow: hidden;

    // 内容省略处理
    >* {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }

    // 确保文本不会破坏布局
    span,
    div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }

    &.align-left {
      justify-content: flex-start;
      text-align: left;
    }

    &.align-center {
      justify-content: center;
      text-align: center;
    }

    &.align-right {
      justify-content: flex-end;
      text-align: right;
    }
  }

  .table-header-cell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    overflow: hidden;

    .header-title {
      flex: 1;
      font-weight: 600;
      color: $text-primary;
      font-size: $font-size-base;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }

    .sort-controls {
      display: flex;
      flex-direction: column;
      margin-left: $spacing-small;
      flex-shrink: 0;

      .sort-btn {
        cursor: pointer;
        color: $text-secondary;
        font-size: 10px;
        line-height: 1;
        padding: 2px;
        border-radius: $border-radius-small;
        transition: all 0.3s ease;

        &:hover,
        &.active {
          color: $primary-color;
        }
      }
    }

    .filter-dropdown {
      margin-left: $spacing-small;
      flex-shrink: 0;

      .filter-btn {
        cursor: pointer;
        color: $text-secondary;
        padding: 4px;
        border-radius: $border-radius-small;
        transition: all 0.3s ease;

        &:hover,
        &.active {
          color: $primary-color;
        }
      }
    }

    .filter-content {
      padding: $spacing-base;
      min-width: 250px;

      :deep(.layui-select) {
        width: 100%;
      }

      :deep(.layui-select-option) {
        padding: 6px 12px;
        font-size: 12px;
      }

      :deep(.advanced-selector-options) {
        max-height: 160px;
      }

      :deep(.advanced-selector-header) {
        padding: 6px 8px;

        .search-input {
          font-size: 12px;
        }
      }

      :deep(.advanced-selector-footer) {
        padding: 6px 8px;
      }
    }
  }

  .table-pagination {
    padding: $spacing-base;
    background: $card-background-color;
    border: none;
    border-radius: 0 0 $border-radius-base $border-radius-base;
  }
}

// 自定义单元格组件的省略处理
:deep(.text-cell),
:deep(.editable-cell .cell-display span),
:deep(.button-cell),
:deep(.status-cell),
:deep(.image-cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

// 确保按钮组件不会破坏布局
:deep(.button-cell) {
  gap: $spacing-small;

  .layui-btn {
    flex-shrink: 0;
    min-width: auto;
    padding: 4px 8px;
    font-size: $font-size-small;
  }
}

// 图片单元格特殊处理
:deep(.image-cell) {
  flex-shrink: 0;
  justify-content: center;
}

// 子项目名称单元格特殊处理
:deep(.sub-project-name) {
  width: 100%;

  .sub-project-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
