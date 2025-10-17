<template>
  <div class="history-quote-page">
    <!-- 顶部工具栏 -->
    <lay-card class="toolbar-card">
      <lay-form layout="inline" :pane="true" :label-width="80" class="toolbar-form-items">
        <lay-form-item class="form-item-search">
          <template #label>
            <lay-select v-model="typeFilter">
              <lay-select-option value="projectName">
                工程项目名
              </lay-select-option>
              <lay-select-option value="contacts">客户单位</lay-select-option>
              <lay-select-option value="orderstype">
                报价类型
              </lay-select-option>
            </lay-select>
          </template>
          <lay-input v-model="quotationNameSearch" placeholder="请输入方案名称进行搜索" class="search-input" mode="block" />
        </lay-form-item>

        <lay-form-item label="属性">
          <lay-select v-model="attribute" placeholder="请输入">
            <lay-select-option value="">全部</lay-select-option>
            <lay-select-option v-for="attr in orderAttributeList" :key="attr.id" :value="attr.id">
              {{ attr.name }}
            </lay-select-option>
          </lay-select>
        </lay-form-item>

        <lay-form-item label="负责人">
          <lay-select v-model="chargePerson" placeholder="请选择">
            <lay-select-option value="">全部</lay-select-option>
            <lay-select-option v-for="item in ordersChargePersonList" :key="item.id" :value="String(item.id)">
              {{ item.name }}
            </lay-select-option>
          </lay-select>
        </lay-form-item>

        <lay-form-item label="制单人">
          <lay-select v-model="createUser" placeholder="请选择">
            <lay-select-option value="">全部</lay-select-option>
            <lay-select-option v-for="item in ordersCreateUserList" :key="item" :value="item">
              {{ item }}
            </lay-select-option>
          </lay-select>
        </lay-form-item>

        <lay-form-item label="制单日期">
          <lay-date-picker v-model="createDate" placeholder="click me" allow-clear />
        </lay-form-item>

        <div class="toolbar-btns">
          <button title="搜索" @click="handleSearch">
            <SvgIcon name="search" width="1.1rem" />
          </button>
          <button title="刷新" @click="handleRefresh">
            <SvgIcon name="refresh" width="1.2rem" />
          </button>
        </div>
      </lay-form>
    </lay-card>

    <!-- 底部列表区域 -->
    <lay-card class="content-list-card">
      <lay-table :columns="columns" :data-source="dataSource" :default-toolbar="defaultToolbars" :loading="loading"
        :pagination="pagination" v-model:selectedKey="selectedKey" even @pagination="handlePagination"
        @sort-change="sortChange">
        <template #toolbar>
          <div class="toolbar">
            <lay-tab v-model="current2" type="brief" @change="handleTabChange">
              <lay-tab-item v-for="item in tabItem" :id="item.title" :key="item.title" :title="item.title"
                :icon="item.iconRenderFunction" />
            </lay-tab>

            <div class="btn-group">
              <button title="显示价格" @click="handleShowPrice">
                <SvgIcon name="money" width="1.1rem" />
              </button>
              <button title="修改" @click="handleEdit">
                <SvgIcon name="edit" width="1.1rem" />
              </button>
              <button title="复制" @click="handleCopy">
                <SvgIcon name="copy" width="1.1rem" />
              </button>
              <button title="导出" @click="handleExport">
                <SvgIcon name="export" width="1.1rem" />
              </button>
              <button title="导入" @click="handleImport">
                <SvgIcon name="download" width="1.1rem" />
              </button>
              <button title="删除" @click="handleDelete">
                <SvgIcon name="cancel" width="1.1rem" />
              </button>
              <button title="属性" @click="handleProperty">
                <SvgIcon name="company_information" width="1.1rem" />
              </button>
              <button title="发送" @click="handleSend">
                <SvgIcon name="order_send_order" width="1.1rem" />
              </button>
              <button title="协作" @click="handleCollaborate">
                <SvgIcon name="supply_chain" width="1.1rem" />
              </button>
              <div class="split"></div>
            </div>
          </div>
        </template>

        <!-- 工程项目名称列自定义渲染 -->
        <template #projectName="{ row }">
          <span class="project-name-link" :title="row.projectName" @click="showDetailModal(row)">
            {{ row.projectName }}
          </span>
        </template>
        <!-- 客户单位列自定义渲染 -->
        <template #contacts="{ row }">
          <span class="project-name-link" :title="row.contacts" @click="showDetailModal(row)">
            {{ row.contacts }}
          </span>
        </template>
        <!-- 总成本列自定义渲染 -->
        <template #purchasepriceSum="{ row }">
          <span class="price-sum">{{ row.purchasepriceSum }}</span>
        </template>
        <!-- 评论列自定义渲染 -->
        <template #chat="{ row }">
          <button class="chat-button" :title="'进入聊天室'" @click="goToChat(row)">
            <SvgIcon name="message_2" width="1rem" />
          </button>
        </template>
      </lay-table>
    </lay-card>

    <!-- 详细信息弹窗 -->
    <ModalWindow :visible="detailModalVisible" :is-teleport="true" title="详情" :syncHeight="true"
      @close="detailModalVisible = false">
      <QuotationInfo v-if="checkedRow" :selected-row="checkedRow" />
      <div v-else>
        <lay-empty />
      </div>
    </ModalWindow>

    <!-- 编辑弹窗 -->
    <ModalWindow :visible="editModalVisible" title="编辑报价单" :is-teleport="true" @close="editModalVisible = false"
      :syncHeight="true">
      <QuotationEdit :showCustomerInfoDefault="false" :is-new-quotation="false" @save="handleEditSave"
        :providedOrderId="selectedOrderId" @cancel="editModalVisible = false" />
    </ModalWindow>

    <!-- 删除确认弹窗 -->
    <DeleteConfirmModal v-model:visible="deleteModalVisible" :item-name="selectedName" @confirm="handleDeleteConfirm" />

    <!-- 导出确认弹窗 -->
    <ExportQuotationModal v-model:visible="exportModalVisible" :export-options="exportOptions"
      @confirm="handleExportConfirm" />

    <!-- 导入报价单弹窗 -->
    <ImportQuotationModal v-model:visible="importModalVisible" @confirm="handleImportConfirm" />

    <!-- 属性设置弹窗 -->
    <ModalWindow :visible="propertyModalVisible" title="设置报价单属性" :btn="[
      {
        text: '确定',
        callback: handlePropertyConfirm,
      },
      {
        text: '取消',
        callback: () => {
          propertyModalVisible = false;
        },
      },
    ]" :maxmin="false" :resize="false" :size-args="['400px', '500px']" @close="propertyModalVisible = false">
      <div class="property-modal-content">
        <!-- 审核状态区域 -->
        <div class="property-section">
          <div class="section-header">
            <lay-switch v-model="propertyForm.shareOrdersEnabled" @change="handleAuditStatusChange" />
            <div class="status-display">
              <span :class="{
                'status-auditing': selectedRowData?.shareOrders === 2,
              }">
                {{ auditStatusText }}
              </span>
            </div>

            <!-- 积分设置下拉框 -->
            <div class="integration-setting">
              <div class="setting-label">积分设置：</div>
              <lay-select v-model="propertyForm.ordersIntegration" placeholder="请选择积分">
                <lay-select-option v-for="option in integrationOptions" :key="option.value" :value="option.value"
                  :label="option.label" />
              </lay-select>
            </div>
          </div>
        </div>

        <!-- 共享名称输入框 -->
        <div class="property-section">
          <div class="section-title">共享名称</div>
          <lay-input v-model="propertyForm.shareName" placeholder="项目名称请注意隐藏项目信息" />
        </div>

        <!-- 项目状态区域 -->
        <div class="property-section">
          <div class="section-header">
            <lay-switch v-model="propertyForm.projectStatusEnabled" @change="handleProjectStatusChange" />
            <span class="section-title">项目状态</span>
          </div>
          <div class="section-content" v-if="propertyForm.projectStatusEnabled">
            <lay-select v-model="propertyForm.projectStatus" placeholder="请选择项目状态">
              <lay-select-option v-for="option in projectStatusOptions" :key="option.value" :value="option.value"
                :label="option.label" />
            </lay-select>
          </div>
        </div>

        <!-- 重要项目设置 -->
        <div class="property-section">
          <div class="section-header">
            <lay-switch v-model="propertyForm.important" />
            <span class="section-title">设置为重要项目</span>
          </div>
        </div>

        <!-- 采购订单设置 -->
        <div class="property-section">
          <div class="section-header">
            <lay-switch v-model="propertyForm.purchase" />
            <span class="section-title">采购订单</span>
          </div>
        </div>

        <!-- 锁定状态设置 -->
        <div class="property-section">
          <div class="section-header">
            <lay-switch v-model="propertyForm.lockMark" />
            <span class="section-title">
              {{
                selectedRowData?.lockOwnerName
                  ? `此报价已被${selectedRowData.lockOwnerName}锁定`
                  : '设置报价项目为锁定状态'
              }}
            </span>
          </div>
        </div>
      </div>
    </ModalWindow>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import QuotationEdit from '@/pages/design/components/QuotationEdit.vue';
import ExportQuotationModal from '@/pages/design/components/ExportQuotationModal.vue';
import ImportQuotationModal from '@/pages/design/components/ImportQuotationModal.vue';
import DeleteConfirmModal from '@/pages/design/components/DeleteConfirmModal.vue';
import { ref, onMounted, h, reactive, watch, computed, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import ordersApi from '@/api/orders/ordersApi';
import type {
  OrderChargePerson,
  QuotationListResponse,
  OrderPrice,
  GetOrdersListParams,
} from '@/api/orders/orderApi.type';
import type {
  TableColumn,
  TableDefaultToolbar,
} from '@layui/layui-vue/types/component/table/typing';
import QuotationInfo from '../components/QuotationInfo.vue';
import { useChatStore } from '@/stores/chat';
import type { UserInfo } from '@/pages/chat/Chat.type';

// 导入自定义hooks
import { useQuotationActions } from '@/composables/design/useQuotationActions';
import { useQuotationExport } from '@/composables/design/useQuotationExport';
import { useQuotationDelete } from '@/composables/design/useQuotationDelete';
import { useQuotationProperty } from '@/composables/design/useQuotationProperty';
import { useQuotationSend } from '@/composables/design/useQuotationSend';
import { useQuotationCollaborate } from '@/composables/design/useQuotationCollaborate';
import { useQuotationImport } from '@/composables/design/useQuotationImport';

// 路由实例
const router = useRouter();

// 用户store
const chatStore = useChatStore();
const currentUser = ref<UserInfo | null>(null);

// 获取当前用户信息
const getCurrentUser = async () => {
  if (!chatStore.userInfoData) {
    await chatStore.setUserInfo();
  }
  currentUser.value = chatStore.userInfoData;
};

// 工具栏响应式数据
const typeFilter = ref('projectName');
const quotationNameSearch = ref<string>();
const chargePerson = ref<string>();
const createUser = ref<string>();
const createDate = ref<string>();
const attribute = ref<string>();
const selectedName = computed(() => {
  const selectedItem = dataSource.value.find(
    (item) => item.ordersId === selectedKey.value,
  );
  return selectedItem ? selectedItem.projectName : '';
});

// 表格数据
const loading = ref(false);
const dataSource = ref<QuotationListResponse[]>([]);

// 弹窗相关
const detailModalVisible = ref(false);
const checkedRow = ref<QuotationListResponse | null>(null); // 用户点击的行数据（通过工程名称和客户单位点击）
const editModalVisible = ref(false);
const deleteModalVisible = ref(false);

// 导出确认弹窗相关状态
const exportModalVisible = ref(false);

// 属性设置弹窗相关状态
const propertyModalVisible = ref(false);

// 计算审核状态显示文本
const auditStatusText = computed(() => {
  const shareOrders = selectedRowData.value?.shareOrders || 0;
  return shareStatus[shareOrders] || shareStatus[0];
});

// 当前选中行的数据计算属性
const selectedRowData = computed(() => {
  return dataSource.value.find((item) => item.ordersId === selectedKey.value);
});

// tab数据
const current2 = ref('全部');
const tabItem = [
  {
    title: '全部',
    type: -1,
    iconRenderFunction: () => [
      h(SvgIcon, {
        name: 'company_information',
        width: '1rem',
        style: 'margin-right: 8px;',
      }),
    ],
  },
  {
    title: '进行中',
    type: 2,
    iconRenderFunction: () => [
      h(SvgIcon, {
        name: 'message_2',
        width: '1rem',
        style: 'margin-right: 8px;',
      }),
    ],
  },
  {
    title: '已中标',
    type: 1,
    iconRenderFunction: () => [
      h(SvgIcon, {
        name: 'correction',
        width: '0.9rem',
        style: 'margin-right: 8px;',
      }),
    ],
  },
  {
    title: '已失效',
    type: 0,
    iconRenderFunction: () => [
      h(SvgIcon, {
        name: 'cancel',
        width: '0.8rem',
        style: 'margin-right: 8px;',
      }),
    ],
  },
];

// 表头配置
const defaultToolbars: TableDefaultToolbar[] = [
  {
    icon: 'layui-icon-refresh',
    title: '刷新',
    onClick: () => {
      handleRefresh();
    },
  },
  'filter',
];

// 表格列配置
const columns = ref([
  { title: '', width: '20px', type: 'radio', fixed: 'left' as const },
  {
    title: '编号',
    width: '180px',
    key: 'ordersId',
    ellipsisTooltip: true,
    hide: true,
  },
  {
    title: '工程项目名称',
    width: '300px',
    key: 'projectName',
    customSlot: 'projectName',
  },
  {
    title: '客户单位',
    width: '250px',
    key: 'contacts',
    customSlot: 'contacts',
  },
  {
    title: '制单时间',
    width: '150px',
    key: 'createDate',
    sort: true,
  },
  {
    title: '报价类型',
    width: '300px',
    key: 'ordersType', // 需要用/拼接三个ordersType
    hide: true,
    ellipsisTooltip: true,
  },
  {
    title: '总售价',
    width: '120px',
    key: 'priceSum',
    hide: true,
  },
  {
    title: '总成本',
    width: '120px',
    key: 'purchasepriceSum',
    customSlot: 'purchasepriceSum',
    hide: true,
  },
  {
    title: '交货时间',
    width: '150px',
    key: 'deliveryTime',
    hide: true,
  },
  {
    title: '项目负责人',
    width: '100px',
    key: 'chargePersonInfo',
  },
  {
    title: '制单人',
    width: '100px',
    key: 'name',
  },
  {
    title: '项目备注',
    width: '200px',
    key: 'projectRemark',
  },
  {
    title: '评论',
    width: '80px',
    key: 'chat',
    customSlot: 'chat',
  },
  {
    title: '文件夹',
    width: '80px',
    key: 'folder',
    ellipsisTooltip: true,
  },
]) as Ref<TableColumn[]>;

// 外部获取响应式数据
const orderAttributeList = ref<{ id: number; name: string }[]>();
const ordersChargePersonList = ref<OrderChargePerson[]>();
const ordersCreateUserList = ref<string[]>();

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});

// 显示详细信息弹窗
const showDetailModal = (row: QuotationListResponse) => {
  checkedRow.value = row;
  detailModalVisible.value = true;
};

// 跳转到聊天页面
const goToChat = (row: QuotationListResponse) => {
  router.push({
    path: '/chat',
    query: {
      prefix: 'BJ',
      chatName: row.projectName,
      toId: row.ordersId,
    },
  });
};

const selectedKey = ref();

// 日期排序
const sortChange = (key: string, sort: string) => {
  dataSource.value.sort(
    (a: QuotationListResponse, b: QuotationListResponse) => {
      if (sort === 'asc') {
        switch (key) {
          case 'createDate':
            return (
              new Date(a.createDate).getTime() -
              new Date(b.createDate).getTime()
            );
          default:
            return 0;
        }
      } else {
        switch (key) {
          case 'createDate':
            return (
              new Date(b.createDate).getTime() -
              new Date(a.createDate).getTime()
            );
          default:
            return 0;
        }
      }
    },
  );
};

// 获取属性数据
const getOrderAttributeList = async () => {
  try {
    const res = await ordersApi.getOrdersType();
    orderAttributeList.value = res.data;
  } catch (error) {
    console.error('获取属性数据失败:', error);
  }
};

// 获取报价单价格信息
const getPriceInfo = async (orderIds: string[]) => {
  try {
    if (orderIds.length === 0) return {};
    const res = await ordersApi.getPriceByOrderId(orderIds);
    return res;
  } catch (error) {
    console.error('获取价格信息失败:', error);
    return {};
  }
};

// 获取报价单列表
const getOrdersList = async (type?: number) => {
  try {
    loading.value = true;

    // 构建查询参数
    let params: GetOrdersListParams = {
      order: 'desc',
      offset: (pagination.current - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    };

    // 添加可选参数
    if (type !== undefined && type !== -1) {
      params.type = type;
    }
    if (attribute.value && attribute.value !== '') {
      params.attr = Number(attribute.value);
    }
    if (chargePerson.value && chargePerson.value !== '') {
      params.chargePerson = chargePerson.value;
    }
    if (createUser.value && createUser.value !== '') {
      params.createName = createUser.value;
    }
    if (createDate.value) {
      params.createDate = createDate.value;
    }

    // 处理互斥的搜索字段
    if (quotationNameSearch.value) {
      switch (typeFilter.value) {
        case 'projectName':
          params = { ...params, projectName: quotationNameSearch.value };
          break;
        case 'contacts':
          params = { ...params, contacts: quotationNameSearch.value };
          break;
        case 'orderstype':
          params = { ...params, ordersType: quotationNameSearch.value };
          break;
      }
    }

    const res = (await ordersApi.getOrdersList(params)) as unknown as {
      rows: QuotationListResponse[];
      total: number;
    };

    if (res.rows) {
      // 获取所有订单ID
      const orderIds = res.rows.map(
        (item: QuotationListResponse) => item.ordersId,
      );

      // 获取价格信息
      const priceMap: Record<string, OrderPrice> = await getPriceInfo(orderIds);

      // 处理数据格式
      dataSource.value = res.rows.map((item: QuotationListResponse) => ({
        id: item.ordersId,
        ...item,
        // 拼接报价类型
        ordersType: [item.ordersType1, item.ordersType2, item.ordersType3]
          .filter(Boolean)
          .join('/'),
        // 格式化交货时间，只保留日期部分
        deliveryTime: item.deliveryTime ? item.deliveryTime.split(' ')[0] : '',
        // 格式化制单时间
        createDate: item.createDate ? item.createDate.split(' ')[0] : '',
        // 使用从 getPriceByOrderId 获取的价格信息
        priceSum: priceMap[item.ordersId]?.priceSum || 0,
        purchasepriceSum: priceMap[item.ordersId]?.purchasepriceSum || 0,
      }));

      // 更新分页总数
      if (res.total !== undefined) {
        pagination.total = res.total;
      }
    } else {
      dataSource.value = [];
      pagination.total = 0;
    }
  } catch (error) {
    console.error('获取报价单列表失败:', error);
    dataSource.value = [];
    pagination.total = 0;
  } finally {
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  // 清除防抖定时器，立即执行搜索
  if (searchTimeout) {
    clearTimeout(searchTimeout);
    searchTimeout = null;
  }
  pagination.current = 1;
  const currentTab = tabItem.find((item) => item.title === current2.value);
  const type = currentTab ? currentTab.type : undefined;
  getOrdersList(type === -1 ? undefined : type);
};

// 处理刷新
const handleRefresh = () => {
  // 清空所有搜索字段
  typeFilter.value = 'projectName';
  quotationNameSearch.value = '';
  attribute.value = '';
  chargePerson.value = '';
  createUser.value = '';
  createDate.value = '';

  // 重置分页
  pagination.current = 1;

  const currentTab = tabItem.find((item) => item.title === current2.value);
  const type = currentTab ? currentTab.type : undefined;
  getOrdersList(type === -1 ? undefined : type);
};

// 处理tab切换
const handleTabChange = (activeKey: string) => {
  current2.value = activeKey;
  pagination.current = 1;
  const currentTab = tabItem.find((item) => item.title === activeKey);
  const type = currentTab ? currentTab.type : undefined;
  getOrdersList(type === -1 ? undefined : type);
};

// 处理分页
const handlePagination = (e: { current: number; pageSize: number }) => {
  pagination.current = e.current;
  pagination.pageSize = e.pageSize;
  const currentTab = tabItem.find((item) => item.title === current2.value);
  const type = currentTab ? currentTab.type : undefined;
  getOrdersList(type === -1 ? undefined : type);
};

const getOrdersCreateUserList = async () => {
  try {
    const res = await ordersApi.getOrdersCreateUserList();
    ordersCreateUserList.value = res.data;
  } catch (error) {
    console.error('获取制单人列表失败:', error);
  }
};

const getOrdersChargePerson = async () => {
  try {
    const res = await ordersApi.getOrdersChargePerson();
    ordersChargePersonList.value = res.data;
  } catch (error) {
    console.error('获取负责人列表失败:', error);
  }
};

// 防抖函数
let searchTimeout: NodeJS.Timeout | null = null;
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    pagination.current = 1;
    const currentTab = tabItem.find((item) => item.title === current2.value);
    const type = currentTab ? currentTab.type : undefined;
    getOrdersList(type === -1 ? undefined : type);
  }, 500); // 500ms 防抖
};

// 监听筛选条件变化，自动触发数据请求
watch(
  [typeFilter, attribute, chargePerson, createUser, createDate],
  () => {
    debouncedSearch();
  },
  { deep: true },
);

// 单独监听搜索输入框，使用防抖
watch(quotationNameSearch, () => {
  debouncedSearch();
});

// 初始化hooks
const { handleShowPrice, handleEdit, handleEditSave, handleCopy } =
  useQuotationActions({
    selectedKey,
    editModalVisible,
    getOrdersList,
    tabItem,
    current2,
    columns,
  });

const { exportOptions, handleExport, handleExportConfirm } = useQuotationExport(
  {
    selectedKey,
    exportModalVisible,
  },
);

// 当前选中行的订单ID，用于编辑报价单数据获取
const selectedOrderId = computed(() => (selectedRowData.value?.ordersId || ''));

const { handleDelete, handleDeleteConfirm } = useQuotationDelete({
  selectedKey,
  dataSource,
  deleteModalVisible,
  getOrdersList,
  tabItem,
  current2,
});

const {
  propertyForm,
  shareStatus,
  integrationOptions,
  projectStatusOptions,
  handleProperty,
  handlePropertyConfirm,
  handleAuditStatusChange,
  handleProjectStatusChange,
} = useQuotationProperty({
  selectedKey,
  dataSource,
  propertyModalVisible,
  getOrdersList,
  tabItem,
  current2,
});

const { handleSend } = useQuotationSend({
  selectedKey,
  dataSource,
  currentUser,
  getOrdersList,
  tabItem,
  current2,
});

const { handleCollaborate } = useQuotationCollaborate({
  selectedKey,
  dataSource,
});

const { importModalVisible, handleImport, handleImportConfirm } = useQuotationImport();

onMounted(async () => {
  await Promise.all([
    getOrdersList(),
    getOrdersChargePerson(),
    getOrdersCreateUserList(),
    getOrderAttributeList(),
    getCurrentUser(), // 初始化用户信息
  ]);
});
</script>

<style scoped lang="scss">
.history-quote-page {
  :deep(.layui-form-item) {
    label {
      width: 100px !important;
    }
  }

  .content-list-card {
    height: 100%;

    :deep(.layui-card-body) {
      padding: 0 0 10px 0 !important;
      overflow: hidden;
      border-radius: var(--card-border-radius);
    }
  }

  .form-item-search {
    display: flex;
    flex-wrap: nowrap;

    :deep(.layui-form-label) {
      padding: 0;
    }

    .layui-select {
      width: 100%;
      border-radius: 0;
    }
  }

  .toolbar-btns {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-left: 0.5rem;

    button {
      @include button-style($primary-color);
    }
  }

  :deep(.layui-tab) {
    margin: 0;

    .layui-tab-title {
      padding: 0;
    }

    .layui-tab-content {
      padding: 0;
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

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

  .price-sum {
    color: $danger-color;
  }

  // 工程项目名称链接样式
  .project-name-link {
    color: $primary-color;
    cursor: pointer;
    text-decoration: none;
  }

  // 聊天按钮样式
  .chat-button {
    @include button-style($primary-color);
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: $desktop_layout_breakpoint) {
    :deep(.layui-date-picker) {
      width: 100%;
    }

    .toolbar-btns {
      margin-left: 0;
      margin-bottom: 0.5rem;
    }
  }

  @media (min-width: $desktop_layout_breakpoint) {
    .toolbar-form-items {
      display: flex;
      gap: 10px;

      :deep(.layui-form-item) {
        margin-bottom: 0;
      }
    }
  }

  // 属性设置弹窗样式
  .property-modal-content {
    padding: 24px;

    .property-section {
      .section-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;

        .section-title {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
      }

      .section-content {
        padding-left: 8px;

        .status-display {
          margin-bottom: 8px;
          font-size: 13px;

          .status-auditing {
            color: #1890ff !important;
            font-weight: 500;
          }
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    :deep(.layui-input) {
      border-radius: 6px;
    }

    :deep(.layui-select) {
      border-radius: 6px;
    }

    .integration-setting {
      margin-top: 12px;

      .setting-label {
        font-size: 13px;
        color: #666;
        margin-bottom: 8px;
      }
    }
  }
}

// 协作弹窗样式
.coop-modal-content {
  .coop-tree-container {
    overflow-y: auto;
    border-radius: 6px;
    padding: 12px;

    .tree-node-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .selected-users-info {
    margin-top: 16px;
    padding: 8px 12px;
    background-color: #f0f9ff;
    border: 1px solid #bae7ff;
    border-radius: 4px;
    font-size: 13px;
    color: #1890ff;
    text-align: center;
  }
}
</style>
