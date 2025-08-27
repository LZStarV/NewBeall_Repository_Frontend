<template>
    <div class="product-library-page">
        <div>
            <!-- 搜索过滤区域 -->
            <lay-card>
                <div class="filter-section">
                    <lay-form :model="filterForm" layout="inline">
                        <lay-form-item label="产品名称">
                            <lay-input v-model="filterForm.productName" placeholder="请输入产品名称" style="width: 140px"
                                @keydown="handleQuickSearch" />
                        </lay-form-item>
                        <lay-form-item label="品牌">
                            <lay-select v-model="filterForm.brand" placeholder="请选择" style="width: 100px">
                                <lay-select-option v-for="model in productBrand" :key="model.value"
                                    :value="model.value">
                                    {{ model.label }}
                                </lay-select-option>
                            </lay-select>
                        </lay-form-item>
                        <lay-form-item label="创建人">
                            <lay-select v-model="filterForm.creator" placeholder="请选择" style="width: 100px">
                                <lay-select-option v-for="model in productCreator" :key="model.value"
                                    :value="model.value">
                                    {{ model.label }}
                                </lay-select-option>
                            </lay-select>
                        </lay-form-item>
                        <lay-form-item label="修改时间">
                            <lay-date-picker v-model="filterForm.modifyTime" placeholder="选择日期" style="width: 140px" />
                        </lay-form-item>
                        <lay-form-item label="型号">
                            <lay-select v-model="filterForm.model" placeholder="请选择" style="width: 100px">
                                <lay-select-option v-for="model in productModels" :key="model.value"
                                    :value="model.value">
                                    {{ model.label }}
                                </lay-select-option>
                            </lay-select>
                        </lay-form-item>
                        <lay-form-item>
                            <lay-select v-model="filterForm.libraryType" style="width: 120px; margin-left: 8px">
                                <lay-select-option value="">自建产品库</lay-select-option>
                                <lay-select-option value="">闲置产品</lay-select-option>
                            </lay-select>
                        </lay-form-item>
                        <lay-form-item>
                            <lay-button type="primary" @click="handleSearch">
                                <lay-icon type="layui-icon-search" />
                            </lay-button>
                            <lay-button @click="handleRefreshForm">
                                <lay-icon type="layui-icon-refresh" />
                            </lay-button>
                        </lay-form-item>
                    </lay-form>
                </div>
            </lay-card>

            <!-- 表格区域 -->
        <ProductTable 
            ref="productTableRef"
            @view-product="handleViewProduct"
            @view-parameters="handleViewParameters"
            @open-permission-management="handleOpenPermissionManagement"
            @open-designated-open-management="handleOpenDesignatedOpenManagement"
            @brand-management="handleBrandManagement"
            @add-to-idle-cloud="handleAddToIdleCloud"
        />
        </div>

        <!-- 产品详情弹窗 -->
        <ProductDetail 
            :visible="productDetailVisible"
            :selected-product="selectedProduct"
            @close="closeProductDetail"
        />

        <!-- 产品星标管理弹窗 -->
        <PermissionManagement 
            :visible="permissionVisible"
            :selected-product="selectedPermissionProduct"
            :right-modal-width="rightModalWidth"
            :authorized-companies="authorizedCompanies"
            @close="closePermissionPopup"
            @update-authorized-companies="handleUpdateAuthorizedCompanies"
        />

        <!-- 右侧参数详情弹窗 -->
        <ParametersDetail 
            :visible="parametersVisible"
            :selected-product="selectedParametersProduct"
            :right-modal-width="rightModalWidth"
            @close="closeParametersPopup"
        />

        <!-- 指定开放管理弹窗 -->
        <DesignatedOpenManagement 
            :visible="designatedOpenVisible"
            :selected-product="selectedDesignatedOpenProduct"
            :right-modal-width="rightModalWidth"
            :authorized-companies="authorizedCompanies"
            @close="closeDesignatedOpenPopup"
            @update-authorized-companies="handleUpdateAuthorizedCompanies"
        />

        <!-- 闲置云询价弹窗 -->
        <IdleCloudInquiry 
            :visible="idleCloudVisible"
            :selected-product="selectedIdleProduct"
            :right-modal-width="rightModalWidth"
            @close="closeIdleCloudPopup"
            @submit="handleIdleCloudSubmit"
        />

        <!-- 品牌管理页面 -->
        <BrandManagement 
            :visible="brandManagementVisible"
            :product-brand="productBrand"
            @close="closeBrandManagement"
            @brand-price-management="handleBrandPriceManagement"
        />
        <!-- 品牌自动报价管理弹窗 -->
        <BrandPriceManagement 
            :visible="brandPriceManagementVisible"
            :selected-brand="selectedBrand"
            :right-modal-width="rightModalWidth"
            @close="closeBrandPriceManagement"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from 'vue';
import RightSideModal from '@/components/RightSideModal.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import BrandManagement from './BrandManagement.vue';
import BrandPriceManagement from './BrandPriceManagement.vue';
import PermissionManagement from './PermissionManagement.vue';
import DesignatedOpenManagement from './DesignatedOpenManagement.vue';
import IdleCloudInquiry from './IdleCloudInquiry.vue';
import ProductDetail from './ProductDetail.vue';
import ParametersDetail from './ParametersDetail.vue';
import ProductTable from './ProductTable.vue';
import http from '@/utils/http';
import Notify from '@/utils/notify';

// 公司接口类型定义
interface Company {
    id: number | string;
    name: string;
    status: string;
}

// 产品类型/型号接口类型定义
interface ProductModel {
    value: string;
    label: string;
    [key: string]: string;
}

// 产品接口类型定义
interface Product {
    checked?: boolean;              // 前端添加的选中状态
    approved: boolean;              // 审核状态
    autoHandle: number;             // 自动处理
    brand: string;                  // 品牌
    company: string;                // 公司
    companyId: number;              // 公司ID
    costprice: string;              // 成本价
    createtime: string;             // 创建时间
    createuser: string;             // 创建用户
    defaultDiscount: string;        // 默认折扣
    delflag: string;                // 删除标志
    discountprice: string;          // 折扣价
    gyCompany: string;              // 供应商公司
    gysource: string;               // 供应商来源
    id: string;                     // ID
    interestrateprice: string;      // 利率价格
    inventory: number;              // 库存
    inventoryPrice: string;         // 库存价格
    inventoryRemark: string;        // 库存备注
    isInventory: number;            // 是否库存管理
    isOpen: number;                 // 是否开放
    isTemporary: number;            // 是否临时
    item: string;                   // 项目
    marketprice: string;            // 市场价
    model: string;                  // 型号
    modifyprice: string;            // 修改价格
    modifytime: string;             // 修改时间
    modifyuser: string;             // 修改用户
    name: string;                   // 产品名称
    noStarParam: string;            // 非星级参数
    notStarTrait: string;           // 非星级特征
    num: string;                    // 数量
    param: string;                  // 参数
    pendingParam: string;           // 待处理参数
    pictureaddress: string;         // 图片地址
    pictureaddressOne: string;      // 图片地址1
    points: string;                 // 积分
    price: string;                  // 价格
    proId: string;                  // 产品ID
    productAtlas: string;           // 产品图册
    purchaseprice: string;          // 采购价
    receiveName: string;            // 接收名称
    receiveid: string;              // 接收ID
    repeal: string;                 // 撤销
    sales: number;                  // 销售数量
    subprojectClass: string;        // 子项目类别
    trait: string;                  // 特征
    uname: string;                  // 用户名称
    unit: string;                   // 单位
    version: string;                // 版本
}

// 产品详情弹窗状态
const productDetailVisible = ref(false);
const selectedProduct = ref<Product | null>(null);

// 右侧参数弹窗状态
const parametersVisible = ref(false);
const selectedParametersProduct = ref<Product | null>(null);

// 产品星标管理弹窗状态
const permissionVisible = ref(false);
const selectedPermissionProduct = ref<Product | null>(null);

// 指定开放管理弹窗状态
const designatedOpenVisible = ref(false);
const selectedDesignatedOpenProduct = ref<Product | null>(null);

// 闲置云询价弹窗状态
const idleCloudVisible = ref(false);
const selectedIdleProduct = ref<Product>({ name: '' } as Product);


// 响应式弹窗宽度
const rightModalWidth = ref('35%');

// 搜索加载状态
const searchLoading = ref(false);

// ProductTable 组件引用
const productTableRef = ref();

// 权限管理相关数据
const authorizedCompanies = ref<Company[]>([]);

const selectedCompany = ref('');
const companySearchText = ref('请选择授权公司');

// 产品型号
const productModels = ref<ProductModel[]>([]);
//产品品牌
const productBrand = ref<ProductModel[]>([]);
//创建人
const productCreator = ref<ProductModel[]>([]);

// 获取公司列表
const fetchCompanyList = async () => {
    try {
        const response = await http.get('/company/getAllCompany');
        const responseData = response.data || response;
        if (responseData && Array.isArray(responseData)) {
            authorizedCompanies.value = responseData.map((company: any) => ({
                id: company.id || company.companyId,
                name: company.companyName,
                status: company.aduitStatus === 1 ? '已授权' : '未授权'
            }));
        }
    } catch (error) {
        console.error('获取公司列表失败:', error);
        Notify.error({
            title: '获取数据失败',
            content: '无法获取公司列表，请稍后重试',
            time: 3000
        });
    }
};
// 获取产品数据
const fetchProductList = async () => {
    try {
        loading.value = true;
        const params = {
            page: pagination.current,
            limit: pagination.limit,
        };

        const response = await http.get('/product/productsList', params);
        const responseData = response.data || response;
        if (responseData && responseData.rows && Array.isArray(responseData.rows)) {
            tableData.value = responseData.rows.map((item: any) => ({
                ...item,
                checked: false
            }));
            pagination.total = responseData.total || responseData.rows.length;
        } else {
            if (Array.isArray(responseData)) {
                tableData.value = responseData.map((item: any) => ({
                    ...item,
                    checked: false
                }));
                pagination.total = responseData.length;
            }
        }
    } catch (error) {
        console.error('获取产品列表失败:', error);
        Notify.error({
            title: '获取数据失败',
            content: '无法获取产品列表，请稍后重试',
            time: 3000
        });
    } finally {
        loading.value = false;
    }
};
//获取产品类型
const fetchProductModels = async () => {
    try {
        const response = await http.post('/product/getModelS');
        // 处理字符串数组
        let modelData = [];
        const responseData = response.data || response;
        if (responseData && Array.isArray(responseData)) {
            modelData = responseData;
            productModels.value = modelData.map((item: string) => ({
                value: item,
                label: item
            }));
        }
    } catch (error) {
        console.error('获取产品型号失败:', error);
        Notify.error({
            title: '获取数据失败',
            content: '无法获取产品型号，请稍后重试',
            time: 3000
        });
    }
};
//获取产品品牌
const fetchProductBrand = async () => {
    try {
        const response = await http.post('/product/getBrandS');
        // 处理字符串数组
        let modelData = [];
        const responseData = response.data || response;
        if (responseData && Array.isArray(responseData)) {
            modelData = responseData;
            productBrand.value = modelData.map((item: string) => ({
                value: item,
                label: item
            }));
        }
    } catch (error) {
        console.error('获取产品品牌失败:', error);
        Notify.error({
            title: '获取数据失败',
            content: '无法获取产品品牌，请稍后重试',
            time: 3000
        });
    }
};
const fetchProductCreator = async () => {
    try {
        const response = await http.post('/product/getQueryFieldVal');
        let modelData = [];
        const responseData = response.data || response;
        if (responseData && Array.isArray(responseData)) {
            modelData = responseData;
            productCreator.value = modelData.map((item: string) => ({
                value: item,
                label: item
            }));
        }
    } catch (error) {
        console.error('获取创建人列表失败:', error);
        Notify.error({
            title: '获取数据失败',
            content: '无法获取创建人列表，请稍后重试',
            time: 3000
        });
    }
};

// 过滤表单
const filterForm = reactive({
    productName: '',
    brand: '',
    creator: '',
    modifyTime: '',
    model: '',
    serviceType: '',
    libraryType: ''
});

// 搜索功能
const handleSearch = async () => {
    try {
        // 检查是否有搜索条件
        const hasSearchConditions = !!(
            filterForm.productName.trim() ||
            filterForm.brand ||
            filterForm.creator ||
            filterForm.model ||
            filterForm.modifyTime
        );

        if (!hasSearchConditions) {
            Notify.error({
                title: '搜索提示',
                content: '请至少输入一个搜索条件',
                time: 3000
            });
            return;
        }

        searchLoading.value = true;

        // 构建搜索参数
        const searchParams: any = {
            page: 1, // 搜索时重置为第一页
            limit: 80,
        };

        // 添加搜索条件
        if (filterForm.productName.trim()) {
            searchParams.name = filterForm.productName.trim();
        }
        if (filterForm.brand) {
            searchParams.brand = filterForm.brand;
        }
        if (filterForm.creator) {
            searchParams.creator = filterForm.creator;
        }
        if (filterForm.model) {
            searchParams.model = filterForm.model;
        }
        if (filterForm.modifyTime) {
            searchParams.modifyTime = filterForm.modifyTime;
        }
        if (filterForm.libraryType) {
            searchParams.libraryType = filterForm.libraryType;
        }

        console.log('搜索参数:', searchParams);

        // 通过ProductTable组件进行搜索
        if (productTableRef.value) {
            await productTableRef.value.fetchProductList(searchParams);
            
            Notify.success({
                title: '搜索完成',
                content: '已更新搜索结果',
                time: 3000
            });
        } else {
            throw new Error('表格组件未初始化');
        }
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
        // 检查是否有搜索条件
        const hasSearchConditions = !!(
            filterForm.productName.trim() ||
            filterForm.brand ||
            filterForm.creator ||
            filterForm.model ||
            filterForm.modifyTime ||
            filterForm.libraryType
        );

        if (hasSearchConditions) {
            const confirmReset = confirm('确定要重置所有搜索条件并刷新数据吗？');
            if (!confirmReset) {
                return;
            }
        }

        searchLoading.value = true;

        // 重置表单数据
        filterForm.productName = '';
        filterForm.brand = '';
        filterForm.creator = '';
        filterForm.modifyTime = '';
        filterForm.model = '';
        filterForm.serviceType = '';
        filterForm.libraryType = '';

        // 重置表格数据，获取所有产品
        if (productTableRef.value) {
            await productTableRef.value.fetchProductList();
        }

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
// 响应式弹窗宽度计算
const updateModalWidth = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth > 1920) {
        rightModalWidth.value = '30%';
    } else if (screenWidth > 1400) {
        rightModalWidth.value = '35%';
    } else if (screenWidth > 1200) {
        rightModalWidth.value = '40%';
    } else if (screenWidth > 768) {
        rightModalWidth.value = '50%';
    } else if (screenWidth > 480) {
        rightModalWidth.value = '70%';
    } else {
        rightModalWidth.value = '90%';
    }
};
// 询价
const handleInquiry = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        return;
    }
    console.log('询价产品:', selectedRows);
    // 这里可以打开询价弹窗
};

// 显示重复产品状态
const showingDuplicates = ref(false);
const originalTableData = ref<Product[]>([]);

// 显示重复产品
const handleShowDuplicate = () => {
    if (showingDuplicates.value) {
        // 如果当前正在显示重复产品，则恢复原始数据
        tableData.value = [...originalTableData.value];
        showingDuplicates.value = false;
    } else {
        // 保存原始数据
        originalTableData.value = [...tableData.value];

        // 根据产品编号(proId)找出重复的产品
        const proIdMap = new Map<string, Product[]>();

        // 按产品编号分组
        tableData.value.forEach(product => {
            const proId = product.proId;
            if (proId) {
                if (!proIdMap.has(proId)) {
                    proIdMap.set(proId, []);
                }
                proIdMap.get(proId)!.push(product);
            }
        });

        // 找出重复的产品（proId相同且数量大于1的）
        const duplicateProducts: Product[] = [];
        proIdMap.forEach((products, proId) => {
            if (products.length > 1) {
                duplicateProducts.push(...products);
            }
        });

        if (duplicateProducts.length > 0) {
            tableData.value = duplicateProducts;
            showingDuplicates.value = true;

            Notify.success({
                title: '重复产品筛选',
                content: `找到 ${duplicateProducts.length} 个重复产品（基于产品编号）`,
                time: 3000
            });
        } else {
            Notify.info({
                title: '重复产品筛选',
                content: '未找到重复的产品',
                time: 3000
            });
        }
    }
};

// 单个新增
const handleSingleAdd = () => {
    console.log('单个新增产品');
    // 这里可以打开新增产品弹窗
};

// 批量新增
const handleBatchAdd = () => {
    console.log('批量新增产品');
    // 这里可以打开批量新增弹窗或导入功能
};

// 修改
const handleEdit = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要修改的产品');
        return;
    }
    if (selectedRows.length > 1) {
        console.log('只能选择一个产品进行修改');
        return;
    }
    console.log('修改产品:', selectedRows[0]);
    // 这里可以打开编辑产品弹窗
};

// 删除
const handleDelete = async () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        Notify.error({
            title: '提示',
            content: '请选择要删除的产品',
            time: 3000
        });
        return;
    }

    // 确认删除操作
    const confirmMessage = selectedRows.length === 1
        ? `确定要删除产品 "${selectedRows[0].name}" 吗？`
        : `确定要删除选中的 ${selectedRows.length} 个产品吗？`;

    if (!confirm(confirmMessage)) {
        return;
    }

    await executeDelete(selectedRows);
};

// 执行删除操作
const executeDelete = async (selectedRows: Product[]) => {
    try {
        // 提取产品ID数组（使用proId作为产品编号）
        const productIds = selectedRows.map(row => row.proId).filter(id => id);

        if (productIds.length === 0) {
            Notify.error({
                title: '删除失败',
                content: '所选产品缺少有效的产品编号',
                time: 3000
            });
            return;
        }

        // 构建FormData
        const formData = new FormData();
        productIds.forEach(id => {
            formData.append('productIds[]', id);
        });

        // 添加时间戳防止缓存
        const jstime = Date.now();
        formData.append('jstime', jstime.toString());

        // 调用删除API
        const response: any = await http.post('/product/delete', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // 处理删除结果
        if (response.code === 200) {
            Notify.success({
                title: '删除成功',
                content: `已成功删除 ${selectedRows.length} 个产品`,
                time: 3000
            });

            // 刷新产品列表
            await fetchProductList();

            // 重置选择状态
            allChecked.value = false;
            indeterminate.value = false;
        } else {
            throw new Error(response?.data?.message || response?.message || '删除操作失败');
        }

    } catch (error: any) {
        console.error('删除产品失败:', error);
        Notify.error({
            title: '删除失败',
            content: error.message || '删除过程中发生错误，请重试',
            time: 3000
        });
    }
};

// 批量导出
const handleBatchExport = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        Notify.error({
            title: '提示',
            content: '请选择要导出的产品',
            time: 3000
        });
        return;
    }

    // 创建Excel数据
    const exportData = selectedRows.map(row => ({
        '产品名称': row.name,
        '品牌': row.brand,
        '规格型号': row.model,
        '产品特点': row.trait || '',
        '详细参数': row.param || '',
        '库存数': row.inventory || '',
        '计量单位': row.unit,
        '成本': row.purchaseprice,
        '工程价': row.price,
        '市场指导价': row.marketprice,
        '类别': row.subprojectClass || '',
        '产品图片': (row.pictureaddress || row.pictureaddressOne) ?
            `https://yx.newbeall.com/softLink/${row.pictureaddress || row.pictureaddressOne}` : '',
        '供应商公司': row.gyCompany || ''
    }));

    // 导出Excel
    exportToExcel(exportData, '产品列表导出.xlsx');

    Notify.success({
        title: '导出成功',
        content: `已成功导出 ${selectedRows.length} 条产品记录`,
        time: 3000
    });
};

// 导出Excel函数
const exportToExcel = (data: any[], filename: string) => {
    try {
        // 创建工作簿
        const worksheet = [];

        // 添加表头
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            worksheet.push(headers);

            // 添加数据行
            data.forEach(row => {
                const rowData = headers.map(header => row[header] || '');
                worksheet.push(rowData);
            });
        }

        // 转换为CSV格式并下载
        const csvContent = worksheet.map(row => row.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename.replace('.xlsx', '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        Notify.error({
            title: '导出失败',
            content: '导出过程中发生错误，请重试',
            time: 3000
        });
    }
};

// 全库备份
const handleFullBackup = async () => {
    // 确认备份操作
    if (!confirm('确定要进行全库备份吗？此操作可能需要较长时间。')) {
        return;
    }

    try {
        Notify.info({
            title: '备份中',
            content: '正在进行全库备份，请稍候...',
            time: 3000
        });

        // 获取所有产品数据进行备份
        const backupData = await getAllProductsForBackup();

        if (backupData.length === 0) {
            Notify.error({
                title: '备份失败',
                content: '没有可备份的产品数据',
                time: 3000
            });
            return;
        }

        // 创建备份文件
        const backupContent = {
            backupTime: new Date().toISOString(),
            productCount: backupData.length,
            data: backupData
        };

        // 生成备份文件名
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const filename = `产品库全库备份_${timestamp}.json`;

        // 下载备份文件
        downloadBackupFile(backupContent, filename);

        Notify.success({
            title: '备份成功',
            content: `已成功备份 ${backupData.length} 条产品记录`,
            time: 3000
        });

    } catch (error: any) {
        Notify.error({
            title: '备份失败',
            content: error.message || '备份过程中发生错误，请重试',
            time: 3000
        });
    }
};

// 获取所有产品数据用于备份
const getAllProductsForBackup = async (): Promise<Product[]> => {
    try {
        // 获取所有产品数据，不分页
        const response: any = await http.get('/product/productsList', {
            page: 1,
            limit: 99999  // 获取所有数据
        });

        if (response && response.rows && Array.isArray(response.rows)) {
            return response.rows;
        }
        return [];

    } catch {
        Notify.error({
            title: '备份失败',
            content: '备份过程中发生错误，请重试',
            time: 3000
        });
    }
};

// 下载备份文件
const downloadBackupFile = (data: any, filename: string) => {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch {
        Notify.error({
            title: '备份失败',
            content: '备份文件生成失败',
            time: 3000
        });
    }
};

// 品牌管理
const handleBrandManagement = () => {
    // 显示品牌管理页面覆盖层
    brandManagementVisible.value = true;
};

// 添加至闲置云
const handleAddToIdleCloud = (selectedRows: Product[]) => {
    if (selectedRows.length === 0) {
        Notify.error({
            title: '提示',
            content: '请选择表格中的某一记录',
            time: 3000
        });
        return;
    }

    // 设置选中的产品信息
    selectedIdleProduct.value = selectedRows[0];
    // 打开闲置云询价弹窗
    updateModalWidth();
    nextTick(() => {
        idleCloudVisible.value = true;
    });
};

// 查看产品详情
const handleViewProduct = (product: Product) => {
    selectedProduct.value = product;
    productDetailVisible.value = true;
};

// 关闭产品详情弹窗
const closeProductDetail = () => {
    productDetailVisible.value = false;
    selectedProduct.value = null;
};

// 查看参数详情（右侧弹窗）
const handleViewParameters = (product: Product) => {
    selectedParametersProduct.value = product;
    updateModalWidth(); // 更新弹窗宽度
    nextTick(() => {
        parametersVisible.value = true;
    });
};

// 关闭参数详情弹窗
const closeParametersPopup = () => {
    parametersVisible.value = false;
    selectedParametersProduct.value = null;
};

// 打开产品权限管理弹窗
const handleOpenPermissionManagement = (product: Product) => {
    console.log('点击权限设置的产品数据:', product);
    selectedPermissionProduct.value = product;
    updateModalWidth(); // 更新弹窗宽度
    nextTick(() => {
        permissionVisible.value = true;
    });
};

// 关闭产品权限管理弹窗
const closePermissionPopup = () => {
    permissionVisible.value = false;
    selectedPermissionProduct.value = null;
    selectedCompany.value = '';
};

// 图片加载失败处理
const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/150'; // 替换为默认图片
    target.alt = '加载失败';
};

// 窗口大小变化监听
const handleResize = () => {
    if (parametersVisible.value) {
        updateModalWidth();
    }
};

// 生命周期 - 页面加载时获取数据
onMounted(async () => {
    updateModalWidth();
    window.addEventListener('resize', handleResize);

    // 加载搜索历史
    loadSearchHistory();

    // 并行获取产品型号和产品列表
    await Promise.all([
        fetchProductModels(),
        fetchProductBrand(),

        fetchProductCreator(),
        fetchCompanyList()
    ]);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
const updateCloudLibraryStatus = (row: Product, value: boolean) => {
    // 更新云端库状态：true -> 1, false -> 0
    row.isOpen = value ? 1 : 0;
    // 这里可以添加调用API更新后端数据的逻辑
};

// 打开指定开放管理弹窗
const handleOpenDesignatedOpenManagement = (product: Product) => {
    selectedDesignatedOpenProduct.value = product;
    updateModalWidth(); // 更新弹窗宽度
    nextTick(() => {
        designatedOpenVisible.value = true;
    });
};

// 打开指定开放管理弹窗
const closeDesignatedOpenPopup = () => {
    designatedOpenVisible.value = false;
    selectedDesignatedOpenProduct.value = null;
    selectedCompany.value = '';
};

// 关闭闲置云询价弹窗
const closeIdleCloudPopup = () => {
    idleCloudVisible.value = false;
};

// 更新品牌云端库状态
const updateBrandCloudLibrary = (brand: any, value: boolean) => {
    brand.isOpen = value ? 1 : 0;
    console.log('更新品牌云端库状态:', brand.name, '设置为:', value ? 'ON' : 'OFF');
    // 这里可以添加API调用来更新后端数据
};

// 更新品牌自动报价
const updateBrandAutoPrice = (brand: any, value: boolean) => {
    brand.autoPrice = value ? 1 : 0;
    console.log('更新品牌自动报价:', brand.name, '设置为:', value ? 'ON' : 'OFF');
    // 这里可以添加API调用来更新后端数据
};

// 处理星标设置
const handleStarSetting = (brand: any) => {
    console.log('处理星标设置:', brand.name);
    // 这里可以打开星标设置弹窗或处理星标设置逻辑
    Notify.info({
        title: '星标设置',
        content: `正在为品牌 ${brand.name} 设置星标`,
        time: 3000
    });
};

// 处理品牌设置
const handleBrandSetting = (brand: any) => {
    console.log('处理品牌设置:', brand.name);
    Notify.info({
        title: '品牌设置',
        content: `正在为品牌 ${brand.name} 进行设置`,
        time: 3000
    });
};

// 处理品牌自动报价管理
const handleBrandPriceManagement = (brand: any) => {
    console.log('处理品牌自动报价管理:', brand.name);
    selectedBrand.value = brand;
    brandPriceManagementVisible.value = true;
    // 这里可以根据选中的品牌加载对应的数据
};

// 关闭品牌自动报价管理弹窗
const closeBrandPriceManagement = () => {
    brandPriceManagementVisible.value = false;
    selectedBrand.value = null;
};

// 更新授权公司列表
const handleUpdateAuthorizedCompanies = (companies: Company[]) => {
    authorizedCompanies.value = companies;
};

// 处理闲置云提交
const handleIdleCloudSubmit = (data: any) => {
    console.log('闲置云提交数据:', data);
    // 这里可以添加提交到后端的逻辑
    Notify.success({
        title: '成功',
        content: '闲置云询价提交成功',
        time: 3000
    });
};

// 选中的品牌
const selectedBrand = ref<any>(null);

// 品牌管理页面覆盖层
const brandManagementVisible = ref(false);

// 关闭品牌管理页面
const closeBrandManagement = () => {
    brandManagementVisible.value = false;
}

// 品牌自动报价管理弹窗状态
const brandPriceManagementVisible = ref(false);

// 快速搜索功能（支持Enter键搜索）
const handleQuickSearch = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
};

// 新增：搜索历史管理
const searchHistory = ref<string[]>([]);
const maxSearchHistory = 10;

const addToSearchHistory = (searchTerm: string) => {
    if (searchTerm.trim()) {
        // 移除已存在的相同搜索词
        const index = searchHistory.value.indexOf(searchTerm);
        if (index !== -1) {
            searchHistory.value.splice(index, 1);
        }

        // 添加到开头
        searchHistory.value.unshift(searchTerm);

        // 限制历史记录数量
        if (searchHistory.value.length > maxSearchHistory) {
            searchHistory.value = searchHistory.value.slice(0, maxSearchHistory);
        }

        // 保存到本地存储
        localStorage.setItem('productSearchHistory', JSON.stringify(searchHistory.value));
    }
};

// 加载搜索历史
const loadSearchHistory = () => {
    try {
        const saved = localStorage.getItem('productSearchHistory');
        if (saved) {
            searchHistory.value = JSON.parse(saved);
        }
    } catch (error) {
        console.error('加载搜索历史失败:', error);
        searchHistory.value = [];
    }
};

</script>

<style scoped lang="scss">
// 产品库页面样式
.product-library-page {
    padding: 24px;
    min-height: 100vh;
    position: relative; // 为右侧弹窗提供定位参考
}

.filter-section {
    background: white;
    padding: 16px 20px;
    margin-bottom: 16px;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

    :deep(.layui-form) {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        gap: 0 6px;
        margin: 0;
    }

    :deep(.layui-form-item) {
        margin: 0 8px 0 0;
        flex-shrink: 0;
        display: flex;
        align-items: stretch;
        position: relative;
    }

    :deep(.layui-form-label) {
        font-size: 11px;
        font-weight: 500;
        color: #333;
        background: #fafafa;
        border: 1px solid #d9d9d9;
        border-right: none;
        border-radius: 4px 0 0 4px;
        padding: 0 4px;
        margin: 0;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 28px;
        line-height: 1;
        width: 53px !important;

        &::after {
            display: none;
        }
    }

    :deep(.layui-input) {
        height: 28px;
        font-size: 11px;
        border: 1px solid #d9d9d9;
        border-left: none;
        border-radius: 0 4px 4px 0;
        padding: 0 10px;
        margin: 0;
        transition: all 0.2s ease;

        &:hover {
            border-color: #40a9ff;
        }

        &:focus {
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
            outline: none;
        }

        &::placeholder {
            color: #bfbfbf;
            font-size: 10px;
        }
    }

    :deep(.layui-select) {
        .layui-select-input {
            height: 28px;
            font-size: 11px;
            border: 1px solid #d9d9d9;
            border-left: none;
            border-radius: 0 4px 4px 0;
            padding: 0 10px;
            margin: 0;
            transition: all 0.2s ease;

            &:hover {
                border-color: #40a9ff;
            }

            &:focus {
                border-color: #1890ff;
                box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
            }
        }
    }

    :deep(.layui-date-picker) {
        .layui-input {
            height: 28px;
            font-size: 11px;
            border: 1px solid #d9d9d9;
            border-left: none;
            border-radius: 0 4px 4px 0;
            padding: 0 10px;
            margin: 0;
            transition: all 0.2s ease;

            &:hover {
                border-color: #40a9ff;
            }

            &:focus {
                border-color: #1890ff;
                box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
            }
        }
    }

    :deep(.layui-form-item) {
        &:focus-within {
            .layui-form-label {
                border-color: #1890ff;
                background: #e6f7ff;
            }
        }

        &:hover {
            .layui-form-label {
                border-color: #40a9ff;
                background: #f0f9ff;
            }
        }
    }

    :deep(.layui-btn) {
        height: unset;
        padding: 0 10px;
        font-size: 8px;
        border-radius: 5px;
        margin-right: 3px;
        min-height: 26px;
        min-width: 26px;
        line-height: 18px;
        transition: all 0.2s ease;

        .layui-icon {
            font-size: 8px;
            line-height: 1;
            width: auto;
            height: auto;
        }
    }

    :deep(.layui-form-item:nth-last-child(2)),
    :deep(.layui-form-item:last-child) {

        .layui-input,
        .layui-select .layui-select-input {
            border-left: 1px solid #d9d9d9;
            border-radius: 4px;
        }

        // 专门为自建产品库下拉框设置左内边距为0
        .layui-select .layui-input input {
            padding-left: 0;
        }
    }
}
// 开关样式优化
:deep(.layui-switch) {
    transform: scale(0.8);

    em {
        font-size: 10px;
        margin-left: 5px;
        margin-right: 21px;
    }
}

:deep(.layui-form-onswitch) {
    border-color: #5FB878;
    background-color: #5FB878;

    em {
        color: #fff;
    }
}

:deep(.layui-switch:not(.layui-form-onswitch)) {
    background-color: #d9d9d9;
    border-color: #d9d9d9;

    em {
        color: #999;
    }
}
// 状态标识样式
.status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    display: inline-block;

    &.authorized {
        background: #f6ffed;
        color: #52c41a;
        border: 1px solid #b7eb8f;
    }

    &.unauthorized {
        background: #fff2f0;
        color: #ff4d4f;
        border: 1px solid #ffccc7;
    }
}
</style>
<style lang="scss">
.layui-select-content,
.layui-this {
    min-width: 120px;
    max-height: 200px;
    background-color: #fff;
    padding: 5px 0;
    overflow: auto;
    font-size: 12px;
    color: #333;
}

.layui-input-suffix {
    display: flex;
    flex: none;
    align-items: center;
    padding: 1px;
}
</style>
