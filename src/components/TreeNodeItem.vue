<template>
  <div class="tree-node-item">
    <!-- 节点内容 -->
    <div
      class="node-content"
      :class="{
        selected: isSelected,
        disabled: node.disabled,
      }"
      :style="{ paddingLeft: `${level * 20 + 8}px` }"
      @click="handleNodeClick"
    >
      <!-- 展开/收起按钮 -->
      <button
        v-if="hasChildren"
        class="expand-button"
        :class="{ expanded: isExpanded }"
        @click.stop="handleToggleExpand"
      >
        <SvgIcon name="expand" :width="'12px'" :height="'12px'" />
      </button>
      <span v-else class="expand-placeholder"></span>

      <!-- Checkbox（多选模式或节点配置了checkbox） -->
      <label v-if="shouldShowCheckbox" class="checkbox-wrapper" @click.stop>
        <input
          type="checkbox"
          :checked="isSelected"
          :disabled="node.disabled"
          @change="handleCheckboxChange"
        />
        <span class="checkbox-custom"></span>
      </label>

      <!-- 节点图标 -->
      <div v-if="node.icon" class="node-icon">
        <SvgIcon :name="node.icon" :width="'16px'" :height="'16px'" />
      </div>

      <!-- 节点名称 -->
      <span class="node-name">{{ node.name }}</span>
    </div>

    <!-- 子节点 -->
    <Transition name="slide-fade">
      <div v-if="hasChildren && isExpanded" class="children-container">
        <TreeNodeItem
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :level="level + 1"
          :multiple="multiple"
          :show-checkbox="showCheckbox"
          :selected-ids="selectedIds"
          :expanded-ids="expandedIds"
          @toggle-expand="handleChildToggleExpand"
          @select="handleChildSelect"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SvgIcon from './SvgIcon.vue';
import type { TreeNode } from './Tree.vue';

// 组件属性接口
interface Props {
  node: TreeNode;
  level: number;
  multiple: boolean;
  showCheckbox?: boolean;
  selectedIds: Set<string | number>;
  expandedIds: Set<string | number>;
}

// 组件事件接口
interface Emits {
  (e: 'toggle-expand', nodeId: string | number): void;
  (e: 'select', nodeId: string | number, checked?: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  showCheckbox: false,
});
const emit = defineEmits<Emits>();

// 计算属性
const hasChildren = computed(() => {
  return props.node.children && props.node.children.length > 0;
});

const isExpanded = computed(() => {
  return props.expandedIds.has(props.node.id);
});

const isSelected = computed(() => {
  return props.selectedIds.has(props.node.id);
});

const shouldShowCheckbox = computed(() => {
  // 如果节点明确设置了showCheckbox属性，优先使用节点的设置
  if (props.node.showCheckbox !== undefined) {
    return props.node.showCheckbox;
  }
  // 否则使用组件级别的showCheckbox设置，并且需要是多选模式
  return props.showCheckbox && props.multiple;
});

/**
 * 处理节点点击事件
 */
function handleNodeClick() {
  if (props.node.disabled) return;

  // 单选模式下点击节点直接选中
  if (!props.multiple) {
    emit('select', props.node.id);
  }
  // 多选模式下如果没有checkbox，点击节点切换选中状态
  else if (!shouldShowCheckbox.value) {
    emit('select', props.node.id);
  }
}

/**
 * 处理展开/收起按钮点击
 */
function handleToggleExpand() {
  if (props.node.disabled) return;
  emit('toggle-expand', props.node.id);
}

/**
 * 处理checkbox变化
 */
function handleCheckboxChange(event: Event) {
  if (props.node.disabled) return;

  const target = event.target as HTMLInputElement;
  emit('select', props.node.id, target.checked);
}

/**
 * 处理子节点展开/收起事件
 */
function handleChildToggleExpand(nodeId: string | number) {
  emit('toggle-expand', nodeId);
}

/**
 * 处理子节点选择事件
 */
function handleChildSelect(nodeId: string | number, checked?: boolean) {
  emit('select', nodeId, checked);
}
</script>

<style scoped>
.tree-node-item {
  user-select: none;
}

.node-content {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  min-height: 32px;
}

.node-content:hover:not(.disabled) {
  background-color: #f5f5f5;
}

.node-content.selected {
  background-color: #e6f3ff;
  color: #1890ff;
}

.node-content.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.expand-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
  margin-right: 4px;
}

.expand-button:hover {
  background-color: #e6f3ff;
}

.expand-button.expanded {
  transform: rotate(-90deg);
}

.expand-placeholder {
  width: 20px;
  height: 20px;
  margin-right: 4px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  margin-right: 8px;
  cursor: pointer;
}

.checkbox-wrapper input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  position: relative;
  width: 16px;
  height: 16px;
  border: 2px solid #d9d9d9;
  border-radius: 2px;
  background-color: #fff;
  transition: all 0.2s ease;
}

.checkbox-wrapper input[type='checkbox']:checked + .checkbox-custom {
  background-color: #1890ff;
  border-color: #1890ff;
}

.checkbox-wrapper input[type='checkbox']:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-wrapper input[type='checkbox']:disabled + .checkbox-custom {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  cursor: not-allowed;
}

.node-icon {
  display: flex;
  align-items: center;
  margin-right: 8px;
  color: #666;
}

.node-name {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.children-container {
  overflow: hidden;
}

/* 动画效果 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  max-height: 1000px;
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .node-content {
    padding: 6px 4px;
    min-height: 36px;
  }

  .node-name {
    font-size: 16px;
  }
}
</style>
