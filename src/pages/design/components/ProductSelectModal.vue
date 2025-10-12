<template>
  <ModalWindow :visible="visible" :title="'产品选择'" :maxmin="true" :resize="true" :size-args="['90%', '80%']" isTeleport
    @close="handleClose" :btn="toolBtns">
    <div class="product-select-modal">

      <!-- 搜索栏 -->
      <lay-card class="search-card">
        <!-- 顶部Tab切换 -->
        <div class="tab-container">
          <lay-button :type="activeTab === 'self-built' ? 'primary' : undefined" prefix-icon="layui-icon-home"
            @click="handleTabClick('self-built')">自建库</lay-button>
          <lay-button :type="activeTab === 'product-cloud' ? 'primary' : undefined" prefix-icon="layui-icon-website"
            @click="handleTabClick('product-cloud')">产品云</lay-button>
          <lay-button :type="activeTab === 'idle-cloud' ? 'primary' : undefined" prefix-icon="layui-icon-app"
            @click="handleTabClick('idle-cloud')">闲置云</lay-button>
        </div>

        <lay-form layout="inline" :pane="true" :label-width="80" class="search-form-items">
          <!-- 自建库搜索栏 -->
          <template v-if="activeTab === 'self-built'">
            <lay-form-item label="产品名称">
              <lay-input v-model="selfBuiltSearch.name" placeholder="请输入产品名称" class="search-input" mode="block" />
            </lay-form-item>

            <lay-form-item label="品牌">
              <lay-select v-model="selfBuiltSearch.brand" placeholder="请选择品牌" class="search-input" mode="block"
                allow-clear>
                <lay-select-option v-for="(item, index) in brandOptions" :key="index" :value="item" :label="item" />
              </lay-select>
            </lay-form-item>

            <lay-form-item label="型号">
              <lay-select v-model="selfBuiltSearch.model" placeholder="请选择型号" class="search-input" mode="block"
                allow-clear>
                <lay-select-option v-for="(item, index) in modelOptions" :key="index" :value="item" :label="item" />
              </lay-select>
            </lay-form-item>

            <lay-form-item label="公司">
              <lay-select v-model="selfBuiltSearch.provideCompany" placeholder="请选择公司" class="search-input" mode="block"
                allow-clear>
                <lay-select-option v-for="(item, index) in companyOptions" :key="index" :value="item" :label="item" />
              </lay-select>
            </lay-form-item>
          </template>

          <!-- 产品云搜索栏 -->
          <template v-else-if="activeTab === 'product-cloud'">
            <lay-form-item label="产品名称">
              <lay-input v-model="productCloudSearch.name" placeholder="请输入产品名称" class="search-input" mode="block" />
            </lay-form-item>

            <lay-form-item label="品牌">
              <lay-select v-model="productCloudSearch.brand" placeholder="请选择品牌" class="search-input" mode="block"
                allow-clear>
                <lay-select-option v-for="(item, index) in brandOptions" :key="index" :value="item" :label="item" />
              </lay-select>
            </lay-form-item>

            <lay-form-item label="型号">
              <lay-select v-model="productCloudSearch.model" placeholder="请选择型号" class="search-input" mode="block"
                allow-clear>
                <lay-select-option v-for="(item, index) in modelOptions" :key="index" :value="item" :label="item" />
              </lay-select>
            </lay-form-item>

            <lay-form-item label="公司">
              <lay-select v-model="productCloudSearch.provideCompany" placeholder="请选择公司" class="search-input"
                mode="block" allow-clear>
                <lay-select-option v-for="(item, index) in companyOptions" :key="index" :value="item" :label="item" />
              </lay-select>
            </lay-form-item>

            <lay-form-item label="省份">
              <lay-select v-model="productCloudSearch.province" placeholder="请选择省份" class="search-input" mode="block"
                allow-clear>
                <lay-select-option v-for="(item, index) in provinceOptions" :key="index" :value="item.value"
                  :label="item.label" />
              </lay-select>
            </lay-form-item>

            <lay-form-item label="城市">
              <lay-select v-model="productCloudSearch.city" placeholder="请选择城市" class="search-input" mode="block"
                allow-clear>
                <lay-select-option v-for="(item, index) in cityOptions" :key="index" :value="item.value"
                  :label="item.label" />
              </lay-select>
            </lay-form-item>
          </template>

          <!-- 闲置云搜索栏 -->
          <template v-else-if="activeTab === 'idle-cloud'">
            <lay-form-item label="产品名称">
              <lay-input v-model="idleCloudSearch.name" placeholder="请输入产品名称" class="search-input" mode="block" />
            </lay-form-item>

            <lay-form-item label="品牌">
              <lay-select v-model="idleCloudSearch.brand" placeholder="请选择品牌" class="search-input" mode="block"
                allow-clear>
                <lay-select-option v-for="(item, index) in idleBrandOptions" :key="index" :value="item" :label="item" />
              </lay-select>
            </lay-form-item>

            <lay-form-item label="型号">
              <lay-select v-model="idleCloudSearch.model" placeholder="请选择型号" class="search-input" mode="block"
                allow-clear>
                <lay-select-option v-for="(item, index) in idleModelOptions" :key="index" :value="item" :label="item" />
              </lay-select>
            </lay-form-item>

            <lay-form-item label="公司">
              <lay-select v-model="idleCloudSearch.provideCompany" placeholder="请选择公司" class="search-input" mode="block"
                allow-clear>
                <lay-select-option v-for="(item, index) in idleCompanyOptions" :key="index" :value="item"
                  :label="item" />
              </lay-select>
            </lay-form-item>

            <lay-form-item label="省份">
              <lay-select v-model="idleCloudSearch.province" placeholder="请选择省份" class="search-input" mode="block"
                allow-clear>
                <lay-select-option v-for="(item, index) in provinceOptions" :key="index" :value="item.value"
                  :label="item.label" />
              </lay-select>
            </lay-form-item>

            <lay-form-item label="城市">
              <lay-select v-model="idleCloudSearch.city" placeholder="请选择城市" class="search-input" mode="block"
                allow-clear>
                <lay-select-option v-for="(item, index) in cityOptions" :key="index" :value="item.value"
                  :label="item.label" />
              </lay-select>
            </lay-form-item>
          </template>

          <div class="search-btns">
            <button title="搜索" @click="handleSearch">
              <SvgIcon name="search" width="1.1rem" />
            </button>
            <button title="刷新" @click="handleRefresh">
              <SvgIcon name="refresh" width="1.2rem" />
            </button>
          </div>
        </lay-form>
      </lay-card>

      <!-- 数据表格 -->
      <lay-card class="content-list-card">
        <lay-table ref="tableRef1" :columns="currentColumns" :data-source="dataSource"
          :default-toolbar="defaultToolbars" :loading="loading" :page="pagination" even emptyDescription="没有找到匹配的记录">
          <!-- 顶部工具栏按钮 -->
          <template #toolbar>
            <div class="toolbar">
              <div class="btn-group">
                <button title="选择" @click="handleSelect">
                  <SvgIcon name="check" width="1.1rem" />
                </button>
              </div>
            </div>
          </template>

          <!-- 产品名称列自定义渲染 -->
          <template #name="{ row }">
            <span class="link" :title="row.name">
              {{ row.name }}
            </span>
          </template>

          <!-- 参数特性列自定义渲染 -->
          <template #parameterClick="{ row }">
            <span class="link" :title="row.parameter">
              参数特性
            </span>
          </template>

          <!-- 产品图片列自定义渲染 -->
          <template #productImg="{ row }">
            <div class="product-img-container" v-if="row.imgUrl">
              <img :src="row.imgUrl" class="product-img" alt="产品图片" @click="previewImage(row.imgUrl, row.name)" />
            </div>
            <span v-else>无图片</span>
          </template>

          <!-- 公司列自定义渲染 -->
          <template #companyClick="{ row }">
            <span v-if="row.sourceType === 0" class="link" :title="row.company">
              {{ typeof row.company === 'string' ? row.company : row.company.abbreviation }}
            </span>
            <span v-else-if="row.sourceType === 2">
              网络来源
            </span>
            <span v-else>
              {{ row.company }}
            </span>
          </template>
        </lay-table>
        <div class="page-info">
          <span>
            显示第
            {{ (pagination.current - 1) * pagination.limit + 1 }}
            到第
            {{ pagination.current * pagination.limit }}
            条记录，总共 {{ pagination.total }} 条记录
          </span>
        </div>
      </lay-card>
    </div>
  </ModalWindow>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, defineEmits, defineExpose } from 'vue';
import type { TableColumn, TableDefaultToolbar } from '@layui/layui-vue/types/component/table/typing';
import SvgIcon from '@/components/SvgIcon.vue';
import productApi from '@/api/product/productApi';
import ModalWindow from '@/components/ModalWindow.vue';
import type { OrderProduct } from '@/api/product/productApi.type';
import { debounce } from '@/utils/debounce';
import env from '@/utils/env';
import { layer } from '@layui/layui-vue';
import notify from '@/utils/notify';
import areaApi from '@/api/area/areaApi';
import type { Province, City } from '@/api/area/areaApi.type';

// 控制模态框显示
const visible = ref(false);

// 定义组件事件
const emit = defineEmits(['select', 'cancel']);

// 显示模态窗口
const showModal = () => {
  visible.value = true;
};

// 关闭模态窗口
const closeModal = () => {
  visible.value = false;
};

// 处理关闭事件
const handleClose = () => {
  closeModal();
  emit('cancel');
};

// 图片预览
const previewImage = (img: string, productName: string) => {
  layer.photos({
    imgList: [{ src: img, alt: productName + '的产品图片' }],
  });
};

// 暴露方法给父组件
defineExpose({
  showModal,
  closeModal
});

// Tab切换状态
const activeTab = ref('self-built');

// 处理Tab点击
const handleTabClick = (tabId: string) => {
  activeTab.value = tabId;
};

// 分页参数
const pagination = reactive({
  current: 1,
  limit: 20,
  total: 0,
  // 处理分页变化
  change: (page: { current: number; limit: number }) => {
    pagination.current = page.current;
    pagination.limit = page.limit;
    handleSearch();
  },
});

// 表格工具栏
const defaultToolbars: TableDefaultToolbar[] = [
  {
    icon: 'layui-icon-refresh',
    title: '刷新',
    onClick: () => handleRefresh(),
  },
  'filter',
];

// 自建库搜索参数
const selfBuiltSearch = reactive({
  name: '',
  brand: '',
  model: '',
  provideCompany: '',
});

// 产品云搜索参数
const productCloudSearch = reactive({
  name: '',
  brand: '',
  model: '',
  provideCompany: '',
  province: '',
  city: '',
});

// 闲置云搜索参数
const idleCloudSearch = reactive({
  name: '',
  brand: '',
  model: '',
  provideCompany: '',
  province: '',
  city: '',
});

// 下拉选项
const brandOptions = ref<string[]>([]);
const modelOptions = ref<string[]>([]);
const companyOptions = ref<string[]>([]);
const idleBrandOptions = ref<string[]>([]);
const idleModelOptions = ref<string[]>([]);
const idleCompanyOptions = ref<string[]>([]);
const provinceOptions = ref<{ label: string; value: string }[]>([]);
const cityOptions = ref<{ label: string; value: string }[]>([]);

// 地区数据存储
const provinces = ref<Province[]>([]);
const cities = ref<City[]>([]);

// 表格引用
const tableRef1 = ref();

// 表格数据
const dataSource = ref<any[]>([]);

// 加载状态
const loading = ref(false);

// 自建库表格列配置
const selfBuiltColumns = [
  { title: '', width: '20px', type: 'checkbox', fixed: 'left' as const },
  {
    title: '产品编号',
    width: '180px',
    key: 'proId',
    ellipsisTooltip: true,
    hide: true,
  },
  {
    title: '产品名称',
    width: '250px',
    key: 'name',
    ellipsisTooltip: true,
    customSlot: 'name',
  },
  {
    title: '品牌',
    width: '150px',
    key: 'brand',
    ellipsisTooltip: true,
  },
  {
    title: '型号',
    width: '150px',
    key: 'model',
    ellipsisTooltip: true,
  },
  {
    title: '参数/特性',
    width: '200px',
    key: 'parameter',
    customSlot: 'parameterClick',
  },
  {
    title: '库存',
    width: '80px',
    key: 'inventory',
  },
  {
    title: '单位',
    width: '80px',
    key: 'unit',
  },
  {
    title: '参考成本',
    width: '120px',
    key: 'purchaseprice',
    sort: true,
  },
  {
    title: '参考售价',
    width: '120px',
    key: 'price',
    sort: true,
  },
  {
    title: '市场指导价',
    width: '120px',
    key: 'marketprice',
    sort: true,
  },
  {
    title: '产品图片',
    width: '120px',
    key: 'pictureaddress',
    customSlot: 'productImg',
  },
  {
    title: '公司',
    width: '200px',
    key: 'company',
    customSlot: 'companyClick',
  },
] as TableColumn[];

// 产品云表格列配置
const productCloudColumns = [
  { title: '', width: '20px', type: 'checkbox', fixed: 'left' as const },
  {
    title: '产品编号',
    width: '180px',
    key: 'proId',
    ellipsisTooltip: true,
    hide: true,
  },
  {
    title: '产品名称',
    width: '250px',
    key: 'name',
    ellipsisTooltip: true,
    customSlot: 'name',
  },
  {
    title: '品牌',
    width: '150px',
    key: 'brand',
    ellipsisTooltip: true,
  },
  {
    title: '型号',
    width: '150px',
    key: 'model',
    ellipsisTooltip: true,
  },
  {
    title: '参数/特性',
    width: '200px',
    key: 'parameter',
    customSlot: 'parameterClick',
  },
  {
    title: '库存',
    width: '80px',
    key: 'inventory',
  },
  {
    title: '单位',
    width: '80px',
    key: 'unit',
  },
  {
    title: '参考售价',
    width: '120px',
    key: 'price',
    sort: true,
  },
  {
    title: '市场指导价',
    width: '120px',
    key: 'marketprice',
    sort: true,
  },
  {
    title: '产品图片',
    width: '120px',
    key: 'pictureaddress',
    customSlot: 'productImg',
  },
  {
    title: '公司',
    width: '200px',
    key: 'company',
    customSlot: 'companyClick',
  },
] as TableColumn[];

// 闲置云表格列配置
const idleCloudColumns = [
  { title: '', width: '20px', type: 'checkbox', fixed: 'left' as const },
  {
    title: '产品名称',
    width: '250px',
    key: 'name',
    ellipsisTooltip: true,
    customSlot: 'name',
  },
  {
    title: '品牌',
    width: '150px',
    key: 'brand',
    ellipsisTooltip: true,
  },
  {
    title: '型号',
    width: '150px',
    key: 'model',
    ellipsisTooltip: true,
  },
  {
    title: '参数/特性',
    width: '200px',
    key: 'parameter',
    customSlot: 'parameterClick',
  },
  {
    title: '库存',
    width: '80px',
    key: 'inventory',
  },
  {
    title: '单位',
    width: '80px',
    key: 'unit',
  },
  {
    title: '库存售价',
    width: '120px',
    key: 'price',
    sort: true,
  },
  {
    title: '产品图片',
    width: '120px',
    key: 'pictureaddressOne',
    customSlot: 'productImg',
  },
  {
    title: '备注',
    width: '200px',
    key: 'remark',
    ellipsisTooltip: true,
  },
  {
    title: '公司',
    width: '200px',
    key: 'company',
    customSlot: 'companyClick',
  },
] as TableColumn[];

// 根据当前选中的tab返回对应的列配置
const currentColumns = computed(() => {
  switch (activeTab.value) {
    case 'self-built':
      return selfBuiltColumns;
    case 'product-cloud':
      return productCloudColumns;
    case 'idle-cloud':
      return idleCloudColumns;
    default:
      return selfBuiltColumns;
  }
});

// 获取品牌列表
const fetchBrandList = async (name = '') => {
  try {
    const brands = await productApi.getBrandList(name) as unknown as string[];
    brandOptions.value = brands.filter(Boolean);
  } catch (error) {
    console.error('获取品牌列表失败:', error);
  }
};

// 获取型号列表
const fetchModelList = async (name = '', brand = '') => {
  try {
    const models = await productApi.getModelList(name, brand) as unknown as string[];
    modelOptions.value = models.filter(Boolean);
  } catch (error) {
    console.error('获取型号列表失败:', error);
  }
};

// 获取公司列表
const fetchCompanyList = async (name = '', brand = '', model = '') => {
  try {
    const companies = await productApi.getQueryFieldValue(name, brand, model) as unknown as string[];
    companyOptions.value = companies.filter(Boolean);
  } catch (error) {
    console.error('获取公司列表失败:', error);
  }
};

// 获取产品云搜索列表
const fetchProductCloudList = async (name = '', brand = '', model = '') => {
  try {
    const products = await productApi.getProPlatformSearch(name, brand, model);
    brandOptions.value = products.data.brands.filter(Boolean) || [];
    modelOptions.value = products.data.models.filter(Boolean) || [];
    companyOptions.value = products.data.proCompanys.filter(Boolean) || [];
  } catch (error) {
    console.error('获取产品云搜索列表失败:', error);
  }
};

// 监听tab切换，重置搜索条件和表格数据
watch(activeTab, () => {
  pagination.current = 1;
  dataSource.value = [];

  // 根据当前tab加载相应的下拉选项
  if (activeTab.value === 'self-built') {
    fetchBrandList();
    fetchProvinceList(); // 加载省份数据
  } else if (activeTab.value === 'product-cloud') {
    fetchProductCloudList();
  } else if (activeTab.value === 'idle-cloud') {
    fetchIdleBrandList();
    fetchIdleCompanyList();
    fetchIdleModelList();
    fetchProvinceList(); // 加载省份数据
  }

  // 加载数据
  handleSearch();
});

// 监听自建库搜索输入变化
watch(() => selfBuiltSearch.name, () => {
  if (activeTab.value === 'self-built') {
    debouncedSearch();
  }
});

// 监听产品云搜索输入变化
watch(() => productCloudSearch.name, () => {
  if (activeTab.value === 'product-cloud') {
    debouncedSearch();
  }
});

// 监听闲置云搜索输入变化
watch(() => idleCloudSearch.name, () => {
  if (activeTab.value === 'idle-cloud') {
    debouncedSearch();
  }
});

// 监听品牌变化，更新型号列表并触发搜索
watch(() => selfBuiltSearch.brand, (newVal) => {
  if (activeTab.value === 'self-built') {
    fetchModelList(selfBuiltSearch.name, newVal);
    debouncedSearch(); // 自动触发搜索
  }
});

watch(() => productCloudSearch.brand, (newVal) => {
  if (activeTab.value === 'product-cloud') {
    fetchModelList(productCloudSearch.name, newVal);
    debouncedSearch(); // 自动触发搜索
  }
});

// 监听品牌和型号变化，更新公司列表并触发搜索
watch([() => selfBuiltSearch.brand, () => selfBuiltSearch.model], () => {
  if (activeTab.value === 'self-built') {
    fetchCompanyList(selfBuiltSearch.name, selfBuiltSearch.brand, selfBuiltSearch.model);
  }
});

watch([() => productCloudSearch.brand, () => productCloudSearch.model], () => {
  if (activeTab.value === 'product-cloud') {
    fetchCompanyList(productCloudSearch.name, productCloudSearch.brand, productCloudSearch.model);
  }
});

// 监听自建库选择框变化，触发搜索
watch([() => selfBuiltSearch.model, () => selfBuiltSearch.provideCompany], () => {
  if (activeTab.value === 'self-built') {
    debouncedSearch();
  }
});

// 监听产品云选择框变化，触发搜索
watch([() => productCloudSearch.model, () => productCloudSearch.provideCompany,
() => productCloudSearch.province, () => productCloudSearch.city], () => {
  if (activeTab.value === 'product-cloud') {
    debouncedSearch();
  }
});

// 监听省份变化，更新城市列表
watch(() => productCloudSearch.province, async (newProvinceCode) => {
  if (activeTab.value === 'product-cloud') {
    productCloudSearch.city = ''; // 清空城市选择
    if (newProvinceCode) {
      await fetchCityList(newProvinceCode);
    } else {
      cityOptions.value = [];
    }
    debouncedSearch();
  }
});

watch(() => idleCloudSearch.province, async (newProvinceCode) => {
  if (activeTab.value === 'idle-cloud') {
    idleCloudSearch.city = ''; // 清空城市选择
    if (newProvinceCode) {
      await fetchCityList(newProvinceCode);
    } else {
      cityOptions.value = [];
    }
    debouncedSearch();
  }
});

// 监听闲置云选择框变化，触发搜索
watch([() => idleCloudSearch.brand, () => idleCloudSearch.model,
() => idleCloudSearch.provideCompany, () => idleCloudSearch.province,
() => idleCloudSearch.city], () => {
  if (activeTab.value === 'idle-cloud') {
    debouncedSearch();
  }
});

// 创建防抖搜索函数
const debouncedSearch = debounce(async () => {
  await handleSearch();
}, 300);

// 处理搜索
const handleSearch = async () => {
  loading.value = true;
  try {
    let result;
    type SearchResult = {
      rows: OrderProduct[],
      total: number,
    }
    switch (activeTab.value) {
      case 'self-built':
        result = await productApi.getProductList(
          '',
          '',
          selfBuiltSearch.name,
          selfBuiltSearch.brand,
          '',
          selfBuiltSearch.model,
          1,
          1,
          selfBuiltSearch.provideCompany,
          'desc',
          (pagination.current - 1) * pagination.limit,
          pagination.limit
        ) as unknown as SearchResult;
        break;
      case 'product-cloud':
        result = await productApi.getProductList(
          productCloudSearch.province,
          productCloudSearch.city,
          productCloudSearch.name,
          productCloudSearch.brand,
          '',
          productCloudSearch.model,
          2,
          2,
          productCloudSearch.provideCompany,
          'desc',
          (pagination.current - 1) * pagination.limit,
          pagination.limit
        ) as unknown as SearchResult;
        break;
      case 'idle-cloud':
        result = await productApi.getProductList(
          idleCloudSearch.province,
          idleCloudSearch.city,
          idleCloudSearch.name,
          idleCloudSearch.brand,
          '',
          idleCloudSearch.model,
          3,
          3,
          idleCloudSearch.provideCompany,
          'desc',
          (pagination.current - 1) * pagination.limit,
          pagination.limit
        ) as unknown as SearchResult;
        break;
    }

    if (result) {
      dataSource.value = result.rows.map((item: OrderProduct) => ({
        ...item,
        id: item.proId, // 为了checkbox可操作引入id字段
        imgUrl: item.pictureaddress ? (item.pictureaddress.slice(0, 4) === 'http' ? item.pictureaddress : `${env.getBaseStaticUrl()}${item.pictureaddressOne}`) : ''
      }));
      pagination.total = result.total;
    }
  } catch (error) {
    console.error('搜索失败:', error);
  } finally {
    loading.value = false;
  }
};

// 处理刷新
const handleRefresh = () => {
  pagination.current = 1;

  switch (activeTab.value) {
    case 'self-built':
      selfBuiltSearch.name = '';
      selfBuiltSearch.brand = '';
      selfBuiltSearch.model = '';
      selfBuiltSearch.provideCompany = '';
      break;
    case 'product-cloud':
      productCloudSearch.name = '';
      productCloudSearch.brand = '';
      productCloudSearch.model = '';
      productCloudSearch.provideCompany = '';
      productCloudSearch.province = '';
      productCloudSearch.city = '';
      // 重置城市选项
      cityOptions.value = [];
      break;
    case 'idle-cloud':
      idleCloudSearch.name = '';
      idleCloudSearch.brand = '';
      idleCloudSearch.model = '';
      idleCloudSearch.provideCompany = '';
      idleCloudSearch.province = '';
      idleCloudSearch.city = '';
      // 重置城市选项
      cityOptions.value = [];
      break;
  }

  handleSearch();
};

// 处理选择产品
const handleSelect = () => {
  const selectedRows = tableRef1.value.getCheckData();

  if (selectedRows.length === 0) {
    notify.info('请先选择一个产品');
    return;
  }

  if (selectedRows) {
    emit('select', selectedRows);
    handleClose();
  }
};

// 获取闲置云品牌列表
const fetchIdleBrandList = async () => {
  try {
    const response = await productApi.inventoryBrandOrModelList('brand');
    idleBrandOptions.value = response.data.filter(Boolean);
  } catch (error) {
    console.error('获取闲置云品牌列表失败:', error);
  }
};

// 获取闲置云型号列表
const fetchIdleModelList = async () => {
  try {
    const response = await productApi.inventoryBrandOrModelList('model');
    idleModelOptions.value = response.data.filter(Boolean);
  } catch (error) {
    console.error('获取闲置云型号列表失败:', error);
  }
};

// 获取闲置云公司列表
const fetchIdleCompanyList = async () => {
  try {
    const response = await productApi.inventoryCompanyList();
    idleCompanyOptions.value = response.data.filter(Boolean);
  } catch (error) {
    console.error('获取闲置云公司列表失败:', error);
  }
};

// 获取省份列表
const fetchProvinceList = async () => {
  try {
    const response = await areaApi.getProvince();
    if (response && Array.isArray(response)) {
      provinces.value = response;
      provinceOptions.value = response.map(province => ({
        label: province.provinceName,
        value: province.provinceCode.toString()
      }));
    }
  } catch (error) {
    console.error('获取省份列表失败:', error);
  }
};

// 获取城市列表
const fetchCityList = async (provinceCode: string) => {
  try {
    if (!provinceCode) {
      cities.value = [];
      cityOptions.value = [];
      return;
    }

    const response = await areaApi.getCityOfProvince(provinceCode);
    if (response && Array.isArray(response)) {
      cities.value = response;
      cityOptions.value = response.map(city => ({
        label: city.cityName,
        value: city.cityCode.toString()
      }));
    }
  } catch (error) {
    console.error('获取城市列表失败:', error);
    cities.value = [];
    cityOptions.value = [];
  }
};

// 处理对比
const handleCompare = () => {
  const selectedRows = tableRef1.value.getCheckData();

  if (selectedRows.length === 0) {
    notify.info('请先选择一个产品');
    return;
  }

  // TODO: 打开对比弹窗
}

// modal底部按钮配置
const toolBtns = [
  {
    text: '选择',
    callback: handleSelect,
  },
  {
    text: '对比',
    callback: handleCompare,
  },
  {
    text: '关闭',
    callback: handleClose,
  },
]

// 初始化
onMounted(() => {
  // 初始加载数据
  handleSearch();
  // 加载品牌列表
  fetchBrandList();
  // 加载型号列表
  fetchModelList();
  // 加载公司列表
  fetchCompanyList();
  // 加载省份列表
  fetchProvinceList();
});
</script>

<style scoped lang="scss">
.product-select-modal {
  padding: 1rem 1rem 0.5rem 1rem;

  .tab-container {
    margin-bottom: 16px;
    display: flex;
    gap: 1rem;
  }

  .search-card {
    margin-bottom: 16px;

    :deep(.layui-form-item) {
      label {
        width: 100px !important;
      }
    }
  }

  .content-list-card {
    height: 100%;

    :deep(.layui-card-body) {
      padding: 0 0 10px 0 !important;
      overflow: hidden;
      border-radius: var(--card-border-radius);
    }

    .link {
      color: $primary-color;
      cursor: pointer;
      text-decoration: none;
    }

    .toolbar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-top: 4px;

      .btn-group {
        display: flex;
        gap: 1rem;
        align-items: center;

        button {
          @include button-style($primary-color);
        }
      }
    }
  }

  .search-btns {
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

  .product-img {
    width: 60px;
    height: 40px;
    object-fit: contain;
  }

  @media (max-width: $desktop_layout_breakpoint) {
    .search-btns {
      margin-left: 0;
      margin-bottom: 0.5rem;
    }
  }

  @media (min-width: $desktop_layout_breakpoint) {
    .search-form-items {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      :deep(.layui-form-item) {
        margin-bottom: 0;
      }
    }
  }
}
</style>
