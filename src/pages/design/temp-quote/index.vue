<template>
  <div class="temp-quote-page">
    <!-- 顶部工具栏 -->
    <lay-card class="toolbar-card">
      <lay-form
        layout="inline"
        :pane="true"
        :label-width="80"
        class="toolbar-form-items"
      >
        <lay-form-item label="工程项目名">
          <lay-input
            v-model="quotationNameSearch"
            placeholder="请输入工程项目名"
            class="search-input"
            mode="block"
          />
        </lay-form-item>

        <lay-form-item label="客户单位">
          <lay-input
            v-model="clientNameSearch"
            placeholder="请输入客户单位"
            class="search-input"
            mode="block"
          />
        </lay-form-item>

        <lay-form-item label="报价类型">
          <lay-input
            v-model="quoteTypeSearch"
            placeholder="请输入报价类型"
            class="search-input"
            mode="block"
          />
        </lay-form-item>

        <lay-form-item label="制单日期">
          <lay-date-picker
            v-model="createDate"
            placeholder="请选择制单日期"
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
        @pagination="handlePaginationChange"
        @sort-change="sortChange"
      />
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
import { ref, reactive, onMounted, watch } from 'vue';
import type { QuotationListResponse } from '@/api/orders/orderApi.type';
import type {
  TableColumn,
  TableDefaultToolbar,
} from '@layui/layui-vue/types/component/table/typing';
import SvgIcon from '@/components/SvgIcon.vue';
import ordersApi from '@/api/orders/ordersApi';
import { useToolbarSearch } from '@/composables/useToolbarSearch';

// 工具栏响应式数据
const quotationNameSearch = ref<string>('');
const clientNameSearch = ref<string>('');
const quoteTypeSearch = ref<string>('');
const createDate = ref<string>('');

interface TempQuotationListResponse extends QuotationListResponse {
  status: string;
  ordersType: string;
}

// 表格数据
const dataSource = ref<TempQuotationListResponse[]>([]);

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
    title: '工程项目名称',
    width: '300px',
    key: 'projectName',
    ellipsisTooltip: true,
  },
  {
    title: '客户单位',
    width: '250px',
    key: 'contacts',
    ellipsisTooltip: true,
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
    ellipsisTooltip: true,
  },
  {
    title: '总售价',
    width: '120px',
    key: 'priceSum',
  },
  {
    title: '总成本',
    width: '120px',
    key: 'purchasepriceSum',
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
    title: '状态',
    width: '100px',
    key: 'status',
  },
] as TableColumn[];

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});

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

// 获取状态数据
const getStatus = (isAudit: number) => {
  switch (isAudit) {
    case 0:
      return '待审核';
    case 1:
      return '驳回';
    case 3:
      return '设计中';
    default:
      return isAudit.toString();
  }
};

// 使用 useToolbarSearch hook
const { data, loading, error, search, reset } = useToolbarSearch({
  searchParams: {
    projectName: quotationNameSearch,
    contacts: clientNameSearch,
    orderstype: quoteTypeSearch,
    createDate: createDate,
  },
  apiFunction: async (params) => {
    const res = (await ordersApi.getQuotationList(
      'desc',
      (pagination.current - 1) * pagination.pageSize,
      pagination.pageSize,
      params.projectName as string,
      params.contacts as string,
      params.createDate as string,
      params.orderstype as string,
    )) as unknown as { rows: QuotationListResponse[]; total: number };

    // 更新分页总数
    pagination.total = res.total;

    // 处理数据格式
    const processedData = res.rows.map((item) => ({
      ...item,
      status: getStatus(item.isAudit),
      ordersType: [item.ordersType1, item.ordersType2, item.ordersType3]
        .filter(Boolean)
        .join('/'),
    }));

    return processedData;
  },
  enableDebounce: true,
  debounceDelay: 100,
  immediate: true,
});

// 监听搜索结果变化，更新表格数据
watch(
  data,
  (newData: TempQuotationListResponse[] | null) => {
    if (newData) {
      dataSource.value = newData;
    } else {
      dataSource.value = [];
    }
  },
  { immediate: true },
);

// 处理搜索
const handleSearch = () => {
  pagination.current = 1;
  search();
};

// 处理刷新
const handleRefresh = () => {
  pagination.current = 1;
  reset();
};

// 处理分页变化
const handlePaginationChange = (e: { current: number; pageSize: number }) => {
  pagination.current = e.current;
  pagination.pageSize = e.pageSize;
  search();
};
</script>

<style scoped lang="scss">
.temp-quote-page {
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
