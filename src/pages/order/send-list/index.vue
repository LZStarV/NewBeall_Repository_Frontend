<template>
    <div class="order-send-list-page">
        <div class="page-header">
            <h1>订单发送列表</h1>
            <p>查看和管理已发送的订单状态</p>
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
                    <lay-form-item label="发送状态">
                        <lay-select v-model="filterForm.sendStatus" placeholder="选择发送状态">
                            <lay-select-option value="">全部状态</lay-select-option>
                            <lay-select-option value="sent">已发送</lay-select-option>
                            <lay-select-option value="delivered">已送达</lay-select-option>
                            <lay-select-option value="confirmed">已确认</lay-select-option>
                            <lay-select-option value="rejected">被拒绝</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item label="发送时间">
                        <lay-date-picker v-model="filterForm.startDate" placeholder="开始日期" />
                        <span style="margin: 0 8px;">至</span>
                        <lay-date-picker v-model="filterForm.endDate" placeholder="结束日期" />
                    </lay-form-item>
                    <lay-form-item>
                        <lay-button type="primary" @click="searchOrders">搜索</lay-button>
                        <lay-button @click="resetFilter">重置</lay-button>
                        <lay-button type="primary" @click="showSendModal">发送新订单</lay-button>
                    </lay-form-item>
                </lay-form>
            </lay-card>

            <!-- 订单列表 -->
            <lay-card title="发送订单列表">
                <div class="table-toolbar">
                    <div class="left-actions">
                        <lay-button @click="batchResend" :disabled="selectedOrders.length === 0">
                            批量重发
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
                    <template #sendStatus="{ row }">
                        <div class="status-info">
                            <lay-tag :type="getSendStatusType(row.sendStatus)">{{ getSendStatusLabel(row.sendStatus)
                                }}</lay-tag>
                            <div class="status-detail" v-if="row.statusDetail">{{ row.statusDetail }}</div>
                        </div>
                    </template>
                    <template #progress="{ row }">
                        <div class="progress-info">
                            <lay-progress :percent="row.progress" :status="getProgressStatus(row.sendStatus)" />
                            <div class="progress-text">{{ row.progressText }}</div>
                        </div>
                    </template>
                    <template #amount="{ row }">
                        <span class="amount-text">{{ row.amount }}</span>
                    </template>
                    <template #action="{ row }">
                        <lay-button size="sm" @click="viewOrder(row)">详情</lay-button>
                        <lay-button size="sm" @click="trackOrder(row)">跟踪</lay-button>
                        <lay-button size="sm" type="primary" @click="resendOrder(row)"
                            v-if="row.sendStatus === 'rejected'">
                            重发
                        </lay-button>
                        <lay-button size="sm" type="danger" @click="cancelOrder(row)"
                            v-if="['sent', 'delivered'].includes(row.sendStatus)">
                            撤回
                        </lay-button>
                    </template>
                </lay-table>
            </lay-card>
        </div>

        <!-- 发送新订单弹窗 -->
        <lay-layer v-model="showSendOrderModal" title="发送新订单" :area="['600px', '500px']">
            <div class="send-order-content">
                <lay-form :model="sendOrderForm" ref="sendOrderFormRef" label-width="100px">
                    <lay-form-item label="客户名称" prop="customerName" required>
                        <lay-select v-model="sendOrderForm.customerName" placeholder="选择客户">
                            <lay-select-option value="某科技公司">某科技公司</lay-select-option>
                            <lay-select-option value="某贸易公司">某贸易公司</lay-select-option>
                            <lay-select-option value="某餐饮企业">某餐饮企业</lay-select-option>
                        </lay-select>
                    </lay-form-item>

                    <lay-form-item label="项目名称" prop="projectName" required>
                        <lay-input v-model="sendOrderForm.projectName" placeholder="请输入项目名称" />
                    </lay-form-item>

                    <lay-form-item label="订单金额" prop="amount" required>
                        <lay-input v-model="sendOrderForm.amount" placeholder="请输入订单金额" />
                    </lay-form-item>

                    <lay-form-item label="项目描述" prop="description">
                        <lay-textarea v-model="sendOrderForm.description" placeholder="请输入项目描述" :rows="3" />
                    </lay-form-item>

                    <lay-form-item label="发送方式" prop="sendMethod" required>
                        <lay-radio-group v-model="sendOrderForm.sendMethod">
                            <lay-radio value="email">邮件发送</lay-radio>
                            <lay-radio value="system">系统消息</lay-radio>
                            <lay-radio value="both">邮件+系统</lay-radio>
                        </lay-radio-group>
                    </lay-form-item>

                    <lay-form-item label="优先级" prop="priority">
                        <lay-select v-model="sendOrderForm.priority">
                            <lay-select-option value="high">高</lay-select-option>
                            <lay-select-option value="medium">中</lay-select-option>
                            <lay-select-option value="low">低</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                </lay-form>

                <div class="modal-actions">
                    <lay-button type="primary" @click="submitSendOrder">发送订单</lay-button>
                    <lay-button @click="closeSendModal">取消</lay-button>
                </div>
            </div>
        </lay-layer>

        <!-- 订单跟踪弹窗 -->
        <lay-layer v-model="showTrackModal" title="订单跟踪" :area="['700px', '500px']">
            <div class="track-content" v-if="trackingOrder">
                <div class="tracking-header">
                    <h3>订单号: {{ trackingOrder.orderNo }}</h3>
                    <lay-tag :type="getSendStatusType(trackingOrder.sendStatus)">{{
                        getSendStatusLabel(trackingOrder.sendStatus)
                        }}</lay-tag>
                </div>

                <div class="tracking-timeline">
                    <div v-for="(step, index) in trackingOrder.timeline" :key="index" class="timeline-item"
                        :class="{ active: step.completed }">
                        <div class="timeline-marker">
                            <lay-icon :type="step.completed ? 'layui-icon-ok-circle' : 'layui-icon-circle'" />
                        </div>
                        <div class="timeline-content">
                            <h4>{{ step.title }}</h4>
                            <p>{{ step.description }}</p>
                            <div class="timeline-time" v-if="step.time">{{ step.time }}</div>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <lay-button @click="closeTrackModal">关闭</lay-button>
                </div>
            </div>
        </lay-layer>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const showSendOrderModal = ref(false);
const showTrackModal = ref(false);
const selectedOrders = ref<string[]>([]);
const trackingOrder = ref<any>(null);
const sendOrderFormRef = ref();

const filterForm = reactive({
    orderNo: '',
    customerName: '',
    sendStatus: '',
    startDate: '',
    endDate: ''
});

const sendOrderForm = reactive({
    customerName: '',
    projectName: '',
    amount: '',
    description: '',
    sendMethod: 'email',
    priority: 'medium'
});

const columns = [
    { title: '订单号', key: 'orderNo', width: 120 },
    { title: '客户名称', key: 'customerName', width: 150 },
    { title: '项目名称', key: 'projectName', width: 180 },
    { title: '订单金额', key: 'amount', width: 120, customSlot: 'amount' },
    { title: '发送状态', key: 'sendStatus', width: 140, customSlot: 'sendStatus' },
    { title: '进度', key: 'progress', width: 150, customSlot: 'progress' },
    { title: '发送时间', key: 'sendTime', width: 150 },
    { title: '操作', key: 'action', width: 200, customSlot: 'action' }
];

const orderList = ref([
    {
        id: '1',
        orderNo: 'O202401001',
        customerName: '某科技公司',
        projectName: '办公室装修设计',
        amount: '¥50,000',
        sendStatus: 'confirmed',
        progress: 100,
        progressText: '客户已确认',
        sendTime: '2024-01-20 10:30',
        statusDetail: '客户已查看并确认订单',
        timeline: [
            { title: '订单发送', description: '订单已发送给客户', time: '2024-01-20 10:30', completed: true },
            { title: '客户接收', description: '客户已接收订单', time: '2024-01-20 11:15', completed: true },
            { title: '客户确认', description: '客户已确认订单内容', time: '2024-01-20 14:20', completed: true }
        ]
    },
    {
        id: '2',
        orderNo: 'O202401002',
        customerName: '某贸易公司',
        projectName: '展厅设计',
        amount: '¥80,000',
        sendStatus: 'delivered',
        progress: 66,
        progressText: '等待客户确认',
        sendTime: '2024-01-19 14:15',
        statusDetail: '已送达，等待客户确认',
        timeline: [
            { title: '订单发送', description: '订单已发送给客户', time: '2024-01-19 14:15', completed: true },
            { title: '客户接收', description: '客户已接收订单', time: '2024-01-19 15:30', completed: true },
            { title: '客户确认', description: '等待客户确认订单内容', time: '', completed: false }
        ]
    },
    {
        id: '3',
        orderNo: 'O202401003',
        customerName: '某餐饮企业',
        projectName: '餐厅装修',
        amount: '¥35,000',
        sendStatus: 'rejected',
        progress: 33,
        progressText: '客户已拒绝',
        sendTime: '2024-01-18 09:45',
        statusDetail: '客户拒绝：预算超出范围',
        timeline: [
            { title: '订单发送', description: '订单已发送给客户', time: '2024-01-18 09:45', completed: true },
            { title: '客户拒绝', description: '客户拒绝了订单：预算超出范围', time: '2024-01-18 16:20', completed: true }
        ]
    }
]);

const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: orderList.value.length
});

const getSendStatusType = (status: string) => {
    const statusMap: Record<string, string> = {
        'sent': 'primary',
        'delivered': 'normal',
        'confirmed': 'normal',
        'rejected': 'danger'
    };
    return statusMap[status] || 'normal';
};

const getSendStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
        'sent': '已发送',
        'delivered': '已送达',
        'confirmed': '已确认',
        'rejected': '被拒绝'
    };
    return statusMap[status] || status;
};

const getProgressStatus = (status: string) => {
    if (status === 'confirmed') return 'success';
    if (status === 'rejected') return 'exception';
    return 'active';
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

const batchResend = () => {
    console.log('批量重发订单:', selectedOrders.value);
};

const refreshOrders = () => {
    console.log('刷新订单列表');
};

const viewOrder = (row: any) => {
    console.log('查看订单详情:', row);
};

const trackOrder = (row: any) => {
    trackingOrder.value = row;
    showTrackModal.value = true;
};

const resendOrder = (row: any) => {
    console.log('重发订单:', row);
};

const cancelOrder = (row: any) => {
    console.log('撤回订单:', row);
};

const showSendModal = () => {
    resetSendOrderForm();
    showSendOrderModal.value = true;
};

const closeSendModal = () => {
    showSendOrderModal.value = false;
    resetSendOrderForm();
};

const closeTrackModal = () => {
    showTrackModal.value = false;
    trackingOrder.value = null;
};

const resetSendOrderForm = () => {
    Object.keys(sendOrderForm).forEach(key => {
        if (key === 'sendMethod') {
            sendOrderForm[key as keyof typeof sendOrderForm] = 'email';
        } else if (key === 'priority') {
            sendOrderForm[key as keyof typeof sendOrderForm] = 'medium';
        } else {
            sendOrderForm[key as keyof typeof sendOrderForm] = '';
        }
    });
};

const submitSendOrder = () => {
    console.log('发送订单:', sendOrderForm);
    closeSendModal();
};
</script>

<style scoped lang="scss">
.order-send-list-page {
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

.status-info {
    .status-detail {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
    }
}

.progress-info {
    .progress-text {
        font-size: 12px;
        color: #666;
        margin-top: 4px;
    }
}

.amount-text {
    font-weight: 600;
    color: #409eff;
}

.send-order-content {
    padding: 20px;
}

.track-content {
    padding: 20px;

    .tracking-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e0e0e0;

        h3 {
            margin: 0;
            color: #333;
        }
    }
}

.tracking-timeline {
    .timeline-item {
        display: flex;
        margin-bottom: 20px;

        &.active {
            .timeline-marker .layui-icon {
                color: #67c23a;
            }

            .timeline-content h4 {
                color: #333;
            }
        }

        .timeline-marker {
            width: 24px;
            margin-right: 16px;
            margin-top: 4px;

            .layui-icon {
                font-size: 20px;
                color: #ddd;
            }
        }

        .timeline-content {
            flex: 1;

            h4 {
                margin: 0 0 4px 0;
                color: #999;
                font-size: 16px;
            }

            p {
                margin: 0 0 4px 0;
                color: #666;
                font-size: 14px;
            }

            .timeline-time {
                font-size: 12px;
                color: #999;
            }
        }
    }
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
```

```
