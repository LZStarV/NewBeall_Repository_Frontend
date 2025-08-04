<template>
  <lay-card class="quotation-edit-card">
    <div v-if="enableCustomerInfo">
      <button class="show-customer-info-btn">
        <SvgIcon
          :name="showCustomerInfo ? 'double_up' : 'double_down'"
          @click="showCustomerInfo = !showCustomerInfo"
        />
      </button>
      <lay-row v-if="showCustomerInfo" :gutter="20">
        <lay-col :xs="24" :md="12">
          <!-- 客户信息模块 -->
          <div class="module-card">
            <div class="module-header">
              <h5>客户信息</h5>
            </div>
            <div class="module-content">
              <div class="form-row">
                <label class="form-head-label">客户单位</label>
                <lay-select v-model="customerInfo.unit" placeholder="请选择">
                  <lay-select-option value="option1" label="选项1" />
                </lay-select>
                <lay-button type="normal" size="md" class="info-button">
                  <SvgIcon name="group_chat" width="16" height="16" />
                  客户详情
                </lay-button>
              </div>
              <div class="form-row">
                <label class="form-head-label">客户地址</label>
                <lay-input v-model="customerInfo.address" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">客户地址</label>
                <lay-input v-model="customerInfo.contact" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">联系电话</label>
                <lay-input v-model="customerInfo.phone" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">客户邮箱</label>
                <lay-input v-model="customerInfo.email" disabled />
                <lay-button
                  type="normal"
                  size="md"
                  class="info-button"
                  @click="showCustomerBankInfo = !showCustomerBankInfo"
                >
                  {{ showCustomerBankInfo ? '收起信息' : '账户信息' }}
                </lay-button>
              </div>
              <div v-show="showCustomerBankInfo" class="bank-info-box">
                <div class="form-row">
                  <label class="form-head-label">银行账号</label>
                  <lay-input v-model="customerInfo.bankAccount" disabled />
                </div>
                <div class="form-row">
                  <label class="form-head-label">开户行</label>
                  <lay-input v-model="customerInfo.bankName" disabled />
                </div>
                <div class="form-row">
                  <label class="form-head-label">税号</label>
                  <lay-input v-model="customerInfo.taxNumber" disabled />
                </div>
              </div>
            </div>
          </div>

          <!-- 项目信息模块 -->
          <div class="module-card">
            <div class="module-header">
              <h5>项目信息</h5>
            </div>
            <div class="module-content">
              <div class="form-row">
                <label class="form-head-label required">项目名称</label>
                <lay-input v-model="projectInfo.name" placeholder="" />
              </div>
              <div class="form-row">
                <label class="form-head-label required">项目负责人</label>
                <lay-select v-model="projectInfo.manager" placeholder="请选择">
                  <lay-select-option value="option1" label="选项1" />
                </lay-select>
              </div>
              <div class="form-row">
                <label class="form-head-label required">报价单类型</label>
                <div class="select-group">
                  <QuoteTypeSelect
                    v-model="projectInfo.quoteType1"
                    :category="1"
                    placeholder="请选择"
                  />
                  <QuoteTypeSelect
                    v-model="projectInfo.quoteType2"
                    :category="2"
                    placeholder="请选择"
                  />
                  <QuoteTypeSelect
                    v-model="projectInfo.quoteType3"
                    :category="3"
                    placeholder="请选择"
                  />
                </div>
              </div>
              <div class="form-row">
                <label class="form-head-label">报价单性质</label>
                <lay-select
                  v-model="projectInfo.nature"
                  placeholder="初步建议阶段"
                >
                  <lay-select-option value="初步建议阶段">
                    初步建议阶段
                  </lay-select-option>
                  <lay-select-option value="顾问设计阶段">
                    顾问设计阶段
                  </lay-select-option>
                  <lay-select-option value="项目投标阶段">
                    项目投标阶段
                  </lay-select-option>
                  <lay-select-option value="设备采购阶段">
                    设备采购阶段
                  </lay-select-option>
                </lay-select>
              </div>
              <div class="form-row">
                <label class="form-head-label">项目备注</label>
                <lay-input v-model="projectInfo.remark" />
              </div>
            </div>
          </div>
        </lay-col>

        <lay-col :xs="24" :md="12">
          <!-- 我司信息模块 -->
          <div class="module-card">
            <div class="module-header">
              <h5>我司信息</h5>
            </div>
            <div class="module-content">
              <div class="form-row">
                <label class="form-head-label">设计单位</label>
                <lay-input v-model="companyInfo.name" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">企业地址</label>
                <lay-input v-model="companyInfo.address" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">联系人员</label>
                <lay-input v-model="companyInfo.contact" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">联系电话</label>
                <lay-input v-model="companyInfo.phone" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">客户邮箱</label>
                <lay-input v-model="companyInfo.email" disabled />
                <lay-button
                  type="normal"
                  size="md"
                  class="info-button"
                  @click="showCompanyBankInfo = !showCompanyBankInfo"
                >
                  {{ showCompanyBankInfo ? '收起信息' : '账户信息' }}
                </lay-button>
              </div>
              <div v-show="showCompanyBankInfo" class="bank-info-box">
                <div class="form-row">
                  <label class="form-head-label">我司银行账号</label>
                  <lay-input v-model="companyInfo.bankAccount" disabled />
                </div>
                <div class="form-row">
                  <label class="form-head-label">我司开户行</label>
                  <lay-input v-model="companyInfo.bankName" disabled />
                </div>
                <div class="form-row">
                  <label class="form-head-label">我司税号</label>
                  <lay-input v-model="companyInfo.taxNumber" disabled />
                </div>
              </div>
            </div>
          </div>

          <!-- 交易信息模块 -->
          <div class="module-card">
            <div class="module-header">
              <h5>交易信息</h5>
            </div>
            <div class="module-content">
              <div class="form-row">
                <label class="form-head-label">交货方式</label>
                <lay-select
                  v-model="tradeInfo.deliveryMethod"
                  placeholder="请选择"
                >
                  <lay-select-option value="">请选择</lay-select-option>
                  <lay-select-option value="货到付款"
                    >货到付款</lay-select-option
                  >
                  <lay-select-option value="款到发货"
                    >款到发货</lay-select-option
                  >
                  <lay-select-option value="其它">其它</lay-select-option>
                </lay-select>
              </div>
              <div class="form-row">
                <label class="form-head-label">交货时间</label>
                <lay-date-picker
                  v-model="tradeInfo.deliveryTime"
                  placeholder="点击选择交货时间"
                  allow-clear
                />
              </div>
              <div class="form-row">
                <label class="form-head-label">交货地点</label>
                <AreaSelect v-model="tradeInfo.area" />
              </div>
              <div class="form-row">
                <label class="form-head-label">详细地址</label>
                <lay-input v-model="tradeInfo.address" placeholder="" />
              </div>
              <div class="form-row">
                <label class="form-head-label">结算方式</label>
                <lay-select
                  v-model="tradeInfo.paymentMethod"
                  placeholder="请选择"
                >
                  <lay-select-option
                    v-for="item in settleList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.method"
                  />
                </lay-select>
              </div>
            </div>
          </div>
        </lay-col>
      </lay-row>
    </div>
    <div v-else>
      * 模块名
      <!-- TODO: 显示简单的报价单信息 -->
    </div>
    <lay-row :gutter="20">
      <div class="module-card">
        <div class="module-header">
          <h5>报价目录</h5>
          <div class="module-header-toolbar">
            <button
              v-for="btn of quotationMenuConfig"
              :key="btn.name"
              class="toolbar-btn"
              :title="btn.name"
              @click="btn.btnAction"
            >
              <SvgIcon :name="btn.iconName" width="1.25rem" height="1.25rem" />
            </button>
          </div>
        </div>
        <div class="module-content">
          <!-- 表格区域 -->
          <AdvancedTable
            :columns="quotationColumns"
            :data-source="quotationData"
            :enable-drag="true"
            :pagination="false"
            :show-toolbar="false"
            :row-key="'id'"
            :responsive="true"
            :clickable="true"
            @update:data-source="handleQuotationDataUpdate"
            @cell-update="handleCellUpdate"
            @row-drag="handleRowDrag"
            @button-click="handleButtonClick"
            @row-click="handleRowClick"
          />
          <!-- 成本统计-->
          <div class="cost-statistics">
            <div class="cost-statistics-item">
              <span class="cost-statistics-item-label">总成本合计（A）: </span>
              <span class="cost-statistics-item-value">0</span>
            </div>
            <div class="cost-statistics-item">
              <span class="cost-statistics-item-label">总成本合计（B）: </span>
              <span class="cost-statistics-item-value">0</span>
            </div>
            <div class="cost-statistics-item">
              <span class="cost-statistics-item-label">毛利率（B-A）/B: </span>
              <span class="cost-statistics-item-value">0</span>
            </div>
          </div>
        </div>
      </div>
    </lay-row>
  </lay-card>
  <SideToolbar />
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';
import QuoteTypeSelect from './QuoteTypeSelect.vue';
import AreaSelect from './AreaSelect.vue';
import AdvancedTable from '@/components/AdvancedTable.vue';
import EditableCell from '@/components/table-cells/EditableCell.vue';
import ImageCell from '@/components/table-cells/ImageCell.vue';
import ButtonCell from '@/components/table-cells/ButtonCell.vue';
import { onMounted, ref, markRaw } from 'vue';
import type { Settle } from '@/api/orders/orderApi.type';
import ordersApi from '@/api/orders/ordersApi';
import SideToolbar from './SideToolbar.vue';
import type { CompanyData } from '@/api/company/companyApi.type';
import companyApi from '@/api/company/companyApi';

// 报价条目数据类型
interface QuotationItem {
  id: number;
  name: Array<{
    label: string;
    type: string;
    size: string;
    action: string;
    customClass?: string;
  }>;
  brand: string;
  model: string;
  feature: Array<{
    label: string;
    type: string;
    size: string;
    action: string;
    customClass?: string;
  }>;
  unit: string;
  quantity: number;
  cost: number;
  costTotal: number;
  price: number;
  priceTotal: number;
  pic: string;
  company: string;
  operation: Array<{
    label: string;
    type: string;
    size: string;
    action: string;
    customStyle?: {
      backgroundColor?: string;
      color?: string;
      borderColor?: string;
      borderRadius?: string;
      padding?: string;
      fontSize?: string;
      fontWeight?: string;
    };
    customClass?: string;
  }>;
}

// 报价目录菜单配置
interface ButtonAction {
  iconName: string; // icon名称
  name: string; // 名称，可以用作title提示
  btnAction: () => void; // 点击按钮将会执行的操作
}

// 响应式数据
const showCustomerBankInfo = ref(false); // 显示客户账户信息
const showCompanyBankInfo = ref(false); // 显示我司账户信息

// 客户信息数据
const customerInfo = ref({
  unit: '',
  address: '',
  contact: '',
  phone: '',
  email: '',
  bankAccount: '',
  bankName: '',
  taxNumber: '',
});

// 我司信息数据
const companyInfo = ref({
  name: '',
  address: '',
  contact: '',
  phone: '',
  email: '',
  bankAccount: '',
  bankName: '',
  taxNumber: '',
});

// 项目信息数据
const projectInfo = ref({
  name: '',
  manager: '',
  quoteType1: '',
  quoteType2: '',
  quoteType3: '',
  nature: '',
  remark: '',
});

// 交易信息数据
const tradeInfo = ref({
  deliveryMethod: '',
  deliveryTime: '',
  area: {
    province: undefined,
    city: undefined,
    area: undefined,
  },
  address: '',
  paymentMethod: '',
});

// 结算方式
const settleList = ref<Settle[]>([]);

// 报价目录表格数据
const quotationColumns = ref([
  {
    title: '编号',
    width: 80,
    key: 'id',
  },
  {
    title: '名称',
    width: 150,
    key: 'name',
    filterable: true,
    customRender: markRaw(ButtonCell), // 名称跳转按钮
  },
  {
    title: '品牌',
    width: 120,
    key: 'brand',
    filterable: true,
  },
  {
    title: '规格型号',
    width: 150,
    key: 'model',
  },
  {
    title: '参数/特点',
    width: 80,
    key: 'feature',
    customRender: markRaw(ButtonCell), // 参数跳转按钮
  },
  {
    title: '单位',
    width: 80,
    key: 'unit',
  },
  {
    title: '数量',
    width: 100,
    key: 'quantity',
    inputType: 'number',
    min: 1,
    step: 1,
    customRender: markRaw(EditableCell),
  },
  {
    title: '成本',
    width: 100,
    key: 'cost',
    sortable: true,
  },
  {
    title: '成本小计',
    width: 120,
    key: 'costTotal',
    sortable: true,
  },
  {
    title: '售价',
    width: 100,
    key: 'price',
    sortable: true,
  },
  {
    title: '售价小计',
    width: 120,
    key: 'priceTotal',
    sortable: true,
  },
  {
    title: '图片',
    width: 80,
    key: 'pic',
    customRender: markRaw(ImageCell),
  },
  {
    title: '操作',
    width: 120,
    key: 'operation',
    customRender: markRaw(ButtonCell),
  },
  {
    title: '公司',
    width: 120,
    key: 'company',
    filterable: true,
  },
]); // 列配置
const quotationData = ref<QuotationItem[]>([
  {
    id: 1,
    name: [
      {
        label: '高精度传感器',
        type: 'custom',
        size: 'xs',
        action: 'custom-action',
        customClass: 'my-custom-button',
      },
    ],
    brand: 'Siemens',
    model: 'XTR-2000',
    feature: [
      {
        label: '参数特性',
        type: 'custom',
        size: 'xs',
        action: 'custom-action',
        customClass: 'my-custom-button',
      },
    ],
    unit: '个',
    quantity: 5,
    cost: 1200.0,
    costTotal: 6000.0,
    price: 1500.0,
    priceTotal: 7500.0,
    pic: '/images/sensor.jpg',
    company: '西门子',
    operation: [
      {
        label: '编辑',
        type: 'primary',
        size: 'xs',
        action: 'edit',
      },
      {
        label: '更多',
        type: 'default',
        size: 'xs',
        action: 'delete',
      },
    ],
  },
  {
    id: 2,
    name: [
      {
        label: '控制器模块',
        type: 'custom',
        size: 'xs',
        action: 'custom-action',
        customClass: 'my-custom-button',
      },
    ],
    brand: 'ABB',
    model: 'AC800M',
    feature: [
      {
        label: '参数特性',
        type: 'custom',
        size: 'xs',
        action: 'custom-action',
        customClass: 'my-custom-button',
      },
    ],
    unit: '套',
    quantity: 2,
    cost: 8500.0,
    costTotal: 17000.0,
    price: 12000.0,
    priceTotal: 24000.0,
    pic: '/images/controller.jpg',
    company: 'ABB集团',
    operation: [
      {
        label: '编辑',
        type: 'primary',
        size: 'xs',
        action: 'edit',
      },
      {
        label: '删除',
        type: 'danger',
        size: 'xs',
        action: 'delete',
      },
    ],
  },
  {
    id: 3,
    name: [
      {
        label: '工业显示屏',
        type: 'custom',
        size: 'xs',
        action: 'custom-action',
        customClass: 'my-custom-button',
      },
    ],
    brand: '研华',
    model: 'TPC-1251H',
    feature: [
      {
        label: '参数特性',
        type: 'custom',
        size: 'xs',
        action: 'custom-action',
        customClass: 'my-custom-button',
      },
    ],
    unit: '台',
    quantity: 3,
    cost: 2800.0,
    costTotal: 8400.0,
    price: 3500.0,
    priceTotal: 10500.0,
    pic: '/images/display.jpg',
    company: '研华科技',
    operation: [
      {
        label: '编辑',
        type: 'primary',
        size: 'xs',
        action: 'edit',
      },
      {
        label: '删除',
        type: 'danger',
        size: 'xs',
        action: 'delete',
      },
    ],
  },
  {
    id: 4,
    name: [
      {
        label: '电源模块',
        type: 'custom',
        size: 'xs',
        action: 'custom-action',
        customClass: 'my-custom-button',
      },
    ],
    brand: 'Phoenix',
    model: 'QUINT4-PS',
    feature: [
      {
        label: '参数特性',
        type: 'custom',
        size: 'xs',
        action: 'custom-action',
        customClass: 'my-custom-button',
      },
    ],
    unit: '个',
    quantity: 8,
    cost: 650.0,
    costTotal: 5200.0,
    price: 900.0,
    priceTotal: 7200.0,
    pic: '/images/power.jpg',
    company: '菲尼克斯',
    operation: [
      {
        label: '编辑',
        type: 'primary',
        size: 'xs',
        action: 'edit',
      },
      {
        label: '删除',
        type: 'danger',
        size: 'xs',
        action: 'delete',
      },
    ],
  },
]); // 数据

// 表格事件处理
const handleQuotationDataUpdate = (data: Record<string, unknown>[]) => {
  quotationData.value = data as unknown as QuotationItem[];
  updateCostStatistics();
};

const handleCellUpdate = (
  rowIndex: number,
  columnKey: string,
  value: unknown,
) => {
  console.log('单元格更新:', { rowIndex, columnKey, value });

  // 如果是数量、成本或售价更新，重新计算小计
  if (['quantity', 'cost', 'price'].includes(columnKey)) {
    const row = quotationData.value[rowIndex];
    if (columnKey === 'quantity' || columnKey === 'cost') {
      row.costTotal = row.quantity * row.cost;
    }
    if (columnKey === 'quantity' || columnKey === 'price') {
      row.priceTotal = row.quantity * row.price;
    }
    updateCostStatistics();
  }
};

const handleRowDrag = (oldIndex: number, newIndex: number) => {
  console.log('行拖拽:', { oldIndex, newIndex });
};

const handleRowClick = (data: Record<string, unknown>, index: number) => {
  console.log('行点击事件:', { data, index });
  // 这里可以添加行点击的业务逻辑，比如：
  // - 高亮选中的行
  // - 显示行详情
  // - 跳转到编辑页面等
};

const handleButtonClick = (
  action: string,
  data: Record<string, unknown>,
  index: number,
) => {
  console.log('按钮操作:', { action, data, index });

  switch (action) {
    case 'edit':
      console.log('编辑产品:', data);
      // 这里可以打开编辑对话框或跳转到编辑页面
      break;
    case 'delete':
      console.log('删除产品:', data);
      // 这里可以显示确认对话框，然后删除数据
      if (confirm(`确定要删除产品 "${data.name}" 吗？`)) {
        const newData = quotationData.value.filter((_, i) => i !== index);
        quotationData.value = newData;
        updateCostStatistics();
      }
      break;
    case 'view':
      console.log('查看产品详情:', data);
      // 这里可以打开产品详情对话框
      break;
    case 'custom-action':
      console.log('自定义按钮操作:', data);
      // 自定义按钮的处理逻辑
      alert(`执行自定义操作: ${data.name}`);
      break;
    default:
      console.log('未知操作:', action);
  }
};

// 更新成本统计
const updateCostStatistics = () => {
  // 这里可以添加成本统计的计算逻辑
  console.log('更新成本统计');
};

onMounted(async () => {
  const res = await ordersApi.getOrdersSettle();
  settleList.value = res.data;
  updateCostStatistics();
});

const {
  showCustomerInfoDefault = true,
  enableCustomerInfo = true,
  quotationMenuConfig = [],
  customerData = [],
  tableListData = [],
} = defineProps<{
  showCustomerInfoDefault?: boolean; // 默认展示顶部客户信息与否，true就默认显示
  enableCustomerInfo?: boolean; // 是否启用顶部客户信息，true就启用，false就显示简单的报价单信息(新建报价模块使用)
  quotationMenuConfig: ButtonAction[]; // 报价目录菜单配置
  customerData?: []; // CustomerData客户信息数据
  tableListData?: []; // 报价目录表单展示
}>();

// 是否显示客户信息面板
const showCustomerInfo = ref(showCustomerInfoDefault);

// 我司信息
const myCompanyInfo = ref<CompanyData>();

const getMyCompanyInfo = async () => {
  const res = await companyApi.getMyCompanyDetailed();
  myCompanyInfo.value = res.data.company;
  companyInfo.value = {
    name: myCompanyInfo.value.companyName,
    address: myCompanyInfo.value.companyAddress,
    contact: myCompanyInfo.value.name,
    phone: myCompanyInfo.value.companyPhone,
    email: myCompanyInfo.value.email,
    bankAccount: myCompanyInfo.value.bankAccount,
    bankName: myCompanyInfo.value.bankName,
    taxNumber: myCompanyInfo.value.taxId,
  };
};

onMounted(() => {
  getMyCompanyInfo();
});
</script>

<style scoped lang="scss">
// 每个子卡片的样式
@mixin form-module {
  padding: 16px;
  box-sizing: border-box;
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

  &.required::before {
    content: '*';
    color: #ff4757;
    margin-right: 4px;
  }
}

@mixin button-style {
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: $primary-color;
  }
}

.quotation-edit-card {
  position: relative;

  .show-customer-info-btn {
    @include button-style;
    color: #949494;
    position: absolute;
    top: 20px;
    left: 0;
    padding: 10px;
    z-index: 10;
  }
}

.module-card {
  @include form-module;
  height: 100%;
}

.module-header {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;

  h5 {
    margin-bottom: 0;
  }

  .module-header-toolbar {
    display: flex;
    gap: 10px;
    align-items: center;

    .toolbar-btn {
      @include button-style;
    }
  }
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

  .display-text {
    flex: 1;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 4px;
    font-size: 14px;
    color: #666;
  }

  .select-group {
    display: flex;
    gap: 8px;
    flex: 1;
    width: calc(100% - 100px - 16px);
  }

  // 输入框和选择框样式
  :deep(.layui-input),
  :deep(.layui-select),
  :deep(.layui-date-picker) {
    flex: 1;
  }

  .bank-info-box {
    margin-top: 10px;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #f0f0f0;

    .form-head-label {
      min-width: calc(80px - 10px);
    }
  }

  .select-group {
    display: flex;
    gap: 12px;
    flex: 1;
    align-items: flex-start;

    :deep(.layui-select) {
      flex: 1;
      min-width: 0; // 允许flex shrink
    }
  }

  .cost-statistics {
    display: flex;
    gap: 60px;
    margin-top: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;

    .cost-statistics-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .cost-statistics-item-label {
        font-weight: 500;
        color: #333;
      }

      .cost-statistics-item-value {
        font-weight: 600;
        color: #007bff;
        font-size: 16px;
      }
    }
  }
}
</style>
