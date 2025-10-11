<template>
  <!-- 操作记录面板按钮与容器 -->
  <div v-if="moduleData" class="log-panel-toggle">
    <lay-button size="sm" type="normal" @click="toggleLogs">
      {{ showLogs ? '隐藏操作记录' : '查看操作记录' }}
    </lay-button>
  </div>
  <OperationLogPanel
    v-if="moduleData"
    :visible="showLogs"
    :order-id="orderId"
    :phase-type="phaseType"
    @update:visible="(v: boolean) => (showLogs = v)"
    @view-change="viewChange"
  />

  <!-- 详情内容 -->
  <div v-if="moduleData" class="detail-content">
    <h3 class="detail-title">模块详情</h3>
    <lay-row :gutter="20">
      <div class="head-info">
        <div class="head-info-left"><label>模块编号:</label> {{ orderId }}</div>
      </div>
      <lay-col :xs="24" :md="12">
        <!-- 模块信息左侧 -->
        <div class="module-card">
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label">工程项目名称</label>
              <lay-input v-model="moduleData.orders.projectName" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">供应商单位</label>
              <lay-input v-model="moduleData.gyClient.contacts" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">联系人</label>
              <lay-input v-model="moduleData.gyClient.contactUser" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">职务</label>
              <lay-input v-model="moduleData.gyClient.job" disabled />
            </div>
          </div>
        </div>
      </lay-col>
      <!-- 模块信息右侧 -->
      <lay-col :xs="24" :md="12">
        <div class="module-card">
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label">报价单类型</label>
              <lay-input v-model="ordersType" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">详细地址</label>
              <lay-input v-model="moduleData.gyClient.address" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">联系人电话</label>
              <lay-input v-model="moduleData.gyClient.tel" disabled />
            </div>
          </div>
        </div>
      </lay-col>
    </lay-row>

    <!-- 报价产品信息 -->
    <lay-row :gutter="20">
      <h5>报价产品信息</h5>
      <ProductionList :order-id="orderId" />
    </lay-row>
  </div>
</template>

<script setup lang="ts">
import type {
  OrderLogsRecord,
  OrderModuleDetail,
} from '@/api/orders/orderApi.type';
import type { AxiosResponse } from 'axios';
import ordersApi from '@/api/orders/ordersApi';
import { ref, watch } from 'vue';
import OperationLogPanel from './OperationLogPanel.vue';
import ProductionList from './ProductionList.vue';

// Props 定义
const props = defineProps<{
  orderId: string;
}>();

// 模块数据
const moduleData = ref<OrderModuleDetail | null>(null);

const ordersType = ref('');

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
   
  console.log('查看修改内容：', record);
};

// 获取模块详情数据
const fetchModuleData = async () => {
  if (!props.orderId) return;

  try {
    const res = (await ordersApi.getOrderModuleDetail(
      props.orderId,
    )) as AxiosResponse<OrderModuleDetail>;
    moduleData.value = res.data;
    ordersType.value =
      `${res.data.orders.ordersType1}${res.data.orders.ordersType2 ? '/' + res.data.orders.ordersType2 : ''}${res.data.orders.ordersType3 ? '/' + res.data.orders.ordersType3 : ''}` ||
      '';
  } catch (error) {
    console.error('获取模块详情失败:', error);
  }
};

// 监听 orderId 的变化，重新获取数据
watch(
  () => props.orderId,
  async (newValue) => {
    if (newValue) {
      await fetchModuleData();
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
// 操作记录面板样式
.log-panel-toggle {
  padding: 12px 20px 0 20px;
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
}

.module-card {
  padding: 16px;
  box-sizing: border-box;
  margin-bottom: 20px;
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
