<!-- eslint-disable vue/no-v-html -->
<template>
  <BaseCard title="笔记列表">
    <template #tabs>
      <div class="custom-tabs">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'pinned' }"
          @click="activeTab = 'pinned'"
        >
          笔记栏
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'all' }"
          @click="activeTab = 'all'"
        >
          笔记列表
        </div>
      </div>
    </template>
    <template #actions>
      <lay-icon
        type="layui-icon-add-one"
        class="action-icon"
        title="新建纪要"
        @click="handleAddNote"
      />
      <lay-icon
        type="layui-icon-screen-full"
        class="action-icon"
        title="笔记栏全屏"
        @click="handleFullScreen"
      />
    </template>

    <div class="note-content">
      <!-- 空状态 -->
      <div v-if="noteList.length === 0" class="empty-wrapper">
        <span>暂无笔记</span>
      </div>

      <!-- 笔记栏 -->
      <div v-else-if="activeTab === 'pinned'" class="note-panel">
        <div class="note-panel-content">
          <div
            class="note-content-display"
            v-html="firstNote?.content || '暂无内容'"
          ></div>
        </div>
        <div class="note-panel-footer">
          <span class="word-count"
            >当前已输入{{
              getTextLength(firstNote?.content)
            }}个字符，您还可以输入{{
              10000 - getTextLength(firstNote?.content)
            }}个字符。</span
          >
        </div>
      </div>

      <!-- 笔记列表 -->
      <div v-else class="note-list">
        <div
          v-for="note in noteList"
          :key="note.id"
          class="note-item"
          @click="handleNoteClick(note)"
        >
          <!-- 头像 -->
          <div class="note-avatar">
            <Avatar v-if="note.avatar" :url="note.avatar" :alt="note.name" />
            <div v-else class="avatar-placeholder">
              {{ note.name?.charAt(0) || 'N' }}
            </div>
          </div>

          <!-- 笔记内容 -->
          <div class="note-main">
            <div class="note-title">{{ note.title || '无标题' }}</div>
            <div class="note-author">{{ note.name }}</div>
          </div>

          <!-- 操作按钮 -->
          <div class="note-actions" @click.stop>
            <lay-tooltip content="分享">
              <SvgIcon
                name="share"
                class="action-btn"
                @click="handleShare(note)"
              />
            </lay-tooltip>

            <lay-tooltip content="置顶：将在首页默认展示">
              <SvgIcon name="top" class="action-btn" @click="handlePin(note)" />
            </lay-tooltip>

            <lay-tooltip content="删除">
              <SvgIcon
                name="garbage_can"
                class="action-btn"
                @click="handleDelete(note)"
              />
            </lay-tooltip>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>

  <lay-layer
    v-model="showEditor"
    :title="noteForm?.title"
    :area="['80%', '85%']"
    :move="true"
    :resize="true"
    :shade-close="false"
    :close-btn="false"
    @close="handleCloseEditor"
  >
    <div class="note-editor-dialog">
      <!-- 标题输入 -->
      <div class="title-section">
        <label class="section-label">标题：</label>
        <lay-input
          v-model="noteForm!.title"
          placeholder="请输入笔记标题"
          size="lg"
        />
      </div>

      <!-- 内容编辑 -->
      <div class="content-section">
        <label class="section-label">内容：</label>
        <div class="editor-container">
          <NoteEditor
            ref="noteEditorRef"
            v-model:content="noteForm!.content"
            :max-length="10000"
            placeholder="请输入笔记内容..."
            @ready="handleEditorReady"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="button-section">
        <lay-button @click="handleCloseEditor"> 关闭 </lay-button>
        <lay-button type="primary" :loading="saving" @click="handleSaveNote">
          保存
        </lay-button>
      </div>
    </template>
  </lay-layer>

  <!-- 共享抽屉 -->
  <lay-layer
    v-model="showShareDialog"
    title="请选择协作人员"
    type="drawer"
    area="350px"
    offset="r"
  >
    <div class="share-content">
      <div v-if="shareTreeData.length === 0" class="empty-state">
        暂无可分享的用户
      </div>
      <div v-else class="tree-wrapper">
        <lay-tree
          :data="transformedTreeData"
          :show-checkbox="true"
          :check-strictly="false"
          :checked-keys="selectedUserIds"
          :expand-keys="allExpandKeys"
          @check-change="handleCheckChange"
        />
      </div>
    </div>
    <template #footer>
      <div class="drawer-footer">
        <lay-button type="primary" @click="handleConfirmShare">确定</lay-button>
        <lay-button @click="handleCloseShareDialog">取消</lay-button>
      </div>
    </template>
  </lay-layer>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, computed } from 'vue';
import BaseCard from './BaseCard.vue';
import type {
  ListItem,
  ListRes,
  ShareTreeRes,
  ShareTreeItem,
} from '@/api/workEditor/workEditorApi.type';
import workEditorApi from '@/api/workEditor/workEditorApi';
import { layer } from '@layui/layui-vue';
import SvgIcon from '@/components/SvgIcon.vue';
import Avatar from '@/components/Avatar.vue';
import NoteEditor from './NoteEditor.vue';

const activeTab = ref<'pinned' | 'all'>('pinned');
const noteList = ref<ListRes>([]);

// 编辑器相关状态
const showEditor = ref(false);
const saving = ref(false);
const quillInstance = ref();

// 共享相关状态
const showShareDialog = ref(false);
const shareTreeData = ref<ShareTreeRes>([]);
const selectedUserIds = ref<string[]>([]);
const currentShareNote = ref<ListItem>();

// 编辑器笔记表单数据
const noteForm = ref<ListItem>();
const noteEditorRef = ref();

// 计算首条笔记
const firstNote = computed(() => {
  return noteList.value.length > 0 ? noteList.value[0] : null;
});

// 获取文本长度（去除HTML标签）
const getTextLength = (htmlContent: string | undefined): number => {
  if (!htmlContent) return 0;

  // 创建临时div元素来提取纯文本
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // 移除所有Quill的UI元素
  const quillUiElements = tempDiv.querySelectorAll('.ql-ui');
  quillUiElements.forEach((el) => el.remove());

  // 获取纯文本内容
  const textContent = tempDiv.textContent || tempDiv.innerText || '';

  // 去除多余的空白字符并返回长度
  return textContent.replace(/\s+/g, ' ').trim().length;
};

// 获取纪要列表
const fetchNoteList = async () => {
  const res = await workEditorApi.list();
  if (!res) return;
  noteList.value = res.data || res;
};

// 点击笔记项
const handleNoteClick = (note: ListItem) => {
  // 先重置编辑器
  if (noteEditorRef.value) {
    noteEditorRef.value.resetEditor();
  }

  // 设置表单数据
  noteForm.value = { ...note }; // 使用深拷贝避免直接修改原数据

  // 显示编辑框
  showEditor.value = true;

  // 等待编辑器渲染完成后设置内容
  nextTick(() => {
    if (noteEditorRef.value && note.content) {
      noteEditorRef.value.setContent(note.content);
    }
  });
};

// 编辑器准备就绪
const handleEditorReady = (quill: unknown) => {
  quillInstance.value = quill;
};

// 保存笔记
const handleSaveNote = async () => {
  if (!noteForm.value) return;

  // 显示确认对话框
  layer.confirm('确认保存当前笔记吗？', {
    title: '确认保存',
    icon: 3,
    yes: async (index: number) => {
      // 关闭确认框
      layer.close(index);

      // 用户点击确认
      try {
        // 设置保存状态
        saving.value = true;

        // 获取编辑器最新内容
        if (noteEditorRef.value && noteForm.value) {
          noteForm.value.content = noteEditorRef.value.getContent();
        }

        if (noteForm.value) {
          const res = await workEditorApi.saveWorkEditor(noteForm.value);
          noteList.value = res.data || res;

          // 关闭编辑器（保存成功后直接关闭）
          doCloseEditor();

          layer.msg('保存成功！', { icon: 1 });

          // 刷新页面列表
          await fetchNoteList();
        }
      } catch (error) {
        console.error('保存笔记失败:', error);
        layer.msg('保存失败，请重试', { icon: 2 });
      } finally {
        // 重置保存状态
        saving.value = false;
      }
    },
  });
};

// 关闭编辑器
const handleCloseEditor = () => {
  // 显示确认对话框
  layer.confirm('确认关闭编辑器吗？如果有未保存的内容将丢失', {
    title: '确认关闭',
    icon: 3,
    yes: (index: number) => {
      // 关闭确认框
      layer.close(index);
      // 用户点击确认，直接关闭编辑器
      doCloseEditor();
    },
  });
};

// 直接关闭编辑器
const doCloseEditor = () => {
  showEditor.value = false;

  // 重置编辑器内容
  if (noteEditorRef.value) {
    noteEditorRef.value.resetEditor();
  }

  // 清空表单数据
  noteForm.value = undefined;
  quillInstance.value = null;
};

// 共享笔记
const handleShare = async (note: ListItem) => {
  try {
    // 设置当前共享的笔记
    currentShareNote.value = note;

    // 获取共享列表
    const res = await workEditorApi.shareTree(note.id);
    shareTreeData.value = res.data || res;

    // 清空之前的选择
    selectedUserIds.value = [];

    // 显示抽屉对话框
    showShareDialog.value = true;
  } catch (error) {
    console.error('获取共享列表失败:', error);
    layer.msg('获取共享列表失败，请重试', { icon: 2 });
  }
};

// 转换数据格式为Tree组件需要的格式
const transformedTreeData = computed(() => {
  interface TreeNode {
    id: string;
    title: string;
    key: string;
    disabled: boolean;
    checkable: boolean;
    icon: string;
    children: TreeNode[];
    originData: ShareTreeItem;
  }

  const buildTree = (parentId: string = '0'): TreeNode[] => {
    return shareTreeData.value
      .filter((item) => item.pId === parentId)
      .map((item) => ({
        id: item.id,
        title: item.name,
        key: item.id,
        disabled: false, // 所有节点都可以交互
        checkable: true, // 所有节点都可以被勾选，实现级联选择
        icon:
          item.isUser === 'false' ? 'layui-icon-senior' : 'layui-icon-username',
        children: buildTree(item.id),
        originData: item, // 保存原始数据
      }));
  };

  return buildTree();
});

// 获取所有节点的key，用于默认展开
const allExpandKeys = computed(() => {
  const keys: string[] = [];

  interface TreeNodeType {
    key: string;
    children?: TreeNodeType[];
  }

  const collectKeys = (nodes: TreeNodeType[]) => {
    nodes.forEach((node) => {
      keys.push(node.key);
      if (node.children && node.children.length > 0) {
        collectKeys(node.children);
      }
    });
  };

  collectKeys(transformedTreeData.value);
  return keys;
});

// 处理勾选变化
const handleCheckChange = (node: Record<string, unknown>, checked: boolean) => {
  const nodeData = node as { key: string; originData: ShareTreeItem };

  // 递归收集所有用户节点ID
  const collectUserIds = (nodeKey: string): string[] => {
    const userIds: string[] = [];

    // 定义树节点类型
    interface TreeNodeType {
      key: string;
      originData: ShareTreeItem;
      children?: TreeNodeType[];
    }

    // 在树数据中查找节点
    const findNodeInTree = (
      data: TreeNodeType[],
      targetKey: string,
    ): TreeNodeType | null => {
      for (const item of data) {
        if (item.key === targetKey) return item;
        if (item.children && item.children.length > 0) {
          const found = findNodeInTree(item.children, targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    const targetNode = findNodeInTree(transformedTreeData.value, nodeKey);
    if (!targetNode) return userIds;

    // 递归收集用户ID
    const collectFromNode = (treeNode: TreeNodeType) => {
      // 如果是用户节点，添加到列表
      if (treeNode.originData && treeNode.originData.isUser === 'true') {
        userIds.push(treeNode.key);
      }

      // 递归处理子节点
      if (treeNode.children && treeNode.children.length > 0) {
        treeNode.children.forEach((child: TreeNodeType) => {
          collectFromNode(child);
        });
      }
    };

    collectFromNode(targetNode);
    return userIds;
  };

  // 获取当前节点相关的所有用户ID
  const relatedUserIds = collectUserIds(nodeData.key);

  if (checked) {
    // 勾选：添加所有相关用户ID
    relatedUserIds.forEach((userId) => {
      if (!selectedUserIds.value.includes(userId)) {
        selectedUserIds.value.push(userId);
      }
    });
  } else {
    // 取消勾选：移除所有相关用户ID
    relatedUserIds.forEach((userId) => {
      const index = selectedUserIds.value.indexOf(userId);
      if (index > -1) {
        selectedUserIds.value.splice(index, 1);
      }
    });
  }
};

// 关闭共享对话框
const handleCloseShareDialog = () => {
  showShareDialog.value = false;
  selectedUserIds.value = [];
  currentShareNote.value = undefined;
  shareTreeData.value = [];
};

// 确认分享
const handleConfirmShare = async () => {
  if (!currentShareNote.value) {
    layer.msg('请先选择要分享的笔记', { icon: 2 });
    return;
  }

  if (selectedUserIds.value.length === 0) {
    layer.msg('请至少选择一个用户进行分享', { icon: 2 });
    return;
  }

  try {
    const editorID = Number(currentShareNote.value.id);
    const ids = selectedUserIds.value.map((id) => Number(id));

    console.log('分享参数:', { editorID, ids });

    await workEditorApi.shareEditor(editorID, ids);

    // 显示成功提示
    layer.msg('分享成功！', { icon: 1 });

    // 关闭对话框
    handleCloseShareDialog();
  } catch (error) {
    console.error('分享失败:', error);
    layer.msg('分享失败，请重试', { icon: 2 });
  }
};

// 置顶笔记
const handlePin = async (note: ListItem) => {
  try {
    // 构建置顶后的ID顺序数组
    // 将当前笔记ID放在首位，其余笔记保持原有顺序
    const currentIds = noteList.value.map((item) => item.id);
    const otherIds = currentIds.filter((id) => id !== note.id);
    const newOrderIds = [note.id, ...otherIds];

    // 转换为字符串数组
    const idsArr: string[] = newOrderIds.map((id) => String(id));

    console.log('置顶笔记ID顺序:', idsArr);

    await workEditorApi.setTop(idsArr);

    // 显示成功提示
    layer.msg('置顶成功！', { icon: 1 });

    // 刷新列表
    await fetchNoteList();
  } catch (error) {
    console.error('置顶笔记失败:', error);
    layer.msg('置顶失败，请重试', { icon: 2 });
  }
};

// 删除笔记
const handleDelete = async (note: ListItem) => {
  // 显示确认对话框
  layer.confirm('确认删除该笔记吗？', {
    title: '确认删除',
    icon: 2, // 警告图标
    yes: async (index: number) => {
      // 先关闭确认框
      layer.close(index);

      try {
        // 调用删除接口
        const res = await workEditorApi.remove(note.id);

        // 更新笔记列表
        noteList.value = res.data || res;
        layer.msg('删除成功！', { icon: 1 });

        // 刷新列表
        await fetchNoteList();
      } catch (error) {
        console.error('删除笔记失败:', error);
        layer.msg('删除失败，请重试', { icon: 2 });
      }
    },
  });
};

// 新增纪要
const handleAddNote = () => {
  // 重置编辑器
  if (noteEditorRef.value) {
    noteEditorRef.value.resetEditor();
  }

  // 创建新的笔记表单数据
  noteForm.value = {
    title: '',
    content: '',
  } as ListItem;

  // 显示编辑框
  showEditor.value = true;
};

// 笔记栏全屏
const handleFullScreen = () => {
  if (!firstNote.value) {
    layer.msg('暂无笔记可全屏显示', { icon: 2 });
    return;
  }

  // 如果当前不在笔记栏模式，先切换到笔记栏模式
  if (activeTab.value !== 'pinned') {
    activeTab.value = 'pinned';

    // 等待DOM更新后再执行全屏
    nextTick(() => {
      executeFullscreen();
    });
  } else {
    executeFullscreen();
  }
};

// 执行全屏操作
const executeFullscreen = () => {
  const noteContainer = document.querySelector('.note-panel') as HTMLElement;
  if (noteContainer) {
    // 扩展类型定义以支持不同浏览器的全屏API
    interface FullscreenElement extends HTMLElement {
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    }

    const element = noteContainer as FullscreenElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }

    // 添加全屏样式
    noteContainer.classList.add('fullscreen-mode');

    // 监听全屏退出事件
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        noteContainer.classList.remove('fullscreen-mode');
        document.removeEventListener(
          'fullscreenchange',
          handleFullscreenChange,
        );
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
  } else {
    layer.msg('全屏功能暂时不可用，请稍后重试', { icon: 2 });
  }
};

onMounted(() => {
  fetchNoteList();
});
</script>

<style lang="scss" scoped>
.note-content {
  height: 100%;
  @include flex(column);
}

.custom-tabs {
  @include flex(row, flex-start, center);
  flex-shrink: 0;

  .tab-item {
    padding-bottom: 14px;
    margin-right: 24px;
    color: #1b1b1b;
    cursor: pointer;
    font-size: 16px;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;

    &.active {
      color: var(--global-primary-color);
      border-bottom-color: var(--global-primary-color);
    }
  }
}

.empty-wrapper {
  @include flex-center();
  height: 200px;
  color: #8c8c8c;
}

.note-list {
  @include flex(column);
  gap: 12px;
  padding-bottom: 24px;

  .note-item {
    @include flex(row, flex-start, center);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    }
  }
}

.note-avatar {
  @include flex-center();
  height: 100%;
  margin-right: 12px;
  flex-shrink: 0;

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    @include flex(row, center, center);
    background: var(--global-primary-color);
    color: white;
    font-size: 14px;
    font-weight: 500;
    border-radius: 50%;
  }
}

.note-main {
  flex: 1;
  min-width: 0;

  .note-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--global-primary-color);
    margin-bottom: 4px;
    @include text-ellipsis();
  }

  .note-author {
    font-size: 12px;
    color: #666;
    @include text-ellipsis();
  }
}

.note-actions {
  color: #b0b0b0;

  .action-btn {
    margin-left: 14px;
    width: 14px;
    height: 14px;

    &:hover {
      color: var(--global-primary-color);
    }
  }
}

// 编辑器框样式
.note-editor-dialog {
  padding: 24px;
  height: 350px;
  @include flex(column);
  gap: 20px;
}

.title-section,
.content-section {
  @include flex(column);
  gap: 8px;

  .section-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--global-primary-color);
  }
}

.title-section {
  flex-shrink: 0;

  :deep(.layui-input) {
    font-size: 14px;
    font-weight: 500;
    border: 1px solid #ddd;
    padding: 12px;
  }
}

.content-section {
  flex: 1;
  min-height: 0;

  .editor-container {
    height: 100%;
  }
}

.button-section {
  @include flex(row, flex-end, center);
  padding: 20px;
  gap: 12px;
}

// 共享抽屉样式
.share-content {
  padding: 20px;
  height: calc(100% - 60px); // 减去footer高度
  @include flex(column);
}

.empty-state {
  @include flex-center();
  height: 200px;
  color: #999;
  font-size: 14px;
}

.tree-wrapper {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 16px;
  background-color: #fafafa;
}

.drawer-footer {
  @include flex(row, flex-end, center);
  padding: 16px 20px;
  gap: 5px;
  border-top: 1px solid #e8e8e8;
  background-color: #fff;
  height: 60px;
}

// 笔记栏样式
.note-panel {
  @include flex(column);
  height: 100%;
  overflow-y: auto;
  position: relative;

  .note-panel-content {
    flex: 1;
    min-height: 0;
    padding: 10px;
    border: 1px solid #e8e8e8;
    background-color: #fff;

    .note-content-display {
      color: #333;
      min-height: 100px;

      // 处理富文本内容样式
      :deep(h1, h2, h3, h4, h5, h6) {
        margin: 16px 0 8px 0;
        color: var(--global-primary-color);
      }

      :deep(p) {
        margin: 8px 0;
      }

      // 标准列表样式
      :deep(ul, ol) {
        margin: 8px 0;
        padding-left: 24px;

        li {
          margin: 4px 0;
        }
      }

      // 无序列表
      :deep(ul li) {
        list-style-type: disc;
      }

      // 有序列表
      :deep(ol li) {
        list-style-type: decimal;
      }

      // Quill编辑器特定样式
      // 隐藏Quill的UI控制元素
      :deep(.ql-ui) {
        display: none !important;
      }

      // Quill无序列表
      :deep(li[data-list='bullet']) {
        display: list-item;
        list-style-type: disc;
        margin: 4px 0;
        padding-left: 8px;
        margin-left: 24px;
      }

      // Quill有序列表 - 使用CSS计数器重新编号
      :deep(.note-content-display) {
        counter-reset: ordered-list;
      }

      :deep(li[data-list='ordered']) {
        display: block;
        margin: 4px 0;
        padding-left: 24px;
        margin-left: 24px;
        counter-increment: ordered-list;
        position: relative;

        &::before {
          content: counter(ordered-list) '. ';
          position: absolute;
          left: -24px;
          font-weight: normal;
        }
      }

      // 处理斜体
      :deep(em) {
        font-style: italic;
      }

      // 处理粗体
      :deep(strong) {
        font-weight: bold;
      }

      // 处理下划线
      :deep(u) {
        text-decoration: underline;
      }

      // 处理背景色和文字颜色
      :deep([style*='background-color']) {
        padding: 2px 4px;
        border-radius: 2px;
      }

      :deep(blockquote) {
        margin: 16px 0;
        padding: 12px 16px;
        background-color: #f5f5f5;
        border-left: 4px solid var(--global-primary-color);
      }
    }
  }

  .note-panel-footer {
    flex-shrink: 0;
    text-align: end;
    border: 1px solid #e8e8e8;
    background-color: #f9f9f9;

    .word-count {
      font-size: 10px;
      color: #999;
    }
  }
}
</style>
