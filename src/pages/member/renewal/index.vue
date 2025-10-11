<template>
    <div class="member-renewal-page">
        <!-- 公司信息头部 -->
        <div class="company-header">
            <div class="company-info">
                <div class="company-logo">
                    <img :src="logoImageUrl" alt="Company Logo" />
                </div>
                <div class="company-details">
                    <h2>{{ companyInfo.companyName }}</h2>
                    <div class="company-stats">
                        <div class="stat-item">
                            <span class="label">会员有效期:</span>
                            <span class="value">{{ companyInfo.vipindate }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="label">AI服务有效期:</span>
                            <span class="value">{{ formatAiServiceDate }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="label">可用积分:</span>
                            <span class="value">{{ companyInfo.integration }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="label">剩余空间:</span>
                            <span class="value">{{ formatMemoryDisplay }}MB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 功能选项卡 -->
        <div class="function-tabs">
            <div class="tab-item" :class="{ active: activeTab === 'points' }" @click="activeTab = 'points'">
                <lay-icon type="layui-icon-star-fill" />
                积分充值
            </div>
            <div class="tab-item" :class="{ active: activeTab === 'renewal' }" @click="activeTab = 'renewal'">
                <lay-icon type="layui-icon-diamond" />
                会员续费
            </div>
            <div class="tab-item" :class="{ active: activeTab === 'storage' }" @click="activeTab = 'storage'">
                <lay-icon type="layui-icon-history" />
                云空间购买
            </div>
            <div class="tab-item" :class="{ active: activeTab === 'ai' }" @click="activeTab = 'ai'">
                <lay-icon type="layui-icon-face-smile" />
                AI服务
            </div>
        </div>

        <!-- 内容区域 -->
        <div class="page-content">
            <!-- 积分充值 -->
            <template v-if="activeTab === 'points'">
                <PointsSection v-model="selectedPoints" />
                <PaymentSection v-model="paymentMethod" :amount="pointsPrice" @pay="handlePay('points')" />
            </template>

            <!-- 会员续费 -->
            <template v-else-if="activeTab === 'renewal'">
                <RenewalSection
v-model="selectedPackage" v-model:use-points="usePoints"
                    :available-points="companyInfo.integration || 0" />
                <PaymentSection v-model="paymentMethod" :amount="renewalPrice" @pay="handlePay('renewal')" />
            </template>

            <!-- 云空间购买 -->
            <template v-else-if="activeTab === 'storage'">
                <StorageSection v-model="selectedStorage" />
                <PaymentSection v-model="paymentMethod" :amount="storagePrice" @pay="handlePay('storage')" />
            </template>

            <!-- AI服务 -->
            <template v-else-if="activeTab === 'ai'">
                <AiServiceSection v-model="selectedAiService" />
                <PaymentSection v-model="paymentMethod" :amount="aiServicePrice" @pay="handlePay('ai')" />
            </template>
        </div>

        <!-- 积分规则 -->
        <PointsRules />

        <!-- 支付弹窗 -->
        <PaymentModal
:visible="showPaymentModal" :payment-url="paymentUrl" :amount="currentPaymentAmount"
            :payment-type="currentPaymentType" @close="closePaymentModal" @payment-success="handlePaymentSuccess"
            @payment-timeout="handlePaymentTimeout" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { companyInfo } from './type';
import { ExpiredAuthApi, CompanyInfo } from './Api';
import Notify from '@/utils/notify';
import http from '@/utils/http';
import PointsSection from './PointsSection.vue';
import RenewalSection from './RenewalSection.vue';
import StorageSection from './StorageSection.vue';
import AiServiceSection from './AiServiceSection.vue';
import PaymentSection from './PaymentSection.vue';
import PointsRules from './PointsRules.vue';
import PaymentModal from './PaymentModal.vue';

// 响应式数据
const activeTab = ref('points');
const selectedPoints = ref('50');
const selectedPackage = ref('month');
const selectedStorage = ref('500mb');
const selectedAiService = ref('1month');
const paymentMethod = ref('wechat');
const usePoints = ref(false);

// 支付弹窗相关数据
const showPaymentModal = ref(false);
const paymentUrl = ref('');
const currentPaymentAmount = ref('');
const currentPaymentType = ref('');

// 价格数据
const prices = {
    points: { '50': '50.00', '110': '100.00', '580': '500.00', '1250': '1000.00' },
    renewal: { month: 399.00, halfYear: 2199.00, year: 4199.00, threeYears: 9999.00 },
    storage: { '500mb': '120.00', '1gb': '240.00', '10gb': '2307.00' },
    ai: { '1month': '100.00', '6months': '580.00', '12months': '1099.00' }
};

// 计算属性
const logoImageUrl = computed(() => {
    const logoUrl = companyInfo.value.logoUrl;
    return logoUrl ? `https://yx.newbeall.com/softLink/${logoUrl}` : '@/assets/image/default/cover_logo.png';
});

const formatAiServiceDate = computed(() => {
    const aiindate = companyInfo.value.aiindate;
    return (!aiindate || aiindate.trim() === '') ? '未开通' : aiindate;
});

const formatMemoryDisplay = computed(() => {
    const memory = companyInfo.value.memory;
    return memory ? Math.ceil(parseFloat(memory)) : 0;
});

const pointsPrice = computed(() => prices.points[selectedPoints.value] || '50.00');
const storagePrice = computed(() => prices.storage[selectedStorage.value] || '120.00');
const aiServicePrice = computed(() => prices.ai[selectedAiService.value] || '100.00');

const renewalPrice = computed(() => {
    const basePrice = prices.renewal[selectedPackage.value] || 399.00;
    if (!usePoints.value) return basePrice.toFixed(2);

    const deductionRates = {
        month: { rate: 1.0, maxPoints: 100 },
        halfYear: { rate: 1.09, maxPoints: 600 },
        year: { rate: 1.14, maxPoints: 1300 },
        threeYears: { rate: 1.44, maxPoints: 2800 }
    };

    const config = deductionRates[selectedPackage.value] || deductionRates.month;
    const availablePoints = companyInfo.value.integration || 0;
    const maxPoints = Math.min(availablePoints, config.maxPoints);
    const deduction = Math.floor(maxPoints * config.rate);

    return Math.max(0, basePrice - deduction).toFixed(2);
});

// 支付处理
const handlePay = async (type) => {

    try {
        const paymentData = {
            type,
            method: paymentMethod.value,
            amount: type === 'points' ? pointsPrice.value :
                type === 'renewal' ? renewalPrice.value :
                    type === 'storage' ? storagePrice.value : aiServicePrice.value,
            selection: type === 'points' ? selectedPoints.value :
                type === 'renewal' ? selectedPackage.value :
                    type === 'storage' ? selectedStorage.value : selectedAiService.value,
            useIntegral: type === 'renewal' ? usePoints.value : false
        };


        if (paymentMethod.value === 'wechat') {
            // 发起微信支付请求
            // 微信支付调用，构建查询参数
            const opt = getPaymentOpt(type);
            const useIntegral = paymentData.useIntegral;

            // 发起微信支付请求，参数通过URL查询字符串传递
            const result = await http.post(`wx/pay?opt=${opt}&useIntegral=${useIntegral}`);

            if (result && result.code === '200') {
                // 显示支付二维码
                paymentUrl.value = result.data;
                currentPaymentAmount.value = paymentData.amount;
                currentPaymentType.value = type;
                showPaymentModal.value = true;

                Notify.success({
                    title: '支付请求成功',
                    content: '请使用微信扫码支付',
                    time: 2000
                });
            } else {
                throw new Error(result?.msg || '支付失败');
            }


        } else if (paymentMethod.value === 'alipay') {
            // 支付宝支付逻辑
            Notify.info({
                title: '支付宝支付',
                content: '支付宝支付功能开发中...',
                time: 2000
            });
        }
    } catch (error) {
        console.error('支付错误:', error);
        Notify.error({
            title: '支付失败',
            content: error.message || '支付过程中发生错误，请重试',
            time: 3000
        });
    }
};

// 获取支付选项参数
const getPaymentOpt = (type) => {
    const selection = type === 'points' ? selectedPoints.value :
        type === 'renewal' ? selectedPackage.value :
            type === 'storage' ? selectedStorage.value :
                selectedAiService.value;

    // 积分充值映射：50->5, 110->6, 580->7, 1250->8
    if (type === 'points') {
        const pointsMap = { '50': 5, '110': 6, '580': 7, '1250': 8 };
        return pointsMap[selection] || 5;
    }

    // 会员续费映射：month->9, halfYear->2, year->11, threeYears->12
    if (type === 'renewal') {
        const renewalMap = { 'month': 1, 'halfYear': 2, 'year': 3, 'threeYears': 4 };
        return renewalMap[selection] || 1;
    }

    // 云空间购买映射：500mb->13, 1gb->14, 10gb->15
    if (type === 'storage') {
        const storageMap = { '500mb': 13, '1gb': 14, '10gb': 15 };
        return storageMap[selection] || 13;
    }

    // AI服务映射：1month->16, 6months->17, 12months->18
    if (type === 'ai') {
        const aiMap = { '1month': 16, '6months': 17, '12months': 18 };
        return aiMap[selection] || 16;
    }

    return 5; // 默认值
};

// 获取支付类型名称
const getPaymentTypeName = (type) => {
    switch (type) {
        case 'points': return '积分充值';
        case 'renewal': return '会员续费';
        case 'storage': return '云空间购买';
        case 'ai': return 'AI服务';
        default: return '支付';
    }
};

// 支付弹窗处理函数
const closePaymentModal = () => {
    showPaymentModal.value = false;
    paymentUrl.value = '';
    currentPaymentAmount.value = '';
    currentPaymentType.value = '';
};

const handlePaymentSuccess = async () => {
    Notify.success({
        title: '支付成功',
        content: `${getPaymentTypeName(currentPaymentType.value)}支付完成！`,
        time: 3000
    });

    // 刷新公司信息
    await CompanyInfo();

    // 关闭弹窗
    closePaymentModal();
};

const handlePaymentTimeout = () => {
    Notify.warning({
        title: '支付超时',
        content: '支付已超时，请重新发起支付',
        time: 3000
    });

    closePaymentModal();
};

onMounted(async () => {
    await ExpiredAuthApi();
    await CompanyInfo();
});
</script>

<style lang="scss" scoped>
.member-renewal-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
}

.company-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);

    .company-info {
        display: flex;
        align-items: center;
        gap: 30px;

        .company-logo img {
            width: 100px;
            height: 30px;
            background: white;
            border-radius: 4px;
        }

        .company-details {
            flex: 1;

            h2 {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 15px;
                color: #333;
            }

            .company-stats {
                display: flex;
                gap: 30px;
                font-size: 14px;

                .stat-item {
                    .label {
                        color: #666;
                        margin-right: 8px;
                    }

                    .value {
                        color: #333;
                        font-weight: 600;
                    }
                }
            }
        }
    }
}

.function-tabs {
    display: flex;
    justify-content: center;
    gap: 100px;
    margin-bottom: 10px;

    .tab-item {
        background: rgba(255, 255, 255, 0.9);
        padding: 15px 30px;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        &.active {
            background: white;
            color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
    }
}

.page-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}

@media (max-width: 768px) {
    .company-info {
        flex-direction: column;
        text-align: center;
    }

    .company-stats {
        flex-direction: column;
        gap: 10px;
    }

    .function-tabs {
        flex-wrap: wrap;
    }
}
</style>
