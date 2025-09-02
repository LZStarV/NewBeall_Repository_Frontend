<template>
  <div class="tree-container">
    <div v-for="node in treeData" :key="node.id" class="tree-node">
      <TreeNodeItem
        :node="node"
        :level="0"
        :multiple="multiple"
        :selected-ids="selectedIds"
        :expanded-ids="expandedIds"
        @toggle-expand="handleToggleExpand"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import TreeNodeItem from './TreeNodeItem.vue';

// 树节点数据接口
export interface TreeNode {
  id: string | number;
  name: string;
  icon?: string;
  parentId?: string | number | null;
  showCheckbox?: boolean; // 是否显示checkbox
  disabled?: boolean;
  selected?: boolean; // 是否选中
  expanded?: boolean; // 是否展开
  children?: TreeNode[];
  [key: string]: any;
}

// 组件属性接口
interface Props {
  data: TreeNode[];
  multiple?: boolean; // 是否多选模式
  showCheckbox?: boolean; // 是否显示checkbox
  checkStrictly?: boolean; // 是否严格模式（不联动）
  defaultExpandedIds?: (string | number)[];
  defaultSelectedIds?: (string | number)[];
}

// 组件事件接口
interface Emits {
  (e: 'select', value: string | number | (string | number)[]): void;
  (e: 'expand', expandedIds: (string | number)[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  showCheckbox: false,
  checkStrictly: false,
  defaultExpandedIds: () => [],
  defaultSelectedIds: () => [],
});

const emit = defineEmits<Emits>();

// 响应式状态
const expandedIds = ref<Set<string | number>>(new Set());
const selectedIds = ref<Set<string | number>>(new Set());

// 初始化展开和选中状态
const initializeStates = () => {
  // 初始化展开状态
  const initialExpandedIds = new Set(props.defaultExpandedIds);
  props.data.forEach((node) => {
    if (node.expanded) {
      initialExpandedIds.add(node.id);
    }
  });
  expandedIds.value = initialExpandedIds;

  // 初始化选中状态
  const initialSelectedIds = new Set(props.defaultSelectedIds);
  props.data.forEach((node) => {
    if (node.selected) {
      initialSelectedIds.add(node.id);
    }
  });
  selectedIds.value = initialSelectedIds;
};

/**
 * 将扁平化数据转换为树状结构
 * @param flatData 扁平化的节点数据
 * @returns 树状结构数据
 */
function buildTreeFromFlatData(flatData: TreeNode[]): TreeNode[] {
  const nodeMap = new Map<string | number, TreeNode>();
  const rootNodes: TreeNode[] = [];

  // 创建节点映射
  flatData.forEach((node) => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  // 构建树状结构
  flatData.forEach((node) => {
    const currentNode = nodeMap.get(node.id)!;

    if (node.parentId === null || node.parentId === undefined) {
      // 根节点
      rootNodes.push(currentNode);
    } else {
      // 子节点
      const parentNode = nodeMap.get(node.parentId);
      if (parentNode) {
        parentNode.children!.push(currentNode);
      }
    }
  });

  return rootNodes;
}

// 计算树状数据
const treeData = computed(() => {
  return buildTreeFromFlatData(props.data);
});

/**
 * 处理节点展开/收起
 * @param nodeId 节点ID
 */
function handleToggleExpand(nodeId: string | number) {
  if (expandedIds.value.has(nodeId)) {
    expandedIds.value.delete(nodeId);
  } else {
    expandedIds.value.add(nodeId);
  }

  // 触发展开事件
  emit('expand', Array.from(expandedIds.value));
}

/**
 * 获取所有子节点ID
 * @param nodeId 父节点ID
 * @returns 子节点ID数组
 */
function getAllChildrenIds(nodeId: string | number): (string | number)[] {
  const childrenIds: (string | number)[] = [];
  const findChildren = (parentId: string | number) => {
    props.data.forEach((node) => {
      if (node.parentId === parentId) {
        childrenIds.push(node.id);
        findChildren(node.id);
      }
    });
  };
  findChildren(nodeId);
  return childrenIds;
}

/**
 * 获取所有父节点ID
 * @param nodeId 子节点ID
 * @returns 父节点ID数组
 */
function getAllParentIds(nodeId: string | number): (string | number)[] {
  const parentIds: (string | number)[] = [];
  const findParent = (childId: string | number) => {
    const node = props.data.find((n) => n.id === childId);
    if (node && node.parentId !== null && node.parentId !== undefined) {
      parentIds.push(node.parentId);
      findParent(node.parentId);
    }
  };
  findParent(nodeId);
  return parentIds;
}

/**
 * 处理节点选择
 * @param nodeId 节点ID
 * @param checked 是否选中（多选模式）
 */
function handleSelect(nodeId: string | number, checked?: boolean) {
  if (!props.multiple) {
    // 单选模式
    selectedIds.value.clear();
    selectedIds.value.add(nodeId);
    emit('select', nodeId);
  } else {
    // 多选模式
    const isChecked =
      checked !== undefined ? checked : !selectedIds.value.has(nodeId);

    if (!props.checkStrictly) {
      // 联动模式
      if (isChecked) {
        // 选中节点及其所有子节点
        selectedIds.value.add(nodeId);
        const childrenIds = getAllChildrenIds(nodeId);
        childrenIds.forEach((id) => selectedIds.value.add(id));

        // 检查是否需要选中父节点
        const parentIds = getAllParentIds(nodeId);
        parentIds.forEach((parentId) => {
          const siblingIds = getAllChildrenIds(parentId);
          const allSiblingsSelected = siblingIds.every((id) =>
            selectedIds.value.has(id),
          );
          if (allSiblingsSelected) {
            selectedIds.value.add(parentId);
          }
        });
      } else {
        // 取消选中节点及其所有子节点和父节点
        selectedIds.value.delete(nodeId);
        const childrenIds = getAllChildrenIds(nodeId);
        childrenIds.forEach((id) => selectedIds.value.delete(id));

        // 取消选中所有父节点
        const parentIds = getAllParentIds(nodeId);
        parentIds.forEach((id) => selectedIds.value.delete(id));
      }
    } else {
      // 严格模式，不联动
      if (isChecked) {
        selectedIds.value.add(nodeId);
      } else {
        selectedIds.value.delete(nodeId);
      }
    }

    emit('select', Array.from(selectedIds.value));
  }
}

// 监听数据变化，重新初始化状态
watch(
  () => props.data,
  () => {
    initializeStates();
  },
  { deep: true },
);

// 监听默认选中项变化
watch(
  () => props.defaultSelectedIds,
  (newIds) => {
    selectedIds.value = new Set(newIds);
  },
  { deep: true },
);

// 监听默认展开项变化
watch(
  () => props.defaultExpandedIds,
  (newIds) => {
    expandedIds.value = new Set(newIds);
  },
  { deep: true },
);

// 组件挂载时初始化状态
onMounted(() => {
  initializeStates();
});

// 暴露组件方法
defineExpose({
  /**
   * 获取选中的节点ID
   */
  getSelectedIds: () => Array.from(selectedIds.value),

  /**
   * 获取展开的节点ID
   */
  getExpandedIds: () => Array.from(expandedIds.value),

  /**
   * 设置选中的节点
   */
  setSelectedIds: (ids: (string | number)[]) => {
    selectedIds.value = new Set(ids);
  },

  /**
   * 设置展开的节点
   */
  setExpandedIds: (ids: (string | number)[]) => {
    expandedIds.value = new Set(ids);
  },

  /**
   * 展开所有节点
   */
  expandAll: () => {
    const allIds = props.data.map((node) => node.id);
    expandedIds.value = new Set(allIds);
  },

  /**
   * 收起所有节点
   */
  collapseAll: () => {
    expandedIds.value.clear();
  },
});
</script>

<style scoped>
.tree-container {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.tree-node {
  position: relative;
}
</style>
