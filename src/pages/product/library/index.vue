<template>
    <div class="product-library-page">
        <div>
            <!-- 搜索过滤区域 -->
            <lay-card>
                <div class="filter-section">
                    <lay-form :model="filterForm" layout="inline">
                        <lay-form-item label="产品名称">
                            <lay-input v-model="filterForm.productName" placeholder="请输入产品名称" style="width: 140px" />
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
                            <lay-button type="primary">
                                <lay-icon type="layui-icon-search" />
                            </lay-button>
                            <lay-button>
                                <lay-icon type="layui-icon-refresh" />
                            </lay-button>
                        </lay-form-item>
                    </lay-form>
                </div>
            </lay-card>

            <!-- 表格区域 -->
            <lay-card>
                <!-- 工具栏区域 -->
                <div class="fixed-table-toolbar">
                    <span data-title="AI填充数据" @click="handleAiFill" class="btnIcon invite-but">
                        <lay-icon type="layui-icon-set" />
                    </span>
                    <span data-title="复制" @click="handleCopy" class="btnIcon invite-but">
                        <lay-icon type="layui-icon-template" />
                    </span>
                    <span data-title="询价" @click="handleInquiry" class="btnIcon invite-but">
                        <lay-icon type="layui-icon-dollar" />
                    </span>
                    <span data-title="显示重复产品" @click="handleShowDuplicate" class="btnIcon invite-but">
                        <lay-icon type="layui-icon-table" />
                    </span>
                    <span data-title="单个新增" @click="handleSingleAdd" class="btnIcon invite-but">
                        <lay-icon type="layui-icon-addition" />
                    </span>
                    <span data-title="批量新增" @click="handleBatchAdd" class="btnIcon invite-but">
                        <lay-icon type="layui-icon-add-circle" />
                    </span>
                    <span data-title="修改" @click="handleEdit" class="btnIcon invite-but">
                        <lay-icon type="layui-icon-edit" />
                    </span>
                    <span data-title="删除" @click="handleDelete" class="btnIcon invite-but">
                        <lay-icon type="layui-icon-delete" />
                    </span>
                    <span data-title="批量导出" @click="handleBatchExport" class="btnIcon invite-but">
                        <lay-icon type="layui-icon-export" />
                    </span>
                    <span data-title="全库备份" @click="handleFullBackup" class="btnIcon invite-but">
                        <lay-icon type="layui-icon-download-circle" />
                    </span>
                    <span data-title="品牌管理" @click="handleBrandManagement" class="btnIcon invite-but">
                        <lay-icon type="layui-icon-diamond" />
                    </span>
                    <span data-title="添加至闲置云" @click="handleAddToIdleCloud" class="btnIcon invite-but">
                        <lay-icon type="layui-icon-upload" />
                    </span>

                    <div class="dropdown-container">
                        <button type="button" aria-label="columns" class="btn btn-default btn-outline dropdown-toggle"
                            @click="toggleColumnsDropdown">
                            <lay-icon type="layui-icon-shrink-right" />
                        </button>
                        <ul class="dropdown-menu" :class="{ 'show': showColumnsDropdown }">
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.productName"
                                        @change="updateVisibleColumns" /> 产品名称
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.brand"
                                        @change="updateVisibleColumns" /> 品牌
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.model"
                                        @change="updateVisibleColumns" /> 型号
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.parameters"
                                        @change="updateVisibleColumns" /> 参数/特性
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.unit"
                                        @change="updateVisibleColumns" /> 单位
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.cost"
                                        @change="updateVisibleColumns" /> 成本
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.referencePrice"
                                        @change="updateVisibleColumns" /> 参考售价
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.marketPrice"
                                        @change="updateVisibleColumns" /> 市场指导价
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.creator"
                                        @change="updateVisibleColumns" /> 创建人
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.cloudLibrary"
                                        @change="updateVisibleColumns" /> 云端库
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.openUpdate"
                                        @change="updateVisibleColumns" /> 开放更新
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.designatedOpen"
                                        @change="updateVisibleColumns" /> 指定开放
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.defaultDiscount"
                                        @change="updateVisibleColumns" /> 默认折率(%)
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.autoPrice"
                                        @change="updateVisibleColumns" /> 自动报价
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- 产品列表表格 -->
                <div class="content-area">
                    <lay-table :columns="visibleColumns" :data-source="tableData" :page="pagination"
                        @change="handleTableChange" :loading="loading">
                        <!-- 复选框列 -->
                        <template #checkbox="{ row }">
                            <div class="custom-checkbox" @click="toggleRowCheck(row)">
                                <div class="checkbox-square" :class="{ checked: row.checked }">
                                    <lay-icon v-if="row.checked" type="layui-icon-ok" />
                                </div>
                            </div>
                        </template>

                        <!-- 产品名称列 -->
                        <template #productName="{ row }">
                            <a href="#" class="product-link" @click.prevent="handleViewProduct(row)">{{ row.productName
                            }}</a>
                        </template>

                        <!-- 参数/特性列 -->
                        <template #parameters="{ row }">
                            <a href="#" class="parameters-link" @click.prevent="handleViewParameters(row)">{{
                                row.parameters }}</a>
                        </template>

                        <!-- 云端库开关 -->
                        <template #cloudLibrary="{ row }">
                            <lay-switch v-model="row.cloudLibrary" onswitch-text="ON" offswitch-text="OFF" :style="{
                                '--lay-switch-on-color': '#5FB878',
                                '--lay-switch-off-color': '#d9d9d9'
                            }" />
                        </template>

                        <!-- 开放更新列 -->
                        <template #openUpdate="{ row }">
                            <span :style="{ color: row.openUpdate ? '#5FB878' : '#999' }" class="action-text">
                                点击设置
                            </span>
                        </template>

                        <!-- 指定开放列 -->
                        <template #designatedOpen="{ row }">
                            <span :style="{ color: row.designatedOpen ? '#5FB878' : '#999' }" class="action-text">
                                点击设置
                            </span>
                        </template>

                        <!-- 自动报价开关 -->
                        <template #autoPrice="{ row }">
                            <lay-switch v-model="row.autoPrice" onswitch-text="开" offswitch-text="关" />
                        </template>
                    </lay-table>
                </div>
            </lay-card>
        </div>

        <!-- 产品详情弹窗 -->
        <ModalWindow :visible="productDetailVisible"
            :title="selectedProduct ? `${selectedProduct.productName}--详情` : '产品详情'" :btn="productDetailButtons"
            :sync-height="true" @close="closeProductDetail">
            <div v-if="selectedProduct" class="product-detail">
                <!-- 产品头部信息 -->
                <div class="product-header">
                    <div class="product-image">
                        <div class="image-placeholder">
                            <span class="placeholder-text">暂无图片信息</span>
                        </div>
                    </div>

                    <div class="product-basic-info">
                        <div class="info-row">
                            <span class="label">创建时间：</span>
                            <span class="value">2025-07-11 14:03:28</span>
                        </div>
                        <div class="info-row">
                            <span class="label">产品编号：</span>
                            <span class="value">P202507119560271667Z</span>
                        </div>
                        <div class="info-row">
                            <span class="label">品牌：</span>
                            <span class="value">{{ selectedProduct.brand }}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">型号：</span>
                            <span class="value">{{ selectedProduct.model }}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">数量单位：</span>
                            <span class="value">{{ selectedProduct.unit }}</span>
                        </div>

                        <!-- 价格信息表格 -->
                        <div class="price-table-section">
                            <div class="price-table">
                                <lay-table :columns="priceColumns" :data-source="priceData" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 选项卡内容 -->
                <div class="tabs-container">
                    <lay-tab v-model="activeTab" type="card">
                        <lay-tab-item id="1" title="产品参数">
                            <div class="tab-content">
                                <div class="param-list">
                                    <div class="param-item">
                                        <span class="param-label">屏幕尺寸：</span>
                                        <span class="param-value">6.78英寸</span>
                                    </div>
                                    <div class="param-item">
                                        <span class="param-label">分辨率：</span>
                                        <span class="param-value">3200 x 1440像素</span>
                                    </div>
                                    <div class="param-item">
                                        <span class="param-label">处理器：</span>
                                        <span class="param-value">高通骁龙8 Gen1</span>
                                    </div>
                                    <div class="param-item">
                                        <span class="param-label">内存：</span>
                                        <span class="param-value">8GB/12GB</span>
                                    </div>
                                    <div class="param-item">
                                        <span class="param-label">存储：</span>
                                        <span class="param-value">128GB/256GB/512GB</span>
                                    </div>
                                    <div class="param-item">
                                        <span class="param-label">后置摄像头：</span>
                                        <span class="param-value">5000万像素主摄+1200万像素超广角+1200万像素人像</span>
                                    </div>
                                    <div class="param-item">
                                        <span class="param-label">前置摄像头：</span>
                                        <span class="param-value">3200万像素</span>
                                    </div>
                                    <div class="param-item">
                                        <span class="param-label">电池容量：</span>
                                        <span class="param-value">4500mAh</span>
                                    </div>
                                    <div class="param-item">
                                        <span class="param-label">快充：</span>
                                        <span class="param-value">80W有线快充</span>
                                    </div>
                                    <div class="param-item">
                                        <span class="param-label">操作系统：</span>
                                        <span class="param-value">OriginOS Ocean基于Android 12</span>
                                    </div>
                                    <div class="param-item">
                                        <span class="param-label">网络：</span>
                                        <span class="param-value">5G全网通</span>
                                    </div>
                                </div>
                            </div>
                        </lay-tab-item>
                        <lay-tab-item id="2" title="产品特点">
                            <div class="tab-content">
                                <div class="features-content">
                                    <p>{{ selectedProduct.parameters }}</p>
                                    <br />
                                    <h4>主要特点：</h4>
                                    <ul>
                                        <li>高性能处理器，运行流畅</li>
                                        <li>大容量电池，续航持久</li>
                                        <li>多摄像头系统，拍照清晰</li>
                                        <li>快充技术，充电迅速</li>
                                        <li>5G网络支持，连接快速</li>
                                    </ul>
                                </div>
                            </div>
                        </lay-tab-item>
                    </lay-tab>
                </div>

                <!-- 设置状态信息 -->
                <div class="status-section">
                    <h3>产品设置状态</h3>
                    <div class="status-grid">
                        <div class="status-item">
                            <label>云端库：</label>
                            <span :class="['status', selectedProduct.cloudLibrary ? 'enabled' : 'disabled']">
                                {{ selectedProduct.cloudLibrary ? '已启用' : '已禁用' }}
                            </span>
                        </div>
                        <div class="status-item">
                            <label>开放更新：</label>
                            <span :class="['status', selectedProduct.openUpdate ? 'enabled' : 'disabled']">
                                {{ selectedProduct.openUpdate ? '已开放' : '未开放' }}
                            </span>
                        </div>
                        <div class="status-item">
                            <label>指定开放：</label>
                            <span :class="['status', selectedProduct.designatedOpen ? 'enabled' : 'disabled']">
                                {{ selectedProduct.designatedOpen ? '已开放' : '未开放' }}
                            </span>
                        </div>
                        <div class="status-item">
                            <label>自动报价：</label>
                            <span :class="['status', selectedProduct.autoPrice ? 'enabled' : 'disabled']">
                                {{ selectedProduct.autoPrice ? '已启用' : '已禁用' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </ModalWindow>

        <!-- 右侧参数详情弹窗 -->
        <RightSideModal :visible="parametersVisible" :title="`${selectedParametersProduct?.productName || ''} - 参数详情`"
            :width="rightModalWidth" :mask-closable="true" @close="closeParametersPopup">
            <div v-if="selectedParametersProduct" class="parameters-detail">
                <!-- 产品基本信息 -->
                <div class="info-section">
                    <h4 class="section-title">
                        <lay-icon type="layui-icon-list" />
                        基本信息
                    </h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="label">品牌：</span>
                            <span class="value">{{ selectedParametersProduct.brand }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">型号：</span>
                            <span class="value">{{ selectedParametersProduct.model }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">单位：</span>
                            <span class="value">{{ selectedParametersProduct.unit }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">创建人：</span>
                            <span class="value">{{ selectedParametersProduct.creator }}</span>
                        </div>
                    </div>
                </div>

                <!-- 详细参数 -->
                <div class="info-section">
                    <h4 class="section-title">
                        <lay-icon type="layui-icon-set" />
                        详细参数
                    </h4>
                    <div class="params-grid">
                        <div v-for="param in productParameters" :key="param.label" class="param-item">
                            <span class="param-label">{{ param.label }}：</span>
                            <span class="param-value">{{ param.value }}</span>
                        </div>
                    </div>
                </div>

                <!-- 价格信息 -->
                <div class="info-section">
                    <h4 class="section-title">
                        <lay-icon type="layui-icon-dollar" />
                        价格信息
                    </h4>
                    <div class="price-grid">
                        <div class="price-item cost">
                            <span class="label">成本价</span>
                            <span class="value">¥{{ selectedParametersProduct.cost }}</span>
                        </div>
                        <div class="price-item reference">
                            <span class="label">参考售价</span>
                            <span class="value">¥{{ selectedParametersProduct.referencePrice }}</span>
                        </div>
                        <div class="price-item market">
                            <span class="label">市场指导价</span>
                            <span class="value">¥{{ selectedParametersProduct.marketPrice }}</span>
                        </div>
                    </div>
                </div>

                <!-- 产品特性 -->
                <div class="info-section">
                    <h4 class="section-title">
                        <lay-icon type="layui-icon-star-fill" />
                        产品特性
                    </h4>
                    <div class="features-content">
                        <p class="description">{{ selectedParametersProduct.parameters }}</p>
                        <div class="features-list">
                            <div v-for="feature in productFeatures" :key="feature" class="feature-tag">
                                <lay-icon type="layui-icon-ok" />
                                {{ feature }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 设置状态 -->
                <div class="info-section">
                    <h4 class="section-title">
                        <lay-icon type="layui-icon-set-sm" />
                        设置状态
                    </h4>
                    <div class="status-grid">
                        <div class="status-item">
                            <span class="status-label">云端库</span>
                            <span
                                :class="['status-value', selectedParametersProduct.cloudLibrary ? 'enabled' : 'disabled']">
                                <lay-icon
                                    :type="selectedParametersProduct.cloudLibrary ? 'layui-icon-ok-circle' : 'layui-icon-close-fill'" />
                                {{ selectedParametersProduct.cloudLibrary ? '已启用' : '已禁用' }}
                            </span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">开放更新</span>
                            <span
                                :class="['status-value', selectedParametersProduct.openUpdate ? 'enabled' : 'disabled']">
                                <lay-icon
                                    :type="selectedParametersProduct.openUpdate ? 'layui-icon-ok-circle' : 'layui-icon-close-fill'" />
                                {{ selectedParametersProduct.openUpdate ? '已开放' : '未开放' }}
                            </span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">指定开放</span>
                            <span
                                :class="['status-value', selectedParametersProduct.designatedOpen ? 'enabled' : 'disabled']">
                                <lay-icon
                                    :type="selectedParametersProduct.designatedOpen ? 'layui-icon-ok-circle' : 'layui-icon-close-fill'" />
                                {{ selectedParametersProduct.designatedOpen ? '已开放' : '未开放' }}
                            </span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">自动报价</span>
                            <span
                                :class="['status-value', selectedParametersProduct.autoPrice ? 'enabled' : 'disabled']">
                                <lay-icon
                                    :type="selectedParametersProduct.autoPrice ? 'layui-icon-ok-circle' : 'layui-icon-close-fill'" />
                                {{ selectedParametersProduct.autoPrice ? '已启用' : '已禁用' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </RightSideModal>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from 'vue';
import RightSideModal from '@/components/RightSideModal.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import http from '@/utils/http';
import Notify from '@/utils/notify';

// 产品类型/型号接口类型定义
interface ProductModel {
    value: string;
    label: string;
    [key: string]: string;
}

// 产品接口类型定义
interface Product {
    checked: boolean;
    productName: string;
    brand: string;
    model: string;
    parameters: string;
    unit: string;
    cost: string;
    referencePrice: string;
    marketPrice: string;
    creator: string;
    cloudLibrary: boolean;
    openUpdate: boolean;
    designatedOpen: boolean;
    defaultDiscount: string;
    autoPrice: boolean;
}

// 产品详情弹窗状态
const productDetailVisible = ref(false);
const selectedProduct = ref<Product | null>(null);
const activeTab = ref('1');

// 右侧参数弹窗状态
const parametersVisible = ref(false);
const selectedParametersProduct = ref<Product | null>(null);

// 响应式弹窗宽度
const rightModalWidth = ref('35%');

// 产品参数数据
const productParameters = computed(() => [
    { label: '屏幕尺寸', value: '6.78英寸' },
    { label: '分辨率', value: '3200 x 1440像素' },
    { label: '处理器', value: '高通骁龙8 Gen1' },
    { label: '内存', value: '8GB/12GB' },
    { label: '存储', value: '128GB/256GB/512GB' },
    { label: '后置摄像头', value: '5000万像素主摄+1200万像素超广角+1200万像素人像' },
    { label: '前置摄像头', value: '3200万像素' },
    { label: '电池容量', value: '4500mAh' },
    { label: '快充', value: '80W有线快充' },
    { label: '操作系统', value: 'OriginOS Ocean基于Android 12' },
    { label: '网络', value: '5G全网通' }
]);

// 产品特性列表
const productFeatures = ref([
    '高性能处理器，运行流畅',
    '大容量电池，续航持久',
    '多摄像头系统，拍照清晰',
    '快充技术，充电迅速',
    '5G网络支持，连接快速'
]);

// 产品型号
const productModels = ref<ProductModel[]>([]);
//产品品牌
const productBrand = ref<ProductModel[]>([]);
//创建人
const productCreator = ref<ProductModel[]>([]);
// 获取产品数据
const fetchProductList = async () => {
    try {
        const params = {
            page: pagination.current,
            limit: pagination.limit,
        };


        // 使用params配置发送GET请求
        const response = await http.get('/product/productsList', params);
        console.log(response);
        // // 处理返回的数据，提取rows数组
        // if (response && response.rows && Array.isArray(response.rows)) {
        //     tableData.value = response.rows;
        // }
    } catch {
        Notify.error({
            title: '获取数据失败',
            content: '无法获取产品列表，请稍后重试',
            time: 3000
        });
    }
};
//获取产品类型
const fetchProductModels = async () => {
    try {
        const response = await http.post('/product/getModelS');
        // 处理字符串数组
        let modelData = [];
        if (response && Array.isArray(response)) {
            modelData = response;
            productModels.value = modelData.map((item: string) => ({
                value: item,
                label: item
            }));

        }
    } catch {
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
        if (response && Array.isArray(response)) {
            modelData = response;
            productBrand.value = modelData.map((item: string) => ({
                value: item,
                label: item
            }));

        }
    } catch {
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
        if (response && Array.isArray(response)) {
            modelData = response;
            productCreator.value = modelData.map((item: string) => ({
                value: item,
                label: item
            }));

        }
    } catch {
        Notify.error({
            title: '获取数据失败',
            content: '无法获取产品品牌，请稍后重试',
            time: 3000
        });
    }

};
// 产品详情弹窗按钮配置
const productDetailButtons = ref([
    {
        text: '关闭',
        callback: () => closeProductDetail()
    }
]);

// 价格表格配置
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const priceColumns: any[] = [
    { title: '成本价', key: 'cost', width: '120px' },
    { title: '参考售价', key: 'referencePrice', width: '120px' },
    { title: '市场指导价', key: 'marketPrice', width: '130px' }
];

// 价格数据
const priceData = computed(() => {
    if (!selectedProduct.value) return [];

    return [
        {
            cost: `¥${selectedProduct.value.cost}`,
            referencePrice: `¥${selectedProduct.value.referencePrice}`,
            marketPrice: `¥${selectedProduct.value.marketPrice}`
        }
    ];
});

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

// 列显示控制
const columnVisibility = reactive({
    productName: true,
    brand: true,
    model: true,
    parameters: true,
    unit: true,
    cost: true,
    referencePrice: true,
    marketPrice: true,
    creator: true,
    cloudLibrary: true,
    openUpdate: true,
    designatedOpen: true,
    defaultDiscount: true,
    autoPrice: true
});

const showColumnsDropdown = ref(false);

// 表格列配置
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allColumns: any[] = [
    {
        title: '',
        key: 'checkbox',
        width: '50px',
        customSlot: 'checkbox'
    },
    { title: '产品名称', key: 'productName', width: '120px', customSlot: 'productName' },
    { title: '品牌', key: 'brand', width: '80px' },
    { title: '型号', key: 'model', width: '100px' },
    { title: '参数/特性', key: 'parameters', width: '100px', customSlot: 'parameters' },
    { title: '单位', key: 'unit', width: '60px' },
    { title: '成本', key: 'cost', width: '80px' },
    { title: '参考售价', key: 'referencePrice', width: '80px' },
    { title: '市场指导价', key: 'marketPrice', width: '100px' },
    { title: '创建人', key: 'creator', width: '80px' },
    { title: '云端库', key: 'cloudLibrary', width: '80px', customSlot: 'cloudLibrary' },
    { title: '开放更新', key: 'openUpdate', width: '80px', customSlot: 'openUpdate' },
    { title: '指定开放', key: 'designatedOpen', width: '80px', customSlot: 'designatedOpen' },
    { title: '默认折率(%)', key: 'defaultDiscount', width: '100px' },
    { title: '自动报价', key: 'autoPrice', width: '80px', customSlot: 'autoPrice' }
];

// 计算可见列
const columns = computed(() => {
    return allColumns.filter(column => {
        if (column.key === 'checkbox') return true;
        return columnVisibility[column.key as keyof typeof columnVisibility];
    });
});

// 兼容原有代码，保持visibleColumns别名
const visibleColumns = columns;

// 表格数据 - 改为从API获取
const tableData = ref<Product[]>([]);

// 加载状态
const loading = ref(false);

// API调用函数 - 获取产品列表
// const fetchProductList = async () => {
//         const response = await http.get('/product/productsList', params, config);

//         if (response && response.data) {
//             tableData.value = response.data.map((item: any) => ({
//                 ...item,
//                 checked: false
//             }));

//         }
//     }catch{

//         Notify.error({
//             title: '获取数据失败',
//             content: '无法获取产品列表，请稍后重试',
//             time: 3000
//         });
//     }


// // 搜索处理
// const handleSearch = async () => {
//     pagination.current = 1;
//     await fetchProductList();
// };

// // 表格变化处理 - 修改为重新获取数据
// const handleTableChange = async (pageData: { current: number; limit: number }) => {
//     pagination.current = pageData.current;
//     pagination.limit = pageData.limit;
//     await fetchProductList();
// };

// // 刷新数据
// const handleRefresh = async () => {
//     await fetchProductList();
// };

// 分页配置
const pagination = reactive({
    current: 1,
    limit: 80,
    total: 0 // 新增总条数
});

// 全选状态
const allChecked = ref(false);
const indeterminate = ref(false);

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

// 更新全选状态
const updateCheckAllState = () => {
    const checkedCount = tableData.value.filter(item => item.checked).length;
    const total = tableData.value.length;

    if (checkedCount === 0) {
        allChecked.value = false;
        indeterminate.value = false;
    } else if (checkedCount === total) {
        allChecked.value = true;
        indeterminate.value = false;
    } else {
        allChecked.value = false;
        indeterminate.value = true;
    }
};

// 切换行复选框状态
const toggleRowCheck = (row: { checked: boolean }) => {
    row.checked = !row.checked;
    updateCheckAllState();
};

// 更新可见列
const updateVisibleColumns = () => {
    // 列显示状态更新时的处理逻辑
};

// 切换列下拉菜单
const toggleColumnsDropdown = () => {
    showColumnsDropdown.value = !showColumnsDropdown.value;
};

// 工具栏功能方法
// AI填充数据
const handleAiFill = () => {
    console.log('AI填充数据');
    // 这里可以调用AI接口填充产品数据
};

// 复制
const handleCopy = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要复制的产品');
        return;
    }
    console.log('复制产品:', selectedRows);
    // 这里可以实现复制产品功能
};

// 询价
const handleInquiry = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要询价的产品');
        return;
    }
    console.log('询价产品:', selectedRows);
    // 这里可以打开询价弹窗
};

// 显示重复产品
const handleShowDuplicate = () => {
    console.log('显示重复产品');
    // 这里可以筛选并显示重复的产品
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
const handleDelete = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要删除的产品');
        return;
    }
    console.log('删除产品:', selectedRows);
    // 这里可以执行删除操作
};

// 批量导出
const handleBatchExport = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要导出的产品');
        return;
    }
    console.log('批量导出产品:', selectedRows);
    // 这里可以执行批量导出
};

// 全库备份
const handleFullBackup = () => {
    console.log('全库备份');
    // 这里可以执行全库备份操作
};

// 品牌管理
const handleBrandManagement = () => {
    console.log('品牌管理');
    // 这里可以打开品牌管理弹窗
};

// 添加至闲置云
const handleAddToIdleCloud = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要添加到闲置云的产品');
        return;
    }
    console.log('添加至闲置云:', selectedRows);
    // 这里可以执行添加到闲置云的操作
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

    // 并行获取产品型号和产品列表
    await Promise.all([
        fetchProductModels(),
        fetchProductBrand(),
        fetchProductList(),
        fetchProductCreator()
    ]);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
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

// 工具栏样式
.fixed-table-toolbar {
    padding: 15px 20px;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 0;
    background: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;

    .btnIcon,
    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #495057;

        &:hover {
            background: #e9ecef;
            border-color: #adb5bd;
        }

        .layui-icon {
            font-size: 18px;
            line-height: 1;
        }
    }

    .invite-but {
        position: relative;

        &:hover::after {
            content: attr(data-title);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 8px;
            padding: 6px 10px;
            background: #333;
            color: #fff;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        &:hover::before {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 2px;
            border: 4px solid transparent;
            border-top-color: #333;
            z-index: 1001;
        }
    }

    .dropdown-container {
        position: relative;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 1000;
        display: none;
        min-width: 160px;
        padding: 5px 0;
        margin: 2px 0 0;
        font-size: 12px;
        text-align: left;
        list-style: none;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);

        &.show {
            display: block;
        }

        li {
            &:hover {
                background-color: #f5f5f5;
            }

            label {
                display: block;
                padding: 8px 15px;
                font-weight: normal;
                line-height: 1.4;
                color: #333;
                white-space: nowrap;
                cursor: pointer;
                margin: 0;

                input[type="checkbox"] {
                    margin-right: 8px;
                }
            }
        }
    }
}

// 复选框样式
.custom-checkbox {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.checkbox-square {
    width: 14px;
    height: 14px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    .layui-icon {
        font-size: 10px;
        line-height: 1;
    }

    &.checked {
        background-color: #5FB878;
        border-color: #5FB878;
        color: white;
    }
}

// 链接样式
.product-link,
.parameters-link {
    color: #1890ff;
    text-decoration: none;
    font-size: 12px;

    &:hover {
        text-decoration: underline;
    }
}

// 操作文字样式
.action-text {
    cursor: pointer;
    font-size: 12px;

    &:hover {
        text-decoration: underline;
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

// 产品详情弹窗样式
.product-detail {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
    font-size: 14px;
    line-height: 1.6;

    .product-header {
        display: flex;
        align-items: flex-start;
        margin-bottom: 24px;
        padding-bottom: 20px;
        border-bottom: 1px solid #f0f0f0;

        .product-image {
            width: 120px;
            height: 120px;
            border-radius: 8px;
            overflow: hidden;
            margin-right: 24px;
            background-color: #f0f0f0;

            .image-placeholder {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #888;
                font-size: 13px;
                line-height: 1.4;
            }
        }

        .product-basic-info {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            flex: 1;

            .info-row {
                display: flex;
                margin-bottom: 8px;
                line-height: 1.5;

                .label {
                    font-weight: 500;
                    color: #666;
                    min-width: 80px;
                    margin-right: 12px;
                    font-size: 14px;
                }

                .value {
                    color: #333;
                    font-weight: 600;
                    font-size: 14px;
                }
            }

            .price-table-section {
                margin-top: 16px;

                .price-table {
                    :deep(.layui-table) {
                        border: 1px solid #e8e8e8;
                        border-radius: 6px;
                        overflow: hidden;
                        font-size: 12px;

                        .layui-table-header {
                            background: #f8f9fa;
                        }

                        .layui-table-body {
                            tr:hover {
                                background-color: #f0f8ff;
                            }
                        }

                        th,
                        td {
                            border-color: #e8e8e8;
                            text-align: center;
                            padding: 6px 8px;
                        }

                        .layui-table-cell-content {
                            text-align: center;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 13px;
                        }
                    }
                }
            }
        }

        .product-title {
            h2 {
                margin: 0;
                font-size: 26px;
                color: #333;
                font-weight: 700;
                line-height: 1.3;
            }
        }
    }

    .tabs-container {
        margin-bottom: 24px;

        :deep(.layui-tab) {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

            .layui-tab-title {
                li {
                    font-size: 15px;
                    padding: 12px 20px;
                    line-height: 1.4;
                    font-weight: 500;
                }
            }

            .layui-tab-content {
                padding: 24px;
                background-color: #f8f9fa;
                border-radius: 0 0 8px 8px;
                min-height: 200px;
            }
        }

        .tab-content {
            .param-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 16px 28px;

                .param-item {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 4px;

                    .param-label {
                        font-weight: 500;
                        font-size: 14px;
                        line-height: 1.5;
                        flex-shrink: 0;
                    }

                    .param-value {
                        color: #333;
                        font-weight: 600;
                        font-size: 14px;
                        line-height: 1.5;
                    }
                }
            }

            .features-content {
                p {
                    margin: 0 0 18px 0;
                    color: #666;
                    line-height: 1.7;
                    font-size: 14px;
                }

                h4 {
                    margin: 0 0 12px 0;
                    font-size: 16px;
                    color: #333;
                    font-weight: 600;
                    line-height: 1.4;
                }

                ul {
                    padding-left: 24px;
                    margin: 0;

                    li {
                        color: #666;
                        line-height: 1.7;
                        font-size: 14px;
                        margin-bottom: 6px;
                    }
                }
            }
        }
    }

    .status-section {
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid #f0f0f0;

        h3 {
            margin: 0 0 18px 0;
            font-size: 17px;
            color: #333;
            font-weight: 600;
            line-height: 1.4;
        }

        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 16px;
        }

        .status-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background: #fafafa;
            border-radius: 6px;

            label {
                font-weight: 500;
                color: #666;
                min-width: 80px;
                margin-right: 12px;
                font-size: 14px;
                line-height: 1.4;
            }

            .status {
                padding: 4px 12px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 500;
                line-height: 1.3;

                &.enabled {
                    background: #f6ffed;
                    color: #52c41a;
                    border: 1px solid #b7eb8f;
                }

                &.disabled {
                    background: #fff2f0;
                    color: #ff4d4f;
                    border: 1px solid #ffccc7;
                }
            }
        }
    }
}

// 右侧弹窗内容样式优化
.parameters-detail {
    .info-section {
        margin-bottom: 24px;

        &:last-child {
            margin-bottom: 0;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0 0 16px 0;
            font-size: 16px;
            color: #333;
            font-weight: 600;
            padding-bottom: 8px;
            border-bottom: 2px solid #1890ff;

            .layui-icon {
                color: #1890ff;
                font-size: 16px;
            }
        }

        .info-grid,
        .params-grid {
            display: grid;
            gap: 12px;
        }

        .info-item,
        .param-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
            border-left: 3px solid #e8e8e8;
            transition: all 0.2s ease;

            &:hover {
                border-left-color: #1890ff;
                background: #f0f8ff;
            }

            .label,
            .param-label {
                font-weight: 500;
                color: #666;
                min-width: 80px;
                flex-shrink: 0;
                font-size: 13px;
            }

            .value,
            .param-value {
                color: #333;
                font-weight: 600;
                font-size: 13px;
                flex: 1;
                word-break: break-all;
            }
        }

        .price-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;

            .price-item {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 16px;
                text-align: center;
                border: 2px solid transparent;
                transition: all 0.3s ease;

                &.cost {
                    border-color: #ff7875;

                    &:hover {
                        background: #fff2f0;
                        transform: translateY(-2px);
                    }
                }

                &.reference {
                    border-color: #52c41a;

                    &:hover {
                        background: #f6ffed;
                        transform: translateY(-2px);
                    }
                }

                &.market {
                    border-color: #1890ff;

                    &:hover {
                        background: #f0f8ff;
                        transform: translateY(-2px);
                    }
                }

                .label {
                    display: block;
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 8px;
                    font-weight: 500;
                }

                .value {
                    display: block;
                    font-size: 18px;
                    font-weight: 700;
                    color: #333;
                }
            }
        }

        .features-content {
            .description {
                margin: 0 0 16px 0;
                color: #666;
                line-height: 1.6;
                font-size: 14px;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 3px solid #1890ff;
            }

            .features-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;

                .feature-tag {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    background: #e6f7ff;
                    color: #1890ff;
                    border-radius: 16px;
                    font-size: 12px;
                    font-weight: 500;
                    border: 1px solid #91d5ff;

                    .layui-icon {
                        font-size: 12px;
                    }
                }
            }
        }

        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;

            .status-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: #f8f9fa;
                border-radius: 6px;
                transition: all 0.2s ease;

                &:hover {
                    background: #f0f8ff;
                }

                .status-label {
                    font-weight: 500;
                    color: #333;
                    font-size: 14px;
                }

                .status-value {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 13px;
                    font-weight: 600;

                    &.enabled {
                        color: #52c41a;
                    }

                    &.disabled {
                        color: #ff4d4f;
                    }

                    .layui-icon {
                        font-size: 14px;
                    }
                }
            }
        }
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
