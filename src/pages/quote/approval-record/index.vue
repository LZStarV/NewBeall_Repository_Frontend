<template>
    <div class="approval-record-page">
        <div class="page-header">
            <h1>审批记录</h1>
            <p>查看所有审批历史记录和详情</p>
        </div>

        <div class="content-area">
            <lay-card title="审批记录查询">
                <!-- 筛选器 -->
                <div class="filter-section">
                    <lay-row :space="16">
                        <lay-col :md="6">
                            <lay-form-item label="审批类型">
                                <lay-select v-model="filterForm.approvalType" placeholder="选择类型">
                                    <lay-select-option value="">全部</lay-select-option>
                                    <lay-select-option value="discount">折扣申请</lay-select-option>
                                    <lay-select-option value="delete">删除申请</lay-select-option>
                                    <lay-select-option value="quote">报价审批</lay-select-option>
                                </lay-select>
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="6">
                            <lay-form-item label="审批状态">
                                <lay-select v-model="filterForm.status" placeholder="选择状态">
                                    <lay-select-option value="">全部</lay-select-option>
                                    <lay-select-option value="pending">待审批</lay-select-option>
                                    <lay-select-option value="approved">已通过</lay-select-option>
                                    <lay-select-option value="rejected">已拒绝</lay-select-option>
                                </lay-select>
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="6">
                            <lay-form-item label="申请人">
                                <lay-input v-model="filterForm.applicant" placeholder="输入申请人" />
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="6">
                            <lay-form-item label="">
                                <lay-button type="primary" @click="searchRecords">查询</lay-button>
                                <lay-button @click="resetFilter">重置</lay-button>
                            </lay-form-item>
                        </lay-col>
                    </lay-row>
                </div>

                <!-- 审批记录表格 -->
                <div class="records-table">
                    <lay-table :columns="columns" :data-source="recordList" :pagination="pagination">
                        <template #approvalType="{ row }">
                            <lay-tag :type="getTypeTagType(row.approvalType)">{{ getTypeLabel(row.approvalType)
                            }}</lay-tag>
                        </template>
                        <template #status="{ row }">
                            <lay-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</lay-tag>
                        </template>
                        <template #action="{ row }">
                            <lay-button size="sm" @click="viewDetail(row)">查看详情</lay-button>
                            <lay-button v-if="row.status === 'pending'" size="sm" type="primary"
                                @click="processApproval(row)">
                                处理
                            </lay-button>
                        </template>
                    </lay-table>
                </div>
            </lay-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const filterForm = reactive({
    approvalType: '',
    status: '',
    applicant: ''
});

const columns = [
    { title: '申请编号', key: 'applicationNo', width: 120 },
    { title: '审批类型', key: 'approvalType', width: 100, customSlot: 'approvalType' },
    { title: '申请人', key: 'applicant', width: 100 },
    { title: '申请内容', key: 'content', width: 200 },
    { title: '申请时间', key: 'applyTime', width: 150 },
    { title: '审批人', key: 'approver', width: 100 },
    { title: '审批时间', key: 'approvalTime', width: 150 },
    { title: '状态', key: 'status', width: 100, customSlot: 'status' },
    { title: '操作', key: 'action', width: 150, customSlot: 'action' }
];

const recordList = ref([
    {
        id: 1,
        applicationNo: 'APP202401001',
        approvalType: 'discount',
        applicant: '张三',
        content: '订单O202401001申请9折优惠',
        applyTime: '2024-01-20 14:30',
        approver: '李经理',
        approvalTime: '2024-01-20 16:45',
        status: 'approved'
    },
    {
        id: 2,
        applicationNo: 'APP202401002',
        approvalType: 'delete',
        applicant: '王五',
        content: '删除重复报价数据Q202401005',
        applyTime: '2024-01-20 10:15',
        approver: '',
        approvalTime: '',
        status: 'pending'
    },
    {
        id: 3,
        applicationNo: 'APP202401003',
        approvalType: 'quote',
        applicant: '赵六',
        content: '客户ABC公司装修项目报价审批',
        applyTime: '2024-01-19 09:20',
        approver: '陈总监',
        approvalTime: '2024-01-19 15:30',
        status: 'rejected'
    }
]);

const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 3
});

const getTypeTagType = (type: string) => {
    const typeMap: Record<string, string> = {
        'discount': 'normal',
        'delete': 'warm',
        'quote': 'primary'
    };
    return typeMap[type] || 'normal';
};

const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
        'discount': '折扣申请',
        'delete': '删除申请',
        'quote': '报价审批'
    };
    return typeMap[type] || type;
};

const getStatusType = (status: string) => {
    const statusMap: Record<string, string> = {
        'pending': 'warm',
        'approved': 'normal',
        'rejected': 'danger'
    };
    return statusMap[status] || 'normal';
};

const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
        'pending': '待审批',
        'approved': '已通过',
        'rejected': '已拒绝'
    };
    return statusMap[status] || status;
};

const searchRecords = () => {
    console.log('查询审批记录:', filterForm);
};

const resetFilter = () => {
    Object.keys(filterForm).forEach(key => {
        filterForm[key as keyof typeof filterForm] = '';
    });
};

const viewDetail = (row: any) => {
    console.log('查看详情:', row);
};

const processApproval = (row: any) => {
    console.log('处理审批:', row);
};
</script>

<style scoped lang="scss">
.approval-record-page {
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

.filter-section {
    margin-bottom: 24px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}
</style>
