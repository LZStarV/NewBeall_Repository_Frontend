<template>
  <div v-if="detail" class="detail-content">
    <!-- 顶部信息 -->
    <lay-row :gutter="20">
      <lay-col :xs="24" :md="12">
        <div class="module-card">
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label">工程项目名称</label>
              <lay-input v-model="detail.orders.projectName" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">项目地点</label>
              <lay-input v-model="detail.projectAddress" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">详细地址</label>
              <lay-input v-model="detail.projectAddress" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">{{
                props.viewName === 'send' ? '接收公司' : '发送公司'
              }}</label>
              <lay-input v-model="detail.company" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">项目负责人</label>
              <lay-input v-model="detail.orders.chargePersonInfo" disabled />
            </div>
          </div>
        </div>
      </lay-col>
    </lay-row>
    <!-- 产品列表 -->
    <lay-table
ref="tableRef1" :columns="productColumns" :data-source="productDataSource" :loading="productLoading"
      even>
      <!-- 折后单价 -->
      <template #modifyprice="{ row }">
        <span
:class="row.modifyprice - row.price === 0
          ? ''
          : row.modifyprice - row.price > 0
            ? 'price-up'
            : 'price-down'
          ">{{ row.modifyprice ? row.modifyprice : '0.00' }}</span>
      </template>
      <!-- 数量编辑框numEdit -->
      <template #numEdit="{ row }">
<lay-input-number
v-if="props.isUnhandled" v-model="row.num" size="xs"
          position="right" />
        <span v-else>{{ row.num }}</span>
      </template>
      <!-- 单价编辑框priceEdit -->
      <template #priceEdit="{ row }">
<lay-input v-if="props.isUnhandled" v-model="row.price" size="xs" />
        <span v-else>{{ row.price }}</span>
      </template>
      <!-- 小计 -->
      <template #priceTotal="{ row }">
        <span class="priceTotal">{{ (row.price * row.num).toFixed(2) }}</span>
      </template>
      <!-- 操作下拉选择框 -->
      <template #operation="{ row }">
<lay-select
v-model="row.operation" placeholder="操作"
          :change="handleOperationChange(row)" size="xs">
          <lay-select-option :value="1" label="删除" />
          <lay-select-option :value="2" label="替换" />
          <lay-select-option :value="3" label="插入" />
          <lay-select-option :value="4" label="备注" />
        </lay-select>
</template>
    </lay-table>
    <!-- 产品价格小计 -->
    <div class="totals">
      <div class="total-item">
        小计总计 (￥)：<span class="price">{{
          formatMoney(totalAmount)
        }}</span>
      </div>
    </div>
    <!-- 操作按钮区域 -->
    <div class="btns">
      <lay-button size="md" type="primary" @click="importHistoryQuote">导入历史报价</lay-button>
      <lay-button v-if="props.isUnhandled" size="md" type="primary" @click="sendInquery">发送</lay-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { TableColumn } from '@layui/layui-vue/types/component/table/typing';
import type {
  OrdersNoticeRow,
  OrdersNoticeDeatilData,
  ProductData,
} from '@/api/orders/ordersNotice.type';
import inqueryApi from '@/api/inquery/inqueryApi';
import notify from '@/utils/notify';

const props = defineProps<{
  row: OrdersNoticeRow;
  viewName: string;
  isUnhandled: boolean; // 是否已经处理订单
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

// 表格列配置
const productColumns = [
  {
    title: '编号',
    width: '50px',
    key: 'row_id',
  },
  {
    title: '产品名称',
    width: '180px',
    key: 'name',
    ellipsisTooltip: true,
  },
  {
    title: '品牌',
    width: '80px',
    key: 'brand',
    ellipsisTooltip: true,
  },
  {
    title: '规格/型号',
    width: '200px',
    key: 'model',
    ellipsisTooltip: true,
  },
  {
    title: '参数特征',
    width: '280px',
    key: 'trait',
  },
  {
    title: '数量',
    width: '100px',
    key: 'num',
    customSlot: 'numEdit',
  },
  {
    title: '单价',
    width: '100px',
    key: 'price',
    customSlot: 'priceEdit',
  },
  {
    title: '小计',
    width: '100px',
    key: 'priceTotal',
    customSlot: 'priceTotal',
  },
  props.isUnhandled ?
    {
      title: '操作',
      width: '100px',
      key: 'operation',
      customSlot: 'operation',
    } : { hide: true }
] as TableColumn[];

// 表格数据
const productDataSource = ref<ProductData[]>([]);
const productLoading = ref<boolean>(false);

const detail = ref<OrdersNoticeDeatilData | null>(null);

// 订单总合计
const totalAmount = computed(() => {
  return (productDataSource.value || []).reduce((sum, row) => {
    const toPayPrice = Number(
      row.modifyprice.length > 0 ? row.modifyprice : row.price,
    );
    const quantity = Number(row.num || 0);
    return sum + toPayPrice * quantity;
  }, 0);
});

const formatMoney = (n: number | { valueOf: () => number }) => {
  const num = typeof n === 'number' ? n : Number(n.valueOf());
  if (!Number.isFinite(num)) return '0.00';
  return num.toFixed(2);
};

const fetchDetail = async () => {
  if (!props?.row) return;
  const params = {
    company: props.row.companyName,
    nId: props.row.id,
    orderid: props.row.orderid,
    typeName: props.row.typeName,
    viewName: props.viewName,
  } as Record<string, string | number>;
  try {
    const res = await inqueryApi.getInqueryNoticeDetails(params);
    console.log(res.data);
    detail.value = res.data;
    productDataSource.value = res.data.productList.map((item, index) => ({
      ...item,
      row_id: index + 1,
    }));
  } catch (error) {
     
    console.error('获取通知详情失败', error);
  }
};

// 操作下拉选择框change事件处理
const handleOperationChange = (row: ProductData & { operation: number }) => {
  if (row.operation) {
    console.log(row.operation);
  }
};

// 导入历史报价
const importHistoryQuote = async () => {
  if (!props?.row) return;
  try {
    const res = await inqueryApi.setHistoryQuote(props.row.id);
    console.log(res.data);
    notify.success('导入历史报价成功');
  } catch (error) {
    console.error('导入历史报价失败', error);
    notify.error('数据加载错误，请稍后重试');
  }
};

// 发送询价订单
const sendInquery = async () => {
  try {
    await inqueryApi.sendInquery(
      props.row.id,
      productDataSource.value.map((item) => ({
        num: Number(item.num),
        proId: item.proId,
        oldProId: item.proId,
        productPrice: Number(item.price),
      })),
      props.row.orderid,
    );
    notify.success('发送询价订单成功');
    // 发送成功后关闭弹窗
    emit('close');
  } catch (error) {
    console.error('发送询价订单失败', error);
    notify.error('数据加载错误，请稍后重试');
  }
};

watch(
  () => [props.row, props.viewName, props.isUnhandled],
  () => {
    fetchDetail();
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.detail-content {
  padding: 20px;

  .totals {
    display: flex;
    gap: 24px;
    margin-top: 12px;
    margin-bottom: 20px;

    .total-item {
      font-weight: 500;

      .price {
        color: $danger-color;
      }
    }
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
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    gap: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-head-label {
    font-size: 14px;
    color: #333;
    min-width: 100px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
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

.purchaseprice {
  color: $danger-color;
}

.btns {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
