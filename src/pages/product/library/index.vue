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
                                    <input type="checkbox" v-model="columnVisibility.proId"
                                        @change="updateVisibleColumns" /> 产品编号
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.name"
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
                                    <input type="checkbox" v-model="columnVisibility.trait"
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
                                    <input type="checkbox" v-model="columnVisibility.purchaseprice"
                                        @change="updateVisibleColumns" /> 成本
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.price"
                                        @change="updateVisibleColumns" /> 参考售价
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.marketprice"
                                        @change="updateVisibleColumns" /> 市场指导价
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.pictureaddress"
                                        @change="updateVisibleColumns" /> 产品图片
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="columnVisibility.uname"
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
                                        @change="updateVisibleColumns" /> 开放星标
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
                                    <input type="checkbox" v-model="columnVisibility.autoHandle"
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
                            <a href="#" class="product-link" @click.prevent="handleViewProduct(row)">{{ row.name
                            }}</a>
                        </template>

                        <!-- 产品图片列 -->
                        <template #productImage="{ row }">
                            <div class="table-image-container">
                                <img v-if="row.pictureaddress || row.pictureaddressOne"
                                    :src="`https://yx.newbeall.com/softLink/${row.pictureaddress || row.pictureaddressOne}`"
                                    :alt="row.name" class="table-product-image" @error="handleImageError" />
                                <div v-else class="table-no-image">
                                    <lay-icon type="layui-icon-picture" />
                                </div>
                            </div>
                        </template>

                        <!-- 参数/特性列 -->
                        <template #parameters="{ row }">
                            <a href="#" class="parameters-link" @click.prevent="handleViewParameters(row)">参数特性</a>
                        </template>

                        <!-- 云端库开关 -->
                        <template #cloudLibrary="{ row }">
                            <lay-switch :model-value="row.isOpen === 1"
                                @update:model-value="(value) => updateCloudLibraryStatus(row, value)" onswitch-text="ON"
                                offswitch-text="OFF" :style="{
                                    '--lay-switch-on-color': '#5FB878',
                                    '--lay-switch-off-color': '#d9d9d9'
                                }" />
                        </template>

                        <!-- 开放星标列 -->
                        <template #openUpdate="{ row }">
                            <span :style="{ color: '#5FB878' }" class="action-text"
                                @click="handleOpenPermissionManagement(row)">
                                点击设置
                            </span>
                        </template>

                        <!-- 指定开放列 -->
                        <template #designatedOpen="{ row }">
                            <span :style="{ color: '#5FB878' }" class="action-text"
                                @click="handleOpenDesignatedOpenManagement(row)">
                                点击设置
                            </span>
                        </template>

                        <!-- 自动报价开关 -->
                        <template #autoPrice="{ row }">
                            <lay-switch v-model="row.autoHandle" onswitch-text="开" offswitch-text="关" />
                        </template>
                    </lay-table>
                </div>
            </lay-card>
        </div>

        <!-- 产品详情弹窗 -->
        <ModalWindow :visible="productDetailVisible" :title="selectedProduct ? `${selectedProduct.name}--详情` : '产品详情'"
            :btn="productDetailButtons" :sync-height="true" @close="closeProductDetail">
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
                            <span class="value">{{ selectedProduct.createtime || '暂无' }}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">产品编号：</span>
                            <span class="value">{{ selectedProduct.proId }}</span>
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
                                        <span class="param-label">产品参数：</span>
                                        <span class="param-value">{{ selectedProduct.param || '暂无参数' }}</span>
                                    </div>
                                    <div class="param-item">
                                        <span class="param-label">产品特征：</span>
                                        <span class="param-value">{{ selectedProduct.trait || '暂无特征' }}</span>
                                    </div>
                                    <div class="param-item">
                                        <span class="param-label">库存数量：</span>
                                        <span class="param-value">{{ selectedProduct.inventory }}</span>
                                    </div>
                                    <div class="param-item">
                                        <span class="param-label">销售数量：</span>
                                        <span class="param-value">{{ selectedProduct.sales }}</span>
                                    </div>
                                </div>
                            </div>
                        </lay-tab-item>
                        <lay-tab-item id="2" title="产品特点">
                            <div class="tab-content">
                                <div class="features-content">
                                    <p>{{ selectedProduct.trait }}</p>
                                    <br />
                                    <h4>产品信息：</h4>
                                    <ul>
                                        <li>品牌：{{ selectedProduct.brand }}</li>
                                        <li>型号：{{ selectedProduct.model }}</li>
                                        <li>创建用户：{{ selectedProduct.uname }}</li>
                                        <li>公司：{{ selectedProduct.company }}</li>
                                        <li>默认折扣：{{ selectedProduct.defaultDiscount }}%</li>
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
                            <label>开放状态：</label>
                            <span :class="['status', selectedProduct.isOpen ? 'enabled' : 'disabled']">
                                {{ selectedProduct.isOpen ? '已开放' : '未开放' }}
                            </span>
                        </div>
                        <div class="status-item">
                            <label>自动处理：</label>
                            <span :class="['status', selectedProduct.autoHandle ? 'enabled' : 'disabled']">
                                {{ selectedProduct.autoHandle ? '已启用' : '已禁用' }}
                            </span>
                        </div>
                        <div class="status-item">
                            <label>审核状态：</label>
                            <span :class="['status', selectedProduct.approved ? 'enabled' : 'disabled']">
                                {{ selectedProduct.approved ? '已审核' : '未审核' }}
                            </span>
                        </div>
                        <div class="status-item">
                            <label>库存管理：</label>
                            <span :class="['status', selectedProduct.isInventory ? 'enabled' : 'disabled']">
                                {{ selectedProduct.isInventory ? '已启用' : '已禁用' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </ModalWindow>

        <!-- 产品星标管理弹窗 -->
        <RightSideModal :visible="permissionVisible" :title="`产品星标管理`" :width="rightModalWidth" :mask-closable="true"
            @close="closePermissionPopup">
            <div class="permission-management">
                <!-- 注意提示 -->
                <div class="notice-section">
                    <div class="notice-content">
                        <span class="notice-text">注意：当前操作产品：</span>
                        <span class="product-name">{{ selectedPermissionProduct?.name || '测试产品' }}</span>
                    </div>
                </div>

                <!-- 授权公司选择 -->
                <div class="company-select-section">
                    <div class="select-container">
                        <lay-select v-model="selectedCompany" :placeholder="companySearchText" style="width: 200px;">
                            <lay-select-option value="">请选择授权公司</lay-select-option>
                            <lay-select-option v-for="company in authorizedCompanies" :key="company.id"
                                :value="company.id">
                                {{ company.name }}
                            </lay-select-option>
                        </lay-select>
                        <button class="add-btn">
                            <lay-icon type="layui-icon-addition" />
                        </button>
                    </div>
                </div>

                <!-- 公司列表表格 -->
                <div class="company-table-section">
                    <div class="table-toolbar">
                        <div class="dropdown-container">
                            <button type="button" aria-label="columns"
                                class="btn btn-default btn-outline dropdown-toggle"
                                @click="togglePermissionColumnsDropdown">
                                <lay-icon type="layui-icon-shrink-right" />
                            </button>
                            <ul class="dropdown-menu" :class="{ 'show': showPermissionColumnsDropdown }">
                                <li role="menuitem">
                                    <label>
                                        <input type="checkbox" v-model="permissionColumnVisibility.companyName"
                                            @change="updatePermissionVisibleColumns" /> 公司名称
                                    </label>
                                </li>
                                <li role="menuitem">
                                    <label>
                                        <input type="checkbox" v-model="permissionColumnVisibility.deleteRule"
                                            @change="updatePermissionVisibleColumns" /> 删除规则
                                    </label>
                                </li>
                                <li role="menuitem">
                                    <label>
                                        <input type="checkbox" v-model="permissionColumnVisibility.status"
                                            @change="updatePermissionVisibleColumns" /> 状态
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="company-table">
                        <table class="simple-table">
                            <thead>
                                <tr>
                                    <th v-if="permissionColumnVisibility.companyName">公司名称</th>
                                    <th v-if="permissionColumnVisibility.deleteRule">删除规则</th>
                                    <th v-if="permissionColumnVisibility.status">状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="company in authorizedCompanies" :key="company.id">
                                    <td v-if="permissionColumnVisibility.companyName">{{ company.name }}</td>
                                    <td v-if="permissionColumnVisibility.deleteRule">默认规则</td>
                                    <td v-if="permissionColumnVisibility.status">
                                        <span
                                            :class="['status-badge', company.status === '已授权' ? 'authorized' : 'unauthorized']">
                                            {{ company.status }}
                                        </span>
                                    </td>
                                </tr>
                                <tr v-if="authorizedCompanies.length === 0">
                                    <td :colspan="getPermissionVisibleColumnsCount()" class="no-data">无数据</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </RightSideModal>

        <!-- 右侧参数详情弹窗 -->
        <RightSideModal :visible="parametersVisible" :title="`${selectedParametersProduct?.name || ''} - 产品详情`"
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
                            <span class="label">产品名称：</span>
                            <span class="value">{{ selectedParametersProduct?.name }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">品牌：</span>
                            <span class="value">{{ selectedParametersProduct?.brand }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">型号：</span>
                            <span class="value">{{ selectedParametersProduct?.model }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">单位：</span>
                            <span class="value">{{ selectedParametersProduct?.unit }}</span>
                        </div>
                    </div>
                </div>

                <!-- 产品图片 -->
                <div class="info-section">
                    <h4 class="section-title">
                        <lay-icon type="layui-icon-picture" />
                        产品图片
                    </h4>
                    <div class="product-images">
                        <div class="single-image-container"
                            v-if="selectedParametersProduct?.pictureaddress || selectedParametersProduct?.pictureaddressOne">
                            <img :src="`https://yx.newbeall.com/softLink/${selectedParametersProduct?.pictureaddress || selectedParametersProduct?.pictureaddressOne}`"
                                :alt="selectedParametersProduct?.name" class="product-image-full"
                                @error="handleImageError" />
                        </div>
                        <div v-else class="single-image-container no-image">
                            <lay-icon type="layui-icon-picture" />
                            <span>暂无图片</span>
                        </div>
                    </div>
                </div>

                <!-- 产品特点 -->
                <div class="info-section">
                    <h4 class="section-title">
                        <lay-icon type="layui-icon-star-fill" />
                        产品特点
                    </h4>
                    <div class="features-content">
                        <p class="description">{{ selectedParametersProduct?.trait || '暂无产品特点描述' }}</p>
                    </div>
                </div>

                <!-- 详细参数 -->
                <div class="info-section">
                    <h4 class="section-title">
                        <lay-icon type="layui-icon-set" />
                        详细参数
                    </h4>
                    <div class="params-content">
                        <div class="param-description">
                            <div class="param-text"
                                v-html="formatParamText(selectedParametersProduct?.param || '暂无详细参数描述')">
                            </div>
                        </div>
                        <div class="params-grid">
                            <div class="param-item">
                                <span class="param-label">库存数量：</span>
                                <span class="param-value">{{ selectedParametersProduct?.inventory }}</span>
                            </div>
                            <div class="param-item">
                                <span class="param-label">销售数量：</span>
                                <span class="param-value">{{ selectedParametersProduct?.sales }}</span>
                            </div>
                            <div class="param-item">
                                <span class="param-label">默认折扣：</span>
                                <span class="param-value">{{ selectedParametersProduct?.defaultDiscount }}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 产品资料 -->
                <div class="info-section">
                    <h4 class="section-title">
                        <lay-icon type="layui-icon-file" />
                        产品资料
                    </h4>
                    <div class="no-data-message">
                        <p>暂无数据</p>
                    </div>
                </div>
            </div>
        </RightSideModal>

        <!-- 指定开放管理弹窗 -->
        <RightSideModal :visible="designatedOpenVisible" :title="`指定开放管理`" :width="rightModalWidth"
            :mask-closable="true" @close="closeDesignatedOpenPopup">
            <div class="permission-management">
                <!-- 注意提示 -->
                <div class="notice-section">
                    <div class="notice-content">
                        <span class="notice-text">注意：当前操作产品：</span>
                        <span class="product-name">{{ selectedDesignatedOpenProduct?.name || '测试产品' }}</span>
                    </div>
                </div>

                <!-- 授权公司选择 -->
                <div class="company-select-section">
                    <div class="select-container">
                        <lay-select v-model="selectedCompany" :placeholder="companySearchText" style="width: 200px;">
                            <lay-select-option value="">请选择授权公司</lay-select-option>
                            <lay-select-option v-for="company in authorizedCompanies" :key="company.id"
                                :value="company.id">
                                {{ company.name }}
                            </lay-select-option>
                        </lay-select>
                        <button class="add-btn">
                            <lay-icon type="layui-icon-addition" />
                        </button>
                    </div>
                </div>

                <!-- 公司列表表格 -->
                <div class="company-table-section">
                    <div class="table-toolbar">
                        <div class="dropdown-container">
                            <button type="button" aria-label="columns"
                                class="btn btn-default btn-outline dropdown-toggle"
                                @click="toggleDesignatedOpenColumnsDropdown">
                                <lay-icon type="layui-icon-shrink-right" />
                            </button>
                            <ul class="dropdown-menu" :class="{ 'show': showDesignatedOpenColumnsDropdown }">
                                <li role="menuitem">
                                    <label>
                                        <input type="checkbox" v-model="designatedOpenColumnVisibility.companyName"
                                            @change="updateDesignatedOpenVisibleColumns" /> 公司名称
                                    </label>
                                </li>
                                <li role="menuitem">
                                    <label>
                                        <input type="checkbox" v-model="designatedOpenColumnVisibility.deleteRule"
                                            @change="updateDesignatedOpenVisibleColumns" /> 删除规则
                                    </label>
                                </li>
                                <li role="menuitem">
                                    <label>
                                        <input type="checkbox" v-model="designatedOpenColumnVisibility.status"
                                            @change="updateDesignatedOpenVisibleColumns" /> 状态
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="company-table">
                        <table class="simple-table">
                            <thead>
                                <tr>
                                    <th v-if="designatedOpenColumnVisibility.companyName">公司名称</th>
                                    <th v-if="designatedOpenColumnVisibility.deleteRule">删除规则</th>
                                    <th v-if="designatedOpenColumnVisibility.status">状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="company in authorizedCompanies" :key="company.id">
                                    <td v-if="designatedOpenColumnVisibility.companyName">{{ company.name }}</td>
                                    <td v-if="designatedOpenColumnVisibility.deleteRule">默认规则</td>
                                    <td v-if="designatedOpenColumnVisibility.status">
                                        <span
                                            :class="['status-badge', company.status === '已授权' ? 'authorized' : 'unauthorized']">
                                            {{ company.status }}
                                        </span>
                                    </td>
                                </tr>
                                <tr v-if="authorizedCompanies.length === 0">
                                    <td :colspan="getDesignatedOpenVisibleColumnsCount()" class="no-data">无数据</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </RightSideModal>

        <!-- 闲置云询价弹窗 -->
        <RightSideModal :visible="idleCloudVisible" :title="`请输入闲置售价`" :width="rightModalWidth" :mask-closable="true"
            @close="closeIdleCloudPopup">
            <div class="idle-cloud-form">
                <div class="form-group">
                    <label for="idlePrice">{{ selectedIdleProduct.name }}：</label>
                    <input type="text" id="idlePrice" v-model="idleCloudForm.idlePrice" placeholder="请输入库存售价" />
                </div>

                <!-- 备注选择开关 -->
                <div class="form-group">
                    <label class="switch-label">
                        <input type="checkbox" v-model="idleCloudForm.enableRemarks" />
                        <span class="switch-text">添加备注</span>
                    </label>
                </div>

                <!-- 表格区域，根据备注开关决定是否显示 -->
                <div v-if="idleCloudForm.enableRemarks" class="details-table">
                    <div class="form-group">
                        <label for="condition">成色：</label>
                        <input type="text" id="condition" v-model="idleCloudForm.condition" placeholder="请输入成色" />
                    </div>
                    <div class="form-group">
                        <label for="functionalState">功能状态：</label>
                        <input type="text" id="functionalState" v-model="idleCloudForm.functionalState"
                            placeholder="请输入功能状态" />
                    </div>
                    <div class="form-group">
                        <label for="equipmentDetails">设备详情：</label>
                        <textarea id="equipmentDetails" v-model="idleCloudForm.equipmentDetails"
                            placeholder="请输入设备详情"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="isUnderWarranty">是否在保：</label>
                        <input type="text" id="isUnderWarranty" v-model="idleCloudForm.isUnderWarranty"
                            placeholder="请输入是否在保" />
                    </div>
                    <div class="form-group">
                        <label for="others">其他：</label>
                        <textarea id="others" v-model="idleCloudForm.others" placeholder="请输入其他"></textarea>
                    </div>
                </div>
                <div class="form-actions">
                    <lay-button type="primary" @click="submitIdleCloudForm">确定</lay-button>
                    <lay-button @click="closeIdleCloudPopup">取消</lay-button>
                </div>
            </div>
        </RightSideModal>

        <!-- 品牌管理页面覆盖层 -->
        <div v-if="brandManagementVisible" class="brand-management-overlay">
            <div class="brand-management-page">
                <div class="brand-header">
                    <h2>品牌管理</h2>
                    <button class="close-btn" @click="closeBrandManagement">
                        <lay-icon type="layui-icon-close" />
                    </button>
                </div>
                <div class="brand-content">
                    <div class="brand-table-container">
                        <table class="brand-table">
                            <thead>
                                <tr>
                                    <th>品牌</th>
                                    <th>云端库</th>
                                    <th>星标指定开放</th>
                                    <th>品牌指定开放</th>
                                    <th>默认折率(%)</th>
                                    <th>自动报价</th>
                                    <th>品牌自动报价管理</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="brand in brandList" :key="brand.id">
                                    <td>{{ brand.name }}</td>
                                    <td>
                                        <lay-switch :model-value="brand.isOpen === 1"
                                            @update:model-value="(value) => updateBrandCloudLibrary(brand, value)"
                                            onswitch-text="ON" offswitch-text="OFF" />
                                    </td>
                                    <td>
                                        <span class="setting-link" @click="handleStarSetting(brand)">点击设置</span>
                                    </td>
                                    <td>
                                        <span class="setting-link" @click="handleBrandSetting(brand)">点击设置</span>
                                    </td>
                                    <td>{{ brand.defaultDiscount }}</td>
                                    <td>
                                        <lay-switch :model-value="brand.autoPrice"
                                            @update:model-value="(value) => updateBrandAutoPrice(brand, value)"
                                            onswitch-text="ON" offswitch-text="OFF" />
                                    </td>
                                    <td>
                                        <button class="management-btn" @click="handleBrandPriceManagement(brand)">
                                            <lay-icon type="layui-icon-set" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- 品牌自动报价管理弹窗 -->
        <RightSideModal :visible="brandPriceManagementVisible" :title="`品牌自动报价管理`" :width="rightModalWidth"
            :mask-closable="true" @close="closeBrandPriceManagement">
            <div class="brand-price-management">
                <!-- 顶部输入搜索区域 -->
                <div class="search-section">
                    <div class="search-row">
                        <label>请输入公司名称</label>
                        <input type="text" v-model="brandPriceForm.companyName" placeholder="请输入公司名称"
                            class="search-input" />
                        <span class="highlight-text">当前操作品牌自产优质</span>
                    </div>
                </div>

                <!-- 添加按钮和表格 -->
                <div class="table-section">
                    <!-- 添加按钮 -->
                    <div class="add-button-row">
                        <button class="add-btn" @click="handleAddCompany">
                            <lay-icon type="layui-icon-add-1" />
                        </button>
                        <div class="column-filter">
                            <lay-icon type="layui-icon-shrink-right" @click="toggleBrandPriceColumnsDropdown" />
                            <div v-if="showBrandPriceColumnsDropdown" class="columns-dropdown">
                                <div class="dropdown-header">
                                    <span>选择显示列</span>
                                    <button @click="toggleBrandPriceColumnsDropdown" class="close-dropdown">×</button>
                                </div>
                                <div class="column-options">
                                    <label v-for="column in allBrandPriceColumns" :key="column.key">
                                        <input type="checkbox" v-model="brandPriceColumnVisibility[column.key]" />
                                        {{ column.title }}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 品牌自动报价表格 -->
                    <div class="brand-price-table-container">
                        <table class="brand-price-table">
                            <thead>
                                <tr>
                                    <th v-if="brandPriceColumnVisibility.companyName">公司名称</th>
                                    <th v-if="brandPriceColumnVisibility.entryTime">载至时间</th>
                                    <th v-if="brandPriceColumnVisibility.defaultPrice">默认折率</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="company in brandPriceCompanyList" :key="company.id">
                                    <td v-if="brandPriceColumnVisibility.companyName">{{ company.name }}</td>
                                    <td v-if="brandPriceColumnVisibility.entryTime">{{ company.entryTime }}</td>
                                    <td v-if="brandPriceColumnVisibility.defaultPrice">{{ company.defaultPrice }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- 分页 -->
                    <div class="pagination-section">
                        <div class="pagination-controls">
                            <span class="pagination-info">共 1 条</span>
                            <div class="pagination-buttons">
                                <button class="page-btn current">1</button>
                            </div>
                            <div class="page-size-selector">
                                <select v-model="brandPricePagination.pageSize">
                                    <option value="10">10 条/页</option>
                                    <option value="20">20 条/页</option>
                                    <option value="50">50 条/页</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RightSideModal>

        <!-- 删除确认弹窗 -->
        <!-- 已移除删除确认弹窗，改用原生confirm -->

    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from 'vue';
import RightSideModal from '@/components/RightSideModal.vue';
import ModalWindow from '@/components/ModalWindow.vue';
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
const activeTab = ref('1');

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
const idleCloudForm = reactive({
    idlePrice: '',        // 库存售价
    enableRemarks: false,  // 是否添加备注
    remarks: '',          // 备注
    condition: '',        // 成色
    functionalState: '',  // 功能状态
    equipmentDetails: '', // 设备详情
    isUnderWarranty: '',  // 是否在保
    others: ''            // 其他
});

// 响应式弹窗宽度
const rightModalWidth = ref('35%');

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
        if (response.data && Array.isArray(response.data)) {
            authorizedCompanies.value = response.data.map((company: any) => ({
                id: company.id || company.companyId,
                name: company.companyName,
                status: company.aduitStatus === 1 ? '已授权' : '未授权'
            }));
        }
    } catch {
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
        const params = {
            page: pagination.current,
            limit: pagination.limit,
        };

        const response = await http.get('/product/productsList', params);
        if (response && response.rows && Array.isArray(response.rows)) {
            tableData.value = response.rows.map((item: any) => ({
                ...item,
                checked: false
            }));
            pagination.total = response.total || response.rows.length;
        }
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
            cost: `¥${selectedProduct.value.purchaseprice}`,
            referencePrice: `¥${selectedProduct.value.price}`,
            marketPrice: `¥${selectedProduct.value.marketprice}`
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
    proId: true,             // 产品编号
    name: true,              // 产品名称
    brand: true,             // 品牌
    model: true,             // 型号
    trait: true,             // 产品特点
    unit: true,              // 单位
    purchaseprice: true,     // 成本
    price: true,             // 参考售价
    marketprice: true,       // 市场指导价
    pictureaddress: true,    // 产品图片
    uname: true,             // 创建人
    cloudLibrary: true,      // 云端库
    openUpdate: true,        // 开放星标
    designatedOpen: true,    // 指定开放
    defaultDiscount: true,   // 默认折率
    autoHandle: true         // 自动报价
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
    { title: '产品编号', key: 'proId', width: '100px' },
    { title: '产品名称', key: 'name', width: '120px', customSlot: 'productName' },
    { title: '品牌', key: 'brand', width: '80px' },
    { title: '型号', key: 'model', width: '100px' },
    { title: '参数/特性', key: 'trait', width: '100px', customSlot: 'parameters' },
    { title: '单位', key: 'unit', width: '60px' },
    { title: '成本', key: 'purchaseprice', width: '80px' },
    { title: '参考售价', key: 'price', width: '80px' },
    { title: '市场指导价', key: 'marketprice', width: '100px' },
    { title: '产品图片', key: 'pictureaddress', width: '80px', customSlot: 'productImage' },
    { title: '创建人', key: 'uname', width: '80px' },
    { title: '云端库', key: 'cloudLibrary', width: '80px', customSlot: 'cloudLibrary' },
    { title: '开放星标', key: 'openUpdate', width: '80px', customSlot: 'openUpdate' },
    { title: '指定开放', key: 'designatedOpen', width: '80px', customSlot: 'designatedOpen' },
    { title: '默认折率(%)', key: 'defaultDiscount', width: '100px' },
    { title: '自动报价', key: 'autoHandle', width: '80px', customSlot: 'autoPrice' }
];

// 计算可见列
const columns = computed(() => {
    return allColumns.filter(column => {
        if (column.key === 'checkbox') return true;
        return columnVisibility[column.key as keyof typeof columnVisibility] !== false;
    });
});

// 兼容原有代码，保持visibleColumns别名
const visibleColumns = columns;

// 表格数据 - 改为从API获取
const tableData = ref<Product[]>([]);

// 加载状态
const loading = ref(false);
// 表格变化处理
const handleTableChange = async (pageData: { current: number; limit: number }) => {
    pagination.current = pageData.current;
    pagination.limit = pageData.limit;
    await fetchProductList();
};

// 刷新数据
const handleRefresh = async () => {
    await fetchProductList();
};

// 分页配置
const pagination = reactive({
    current: 1,
    limit: 80,
    total: 0
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
        Notify.error({
            title: '提示',
            content: '请选择要复制的产品',
            time: 3000
        });
        return;
    }

    try {
        // 创建复制数据，格式化为表格形式
        const headers = [
            '产品编号', '产品名称', '品牌', '规格型号', '单位',
            '成本', '工程价', '市场指导价', '创建人', '创建时间'
        ];

        // 表头行
        let copyText = headers.join('\t') + '\n';

        // 数据行
        selectedRows.forEach(row => {
            const rowData = [
                row.proId || '',
                row.name || '',
                row.brand || '',
                row.model || '',
                row.unit || '',
                row.purchaseprice || '',
                row.price || '',
                row.marketprice || '',
                row.uname || '',
                row.createtime || ''
            ];
            copyText += rowData.join('\t') + '\n';
        });

        // 使用现代浏览器的剪贴板API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(copyText).then(() => {
                Notify.success({
                    title: '复制成功',
                    content: `已复制 ${selectedRows.length} 条产品记录到剪贴板`,
                    time: 3000
                });
            }).catch(err => {
                fallbackCopyMethod(copyText, selectedRows.length);
            });
        } else {
            // 降级方案：使用传统的execCommand方法
            fallbackCopyMethod(copyText, selectedRows.length);
        }
    } catch (error) {
        Notify.error({
            title: '复制失败',
            content: '复制过程中发生错误，请重试',
            time: 3000
        });
    }
};

// 降级复制方法
const fallbackCopyMethod = (text: string, count: number) => {
    try {
        // 创建临时文本区域
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);

        // 选择并复制
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
            Notify.success({
                title: '复制成功',
                content: `已复制 ${count} 条产品记录到剪贴板`,
                time: 3000
            });
        } else {
            throw new Error('execCommand failed');
        }
    } catch (err) {
        Notify.error({
            title: '复制失败',
            content: '无法复制到剪贴板，请手动复制数据',
            time: 3000
        });
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
const handleAddToIdleCloud = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
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

    // 并行获取产品型号和产品列表
    await Promise.all([
        fetchProductModels(),
        fetchProductBrand(),
        fetchProductList(),
        fetchProductCreator(),
        fetchCompanyList()
    ]);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

// 格式化参数文本，处理分号和逗号的换行
const formatParamText = (text: string) => {
    if (!text) return '';
    // 将分号替换为换行符，并确保换行符后有空格
    return text.replace(/;/g, '<br />&nbsp;&nbsp;').replace(/,/g, '<br />&nbsp;&nbsp;');
};

// 权限管理相关数据
const permissionColumnVisibility = reactive({
    companyName: true,
    deleteRule: true,
    status: true
});

const togglePermissionColumnsDropdown = () => {
    showPermissionColumnsDropdown.value = !showPermissionColumnsDropdown.value;
};

const getPermissionVisibleColumnsCount = () => {
    return Object.values(permissionColumnVisibility).filter(Boolean).length;
};

const updatePermissionVisibleColumns = () => {
    // 权限管理相关数据更新时的处理逻辑
};

const showPermissionColumnsDropdown = ref(false);

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

// 打开指定开放管理弹窗
const toggleDesignatedOpenColumnsDropdown = () => {
    showDesignatedOpenColumnsDropdown.value = !showDesignatedOpenColumnsDropdown.value;
};

// 打开指定开放管理弹窗
const updateDesignatedOpenVisibleColumns = () => {
    // 更新指定开放管理列的显示状态
};

const showDesignatedOpenColumnsDropdown = ref(false);

const getDesignatedOpenVisibleColumnsCount = () => {
    return Object.values(designatedOpenColumnVisibility).filter(Boolean).length;
};

const designatedOpenColumnVisibility = reactive({
    companyName: true,
    deleteRule: true,
    status: true
});

// 提交闲置云询价弹窗
const submitIdleCloudForm = () => {
    closeIdleCloudPopup();
};

// 关闭闲置云询价弹窗
const closeIdleCloudPopup = () => {
    idleCloudVisible.value = false;
    idleCloudForm.idlePrice = '';
    idleCloudForm.enableRemarks = false;
    idleCloudForm.remarks = '';
    idleCloudForm.condition = '';
    idleCloudForm.functionalState = '';
    idleCloudForm.equipmentDetails = '';
    idleCloudForm.isUnderWarranty = '';
    idleCloudForm.others = '';
};

// 计算是否显示详细表格
const shouldShowTable = computed(() => {
    return idleCloudForm.enableRemarks;
});

// 处理备注开关变化
const handleRemarksToggle = () => {
    idleCloudForm.enableRemarks = !idleCloudForm.enableRemarks;
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
    brandPriceForm.companyName = '';
};

// 选中的品牌
const selectedBrand = ref<any>(null);

// 品牌自动报价表单
const brandPriceForm = reactive({
    companyName: ''
});

// 品牌列表
const brandList = ref([
    { id: 1, name: '国产设备', isOpen: 1, autoPrice: 1, defaultDiscount: 80 },
    { id: 2, name: '国产设备', isOpen: 0, autoPrice: 0, defaultDiscount: 70 },
    { id: 3, name: '/', isOpen: 0, autoPrice: 0, defaultDiscount: 0 },
    { id: 4, name: 'MA', isOpen: 0, autoPrice: 0, defaultDiscount: 80 },
    { id: 5, name: '珠江', isOpen: 0, autoPrice: 0, defaultDiscount: 70 },
    { id: 6, name: 'ETC', isOpen: 0, autoPrice: 0, defaultDiscount: 0 },
    { id: 7, name: '中国', isOpen: 0, autoPrice: 0, defaultDiscount: 80 },
    { id: 8, name: '中国路易', isOpen: 0, autoPrice: 0, defaultDiscount: 70 },
    { id: 9, name: '华为', isOpen: 0, autoPrice: 0, defaultDiscount: 0 },
    { id: 10, name: 'H3C', isOpen: 0, autoPrice: 0, defaultDiscount: 80 }
]);

// 品牌管理页面覆盖层
const brandManagementVisible = ref(false);

// 关闭品牌管理页面
const closeBrandManagement = () => {
    brandManagementVisible.value = false;
};

// 删除确认弹窗按钮配置
// const deleteConfirmButtons = ref([...]);
// const closeDeleteConfirm = () => {...};

// 品牌自动报价管理弹窗状态
const brandPriceManagementVisible = ref(false);

// 品牌自动报价表格列配置
const allBrandPriceColumns = ref([
    { key: 'companyName', title: '公司名称' },
    { key: 'entryTime', title: '载至时间' },
    { key: 'defaultPrice', title: '默认折率' }
]);

// 品牌自动报价表格列显示控制
const brandPriceColumnVisibility = reactive({
    companyName: true,
    entryTime: true,
    defaultPrice: true
});

// 品牌自动报价表格数据
const brandPriceCompanyList = ref([
    { id: 1, name: '公司A', entryTime: '2023-01-01', defaultPrice: '80%' },
    { id: 2, name: '公司B', entryTime: '2023-01-02', defaultPrice: '75%' },
    { id: 3, name: '公司C', entryTime: '2023-01-03', defaultPrice: '70%' }
]);

// 分页配置
const brandPricePagination = reactive({
    pageSize: 10,
    currentPage: 1
});

// 添加公司
const handleAddCompany = () => {
    // 这里可以添加添加公司的逻辑
    console.log('添加公司');
};

// 切换品牌自动报价表格列显示
const toggleBrandPriceColumnsDropdown = () => {
    showBrandPriceColumnsDropdown.value = !showBrandPriceColumnsDropdown.value;
};

// 显示品牌自动报价表格列
const showBrandPriceColumnsDropdown = ref(false);

// 表格列配置
const columnsDropdown = ref([
    { key: 'companyName', title: '公司名称' },
    { key: 'entryTime', title: '载至时间' },
    { key: 'defaultPrice', title: '默认折率' }
]);

// 表格数据
const tableDataDropdown = ref([
    { key: 'companyName', title: '公司名称', value: '公司A' },
    { key: 'entryTime', title: '载至时间', value: '2023-01-01' },
    { key: 'defaultPrice', title: '默认折率', value: '80%' }
]);

// 表格变化处理
const handleTableChangeDropdown = (pageData: { current: number; limit: number }) => {
    brandPricePagination.currentPage = pageData.current;
    brandPricePagination.pageSize = pageData.limit;
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

// 产品星标管理弹窗样式
.permission-management {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
    font-size: 14px;
    line-height: 1.6;

    .notice-section {
        margin-bottom: 24px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #eee;

        .notice-content {
            display: flex;
            align-items: center;
            gap: 8px;

            .notice-text {
                font-weight: 500;
                color: #333;
                font-size: 14px;
            }

            .product-name {
                font-weight: 600;
                color: #1890ff;
                font-size: 14px;
            }
        }
    }

    .company-select-section {
        margin-bottom: 24px;

        .select-container {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #f8f9fa;
            border: 1px solid #eee;
            border-radius: 6px;
            padding: 8px 12px;

            .layui-select {
                flex: 1;
            }

            .add-btn {
                background: #1890ff;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 12px;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s ease;

                &:hover {
                    background: #40a9ff;
                }

                .layui-icon {
                    font-size: 12px;
                }
            }
        }
    }

    .company-table-section {
        .table-toolbar {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #eee;

            .export-btn {
                background: #1890ff;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 12px;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s ease;

                &:hover {
                    background: #40a9ff;
                }

                .layui-icon {
                    font-size: 12px;
                }
            }
        }

        .company-table {
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

            .simple-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;

                th,
                td {
                    border: 1px solid #e8e8e8;
                    padding: 8px 12px;
                    text-align: left;
                }

                th {
                    background-color: #f8f9fa;
                    font-weight: 500;
                    color: #333;
                }

                td {
                    color: #666;
                }

                .no-data {
                    text-align: center;
                    padding: 20px;
                    color: #888;
                    font-size: 14px;
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

        .product-images {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 10px;
            margin-top: 10px;

            .single-image-container {
                width: 200px;
                height: 200px;
                border-radius: 8px;
                overflow: hidden;
                background-color: transparent;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;

                .product-image-full {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    border-radius: 8px;
                }

                &.no-image {
                    background-color: #f8f9fa;
                    border: 1px solid #eee;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #888;
                    font-size: 12px;

                    .layui-icon {
                        font-size: 32px;
                        margin-bottom: 8px;
                    }
                }
            }
        }

        .no-data-message {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #eee;

            p {
                margin: 0;
                color: #888;
                font-size: 14px;
                font-weight: 500;
            }
        }

        .product-materials {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-top: 10px;

            .material-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 3px solid #e8e8e8;
                transition: all 0.2s ease;

                &:hover {
                    border-left-color: #1890ff;
                    background: #f0f8ff;
                }

                .material-label {
                    font-weight: 500;
                    color: #666;
                    font-size: 13px;
                }

                .material-value {
                    color: #333;
                    font-weight: 600;
                    font-size: 13px;
                }
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
                line-height: 1.8;
                font-size: 14px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #1890ff;
                white-space: pre-wrap;
                word-break: break-word;
                word-wrap: break-word;
                min-height: 100px;
                max-height: none;
                overflow: visible;
                box-sizing: border-box;
                text-align: justify;
                letter-spacing: 0.5px;
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

        .params-content {
            .param-description {
                margin-bottom: 16px;

                .param-text {
                    margin: 0;
                    color: #666;
                    line-height: 1.8;
                    font-size: 14px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #1890ff;
                    word-break: break-word;
                    word-wrap: break-word;
                    min-height: 100px;
                    max-height: none;
                    overflow: visible;
                    box-sizing: border-box;
                    text-align: justify;
                    letter-spacing: 0.5px;
                }

                p {
                    margin: 0;
                    color: #666;
                    line-height: 1.8;
                    font-size: 14px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #1890ff;
                    white-space: pre-wrap;
                    word-break: break-word;
                    word-wrap: break-word;
                    min-height: 100px;
                    max-height: none;
                    overflow: visible;
                    box-sizing: border-box;
                    text-align: justify;
                    letter-spacing: 0.5px;
                }
            }
        }

        .features-content {
            .description {
                margin: 0 0 16px 0;
                color: #666;
                line-height: 1.6;
                font-size: 14px;
                padding: 16px;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 3px solid #1890ff;
                white-space: pre-wrap;
                word-break: break-word;
                min-height: 80px;
                max-height: none;
                overflow: visible;
                box-sizing: border-box;
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

// 表格图片容器样式
.table-image-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #eee;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

// 表格无图片提示样式
.table-no-image {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #888;
    font-size: 12px;

    .layui-icon {
        font-size: 24px;
        margin-bottom: 4px;
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

// 闲置云询价弹窗样式
.idle-cloud-form {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
    font-size: 14px;
    line-height: 1.6;

    .form-group {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;

        label {
            font-weight: 500;
            color: #333;
            margin-bottom: 8px;
            font-size: 14px;
            display: flex;
            align-items: center;

            &::before {
                content: '*';
                color: #ff4d4f;
                margin-right: 4px;
                font-weight: bold;
            }
        }

        .switch-label {
            font-weight: 500;
            color: #333;
            margin-bottom: 8px;
            font-size: 14px;
            display: flex;
            align-items: center;
            cursor: pointer;

            &::before {
                display: none;
            }

            input[type="checkbox"] {
                margin-right: 8px;
                width: 16px;
                height: 16px;
                cursor: pointer;
            }

            .switch-text {
                user-select: none;
            }
        }

        input[type="text"] {
            height: 36px;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 14px;
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
                font-size: 13px;
            }
        }

        textarea {
            min-height: 80px;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 14px;
            resize: vertical;
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
                font-size: 13px;
            }
        }
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid #f0f0f0;

        :deep(.layui-btn) {
            min-width: 80px;
            height: 36px;
            font-size: 14px;
            border-radius: 4px;
            padding: 0 16px;
        }
    }
}

// 品牌管理页面覆盖层样式
.brand-management-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(2px);
    z-index: 1000;

    .brand-management-page {
        width: 100%;
        height: 100%;
        padding: 24px;
        background-color: white;
        overflow-y: auto;

        .brand-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid #f0f0f0;

            h2 {
                font-size: 24px;
                color: #333;
                margin: 0;
            }

            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #888;
                padding: 8px;
                border-radius: 4px;
                transition: all 0.2s;

                &:hover {
                    background-color: #f5f5f5;
                    color: #333;
                }
            }
        }

        .brand-content {
            .brand-table-container {
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;

                .brand-table {
                    width: 100%;
                    border-collapse: collapse;

                    thead tr {
                        background: #f8f9fa;
                    }

                    th,
                    td {
                        padding: 12px 16px;
                        text-align: center;
                        border-bottom: 1px solid #e8e8e8;
                    }

                    th {
                        font-weight: 600;
                        color: #333;
                        font-size: 14px;
                    }

                    td {
                        color: #666;
                        font-size: 13px;
                    }

                    tbody tr:hover {
                        background-color: #f0f8ff;
                    }

                    .setting-link {
                        color: #1890ff;
                        cursor: pointer;
                        text-decoration: none;

                        &:hover {
                            color: #40a9ff;
                            text-decoration: underline;
                        }
                    }

                    .management-btn {
                        background: #1890ff;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: all 0.2s;

                        &:hover {
                            background: #40a9ff;
                        }
                    }
                }
            }
        }
    }
}

// 删除确认弹窗样式
.delete-confirm {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
    font-size: 14px;
    line-height: 1.6;

    p {
        margin: 0 0 18px 0;
        color: #666;
        line-height: 1.7;
        font-size: 14px;
    }
}

// 品牌自动报价管理弹窗样式
.brand-price-management {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
    font-size: 14px;
    line-height: 1.6;

    .search-section {
        margin-bottom: 24px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #eee;

        .search-row {
            display: flex;
            align-items: center;
            gap: 16px;

            label {
                font-weight: 500;
                color: #333;
                font-size: 14px;
            }

            .search-input {
                flex: 1;
                height: 36px;
                padding: 8px 12px;
                border: 1px solid #d9d9d9;
                border-radius: 4px;
                font-size: 14px;
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
                    font-size: 13px;
                }
            }

            .highlight-text {
                font-size: 12px;
                color: #888;
            }
        }
    }

    .table-section {
        .add-button-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;

            .add-btn {
                background: #1890ff;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: background-color 0.2s ease;

                &:hover {
                    background: #40a9ff;
                }

                .layui-icon {
                    font-size: 12px;
                }
            }

            .column-filter {
                display: flex;
                align-items: center;
                gap: 8px;

                .layui-icon {
                    font-size: 16px;
                    cursor: pointer;
                }

                .columns-dropdown {
                    position: relative;

                    .dropdown-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 8px 12px;
                        background: #f8f9fa;
                        border-radius: 4px;
                        border: 1px solid #eee;

                        span {
                            font-weight: 500;
                            color: #333;
                            font-size: 14px;
                        }

                        .close-dropdown {
                            background: none;
                            border: none;
                            font-size: 16px;
                            cursor: pointer;
                            color: #888;
                            padding: 4px;
                            border-radius: 4px;
                            transition: all 0.2s;

                            &:hover {
                                background-color: #f5f5f5;
                                color: #333;
                            }
                        }
                    }

                    .column-options {
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
            }
        }

        .brand-price-table-container {
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

            .simple-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;

                th,
                td {
                    border: 1px solid #e8e8e8;
                    padding: 8px 12px;
                    text-align: left;
                }

                th {
                    background-color: #f8f9fa;
                    font-weight: 500;
                    color: #333;
                }

                td {
                    color: #666;
                }

                .no-data {
                    text-align: center;
                    padding: 20px;
                    color: #888;
                    font-size: 14px;
                }
            }
        }

        .pagination-section {
            display: flex;
            justify-content: flex-end;
            margin-top: 16px;

            .pagination-controls {
                display: flex;
                align-items: center;
                gap: 16px;

                .pagination-info {
                    font-size: 12px;
                    color: #666;
                }

                .pagination-buttons {
                    display: flex;
                    gap: 8px;

                    .page-btn {
                        background: #1890ff;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 6px 12px;
                        font-size: 12px;
                        cursor: pointer;
                        transition: background-color 0.2s ease;

                        &:hover {
                            background: #40a9ff;
                        }

                        &.current {
                            background-color: #40a9ff;
                            pointer-events: none;
                        }
                    }
                }

                .page-size-selector {
                    select {
                        height: 36px;
                        padding: 8px 12px;
                        border: 1px solid #d9d9d9;
                        border-radius: 4px;
                        font-size: 14px;
                        transition: all 0.2s ease;

                        &:hover {
                            border-color: #40a9ff;
                        }

                        &:focus {
                            border-color: #1890ff;
                            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
                            outline: none;
                        }
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
