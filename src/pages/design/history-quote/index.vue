<template>
  <div class="history-quote-page">
    <!-- 顶部工具栏 -->
    <lay-card class="toolbar-card">
      <div class="toolbar">
        <lay-form
          layout="inline"
          :pane="true"
          :label-width="80"
          class="toolbar-form-items"
        >
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
            <lay-input
              v-model="quotationNameSearch"
              placeholder="请输入方案名称进行搜索"
              class="search-input"
              mode="block"
            />
          </lay-form-item>

          <lay-form-item label="属性">
            <lay-select v-model="attribute" placeholder="请输入">
              <lay-select-option value="">全部</lay-select-option>
              <lay-select-option
                v-for="attr in orderAttributeList"
                :key="attr.id"
                :value="attr.id"
              >
                {{ attr.name }}
              </lay-select-option>
            </lay-select>
          </lay-form-item>

          <lay-form-item label="负责人">
            <lay-select v-model="chargePerson" placeholder="请选择">
              <lay-select-option value="">全部</lay-select-option>
              <lay-select-option
                v-for="item in ordersChargePersonList"
                :key="item.id"
                :value="String(item.id)"
              >
                {{ item.name }}
              </lay-select-option>
            </lay-select>
          </lay-form-item>

          <lay-form-item label="制单人">
            <lay-select v-model="createUser" placeholder="请选择">
              <lay-select-option value="">全部</lay-select-option>
              <lay-select-option
                v-for="item in ordersCreateUserList"
                :key="item"
                :value="item"
              >
                {{ item }}
              </lay-select-option>
            </lay-select>
          </lay-form-item>

          <lay-form-item label="制单日期">
            <lay-date-picker
              v-model="createDate"
              placeholder="click me"
              allow-clear
            />
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
      </div>
    </lay-card>

    <!-- 底部列表区域 -->
    <lay-card class="content-list-card">
      <lay-table
        :columns="columns"
        :data-source="dataSource"
        :default-toolbar="defaultToolbars"
        :loading="loading"
        :pagination="pagination"
        v-model:selectedKey="selectedKey"
        even
        @pagination="handlePagination"
        @sort-change="sortChange"
      >
        <template #toolbar>
          <div class="toolbar">
            <lay-tab v-model="current2" type="brief" @change="handleTabChange">
              <lay-tab-item
                v-for="item in tabItem"
                :id="item.title"
                :key="item.title"
                :title="item.title"
                :icon="item.iconRenderFunction"
              />
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
          <span
            class="project-name-link"
            :title="row.projectName"
            @click="showDetailModal(row)"
          >
            {{ row.projectName }}
          </span>
        </template>
        <!-- 客户单位列自定义渲染 -->
        <template #contacts="{ row }">
          <span
            class="project-name-link"
            :title="row.contacts"
            @click="showDetailModal(row)"
          >
            {{ row.contacts }}
          </span>
        </template>
        <!-- 总成本列自定义渲染 -->
        <template #purchasepriceSum="{ row }">
          <span class="price-sum">{{ row.purchasepriceSum }}</span>
        </template>
        <!-- 评论列自定义渲染 -->
        <template #chat="{ row }">
          <button
            class="chat-button"
            :title="'进入聊天室'"
            @click="goToChat(row)"
          >
            <SvgIcon name="message_2" width="1rem" />
          </button>
        </template>
      </lay-table>
    </lay-card>

    <!-- 详细信息弹窗 -->
    <ModalWindow
      :visible="detailModalVisible"
      title="详情"
      @close="detailModalVisible = false"
    >
      <QuotationInfo v-if="selectedRow" :selected-row="selectedRow" />
      <div v-else>
        <lay-empty />
      </div>
    </ModalWindow>

    <!-- 编辑弹窗 -->
    <ModalWindow
      :visible="editModalVisible"
      title="编辑报价单"
      @close="editModalVisible = false"
    >
      <QuotationEdit
        :showCustomerInfoDefault="false"
        :is-new-quotation="false"
        @save="handleEditSave"
        @cancel="editModalVisible = false"
      />
    </ModalWindow>

    <!-- 删除确认弹窗 -->
    <ModalWindow
      :visible="deleteModalVisible"
      title="删除确认"
      :btn="[
        {
          text: '确认删除',
          style: 'background-color: #ff4d4f; border-color: #ff4d4f;',
          disabled: !isDeleteButtonEnabled,
          callback: handleDeleteConfirm,
        },
        {
          text: '取消',
          callback: () => {
            deleteModalVisible = false;
          },
        },
      ]"
      :maxmin="false"
      :resize="false"
      :area="['400px', '350px']"
      @close="deleteModalVisible = false"
    >
      <div class="delete-confirm-content">
        <div class="warning-text">
          正在删除报价 "<span class="project-name-red">{{
            selectedRow?.projectName
          }}</span
          >"
        </div>
        <div class="warning-info">
          报价删除后，报价内容无法恢复，请谨慎操作！
        </div>
        <div class="confirm-input-section">
          <label>请输入 "DELETE" 确认删除：</label>
          <lay-input
            v-model="deleteConfirmInput"
            placeholder="请输入 DELETE"
            class="confirm-input"
          />
        </div>
      </div>
    </ModalWindow>

    <!-- 导出确认弹窗 -->
    <ModalWindow
      :visible="exportModalVisible"
      title="导出报价单"
      :btn="[
        {
          text: '确认导出',
          callback: handleExportConfirm,
        },
        {
          text: '取消',
          callback: () => {
            exportModalVisible = false;
          },
        },
      ]"
      :maxmin="false"
      :resize="false"
      :area="['400px', '320px']"
      @close="exportModalVisible = false"
    >
      <div class="export-modal-content">
        <div class="export-message">您是否要导出此报价单</div>
        <div class="export-options">
          <div class="option-item">
            <lay-checkbox
              skin="primary"
              v-model="exportOptions.derivePrime"
              value="derivePrime"
              size="lg"
            >
              同时导出成本价
            </lay-checkbox>
          </div>
          <div class="option-item">
            <lay-checkbox
              skin="primary"
              v-model="exportOptions.isExplanation"
              value="isExplanation"
              size="lg"
            >
              导出报价说明
            </lay-checkbox>
          </div>
          <div class="option-item">
            <lay-checkbox
              skin="primary"
              v-model="exportOptions.isSeal"
              value="isSeal"
              size="lg"
            >
              加盖印章
            </lay-checkbox>
          </div>
        </div>
      </div>
    </ModalWindow>

    <!-- 属性设置弹窗 -->
    <ModalWindow
      :visible="propertyModalVisible"
      title="设置报价单属性"
      :btn="[
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
      ]"
      :maxmin="false"
      :resize="false"
      :size-args="['400px', '500px']"
      @close="propertyModalVisible = false"
    >
      <div class="property-modal-content">
        <!-- 审核状态区域 -->
        <div class="property-section">
          <div class="section-header">
            <lay-switch
              v-model="propertyForm.shareOrdersEnabled"
              @change="handleAuditStatusChange"
            />
            <div class="status-display">
              <span
                :class="{
                  'status-auditing': selectedRowData?.shareOrders === 2,
                }"
              >
                {{ auditStatusText }}
              </span>
            </div>

            <!-- 积分设置下拉框 -->
            <div class="integration-setting">
              <div class="setting-label">积分设置：</div>
              <lay-select
                v-model="propertyForm.ordersIntegration"
                placeholder="请选择积分"
              >
                <lay-select-option
                  v-for="option in integrationOptions"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                />
              </lay-select>
            </div>
          </div>
        </div>

        <!-- 共享名称输入框 -->
        <div class="property-section">
          <div class="section-title">共享名称</div>
          <lay-input
            v-model="propertyForm.shareName"
            placeholder="项目名称请注意隐藏项目信息"
          />
        </div>

        <!-- 项目状态区域 -->
        <div class="property-section">
          <div class="section-header">
            <lay-switch
              v-model="propertyForm.projectStatusEnabled"
              @change="handleProjectStatusChange"
            />
            <span class="section-title">项目状态</span>
          </div>
          <div class="section-content" v-if="propertyForm.projectStatusEnabled">
            <lay-select
              v-model="propertyForm.projectStatus"
              placeholder="请选择项目状态"
            >
              <lay-select-option
                v-for="option in projectStatusOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              />
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
import Tree from '@/components/Tree.vue';
import { ref, onMounted, h, reactive, watch, computed, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import ordersApi from '@/api/orders/ordersApi';
import clientApi from '@/api/client/clinetApi';
import type {
  OrderChargePerson,
  QuotationListResponse,
  OrderPrice,
  GetOrdersListParams,
} from '@/api/orders/orderApi.type';
import type { UserTreeType } from '@/api/client/clinetApi.type';
import type {
  TableColumn,
  TableDefaultToolbar,
} from '@layui/layui-vue/types/component/table/typing';
import QuotationInfo from '../components/QuotationInfo.vue';
import { layer } from '@layui/layui-vue';
import notify from '@/utils/notify';
import { useChatStore } from '@/stores/chat';
import type { UserInfo } from '@/pages/chat/Chat.type';

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

// 表格数据
const loading = ref(false);
const dataSource = ref<QuotationListResponse[]>([]);

// 弹窗相关
const detailModalVisible = ref(false);
const selectedRow = ref<QuotationListResponse | null>(null);
const editModalVisible = ref(false);
const deleteModalVisible = ref(false);
const deleteConfirmInput = ref('');

// 导出确认弹窗相关状态
const exportModalVisible = ref(false);
const exportOptions = reactive({
  derivePrime: false, // 同时导出成本价
  isExplanation: false, // 导出报价说明
  isSeal: false, // 加盖印章
});

// 协作相关状态
const userTreeData = ref<UserTreeType[]>([]);
const selectedUserIds = ref<string[]>([]);
const expandedKeys = ref<string[]>([]);

// 属性设置弹窗相关状态
const propertyModalVisible = ref(false);
const propertyForm = reactive({
  shareOrdersEnabled: false, // 审核状态开关
  auditStatus: 0, // 审核状态下拉值
  ordersIntegration: 0, // 积分设置值

  shareName: '', // 共享名称
  projectStatusEnabled: false, // 项目状态开关
  projectStatus: 0, // 项目状态值
  important: false, // 重要项目
  purchase: false, // 采购订单
  lockMark: false, // 锁定状态
});

// 审核状态数组
const shareStatus = [
  '审核状态:(未设置)',
  '审核状态:(已通过)',
  '审核状态:(审核中)',
  '审核状态:(驳回)',
];

// 积分选项数组
const integrationOptions = [
  { value: 0, label: '0积分' },
  { value: 1, label: '1积分' },
  { value: 2, label: '2积分' },
  { value: 5, label: '5积分' },
  { value: 8, label: '8积分' },
  { value: 10, label: '10积分' },
];

// 项目状态数组
const projectStatusOptions = [
  { value: -1, label: '未选择' },
  { value: 0, label: '已失败' },
  { value: 1, label: '已中标' },
  { value: 2, label: '进行中' },
];

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
  selectedRow.value = row;
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

const showPriceColumns = ref(false);

// 工具栏按钮事件处理函数
const handleShowPrice = () => {
  showPriceColumns.value = !showPriceColumns.value;
  // 动态更新表格列的显示状态
  columns.value.forEach((column) => {
    if (column.key === 'priceSum' || column.key === 'purchasepriceSum') {
      column.hide = !showPriceColumns.value;
    }
  });
};

const selectedKey = ref();

const handleEdit = () => {
  console.log(selectedKey.value);
  if (!selectedKey.value) {
    layer.msg('请先选择要修改的报价单', { icon: 2 });
    return;
  }
  editModalVisible.value = true;
};

const handleEditSave = (data: any) => {
  console.log('保存编辑数据:', data);
  // TODO: 实现保存逻辑
  editModalVisible.value = false;
  layer.msg('保存成功', { icon: 1 });
};

const handleCopy = async () => {
  // 检查是否有选中的行
  if (!selectedKey.value) {
    layer.msg('请先选择要复制的订单', { icon: 2 });
    return;
  }

  // 弹出确认对话框
  layer.confirm('确定要复制选中的订单吗？', {
    title: '确认复制',
    icon: 3,
    yes: async (index: number) => {
      try {
        // 调用复制API
        await ordersApi.copyOrders(selectedKey.value);

        // 操作成功提示
        notify.success('订单复制成功');

        // 刷新当前页面数据
        const currentTab = tabItem.find(
          (item) => item.title === current2.value,
        );
        const type = currentTab ? currentTab.type : undefined;
        await getOrdersList(type === -1 ? undefined : type);

        // 关闭确认对话框
        layer.close(index);
      } catch (error) {
        console.error('复制订单失败:', error);
        notify.error('复制订单失败，请重试');
      }
    },
  });
};

const handleExport = () => {
  // 检查是否有选中的行
  if (!selectedKey.value) {
    layer.msg('请先选择要导出的报价单', { icon: 2 });
    return;
  }

  // 重置导出选项
  exportOptions.derivePrime = false;
  exportOptions.isExplanation = false;
  exportOptions.isSeal = false;

  // 显示导出确认弹窗
  exportModalVisible.value = true;
};

// 确认导出
const handleExportConfirm = async () => {
  try {
    // 调用导出API
    await ordersApi.exportQuotation(
      selectedKey.value,
      exportOptions.derivePrime,
      exportOptions.isExplanation,
      exportOptions.isSeal,
    );

    // 操作成功提示
    notify.success('报价单成功导出');

    // 关闭弹窗
    exportModalVisible.value = false;
  } catch (error) {
    console.error('导出报价单失败:', error);
    notify.error('导出报价单失败，请重试');
  }
};

const handleImport = () => {
  console.log('导入功能');
  // TODO: 实现导入功能
};

const handleDelete = () => {
  // 检查是否有选中的行
  if (!selectedKey.value) {
    layer.msg('请先选择要删除的报价单', { icon: 2 });
    return;
  }

  // 获取选中行的数据
  const selectedRowData = dataSource.value.find(
    (item) => item.ordersId === selectedKey.value,
  );

  if (selectedRowData) {
    selectedRow.value = selectedRowData;
    deleteConfirmInput.value = '';
    deleteModalVisible.value = true;
  }
};

// 删除确认处理
const handleDeleteConfirm = async () => {
  if (!selectedRow.value) return;

  try {
    // 调用删除API
    await ordersApi.deleteOrders(selectedRow.value.ordersId);

    // 操作成功提示
    notify.success('删除成功');

    // 关闭弹窗
    deleteModalVisible.value = false;

    // 刷新当前页面数据
    const currentTab = tabItem.find((item) => item.title === current2.value);
    const type = currentTab ? currentTab.type : undefined;
    await getOrdersList(type === -1 ? undefined : type);
  } catch (error) {
    console.error('删除报价单失败:', error);
    notify.error('删除失败，请重试');
  }
};

// 计算删除按钮是否可用
const isDeleteButtonEnabled = computed(() => {
  return deleteConfirmInput.value === 'DELETE';
});

const handleProperty = () => {
  // 检查是否有选中的行
  if (!selectedKey.value) {
    layer.msg('请先选择要设置属性的报价单', { icon: 2 });
    return;
  }

  // 获取选中行的数据
  const selectedRowData = dataSource.value.find(
    (item) => item.ordersId === selectedKey.value,
  );

  if (!selectedRowData) {
    layer.msg('未找到选中的报价单数据', { icon: 2 });
    return;
  }

  // 初始化表单数据
  // 审核状态：shareOrders为0时关闭，其他情况开启
  propertyForm.shareOrdersEnabled = selectedRowData.shareOrders !== 0;
  propertyForm.auditStatus = selectedRowData.shareOrders || 0;

  propertyForm.ordersIntegration = selectedRowData.ordersIntegration || 0;
  propertyForm.shareName = selectedRowData.shareName || '';
  // 项目状态：type为-1时关闭，其他情况（0,1,2）开启
  propertyForm.projectStatusEnabled = selectedRowData.type !== -1;
  propertyForm.projectStatus = selectedRowData.type;
  propertyForm.important = selectedRowData.important === 1;
  propertyForm.purchase = selectedRowData.purchase === 1;
  propertyForm.lockMark = Number(selectedRowData.lockMark) === 1;

  // 显示属性设置弹窗
  propertyModalVisible.value = true;
};

// 确认属性设置
const handlePropertyConfirm = async () => {
  try {
    // 调用设置属性API
    await ordersApi.setOrdersProperty(
      propertyForm.projectStatus,
      propertyForm.important,
      propertyForm.purchase,
      propertyForm.lockMark,
      propertyForm.ordersIntegration,
      propertyForm.shareName,
      selectedKey.value,
    );

    // 操作成功提示
    notify.success('属性设置成功');

    // 刷新当前页面数据
    const currentTab = tabItem.find((item) => item.title === current2.value);
    const type = currentTab ? currentTab.type : undefined;
    await getOrdersList(type === -1 ? undefined : type);

    // 关闭弹窗
    propertyModalVisible.value = false;
  } catch (error) {
    console.error('设置属性失败:', error);
    notify.error('设置属性失败，请重试');
  }
};

// 审核状态开关变化处理
const handleAuditStatusChange = (value: boolean) => {
  if (!value) {
    // 关闭审核状态时，清空积分设置和共享名称
    propertyForm.ordersIntegration = 0;
    propertyForm.shareName = '';
    propertyForm.auditStatus = 0;
  }
};

// 项目状态开关变化处理
const handleProjectStatusChange = (value: boolean) => {
  if (!value) {
    // 关闭项目状态时，重置项目状态为未选择状态
    propertyForm.projectStatus = -1;
  }
};

const handleSend = async () => {
  // 1. 检查是否已选中当前行
  if (!selectedKey.value) {
    layer.msg('请先选择要发送的订单', { icon: 2 });
    return;
  }

  // 获取选中的订单数据
  const selectedOrder = selectedRowData.value;
  if (!selectedOrder) {
    layer.msg('未找到选中的订单数据', { icon: 2 });
    return;
  }

  // 确保获取到当前用户信息
  if (!currentUser.value) {
    await getCurrentUser();
  }

  if (!currentUser.value) {
    layer.msg('获取用户信息失败，请重新登录', { icon: 2 });
    return;
  }

  // 2. 验证当前用户是否为制单人
  if (currentUser.value.id !== selectedOrder.uid) {
    layer.msg('订单只能由制单人发送', { icon: 2 });
    return;
  }

  // 3. 弹出选择发送对象的对话框
  layer.confirm('请选择发送对象', {
    btn: [
      {
        text: '客户',
        callback: async (id) => {
          await handleSendToClient(selectedOrder.ordersId);
          layer.close(id);
        },
      },
      {
        text: '供应商',
        callback: async (id) => {
          await handleSendToSupplier(selectedOrder.ordersId);
          layer.close(id);
        },
      },
    ],
  });
};

// 发送给客户
const handleSendToClient = async (orderId: string) => {
  try {
    await ordersApi.sendOrdersClient(orderId);
    notify.success('发送成功');
  } catch (error) {
    console.error('发送给客户失败:', error);
    notify.error('发送失败，请重试');
  }
};

// 发送给供应商
const handleSendToSupplier = async (orderId: string) => {
  try {
    // 先调用queryOrdersStatus检查状态
    const statusResponse = (await ordersApi.queryOrdersStatus(
      orderId,
    )) as unknown as {
      code: string;
      data: string;
      msg: string;
    };

    // 检查返回的状态码
    if (statusResponse.code === '404') {
      // 显示返回的msg字段作为提示信息
      layer.msg(statusResponse.msg || '订单状态检查失败', { icon: 2 });
      return;
    }

    // 如果查询成功，继续执行供应商发送流程
    // TODO: 添加具体的供应商发送逻辑
  } catch (error: any) {
    console.error('发送给供应商失败:', error);

    // 如果是404错误，显示错误信息
    if (error.response?.status === 404) {
      layer.msg(error.response?.data?.msg || '订单状态检查失败', { icon: 2 });
    } else {
      notify.error('发送失败，请重试');
    }
  }
};

const handleCollaborate = async () => {
  // 1. 检查是否有选中的行
  if (!selectedKey.value) {
    layer.msg('请先选择要协作的订单', { icon: 2 });
    return;
  }

  try {
    // 2. 调用getCoopState API检查是否可以协作
    const coopStateResponse = (await ordersApi.getCoopState(
      selectedKey.value,
    )) as unknown as { code: string; msg: string };

    // 检查返回的code是否为"200"（字符串类型）
    if (coopStateResponse.code !== '200') {
      const errorMsg = coopStateResponse.msg || '无法进行协作操作';
      layer.msg(errorMsg, { icon: 2 });
      return;
    }

    // 3. 如果可以协作，获取用户树数据
    const userTreeResponse =
      (await clientApi.userTree()) as unknown as UserTreeType[];
    userTreeData.value = userTreeResponse;

    // 4. 设置默认展开的节点
    expandedKeys.value = userTreeData.value
      .filter((item) => item.open)
      .map((item) => item.id.toString());

    // 5. 清空之前的选择
    selectedUserIds.value = [];

    // 6. 显示协作抽屉
    layer.drawer({
      title: '选择协作用户',
      content: h(Tree, {
        data: transformedUserTreeDataForTree.value,
        multiple: true,
        showCheckbox: true,
        checkStrictly: false,
        onSelect: handleCoopTreeSelect,
      }),
      btn: [
        {
          text: '确定',
          callback() {
            handleCoopConfirm();
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
    console.error('协作操作失败:', error);
    layer.msg('协作操作失败，请重试', { icon: 2 });
  }
};

// 转换用户树数据为Tree组件需要的格式
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
        disabled: item.chkDisabled.toString() === 'true', // 暂时设置为false，允许所有节点可操作
        selected: item.checked,
        expanded: item.open, // 根据open属性控制默认展开状态
      });
    });
  };

  flatten(userTreeData.value);
  return flattenData;
});

// 处理Tree组件的选择事件
const handleCoopTreeSelect = (
  selected: string | number | (string | number)[],
) => {
  if (Array.isArray(selected)) {
    selectedUserIds.value = selected.map((id) => String(id));
  } else {
    selectedUserIds.value = [String(selected)];
  }
};

// 确认协作操作
const handleCoopConfirm = async () => {
  if (selectedUserIds.value.length === 0) {
    layer.msg('请选择要协作的用户', { icon: 2 });
    return;
  }

  // 检查选择的用户数量
  if (selectedUserIds.value.length > 1) {
    layer.msg('每次只能选择一个用户进行协作', { icon: 2 });
    return;
  }

  try {
    // 获取当前选中行的信息
    if (!selectedKey.value) {
      layer.msg('请先选择要协作的报价单', { icon: 2 });
      return;
    }

    // 获取选中行的数据
    const selectedRowData = dataSource.value.find(
      (item) => item.ordersId === selectedKey.value,
    );

    // 调用协作开始API
    await ordersApi.coopStart(
      selectedKey.value, // orderId
      selectedUserIds.value[0], // coopUser
      selectedRowData ? selectedRowData.projectName : '', // projectName
    );

    // 关闭抽屉
    layer.closeAll();

    // 清空选择
    selectedUserIds.value = [];

    // 成功提示
    notify.success('协作开始');
  } catch (error) {
    console.error('开始协作失败:', error);
    layer.msg('开始协作失败，请重试', { icon: 2 });
  }
};

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
  padding: 24px;

  :deep(.layui-form-item) {
    label {
      width: 100px !important;
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
    min-width: 32px;
    height: 32px;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }

  // 删除确认弹窗样式
  :deep(.delete-confirm-content) {
    padding: 20px;

    .warning-text {
      font-size: 16px;
      margin-bottom: 15px;
      color: #333;

      .project-name-red {
        color: #ff4d4f;
        font-weight: bold;
      }
    }

    .warning-info {
      background-color: #fff2f0;
      border: 1px solid #ffccc7;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 20px;
      color: #cf1322;
      font-size: 14px;
    }

    .confirm-input-section {
      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #333;
      }

      .confirm-input {
        width: 100%;
      }
    }
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

  // 导出确认弹窗样式
  .export-modal-content {
    padding: 20px;

    .export-message {
      font-size: 18px;
      margin-bottom: 20px;
      color: #333;
      text-align: center;
    }

    .export-options {
      .option-item {
        margin-bottom: 15px;
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
