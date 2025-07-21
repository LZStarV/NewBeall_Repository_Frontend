<template>
    <div class="order-receive-list-page">
        <div class="page-header">
            <h1>订单接收列表</h1>
            <p>查看和处理接收到的订单</p>
        </div>

        <div class="content-area">
            <!-- 筛选工具栏 -->
            <lay-card class="filter-card">
                <lay-form :model="filterForm" layout="inline">
                    <lay-form-item label="订单号">
                        <lay-input v-model="filterForm.orderNo" placeholder="输入订单号" />
                    </lay-form-item>
                    <lay-form-item label="客户名称">
                        <lay-input v-model="filterForm.customerName" placeholder="输入客户名称" />
                    </lay-form-item>
                    <lay-form-item label="订单状态">
                        <lay-select v-model="filterForm.status" placeholder="选择状态">
                            <lay-select-option value="">全部状态</lay-select-option>
                            <lay-select-option value="pending">待处理</lay-select-option>
                            <lay-select-option value="processing">处理中</lay-select-option>
                            <lay-select-option value="completed">已完成</lay-select-option>
                            <lay-select-option value="cancelled">已取消</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item label="接收时间">
                        <lay-date-picker v-model="filterForm.startDate" placeholder="开始日期" />
                        <span style="margin: 0 8px;">至</span>
                        <lay-date-picker v-model="filterForm.endDate" placeholder="结束日期" />
                    </lay-form-item>
                    <lay-form-item>
                        <lay-button type="primary" @click="searchOrders">搜索</lay-button>
                        <lay-button @click="resetFilter">重置</lay-button>
                        <lay-button @click="exportOrders">导出</lay-button>
                    </lay-form-item>
                </lay-form>
            </lay-card>

            <!-- 订单列表 -->
            <lay-card title="接收订单列表">
                <div class="table-toolbar">
                    <div class="left-actions">
                        <lay-button type="primary" @click="batchProcess" :disabled="selectedOrders.length === 0">
                            批量处理
                        </lay-button>
                        <lay-button @click="refreshOrders">刷新列表</lay-button>
                    </div>
                    <div class="right-info">
                        共 {{ orderList.length }} 个订单，已选择 {{ selectedOrders.length }} 个
                    </div>
                </div>

                <lay-table :columns="columns" :data-source="orderList"
                    :row-selection="{ selectedRowKeys: selectedOrders, onChange: onSelectionChange }"
                    :pagination="pagination">
                    <template #status="{ row }">
                        <lay-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</lay-tag>
                    </template>
                    <template #priority="{ row }">
                        <lay-tag :type="getPriorityType(row.priority)" size="sm">{{ getPriorityLabel(row.priority)
                        }}</lay-tag>
                    </template>
                    <template #amount="{ row }">
                        <span class="amount-text">{{ row.amount }}</span>
                    </template>
                    <template #action="{ row }">
                        <lay-button size="sm" @click="viewOrder(row)">查看</lay-button>
                        <lay-button size="sm" type="primary" @click="processOrder(row)" v-if="row.status === 'pending'">
                            处理
                        </lay-button>
                        <lay-button size="sm" @click="trackOrder(row)" v-if="row.status === 'processing'">
                            跟踪
                        </lay-button>
                    </template>
                </lay-table>
            </lay-card>
        </div>

        <!-- 订单详情弹窗 -->
        <lay-layer v-model="showDetailModal" title="订单详情" :area="['800px', '600px']">
            <div class="order-detail-content" v-if="selectedOrder">
                <lay-form label-width="100px">
                    <lay-row>
                        <lay-col :md="12">
                            <lay-form-item label="订单号">
                                <span>{{ selectedOrder.orderNo }}</span>
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="12">
                            <lay-form-item label="订单状态">
                                <lay-tag :type="getStatusType(selectedOrder.status)">{{
                                    getStatusLabel(selectedOrder.status)
                                }}</lay-tag>
                            </lay-form-item>
                        </lay-col>
                    </lay-row>

                    <lay-row>
                        <lay-col :md="12">
                            <lay-form-item label="客户名称">
                                <span>{{ selectedOrder.customerName }}</span>
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="12">
                            <lay-form-item label="联系电话">
                                <span>{{ selectedOrder.customerPhone }}</span>
                            </lay-form-item>
                        </lay-col>
                    </lay-row>

                    <lay-row>
                        <lay-col :md="12">
                            <lay-form-item label="项目名称">
                                <span>{{ selectedOrder.projectName }}</span>
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="12">
                            <lay-form-item label="订单金额">
                                <span class="amount-large">{{ selectedOrder.amount }}</span>
                            </lay-form-item>
                        </lay-col>
                    </lay-row>

                    <lay-form-item label="项目描述">
                        <span>{{ selectedOrder.description }}</span>
                    </lay-form-item>

                    <lay-row>
                        <lay-col :md="12">
                            <lay-form-item label="接收时间">
                                <span>{{ selectedOrder.receiveTime }}</span>
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="12">
                            <lay-form-item label="优先级">
                                <lay-tag :type="getPriorityType(selectedOrder.priority)">{{
                                    getPriorityLabel(selectedOrder.priority) }}</lay-tag>
                            </lay-form-item>
                        </lay-col>
                    </lay-row>
                </lay-form>

                <div class="modal-actions">
                    <lay-button v-if="selectedOrder.status === 'pending'" type="primary" @click="processCurrentOrder">
                        处理订单
                    </lay-button>
                    <lay-button @click="closeDetailModal">关闭</lay-button>
                </div>
            </div>
        </lay-layer>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const showDetailModal = ref(false);
const selectedOrder = ref<any>(null);
const selectedOrders = ref<string[]>([]);

const filterForm = reactive({
    orderNo: '',
    customerName: '',
    status: '',
    startDate: '',
    endDate: ''
});

const columns = [
    { title: '订单号', key: 'orderNo', width: 150 },
    { title: '客户名称', key: 'customerName', width: 150 },
    { title: '项目名称', key: 'projectName', width: 200 },
    { title: '订单金额', key: 'amount', width: 120, customSlot: 'amount' },
    { title: '优先级', key: 'priority', width: 80, customSlot: 'priority' },
    { title: '状态', key: 'status', width: 100, customSlot: 'status' },
    { title: '接收时间', key: 'receiveTime', width: 150 },
    { title: '操作', key: 'action', width: 180, customSlot: 'action' }
];

const orderList = ref([
    {
        id: '1',
        orderNo: 'O202401001',
        customerName: '某科技公司',
        customerPhone: '138-0000-0000',
        projectName: '办公室装修设计',
        amount: '¥50,000',
        priority: 'high',
        status: 'pending',
        receiveTime: '2024-01-20 10:30',
        description: '需要进行办公室的整体装修设计，包括空间规划、家具配置等。'
    },
    {
        id: '2',
        orderNo: 'O202401002',
        customerName: '某贸易公司',
        customerPhone: '139-0000-0000',
        projectName: '展厅设计',
        amount: '¥80,000',
        priority: 'medium',
        status: 'processing',
        receiveTime: '2024-01-19 14:15',
        description: '展厅的整体设计方案，要求现代简约风格。'
    },
    {
        id: '3',
        orderNo: 'O202401003',
        customerName: '某餐饮企业',
        customerPhone: '137-0000-0000',
        projectName: '餐厅装修',
        amount: '¥35,000',
        priority: 'low',
        status: 'completed',
        receiveTime: '2024-01-18 09:45',
        description: '餐厅内部装修，营造温馨的用餐环境。'
    }
]);

const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: orderList.value.length
});

const getStatusType = (status: string) => {
    const statusMap: Record<string, string> = {
        'pending': 'warm',
        'processing': 'normal',
        'completed': 'normal',
        'cancelled': 'danger'
    };
    return statusMap[status] || 'normal';
};

const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
        'pending': '待处理',
        'processing': '处理中',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    return statusMap[status] || status;
};

const getPriorityType = (priority: string) => {
    const priorityMap: Record<string, string> = {
        'high': 'danger',
        'medium': 'warm',
        'low': 'normal'
    };
    return priorityMap[priority] || 'normal';
};

const getPriorityLabel = (priority: string) => {
    const priorityMap: Record<string, string> = {
        'high': '高',
        'medium': '中',
        'low': '低'
    };
    return priorityMap[priority] || priority;
};

const onSelectionChange = (selectedRowKeys: string[]) => {
    selectedOrders.value = selectedRowKeys;
};

const searchOrders = () => {
    console.log('搜索订单:', filterForm);
};

const resetFilter = () => {
    Object.keys(filterForm).forEach(key => {
        filterForm[key as keyof typeof filterForm] = '';
    });
};

const exportOrders = () => {
    console.log('导出订单数据');
};

const batchProcess = () => {
    console.log('批量处理订单:', selectedOrders.value);
};

const refreshOrders = () => {
    console.log('刷新订单列表');
};

const viewOrder = (row: any) => {
    selectedOrder.value = row;
    showDetailModal.value = true;
};

const processOrder = (row: any) => {
    console.log('处理订单:', row);
};

const trackOrder = (row: any) => {
    console.log('跟踪订单:', row);
};

const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedOrder.value = null;
};

const processCurrentOrder = () => {
    console.log('处理当前订单:', selectedOrder.value);
    closeDetailModal();
};
</script>

<style scoped lang="scss">
.order-receive-list-page {
    padding: 24px;
}

.page-header {
    margin-bottom: 32px;

    h1 {
        margin: 0;
        color: #333;
        font-size: 28px;
    }

    p {
        margin: 8px 0 0 0;
        color: #666;
        font-size: 16px;
    }
}

.filter-card {
    margin-bottom: 24px;
}

.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .left-actions {
        display: flex;
        gap: 8px;
    }

    .right-info {
        font-size: 14px;
        color: #666;
    }
}

.amount-text {
    font-weight: 600;
    color: #409eff;
}

.amount-large {
    font-size: 18px;
    font-weight: bold;
    color: #409eff;
}

.order-detail-content {
    padding: 20px;
}

.modal-actions {
    text-align: right;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e0e0e0;

    .lay-btn+.lay-btn {
        margin-left: 8px;
    }
}
</style>