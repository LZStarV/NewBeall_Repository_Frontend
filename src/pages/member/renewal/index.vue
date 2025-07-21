<template>
    <div class="member-renewal-page">
        <div class="page-header">
            <h1>会员续费</h1>
            <p>管理会员套餐和续费服务</p>
        </div>

        <div class="content-area">
            <!-- 当前会员信息 -->
            <lay-card title="当前会员信息" class="member-info-card">
                <div class="member-status">
                    <div class="status-item">
                        <h3>会员等级</h3>
                        <span class="level">{{ memberInfo.level }}</span>
                    </div>
                    <div class="status-item">
                        <h3>到期时间</h3>
                        <span class="expire-date" :class="{ expired: isExpired }">{{ memberInfo.expireDate }}</span>
                    </div>
                    <div class="status-item">
                        <h3>剩余天数</h3>
                        <span class="remaining-days" :class="{ warning: remainingDays <= 30 }">{{ remainingDays
                        }}天</span>
                    </div>
                    <div class="status-item">
                        <h3>会员状态</h3>
                        <lay-tag :type="memberInfo.status === 'active' ? 'normal' : 'danger'">
                            {{ memberInfo.status === 'active' ? '正常' : '已过期' }}
                        </lay-tag>
                    </div>
                </div>
            </lay-card>

            <!-- 套餐选择 -->
            <lay-card title="选择续费套餐" class="packages-card">
                <div class="packages-grid">
                    <div v-for="pkg in packages" :key="pkg.id" class="package-item" :class="{
                        selected: selectedPackage === pkg.id,
                        recommended: pkg.recommended
                    }" @click="selectPackage(pkg.id)">
                        <div v-if="pkg.recommended" class="recommended-badge">推荐</div>
                        <div class="package-header">
                            <h3>{{ pkg.name }}</h3>
                            <div class="price">
                                <span class="currency">¥</span>
                                <span class="amount">{{ pkg.price }}</span>
                                <span class="period">/{{ pkg.period }}</span>
                            </div>
                        </div>
                        <div class="package-features">
                            <div v-for="feature in pkg.features" :key="feature" class="feature">
                                <lay-icon type="layui-icon-ok" />
                                <span>{{ feature }}</span>
                            </div>
                        </div>
                        <div class="package-discount" v-if="pkg.discount">
                            <span class="discount-text">{{ pkg.discount }}</span>
                        </div>
                    </div>
                </div>

                <!-- 续费操作 -->
                <div class="renewal-actions">
                    <div class="payment-summary">
                        <div class="summary-item">
                            <span>选择套餐：</span>
                            <span>{{ getSelectedPackageName() }}</span>
                        </div>
                        <div class="summary-item">
                            <span>续费金额：</span>
                            <span class="amount">¥{{ getSelectedPackagePrice() }}</span>
                        </div>
                        <div class="summary-item">
                            <span>续费后到期时间：</span>
                            <span>{{ getNewExpireDate() }}</span>
                        </div>
                    </div>

                    <div class="payment-methods">
                        <h4>支付方式</h4>
                        <lay-radio-group v-model="paymentMethod">
                            <lay-radio value="alipay">
                                <lay-icon type="layui-icon-cellphone" /> 支付宝
                            </lay-radio>
                            <lay-radio value="wechat">
                                <lay-icon type="layui-icon-cellphone" /> 微信支付
                            </lay-radio>
                            <lay-radio value="bank">
                                <lay-icon type="layui-icon-rmb" /> 银行转账
                            </lay-radio>
                        </lay-radio-group>
                    </div>

                    <div class="action-buttons">
                        <lay-button type="primary" size="lg" :disabled="!selectedPackage || !paymentMethod"
                            @click="processRenewal">
                            立即续费
                        </lay-button>
                        <lay-button size="lg" @click="contactService">联系客服</lay-button>
                    </div>
                </div>
            </lay-card>

            <!-- 续费记录 -->
            <lay-card title="续费记录">
                <lay-table :columns="renewalColumns" :data-source="renewalHistory">
                    <template #status="{ row }">
                        <lay-tag :type="getRenewalStatusType(row.status)">{{ row.status }}</lay-tag>
                    </template>
                    <template #action="{ row }">
                        <lay-button size="sm" @click="viewInvoice(row)">查看发票</lay-button>
                    </template>
                </lay-table>
            </lay-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';

const memberInfo = reactive({
    level: '专业版',
    expireDate: '2024-02-15',
    status: 'active'
});

const selectedPackage = ref<number | null>(null);
const paymentMethod = ref('');

const packages = ref([
    {
        id: 1,
        name: '基础版',
        price: 299,
        period: '年',
        features: ['基础功能', '5个项目', '10GB存储', '邮件支持'],
        discount: null,
        recommended: false
    },
    {
        id: 2,
        name: '专业版',
        price: 599,
        period: '年',
        features: ['全部功能', '无限项目', '100GB存储', '7x24小时支持', '高级报表'],
        discount: '最受欢迎',
        recommended: true
    },
    {
        id: 3,
        name: '企业版',
        price: 1299,
        period: '年',
        features: ['全部功能', '无限项目', '1TB存储', '专属客服', '定制开发', 'API接入'],
        discount: '立省200元',
        recommended: false
    }
]);

const renewalColumns = [
    { title: '订单号', key: 'orderNo', width: 150 },
    { title: '套餐名称', key: 'packageName', width: 120 },
    { title: '续费金额', key: 'amount', width: 100 },
    { title: '续费时间', key: 'renewalDate', width: 150 },
    { title: '有效期至', key: 'validUntil', width: 150 },
    { title: '状态', key: 'status', width: 100, customSlot: 'status' },
    { title: '操作', key: 'action', width: 100, customSlot: 'action' }
];

const renewalHistory = ref([
    {
        orderNo: 'R202401001',
        packageName: '专业版',
        amount: '¥599',
        renewalDate: '2023-02-15',
        validUntil: '2024-02-15',
        status: '已完成'
    }
]);

// 计算剩余天数
const remainingDays = computed(() => {
    const today = new Date();
    const expireDate = new Date(memberInfo.expireDate);
    const diffTime = expireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
});

// 是否已过期
const isExpired = computed(() => remainingDays.value <= 0);

const selectPackage = (packageId: number) => {
    selectedPackage.value = packageId;
};

const getSelectedPackageName = () => {
    if (!selectedPackage.value) return '未选择';
    const pkg = packages.value.find(p => p.id === selectedPackage.value);
    return pkg ? pkg.name : '未选择';
};

const getSelectedPackagePrice = () => {
    if (!selectedPackage.value) return 0;
    const pkg = packages.value.find(p => p.id === selectedPackage.value);
    return pkg ? pkg.price : 0;
};

const getNewExpireDate = () => {
    if (!selectedPackage.value) return '请选择套餐';
    const currentExpire = new Date(memberInfo.expireDate);
    const newExpire = new Date(currentExpire);
    newExpire.setFullYear(newExpire.getFullYear() + 1);
    return newExpire.toISOString().split('T')[0];
};

const getRenewalStatusType = (status: string) => {
    const statusMap: Record<string, string> = {
        '已完成': 'normal',
        '处理中': 'warm',
        '已取消': 'danger'
    };
    return statusMap[status] || 'normal';
};

const processRenewal = () => {
    console.log('处理续费:', {
        packageId: selectedPackage.value,
        paymentMethod: paymentMethod.value
    });
};

const contactService = () => {
    console.log('联系客服');
};

const viewInvoice = (row: any) => {
    console.log('查看发票:', row);
};
</script>

<style scoped lang="scss">
.member-renewal-page {
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

.member-info-card {
    margin-bottom: 24px;
}

.member-status {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
}

.status-item {
    text-align: center;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;

    h3 {
        margin: 0 0 8px 0;
        color: #666;
        font-size: 14px;
    }

    .level {
        font-size: 24px;
        font-weight: bold;
        color: #409eff;
    }

    .expire-date {
        font-size: 18px;
        font-weight: 600;
        color: #333;

        &.expired {
            color: #f56c6c;
        }
    }

    .remaining-days {
        font-size: 24px;
        font-weight: bold;
        color: #67c23a;

        &.warning {
            color: #e6a23c;
        }
    }
}

.packages-card {
    margin-bottom: 24px;
}

.packages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
}

.package-item {
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
        border-color: #409eff;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
    }

    &.selected {
        border-color: #409eff;
        background: #f0f9ff;
    }

    &.recommended {
        border-color: #67c23a;

        .recommended-badge {
            position: absolute;
            top: -8px;
            right: 20px;
            background: #67c23a;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
        }
    }
}

.package-header {
    text-align: center;
    margin-bottom: 24px;

    h3 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 24px;
    }

    .price {
        .currency {
            font-size: 16px;
            color: #666;
        }

        .amount {
            font-size: 36px;
            font-weight: bold;
            color: #409eff;
        }

        .period {
            font-size: 14px;
            color: #666;
        }
    }
}

.package-features {
    .feature {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .layui-icon {
            color: #67c23a;
            margin-right: 8px;
        }
    }
}

.package-discount {
    text-align: center;
    margin-top: 16px;

    .discount-text {
        background: #e6f7ff;
        color: #409eff;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
    }
}

.renewal-actions {
    border-top: 1px solid #e0e0e0;
    padding-top: 24px;
}

.payment-summary {
    margin-bottom: 24px;

    .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        .amount {
            font-weight: bold;
            color: #409eff;
        }
    }
}

.payment-methods {
    margin-bottom: 24px;

    h4 {
        margin: 0 0 12px 0;
        color: #333;
    }
}

.action-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
}
</style>
