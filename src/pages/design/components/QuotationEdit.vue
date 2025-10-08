<template>
  <lay-card class="quotation-edit-card">
    <div v-if="enableCustomerInfo">
      <button class="show-customer-info-btn">
        <SvgIcon :name="showCustomerInfo ? 'double_up' : 'double_down'" @click="showCustomerInfo = !showCustomerInfo" />
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
                <lay-select placeholder="请选择" v-model="customerName" @change="handleClientChange">
                  <lay-select-option v-for="client of clientInfoList" :key="client.id" :value="client"
                    :label="client.contacts" />
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
                <label class="form-head-label">联系人员</label>
                <lay-input v-model="customerInfo.contact" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">联系电话</label>
                <lay-input v-model="customerInfo.phone" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">客户邮箱</label>
                <lay-input v-model="customerInfo.email" disabled />
                <lay-button type="normal" size="md" class="info-button"
                  @click="showCustomerBankInfo = !showCustomerBankInfo">
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
                  <lay-select-option v-for="item in projectManagerList" :key="item.id" :value="item.id"
                    :label="item.name" />
                </lay-select>
              </div>
              <div class="form-row">
                <label class="form-head-label required">报价单类型</label>
                <div class="select-group">
                  <QuoteTypeSelect v-model="projectInfo.quoteType1" :category="1" placeholder="请选择" />
                  <QuoteTypeSelect v-model="projectInfo.quoteType2" :category="2" placeholder="请选择" />
                  <QuoteTypeSelect v-model="projectInfo.quoteType3" :category="3" placeholder="请选择" />
                </div>
              </div>
              <div class="form-row">
                <label class="form-head-label">报价单性质</label>
                <lay-select v-model="projectInfo.nature" placeholder="初步建议阶段">
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
                <lay-button type="normal" size="md" class="info-button"
                  @click="showCompanyBankInfo = !showCompanyBankInfo">
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
                <lay-select v-model="tradeInfo.deliveryMethod" placeholder="请选择">
                  <lay-select-option value="">请选择</lay-select-option>
                  <lay-select-option value="货到付款">
                    货到付款
                  </lay-select-option>
                  <lay-select-option value="款到发货">
                    款到发货
                  </lay-select-option>
                  <lay-select-option value="其它">其它</lay-select-option>
                </lay-select>
              </div>
              <div class="form-row">
                <label class="form-head-label">交货时间</label>
                <lay-date-picker v-model="tradeInfo.deliveryTime" placeholder="点击选择交货时间" allow-clear />
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
                <lay-select v-model="tradeInfo.paymentMethod" placeholder="请选择">
                  <lay-select-option v-for="item in settleList" :key="item.id" :value="item.id" :label="item.method" />
                </lay-select>
              </div>
            </div>
          </div>
        </lay-col>
      </lay-row>
    </div>
    <div v-else>
      <!-- 显示简单的报价单信息 -->
      <lay-row v-if="showCustomerInfo" :gutter="20">
        <lay-col :xs="24" :md="12">
          <!-- 客户信息模块 -->
          <div class="module-card">
            <div class="module-content">
              <div class="form-row">
                <label class="form-head-label required">模块名</label>
                <lay-input v-model="modelInfo.name" />
              </div>
              <div class="form-row">
                <label class="form-head-label">供应商信息</label>
                <lay-select v-model="modelInfo.gyClient" placeholder="请选择">
                  <lay-select-option value="option1" label="选项1" />
                </lay-select>
                <lay-button type="normal" size="md" class="info-button">
                  供应商
                </lay-button>
                <lay-button type="normal" size="md" class="info-button">
                  详情
                </lay-button>
              </div>
            </div>
          </div>
        </lay-col>
        <lay-col :xs="24" :md="12">
          <!-- 客户信息模块 -->
          <div class="module-card">
            <div class="module-content">
              <div class="form-row">
                <QuoteTypeSelect v-model="modelInfo.ordersType1" :category="1"
                  :orders-id="enableCustomerInfo ? '' : modelData.ordersId" placeholder="请选择" />
                <QuoteTypeSelect v-model="modelInfo.ordersType3" :category="3"
                  :orders-id="enableCustomerInfo ? '' : modelData.ordersId" placeholder="请选择" />
              </div>
            </div>
          </div>
        </lay-col>
      </lay-row>
    </div>
    <lay-row :gutter="20">
      <div class="module-card">
        <div class="module-header">
          <h5>报价目录</h5>
          <div class="module-header-toolbar">
            <button v-for="btn of quotationMenuConfig" :key="btn.name" class="toolbar-btn" :title="btn.name"
              @click="btn.btnAction">
              <SvgIcon :name="btn.iconName" width="1.25rem" height="1.25rem" />
            </button>
          </div>
        </div>
        <div class="module-content">
          <!-- 表格区域 -->
          <AdvancedTable :columns="quotationColumns" :data-source="quotationData as Record<string, unknown>[]"
            :enable-drag="true" :pagination="false" :show-toolbar="false" :row-key="'id'" :responsive="true"
            :clickable="true" @update:data-source="handleQuotationDataUpdate" @cell-update="handleCellUpdate"
            @row-drag="handleRowDrag" @button-click="handleButtonClick" @row-click="handleRowClick" />
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

  <!-- 新建子项目 drawer -->
  <SubProjectDrawer v-model:visible="showSubProjectDrawer" @submit="handleSubProjectSubmit" />

  <!-- 产品利率输入弹窗 -->
  <ProductInterestRateDialog v-model:visible="showProductInterestRateDialog"
    @confirm="handleProductInterestRateConfirm" />
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';
import QuoteTypeSelect from './QuoteTypeSelect.vue';
import AreaSelect from './AreaSelect.vue';
import AdvancedTable from '@/components/AdvancedTable.vue';
import EditableCell from '@/components/table-cells/EditableCell.vue';
import ImageCell from '@/components/table-cells/ImageCell.vue';
import ButtonCell from '@/components/table-cells/ButtonCell.vue';
import SubProjectAddCell from '@/components/table-cells/SubProjectAddCell.vue';
import SubProjectDrawer from './SubProjectDrawer.vue';
import ProductInterestRateDialog from './ProductInterestRateDialog.vue';
import { onMounted, ref, markRaw } from 'vue';
import type {
  OrderModuleListResponse,
  QuotationListResponse,
  Settle,
  Quotation,
  OrderChargePerson,
  OrderDetail,
} from '@/api/orders/orderApi.type';
import {
  orderDetailsToQuotationItems,
  quotationItemsToOrderDetails,
  type QuotationItem,
} from '@/utils/orderUtils';
import { getAreaNames, getQuoteTypeName } from '@/utils/areaUtils';
import ordersApi from '@/api/orders/ordersApi';
import SideToolbar from './SideToolbar.vue';
import type { CompanyData } from '@/api/company/companyApi.type';
import companyApi from '@/api/company/companyApi';
import { layer } from '@layui/layui-vue';
import notify from '@/utils/notify';
import type { ClientType } from '@/api/client/clinetApi.type';
import clientApi from '@/api/client/clinetApi';

// 使用从 orderUtils 导入的 QuotationItem 类型

// 报价目录菜单配置
interface ButtonAction {
  iconName: string; // icon名称
  name: string; // 名称，可以用作title提示
  btnAction: () => void; // 点击按钮将会执行的操作
}

// 响应式数据
const showCustomerBankInfo = ref(false); // 显示客户账户信息
const showCompanyBankInfo = ref(false); // 显示我司账户信息
const hasSubItemStatusSet = ref(false); // 是否设置子项目状态

// 客户信息数据
const customerInfo = ref({
  name: '',
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
    province: undefined as number | undefined,
    city: undefined as number | undefined,
    area: undefined as number | undefined,
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
    customRender: markRaw(SubProjectAddCell), // 使用子项目新增按钮单元格
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

const quotationData = ref<QuotationItem[]>([]); // 数据

// 子项目相关状态
const showSubProjectDrawer = ref(false);
// const subProjects = ref<
//   Array<{
//     id: string;
//     name: string;
//     level: string;
//     color: string;
//     parentId?: string;
//   }>
// >([]);
const showProductInterestRateDialog = ref(false);

// 报价单模块数据
const modelInfo = ref({
  name: '',
  gyClient: '',
  ordersType1: '',
  ordersType3: '',
});

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
    if (!quotationData.value) return; // 空表不计
    const row = quotationData.value[rowIndex] as Record<string, unknown>;
    if (columnKey === 'quantity' || columnKey === 'cost') {
      row.costTotal = (row.quantity as number) * (row.cost as number);
    }
    if (columnKey === 'quantity' || columnKey === 'price') {
      row.priceTotal = (row.quantity as number) * (row.price as number);
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
    case 'add-sub-project':
      handleSubProjectAdd();
      break;
    case 'delete-sub-project':
      handleDeleteSubProject(data, index);
      break;
    case 'edit':
      console.log('产品修改详情:', data);
      // 这里可以打开编辑对话框或跳转到编辑页面
      break;
    case 'delete':
      {
        const typedData = data as Record<string, unknown>;
        if (Array.isArray(typedData.name) && typedData.name.length > 0) {
          // 显示确认对话框，然后删除数据
          layer.confirm(
            `确定要删除产品 "${(typedData.name as Array<{ label: string }>)[0].label}" 吗？`,
            {
              btn: [
                {
                  text: '确定',
                  callback: async (id) => {
                    if (!quotationData.value) return;
                    const newData = quotationData.value.filter(
                      (_, i) => i !== index,
                    );
                    quotationData.value = newData;
                    updateCostStatistics();
                    layer.close(id);
                    notify.success('删除产品成功');
                  },
                },
                {
                  text: '取消',
                  callback: (id) => {
                    layer.close(id);
                  },
                },
              ],
            },
          );
        }
      }
      break;
    case 'view':
      console.log('查看产品参数特征:', data);
      // 打开产品参数特征侧边栏
      layer.drawer({
        title: '参数特征',
        content: {},
        offset: 'r',
      });
      break;
    case 'custom-action':
      {
        console.log('自定义按钮操作:', data);
        // 自定义按钮的处理逻辑
        const typedData = data as Record<string, unknown>;
        alert(`执行自定义操作: ${typedData.name}`);
      }
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

// 处理子项目新增按钮点击
const handleSubProjectAdd = () => {
  if (hasSubItemStatusSet.value) {
    // 直接打开输入预设产品利率窗口
    showProductInterestRateDialog.value = true;
    return;
  }
  hasSubItemStatusSet.value = true;
  layer.confirm('本次报价是否需要新建子项目？', {
    btn: [
      {
        text: '是',
        callback: async (id) => {
          layer.close(id);
          showSubProjectDrawer.value = true;
        },
      },
      {
        text: '否',
        callback: (id) => {
          layer.close(id);
          // 打开输入预设产品利率窗口
          showProductInterestRateDialog.value = true;
        },
      },
    ],
  });
};

// 处理子项目提交
const handleSubProjectSubmit = (subProjectData: {
  name: string;
  level: string;
  color: string;
  parentId?: string;
}) => {
  type LevelType = 'level1' | 'level2' | 'level3'

  const getSubprojectClass = (level: LevelType) => {
    return `sprojects${level.slice(-1)}`
  }

  const getSubprojectLevel = (level: LevelType) => {
    switch (level) {
      case 'level1':
        return 'oneColor';
      case 'level2':
        return 'secondColor';
      case 'level3':
        return 'threeColor';
    }
  };

  // 添加子项目到表格
  const subProjectRow = {
    id: `sub_${Date.now()}`,
    name: subProjectData.name,
    brand: '',
    model: '',
    feature: '',
    unit: '',
    quantity: 1,
    cost: 0,
    costTotal: 0,
    price: 0,
    priceTotal: 0,
    pic: '',
    company: '',
    isSubProject: true,
    subProjectData: subProjectData,
    backgroundColor: subProjectData.color, // 用于背景色显示
    encryptId: '',
    productId: 'EMPTY0000000000000',
    subproject: subProjectData.name,
    subprojectClass: getSubprojectClass(subProjectData.level as LevelType),
    subprojectColor: subProjectData.color,
    subprojectLevel: getSubprojectLevel(subProjectData.level as LevelType),
    subprojectParent: subProjectData.parentId || '',
  };

  quotationData.value.push(subProjectRow as unknown as QuotationItem);
  showSubProjectDrawer.value = false;
  notify.success('子项目创建成功');
};

// 删除子项目
const handleDeleteSubProject = (
  data: Record<string, unknown>,
  index: number,
) => {
  layer.confirm(`确定要删除子项目 "${data.name}" 吗？`, {
    btn: [
      {
        text: '确定',
        callback: async (id) => {
          if (!quotationData.value) return;
          quotationData.value.splice(index, 1);
          updateCostStatistics();
          layer.close(id);
          notify.success('子项目删除成功');
        },
      },
      {
        text: '取消',
        callback: (id) => {
          layer.close(id);
        },
      },
    ],
  });
};

// 处理产品利率确认
const handleProductInterestRateConfirm = (data: {
  interestRate?: number;
  useDefaultPrice: boolean;
}) => {
  console.log('产品利率确认:', data);

  if (data.useDefaultPrice) {
    notify.success('已选择使用默认市场指导价');
  } else {
    notify.success(`已设置产品利率为 ${data.interestRate}%`);
  }

  // TODO: 这里应该打开产品选择窗口
  // 预留函数，稍后实现产品选择窗口
  openProductSelectionWindow(data);
};

// 打开产品选择窗口（预留函数）
const openProductSelectionWindow = (interestRateData: {
  interestRate?: number;
  useDefaultPrice: boolean;
}) => {
  console.log('打开产品选择窗口:', interestRateData);
  // TODO: 实现产品选择窗口
  // 这里可以：
  // 1. 打开一个新的弹窗或抽屉
  // 2. 根据利率数据过滤产品
  // 3. 让用户选择产品
  notify.info('产品选择窗口功能待实现');
};

// 初始化空白行
const initEmptyRow = () => {
  const emptyRow = {
    id: '',
    name: '未选产品',
    brand: '',
    model: '',
    feature: '',
    unit: '',
    quantity: undefined,
    cost: undefined,
    costTotal: undefined,
    price: undefined,
    priceTotal: undefined,
    pic: undefined,
    company: '',
    isSubProject: true, // 设置为子项目行，这样编号列会显示新增按钮
    isUtilRow: true, // 标识为工具行，用于处理删除等操作，不会被提交
  };
  return emptyRow as unknown as QuotationItem;
};

onMounted(async () => {
  const res = await ordersApi.getOrdersSettle();
  settleList.value = res.data;

  // 初始化时添加一个空白的子项目行
  if (quotationData.value.length === 0) {
    quotationData.value.push(initEmptyRow());
  }

  updateCostStatistics();
});

const {
  showCustomerInfoDefault = true,
  enableCustomerInfo = true,
  quotationMenuConfig = [],
  customerData = {} as ClientType,
  orderData = {} as QuotationListResponse,
  modelData = {} as OrderModuleListResponse,
  tableListData = [] as OrderDetail[],
  isNewQuotation = false,
} = defineProps<{
  showCustomerInfoDefault?: boolean; // 默认展示顶部客户信息与否，true就默认显示
  enableCustomerInfo?: boolean; // 是否启用顶部客户信息，true就启用，false就显示简单的报价单信息(新建报价模块使用)
  quotationMenuConfig?: ButtonAction[]; // 报价目录菜单配置
  customerData?: ClientType; // CustomerInfo客户信息数据,enableCustomerInfo为true使用
  orderData?: QuotationListResponse; // ProjectInfo项目信息数据及tradeInfo交易信息数据,enableCustomerInfo为false使用
  modelData?: OrderModuleListResponse; // 报价目录表单展示,enableCustomerInfo为false使用
  tableListData?: OrderDetail[]; // 报价目录表单展示
  isNewQuotation?: boolean; // 是否为新建报价，true为新建报价，false为编辑报价
}>();

// 是否显示客户信息面板
const showCustomerInfo = ref(showCustomerInfoDefault);

// 我司信息
const myCompanyInfo = ref<CompanyData>();

// 项目负责人数据列表
const projectManagerList = ref<OrderChargePerson[]>();

// 客户信息列表
const clientInfoList = ref<ClientType[]>();

const customerName = ref('');

// 处理客户信息选择切换
const handleClientChange = ((value: ClientType) => {
  customerInfo.value = {
    name: value.contacts,
    address: value.address,
    contact: value.contactUser,
    phone: value.tel,
    email: value.email,
    bankAccount: '', // 预留
    bankName: '',    // 预留
    taxNumber: '',   // 预留
  };
  showCustomerBankInfo.value = false; // 收起账户信息面板
}) as ((value: string | number | object) => void);

// 获取客户单位信息列表
const getClientInfoList = async () => {
  const res = await clientApi.clientList({
    limit: 50, offset: 0, order: 'desc', contacts: '', contactUser: '',
    clientStatus: '', clientSource: '', categoryName: '',
  }) as unknown as { rows: ClientType[] };
  clientInfoList.value = res.rows.filter((item) => item.contacts.length > 0);
};

// 获取我司信息
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

// 获取项目负责人列表
const getProjectManagerList = async () => {
  const res = await ordersApi.getOrdersChargePerson();

  projectManagerList.value = res.data;
};

// 转换客户信息、项目信息、交易信息与报价目录表格数据(如果是模块编辑，就转换模块信息与报价目录表格数据)
const transformCustomerData = () => {
  if (enableCustomerInfo && customerData) {
    customerInfo.value = {
      name: customerData?.contacts,
      address: customerData.address,
      contact: customerData.contactUser,
      phone: customerData.tel,
      email: customerData.email,
      bankAccount: '',
      bankName: '',
      taxNumber: '',
    };
  }
  if (enableCustomerInfo && orderData) {
    projectInfo.value = {
      name: orderData.projectName,
      manager: orderData.name,
      quoteType1: orderData.ordersType1,
      quoteType2: orderData.ordersType2,
      quoteType3: orderData.ordersType3,
      nature: orderData.ordersCharacter, // 报价单性质
      remark: orderData.projectRemark, // 工程项目备注
    };
    tradeInfo.value = {
      deliveryMethod: orderData.method,
      deliveryTime: orderData.deliveryTime,
      area: {
        province: undefined,
        city: undefined,
        area: undefined,
      },
      address: orderData.deliveryAddress,
      paymentMethod: orderData.method,
    };
  }
  if (!enableCustomerInfo && modelData) {
    modelInfo.value = {
      name: modelData.projectName,
      gyClient: modelData.contacts,
      ordersType1: modelData.ordersType1,
      ordersType3: modelData.ordersType3,
    };
  }
  if (tableListData && tableListData.length > 0) {
    quotationData.value = orderDetailsToQuotationItems(tableListData);
  }
};

// Emit 事件定义
const emit = defineEmits<{
  'data-submit': [data: Quotation];
  'temp-save': [data: Quotation];
}>();

// 通过type获取param类型
const getFormParam = () => {
  // if 新建设计报价 return 'orderCreatSave'
  if (isNewQuotation) return 'orderCreatSave';
  if (orderData.type === 0) return 'orderModify';
  else return 'orderTemModify';
};

// 收集所有表单数据
const collectFormData = async (): Promise<Quotation> => {
  // 获取地区名称
  const areaNames = await getAreaNames(
    tradeInfo.value.area.province,
    tradeInfo.value.area.city,
    tradeInfo.value.area.area,
  );

  // 获取报价类型名称 - 分别获取不同分类的报价类型
  const [quoteType1Name, quoteType2Name, quoteType3Name] = await Promise.all([
    projectInfo.value.quoteType1
      ? getQuoteTypeName(parseInt(projectInfo.value.quoteType1), 1)
      : Promise.resolve(''),
    projectInfo.value.quoteType2
      ? getQuoteTypeName(parseInt(projectInfo.value.quoteType2), 2)
      : Promise.resolve(''),
    projectInfo.value.quoteType3
      ? getQuoteTypeName(parseInt(projectInfo.value.quoteType3), 3)
      : Promise.resolve(''),
  ]);

  // 基础数据对象
  const baseData = {
    DeliveryAddress: tradeInfo.value.address,
    DeliveryTime: tradeInfo.value.deliveryTime,
    area: areaNames.area, // 使用获取到的区县名称
    chargePerson: String(projectInfo.value.manager),
    // chargePersonInfo:
    //   projectManagerList.value?.find(
    //     (item) => item.id === parseInt(projectInfo.value.manager),
    //   )?.name || '',
    city: areaNames.city, // 使用获取到的城市名称
    clientBankAccount: customerInfo.value.bankAccount || null,
    clientBankName: customerInfo.value.bankName || null,
    clientId: customerData.id, // TODO: 待确认客户单位id
    clientTexId: customerInfo.value.taxNumber || null,
    companyAddres: companyInfo.value.address,
    companyName: companyInfo.value.name,
    contactPhone: companyInfo.value.phone,
    contacts: companyInfo.value.contact,
    deliveryMethod: tradeInfo.value.deliveryMethod,
    explanation: null, // TODO待放入报价单说明信息
    orderdetailsList: quotationItemsToOrderDetails(quotationData.value),
    ordersCharacter: projectInfo.value.nature?.toString(),
    orderstype1: quoteType1Name, // 使用获取到的报价类型名称
    orderstype2: quoteType2Name,
    orderstype3: quoteType3Name,
    param: getFormParam(),
    projectName: projectInfo.value.name,
    projectRemark: projectInfo.value.remark,
    province: areaNames.province, // 使用获取到的省份名称
    selfBank: companyInfo.value.bankName || '',
    selfId: String(myCompanyInfo.value?.id) || '0', // myCompanyId
    settleMethod: tradeInfo.value.paymentMethod // 结算方式id
      ? String(tradeInfo.value.paymentMethod)
      : '0',
  };

  // 如果不是新建报价，添加编辑报价特有的字段
  if (!isNewQuotation && orderData) {
    return {
      ...baseData,
      ordersId: orderData.ordersId,
      shareOrders: orderData.shareOrders,
      type: orderData.type,
      version: orderData.version,
    };
  }

  // 新建报价只返回基础数据
  return baseData;
};

// 暴露给父组件的方法
const triggerSubmit = async () => {
  const formData = await collectFormData();
  emit('data-submit', formData);
};

const triggerTempSave = async () => {
  const formData = await collectFormData();
  emit('temp-save', formData);
};

// 暴露方法给父组件
defineExpose({
  triggerSubmit,
  triggerTempSave,
  collectFormData,
  showSubProjectDrawer,
});

onMounted(() => {
  getClientInfoList();
  getMyCompanyInfo();
  getProjectManagerList();
  transformCustomerData();
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

.quotation-edit-card {
  position: relative;

  .show-customer-info-btn {
    @include button-style($primary-color);
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
  gap: 16px;
  align-items: center;

  h5 {
    margin-bottom: 0;
  }

  .module-header-toolbar {
    display: flex;
    gap: 16px;
    align-items: center;

    .toolbar-btn {
      @include button-style($primary-color);
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
