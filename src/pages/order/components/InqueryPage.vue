<template>
  <div class="inquery-page">
    <table class="inquery-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :class="column.class" :style="getColumnStyle(column.key)">
            <template v-if="column.key === 'checkbox'">
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
            </template>
            <template v-else>
              {{ column.title }}
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(product, productIndex) in productData" :key="productIndex">
          <!-- 一级行：产品标题行 -->
          <tr class="product-header-row">
            <td :colspan="columns.length">{{ product.pName }}</td>
          </tr>
          <template v-for="(item, itemIndex) in product.productDataList" :key="`${productIndex}-${itemIndex}`">
            <!-- 主行 -->
            <tr :class="{
              'selected-row': selectedRows[productIndex] === itemIndex,
              'original-quote': item.companyName === '原报价单'
            }">
              <td v-for="column in columns" :key="`${productIndex}-${itemIndex}-${column.key}`" :class="column.class"
                :style="getColumnStyle(column.key)">
                <template v-if="column.key === 'checkbox'">
                  <input type="radio" v-if="item.companyName !== '原报价单'"
                    :checked="selectedRows[productIndex] === itemIndex"
                    @change="handleRowSelect(productIndex, itemIndex)" />
                </template>
                <template v-else-if="column.key === 'subtotal'">
                  {{ calculateSubtotal(item) }}
                </template>
                <template v-else>
                  {{ (item as any)[column.key] }}
                </template>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
    <div class="action-buttons">
      <lay-button type="primary" @click="submitReplacement">提交替换</lay-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from 'vue';
import type { InquryProductData } from '@/api/inquery/inqueryApi.type';
import inqueryApi from '@/api/inquery/inqueryApi';
import notify from '@/utils/notify';

// 定义组件接收的属性
const props = defineProps<{
  orderId: string;
  productData: InquryProductData[];
  columnWidths?: Record<string, string | number>;
  customColumns?: Array<{
    key: string;
    title: string;
    class?: string;
  }>;
}>();

// 选中行的状态 - 修改为每个产品只能选择一个报价
const selectedRows = ref<Record<number, number>>({});
const selectAll = ref(false);

// 默认列配置
const defaultColumns = [
  { key: 'checkbox', title: '', class: 'checkbox-column' },
  { key: 'companyName', title: '报价公司' },
  { key: 'name', title: '产品名称' },
  { key: 'brand', title: '品牌' },
  { key: 'model', title: '规格/型号' },
  { key: 'trait', title: '参数特征' },
  { key: 'nub', title: '数量' },
  { key: 'price', title: '单价' },
  { key: 'subtotal', title: '小计' }
];

// 列配置
const columns = computed(() => {
  if (props.customColumns && props.customColumns.length > 0) {
    return props.customColumns;
  }
  return defaultColumns;
});

// 列宽配置
const defaultColumnWidths = {
  checkbox: '20px',
  companyName: '30%',
  name: '15%',
  brand: '10%',
  model: '15%',
  trait: '60%',
  nub: '8%',
  price: '10%',
  subtotal: '12%'
};

// 获取列宽样式
const getColumnStyle = (columnName: string) => {
  if (props.columnWidths && props.columnWidths[columnName]) {
    return {
      width: typeof props.columnWidths[columnName] === 'number'
        ? `${props.columnWidths[columnName]}px`
        : props.columnWidths[columnName]
    };
  }
  return { width: defaultColumnWidths[columnName as keyof typeof defaultColumnWidths] || 'auto' };
};

// 计算小计（数量 * 单价）
const calculateSubtotal = (item: any) => {
  const price = parseFloat(item.price);
  const quantity = item.nub;
  if (!isNaN(price) && !isNaN(quantity)) {
    return (price * quantity).toFixed(2);
  }
  return '0.00';
};

// 切换全选状态
const toggleSelectAll = () => {
  const newState = selectAll.value;

  // 如果是全选，则为每个产品选择第一个非原报价单的选项
  if (newState) {
    props.productData.forEach((product, productIndex) => {
      // 查找第一个非原报价单的项目
      const firstSelectableIndex = product.productDataList.findIndex(item => item.companyName !== '原报价单');
      if (firstSelectableIndex !== -1) {
        selectedRows.value[productIndex] = firstSelectableIndex;
      }
    });
  } else {
    // 取消全选，清空所有选择
    selectedRows.value = {};
  }
};

// 处理行选择
const handleRowSelect = (productIndex: number, itemIndex: number) => {
  // 如果点击已选中的行，则取消选择
  if (selectedRows.value[productIndex] === itemIndex) {
    delete selectedRows.value[productIndex];
  } else {
    // 否则选中该行
    selectedRows.value[productIndex] = itemIndex;
  }

  // 检查是否所有产品都有选择
  let allSelected = true;
  let hasSelectableProducts = false;

  props.productData.forEach((product, pIndex) => {
    // 检查该产品是否有可选项
    const hasSelectableItems = product.productDataList.some(item => item.companyName !== '原报价单');

    if (hasSelectableItems) {
      hasSelectableProducts = true;
      // 如果该产品没有选中任何行，则不是全选
      if (selectedRows.value[pIndex] === undefined) {
        allSelected = false;
      }
    }
  });

  // 只有在有可选产品的情况下才更新全选状态
  if (hasSelectableProducts) {
    selectAll.value = allSelected;
  }
};

const emit = defineEmits(['close']);

// 提交替换按钮点击处理
const submitReplacement = async () => {
  const inquryProductList: Array<{
    oldProId: string;
    newProId: string;
    orderId: string;
  }> = [];

  // 遍历所有产品
  props.productData.forEach((product, productIndex) => {
    // 如果该产品有选中的行
    if (selectedRows.value[productIndex] !== undefined) {
      // 查找原报价单
      const originalQuoteIndex = product.productDataList.findIndex(item => item.companyName === '原报价单');

      if (originalQuoteIndex !== -1) {
        const oldProId = product.productDataList[originalQuoteIndex].proId;
        const newProId = product.productDataList[selectedRows.value[productIndex]].proId;
        const orderId = product.productDataList[selectedRows.value[productIndex]].ordersId;

        inquryProductList.push({
          oldProId,
          newProId,
          orderId
        });
      }
    }
  });

  // 输出到控制台
  const res = await inqueryApi.replaceInqueryProduct({ inquryProductList, yOrderId: props.orderId });
  if (res) {
    notify.success(res.data);
    emit('close');
  }
};

// 组件挂载时初始化
onMounted(() => {
  console.log('InqueryPage mounted with orderId:', props.orderId);
});
</script>

<style lang="scss" scoped>
@use '@/styles/table/tables' as *;

.inquery-page {
  width: 100%;
  overflow-x: auto;
}

.inquery-table-container {
  margin: 20px 0;
}

.inquery-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  font-size: 14px;
}

.inquery-table th,
.inquery-table td {
  padding: 10px;
  border: none;
}

.inquery-table th {
  background-color: $table-header-bg;
  font-weight: bold;
  text-align: center;
}

.inquery-table tr:not(.product-header-row) td {
  text-align: center;
}

.checkbox-column {
  width: 50px;
  text-align: center;
}

/* 自定义 checkbox 和 radio 样式 */
input[type="checkbox"],
input[type="radio"] {
  appearance: none;
  width: 14px;
  height: 14px;
  border: 1px solid #ddd;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  vertical-align: middle;
}

input[type="radio"] {
  border-radius: 50%;
}

input[type="checkbox"]:checked,
input[type="radio"]:checked {
  background-color: $primary-color;
  border-color: $primary-color;
}

input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: white;
}

/* 一级行样式 - 绿色背景 */
.product-header-row {
  background-color: #e6f7e6;
  font-weight: bold;
}

.product-header-row td {
  padding: 12px 10px;
  text-align: left;
}

/* 原报价单行样式 - 蓝色背景 */
.original-quote {
  background-color: #e6f0ff;
}

/* 选中行样式 */
.selected-row {
  background-color: #fff8e6;
}

/* 斑马条纹样式 */
.inquery-table tr:not(.product-header-row):not(.original-quote):nth-child(even) {
  background-color: $light-blue-background-color;
}

/* 为所有行添加圆角 */
.inquery-table tr {
  border-radius: $border-radius-large;
}

.inquery-table tr>td:first-child {
  border-top-left-radius: $border-radius-large;
  border-bottom-left-radius: $border-radius-large;
}

.inquery-table tr>td:last-child {
  border-top-right-radius: $border-radius-large;
  border-bottom-right-radius: $border-radius-large;
}

/* 按钮样式 */
.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .inquery-table {
    font-size: 12px;
  }

  .inquery-table th,
  .inquery-table td {
    padding: 8px 5px;
  }
}
</style>
