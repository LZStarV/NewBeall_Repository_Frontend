<template>
    <div class="order-discount-application-page">
        <div class="page-header">
            <h1>订单折率申请</h1>
            <p>提交和管理订单折扣申请</p>
        </div>

        <div class="content-area">
            <lay-row :space="24">
                <!-- 申请表单 -->
                <lay-col :md="14">
                    <lay-card title="折扣申请">
                        <lay-form :model="discountForm" ref="formRef">
                            <lay-row>
                                <lay-col :md="12">
                                    <lay-form-item label="订单号" prop="orderNo">
                                        <lay-input v-model="discountForm.orderNo" placeholder="请输入订单号" />
                                    </lay-form-item>
                                </lay-col>
                                <lay-col :md="12">
                                    <lay-form-item label="客户名称" prop="customerName">
                                        <lay-input v-model="discountForm.customerName" placeholder="请输入客户名称" />
                                    </lay-form-item>
                                </lay-col>
                            </lay-row>

                            <lay-row>
                                <lay-col :md="12">
                                    <lay-form-item label="原始金额" prop="originalAmount">
                                        <lay-input v-model="discountForm.originalAmount" placeholder="请输入原始金额" />
                                    </lay-form-item>
                                </lay-col>
                                <lay-col :md="12">
                                    <lay-form-item label="申请折率" prop="discountRate">
                                        <lay-select v-model="discountForm.discountRate" placeholder="选择折率">
                                            <lay-select-option value="0.95">95折</lay-select-option>
                                            <lay-select-option value="0.9">9折</lay-select-option>
                                            <lay-select-option value="0.85">85折</lay-select-option>
                                            <lay-select-option value="0.8">8折</lay-select-option>
                                        </lay-select>
                                    </lay-form-item>
                                </lay-col>
                            </lay-row>

                            <lay-form-item label="申请理由" prop="reason">
                                <lay-textarea v-model="discountForm.reason" placeholder="请详细说明申请折扣的理由" :rows="4" />
                            </lay-form-item>

                            <lay-form-item label="附件">
                                <lay-upload action="/api/upload" :multiple="true">
                                    <lay-button>上传文件</lay-button>
                                </lay-upload>
                            </lay-form-item>

                            <lay-form-item>
                                <lay-button type="primary" @click="submitApplication">提交申请</lay-button>
                                <lay-button @click="resetForm">重置</lay-button>
                            </lay-form-item>
                        </lay-form>
                    </lay-card>
                </lay-col>

                <!-- 申请记录 -->
                <lay-col :md="10">
                    <lay-card title="我的申请记录">
                        <div class="application-list">
                            <div v-for="item in applicationList" :key="item.id" class="application-item">
                                <div class="application-header">
                                    <span class="order-no">{{ item.orderNo }}</span>
                                    <lay-tag :type="getStatusType(item.status)">{{ item.status }}</lay-tag>
                                </div>
                                <div class="application-info">
                                    <p>折率：{{ (item.discountRate * 100).toFixed(0) }}折</p>
                                    <p>申请时间：{{ item.applyTime }}</p>
                                </div>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>
            </lay-row>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const formRef = ref();

const discountForm = reactive({
    orderNo: '',
    customerName: '',
    originalAmount: '',
    discountRate: '',
    reason: ''
});

const applicationList = ref([
    {
        id: 1,
        orderNo: 'O202401001',
        discountRate: 0.9,
        status: '审批中',
        applyTime: '2024-01-20 14:30'
    },
    {
        id: 2,
        orderNo: 'O202401002',
        discountRate: 0.85,
        status: '已通过',
        applyTime: '2024-01-18 10:15'
    }
]);

const getStatusType = (status: string) => {
    const statusMap: Record<string, string> = {
        '审批中': 'warm',
        '已通过': 'normal',
        '已拒绝': 'danger'
    };
    return statusMap[status] || 'normal';
};

const submitApplication = () => {
    console.log('提交申请:', discountForm);
};

const resetForm = () => {
    Object.keys(discountForm).forEach(key => {
        discountForm[key as keyof typeof discountForm] = '';
    });
};
</script>

<style scoped lang="scss">
.order-discount-application-page {
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

.application-list {
    max-height: 400px;
    overflow-y: auto;
}

.application-item {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 12px;

    .application-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .order-no {
            font-weight: 600;
            color: #333;
        }
    }

    .application-info {
        p {
            margin: 4px 0;
            font-size: 12px;
            color: #666;
        }
    }
}
</style>
