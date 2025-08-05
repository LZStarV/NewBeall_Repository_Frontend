<template>
  <div class="temp-quote-page">
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
            <lay-select placeholder="请输入">
              <lay-select-option v-model="attribute" value="初步建议阶段">
                初步建议阶段
              </lay-select-option>
            </lay-select>
          </lay-form-item>

          <lay-form-item label="负责人">
            <lay-select v-model="chargePerson" placeholder="请选择">
              <lay-select-option
                v-for="item in ordersChargePersonList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </lay-select-option>
            </lay-select>
          </lay-form-item>

          <lay-form-item label="制单人">
            <lay-select v-model="createUser" placeholder="请选择">
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

          <div class="toolbar-btns"></div>
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
        even
        @sort-change="sortChange"
      />
    </lay-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type {
  OrderChargePerson,
  QuotationListResponse,
} from '@/api/orders/orderApi.type';
import type {
  TableColumn,
  TableDefaultToolbar,
} from '@layui/layui-vue/types/component/table/typing';

// 工具栏响应式数据
const typeFilter = ref('projectName');
const quotationNameSearch = ref<string>();
const chargePerson = ref<number>();
const createUser = ref<string>();
const createDate = ref<string>();
const attribute = ref<string>();

// 表格数据
const loading = ref(false);
const dataSource = ref<QuotationListResponse[]>([]);

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
    render: (row: QuotationListResponse) => {
      return getStatus(row.isAudit);
    },
  },
] as TableColumn[];

// 外部获取响应式数据
const ordersChargePersonList = ref<OrderChargePerson[]>();
const ordersCreateUserList = ref<string[]>();

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
      return '驳回'; // 要把文字颜色设置为红色
    case 3:
      return '设计中';
    default:
      return isAudit.toString();
  }
};
</script>

<style scoped lang="scss">
.temp-quote-page {
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
