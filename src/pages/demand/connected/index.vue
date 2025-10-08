<template>
    <div class="connected-demand-page">
        <!-- 搜索过滤区域 -->
        <lay-card>
            <div class="filter-section">
                <form class="layui-form layui-form-pane">
                    <!-- 需求名称 -->
                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label productName">需求名称</label>
                            <div class="layui-input-inline">
                                <input v-model="filterForm.schemeName" autocomplete="off" class="layui-input"
                                    name="schemeName" type="text" placeholder="输入需求名称" @keydown="handleQuickSearch">
                            </div>
                        </div>
                    </div>

                    <!-- 搜索按钮区域 -->
                    <div class="inventorySearchBtn">
                        <button class="btnIcon invite-but" data-title="搜索" @click="handleSearch"
                            :disabled="searchLoading" type="button">
                            <i class="layui-icon layui-icon-search"></i>
                        </button>
                        <span data-title="重置" class="btnIcon invite-but" @click="handleRefreshForm">
                            <i class="layui-icon layui-icon-refresh"></i>
                        </span>
                    </div>
                </form>
            </div>
        </lay-card>

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
                    <!-- 复选框列 -->
                    <template #checkbox="{ row }">
                        <input type="checkbox" v-model="row.selected" @change="handleSelectChange(row)">
                    </template>

                    <!-- 方案名称列 -->
                    <template #demandName="{ row }">
                        <a href="#" class="demand-link" @click.prevent="handleViewDemand(row)">{{ row.demandName }}</a>
                    </template>

                    <!-- 状态列 -->
                    <template #status="{ row }">
                        <span class="status-tag" :class="getStatusClass(row.status)">{{ row.status }}</span>
                    </template>

                    <!-- 操作列 -->
                    <template #action="{ row }">
                        <button class="action-link" @click="handleViewDemand(row)">查看详情</button>
                        <button v-if="row.status === '已报价'" class="action-link"
                            @click="handleViewQuote(row)">查看报价</button>
                        <button v-else class="action-link" @click="handleQuote(row)">报价</button>
                    </template>
                </lay-table>
            </div>
        </lay-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import Notify from '@/utils/notify'
import { getConnectedDemandList } from './Api/Api'
import { tableColumns, tableData, type ConnectedDemand } from './type'

// 搜索表单
const filterForm = reactive({
    schemeName: ''
})

// 分页配置
const pagination = reactive({
    order: 'desc',
    current: 1,
    offset: 0,
    limit: 50,
    total: 0
})

// 加载状态
const loading = ref(false)
const searchLoading = ref(false)

// 表格变化处理
const handleTableChange = async (pageData: { order: string; current: number; limit: number }) => {
    pagination.order = pageData.order
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

// 搜索处理
const handleSearch = async () => {
    try {
        searchLoading.value = true
        pagination.current = 1
        await fetchTableData()
    } catch (error) {
        console.error('搜索失败:', error)
    } finally {
        searchLoading.value = false
    }
}

// 重置表单
const handleRefreshForm = () => {
    filterForm.schemeName = ''
    handleSearch()
}

// 快速搜索（回车键）
const handleQuickSearch = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        handleSearch()
    }
}

// 查看需求详情
const handleViewDemand = (demand: ConnectedDemand) => {
    console.log('查看需求详情:', demand)
    // 这里可以添加查看需求详情的逻辑
}

// 查看报价
const handleViewQuote = (demand: ConnectedDemand) => {
    console.log('查看报价:', demand)
    // 这里可以添加查看报价的逻辑
}

// 报价
const handleQuote = (demand: ConnectedDemand) => {
    console.log('报价:', demand)
    // 这里可以添加报价的逻辑
}

// 获取状态样式类
const getStatusClass = (status: string) => {
    switch (status) {
        case '未完成':
            return 'status-pending'
        case '已报价':
            return 'status-completed'
        default:
            return 'status-default'
    }
}

// 选择变化处理
const handleSelectChange = (row: ConnectedDemand) => {
    console.log('选择变化:', row)
    // 这里可以添加选择变化的逻辑，比如批量操作
}

// 获取表格数据
const fetchTableData = async () => {
    try {
        loading.value = true

        // 构建请求参数
        const requestParams = {
            order: pagination.order,
            offset: (pagination.current - 1) * pagination.limit,
            limit: pagination.limit,
            queryParams: {
                schemeName: filterForm.schemeName
            }
        }

        const response = await getConnectedDemandList(requestParams)
        const responseData = response.data || response

        if (responseData && responseData.rows && Array.isArray(responseData.rows)) {
            tableData.value = responseData.rows.map((item: any) => ({
                id: item.id?.toString() || '',
                selected: false,
                company: item.company?.companyName || '',
                demandName: item.programme?.schemename || '',
                demandDetails: item.details || '',
                releaseTime: item.creatDate || '',
                status: item.state === 1 ? '已报价' : '未完成',
                price: item.price || '',
                contacts: item.contacts || '',
                tel: item.tel || ''
            }))
            pagination.total = responseData.total || responseData.rows.length
        } else if (Array.isArray(responseData)) {
            tableData.value = responseData.map((item: any) => ({
                id: item.id?.toString() || '',
                selected: false,
                company: item.company?.companyName || '',
                demandName: item.programme?.schemename || '',
                demandDetails: item.details || '',
                releaseTime: item.creatDate || '',
                status: item.state === 1 ? '已报价' : '未完成',
                price: item.price || '',
                contacts: item.contacts || '',
                tel: item.tel || ''
            }))
            pagination.total = responseData.length
        } else {
            // 没有数据时显示空列表
            tableData.value = []
            pagination.total = 0
        }

    } catch (error) {
        console.error('获取已对接需求列表失败:', error)
        Notify.error({
            title: '错误',
            content: '获取已对接需求列表失败，请稍后重试',
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
    await fetchTableData()
})
</script>

<style scoped lang="scss">
.connected-demand-page {
    padding: 24px;
    min-height: 100vh;
    background-color: #f5f5f5;
}

// 搜索区域样式
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
            width: 90px; // 需求名称标签宽度
        }
    }

    // 输入框容器
    .layui-input-inline {
        display: inline-block;
        vertical-align: middle;
        margin-left: -1px;

        // 默认输入框宽度
        width: 150px;
    }

    // 输入框样式
    .layui-input {
        border: 1px solid #e6e6e6;
        background-color: #fff;
        border-radius: 0 2px 2px 0;
        padding: 0 15px;
        font-size: 14px;
        color: #333;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

        &::placeholder {
            color: #999;
        }
    }

    // 下拉框样式
    select {
        height: 38px;
        line-height: 38px;
        border: 1px solid #e6e6e6;
        background-color: #fff;
        border-radius: 0 2px 2px 0;
        padding: 0 15px;
        font-size: 14px;
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
            width: 32px;
            height: 32px;
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

            &:disabled {
                background-color: #d9d9d9;
                cursor: not-allowed;
                border-color: #d9d9d9;
            }

            i {
                font-size: 14px;
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

    .demand-link,
    .action-link {
        color: #1890ff;
        text-decoration: none;
        cursor: pointer;
        margin-right: 8px;

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

    .status-tag {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        display: inline-block;
        min-width: 60px;
        text-align: center;

        &.status-pending {
            background-color: #fff7e6;
            color: #fa8c16;
            border: 1px solid #ffd591;
        }

        &.status-completed {
            background-color: #f6ffed;
            color: #52c41a;
            border: 1px solid #b7eb8f;
        }

        &.status-default {
            background-color: #f5f5f5;
            color: #666;
            border: 1px solid #d9d9d9;
        }
    }

    // 表格行悬停效果
    :deep(.layui-table-body tr:hover) {
        background-color: #f5f7fa;
    }

    // 复选框样式
    input[type="checkbox"] {
        cursor: pointer;
        transform: scale(1.1);
    }
}
</style>
