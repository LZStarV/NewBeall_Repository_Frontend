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
            <lay-select-option
              v-for="option in categoryOptions1"
              :key="option.value"
              :value="option.name"
            >
              {{ option.name }}
            </lay-select-option>
          </lay-select>
        </lay-form-item>
        <lay-form-item>
          <lay-select v-model="categorySearch2" placeholder="请选择">
            <lay-select-option
              v-for="option in categoryOptions2"
              :key="option.value"
              :value="option.name"
            >
              {{ option.name }}
            </lay-select-option>
          </lay-select>
        </lay-form-item>

        <lay-form-item label="面积">
          <lay-select v-model="squareSearch" placeholder="请选择">
            <lay-select-option
              v-for="option in squareOptions"
              :key="option.value"
              :value="option.name"
            >
              {{ option.name }}
            </lay-select-option>
          </lay-select>
        </lay-form-item>

        <lay-form-item label="配置">
          <lay-select v-model="configSearch" placeholder="请选择">
            <lay-select-option
              v-for="option in configOptions"
              :key="option.value"
              :value="option.name"
            >
              {{ option.name }}
            </lay-select-option>
          </lay-select>
        </lay-form-item>

        <lay-form-item label="国别">
          <lay-select v-model="countrySearch" placeholder="请选择">
            <lay-select-option
              v-for="option in countryOptions"
              :key="option.value"
              :value="option.name"
            >
              {{ option.name }}
            </lay-select-option>
          </lay-select>
        </lay-form-item>

        <lay-form-item label="点位数">
          <lay-select v-model="pointNumberSearch" placeholder="请选择">
            <lay-select-option
              v-for="option in pointNumberOptions"
              :key="option.value"
              :value="option.name"
            >
              {{ option.name }}
            </lay-select-option>
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
import { ref, reactive, watch, onMounted } from 'vue';
import type {
  OrderModuleListResponse,
  OrderPrice,
} from '@/api/orders/orderApi.type';
import type {
  TableColumn,
  TableDefaultToolbar,
} from '@layui/layui-vue/types/component/table/typing';
import type { SearchParams } from '@/composables/useToolbarSearch';
import SvgIcon from '@/components/SvgIcon.vue';
import ordersApi from '@/api/orders/ordersApi';
import { useToolbarSearch } from '@/composables/useToolbarSearch';

// 下拉框选项类型
interface SelectOption {
  name: string;
  value: number;
}

// 工具栏响应式数据
const moduleNameSearch = ref<string>(''); // projectName
const categorySearch1 = ref<string>(''); // ordersType1
const categorySearch2 = ref<string>(''); // ordersType3
const squareSearch = ref<string>(''); // ordersType4 - 面积
const configSearch = ref<string>(''); // ordersType5 - 配置
const countrySearch = ref<string>(''); // ordersType6 - 国别
const pointNumberSearch = ref<string>(''); // ordersType7 - 点位数

// 下拉框选项数据
const categoryOptions1 = ref<SelectOption[]>([]);
const categoryOptions2 = ref<SelectOption[]>([]);
const squareOptions = ref<SelectOption[]>([]);
const configOptions = ref<SelectOption[]>([]);
const countryOptions = ref<SelectOption[]>([]);
const pointNumberOptions = ref<SelectOption[]>([]);

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});

// 使用 useToolbarSearch hook
const { data, loading, error, search, reset } = useToolbarSearch({
  searchParams: {
    projectName: moduleNameSearch,
    ordersType1: categorySearch1,
    ordersType3: categorySearch2,
    ordersType4: squareSearch,
    ordersType5: configSearch,
    ordersType6: countrySearch,
    ordersType7: pointNumberSearch,
  },
  apiFunction: async (searchParams: SearchParams) => {
    const res = (await ordersApi.getOrderModuleList(
      'desc',
      (pagination.current - 1) * pagination.pageSize,
      pagination.pageSize,
      searchParams.projectName as string,
      searchParams.ordersType1 as string,
      undefined, // ordersType2
      searchParams.ordersType3 as string,
      searchParams.ordersType4 as string,
      searchParams.ordersType5 as string,
      searchParams.ordersType6 as string,
      searchParams.ordersType7 as string,
    )) as unknown as { rows: OrderModuleListResponse[]; total: number };

    // 获取价格信息
    const priceRes = (await ordersApi.getPriceByOrderId(
      res.rows.map((item) => item.ordersId),
    )) as unknown as Record<string, OrderPrice>;

    // 更新分页总数
    pagination.total = res.total;

    // 处理数据格式
    const processedData = res.rows.map((item) => ({
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

    return processedData;
  },
  enableDebounce: true,
  debounceDelay: 100,
  immediate: true,
});

// 表格数据
const dataSource = ref<(OrderModuleListResponse & { ordersType: string })[]>();

// 监听搜索结果变化
watch(
  data,
  (newData: (OrderModuleListResponse & { ordersType: string })[] | null) => {
    if (newData) {
      dataSource.value = newData;
    }
  },
  { immediate: true },
);

// 表头配置
const defaultToolbars: TableDefaultToolbar[] = [
  {
    icon: 'layui-icon-refresh',
    title: '刷新',
    onClick: () => {
      reset();
    },
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
const handleSearch = async () => {
  pagination.current = 1;
  await search();
};

// 处理刷新
const handleRefresh = () => {
  reset();
};

// 处理分页变化
const handlePaginationChange = async () => {
  await search();
};

// 获取下拉框数据
const loadSelectOptions = async () => {
  try {
    // 并行获取所有下拉框数据
    const [category1, category3, category4, category5, category6, category7] =
      await Promise.all([
        ordersApi.getOrderType(1), // categorySearch1 对应 ordersType1
        ordersApi.getOrderType(3), // categorySearch2 对应 ordersType3
        ordersApi.getOrderType(4), // squareSearch 对应 ordersType4
        ordersApi.getOrderType(5), // configSearch 对应 ordersType5
        ordersApi.getOrderType(6), // countrySearch 对应 ordersType6
        ordersApi.getOrderType(7), // pointNumberSearch 对应 ordersType7
      ]);

    // 更新选项数据
    categoryOptions1.value = category1.data || [];
    categoryOptions2.value = category3.data || [];
    squareOptions.value = category4.data || [];
    configOptions.value = category5.data || [];
    countryOptions.value = category6.data || [];
    pointNumberOptions.value = category7.data || [];
  } catch (error) {
    console.error('获取下拉框数据失败:', error);
  }
};

// 页面加载时获取下拉框数据
onMounted(() => {
  loadSelectOptions();
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
