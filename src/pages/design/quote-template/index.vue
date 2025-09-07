<template>
  <div class="quote-template-page">
    <!-- 顶部工具栏 -->
    <lay-card class="toolbar-card">
      <lay-form
        layout="inline"
        :pane="true"
        :label-width="80"
        class="toolbar-form-items"
      >
        <lay-form-item label="模块名">
          <lay-input
            v-model="moduleNameSearch"
            placeholder="请输入模块名"
            class="search-input"
            mode="block"
          />
        </lay-form-item>

        <lay-form-item label="类别">
          <lay-select v-model="categorySearch1" placeholder="请选择">
            <lay-select-option value="1">类别1</lay-select-option>
            <lay-select-option value="2">类别2</lay-select-option>
            <lay-select-option value="3">类别3</lay-select-option>
          </lay-select>
        </lay-form-item>
        <lay-form-item>
          <lay-select v-model="categorySearch2" placeholder="请选择">
            <lay-select-option value="1">类别1</lay-select-option>
            <lay-select-option value="2">类别2</lay-select-option>
            <lay-select-option value="3">类别3</lay-select-option>
          </lay-select>
        </lay-form-item>

        <lay-form-item label="面积">
          <lay-select v-model="squareSearch" placeholder="请选择">
            <lay-select-option value="1">类别1</lay-select-option>
            <lay-select-option value="2">类别2</lay-select-option>
            <lay-select-option value="3">类别3</lay-select-option>
          </lay-select>
        </lay-form-item>

        <lay-form-item label="配置">
          <lay-select v-model="configSearch" placeholder="请选择">
            <lay-select-option value="1">类别1</lay-select-option>
            <lay-select-option value="2">类别2</lay-select-option>
            <lay-select-option value="3">类别3</lay-select-option>
          </lay-select>
        </lay-form-item>

        <lay-form-item label="国别">
          <lay-select v-model="countrySearch" placeholder="请选择">
            <lay-select-option value="1">类别1</lay-select-option>
            <lay-select-option value="2">类别2</lay-select-option>
            <lay-select-option value="3">类别3</lay-select-option>
          </lay-select>
        </lay-form-item>

        <lay-form-item label="点位数">
          <lay-select v-model="pointNumberSearch" placeholder="请选择">
            <lay-select-option value="1">类别1</lay-select-option>
            <lay-select-option value="2">类别2</lay-select-option>
            <lay-select-option value="3">类别3</lay-select-option>
          </lay-select>
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
      <lay-table
        :columns="columns"
        :data-source="dataSource"
        :default-toolbar="defaultToolbars"
        :loading="loading"
        :pagination="pagination"
        even
        @sort-change="sortChange"
      >
        <template #purchasepriceSum="{ row }">
          <span style="color: red">{{ row.purchasepriceSum }}</span>
        </template>
      </lay-table>
      <div class="page-info">
        <span>
          显示第
          {{ (pagination.current - 1) * pagination.pageSize + 1 }}
          到第
          {{ pagination.current * pagination.pageSize }}
          条记录，总共 {{ pagination.total }} 条记录
        </span>
      </div>
    </lay-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type {
  OrderModuleListResponse,
  OrderPrice,
} from '@/api/orders/orderApi.type';
import type {
  TableColumn,
  TableDefaultToolbar,
} from '@layui/layui-vue/types/component/table/typing';
import SvgIcon from '@/components/SvgIcon.vue';
import ordersApi from '@/api/orders/ordersApi';

// 工具栏响应式数据
const moduleNameSearch = ref<string>();
const categorySearch1 = ref<string>();
const categorySearch2 = ref<string>();
const squareSearch = ref<string>(); // 面积
const configSearch = ref<string>(); // 配置
const countrySearch = ref<string>(); // 国别
const pointNumberSearch = ref<string>(); // 点位数

// 表格数据
const loading = ref(false);
const dataSource = ref<(OrderModuleListResponse & { ordersType: string })[]>();

// 表头配置
const defaultToolbars: TableDefaultToolbar[] = [
  {
    icon: 'layui-icon-refresh',
    title: '刷新',
    onClick: () => {},
  },
  'filter',
];

// 表格列配置
const columns = [
  { title: '', width: '20px', type: 'checkbox', fixed: 'left' as const },
  {
    title: '编号',
    width: '180px',
    key: 'ordersId',
    ellipsisTooltip: true,
    hide: true,
  },
  {
    title: '模块名称',
    width: '200px',
    key: 'projectName',
    ellipsisTooltip: true,
  },
  {
    title: '报价类型',
    width: '200px',
    key: 'ordersType',
    ellipsisTooltip: true,
  },
  {
    title: '供应商单位',
    width: '250px',
    key: 'contacts',
    ellipsisTooltip: true,
  },
  {
    title: '总成本',
    width: '120px',
    key: 'purchasepriceSum',
    sort: true,
    customSlot: 'purchasepriceSum',
  },
  {
    title: '利率（倍数）',
    width: '120px',
    key: 'rate',
    sort: true,
  },
  {
    title: '总售价',
    width: '120px',
    key: 'priceSum',
    sort: true,
  },
  {
    title: '模块来源',
    width: '150px',
    key: 'beFromCompany',
    sort: true,
  },
  {
    title: '创建时间',
    width: '150px',
    key: 'createDate',
    hide: true,
    sort: true,
  },
  {
    title: '创建人',
    width: '120px',
    key: 'name',
    hide: true,
  },
] as TableColumn[];

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});

// 排序
const sortChange = (key: string, sort: string) => {
  if (!dataSource.value) return;

  dataSource.value.sort(
    (a: OrderModuleListResponse, b: OrderModuleListResponse) => {
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

// 处理搜索
const handleSearch = () => {
  pagination.current = 1;
};

// 处理刷新
const handleRefresh = () => {};

const getSourceData = async () => {
  const res = (await ordersApi.getOrderModuleList(
    'desc',
    (pagination.current - 1) * pagination.pageSize,
    pagination.pageSize,
  )) as unknown as { rows: OrderModuleListResponse[]; total: number };
  console.log(res.rows);

  // 获取价格
  const priceRes = (await ordersApi.getPriceByOrderId(
    res.rows.map((item) => item.ordersId),
  )) as unknown as Record<string, OrderPrice>;

  console.log(priceRes);

  pagination.total = res.total;
  dataSource.value = res.rows.map((item) => ({
    ...item,
    beFromCompany: item.beFromCompany || '公司自建',
    rate: item.rate || '0.00',
    ordersType: [item.ordersType1, item.ordersType2, item.ordersType3]
      .filter(Boolean)
      .join('/'),
    ...(priceRes[item.ordersId]
      ? {
          priceSum: priceRes[item.ordersId].priceSum?.toString() || '0.00',
          purchasepriceSum:
            priceRes[item.ordersId].purchasepriceSum?.toString() || '0.00',
        }
      : {}),
  }));
};

onMounted(() => {
  getSourceData();
});
</script>

<style scoped lang="scss">
.quote-template-page {
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

  .page-info {
    margin-top: 1rem;
    font-size: 14px;
    margin-left: 20px;
    color: $text-regular;
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
}
</style>
