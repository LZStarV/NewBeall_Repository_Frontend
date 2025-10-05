<template>
  <div class="order-list-component">
    <SearchPanel :api-name="isInquiryList ? 'inquery' : 'ordersNotice'" :view-name="viewName"
      :page-size="pagination.limit" @search-result="handleSearchResult" @loading-change="handleLoadingChange"
      ref="searchPanelRef" />

    <!-- 底部列表区域 -->
    <lay-card class="content-list-card">
      <lay-table ref="tableRef1" :columns="columns" :data-source="dataSource" :default-toolbar="defaultToolbars"
        :loading="loading" :page="pagination" even @sort-change="sortChange">
        <!-- 顶部工具栏按钮 -->
        <template #toolbar>
          <div class="toolbar" :class="{ 'toolbar-inquiry': isInquiryList }">
            <div v-if="isInquiryList" class="toolbar-inquiry-btns">
              <lay-button type="normal" size="sm" @click="handleMarkAllRead">全部已读</lay-button>
              <lay-button size="sm" @click="handleMarkSelectedRead">选中已读</lay-button>
            </div>
            <div class="btn-group">
              <div v-if="isInquiryList" style="display: flex; gap: 1rem">
                <button title="对比" @click="">
                  <SvgIcon name="money" width="1.1rem" />
                </button>
                <button title="分享" @click="handleShare">
                  <SvgIcon name="share" width="1.1rem" />
                </button>
              </div>
              <button title="删除" @click="handleDelete">
                <SvgIcon name="cancel" width="1.1rem" />
              </button>
              <div class="split"></div>
            </div>
          </div>
        </template>

        <!-- 项目名称列自定义插槽 -->
        <template #companyName="{ row }">
          <div class="company-name">
            <SvgIcon :name="row.cgnoticetype === 0 ? 'mail_warning' : 'mail_open'" color="#333" />
            <span class="name-link" :title="row.companyName" @click="showDetailModal(row)">
              {{ row.companyName }}
            </span>
          </div>
        </template>

        <!-- 订单状态列自定义插槽 -->
        <template #typeName="{ row }">
          <span :class="`${row.typeName === '已处理' ? 'status-finished' : 'status-unfinished'}`">
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
    <ModalWindow :visible="detailModalVisible" :is-teleport="true" title="订单详情" @close="detailModalVisible = false">
      <div v-if="selectedOrder">
        <InqueryOrderDetail v-if="isInquiryList" :row="selectedOrder" :view-name="props.viewName"
          :is-unhandled="selectedOrder.typeName === '未处理'" @close="handleRefreshClose" />
        <OrderDetail v-else :row="selectedOrder" :view-name="props.viewName" />
      </div>
      <div v-else>
        <lay-empty />
      </div>
    </ModalWindow>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, h } from 'vue';
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
import inqueryApi from '@/api/inquery/inqueryApi';
import clientApi from '@/api/client/clinetApi';
import Tree from '@/components/Tree.vue';
import type { UserTreeType } from '@/api/client/clinetApi.type';
import OrderDetail from '@/pages/order/components/OrderDetail.vue';
import InqueryOrderDetail from '@/pages/order/components/InqueryOrderDetail.vue';

// 定义组件属性
const props = defineProps({
  viewName: {
    type: String,
    required: true,
    validator: (value: string) => ['receive', 'send'].includes(value),
  },
  isInquiryList: {
    type: Boolean,
    default: false,
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
const selectedOrderId = ref<string>('');
const selectedOrder = ref<OrdersNoticeRow | null>(null);

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
    title: props.viewName === 'receive' ? '发送公司' : '接收公司',
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

// 处理弹窗关闭事件，刷新搜索结果
const handleRefreshClose = () => {
  // 关闭详情弹窗
  detailModalVisible.value = false;
  if (searchPanelRef.value) {
    searchPanelRef.value.handleRefresh();
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

// 表格引用
const tableRef1 = ref();

// 用户树相关状态
const userTreeData = ref<UserTreeType[]>([]);
const expandedKeys = ref<string[]>([]);
const selectedUserIds = ref<number[]>([]);

// 处理分享操作
const handleShare = async () => {
  const selectedRows = tableRef1.value.getCheckData();

  // 检查是否有选中的行
  if (selectedRows.length <= 0) {
    layer.msg('请先选中表格中的某一记录！', { icon: 2 });
    return;
  }

  try {
    // 获取用户树数据
    const userTreeResponse =
      (await clientApi.userTree()) as unknown as UserTreeType[];
    userTreeData.value = userTreeResponse;

    // 设置默认展开的节点
    expandedKeys.value = userTreeData.value
      .filter((item) => item.open)
      .map((item) => item.id.toString());

    // 清空之前的选择
    selectedUserIds.value = [];

    // 显示分享抽屉
    layer.drawer({
      title: '选择分享用户',
      content: h(Tree, {
        data: transformedUserTreeDataForTree.value,
        multiple: true,
        showCheckbox: true,
        checkStrictly: false,
        onSelect: handleShareTreeSelect,
      }),
      btn: [
        {
          text: '确定',
          callback() {
            handleShareConfirm(selectedRows);
          },
        },
        {
          text: '取消',
          callback(idx) {
            layer.close(idx);
            selectedUserIds.value = [];
          },
        },
      ],
    });
  } catch (error) {
    console.error('分享操作失败:', error);
    layer.msg('分享操作失败，请重试', { icon: 2 });
  }
};

/**
 * 处理分享树组件的选择事件
 */
const handleShareTreeSelect = (
  selected: string | number | (string | number)[],
) => {
  if (Array.isArray(selected)) {
    selectedUserIds.value = selected.map((id) => Number(id));
  } else {
    selectedUserIds.value = [Number(selected)];
  }
};

/**
 * 转换用户树数据格式，用于Tree组件
 */
const transformedUserTreeDataForTree = computed(() => {
  // 将层级数据转换为扁平化数据
  const flattenData: any[] = [];

  const flatten = (items: UserTreeType[]) => {
    items.forEach((item) => {
      if (item.id === '0') {
        item.pId = '-1'; // 对总公司做特殊处理
      }
      flattenData.push({
        id: item.id,
        parentId: item.pId === '-1' ? null : item.pId,
        name: item.name,
        icon: item.isUser === 'true' ? 'user' : 'folder',
        showCheckbox: !item.nocheck, // 根据nocheck属性控制checkbox显示
        disabled: item.chkDisabled.toString() === 'true', // 根据chkDisabled属性控制是否禁用
        selected: item.checked && item.isUser === 'true', // 只有用户节点可被选中
        expanded: item.open, // 根据open属性控制默认展开状态
      });
    });
  };

  flatten(userTreeData.value);
  return flattenData;
});

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
const handleDeleteConfirm = async (selectedRows: OrdersNoticeRow[]) => {
  const noticeIds: number[] = [];

  selectedRows.forEach((row) => {
    noticeIds.push(row.id);
  });

  try {
    // 调用删除API
    if (props.isInquiryList) {
      await inqueryApi.deleteInquiry(noticeIds);
    } else {
      await ordersNoticeApi.deleteNotice(String(noticeIds));
    }

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
// 处理全部已读
const handleMarkAllRead = async () => {
  try {
    // 调用标记已读API，type=2表示全部已读，ids传空数组
    await inqueryApi.markRead(props.viewName, [], 2);

    // 操作成功提示
    notify.success('已将全部消息标记为已读');

    // 刷新当前页面数据
    if (searchPanelRef.value) {
      searchPanelRef.value.handleRefresh();
    }
  } catch (error) {
    console.error('标记已读失败:', error);
    notify.error('标记已读失败，请重试');
  }
};

// 处理选中已读
const handleMarkSelectedRead = () => {
  const selectedRows = tableRef1.value.getCheckData();

  // 检查是否有选中的行
  if (selectedRows.length <= 0) {
    layer.msg('请先选中表格中的某一记录！', { icon: 2 });
    return;
  }

  // 执行标记已读操作
  handleMarkSelectedReadConfirm(selectedRows);
};

// 选中已读确认处理
const handleMarkSelectedReadConfirm = async (
  selectedRows: OrdersNoticeRow[],
) => {
  const noticeIds: number[] = [];

  selectedRows.forEach((row) => {
    noticeIds.push(row.id);
  });

  try {
    // 调用标记已读API，type=1表示标记选定数据
    await inqueryApi.markRead(props.viewName, noticeIds, 1);

    // 操作成功提示
    notify.success('已将选中消息标记为已读');

    // 刷新当前页面数据
    if (searchPanelRef.value) {
      searchPanelRef.value.handleRefresh();
    }
  } catch (error) {
    console.error('标记已读失败:', error);
    notify.error('标记已读失败，请重试');
  }
};
/**
 * 确认分享操作
 */
const handleShareConfirm = async (selectedRows: OrdersNoticeRow[]) => {
  if (selectedUserIds.value.length === 0) {
    layer.msg('请选择要分享的用户', { icon: 2 });
    return;
  }

  try {
    // 获取用户树中isUser为'true'的节点ID列表
    const userNodeIds = userTreeData.value
      .filter((item) => item.isUser === 'true')
      .map((item) => Number(item.id));

    // 再次过滤selectedUserIds，确保只包含用户节点ID
    const filteredUserIds = selectedUserIds.value.filter((id) =>
      userNodeIds.includes(id),
    );

    if (filteredUserIds.length === 0) {
      layer.msg('请选择有效的用户进行分享', { icon: 2 });
      return;
    }

    // 获取选中的询价单ID列表
    const inqueryIdList: number[] = [];
    selectedRows.forEach((row) => {
      inqueryIdList.push(row.id);
    });
    // 调用分享API
    await inqueryApi.setInqueryShare({
      inqueryIdList,
      userIdList: filteredUserIds, // 使用过滤后的用户ID列表
    });
    // 关闭抽屉
    layer.closeAll();
    // 清空选择
    selectedUserIds.value = [];
    // 成功提示
    notify.success('分享成功');
    // 刷新当前页面数据
    if (searchPanelRef.value) {
      searchPanelRef.value.handleRefresh();
    }
  } catch (error) {
    console.error('分享失败:', error);
    layer.msg('分享失败，请重试', { icon: 2 });
  }
};
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

      &-inquiry {
        justify-content: space-between;

        .toolbar-inquiry-btns {
          display: flex;
          gap: 1rem;
        }
      }

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

    .company-name {
      display: flex;
      width: 100%;
      gap: 0.5rem;
      justify-content: space-between;

      .name-link {
        color: $primary-color;
        cursor: pointer;
        text-decoration: none;
      }
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
