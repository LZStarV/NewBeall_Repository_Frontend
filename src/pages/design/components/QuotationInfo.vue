<template>
  <!-- 操作记录面板按钮与容器 -->
  <div class="log-panel-toggle" v-if="localQuotationData">
    <lay-button size="sm" type="normal" @click="toggleLogs">
      {{ showLogs ? '隐藏操作记录' : '查看操作记录' }}
    </lay-button>
  </div>
  <OperationLogPanel v-if="localQuotationData" :visible="showLogs" :order-id="localQuotationData.ordersId"
    :phase-type="phaseType" @update:visible="(v: boolean) => showLogs = v" @view-change="viewChange" />

  <!-- 详情内容 -->
  <div v-if="localQuotationData" class="detail-content">
    <h3 class="detail-title">报价单信息</h3>
    <lay-row :gutter="20">
      <div class="head-info">
        <div class="head-info-left">
          <label>报价单编号:</label> {{ localQuotationData.ordersId }}
        </div>
        <div class="head-info-right">
          <div class="head-info-item">
            <label>制单人:</label> {{ localQuotationData.createPerson }}
          </div>
          <div class="head-info-item">
            <label>制单时间:</label> {{ localQuotationData.createDate }}
          </div>
        </div>
      </div>
      <lay-col :xs="24" :md="12">
        <!-- 客户信息模块 -->
        <div class="module-card">
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label">客户单位</label>
              <lay-input v-model="localQuotationData.clientName" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">客户地址</label>
              <lay-input v-model="localQuotationData.clientAddress" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">联系人员</label>
              <lay-input v-model="localQuotationData.clinetContact" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">联系电话</label>
              <lay-input v-model="localQuotationData.clientPhone" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">客户邮箱</label>
              <lay-input v-model="localQuotationData.clientEmail" disabled />
            </div>
          </div>
        </div>

        <!-- 工程信息模块 -->
        <div class="module-card">
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label">工程项目名称</label>
              <lay-input v-model="localQuotationData.projectName" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">项目负责人</label>
              <lay-input v-model="localQuotationData.chargePerson" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">报价单类型</label>
              <lay-input v-model="localQuotationData.orderstype" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">报价单性质</label>
              <lay-input v-model="localQuotationData.ordersCharacter" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">工程项目备注</label>
              <lay-input v-model="localQuotationData.projectRemark" disabled />
            </div>
          </div>
        </div>
      </lay-col>

      <lay-col :xs="24" :md="12">
        <!-- 我司信息模块 -->
        <div class="module-card">
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label">报价单位</label>
              <lay-input v-model="localQuotationData.companyName" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">我司地址</label>
              <lay-input v-model="localQuotationData.companyAddress" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">联系人员</label>
              <lay-input v-model="localQuotationData.companyContact" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">联系电话</label>
              <lay-input v-model="localQuotationData.companyPhone" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">邮箱地址</label>
              <lay-input v-model="localQuotationData.companyEmail" disabled />
            </div>
          </div>
        </div>

        <!-- 交货信息模块 -->
        <div class="module-card">
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label">交货方式</label>
              <lay-input v-model="localQuotationData.deliveryMethod" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">交货时间</label>
              <lay-input v-model="localQuotationData.deliveryTime" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">交货地点</label>
              <lay-input v-model="localQuotationData.deliveryArea" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">详细地址</label>
              <lay-input v-model="localQuotationData.deliveryAddress" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">结算方式</label>
              <lay-input v-model="localQuotationData.settleMethod" disabled />
            </div>
          </div>
        </div>
      </lay-col>
    </lay-row>

    <!-- 报价产品信息 -->
    <lay-row :gutter="20">
      <h5>报价产品信息</h5>
      <ProductionList :order-id="localQuotationData.ordersId" />
    </lay-row>
  </div>
</template>

<script setup lang="ts">
import clinetApi from '@/api/client/clinetApi';
import type { QuotationListResponse, OrderLogsRecord } from '@/api/orders/orderApi.type';
import ordersApi from '@/api/orders/ordersApi';
import { ref, watch } from 'vue';
import OperationLogPanel from './OperationLogPanel.vue';
import ProductionList from './ProductionList.vue';

interface QuotationFormData {
  ordersId: string;
  clinetId: number | string;
  createDate: string; // 制单时间
  createPerson: string; // 制单人
  // 客户信息
  clientName: string;
  clientAddress: string;
  clinetContact: string;
  clientPhone: string;
  clientEmail: string;
  // 我司信息
  companyName: string;
  companyAddress: string;
  companyContact: string; // 公司联系人员
  companyPhone: string; // 公司联系电话
  companyEmail: string;
  // 工程信息
  projectName: string;
  chargePerson: string; // 项目负责人
  orderstype: string; // 报价单类型orderTypes的结合体，以/分隔
  ordersCharacter: string; // 报价单性质
  projectRemark: string; // 工程项目备注
  // 交货信息
  deliveryMethod: string; // 交货方式
  deliveryTime: string;
  deliveryArea: string; // 交货地址 省 市 区
  deliveryAddress: string; // 详细地址
  settleMethod: string; // 结算方式
}

// Props 定义
const props = defineProps<{
  selectedRow: QuotationListResponse;
}>();

// Emits 定义
const emit = defineEmits<{
  'update:modelValue': [value: QuotationFormData]; // v-model 更新事件
}>();

// 本地数据，用于存储和同步 v-model 的值
const localQuotationData = ref<QuotationFormData | null>(null);

// 操作记录面板逻辑
const showLogs = ref(false);
const phaseType = ref(1);
const toggleLogs = () => {
  showLogs.value = !showLogs.value;
};

// 预留：查看修改内容
const viewChange = (record: OrderLogsRecord) => {
  // TODO: 打开侧滑/弹窗展示record对应的修改详情
  // 这里先占位，后续根据后端返回的变更详情接口实现
  // eslint-disable-next-line no-console
  console.log('查看修改内容：', record);
};

const updateQuotationData = async () => {
  if (!props.selectedRow) return;

  // Initialize with basic data from props
  localQuotationData.value = {
    ordersId: props.selectedRow.ordersId,
    clinetId: props.selectedRow.clientId,
    createDate: props.selectedRow.createDate,
    createPerson: props.selectedRow.name,
    // 客户信息
    clientName: props.selectedRow.contacts,
    clientAddress: '',
    clinetContact: '',
    clientPhone: '',
    clientEmail: '',
    // 我司信息
    companyName: '',
    companyAddress: '',
    companyContact: '',
    companyPhone: '',
    companyEmail: '',
    // 工程信息
    projectName: props.selectedRow.projectName || '',
    chargePerson: props.selectedRow.chargePersonInfo || '',
    orderstype:
      `${props.selectedRow.ordersType1}${props.selectedRow.ordersType2 ? '/' + props.selectedRow.ordersType2 : ''}${props.selectedRow.ordersType3 ? '/' + props.selectedRow.ordersType3 : ''}` ||
      '',
    ordersCharacter: props.selectedRow.ordersCharacter || '',
    projectRemark: props.selectedRow.projectRemark || '',
    // 交货信息
    deliveryMethod: props.selectedRow.method || '',
    deliveryTime: props.selectedRow.deliveryTime || '',
    deliveryArea: '',
    deliveryAddress: props.selectedRow.deliveryAddress || '',
    settleMethod: props.selectedRow.method || '',
  };

  try {
    // Fetch order details
    const orderRes = await ordersApi.getOrderDetail(props.selectedRow.ordersId);
    // Fetch client details
    const clientRes = await clinetApi.clientDetail(orderRes.data.clientId);

    // Update with order details
    Object.assign(localQuotationData.value, {
      deliveryArea: `${orderRes.data.province} ${orderRes.data.city} ${orderRes.data.area}`,
      deliveryAddress: orderRes.data.deliveryAddress,
      ordersCharacter: orderRes.data.ordersCharacter,
      companyName: orderRes.data.companyName,
      companyAddress: orderRes.data.companyAddres,
      companyEmail: orderRes.data.companyEmail,
      companyContact: orderRes.data.contacts,
      companyPhone: orderRes.data.contactPhone,
      // Update with client details
      clientAddress: clientRes.data.address,
      clinetContact: clientRes.data.contactUser,
      clientPhone: clientRes.data.tel,
      clientEmail: clientRes.data.email,
      createDate: orderRes.data.createDate,
    });
  } catch (error) {
    console.error('Error updating quotation data:', error);
  }
};

// 监听 props.selectedRow 的变化，同步到本地数据
watch(
  () => props.selectedRow,
  async (newValue) => {
    if (newValue) {
      await updateQuotationData();
    }
  },
  { immediate: true },
);

// 监听本地数据的变化，同步到 v-model
watch(
  localQuotationData,
  (newValue) => {
    if (newValue) {
      emit('update:modelValue', newValue);
    }
  },
  { deep: true },
);
</script>

<style scoped lang="scss">
// 操作记录面板样式
.log-panel-toggle {
  padding: 12px 20px 0 20px;
}

.operation-log-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 340px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  display: flex;
  flex-direction: column;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid #f0f0f0;
    font-weight: 600;
  }

  .panel-body {
    padding: 10px 12px;
    overflow: auto;
    flex: 1;
  }

  .log-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .log-item {
    padding: 8px 6px;
    border-bottom: 1px dashed #f0f0f0;
  }

  .log-line {
    display: flex;
    justify-content: space-between;
    color: #888;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .log-msg {
    color: #333;
    font-size: 13px;
    line-height: 1.5;
  }

  .loading,
  .empty {
    text-align: center;
    color: #999;
    padding: 12px 0;
  }

  .panel-footer {
    text-align: center;
    padding: 10px 0 4px 0;
  }
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

// 每个子卡片的样式
@mixin form-module {
  padding: 16px;
  box-sizing: border-box;
  margin-bottom: 20px;
}

// 表单行布局
@mixin form-row-layout {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

// 表单标签样式
@mixin form-head-label-style {
  font-size: 14px;
  color: #333;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.detail-content {
  padding: 20px;

  .detail-title {
    text-align: center;
    margin-bottom: 20px;
  }

  .head-info {
    display: flex;
    justify-content: space-between;
  }

  .head-info-left {
    font-weight: 600;
  }

  .head-info-right {
    display: flex;
    gap: 16px;

    label {
      font-weight: 600;
    }
  }
}

.module-card {
  @include form-module;
  height: 100%;
}

.module-content {
  .form-row {
    @include form-row-layout;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-head-label {
    @include form-head-label-style;
  }

  :deep(.layui-input) {
    flex: 1;
    background-color: #f8f9fa;

    .layui-input-disabled {
      background-color: white;
      opacity: 1;

      * {
        opacity: 1;
        color: $text-primary;
        cursor: text !important;
      }
    }
  }
}
</style>
