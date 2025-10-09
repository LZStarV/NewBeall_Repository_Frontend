<template>
  <div class="production-list-page">
    <!-- 按subprojectClass分组显示的子表格 -->
    <div v-for="(group, index) in groupedData" :key="group.subprojectClass || 'empty'" class="sub-table-group">
      <!-- 子表格标题 -->
      <div v-if="shouldShowTitle()" class="sub-table-title">
        {{ group.subprojectName || group.subprojectClass }}
      </div>

      <!-- 子表格 -->
      <lay-table :columns="columns" :data-source="group.items" :default-toolbar="index === 0 ? defaultToolbars : []"
        :loading="loading" :pagination="false" even @sort-change="(key, sort) => sortChange(key, sort, index)">

        <!-- 图片列自定义渲染 -->
        <template #image="{ row }">
          <div class="product-image">
            <img v-if="row.pictureaddress" :src="env.getBaseStaticUrl() + row.pictureaddress" :alt="row.name"
              class="product-img" @click="previewImage(row.pictureaddress)" />
            <span v-else class="no-image">暂无图片</span>
          </div>
        </template>

        <!-- 单价列自定义渲染 -->
        <template #unitPrice="{ row }">
          <span class="price-text">¥{{ (isNaN(parseFloat(row.profitprice || 0)) ? 0 : parseFloat(row.profitprice ||
            0)).toFixed(2) }}</span>
        </template>

        <!-- 总金额列自定义渲染 -->
        <template #totalAmount="{ row }">
          <span class="price-text total-amount">
            ¥{{ isNaN(parseFloat(row.totalAmount)) ? '0.00' : parseFloat(row.totalAmount).toFixed(2) }}
          </span>
        </template>
      </lay-table>
    </div>

    <!-- 总售价合计行 -->
    <div v-if="groupedData.length > 0" class="total-price-summary">
      <div class="total-price-row">
        <span class="total-price-label">(¥)总售价合计：</span>
        <span class="total-price-value">¥{{ totalSalesPrice }}</span>
      </div>
    </div>

    <!-- 分页组件 -->
    <div v-if="pagination.total > 0" class="pagination-wrapper">
      <lay-page :current="pagination.current" :limit="pagination.pageSize" :total="pagination.total"
        @change="handlePagination" show-count show-limit show-page show-skip />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import type {
  TableColumn,
  TableDefaultToolbar,
} from '@layui/layui-vue/types/component/table/typing';
import ordersApi from '@/api/orders/ordersApi';
import type { OrderProduct } from '@/api/product/productApi.type';
import env from '@/utils/env';
import { layer } from '@layui/layui-vue';

// Props定义
const props = defineProps<{
  orderId?: string;
}>();

// 产品数据类型定义 - 扩展OrderProduct类型，添加totalAmount属性
type ProductionItem = OrderProduct & {
  totalAmount: string;
};

// 表格数据
const loading = ref(false);
const dataSource = ref<ProductionItem[]>([]);

// 分组数据类型定义
interface GroupedData {
  subprojectClass: string;
  subprojectName: string;
  items: ProductionItem[];
}

// 分组后的数据
const groupedData = ref<GroupedData[]>([]);

// 总售价
const totalSalesPrice = ref<string>('0.00');

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});

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

// 图片预览
const previewImage = (img: string | { url: string }) => {
  // TODO: 实现图片预览功能
  const imageUrl = typeof img === 'string' ? img : img.url;
  layer.photos({
    imgList: [{ src: env.getBaseStaticUrl() + imageUrl, alt: '产品图片' }],
  });
};


// 表格列配置 - 根据Product类型调整
const columns = [
  { title: '', width: '20px', type: 'checkbox', fixed: 'left' as const },
  {
    title: '序号',
    width: '80px',
    type: 'number',
  },
  {
    title: '产品编号',
    width: '150px',
    key: 'productId',
    ellipsisTooltip: true,
    hide: true,
  },
  {
    title: '公司',
    width: '150px',
    key: 'gysource',
    hide: true,
  },
  {
    title: '产品名称',
    width: '200px',
    key: 'name',
  },
  {
    title: '品牌',
    width: '120px',
    key: 'brand',
  },
  {
    title: '型号/规格',
    width: '150px',
    key: 'model',
    ellipsisTooltip: true,
  },
  {
    title: '产品特点',
    width: '200px',
    key: 'trait',
    ellipsisTooltip: true,
    hide: true,
  },
  {
    title: '参数详情',
    width: '200px',
    key: 'param',
    ellipsisTooltip: true,
  },
  {
    title: '单位',
    width: '80px',
    key: 'unit',
  },
  {
    title: '数量',
    width: '80px',
    key: 'num',
  },
  {
    title: '单价(¥)',
    width: '100px',
    key: 'profitprice',
    customSlot: 'unitPrice',
  },
  {
    title: '总金额',
    width: '120px',
    key: 'totalAmount',
    customSlot: 'totalAmount',
  },
  {
    title: '图片',
    width: '80px',
    key: 'pictureaddress',
    customSlot: 'image',
  },
  {
    title: '备注',
    width: '200px',
    key: 'remark',
    ellipsisTooltip: true,
    hide: true,
  },
] as TableColumn[];

// 数据分组处理函数
const groupDataBySubprojectClass = (data: ProductionItem[]): GroupedData[] => {
  const groups = new Map<string, ProductionItem[]>();
  const subprojectNames = new Map<string, string>();

  // 按subprojectClass分组
  data.forEach(item => {
    const key = item.subprojectClass || '';
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);

    // 记录subproject名称（同一分类下可能只有一个有名称）
    if (item.subproject && !subprojectNames.has(key)) {
      subprojectNames.set(key, item.subproject);
    }
  });

  // 转换为GroupedData数组
  const result: GroupedData[] = [];
  groups.forEach((items, subprojectClass) => {
    result.push({
      subprojectClass,
      subprojectName: subprojectNames.get(subprojectClass) || '',
      items
    });
  });

  return result;
};

// 判断是否显示标题
const shouldShowTitle = (): boolean => {
  // 特殊处理：当数据中仅存在一个subprojectClass且其值为空时，不显示子表格标题
  return groupedData.value.length > 1;
};

// 计算总售价
const calculateTotalSalesPrice = (): void => {
  let total = 0;

  // 遍历所有分组数据
  groupedData.value.forEach(group => {
    group.items.forEach((item) => {
      // 累加每个产品的总金额，处理NaN值
      const amount = parseFloat(item.totalAmount || '0');
      total += isNaN(amount) ? 0 : amount;
    });
  });

  // 更新总售价，保留两位小数，处理NaN值
  totalSalesPrice.value = isNaN(total) ? '0.00' : total.toFixed(2);
};

// 排序处理 - 支持分组
const sortChange = (key: string, sort: string, groupIndex: number) => {
  const group = groupedData.value[groupIndex];
  if (!group) return;

  group.items.sort((a: ProductionItem, b: ProductionItem) => {
    if (sort === 'asc') {
      switch (key) {
        case 'profitprice':
          const aProfitPrice = parseFloat(a.profitprice || '0');
          const bProfitPrice = parseFloat(b.profitprice || '0');
          return (isNaN(aProfitPrice) ? 0 : aProfitPrice) - (isNaN(bProfitPrice) ? 0 : bProfitPrice);
        case 'num':
          const aNum = Number(a.num || 0);
          const bNum = Number(b.num || 0);
          return (isNaN(aNum) ? 0 : aNum) - (isNaN(bNum) ? 0 : bNum);
        case 'price':
          const aPrice = Number(a.price || 0);
          const bPrice = Number(b.price || 0);
          return (isNaN(aPrice) ? 0 : aPrice) - (isNaN(bPrice) ? 0 : bPrice);
        default:
          return 0;
      }
    } else {
      switch (key) {
        case 'profitprice':
          const aProfitPrice = parseFloat(a.profitprice || '0');
          const bProfitPrice = parseFloat(b.profitprice || '0');
          return (isNaN(bProfitPrice) ? 0 : bProfitPrice) - (isNaN(aProfitPrice) ? 0 : aProfitPrice);
        case 'num':
          const aNum = Number(a.num || 0);
          const bNum = Number(b.num || 0);
          return (isNaN(bNum) ? 0 : bNum) - (isNaN(aNum) ? 0 : aNum);
        case 'price':
          const aPrice = Number(a.price || 0);
          const bPrice = Number(b.price || 0);
          return (isNaN(bPrice) ? 0 : bPrice) - (isNaN(aPrice) ? 0 : aPrice);
        default:
          return 0;
      }
    }
  });

  // 排序后重新计算总售价
  calculateTotalSalesPrice();
};

// 获取产品列表
const getProductionList = async () => {
  if (!props.orderId) {
    console.warn('orderId is required to fetch product list');
    return;
  }

  try {
    loading.value = true;
    const response = await ordersApi.getOrderProductList(
      props.orderId,
      pagination.current,
      pagination.pageSize
    ) as unknown as { count: number; data: OrderProduct[] };

    console.log(response.data);

    if (response && Array.isArray(response.data)) {
      // 为每个产品添加计算的总金额，处理NaN值
      dataSource.value = response.data.map((item, index) => {
        const num = parseFloat(item.num.toString());
        const profitPrice = parseFloat(item.profitprice);
        const safeNum = isNaN(num) ? 0 : num;
        const safeProfitPrice = isNaN(profitPrice) ? 0 : profitPrice;
        const totalAmount = safeNum * safeProfitPrice;

        return {
          ...item,
          index: (pagination.current - 1) * pagination.pageSize + index + 1,
          totalAmount: isNaN(totalAmount) ? '0.00' : totalAmount.toFixed(2)
        } as ProductionItem;
      });

      // 按subprojectClass分组数据
      groupedData.value = groupDataBySubprojectClass(dataSource.value);

      // 计算总售价
      calculateTotalSalesPrice();

      // 更新总数，处理NaN值
      const totalCount = Number(response.count);
      pagination.total = isNaN(totalCount) ? 0 : totalCount;
    }
  } catch (error) {
    console.error('获取产品列表失败:', error);
    dataSource.value = [];
    groupedData.value = [];
    pagination.total = 0;
    totalSalesPrice.value = '0.00';
  } finally {
    loading.value = false;
  }
};

// 处理刷新
const handleRefresh = () => {
  // 重置搜索条件
  pagination.current = 1;
  getProductionList();
};

// 处理分页
const handlePagination = (e: { current: number; pageSize: number }) => {
  // 处理NaN值，确保分页参数的安全性
  const current = Number(e.current);
  const pageSize = Number(e.pageSize);

  pagination.current = isNaN(current) || current < 1 ? 1 : current;
  pagination.pageSize = isNaN(pageSize) || pageSize < 1 ? 10 : pageSize;
  getProductionList();
};

// 监听orderId变化
watch(
  () => props.orderId,
  (newOrderId) => {
    if (newOrderId) {
      pagination.current = 1;
      getProductionList();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.orderId) {
    getProductionList();
  }
});
</script>

<style scoped lang="scss">
.production-list-page {
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

  // 子表格分组样式
  .sub-table-group {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  // 子表格标题样式
  .sub-table-title {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-bottom: none;
    padding: 12px 16px;
    font-weight: 600;
    font-size: 14px;
    color: #495057;
    border-radius: 4px 4px 0 0;
  }

  // 总售价合计样式
  .total-price-summary {
    margin-top: 20px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    background: #f8f9fa;

    .total-price-row {
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 600;

      .total-price-label {
        color: #495057;
      }

      .total-price-value {
        color: #dc3545;
        font-size: 18px;
        font-weight: 700;
      }
    }
  }

  // 分页组件样式
  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  // 产品名称链接样式
  .product-name-link {
    color: $primary-color;
    cursor: pointer;
    text-decoration: none;
  }

  // 产品图片样式
  .product-image {
    display: flex;
    justify-content: center;
    align-items: center;

    .product-img {
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.1);
      }
    }

    .no-image {
      color: #999;
      font-size: 12px;
    }
  }

  // 价格文本样式
  .price-text {
    font-weight: 500;
    color: #333;

    &.total-amount {
      color: $primary-color;
      font-weight: 600;
    }
  }

  @media (max-width: $desktop_layout_breakpoint) {
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
