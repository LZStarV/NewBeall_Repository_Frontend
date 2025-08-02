<template>
  <ModalWindow
    :visible="visible"
    title="选择文案输出"
    :btn="btn"
    :sync-height="!isMobileView"
    @close="handleClose"
  >
    <div id="export-instruction-dialog" class="export-instruction-dialog">
      <!-- 三栏布局 -->
      <div class="export-content">
        <!-- 左侧：目录显示 -->
        <div class="catalog-section">
          <div class="section-header">
            <h3>目录</h3>
            <div class="catalog-actions">
              <button
                class="undo-btn"
                title="撤销操作 (Ctrl+Z)"
                :disabled="!canUndo"
                @click="undo"
              >
                <SvgIcon name="undo" width="16" height="16" />
              </button>
              <button title="清空目录" @click="clearCatalog">
                <SvgIcon name="clean" width="16" height="16" />
              </button>
            </div>
          </div>
          <div ref="catalogContainer" class="catalog-list">
            <draggable
              v-model="catalogItems"
              group="catalog"
              :sort="true"
              item-key="id"
              :component-data="{ name: 'fade' }"
              @change="handleCatalogSort"
            >
              <template #item="{ element: item }">
                <div
                  :class="[
                    'catalog-item',
                    `level-${item.level}`,
                    { selected: selectedCatalogId === item.id },
                  ]"
                  @click="selectCatalogItem(item)"
                >
                  <div class="catalog-content">
                    <span class="catalog-number">{{ item.number }}</span>
                    <span class="catalog-title">{{ item.title }}</span>
                  </div>
                  <button
                    class="delete-btn"
                    title="删除"
                    @click.stop="removeCatalogItem(item)"
                  >
                    <SvgIcon name="cancel" width="12" height="12" />
                  </button>
                </div>
              </template>
            </draggable>
            <div v-if="catalogItems.length === 0" class="empty-catalog">
              <p>暂无目录，请从右侧拖入文案</p>
            </div>
          </div>
        </div>

        <!-- 中间：编辑方案 -->
        <div class="edit-section">
          <div class="section-header">
            <h3>编辑方案</h3>
          </div>
          <div class="drop-zones">
            <!-- 一级目录感应区 -->
            <div
              class="drop-zone level-1"
              :class="{
                'drag-over': dragOverLevel === 1,
                enabled: validateLevel(1),
                disabled: !validateLevel(1),
              }"
              @dragover.prevent="handleDragOver(1)"
              @dragleave="handleDragLeave"
              @drop="handleDrop(1, $event)"
            >
              <div class="drop-zone-content">
                <div class="drop-zone-icon">
                  <SvgIcon name="list" width="24" height="24" />
                </div>
                <h4>一级目录</h4>
                <p>拖入文案创建主要章节</p>
                <span class="level-indicator">1</span>
              </div>
            </div>

            <!-- 二级目录感应区 -->
            <div
              class="drop-zone level-2"
              :class="{
                'drag-over': dragOverLevel === 2,
                enabled: validateLevel(2),
                disabled: !validateLevel(2),
              }"
              @dragover.prevent="handleDragOver(2)"
              @dragleave="handleDragLeave"
              @drop="handleDrop(2, $event)"
            >
              <div class="drop-zone-content">
                <div class="drop-zone-icon">
                  <SvgIcon name="list" width="24" height="24" />
                </div>
                <h4>二级目录</h4>
                <p v-if="validateLevel(2)">拖入文案创建子章节</p>
                <p v-else class="disabled-text">需要先添加一级目录</p>
                <span class="level-indicator">1.1</span>
              </div>
            </div>

            <!-- 三级目录感应区 -->
            <div
              class="drop-zone level-3"
              :class="{
                'drag-over': dragOverLevel === 3,
                enabled: validateLevel(3),
                disabled: !validateLevel(3),
              }"
              @dragover.prevent="handleDragOver(3)"
              @dragleave="handleDragLeave"
              @drop="handleDrop(3, $event)"
            >
              <div class="drop-zone-content">
                <div class="drop-zone-icon">
                  <SvgIcon name="list" width="24" height="24" />
                </div>
                <h4>三级目录</h4>
                <p v-if="validateLevel(3)">拖入文案创建详细条目</p>
                <p v-else class="disabled-text">需要先添加一级和二级目录</p>
                <span class="level-indicator">1.1.1</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：文案列表 -->
        <div class="instruction-section">
          <div class="section-header">
            <h3>方案列表</h3>
            <div class="instruction-actions">
              <div class="instruction-count">
                共 {{ instructionList.length }} 条文案
              </div>
              <button
                class="select-all-btn"
                :class="{ active: isAllSelected }"
                :disabled="availableInstructions.length === 0"
                title="全选/取消全选"
                @click="toggleSelectAll"
              >
                <SvgIcon
                  :name="isAllSelected ? 'cancel' : 'correction'"
                  :width="isAllSelected ? '12' : '14'"
                  :height="isAllSelected ? '12' : '14'"
                />
                {{ isAllSelected ? '重置' : '全选' }}
              </button>
            </div>
          </div>

          <!-- 搜索和筛选区域 -->
          <div class="filter-section">
            <div class="filter-row">
              <lay-input
                v-model="searchKeyword"
                placeholder="搜索方案..."
                class="search-input"
                suffix-icon="layui-icon-search"
                allow-clear
              />
              <lay-select
                v-model="selectedTagId"
                placeholder="选择标签筛选"
                class="tag-filter"
                allow-clear
              >
                <lay-select-option value="">全部标签</lay-select-option>
                <lay-select-option
                  v-for="tag in allTags"
                  :key="tag.id"
                  :value="tag.id"
                >
                  {{ tag.content }}
                </lay-select-option>
              </lay-select>
            </div>
            <div class="filter-info">
              <span class="filter-count">
                显示 {{ availableInstructions.length }} 条
                <span v-if="searchKeyword || selectedTagId" class="filtered">
                  (已筛选)
                </span>
              </span>
              <button
                v-if="searchKeyword || selectedTagId"
                class="clear-filter"
                title="清除筛选"
                @click="clearFilters"
              >
                <SvgIcon name="clean" width="12" height="12" />
                清除筛选
              </button>
            </div>
          </div>
          <div class="instruction-list">
            <div
              v-for="instruction in availableInstructions"
              :key="instruction.id"
              class="instruction-item"
              :class="{
                selected: selectedInstructionIds.has(instruction.id),
                dragging:
                  selectedInstructionIds.has(instruction.id) &&
                  hasSelectedInstructions,
              }"
              :draggable="true"
              @click="toggleInstructionSelection(instruction)"
              @dragstart="handleDragStart(instruction, $event)"
              @dragend="handleDragEnd"
            >
              <div class="instruction-content">
                <h5 class="instruction-title">
                  {{ instruction.insTitle }}
                </h5>
                <p class="instruction-summary">
                  {{ getInstructionSummary(instruction.insContent) }}
                </p>
                <div
                  v-if="instruction.tagList?.length"
                  class="instruction-tags"
                >
                  <span
                    v-for="tag in instruction.tagList"
                    :key="tag.id"
                    class="tag"
                  >
                    {{ tag.content }}
                  </span>
                </div>
              </div>
              <div class="drag-handle">
                <SvgIcon name="menu" width="16" height="16" />
              </div>
            </div>
            <div
              v-if="
                availableInstructions.length === 0 && instructionList.length > 0
              "
              class="empty-instructions"
            >
              <p>所有文案都已添加到目录中</p>
              <p class="hint">可以使用撤销功能恢复文案</p>
            </div>
            <div
              v-else-if="instructionList.length === 0"
              class="empty-instructions"
            >
              <p>暂无文案数据</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalWindow>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, computed, onMounted, onUnmounted } from 'vue';
// @ts-expect-error vuedraggable
import draggable from 'vuedraggable';
import ModalWindow from '@/components/ModalWindow.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import type {
  Instruction,
  ExportProductDetailed,
} from '@/api/orders/orderApi.type';
import ordersApi from '@/api/orders/ordersApi';
import env from '@/utils/env';
import notify from '@/utils/notify';
import { layer } from '@layui/layui-vue';

// Props
const props = defineProps<{
  visible: boolean;
  instructionList: Instruction[];
}>();

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'export', catalogData: CatalogItem[]): void;
}>();

// 目录项类型
interface CatalogItem {
  id: string;
  number: string;
  title: string;
  level: number;
  instructionId: string | number;
}

// 操作历史类型
interface HistoryState {
  catalogItems: CatalogItem[];
  levelCounters: { 1: number; 2: number; 3: number };
  usedInstructionIds: Set<string | number>;
  timestamp: number;
  action: string;
}

// 响应式数据
const catalogItems = ref<CatalogItem[]>([]);
const selectedCatalogId = ref<string>('');
const dragOverLevel = ref<number | null>(null);
const catalogContainer = ref<HTMLElement>();
const operationHistory = ref<HistoryState[]>([]);
const currentHistoryIndex = ref(-1);
const usedInstructionIds = ref<Set<string | number>>(new Set());
const selectedInstructionIds = ref<Set<string | number>>(new Set());
const searchKeyword = ref<string>('');
const selectedTagId = ref<string>('');
const exportProjectName = ref<string>('');
const isMobileView = ref(false);

// 底部按钮
const btn = ref([
  {
    text: '确认导出',
    disabled: computed(() => catalogItems.value.length === 0), // 不使用computed就无法响应条件的变化
    callback: () => {
      showExportConfirm();
    },
  },
  {
    text: '取消',
    callback: () => {
      handleClose();
    },
  },
]);

// 级别计数器
const levelCounters = reactive({
  1: 0,
  2: 0,
  3: 0,
});

// 生成目录编号
const generateNumber = (level: number): string => {
  if (level === 1) {
    levelCounters[1]++;
    levelCounters[2] = 0; // 重置下级计数器
    levelCounters[3] = 0;
    return levelCounters[1].toString();
  } else if (level === 2) {
    if (levelCounters[1] === 0) {
      // 如果没有一级目录，先创建一个
      levelCounters[1] = 1;
    }
    levelCounters[2]++;
    levelCounters[3] = 0; // 重置下级计数器
    return `${levelCounters[1]}.${levelCounters[2]}`;
  } else if (level === 3) {
    if (levelCounters[1] === 0) {
      levelCounters[1] = 1;
    }
    if (levelCounters[2] === 0) {
      levelCounters[2] = 1;
    }
    levelCounters[3]++;
    return `${levelCounters[1]}.${levelCounters[2]}.${levelCounters[3]}`;
  }
  return '';
};

// 保存当前状态到历史记录
const saveToHistory = (action: string) => {
  // 清除当前索引之后的历史记录（如果用户撤销后又执行了新操作）
  if (currentHistoryIndex.value < operationHistory.value.length - 1) {
    operationHistory.value = operationHistory.value.slice(
      0,
      currentHistoryIndex.value + 1,
    );
  }

  // 保存当前状态
  const state: HistoryState = {
    catalogItems: JSON.parse(JSON.stringify(catalogItems.value)),
    levelCounters: { ...levelCounters },
    usedInstructionIds: new Set(usedInstructionIds.value),
    timestamp: Date.now(),
    action,
  };

  operationHistory.value.push(state);
  currentHistoryIndex.value = operationHistory.value.length - 1;

  // 限制历史记录数量（最多保留50条）
  if (operationHistory.value.length > 50) {
    operationHistory.value.shift();
    currentHistoryIndex.value--;
  }
};

// 撤销操作
const undo = () => {
  if (currentHistoryIndex.value > 0) {
    const prevState = operationHistory.value[currentHistoryIndex.value];
    currentHistoryIndex.value--;
    // 恢复状态
    catalogItems.value = JSON.parse(JSON.stringify(prevState.catalogItems));
    Object.assign(levelCounters, prevState.levelCounters);
    usedInstructionIds.value = new Set(prevState.usedInstructionIds);
    selectedInstructionIds.value.clear();
  } else {
    notify.warn('没有可撤销的操作');
  }
};

// 检查是否可以撤销
const canUndo = computed(() => currentHistoryIndex.value > 0);

// 获取所有标签列表
const allTags = computed(() => {
  const tagMap = new Map();
  props.instructionList.forEach((instruction) => {
    instruction.tagList?.forEach((tag) => {
      if (!tagMap.has(tag.id)) {
        tagMap.set(tag.id, tag);
      }
    });
  });
  return Array.from(tagMap.values());
});

// 过滤可用的文案列表（排除已使用的，并应用搜索和标签筛选）
const availableInstructions = computed(() => {
  let filtered = props.instructionList.filter(
    (instruction) => !usedInstructionIds.value.has(instruction.id),
  );

  // 应用搜索筛选
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase();
    filtered = filtered.filter(
      (instruction) =>
        instruction.insTitle.toLowerCase().includes(keyword) ||
        instruction.insContent.toLowerCase().includes(keyword),
    );
  }

  // 应用标签筛选
  if (selectedTagId.value) {
    filtered = filtered.filter((instruction) =>
      instruction.tagList?.some((tag) => tag.id === selectedTagId.value),
    );
  }

  return filtered;
});

// 检查是否有选中的文案
const hasSelectedInstructions = computed(
  () => selectedInstructionIds.value.size > 0,
);

// 检查是否全选
const isAllSelected = computed(() => {
  if (availableInstructions.value.length === 0) return false;
  return availableInstructions.value.every((instruction) =>
    selectedInstructionIds.value.has(instruction.id),
  );
});

// 验证目录层次性
const validateLevel = (targetLevel: number): boolean => {
  const levelCounts = catalogItems.value.reduce(
    (counts, item) => {
      counts[item.level] = (counts[item.level] || 0) + 1;
      return counts;
    },
    {} as Record<number, number>,
  );

  if (targetLevel === 1) {
    return true; // 一级目录总是可以添加
  } else if (targetLevel === 2) {
    return (levelCounts[1] || 0) > 0; // 必须有一级目录
  } else if (targetLevel === 3) {
    return (levelCounts[1] || 0) > 0 && (levelCounts[2] || 0) > 0; // 必须有一级和二级目录
  }
  return false;
};

// 重新计算所有编号
const recalculateNumbers = () => {
  // 重置计数器
  levelCounters[1] = 0;
  levelCounters[2] = 0;
  levelCounters[3] = 0;

  // 按级别和顺序重新编号
  catalogItems.value.forEach((item) => {
    item.number = generateNumber(item.level);
  });
};

// 文案选择相关方法
const toggleInstructionSelection = (instruction: Instruction) => {
  if (selectedInstructionIds.value.has(instruction.id)) {
    selectedInstructionIds.value.delete(instruction.id);
  } else {
    selectedInstructionIds.value.add(instruction.id);
  }
};

// 全选/取消全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedInstructionIds.value.clear();
  } else {
    availableInstructions.value.forEach((instruction) => {
      selectedInstructionIds.value.add(instruction.id);
    });
  }
};

// 清除筛选条件
const clearFilters = () => {
  searchKeyword.value = '';
  selectedTagId.value = '';
};

// 拖拽相关方法
const handleDragStart = (instruction: Instruction, event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy';

    // 检查是否拖拽选中的文案
    const selectedInstructions =
      hasSelectedInstructions.value &&
      selectedInstructionIds.value.has(instruction.id)
        ? availableInstructions.value.filter((inst) =>
            selectedInstructionIds.value.has(inst.id),
          )
        : [instruction];

    event.dataTransfer.setData(
      'text/plain',
      JSON.stringify(selectedInstructions),
    );
  }
};

const handleDragOver = (level: number) => {
  dragOverLevel.value = level;
};

const handleDragLeave = () => {
  dragOverLevel.value = null;
};

const handleDrop = (level: number, event: DragEvent) => {
  dragOverLevel.value = null;

  // 验证层次性
  if (!validateLevel(level)) {
    let message = '';
    if (level === 2) {
      message = '添加二级目录前需要先有一级目录';
    } else if (level === 3) {
      message = '添加三级目录前需要先有一级和二级目录';
    }
    notify.warn(message);
    return;
  }

  if (event.dataTransfer) {
    const instructionData = event.dataTransfer.getData('text/plain');
    if (instructionData) {
      try {
        const instructions: Instruction[] = JSON.parse(instructionData);
        // 支持单个或多个文案
        const instructionArray = Array.isArray(instructions)
          ? instructions
          : [instructions];
        addMultipleToCatalog(instructionArray, level);
      } catch (error) {
        console.error('解析拖拽数据失败:', error);
        notify.error('添加失败，请重试');
      }
    }
  }
};

// 拖拽结束处理
const handleDragEnd = () => {
  // 拖拽结束时的清理工作
  dragOverLevel.value = null;
};

// 添加单个文案到目录
const addToCatalog = (instruction: Instruction, level: number) => {
  const catalogItem: CatalogItem = {
    id: `catalog_${Date.now()}_${Math.random()}`,
    number: generateNumber(level),
    title: instruction.insTitle,
    level: level,
    instructionId: instruction.id,
  };

  catalogItems.value.push(catalogItem);
  usedInstructionIds.value.add(instruction.id);
};

// 添加多个文案到目录
const addMultipleToCatalog = (instructions: Instruction[], level: number) => {
  if (instructions.length === 0) return;

  // 保存操作前状态
  const actionName =
    instructions.length === 1
      ? `添加文案"${instructions[0].insTitle}"到${level}级目录`
      : `批量添加${instructions.length}条文案到${level}级目录`;
  saveToHistory(actionName);

  instructions.forEach((instruction) => {
    addToCatalog(instruction, level);
  });

  // 清除选中状态
  selectedInstructionIds.value.clear();
};

// 处理目录排序
const handleCatalogSort = () => {
  saveToHistory('重新排序目录');
  nextTick(() => {
    recalculateNumbers();
  });
};

// 选择目录项
const selectCatalogItem = (item: CatalogItem) => {
  selectedCatalogId.value = item.id;
};

// 删除目录项
const removeCatalogItem = (item: CatalogItem) => {
  const index = catalogItems.value.findIndex((i) => i.id === item.id);
  if (index > -1) {
    saveToHistory(`删除目录项"${item.title}"`);
    catalogItems.value.splice(index, 1);
    usedInstructionIds.value.delete(item.instructionId);
    recalculateNumbers();
    notify.success('已删除目录项');
  }
};

// 清空目录
const clearCatalog = () => {
  if (catalogItems.value.length > 0) {
    saveToHistory('清空所有目录');
    catalogItems.value = [];
    usedInstructionIds.value.clear();
    levelCounters[1] = 0;
    levelCounters[2] = 0;
    levelCounters[3] = 0;
    selectedCatalogId.value = '';
    selectedInstructionIds.value.clear();
    notify.success('已清空目录');
  }
};

// 获取文案摘要
const getInstructionSummary = (content: string): string => {
  const plainText = content.replace(/<[^>]*>/g, ''); // 移除HTML标签
  return plainText.length > 50 ? plainText.substring(0, 50) + '...' : plainText;
};

// 清理窗口内容
const clearDialogContent = () => {
  catalogItems.value = [];
  usedInstructionIds.value.clear();
  selectedInstructionIds.value.clear();
  searchKeyword.value = '';
  selectedTagId.value = '';
  exportProjectName.value = '';
  levelCounters[1] = 0;
  levelCounters[2] = 0;
  levelCounters[3] = 0;
  selectedCatalogId.value = '';
  operationHistory.value = [];
  currentHistoryIndex.value = -1;
  initializeHistory();
};

// 关闭对话框
const handleClose = () => {
  clearDialogContent();
  emit('close');
};

// 显示导出确认窗口
const showExportConfirm = () => {
  if (catalogItems.value.length === 0) {
    notify.warn('请先添加文案到目录中');
    return;
  }

  // 生成默认文件名
  const defaultName = `文案导出_${new Date().toLocaleDateString().replace(/\//g, '-')}`;
  exportProjectName.value = defaultName;

  layer.prompt({
    title: '导出确认',
    content: '请输入导出文件名称：',
    value: defaultName,
    teleport: '#export-instruction-dialog',
    move: false,
    yes: (id: string, value: string) => {
      if (value && value.trim()) {
        exportProjectName.value = value.trim();
        layer.close(id);
        handleExport();
      } else {
        notify.warn('请输入有效的文件名称');
        return false; // 阻止关闭
      }
    },
  });
};
// 文件下载功能
const downloadFile = (filename: string) => {
  const baseUrl = env.getApiBaseUrl();
  const downloadUrl = `${baseUrl}/orders/download/${filename}`;

  // 创建临时链接进行下载
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 导出文案
const handleExport = async () => {
  try {
    const exportData: ExportProductDetailed = {
      projectName:
        exportProjectName.value ||
        `文案导出_${new Date().toLocaleDateString()}`,
      insIds: catalogItems.value.map((item) => Number(item.instructionId)),
      titlesWithNumbers: catalogItems.value.map((item) => ({
        level: item.level.toString(),
        number: item.number,
        title: item.title,
        // 不传入id字段
      })),
    };

    notify.info('正在生成导出文件...');

    const response = await ordersApi.exportInstruction(exportData);

    if (response && response.data) {
      notify.success('文件生成成功，开始下载');
      downloadFile(response.data);

      // 下载成功后清理窗口内容并关闭
      setTimeout(() => {
        clearDialogContent();
        emit('close');
        notify.success('文案导出完成');
      }, 500);
    } else {
      notify.error('导出失败：服务器未返回文件信息');
    }
  } catch (error) {
    console.error('导出文案失败:', error);
    notify.error('导出失败，请稍后重试');
  }
};

// 键盘事件处理
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'z') {
    event.preventDefault();
    undo();
  }
};

// 初始化历史记录
const initializeHistory = () => {
  const initialState: HistoryState = {
    catalogItems: [],
    levelCounters: { 1: 0, 2: 0, 3: 0 },
    usedInstructionIds: new Set(),
    timestamp: Date.now(),
    action: '初始状态',
  };
  operationHistory.value = [initialState];
  currentHistoryIndex.value = 0;
};

const checkWindowSize = () => {
  isMobileView.value = window.innerWidth <= 1024;
};

// 生命周期钩子
onMounted(() => {
  initializeHistory();
  checkWindowSize();
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style lang="scss" scoped>
// ==================== Mixins ====================

// 基础 flex 布局
@mixin flex-layout(
  $direction: row,
  $justify: flex-start,
  $align: stretch,
  $gap: 0
) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
  @if $gap != 0 {
    gap: $gap;
  }
}

// 面板容器样式
@mixin panel-container($border-color: #e8e8e8, $border-radius: 6px) {
  border: 1px solid $border-color;
  border-radius: $border-radius;
  overflow: hidden;
  @include flex-layout(column);
  min-height: 0;
  box-sizing: border-box;
}

// 区域头部样式
@mixin section-header($bg-color: #f5f5f5, $border-color: #e8e8e8) {
  @include flex-layout(row, space-between, center);
  padding: 12px 16px;
  background-color: $bg-color;
  border-bottom: 1px solid $border-color;
  height: 50px;
}

// 操作按钮样式
@mixin action-button($color: #666, $hover-color: $primary-color) {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  color: $color;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: $hover-color;
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
    opacity: 0.5;
  }
}

// 滚动容器样式
@mixin scroll-container($padding: 8px) {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: $padding;
  min-height: 0;
  max-height: 100%;
}

// 卡片项目样式
@mixin card-item($border-color: #e8e8e8, $bg-color: #fff, $hover-bg: #f0f8ff) {
  padding: 8px 12px;
  margin-bottom: 4px;
  border: 1px solid $border-color;
  border-radius: 4px;
  cursor: pointer;
  background-color: $bg-color;
  transition: all 0.2s;

  &:hover {
    border-color: $primary-color;
    background-color: $hover-bg;
  }

  &.selected {
    border-color: $primary-color;
    background-color: $hover-bg;
  }
}

// 文本省略样式
@mixin text-ellipsis($lines: 1) {
  @if $lines == 1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

// 层级指示器样式
@mixin level-indicator($level, $color, $margin-left: 0) {
  border-left: 3px solid $color;
  @if $margin-left > 0 {
    margin-left: $margin-left;
  }
}

// 空状态样式
@mixin empty-state($color: #999, $font-size: 13px) {
  text-align: center;
  padding: 40px 20px;
  color: $color;
  font-size: $font-size;
}

// 拖拽区域样式
@mixin drop-zone-base($border-color: #d9d9d9, $bg-color: #fafafa) {
  flex: 1;
  border: 2px dashed $border-color;
  border-radius: 6px;
  @include flex-layout(row, center, center);
  transition: all 0.3s;
  position: relative;
  background-color: $bg-color;
}

// 筛选按钮样式
@mixin filter-button($border-color: #d9d9d9, $text-color: #666) {
  @include flex-layout(row, flex-start, center, 4px);
  background: none;
  border: 1px solid $border-color;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  color: $text-color;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: $primary-color;
    color: $primary-color;
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.active {
    border-color: $primary-color;
    background-color: #e6f7ff;
    color: $primary-color;
  }
}

// 标签样式
@mixin tag-style($bg-color: #f0f0f0, $text-color: #666, $font-size: 11px) {
  padding: 2px 6px;
  background-color: $bg-color;
  border-radius: $border-radius-middle;
  font-size: $font-size;
  color: $text-color;
}

// ==================== 主要样式 ====================

.export-instruction-dialog {
  padding: 1rem;
  padding-bottom: 0;
  @include flex-layout(column);
  overflow: hidden;
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;

  .export-content {
    @include flex-layout(row, flex-start, stretch, 16px);
    flex: 1;
    min-height: 0;
    overflow: hidden;

    h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    // 左侧目录区域
    .catalog-section {
      flex: 1;
      @include panel-container;
      height: 100%;
      max-height: 100%;
      max-width: 350px;

      .section-header {
        @include section-header;

        .catalog-actions {
          @include flex-layout(row, flex-start, center, 8px);

          button {
            @include action-button;
          }
        }
      }

      .catalog-list {
        @include scroll-container;

        .catalog-item {
          @include flex-layout(row, space-between, center);
          @include card-item;

          &.selected {
            background-color: #e6f7ff;
          }

          &.level-1 {
            @include level-indicator(1, #1890ff);
          }

          &.level-2 {
            @include level-indicator(2, #52c41a, 16px);
          }

          &.level-3 {
            @include level-indicator(3, #faad14, 32px);
          }

          .catalog-content {
            flex: 1;
            min-width: 0;

            .catalog-number {
              font-size: 12px;
              color: #666;
              margin-right: 8px;
              font-weight: 500;
            }

            .catalog-title {
              font-size: 13px;
              color: #333;
              @include text-ellipsis;
            }
          }

          .delete-btn {
            @include action-button(#999, #ff4d4f);
            padding: 2px;
            border-radius: 2px;
            opacity: 0;
            transition: opacity 0.2s;
          }

          &:hover .delete-btn {
            opacity: 1;
          }
        }

        .empty-catalog {
          @include empty-state;
        }
      }
    }

    // 中间编辑区域
    .edit-section {
      flex: 1;
      @include panel-container;
      height: 100%;
      max-height: 100%;

      .section-header {
        @include section-header;
      }

      .drop-zones {
        @include flex-layout(column, flex-start, stretch, 16px);
        flex: 1;
        padding: 16px;
        min-height: 0;
        overflow: hidden;

        .drop-zone {
          @include drop-zone-base;

          &.enabled {
            cursor: pointer;

            &.drag-over {
              border-style: solid;
              background-color: #f0f8ff;
              transform: scale(1.02);
            }
          }

          &.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background-color: #f5f5f5;

            .drop-zone-content {
              color: #999;
            }

            .disabled-text {
              color: #ff4d4f !important;
              font-size: 11px;
            }
          }

          &.level-1 {
            border-color: #1890ff;

            &.enabled.drag-over {
              background-color: #e6f7ff;
            }
          }

          &.level-2 {
            border-color: #52c41a;

            &.enabled.drag-over {
              background-color: #f6ffed;
            }

            &.disabled {
              border-color: #d9d9d9;
            }
          }

          &.level-3 {
            border-color: #faad14;

            &.enabled.drag-over {
              background-color: #fffbe6;
            }

            &.disabled {
              border-color: #d9d9d9;
            }
          }

          .drop-zone-content {
            text-align: center;

            .drop-zone-icon {
              margin-bottom: 8px;
              opacity: 0.6;
            }

            h4 {
              margin: 0 0 4px 0;
              font-size: 16px;
              color: #333;
            }

            p {
              margin: 0;
              font-size: 12px;
              color: #666;
            }

            .level-indicator {
              position: absolute;
              top: 8px;
              right: 12px;
              font-size: 12px;
              color: #999;
              background-color: rgba(255, 255, 255, 0.8);
              padding: 2px 6px;
              border-radius: 10px;
            }
          }
        }
      }
    }

    // 右侧文案列表区域
    .instruction-section {
      flex: 1;
      @include panel-container;
      height: 100%;
      max-height: 100%;

      .section-header {
        @include section-header;

        .instruction-actions {
          @include flex-layout(row, flex-start, center, 8px);
        }

        .select-all-btn {
          @include filter-button;
        }

        .instruction-count {
          font-size: 12px;
          color: #666;

          .selected-count {
            color: $primary-color;
            font-weight: 500;
          }
        }
      }

      .filter-section {
        flex-shrink: 0;
        padding: 12px 16px;
        border-bottom: 1px solid #e8e8e8;
        background-color: #fafafa;

        .filter-row {
          @include flex-layout(row, flex-start, center, 12px);
          margin-bottom: 8px;

          .search-input {
            flex: 1;
            min-width: 0;
          }

          .tag-filter {
            flex: 0 0 150px;
          }
        }

        .filter-info {
          @include flex-layout(row, space-between, center);
          font-size: 12px;

          .filter-count {
            color: #666;

            .filtered {
              color: $primary-color;
              font-weight: 500;
            }
          }

          .clear-filter {
            @include action-button(#999, $primary-color);
            @include flex-layout(row, flex-start, center, 4px);
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 3px;

            &:hover {
              background-color: #f0f8ff;
            }
          }
        }
      }

      .instruction-list {
        @include scroll-container;

        .instruction-item {
          @include flex-layout(row, flex-start, flex-start);
          @include card-item(#e8e8e8, #fff, #f0f8ff);
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 6px;

          &:hover {
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
          }

          &.selected {
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
          }

          &.dragging {
            opacity: 0.8;
            cursor: grabbing;
          }

          .instruction-content {
            flex: 1;
            min-width: 0;

            .instruction-title {
              margin: 0 0 6px 0;
              font-size: 14px;
              font-weight: 500;
              color: #333;
              @include text-ellipsis;
            }

            .instruction-summary {
              margin: 0 0 8px 0;
              font-size: 12px;
              color: #666;
              line-height: 1.4;
              @include text-ellipsis(2);
            }

            .instruction-tags {
              @include flex-layout(row, flex-start, center, 4px);
              flex-wrap: wrap;

              .tag {
                @include tag-style;
              }
            }
          }

          .drag-handle {
            margin-left: 8px;
            color: #ccc;
            cursor: grab;

            &:hover {
              color: #999;
            }
          }
        }

        .empty-instructions {
          @include empty-state;

          p {
            margin: 0 0 8px 0;
          }

          .hint {
            font-size: 12px;
            color: $primary-color;
          }
        }
      }
    }
  }

  .dialog-footer {
    border-top: 1px solid #e8e8e8;
    padding: 16px;

    .footer-actions {
      @include flex-layout(row, flex-end, center, 12px);
    }
  }
}

// ==================== 响应式样式 ====================
@media (max-width: $desktop_layout_breakpoint) {
  .export-instruction-dialog {
    .export-content {
      @include flex-layout(column, flex-start, stretch, 12px);

      .catalog-section {
        flex: 0 0 200px;
        order: 3;
        height: auto;
        max-height: 200px;
      }

      .instruction-section {
        order: 2;
        height: auto;
        max-height: 300px;

        .filter-section {
          padding: 8px 12px;

          .filter-row {
            @include flex-layout(column, flex-start, stretch, 8px);
            margin-bottom: 6px;

            .search-input,
            .tag-filter {
              flex: none;
              width: 100%;
            }
          }
        }
      }

      .edit-section {
        flex: 1;
        min-height: 250px;
        max-height: 400px;
        order: 1;
        height: auto;

        .drop-zones {
          @include flex-layout(row, flex-start, stretch, 12px);
          padding: 12px;

          .drop-zone {
            flex: 1;
            min-height: 150px;
          }
        }
      }
    }
  }
}
</style>
