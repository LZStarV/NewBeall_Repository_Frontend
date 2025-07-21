<template>
    <div class="delete-application-page">
        <div class="page-header">
            <h1>删除申请</h1>
            <p>提交数据删除申请和查看申请状态</p>
        </div>

        <div class="content-area">
            <lay-row :space="24">
                <!-- 删除申请表单 -->
                <lay-col :md="16">
                    <lay-card title="数据删除申请">
                        <lay-form :model="deleteForm" ref="formRef">
                            <lay-form-item label="删除类型" prop="deleteType">
                                <lay-radio-group v-model="deleteForm.deleteType">
                                    <lay-radio value="quote">报价数据</lay-radio>
                                    <lay-radio value="order">订单数据</lay-radio>
                                    <lay-radio value="customer">客户数据</lay-radio>
                                    <lay-radio value="project">项目数据</lay-radio>
                                </lay-radio-group>
                            </lay-form-item>

                            <lay-form-item label="数据ID/编号" prop="dataId">
                                <lay-input v-model="deleteForm.dataId" placeholder="请输入要删除的数据ID或编号" />
                            </lay-form-item>

                            <lay-form-item label="删除原因" prop="reason">
                                <lay-select v-model="deleteForm.reason" placeholder="选择删除原因">
                                    <lay-select-option value="duplicate">重复数据</lay-select-option>
                                    <lay-select-option value="error">录入错误</lay-select-option>
                                    <lay-select-option value="customer_request">客户要求</lay-select-option>
                                    <lay-select-option value="compliance">合规要求</lay-select-option>
                                    <lay-select-option value="other">其他原因</lay-select-option>
                                </lay-select>
                            </lay-form-item>

                            <lay-form-item label="详细说明" prop="description">
                                <lay-textarea v-model="deleteForm.description" placeholder="请详细说明删除原因和必要性" :rows="4" />
                            </lay-form-item>

                            <lay-form-item label="确认信息">
                                <lay-checkbox v-model="deleteForm.confirmed">
                                    我确认了解此操作不可恢复，并承担相应责任
                                </lay-checkbox>
                            </lay-form-item>

                            <lay-form-item>
                                <lay-button type="primary" @click="submitDeleteApplication"
                                    :disabled="!deleteForm.confirmed">
                                    提交删除申请
                                </lay-button>
                                <lay-button @click="resetForm">重置</lay-button>
                            </lay-form-item>
                        </lay-form>
                    </lay-card>
                </lay-col>

                <!-- 申请状态 -->
                <lay-col :md="8">
                    <lay-card title="申请状态">
                        <div class="status-list">
                            <div v-for="item in deleteApplications" :key="item.id" class="status-item">
                                <div class="status-header">
                                    <span class="data-id">{{ item.dataId }}</span>
                                    <lay-tag :type="getStatusType(item.status)">{{ item.status }}</lay-tag>
                                </div>
                                <div class="status-info">
                                    <p>类型：{{ getTypeLabel(item.deleteType) }}</p>
                                    <p>申请时间：{{ item.applyTime }}</p>
                                    <p v-if="item.processTime">处理时间：{{ item.processTime }}</p>
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

const deleteForm = reactive({
    deleteType: '',
    dataId: '',
    reason: '',
    description: '',
    confirmed: false
});

const deleteApplications = ref([
    {
        id: 1,
        dataId: 'Q202401001',
        deleteType: 'quote',
        status: '审批中',
        applyTime: '2024-01-20 15:20',
        processTime: null
    },
    {
        id: 2,
        dataId: 'O202401005',
        deleteType: 'order',
        status: '已通过',
        applyTime: '2024-01-18 09:30',
        processTime: '2024-01-19 11:45'
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

const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
        'quote': '报价数据',
        'order': '订单数据',
        'customer': '客户数据',
        'project': '项目数据'
    };
    return typeMap[type] || type;
};

const submitDeleteApplication = () => {
    console.log('提交删除申请:', deleteForm);
};

const resetForm = () => {
    Object.keys(deleteForm).forEach(key => {
        if (key === 'confirmed') {
            deleteForm[key as keyof typeof deleteForm] = false;
        } else {
            deleteForm[key as keyof typeof deleteForm] = '';
        }
    });
};
</script>

<style scoped lang="scss">
.delete-application-page {
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

.status-list {
    max-height: 400px;
    overflow-y: auto;
}

.status-item {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 12px;

    .status-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .data-id {
            font-weight: 600;
            color: #333;
        }
    }

    .status-info {
        p {
            margin: 4px 0;
            font-size: 12px;
            color: #666;
        }
    }
}
</style>
