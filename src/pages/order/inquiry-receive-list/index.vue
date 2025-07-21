<template>
    <div class="inquiry-receive-list-page">
        <div class="page-header">
            <h1>询价接收列表</h1>
            <p>查看和处理客户的询价请求</p>
        </div>

        <div class="content-area">
            <!-- 统计卡片 -->
            <lay-row :space="16" class="stats-section">
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <h3>待回复询价</h3>
                            <span class="stat-number">5</span>
                            <span class="stat-trend up">+2</span>
                        </div>
                    </lay-card>
                </lay-col>
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <h3>已回复询价</h3>
                            <span class="stat-number">23</span>
                            <span class="stat-trend up">+5</span>
                        </div>
                    </lay-card>
                </lay-col>
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <h3>已转订单</h3>
                            <span class="stat-number">12</span>
                            <span class="stat-trend up">+3</span>
                        </div>
                    </lay-card>
                </lay-col>
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <h3>本月转化率</h3>
                            <span class="stat-number">52%</span>
                            <span class="stat-trend up">+8%</span>
                        </div>
                    </lay-card>
                </lay-col>
            </lay-row>

            <!-- 筛选工具栏 -->
            <lay-card class="filter-card">
                <lay-form :model="filterForm" layout="inline">
                    <lay-form-item label="询价编号">
                        <lay-input v-model="filterForm.inquiryNo" placeholder="输入询价编号" />
                    </lay-form-item>
                    <lay-form-item label="客户名称">
                        <lay-input v-model="filterForm.customerName" placeholder="输入客户名称" />
                    </lay-form-item>
                    <lay-form-item label="询价状态">
                        <lay-select v-model="filterForm.status" placeholder="选择状态">
                            <lay-select-option value="">全部状态</lay-select-option>
                            <lay-select-option value="pending">待回复</lay-select-option>
                            <lay-select-option value="replied">已回复</lay-select-option>
                            <lay-select-option value="converted">已转订单</lay-select-option>
                            <lay-select-option value="expired">已过期</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item label="询价类型">
                        <lay-select v-model="filterForm.inquiryType" placeholder="选择类型">
                            <lay-select-option value="">全部类型</lay-select-option>
                            <lay-select-option value="design">设计咨询</lay-select-option>
                            <lay-select-option value="decoration">装修报价</lay-select-option>
                            <lay-select-option value="material">材料询价</lay-select-option>
                            <lay-select-option value="other">其他咨询</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item>
                        <lay-button type="primary" @click="searchInquiries">搜索</lay-button>
                        <lay-button @click="resetFilter">重置</lay-button>
                    </lay-form-item>
                </lay-form>
            </lay-card>

            <!-- 询价列表 -->
            <lay-card title="询价请求列表">
                <div class="table-toolbar">
                    <div class="left-actions">
                        <lay-button type="primary" @click="batchReply" :disabled="selectedInquiries.length === 0">
                            批量回复
                        </lay-button>
                        <lay-button @click="refreshInquiries">刷新列表</lay-button>
                    </div>
                    <div class="right-info">
                        共 {{ inquiryList.length }} 个询价，已选择 {{ selectedInquiries.length }} 个
                    </div>
                </div>

                <lay-table :columns="columns" :data-source="inquiryList"
                    :row-selection="{ selectedRowKeys: selectedInquiries, onChange: onSelectionChange }"
                    :pagination="pagination">
                    <template #inquiryType="{ row }">
                        <lay-tag :type="getInquiryTypeColor(row.inquiryType)" size="sm">{{
                            getInquiryTypeLabel(row.inquiryType) }}</lay-tag>
                    </template>
                    <template #status="{ row }">
                        <lay-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</lay-tag>
                    </template>
                    <template #urgency="{ row }">
                        <lay-tag :type="getUrgencyType(row.urgency)" size="sm">{{ getUrgencyLabel(row.urgency)
                        }}</lay-tag>
                    </template>
                    <template #budget="{ row }">
                        <span class="budget-text" v-if="row.budget">{{ row.budget }}</span>
                        <span class="no-budget" v-else>未提供</span>
                    </template>
                    <template #action="{ row }">
                        <lay-button size="sm" @click="viewInquiry(row)">详情</lay-button>
                        <lay-button size="sm" type="primary" @click="replyInquiry(row)" v-if="row.status === 'pending'">
                            回复
                        </lay-button>
                        <lay-button size="sm" @click="convertToOrder(row)" v-if="row.status === 'replied'">
                            转订单
                        </lay-button>
                    </template>
                </lay-table>
            </lay-card>
        </div>

        <!-- 询价详情弹窗 -->
        <lay-layer v-model="showDetailModal" title="询价详情" :area="['800px', '600px']">
            <div class="inquiry-detail-content" v-if="selectedInquiry">
                <lay-tabs v-model="activeTab">
                    <lay-tab-item title="基本信息" id="basic">
                        <lay-form label-width="100px">
                            <lay-row>
                                <lay-col :md="12">
                                    <lay-form-item label="询价编号">
                                        <span>{{ selectedInquiry.inquiryNo }}</span>
                                    </lay-form-item>
                                </lay-col>
                                <lay-col :md="12">
                                    <lay-form-item label="询价状态">
                                        <lay-tag :type="getStatusType(selectedInquiry.status)">{{
                                            getStatusLabel(selectedInquiry.status) }}</lay-tag>
                                    </lay-form-item>
                                </lay-col>
                            </lay-row>

                            <lay-row>
                                <lay-col :md="12">
                                    <lay-form-item label="客户名称">
                                        <span>{{ selectedInquiry.customerName }}</span>
                                    </lay-form-item>
                                </lay-col>
                                <lay-col :md="12">
                                    <lay-form-item label="联系电话">
                                        <span>{{ selectedInquiry.customerPhone }}</span>
                                    </lay-form-item>
                                </lay-col>
                            </lay-row>

                            <lay-form-item label="询价内容">
                                <span>{{ selectedInquiry.inquiryContent }}</span>
                            </lay-form-item>

                            <lay-row>
                                <lay-col :md="12">
                                    <lay-form-item label="预算范围">
                                        <span class="budget-text">{{ selectedInquiry.budget || '未提供' }}</span>
                                    </lay-form-item>
                                </lay-col>
                                <lay-col :md="12">
                                    <lay-form-item label="紧急程度">
                                        <lay-tag :type="getUrgencyType(selectedInquiry.urgency)">{{
                                            getUrgencyLabel(selectedInquiry.urgency) }}</lay-tag>
                                    </lay-form-item>
                                </lay-col>
                            </lay-row>

                            <lay-row>
                                <lay-col :md="12">
                                    <lay-form-item label="接收时间">
                                        <span>{{ selectedInquiry.receiveTime }}</span>
                                    </lay-form-item>
                                </lay-col>
                                <lay-col :md="12">
                                    <lay-form-item label="期望回复时间">
                                        <span>{{ selectedInquiry.expectedReplyTime }}</span>
                                    </lay-form-item>
                                </lay-col>
                            </lay-row>
                        </lay-form>
                    </lay-tab-item>

                    <lay-tab-item title="回复记录" id="replies">
                        <div class="reply-history" v-if="selectedInquiry.replies && selectedInquiry.replies.length > 0">
                            <div v-for="reply in selectedInquiry.replies" :key="reply.id" class="reply-item">
                                <div class="reply-header">
                                    <span class="replier">{{ reply.replierName }}</span>
                                    <span class="reply-time">{{ reply.replyTime }}</span>
                                </div>
                                <div class="reply-content">{{ reply.content }}</div>
                            </div>
                        </div>
                        <div v-else class="no-replies">
                            <lay-icon type="layui-icon-face-surprised" size="48" />
                            <p>暂无回复记录</p>
                        </div>
                    </lay-tab-item>
                </lay-tabs>

                <div class="modal-actions">
                    <lay-button v-if="selectedInquiry.status === 'pending'" type="primary" @click="replyCurrentInquiry">
                        回复询价
                    </lay-button>
                    <lay-button v-if="selectedInquiry.status === 'replied'" @click="convertCurrentToOrder">
                        转为订单
                    </lay-button>
                    <lay-button @click="closeDetailModal">关闭</lay-button>
                </div>
            </div>
        </lay-layer>

        <!-- 回复询价弹窗 -->
        <lay-layer v-model="showReplyModal" title="回复询价" :area="['600px', '400px']">
            <div class="reply-modal-content">
                <lay-form :model="replyForm" label-width="80px">
                    <lay-form-item label="回复内容" required>
                        <lay-textarea v-model="replyForm.content" placeholder="请输入回复内容" :rows="6" />
                    </lay-form-item>

                    <lay-form-item label="报价金额">
                        <lay-input v-model="replyForm.quotedPrice" placeholder="如有报价请输入金额" />
                    </lay-form-item>

                    <lay-form-item label="有效期">
                        <lay-date-picker v-model="replyForm.validUntil" type="date" placeholder="选择报价有效期" />
                    </lay-form-item>
                </lay-form>

                <div class="modal-actions">
                    <lay-button type="primary" @click="submitReply">发送回复</lay-button>
                    <lay-button @click="closeReplyModal">取消</lay-button>
                </div>
            </div>
        </lay-layer>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const showDetailModal = ref(false);
const showReplyModal = ref(false);
const selectedInquiry = ref<any>(null);
const selectedInquiries = ref<string[]>([]);
const activeTab = ref('basic');

const filterForm = reactive({
    inquiryNo: '',
    customerName: '',
    status: '',
    inquiryType: ''
});

const replyForm = reactive({
    content: '',
    quotedPrice: '',
    validUntil: ''
});

const columns = [
    { title: '询价编号', key: 'inquiryNo', width: 120 },
    { title: '客户名称', key: 'customerName', width: 120 },
    { title: '询价类型', key: 'inquiryType', width: 100, customSlot: 'inquiryType' },
    { title: '询价内容', key: 'inquiryContent', width: 200 },
    { title: '预算范围', key: 'budget', width: 120, customSlot: 'budget' },
    { title: '紧急程度', key: 'urgency', width: 80, customSlot: 'urgency' },
    { title: '状态', key: 'status', width: 100, customSlot: 'status' },
    { title: '接收时间', key: 'receiveTime', width: 150 },
    { title: '操作', key: 'action', width: 180, customSlot: 'action' }
];

const inquiryList = ref([
    {
        id: '1',
        inquiryNo: 'INQ202401001',
        customerName: '某科技公司',
        customerPhone: '138-0000-0000',
        inquiryType: 'design',
        inquiryContent: '需要办公室装修设计方案，面积约500平米',
        budget: '¥80,000-120,000',
        urgency: 'high',
        status: 'pending',
        receiveTime: '2024-01-20 14:30',
        expectedReplyTime: '2024-01-22 18:00',
        replies: []
    },
    {
        id: '2',
        inquiryNo: 'INQ202401002',
        customerName: '某贸易公司',
        customerPhone: '139-0000-0000',
        inquiryType: 'decoration',
        inquiryContent: '展厅装修，需要现代简约风格',
        budget: '¥150,000-200,000',
        urgency: 'medium',
        status: 'replied',
        receiveTime: '2024-01-19 10:15',
        expectedReplyTime: '2024-01-21 17:00',
        replies: [
            {
                id: 1,
                replierName: '设计师张三',
                replyTime: '2024-01-19 16:30',
                content: '我们可以为您提供现代简约风格的展厅设计方案，预估费用在180,000元左右，包含设计和施工。'
            }
        ]
    },
    {
        id: '3',
        inquiryNo: 'INQ202401003',
        customerName: '某餐饮企业',
        customerPhone: '137-0000-0000',
        inquiryType: 'material',
        inquiryContent: '餐厅装修材料询价，需要环保材料',
        budget: null,
        urgency: 'low',
        status: 'converted',
        receiveTime: '2024-01-18 09:45',
        expectedReplyTime: '2024-01-20 17:00',
        replies: [
            {
                id: 1,
                replierName: '材料专员李四',
                replyTime: '2024-01-18 14:20',
                content: '我们有多种环保材料可供选择，已为您准备详细的材料清单和报价，请查收。'
            }
        ]
    }
]);

const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: inquiryList.value.length
});

const getInquiryTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
        'design': 'primary',
        'decoration': 'normal',
        'material': 'warm',
        'other': 'default'
    };
    return colorMap[type] || 'default';
};

const getInquiryTypeLabel = (type: string) => {
    const labelMap: Record<string, string> = {
        'design': '设计咨询',
        'decoration': '装修报价',
        'material': '材料询价',
        'other': '其他咨询'
    };
    return labelMap[type] || type;
};

const getStatusType = (status: string) => {
    const statusMap: Record<string, string> = {
        'pending': 'warm',
        'replied': 'normal',
        'converted': 'normal',
        'expired': 'danger'
    };
    return statusMap[status] || 'normal';
};

const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
        'pending': '待回复',
        'replied': '已回复',
        'converted': '已转订单',
        'expired': '已过期'
    };
    return statusMap[status] || status;
};

const getUrgencyType = (urgency: string) => {
    const urgencyMap: Record<string, string> = {
        'high': 'danger',
        'medium': 'warm',
        'low': 'normal'
    };
    return urgencyMap[urgency] || 'normal';
};

const getUrgencyLabel = (urgency: string) => {
    const urgencyMap: Record<string, string> = {
        'high': '紧急',
        'medium': '一般',
        'low': '不急'
    };
    return urgencyMap[urgency] || urgency;
};

const onSelectionChange = (selectedRowKeys: string[]) => {
    selectedInquiries.value = selectedRowKeys;
};

const searchInquiries = () => {
    console.log('搜索询价:', filterForm);
};

const resetFilter = () => {
    Object.keys(filterForm).forEach(key => {
        filterForm[key as keyof typeof filterForm] = '';
    });
};

const batchReply = () => {
    console.log('批量回复询价:', selectedInquiries.value);
};

const refreshInquiries = () => {
    console.log('刷新询价列表');
};

const viewInquiry = (row: any) => {
    selectedInquiry.value = row;
    showDetailModal.value = true;
};

const replyInquiry = (row: any) => {
    selectedInquiry.value = row;
    resetReplyForm();
    showReplyModal.value = true;
};

const convertToOrder = (row: any) => {
    console.log('转为订单:', row);
};

const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedInquiry.value = null;
};

const replyCurrentInquiry = () => {
    resetReplyForm();
    showReplyModal.value = true;
};

const convertCurrentToOrder = () => {
    console.log('转为订单:', selectedInquiry.value);
    closeDetailModal();
};

const closeReplyModal = () => {
    showReplyModal.value = false;
    resetReplyForm();
};

const resetReplyForm = () => {
    Object.keys(replyForm).forEach(key => {
        replyForm[key as keyof typeof replyForm] = '';
    });
};

const submitReply = () => {
    console.log('提交回复:', replyForm);
    closeReplyModal();
    if (showDetailModal.value) {
        closeDetailModal();
    }
};
</script>

<style scoped lang="scss">
.inquiry-receive-list-page {
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

.stats-section {
    margin-bottom: 24px;
}

.stat-card {
    .stat-content {
        text-align: center;
        padding: 20px;

        h3 {
            margin: 0 0 8px 0;
            color: #666;
            font-size: 14px;
        }

        .stat-number {
            display: block;
            font-size: 32px;
            font-weight: bold;
            color: #409eff;
            margin-bottom: 4px;
        }

        .stat-trend {
            font-size: 12px;

            &.up {
                color: #67c23a;

                &::before {
                    content: '↗ ';
                }
            }

            &.down {
                color: #f56c6c;

                &::before {
                    content: '↘ ';
                }
            }
        }
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

.budget-text {
    color: #409eff;
    font-weight: 500;
}

.no-budget {
    color: #999;
    font-style: italic;
}

.inquiry-detail-content {
    padding: 20px;
}

.reply-history {
    .reply-item {
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        padding: 16px;
        margin-bottom: 16px;

        .reply-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .replier {
                font-weight: 600;
                color: #333;
            }

            .reply-time {
                font-size: 12px;
                color: #999;
            }
        }

        .reply-content {
            color: #666;
            line-height: 1.5;
        }
    }
}

.no-replies {
    text-align: center;
    padding: 40px;
    color: #999;

    .layui-icon {
        margin-bottom: 16px;
        color: #ddd;
    }

    p {
        margin: 0;
    }
}

.reply-modal-content {
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
