<template>
  <div class="order-list-component">
    <SearchPanel
      api-name="ordersNotice"
      :view-name="viewName"
      :page-size="pagination.pageSize"
      v-model:selected-keys="selectedKeys"
      @search-result="handleSearchResult"
      @loading-change="handleLoadingChange"
      ref="searchPanelRef"
    />

    <!-- 底部列表区域 -->
    <lay-card class="content-list-card">
      <lay-table
        ref="tableRef1"
        :columns="columns"
        :data-source="dataSource"
        :default-toolbar="defaultToolbars"
        :loading="loading"
        :pagination="pagination"
        even
        @sort-change="sortChange"
        @page-change="handlePageChange"
        @row-click="handleRowClick"
        @checkbox-click="handleCheckboxClick"
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

        <!-- 项目名称列自定义插槽 -->
        <template #companyName="{ row }">
          <span
            class="project-name-link"
            :title="row.companyName"
            @click="showDetailModal(row)"
          >
            {{ row.companyName }}
          </span>
        </template>

        <!-- 订单状态列自定义插槽 -->
        <template #typeName="{ row }">
          <span
            :class="`${row.typeName === '已处理' ? 'status-finished' : 'status-unfinished'}`"
          >
            {{ row.typeName }}
          </span>
        </template>

        <!-- 操作列自定义插槽 -->
        <template #operation="{ row }">
          <lay-button size="xs" type="primary" @click="showDetailModal(row)">
            查看
          </lay-button>
        </template>
      </lay-table>
      <div class="page-info">
        <span>
          显示第
          {{ (pagination.current - 1) * pagination.pageSize + 1 }}
          到第
          {{
            Math.min(pagination.current * pagination.pageSize, pagination.total)
          }}
          条记录，总共 {{ pagination.total }} 条记录
        </span>
      </div>
    </lay-card>

    <!-- 详细信息弹窗 -->
    <ModalWindow
      :visible="detailModalVisible"
      :is-teleport="true"
      title="订单详情"
      @close="detailModalVisible = false"
    >
      <div v-if="selectedOrderId" class="order-detail">
        <!-- 这里可以根据实际需求添加订单详情组件 -->
        <p>订单ID: {{ selectedOrderId }}</p>
        <p>项目名称: {{ selectedOrder?.projectName }}</p>
        <p>发送公司: {{ selectedOrder?.companyName }}</p>
        <p>发布者: {{ selectedOrder?.uname }}</p>
        <p>联系方式: {{ selectedOrder?.phone }}</p>
        <p>通知时间: {{ selectedOrder?.createtime }}</p>
        <p>订单状态: {{ selectedOrder?.typeName }}</p>
      </div>
      <div v-else>
        <lay-empty />
      </div>
    </ModalWindow>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import SearchPanel from '@/pages/order/components/SearchPanel.vue';
import type {
  OrdersNoticeRow,
  OrdersNoticeListResponse,
} from '@/api/orders/ordersNotice.type';
import type {
  TableColumn,
  TableDefaultToolbar,
} from '@layui/layui-vue/types/component/table/typing';
import ModalWindow from '@/components/ModalWindow.vue';
import ordersNoticeApi from '@/api/orders/ordersNotice';
import notify from '@/utils/notify';
import { layer } from '@layui/layui-vue';

// 定义组件属性
defineProps({
  viewName: {
    type: String,
    required: true,
    validator: (value: string) => ['receive', 'send'].includes(value),
  },
});

// 搜索面板引用
const searchPanelRef = ref();

// 表格数据
const dataSource = ref<OrdersNoticeRow[]>([]);
const loading = ref<boolean>(false);

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});

// 详情弹窗相关状态
const detailModalVisible = ref<boolean>(false);
const selectedOrderId = ref<string>('');
const selectedOrder = ref<OrdersNoticeRow | null>(null);

// 选中行id
const selectedKeys = ref([]);

// 选中行
const selectedRow = ref<OrdersNoticeRow | null>(null);

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
  {
    title: '发送公司',
    width: '180px',
    key: 'companyName',
    ellipsisTooltip: true,
    customSlot: 'companyName',
    sort: true,
  },
  {
    title: '发布者',
    width: '120px',
    key: 'uname',
    ellipsisTooltip: true,
  },
  {
    title: '联系方式',
    width: '150px',
    key: 'phone',
    ellipsisTooltip: true,
  },
  {
    title: '订单编号',
    width: '180px',
    key: 'orderid',
    ellipsisTooltip: true,
    hide: true,
  },
  {
    title: '项目名称',
    width: '200px',
    key: 'projectName',
    ellipsisTooltip: true,
  },
  {
    title: '通知时间',
    width: '150px',
    key: 'createtime',
    sort: true,
  },
  {
    title: '订单状态',
    width: '120px',
    key: 'typeName',
    ellipsisTooltip: true,
    customSlot: 'typeName',
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
const handleSearchResult = (result: OrdersNoticeListResponse) => {
  dataSource.value = result.rows;
  pagination.total = result.total;
};

// 处理加载状态变化
const handleLoadingChange = (isLoading: boolean) => {
  loading.value = isLoading;
};

// 显示详情弹窗
const showDetailModal = (row: OrdersNoticeRow) => {
  selectedOrderId.value = row.orderid;
  selectedOrder.value = row;
  detailModalVisible.value = true;
};

// 处理分页变化
const handlePageChange = (page: number) => {
  pagination.current = page;
  if (searchPanelRef.value) {
    searchPanelRef.value.setPage(page);
  }
};

// 排序
const sortChange = (key: string, sort: string) => {
  if (!dataSource.value) return;

  dataSource.value.sort((a: OrdersNoticeRow, b: OrdersNoticeRow) => {
    if (sort === 'asc') {
      switch (key) {
        case 'createtime':
          return (
            new Date(a.createtime).getTime() - new Date(b.createtime).getTime()
          );
        default:
          return a[key as keyof OrdersNoticeRow] >
            b[key as keyof OrdersNoticeRow]
            ? 1
            : -1;
      }
    } else {
      switch (key) {
        case 'createtime':
          return (
            new Date(b.createtime).getTime() - new Date(a.createtime).getTime()
          );
        default:
          return a[key as keyof OrdersNoticeRow] >
            b[key as keyof OrdersNoticeRow]
            ? -1
            : 1;
      }
    }
  });
};

const tableRef1 = ref();

// 处理行点击事件
const handleRowClick = (row: OrdersNoticeRow) => {
  selectedRow.value = row;
};

// 处理复选框点击事件
const handleCheckboxClick = (row: OrdersNoticeRow, checked: boolean) => {
  selectedRow.value = checked ? row : null;
};

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
    yes: (index: number) => {
      // 用户点击确认后执行删除
      handleDeleteConfirm(selectedRows);
      // 关闭确认对话框
      layer.close(index);
    },
  });
};

// 删除确认处理
const handleDeleteConfirm = async (selectedRows: OrdersNoticeRow[]) => {
  const noticeIds: number[] = [];

  selectedRows.forEach((row) => {
    noticeIds.push(row.id);
  });

  try {
    // 调用删除API
    await ordersNoticeApi.deleteNotice(String(noticeIds));

    // 操作成功提示
    notify.success('删除操作已完成');

    // 刷新当前页面数据
    if (searchPanelRef.value) {
      searchPanelRef.value.handleRefresh();
    }
  } catch (error) {
    console.error('删除通知失败:', error);
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
.order-list-component {
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

    .project-name-link {
      color: $primary-color;
      cursor: pointer;
      text-decoration: none;
    }

    .status-finished {
      color: $primary-color;
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

  .order-detail {
    padding: 16px;

    p {
      margin-bottom: 8px;
      line-height: 1.5;
    }
  }
}
</style>
