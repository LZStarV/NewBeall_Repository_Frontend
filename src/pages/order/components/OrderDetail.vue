<template>
  <div class="detail-content" v-if="detail">
    <!-- 顶部信息 -->
    <lay-row :gutter="20">
      <lay-col :xs="24" :md="12">
        <div class="module-card">
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label">项目名称</label>
              <lay-input v-model="detail.orders.projectName" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">{{
                props.viewName === 'send' ? '接收公司' : '发送公司'
              }}</label>
              <lay-input v-model="detail.company" disabled />
            </div>
          </div>
        </div>
      </lay-col>
      <lay-col :xs="24" :md="12">
        <div class="module-card">
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label">项目地点</label>
              <lay-input v-model="detail.projectAddress" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">项目负责人</label>
              <lay-input v-model="detail.orders.chargePersonInfo" disabled />
            </div>
          </div>
        </div>
      </lay-col>
    </lay-row>
    <!-- 中部按钮和图例 -->
    <div class="legend-and-btns">
      <div class="legend">
        折后单价示意：
        <div class="legend-item" style="color: #797c7d">
          <span class="legend-dot"></span>
          <span class="legend-text">未作调整</span>
        </div>
        <div class="legend-item price-down">
          <span class="legend-dot"></span>
          <span class="legend-text">价格降低</span>
        </div>
        <div class="legend-item price-up">
          <span class="legend-dot"></span>
          <span class="legend-text">价格提高</span>
        </div>
      </div>
      <div class="btns">
        <lay-button size="md" type="primary" @click="">打折</lay-button>
        <lay-button size="md" type="primary" @click="" disabled>未处理</lay-button>
        <lay-button size="md" type="primary" @click="">沟通</lay-button>
      </div>
    </div>
    <!-- 产品列表 -->
    <lay-table ref="tableRef1" :columns="productColumns" :data-source="productDataSource" :loading="productLoading"
      even>
      <!-- 折后单价 -->
      <template #modifyprice="{ row }">
        <span :class="row.modifyprice - row.price === 0
          ? ''
          : row.modifyprice - row.price > 0
            ? 'price-up'
            : 'price-down'
          ">{{ row.modifyprice ? row.modifyprice : '0.00' }}</span>
      </template>
      <!-- 折后单价编辑框modifypriceEdit -->
      <template #modifypriceEdit="{ row }"><lay-input v-model="row.modifyprice" /></template>
      <!-- 成本单价 -->
      <template #purchaseprice="{ row }">
        <span class="purchaseprice">{{ row.purchaseprice }}</span>
      </template>
    </lay-table>
    <!-- 产品价格小计 -->
    <div class="totals">
      <div class="total-item">
        (￥)订单总合计：<span class="price">{{
          formatMoney(totalAmount)
        }}</span>
      </div>
      <div class="total-item" v-if="props.viewName === 'receive'">
        (￥)订单总利润：<span class="price">{{
          formatMoney(totalProfit)
        }}</span>
      </div>
    </div>
    <!-- 状态日志列表 -->
    <h5>状态日志</h5>
    <lay-table ref="tableRef2" :columns="logColumns" :data-source="logDataSource" :loading="logLoading"
      :expand-index="1" even>
      <!-- 日志内容 -->
      <template #logcontent="{ row }">
        <div v-dompurify-html="row.logcontent"></div>
      </template>
    </lay-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import ordersNoticeApi from '@/api/orders/ordersNotice';
import type { TableColumn } from '@layui/layui-vue/types/component/table/typing';
import type {
  OrdersNoticeRow,
  OrdersNoticeDeatilData,
  ProductData,
  UplogData,
} from '@/api/orders/ordersNotice.type';

const props = defineProps<{
  row: OrdersNoticeRow;
  viewName: string;
}>();

// 表格列配置
const productColumns = [
  { title: '', width: '20px', type: 'checkbox', fixed: 'left' as const },
  {
    title: '编号',
    width: '50px',
    key: 'row_id',
  },
  {
    title: '品牌',
    width: '80px',
    key: 'brand',
    ellipsisTooltip: true,
  },
  {
    title: '产品名称',
    width: '180px',
    key: 'name',
    ellipsisTooltip: true,
  },
  {
    title: '规格型号',
    width: '200px',
    key: 'model',
    ellipsisTooltip: true,
  },
  {
    title: '数量',
    width: '80px',
    key: 'num',
  },
  props.viewName === 'receive'
    ? {
      title: '成本单价',
      width: '80px',
      key: 'purchaseprice',
      customSlot: 'purchaseprice',
    }
    : { width: '0px' },
  {
    title: '原单价',
    width: '120px',
    key: 'price',
  },
  {
    title: '原单价小计',
    width: '120px',
    key: 'price',
  },
  {
    title: '折后单价',
    width: '120px',
    key: 'modifyprice',
    customSlot: props.viewName === 'send' ? 'modifyprice' : 'modifypriceEdit',
  },
  {
    title: '折后单价小计',
    width: '120px',
    key: 'modifyprice',
    customSlot: 'modifyprice',
  },
  props.viewName === 'receive'
    ? {
      title: '审批人',
      width: '120px',
      key: 'receiveName',
    }
    : { width: '0px' },
] as TableColumn[];

const logColumns = [
  {
    title: '时间',
    width: '120px',
    key: 'createtime',
  },
  {
    title: '处理阶段',
    width: '100 px',
    key: 'state',
  },
  {
    title: '内容',
    width: '400px',
    key: 'logcontent',
    customSlot: 'logcontent',
  },
  {
    title: '处理者',
    width: '100px',
    key: 'uname',
  },
] as TableColumn[];

// 表格数据
const productDataSource = ref<ProductData[]>([]);
const logDataSource = ref<UplogData[]>([]);
const productLoading = ref<boolean>(false);
const logLoading = ref<boolean>(false);

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

// 订单总利润（仅receive显示）
const totalProfit = computed(() => {
  return (productDataSource.value || []).reduce((sum, row) => {
    const toPayPrice = Number(
      row.modifyprice.length > 0 ? row.modifyprice : row.price,
    );
    const cost = Number(row.purchaseprice || 0);
    const quantity = Number(row.num || 0);
    return sum + (toPayPrice - cost) * quantity;
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
    companyId: props.row.checkCompanyId,
    nId: props.row.id,
    orderid: props.row.orderid,
    typeName: props.row.typeName,
    viewName: props.viewName,
  } as Record<string, string | number>;
  try {
    const res = await ordersNoticeApi.getNoticeDetail(params);
    console.log(res.data);
    detail.value = res.data;
    productDataSource.value = res.data.productList.map((item, index) => ({
      ...item,
      row_id: index + 1,
    }));
    // 兼容可折叠表格的数据转换
    const convertLogData = (rawData: UplogData[]) => {
      const result: (UplogData & { children?: UplogData[]; state: string })[] =
        [];
      for (const [index, item] of rawData.entries()) {
        if (item.logtype === '工程集成商接收订单日志') {
          result.push({
            ...item,
            id: item.id.length > 0 ? item.id : index.toString(),
            state: `第${item.version}次阶段处理`,
          });
        } else {
          const parent = result.find(
            (parent) =>
              item.version === parent.version &&
              parent.logtype === '工程集成商接收订单日志',
          );
          const child = {
            ...item,
            id: item.id.length > 0 ? item.id : index.toString(),
            state: `第${item.version}次处理`,
          };
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(child);
          } else {
            result.push(child);
          }
        }
      }
      return result;
    };
    logDataSource.value = convertLogData(res.data.uplogList);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('获取通知详情失败', error);
  }
};

watch(
  () => [props.row, props.viewName],
  () => {
    fetchDetail();
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.detail-content {
  padding: 20px;

  .detail-title {
    text-align: center;
    margin-bottom: 20px;
  }

  .legend-and-btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0 12px;

    .legend {
      display: flex;
      gap: 16px;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: currentColor;
        }
      }
    }

    .btns {
      display: flex;
      gap: 1rem;
    }
  }

  .totals {
    display: flex;
    gap: 24px;
    margin-top: 12px;
    margin-bottom: 32px;

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
    min-width: 80px;
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

.price-up {
  color: #14a00a;
}

.price-down {
  color: #0087ff;
}

.purchaseprice {
  color: $danger-color;
}
</style>
