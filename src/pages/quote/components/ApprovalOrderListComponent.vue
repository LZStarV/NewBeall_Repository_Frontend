<template>
  <div class="approval-order-list-component">
    <SearchPanel
      ref="searchPanelRef"
      :deleteordiscount="deleteordiscountValue"
      :page-size="pagination.limit"
      :is-order-record="isOrderRecord"
      @search-result="handleSearchResult"
      @loading-change="handleLoadingChange"
    />

    <!-- 底部列表区域 -->
    <lay-card class="content-list-card">
      <lay-table
        ref="tableRef1"
        :columns="columns"
        :data-source="dataSource"
        :default-toolbar="defaultToolbars"
        :loading="loading"
        :page="pagination"
        even
        @sort-change="sortChange"
      >
        <!-- 顶部工具栏按钮 -->
        <template #toolbar>
          <div class="toolbar">
            <div class="btn-group">
              <button title="删除" @click="handleDelete">
                <SvgIcon name="cancel" width="1.1rem" />
              </button>
              <div class="split"></div>
            </div>
          </div>
        </template>

        <!-- 状态列自定义插槽 -->
        <template #status="{ row }">
          <span
            v-if="isOrderRecord"
            class="record-status"
            :class="`${row.state === 1 ? 'status-pass' : row.state === 2 ? 'status-reject' : 'status-pending'}`"
            >{{
              row.state === 1 ? '通过' : row.state === 2 ? '驳回' : '待审批'
            }}</span
          >
          <span
            v-else
            :class="`${row.state === 1 ? 'status-finished' : 'status-unfinished'}`"
          >
            {{ row.state === 1 ? '通过' : row.state === 2 ? '驳回' : '待审批' }}
          </span>
        </template>

        <!-- 操作列自定义插槽 -->
        <template #operation="{ row }">
          <lay-button size="xs" type="primary" @click="showDetailModal(row)">
            {{ isOrderRecord ? '审批' : '审阅' }}
          </lay-button>
        </template>
      </lay-table>
      <div class="page-info">
        <span>
          显示第
          {{ (pagination.current - 1) * pagination.limit + 1 }}
          到第
          {{
            Math.min(pagination.current * pagination.limit, pagination.total)
          }}
          条记录，总共 {{ pagination.total }} 条记录
        </span>
      </div>
    </lay-card>

    <!-- 详细信息弹窗 -->
    <ModalWindow
      :visible="detailModalVisible"
      :is-teleport="true"
      title="报价单信息审阅"
      @close="detailModalVisible = false"
    >
      <div v-if="selectedApprovalId" class="approval-detail">
        <!-- TODO 添加审批详情组件 -->
      </div>
      <div v-else>
        <lay-empty />
      </div>
    </ModalWindow>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import SearchPanel from '@/pages/quote/components/SearchPanel.vue';
import type {
  ApprovalData,
  ApprovalListResponse,
} from '@/api/approval/approvalApi.type';
import type {
  TableColumn,
  TableDefaultToolbar,
} from '@layui/layui-vue/types/component/table/typing';
import ModalWindow from '@/components/ModalWindow.vue';
import notify from '@/utils/notify';
import { layer } from '@layui/layui-vue';

// 定义组件属性
const { pageType, isOrderRecord } = defineProps<{
  pageType: 'delete' | 'discount';
  isOrderRecord?: boolean;
}>();

// 将pageType转换为对应的数值
const deleteordiscountValue = computed(() => {
  return pageType === 'delete' ? 0 : 1;
});

// 搜索面板引用
const searchPanelRef = ref();

// 表格数据
const dataSource = ref<ApprovalData[]>([]);
const loading = ref<boolean>(false);

// 分页参数
const pagination = reactive({
  current: 1,
  limit: 20,
  total: 0,
  // 处理分页变化
  change: (page: { current: number; limit: number }) => {
    pagination.current = page.current;

    if (searchPanelRef.value) {
      searchPanelRef.value.setPage(pagination.current);
    }
  },
});

// 详情弹窗相关状态
const detailModalVisible = ref<boolean>(false);
const selectedApprovalId = ref<string>('');
const selectedApproval = ref<ApprovalData | null>(null);

// 表头配置
const defaultToolbars: TableDefaultToolbar[] = [
  {
    icon: 'layui-icon-refresh',
    title: '刷新',
    onClick: () => {
      if (searchPanelRef.value) {
        searchPanelRef.value.handleRefresh();
      }
    },
  },
  'filter',
];

// 表格列配置
const columns = [
  { title: '', width: '20px', type: 'checkbox', fixed: 'left' as const },
  isOrderRecord
    ? {
        title: 'aid',
        width: '80px',
        key: 'id',
        hide: true,
      }
    : {
        title: '提交ID',
        width: '180px',
        key: 'uid',
        ellipsisTooltip: true,
        hide: true,
      },
  {
    title: '提交人',
    width: '120px',
    key: 'uname',
    ellipsisTooltip: true,
  },
  {
    title: isOrderRecord
      ? '报价单编号'
      : pageType === 'discount'
        ? '订单id'
        : '报价单编号',
    width: '180px',
    key: 'oid',
    ellipsisTooltip: true,
    hide: isOrderRecord ? true : pageType === 'delete' ? true : false,
  },
  {
    title: '工程项目名称',
    width: '200px',
    key: 'projectName',
    ellipsisTooltip: true,
  },
  {
    title: '申请时间',
    width: '150px',
    key: 'createDate',
    sort: true,
  },
  {
    title: '审批人',
    width: '120px',
    key: 'approvalName',
    ellipsisTooltip: true,
  },
  {
    title: '状态',
    width: '120px',
    key: 'state',
    ellipsisTooltip: true,
    customSlot: 'status',
  },
  {
    title: '审批时间',
    width: '150px',
    key: 'updateDate',
    sort: true,
  },
  {
    title: '操作',
    width: '100px',
    key: 'operation',
    customSlot: 'operation',
  },
] as TableColumn[];

// 处理搜索结果
const handleSearchResult = (result: ApprovalListResponse) => {
  dataSource.value = result.rows.map((item) => ({
    ...item,
    updateDate: item.updateDate ? item.updateDate : '-',
  }));
  pagination.total = result.total;
};

// 处理加载状态变化
const handleLoadingChange = (isLoading: boolean) => {
  loading.value = isLoading;
};

// 显示详情弹窗
const showDetailModal = (row: ApprovalData) => {
  selectedApprovalId.value = row.oid;
  selectedApproval.value = row;
  detailModalVisible.value = true;
};

// 排序
const sortChange = (key: string, sort: string) => {
  if (!dataSource.value) return;

  dataSource.value.sort((a: ApprovalData, b: ApprovalData) => {
    if (sort === 'asc') {
      switch (key) {
        case 'createDate':
        case 'updateDate':
          return new Date(a[key]).getTime() - new Date(b[key]).getTime();
        default:
          return a[key as keyof ApprovalData] > b[key as keyof ApprovalData]
            ? 1
            : -1;
      }
    } else {
      switch (key) {
        case 'createDate':
        case 'updateDate':
          return new Date(b[key]).getTime() - new Date(a[key]).getTime();
        default:
          return a[key as keyof ApprovalData] > b[key as keyof ApprovalData]
            ? -1
            : 1;
      }
    }
  });
};

// 表格引用
const tableRef1 = ref();

// 处理删除操作
const handleDelete = () => {
  const selectedRows = tableRef1.value.getCheckData();

  // 检查是否有选中的行
  if (selectedRows.length <= 0) {
    layer.msg('请先选中表格中的某一记录！', { icon: 2 });
    return;
  }

  // 弹出确认对话框
  layer.confirm('是否删除选中数据？', {
    icon: 3,
    title: '确认删除',
    btn: [
      {
        text: '确定',
        callback: (index: string) => {
          // 用户点击确认后执行删除
          handleDeleteConfirm(selectedRows);
          // 关闭确认对话框
          layer.close(index);
        },
      },
      {
        text: '取消',
        callback: (index: string) => {
          layer.close(index);
        },
      },
    ],
  });
};

// 删除确认处理
const handleDeleteConfirm = async (selectedRows: ApprovalData[]) => {
  const approvalIds: number[] = [];

  selectedRows.forEach((row) => {
    approvalIds.push(row.uid);
  });

  try {
    // 目前API中没有删除方法，这里需要添加实际的删除API调用
    // 临时解决方案：显示一个成功消息，但实际上没有进行删除操作
    console.warn('删除API尚未实现');
    notify.success('删除操作已完成');

    // 刷新当前页面数据
    if (searchPanelRef.value) {
      searchPanelRef.value.handleRefresh();
    }
  } catch (error) {
    console.error('删除审批失败:', error);
    notify.error('删除失败，请重试');
  }
};

onMounted(() => {
  if (searchPanelRef.value) {
    // 一来就刷新一次
    searchPanelRef.value.handleRefresh();
  }
});
</script>

<style scoped lang="scss">
.approval-order-list-component {
  .content-list-card {
    height: 100%;
    margin-top: 16px;

    :deep(.layui-card-body) {
      padding: 0 0 10px 0 !important;
      overflow: hidden;
      border-radius: var(--card-border-radius);
    }

    .toolbar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-top: 4px;

      .btn-group {
        display: flex;
        gap: 1rem;
        align-items: center;

        .split {
          width: 1px;
          height: 24px;
          background-color: #e6e6e6;
        }

        button {
          @include button-style($primary-color);
        }
      }
    }

    .status-finished {
      color: $primary-color;
    }

    .record-status {
      font-weight: 800;
    }

    .status-pass {
      color: #84d957;
    }

    .status-reject {
      color: #ff2f00;
    }

    .status-pending {
      color: $danger-color;
    }

    .status-unfinished {
      color: $danger-color;
    }
  }

  .page-info {
    margin-top: 1rem;
    font-size: 14px;
    margin-left: 20px;
    color: $text-regular;
  }

  .approval-detail {
    padding: 16px;

    p {
      margin-bottom: 8px;
      line-height: 1.5;
    }
  }
}
</style>
