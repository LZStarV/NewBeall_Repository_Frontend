<template>
    <div class="scheme-page">
        <!-- 搜索过滤区域 -->
        <div class="filter-section">
            <div class="filter-form">
                <!-- 报价单类型 -->
                <div class="filter-item">
                    <label class="filter-label">报价单类型</label>
                    <select v-model="filterForm.quoteType" class="filter-select">
                        <option value="">请选择</option>
                        <option v-for="type in quoteTypeOptions" :key="type.value" :value="type.value">
                            {{ type.label }}
                        </option>
                    </select>
                </div>

                <!-- 第二个下拉框 -->
                <div class="filter-item">
                    <select v-model="filterForm.category" class="filter-select">
                        <option value="">请选择</option>
                        <option v-for="category in categoryOptions" :key="category.value" :value="category.value">
                            {{ category.label }}
                        </option>
                    </select>
                </div>

                <!-- 第三个下拉框 -->
                <div class="filter-item">
                    <select v-model="filterForm.nature" class="filter-select">
                        <option value="">请选择</option>
                        <option v-for="nature in natureOptions" :key="nature.value" :value="nature.value">
                            {{ nature.label }}
                        </option>
                    </select>
                </div>

                <!-- 所需积分 -->
                <div class="filter-item">
                    <label class="filter-label">所需积分</label>
                    <select v-model="filterForm.points" class="filter-select">
                        <option value="">请选择</option>
                        <option v-for="point in pointsOptions" :key="point.value" :value="point.value">
                            {{ point.label }}
                        </option>
                    </select>
                </div>

                <!-- 关键字 -->
                <div class="filter-item">
                    <label class="filter-label">关键字</label>
                    <input v-model="filterForm.keyword" class="filter-input" type="text" placeholder="输入关键字"
                        @keydown="handleQuickSearch">
                </div>

                <!-- 搜索和刷新按钮 -->
                <div class="filter-actions">
                    <button class="action-btn search-btn" @click="handleSearch" :disabled="searchLoading">
                        <i class="layui-icon layui-icon-search"></i>
                    </button>
                    <button class="action-btn refresh-btn" @click="handleRefreshForm">
                        <i class="layui-icon layui-icon-refresh"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- 数据表格区域 -->
        <lay-card>
            <div class="table-container">
                <!-- 表格操作按钮 -->
                <div class="table-actions">
                    <button class="action-btn refresh-btn" @click="handleRefreshTable">
                        <i class="layui-icon layui-icon-refresh"></i>
                    </button>
                    <button class="action-btn view-btn">
                        <i class="layui-icon layui-icon-list"></i>
                    </button>
                </div>

                <!-- 数据表格 -->
                <lay-table :columns="tableColumns" :data-source="tableData" :page="pagination"
                    @change="handleTableChange" :loading="loading">
                    <!-- 共享名称列 -->
                    <template #sharedName="{ row }">
                        <a href="#" class="scheme-link" @click.prevent="handleViewScheme(row)">{{ row.sharedName }}</a>
                    </template>

                    <!-- 操作列 -->
                    <template #action="{ row }">
                        <button class="action-link" @click="handleViewScheme(row)">查看</button>
                    </template>
                </lay-table>
            </div>
        </lay-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import Notify from '@/utils/notify'
import { getOrderType, getSchemeList } from './Api/Api'
import { tableColumns, tableData, type Scheme } from './type'

// 获取选项数据
const fetchOptionsData = async () => {
    try {
        const { firstOrderType, secondOrderType, thirdOrderType } = await getOrderType()

        // 处理一级报价单类型数据
        if (firstOrderType && firstOrderType.data) {
            quoteTypeOptions.value = firstOrderType.data.map((item: any) => ({
                value: item.id || item.value,
                label: item.name || item.label
            }))
        }

        // 处理二级报价单类型数据（用作分类）
        if (secondOrderType && secondOrderType.data) {
            categoryOptions.value = secondOrderType.data.map((item: any) => ({
                value: item.id || item.value,
                label: item.name || item.label
            }))
        }

        // 处理三级报价单类型数据（用作性质）
        if (thirdOrderType && thirdOrderType.data) {
            natureOptions.value = thirdOrderType.data.map((item: any) => ({
                value: item.id || item.value,
                label: item.name || item.label
            }))
        }

        console.log('选项数据加载完成:', { firstOrderType, secondOrderType, thirdOrderType })
    } catch (error) {
        console.error('获取选项数据失败:', error)
        Notify.error({
            title: '错误',
            content: '获取选项数据失败，请稍后重试',
            time: 3000
        })
    }
}

// 搜索表单
const filterForm = reactive({
    quoteType: '',
    category: '',
    nature: '',
    points: '',
    keyword: ''
})



// 分页配置
const pagination = reactive({
    current: 1,
    limit: 50,
    total: 0
})

// 加载状态
const loading = ref(false)
const searchLoading = ref(false)

// 下拉选项数据类型定义
interface OptionItem {
    value: string | number
    label: string
}

// 下拉选项数据 
const quoteTypeOptions = ref<OptionItem[]>([])
const categoryOptions = ref<OptionItem[]>([])
const natureOptions = ref<OptionItem[]>([])

const pointsOptions = ref<OptionItem[]>([
    { value: '0-10', label: '0-10积分' },
    { value: '10-50', label: '10-50积分' },
    { value: '50-100', label: '50-100积分' },
    { value: '100+', label: '100积分以上' }
])





// 搜索功能
const handleSearch = async () => {
    try {
        searchLoading.value = true

        // 检查是否有搜索条件
        const hasSearchConditions = !!(
            filterForm.quoteType ||
            filterForm.category ||
            filterForm.nature ||
            filterForm.points ||
            filterForm.keyword.trim()
        )

        if (!hasSearchConditions) {
            Notify.error({
                title: '搜索提示',
                content: '请至少输入一个搜索条件',
                time: 3000
            })
            return
        }

        // 重置分页到第一页
        pagination.current = 1

        // 构建搜索参数
        const searchParams: any = {}
        if (filterForm.quoteType) {
            searchParams.quoteType = filterForm.quoteType
        }
        if (filterForm.category) {
            searchParams.category = filterForm.category
        }
        if (filterForm.nature) {
            searchParams.nature = filterForm.nature
        }
        if (filterForm.points) {
            searchParams.points = filterForm.points
        }
        if (filterForm.keyword.trim()) {
            searchParams.keyword = filterForm.keyword.trim()
        }

        await fetchTableData(searchParams)

        Notify.success({
            title: '搜索完成',
            content: '已更新搜索结果',
            time: 3000
        })
    } catch (error: any) {
        console.error('搜索失败:', error)
        Notify.error({
            title: '搜索失败',
            content: error.message || '搜索过程中发生错误，请稍后重试',
            time: 3000
        })
    } finally {
        searchLoading.value = false
    }
}

// 重置搜索表单
const handleRefreshForm = async () => {
    try {
        searchLoading.value = true

        // 重置表单数据
        filterForm.quoteType = ''
        filterForm.category = ''
        filterForm.nature = ''
        filterForm.points = ''
        filterForm.keyword = ''

        // 重置表格数据
        tableData.value = []

        Notify.success({
            title: '重置成功',
            content: '已重置搜索条件并刷新数据',
            time: 3000
        })
    } catch (error: any) {
        console.error('重置失败:', error)
        Notify.error({
            title: '重置失败',
            content: '重置过程中发生错误，请稍后重试',
            time: 3000
        })
    } finally {
        searchLoading.value = false
    }
}

// 表格变化处理
const handleTableChange = async (pageData: { current: number; limit: number }) => {
    pagination.current = pageData.current
    pagination.limit = pageData.limit
    await fetchTableData()
}

// 刷新表格
const handleRefreshTable = async () => {
    try {
        loading.value = true
        await fetchTableData()
        Notify.success({
            title: '刷新成功',
            content: '表格数据已更新',
            time: 2000
        })
    } catch (error: any) {
        console.error('刷新失败:', error)
        Notify.error({
            title: '刷新失败',
            content: '刷新过程中发生错误，请稍后重试',
            time: 3000
        })
    } finally {
        loading.value = false
    }
}

// 查看方案详情
const handleViewScheme = (scheme: Scheme) => {
    console.log('查看方案详情:', scheme)
    // 这里可以添加查看方案详情的逻辑
}

// 快速搜索功能（支持Enter键搜索）
const handleQuickSearch = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        handleSearch()
    }
}

// 获取表格数据
const fetchTableData = async (searchParams?: any) => {
    try {
        loading.value = true

        // 构建请求参数
        const requestParams = {
            page: pagination.current,
            limit: pagination.limit,
            ...searchParams
        }

        // 调用真实 API
        const response = await getSchemeList(requestParams)
        const responseData = response.data || response

        if (responseData && responseData.rows && Array.isArray(responseData.rows)) {
            tableData.value = responseData.rows.map((item: any) => ({
                id: item.id || item.schemeId,
                selected: false,
                sharedName: item.sharedName || item.name || item.title,
                quoteType: item.quoteType || item.type,
                quoteNature: item.quoteNature || item.nature,
                points: item.points || item.score || 0,
                downloads: item.downloads || item.downloadCount || 0,
                favorites: item.favorites || item.favoriteCount || 0
            }))
            pagination.total = responseData.total || responseData.rows.length
        } else if (Array.isArray(responseData)) {
            tableData.value = responseData.map((item: any) => ({
                id: item.id || item.schemeId,
                selected: false,
                sharedName: item.sharedName || item.name || item.title,
                quoteType: item.quoteType || item.type,
                quoteNature: item.quoteNature || item.nature,
                points: item.points || item.score || 0,
                downloads: item.downloads || item.downloadCount || 0,
                favorites: item.favorites || item.favoriteCount || 0
            }))
            pagination.total = responseData.length
        } else {
            tableData.value = []
            pagination.total = 0
        }

    } catch (error) {
        console.error('获取方案列表失败:', error)
        Notify.error({
            title: '错误',
            content: '获取方案列表失败，请稍后重试',
            time: 3000
        })
        tableData.value = []
        pagination.total = 0
    } finally {
        loading.value = false
    }
}

// 组件挂载时获取数据
onMounted(async () => {
    await fetchOptionsData()
    await fetchTableData()
})
</script>

<style scoped lang="scss">
.scheme-page {
    padding: 24px;
    min-height: 100vh;
    background-color: #f5f5f5;
}

// 过滤区域样式
.filter-section {
    background: white;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);


    .filter-form {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
    }

    .filter-item {
        display: flex;
        align-items: center;

        .filter-label {
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
        }

        .filter-select,
        .filter-input {

            height: 36px;
            padding: 0 6px;
            border: 1px solid #e6e6e6;
            border-radius: 0 2px 2px 0;
            font-size: 14px;
            color: #333;
            background-color: #fff;
            transition: border-color 0.2s ease;
            margin-left: -1px;

            &:focus {
                outline: none;
                border-color: #5FB878;
                box-shadow: 0 0 0 2px rgba(95, 184, 120, 0.2);
            }

            &::placeholder {
                color: #999;
            }
        }

        .filter-select {
            min-width: 100px;
        }


    }

    .filter-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: auto;

        .action-btn {
            width: 36px;
            height: 36px;
            border: 1px solid #d9d9d9;
            background-color: #fff;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;

            &:hover {
                border-color: #1890ff;
                color: #1890ff;
            }

            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            i {
                font-size: 16px;
            }
        }
    }
}

// 表格区域样式
.table-container {
    position: relative;

    .table-actions {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;

        .action-btn {
            width: 32px;
            height: 32px;
            border: none;
            background-color: transparent;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            color: #666;

            &:hover {
                background-color: #f5f5f5;
                color: #1890ff;
            }

            i {
                font-size: 14px;
            }
        }
    }

    .scheme-link,
    .action-link {
        color: #1890ff;
        text-decoration: none;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }

    .action-link {
        background: none;
        border: none;
        font-size: 14px;
        padding: 0;
    }
}
</style>
