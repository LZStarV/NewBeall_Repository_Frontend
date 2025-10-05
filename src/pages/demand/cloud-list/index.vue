<template>
    <div class="demand-page">
        <!-- 数据表格区域 -->
        <lay-card>
            <div class="table-container">
                <!-- 数据表格 -->
                <lay-table :columns="tableColumns" :data-source="tableData" :page="pagination"
                    @change="handleTableChange" :loading="loading">
                    <!-- 复选框列 -->
                    <template #checkbox="{ row }">
                        <input type="checkbox" v-model="row.selected" @change="handleSelectChange(row)">
                    </template>

                    <!-- 需求名称列 -->
                    <template #demandName="{ row }">
                        <a href="#" class="demand-link" @click.prevent="handleViewDemand(row)">{{ row.demandName }}</a>
                    </template>

                    <!-- 状态列 -->
                    <template #status="{ row }">
                        <span class="status-tag" :class="getStatusClass(row.status)">{{ row.status }}</span>
                    </template>

                    <!-- 操作列 -->
                    <template #action="{ row }">
                        <button class="action-link" @click="handleViewDemand(row)">查看</button>
                    </template>
                </lay-table>
            </div>
        </lay-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import Notify from '@/utils/notify'
import { getDemandList } from './Api/Api'
import { tableColumns, tableData, type Demand } from './type'

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

// 表格变化处理
const handleTableChange = async (pageData: { order: string; offset: number; limit: number }) => {
    pagination.order = pageData.order
    pagination.offset = pageData.offset
    pagination.limit = pageData.limit
    await fetchTableData()
}



// 查看需求详情
const handleViewDemand = (demand: Demand) => {
    console.log('查看需求详情:', demand)
    // 这里可以添加查看需求详情的逻辑
}

// 获取状态样式类
const getStatusClass = (status: string) => {
    switch (status) {
        case '未有投标':
            return 'status-pending'
        case '已有投标':
            return 'status-processing'
        case '已完成':
            return 'status-completed'
        case '已取消':
            return 'status-cancelled'
        default:
            return 'status-default'
    }
}



// 选择变化处理
const handleSelectChange = (row: Demand) => {
    console.log('选择变化:', row)
    // 这里可以添加选择变化的逻辑，比如批量操作
}

// 获取表格数据
const fetchTableData = async (searchParams?: any) => {
    try {
        loading.value = true

        // 构建请求参数
        const requestParams = {
            order: pagination.order,
            offset: pagination.offset,
            limit: pagination.limit,
            queryParams: searchParams || {}
        }

        const response = await getDemandList(requestParams)
        const responseData = response.data || response

        if (responseData && responseData.rows && Array.isArray(responseData.rows)) {
            tableData.value = responseData.rows.map((item: any) => ({
                id: item.id?.toString() || '',
                selected: false,
                company: item.company?.companyName || '',
                demandName: item.schemename || '',
                demandDetails: item.details || '',
                releaseTime: item.creatDate || '',
                status: item.state === 0 ? '未有投标' : '已有投标'
            }))
            pagination.total = responseData.total || responseData.rows.length
        } else if (Array.isArray(responseData)) {
            tableData.value = responseData.map((item: any) => ({
                id: item.id?.toString() || '',
                selected: false,
                company: item.company?.companyName || '',
                demandName: item.schemename || '',
                demandDetails: item.details || '',
                releaseTime: item.creatDate || '',
                status: item.state === 0 ? '未有投标' : '已有投标'
            }))
            pagination.total = responseData.length
        } else {
            // 没有数据时显示空列表
            tableData.value = []
            pagination.total = 0
        }

    } catch (error) {
        console.error('获取需求列表失败:', error)
        Notify.error({
            title: '错误',
            content: '获取需求列表失败，请稍后重试',
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
.demand-page {
    padding: 24px;
    min-height: 100vh;
    background-color: #f5f5f5;
}

// 表格区域样式
.table-container {
    position: relative;

    .demand-link,
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

    .status-tag {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        display: inline-block;
        min-width: 60px;
        text-align: center;

        &.status-pending {
            background-color: #e6f7ff;
            color: #1890ff;
            border: 1px solid #91d5ff;
        }

        &.status-processing {
            background-color: #fff7e6;
            color: #fa8c16;
            border: 1px solid #ffd591;
        }

        &.status-completed {
            background-color: #f6ffed;
            color: #52c41a;
            border: 1px solid #b7eb8f;
        }

        &.status-cancelled {
            background-color: #fff2f0;
            color: #ff4d4f;
            border: 1px solid #ffa39e;
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
