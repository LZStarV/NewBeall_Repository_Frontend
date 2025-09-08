<template>
  <div id="content-management-page" class="content-management-page">
    <!-- 顶部工具栏 -->
    <lay-card class="toolbar-card">
      <div class="toolbar">
        <lay-form
          layout="inline"
          :model="filterForm"
          class="toolbar-form"
          :pane="true"
          :label-width="80"
        >
          <lay-form-item class="form-item-tag">
            <template #label>标签</template>
            <lay-select
              v-model="filterForm.tagId"
              placeholder="请选择标签"
              class="tag-select"
              @change="handleTagChange"
            >
              <lay-select-option value="">全部标签</lay-select-option>
              <lay-select-option
                v-for="tag in tagList"
                :key="tag.id"
                :value="tag.id"
              >
                {{ tag.content }}
              </lay-select-option>
            </lay-select>
          </lay-form-item>

          <lay-form-item class="form-item-search">
            <template #label>方案名</template>
            <lay-input
              v-model="filterForm.insTitle"
              placeholder="请输入方案名称进行搜索"
              class="search-input"
              mode="block"
              @input="handleSearch"
            />
          </lay-form-item>

          <lay-form-item class="form-item-actions">
            <div class="action-buttons">
              <button title="刷新" @click="handleRefresh">
                <SvgIcon name="refresh" width="1.25rem" height="1.25rem" />
              </button>
              <button title="新增文案" @click="handleAddInstruction">
                <SvgIcon name="add_to" width="1.25rem" height="1.25rem" />
              </button>
              <button title="导出文案" @click="handleExportInstruction">
                <SvgIcon name="download" width="1.25rem" height="1.25rem" />
              </button>
            </div>
          </lay-form-item>
        </lay-form>
      </div>
    </lay-card>

    <!-- 底部文案展示区域 -->
    <lay-card title="文案列表" class="content-list-card">
      <div class="content-grid">
        <lay-row :space="16">
          <!-- 左侧列：奇数索引的文案 -->
          <lay-col :md="12" :sm="24" :xs="24" class="content-col">
            <div class="column-container">
              <InstructionCollapseItem
                v-for="instruction in leftColumnInstructions"
                :key="instruction.id"
                v-model:active-items="activeCollapseItems"
                :instruction="instruction"
                @edit="handleEditInstruction"
                @delete="handleDeleteInstruction"
                @image-preview="previewImage"
              />
            </div>
          </lay-col>

          <!-- 右侧列：偶数索引的文案 -->
          <lay-col :md="12" :sm="24" :xs="24" class="content-col">
            <div class="column-container">
              <InstructionCollapseItem
                v-for="instruction in rightColumnInstructions"
                :key="instruction.id"
                v-model:active-items="activeCollapseItems"
                :instruction="instruction"
                @edit="handleEditInstruction"
                @delete="handleDeleteInstruction"
                @image-preview="previewImage"
              />
            </div>
          </lay-col>
        </lay-row>
      </div>

      <!-- 空状态 -->
      <div v-if="instructionList.length === 0" class="empty-state">
        <lay-icon type="layui-icon-file" size="48" />
        <p>暂无文案数据</p>
        <lay-button type="primary" @click="handleAddInstruction">
          <lay-icon type="layui-icon-add-1" />
          新增文案
        </lay-button>
      </div>
    </lay-card>

    <!-- 编辑表单组件 -->
    <InstructionEditForm
      :visible="editWindowVisible"
      :editing-instruction="editingInstruction"
      @close="handleCloseEditWindow"
      @success="handleEditSuccess"
    />

    <!-- 导出文案对话框 -->
    <ExportInstructionDialog
      :visible="exportDialogVisible"
      :instruction-list="instructionList"
      @close="handleCloseExportDialog"
      @export="handleExportCatalog"
      @refresh="handleRefreshInstructionList"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import ordersApi from '@/api/orders/ordersApi';
import tagApi from '@/api/tag/tagApi';
import type { Instruction } from '@/api/orders/orderApi.type';
import type { TagType } from '@/types/tag';
import InstructionCollapseItem from './components/InstructionCollapseItem.vue';
import InstructionEditForm from './components/InstructionEditForm.vue';
import ExportInstructionDialog from './components/ExportInstructionDialog.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { layer } from '@layui/layui-vue';
import notify from '@/utils/notify';
import env from '@/utils/env';

// 响应式数据
const instructionList = ref<Instruction[]>([]);
const tagList = ref<TagType[]>([]);
const loading = ref(false);
const activeCollapseItems = ref<string[]>([]);
const editWindowVisible = ref(false);
const editingInstruction = ref<Instruction | null>(null);
const exportDialogVisible = ref(false);

// 筛选表单
const filterForm = reactive({
  tagId: '',
  insTitle: '',
});

// 防抖定时器
let searchTimer: NodeJS.Timeout | null = null;

// 计算属性：分离左右两列的文案
const leftColumnInstructions = computed(() => {
  return instructionList.value.filter((_, index) => index % 2 === 0);
});

const rightColumnInstructions = computed(() => {
  return instructionList.value.filter((_, index) => index % 2 === 1);
});

// 页面加载时获取数据
onMounted(() => {
  loadInstructionList();
  loadTagList();
});

// 加载文案列表
const loadInstructionList = async () => {
  try {
    loading.value = true;
    const response = (await ordersApi.getInstructionList(
      filterForm.insTitle,
      filterForm.tagId,
    )) as unknown as Instruction[];
    instructionList.value = response;
  } catch (error) {
    console.error('获取文案列表失败:', error);
    // 这里可以添加错误提示
  } finally {
    loading.value = false;
  }
};

// 加载标签列表
const loadTagList = async () => {
  try {
    const response = await tagApi.getTagList();
    tagList.value = response.data;
  } catch (error) {
    console.error('获取标签列表失败:', error);
  }
};

// 处理标签筛选变化
const handleTagChange = () => {
  loadInstructionList();
};

// 处理搜索输入 (防抖)
const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }

  searchTimer = setTimeout(() => {
    loadInstructionList();
  }, 500); // 500ms 防抖
};

// 刷新数据
const handleRefresh = () => {
  filterForm.tagId = '';
  filterForm.insTitle = '';
  // 折叠所有面板
  activeCollapseItems.value = [];
  loadInstructionList();
  loadTagList();
};

// 新增文案
const handleAddInstruction = () => {
  editingInstruction.value = null;
  editWindowVisible.value = true;
};

// 修改文案
const handleEditInstruction = (instruction: Instruction) => {
  editingInstruction.value = instruction;
  editWindowVisible.value = true;
};

// 删除文案
const handleDeleteInstruction = async (instruction: Instruction) => {
  try {
    // TODO: 添加确认对话框
    layer.confirm(`确定要删除文案"${instruction.insTitle}"吗？`, {
      btn: [
        {
          text: '确定',
          callback: async (id) => {
            await ordersApi.deleteInstruction(instruction.id);
            layer.close(id);
            loadInstructionList(); // 重新加载列表
            notify.success('删除文案成功');
          },
        },
        {
          text: '取消',
          callback: (id) => {
            layer.close(id);
          },
        },
      ],
    });
  } catch {
    notify.error('删除文案失败');
  }
};

// 导出文案
const handleExportInstruction = () => {
  exportDialogVisible.value = true;
};

// 图片预览
const previewImage = (img: string | { url: string }) => {
  // TODO: 实现图片预览功能
  const imageUrl = typeof img === 'string' ? img : img.url;
  layer.photos({
    imgList: [{ src: env.getBaseStaticUrl() + imageUrl, alt: '产品图片' }],
  });
};

// 编辑窗口关闭回调
const handleCloseEditWindow = () => {
  editWindowVisible.value = false;
  editingInstruction.value = null;
};

// 编辑成功回调
const handleEditSuccess = async () => {
  await loadInstructionList();
};

// 关闭导出对话框
const handleCloseExportDialog = () => {
  exportDialogVisible.value = false;
};

// 刷新文案列表（用于自定义文案提交后）
const handleRefreshInstructionList = () => {
  loadInstructionList();
};

// 目录项类型接口
interface CatalogItem {
  id: string;
  number: string;
  title: string;
  level: number;
  instructionId: string | number;
}

// 处理导出目录
const handleExportCatalog = (catalogData: CatalogItem[]) => {
  // TODO: 这里可以调用实际的导出API
  console.log('导出目录数据:', catalogData);

  // 将目录数据转换为符合 ExportProductDetailed 格式的数据
  const exportData = {
    projectName: `文案导出_${new Date().toLocaleDateString()}`,
    insIds: catalogData.map((item) => item.instructionId),
    titlesWithNumbers: catalogData.map((item) => ({
      id: item.id,
      level: item.level.toString(),
      number: item.number,
      title: item.title,
    })),
  };

  console.log('格式化后的导出数据:', exportData);
  notify.success('导出配置已生成，可在此基础上实现具体的导出逻辑');
};
</script>

<style lang="scss" scoped>
.content-management-page {
  position: relative;
  min-height: 100%;

  .toolbar-card {
    margin-bottom: 16px;

    .toolbar {
      .toolbar-form {
        display: flex;
        align-items: center;
        gap: 16px;

        .form-item-tag,
        .form-item-search,
        .form-item-actions {
          margin-bottom: 0;
        }

        .form-item-actions :deep(.layui-input-block) {
          display: flex;
          align-items: center;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;

          .lay-icon {
            font-size: 16px;
            color: #1890ff;
          }
        }

        .tag-select {
          width: 180px;
        }

        .search-input {
          width: 250px;
        }

        .action-buttons {
          display: flex;
          gap: 16px;
          align-items: center;

          button {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: transparent;
            border: none;
            color: $text-regular;

            &:hover {
              color: $primary-color;
            }
          }
        }
      }
    }
  }

  .content-list-card {
    min-height: 60vh;

    .content-grid {
      .content-col {
        .column-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;

      .lay-icon {
        color: #ccc;
        margin-bottom: 16px;
      }

      p {
        margin: 0 0 20px 0;
        font-size: 16px;
      }
    }
  }
}

// 响应式样式
@media (max-width: $desktop_layout_breakpoint) {
  .content-management-page {
    padding: 8px;

    .toolbar-card {
      .toolbar {
        .toolbar-form {
          .tag-select {
            width: 120px;
          }
          .search-input {
            width: 100%;
          }
        }
      }
    }
  }
}

@media (max-width: $pad_layout_breakpoint) {
  .content-management-page {
    padding: 8px;

    .toolbar-card {
      .toolbar {
        .toolbar-form {
          flex-direction: column;
          align-items: stretch;
          flex-wrap: wrap;
          gap: 12px;

          .form-item-tag,
          .form-item-search {
            width: 100%;
            align-self: stretch;
          }

          .form-item-actions {
            max-width: 8rem;
          }

          .tag-select,
          .search-input {
            width: 100%;
          }

          :deep(.layui-select) .action-buttons {
            justify-content: center;
          }

          .form-label {
            margin-bottom: 6px;
          }
        }
      }
    }

    .content-list-card {
      .content-grid {
        .content-col {
          .column-container {
            gap: 8px;
          }
        }
      }
    }
  }
}
</style>
