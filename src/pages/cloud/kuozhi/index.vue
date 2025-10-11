<template>
    <div class="kuozhi-cloud-page">
        <!-- 搜索过滤区域 -->
        <lay-card>
            <div class="filter-section">
                <form class="layui-form layui-form-pane">
                    <!-- 产品名称 -->
                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label productName">产品名称</label>
                            <div class="layui-input-inline">
                                <input
v-model="filterForm.productName" autocomplete="off" class="layui-input"
                                    name="name" type="text" placeholder="输入产品名称" @keydown="handleQuickSearch" />
                            </div>
                        </div>
                    </div>

                    <!-- 品牌 -->
                    <div class="layui-form-item">
                        <label class="layui-form-label inventory-label">品牌</label>
                        <div class="layui-input-inline inventory-inputW">
                            <select
id="brand" v-model="filterForm.brand" name="brand" lay-filter="searchBrand"
                                lay-search="">
                                <option value="">请选择</option>
                                <option v-for="brand in brandOptions" :key="brand.value" :value="brand.value">
                                    {{ brand.label }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- 型号 -->
                    <div class="layui-form-item">
                        <label class="layui-form-label inventory-label">型号</label>
                        <div class="layui-input-inline inventory-inputW">
                            <select
id="model" v-model="filterForm.model" name="model" lay-filter="searchModel"
                                lay-search="">
                                <option value="">请选择</option>
                                <option v-for="model in modelOptions" :key="model.value" :value="model.value">
                                    {{ model.label }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- 公司 -->
                    <div class="layui-form-item">
                        <label class="layui-form-label productName">公司名称</label>
                        <div class="layui-input-inline">
                            <select
id="company" v-model="filterForm.company" name="company" lay-filter="searchCompany"
                                lay-search="">
                                <option value="">请选择</option>
                                <option v-for="company in companyOptions" :key="company.value" :value="company.value">
                                    {{ company.label }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- 省 -->
                    <div class="layui-form-item">
                        <label class="layui-form-label province">省</label>
                        <div class="layui-input-inline inventory-inputW">
                            <select
id="province" v-model="filterForm.province" name="province"
                                lay-filter="searchProvince" lay-search="">
                                <option value="">请选择</option>
                                <option
v-for="province in provinceOptions" :key="province.value"
                                    :value="province.value">
                                    {{ province.label }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- 市 -->
                    <div class="layui-form-item">
                        <label class="layui-form-label city">市</label>
                        <div class="layui-input-inline inventory-inputW">
                            <select
id="city" v-model="filterForm.city" name="city" lay-filter="searchCity"
                                lay-search="">
                                <option value="">请选择市</option>
                                <option v-for="city in cityOptions" :key="city.value" :value="city.value">
                                    {{ city.label }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- 搜索按钮区域 -->
                    <div class="inventorySearchBtn">
                        <button
class="btnIcon invite-but" data-title="搜索" :disabled="searchLoading"
                            type="button" @click="handleSearch">
                            <i class="layui-icon layui-icon-search"></i>
                        </button>
                        <span data-title="重置" class="btnIcon invite-but" @click="handleRefreshForm">
                            <i class="layui-icon layui-icon-refresh"></i>
                        </span>
                    </div>
                </form>
            </div>
        </lay-card>

        <!-- 产品列表表格 -->
        <lay-card>
            <div class="table-container">
                <lay-table
:columns="tableColumns" :data-source="tableData" :page="pagination"
                    :loading="loading" @change="handleTableChange">
                    <!-- 产品名称列 -->
                    <template #productName="{ row }">
                        <a href="#" class="product-link" @click.prevent="handleViewProduct(row)">{{ row.name }}</a>
                    </template>

                    <!-- 参数特性列 -->
                    <template #parameters="{ row }">
                        <a href="#" class="parameters-link" @click.prevent="handleViewParameters(row)">参数特性</a>
                    </template>

                    <!-- 产品图片列 -->
                    <template #productImage="{ row }">
                        <div class="product-image">
                            <img
v-if="row.pictureaddress" :src="row.pictureaddress" :alt="row.name"
                                @error="handleImageError" />
                            <div v-else class="no-image">暂无图片</div>
                        </div>
                    </template>
                </lay-table>
            </div>
        </lay-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import Notify from '@/utils/notify';
import {
    getIdleCloudList,
    getProvinces,
    getIdleCloudBrandList,
    getIdleCloudModelList,
    getIdleCloudCompanyList
} from './Api/Api';
import { tableColumns, tableData, cityOptions } from './type';

// 搜索表单
const filterForm = reactive({
    productName: '',
    brand: '',
    model: '',
    company: '',
    province: '',
    city: ''
});



// 加载状态
const loading = ref(false);
const searchLoading = ref(false);

// 分页配置
const pagination = reactive({
    current: 1,
    limit: 50,
    total: 0
});


// 下拉选项数据类型定义
interface OptionItem {
    value: string | number
    label: string
}

// 下拉选项数据 
const brandOptions = ref<OptionItem[]>([]);
const modelOptions = ref<OptionItem[]>([]);
const companyOptions = ref<OptionItem[]>([]);
const provinceOptions = ref<OptionItem[]>([]);

// 获取下拉选项数据
const fetchOptionsData = async () => {
    try {
        // 并行获取所有选项数据
        const [provincesRes, brandsRes, modelsRes, companiesRes] = await Promise.all([
            getProvinces(),
            getIdleCloudBrandList(),
            getIdleCloudModelList(),
            getIdleCloudCompanyList()
        ]);

        // 处理省份数据
        const provincesData = provincesRes.data || provincesRes;
        if (Array.isArray(provincesData)) {
            provinceOptions.value = provincesData.map((item: any) => ({
                value: item.provinceCode || item.code || item.id,
                label: item.shortName || item.name || item.label
            }));
        }

        // 处理品牌数据
        const brandsData = brandsRes.data || brandsRes;
        if (Array.isArray(brandsData)) {
            brandOptions.value = brandsData.map((item: any) => ({
                value: item.value || item.name || item,
                label: item.label || item.name || item
            }));
        }

        // 处理型号数据
        const modelsData = modelsRes.data || modelsRes;
        if (Array.isArray(modelsData)) {
            modelOptions.value = modelsData.map((item: any) => ({
                value: item.value || item.name || item,
                label: item.label || item.name || item
            }));
        }

        // 处理公司数据
        const companiesData = companiesRes.data || companiesRes;
        if (Array.isArray(companiesData)) {
            companyOptions.value = companiesData.map((item: any) => ({
                value: item.value || item.name || item,
                label: item.label || item.name || item
            }));
        }

    } catch (error) {
        console.error('获取选项数据失败:', error);
        Notify.error({
            title: '错误',
            content: '获取选项数据失败，请稍后重试',
            time: 3000
        });
    }
};

// 获取产品数据
const fetchProductList = async (searchParams?: any) => {
    try {
        loading.value = true;

        // 如果有搜索参数，重置分页到第一页
        if (searchParams && Object.keys(searchParams).length > 0) {
            pagination.current = 1;
        }

        // 构建请求参数（实际项目中会使用这些参数调用API）
        const requestParams = {
            page: pagination.current,
            limit: pagination.limit,
            ...searchParams
        };

        // 调用真实 API
        const response = await getIdleCloudList(requestParams);
        const responseData = response.data || response;

        if (responseData && responseData.rows && Array.isArray(responseData.rows)) {
            tableData.value = responseData.rows.map((item: any) => ({
                ...item,
                checked: false
            }));
            pagination.total = responseData.total || responseData.rows.length;
        } else {
            // 如果没有 rows 属性，尝试直接使用 response 作为数组
            if (Array.isArray(responseData)) {
                tableData.value = responseData.map((item: any) => ({
                    ...item,
                    checked: false
                }));
                pagination.total = responseData.length;
            } else {
                tableData.value = [];
                pagination.total = 0;
            }
        }

    } catch (error) {
        console.error('获取产品列表失败:', error);
        Notify.error({
            title: '错误',
            content: '获取产品列表失败，请稍后重试',
            time: 3000
        });
    } finally {
        loading.value = false;
    }
};

// 表格变化处理
const handleTableChange = async (pageData: { current: number; limit: number }) => {
    pagination.current = pageData.current;
    pagination.limit = pageData.limit;
    await fetchProductList();
};

// 搜索功能
const handleSearch = async () => {
    try {
        searchLoading.value = true;

        // 检查是否有搜索条件
        const hasSearchConditions = !!(
            filterForm.productName.trim() ||
            filterForm.brand ||
            filterForm.model ||
            filterForm.company ||
            filterForm.province ||
            filterForm.city
        );

        if (!hasSearchConditions) {
            Notify.error({
                title: '搜索提示',
                content: '请至少输入一个搜索条件',
                time: 3000
            });
            return;
        }

        // 构建搜索参数
        const searchParams: any = {};
        if (filterForm.productName.trim()) {
            searchParams.name = filterForm.productName.trim();
        }
        if (filterForm.brand) {
            searchParams.brand = filterForm.brand;
        }
        if (filterForm.model) {
            searchParams.model = filterForm.model;
        }
        if (filterForm.company) {
            searchParams.company = filterForm.company;
        }
        if (filterForm.province) {
            searchParams.province = filterForm.province;
        }
        if (filterForm.city) {
            searchParams.city = filterForm.city;
        }

        await fetchProductList(searchParams);

        Notify.success({
            title: '搜索完成',
            content: '已更新搜索结果',
            time: 3000
        });
    } catch (error: any) {
        console.error('搜索失败:', error);
        Notify.error({
            title: '搜索失败',
            content: error.message || '搜索过程中发生错误，请稍后重试',
            time: 3000
        });
    } finally {
        searchLoading.value = false;
    }
};

// 重置搜索表单
const handleRefreshForm = async () => {
    try {
        searchLoading.value = true;

        // 重置表单数据
        filterForm.productName = '';
        filterForm.brand = '';
        filterForm.model = '';
        filterForm.company = '';
        filterForm.province = '';
        filterForm.city = '';

        // 重置表格数据
        await fetchProductList();

        Notify.success({
            title: '重置成功',
            content: '已重置搜索条件并刷新数据',
            time: 3000
        });
    } catch (error: any) {
        console.error('重置失败:', error);
        Notify.error({
            title: '重置失败',
            content: '重置过程中发生错误，请稍后重试',
            time: 3000
        });
    } finally {
        searchLoading.value = false;
    }
};

// 快速搜索功能（支持Enter键搜索）
const handleQuickSearch = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
};

// 查看产品详情
const handleViewProduct = (product: Product) => {
    console.log('查看产品详情:', product);
    // 这里可以添加查看产品详情的逻辑
};

// 查看参数详情
const handleViewParameters = (product: Product) => {
    console.log('查看参数详情:', product);
    // 这里可以添加查看参数详情的逻辑
};

// 处理图片加载错误
const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
        parent.innerHTML = '<div class="no-image">暂无图片</div>';
    }
};

// 组件挂载时获取数据
onMounted(async () => {
    // 先获取选项数据，再获取产品列表
    await fetchOptionsData();
    await fetchProductList();
});
</script>

<style scoped lang="scss">
.kuozhi-cloud-page {
    padding: 24px;
    min-height: 100vh;
}

.filter-section {
    background: white;
    padding: 16px 20px;
    margin-bottom: 16px;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

    // 表单样式
    .layui-form {
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .layui-form-item {
        margin-bottom: 0;
        display: inline-flex;
        align-items: center;
        margin-right: 10px;
    }

    .layui-inline {
        display: inline-block;
        vertical-align: top;
        margin-right: 10px;
    }

    // 标签样式
    .layui-form-label {
        padding: 8px 15px;
        text-align: right;
        background-color: #f2f2f2;
        border: 1px solid #e6e6e6;
        border-radius: 2px 0 0 2px;
        font-size: 14px;
        color: #333;
        font-weight: 400;
        line-height: 1.42857143;
        margin: 0;
        display: inline-block;
        vertical-align: middle;
        white-space: nowrap;

        &.productName {
            width: 90px; // 产品名称标签宽度
        }

        &.inventory-label {
            width: 60px; // 其他标签宽度
        }

        &.province {
            width: 50px; // 省份标签宽度
        }

        &.city {
            width: 50px; // 城市标签宽度
        }

    }

    // 输入框容器
    .layui-input-inline {
        display: inline-block;
        vertical-align: middle;
        margin-left: -1px;

        // 默认输入框宽度
        width: 115px; // 可以调整

        &.inventory-inputW {
            width: 90px; // 您已经调整为80px
        }
    }

    // 输入框样式
    .layui-input {
        // height: 40px; // 可以调整为 32px, 40px, 42px 等
        // line-height: 40px; // 与height保持一致
        border: 1px solid #e6e6e6;
        background-color: #fff;
        border-radius: 0 2px 2px 0;
        padding: 0 15px; // 内边距
        font-size: 14px; // 字体大小
        color: #333;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

        &::placeholder {
            color: #999;
        }
    }

    // 下拉框样式
    select {
        height: 38px; // 与输入框保持一致
        line-height: 38px; // 与height保持一致
        border: 1px solid #e6e6e6;
        background-color: #fff;
        border-radius: 0 2px 2px 0;
        padding: 0 15px; // 内边距
        font-size: 14px; // 字体大小
        color: #333;
        width: 100%;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

        &:focus {
            border-color: #5FB878;
            outline: 0;
            box-shadow: 0 0 0 2px rgba(95, 184, 120, 0.2);
        }
    }

    // 搜索按钮区域
    .inventorySearchBtn {
        display: flex;
        align-items: center;
        gap: 8px;

        .btnIcon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px; // 按钮宽度
            height: 32px; // 按钮高度
            border: 1px solid #e6e6e6;
            background-color: #fff;
            color: #333;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s ease;
            position: relative;

            &:hover {
                background-color: #5FB878;
                border-color: #5FB878;
                color: #fff;
            }

            i {
                font-size: 14px; // 图标大小
            }
        }

        .invite-but {
            position: relative;

            &::before {
                content: attr(data-title);
                position: absolute;
                top: -35px;
                left: 50%;
                transform: translateX(-50%);
                padding: 4px 8px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: all 0.2s ease;
                z-index: 1000;
            }

            &:hover::before {
                opacity: 1;
                visibility: visible;
            }
        }
    }
}

.table-container {

    .product-link,
    .parameters-link {
        color: #1890ff;
        text-decoration: none;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }

    .product-image {
        width: 60px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .no-image {
            font-size: 12px;
            color: #999;
            text-align: center;
        }
    }
}

// 表格样式优化
:deep(.lay-table) {
    .layui-table {
        font-size: 12px;
        border-collapse: collapse;
    }

    .layui-table th {
        background-color: #fafafa;
        font-weight: 600;
        color: #333;
        border-bottom: 1px solid #e8e8e8;
    }

    .layui-table td {
        padding: 8px 12px;
        border-bottom: 1px solid #f0f0f0;
    }

    .layui-table tr:hover {
        background-color: #f5f5f5;
    }

    // 排序图标样式
    .layui-table-sort {
        margin-left: 4px;
        color: #999;
        cursor: pointer;

        &:hover {
            color: #1890ff;
        }
    }
}

// 分页样式
:deep(.layui-laypage) {
    text-align: left;
    margin-top: 16px;

    .layui-laypage a {
        color: #333;
        border: 1px solid #e8e8e8;

        &:hover {
            color: #1890ff;
            border-color: #1890ff;
        }
    }

    .layui-laypage .layui-laypage-curr .layui-laypage-em {
        background-color: #5FB878;
        border-color: #5FB878;
    }
}

// 搜索按钮样式优化
:deep(.lay-button) {
    margin-left: 8px;

    &.layui-btn-primary {
        background-color: #1890ff;
        border-color: #1890ff;

        &:hover {
            background-color: #40a9ff;
            border-color: #40a9ff;
        }
    }
}

// 下拉选择框样式
:deep(.lay-select) {
    .layui-select-title {
        border: 1px solid #d9d9d9;
        border-radius: 4px;

        &:hover {
            border-color: #40a9ff;
        }
    }
}

// 输入框样式
:deep(.lay-input) {
    .layui-input {
        border: 1px solid #d9d9d9;
        border-radius: 4px;

        &:hover {
            border-color: #40a9ff;
        }

        &:focus {
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
    }
}
</style>
