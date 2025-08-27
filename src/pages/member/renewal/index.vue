<template>
    <div class="member-renewal-page">
        <!-- 公司信息头部 -->
        <div class="company-header">
            <div class="company-info">
                <div class="company-logo">
                    <img src="@/assets/image/default/cover_logo.png" alt="Newbeall Logo" />
                </div>
                <div class="company-details">
                    <h2>广州富新网络科技有限公司</h2>
                    <div class="company-stats">
                        <div class="stat-item">
                            <span class="label">会员有效期:</span>
                            <span class="value">2025-08-31 22:38:34</span>
                        </div>
                        <div class="stat-item">
                            <span class="label">可用积分:</span>
                            <span class="value">291</span>
                        </div>
                        <div class="stat-item">
                            <span class="label">剩余空间:</span>
                            <span class="value">50.00 MB</span>
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
        </div>

        <!-- 内容区域 -->
        <div class="page-content">
            <!-- 积分充值 -->
            <div v-if="activeTab === 'points'" class="points-recharge">
                <div class="points-packages">
                    <div class="package-grid">
                        <!-- 充值50积分 -->
                        <div class="package-card" :class="{ active: selectedPoints === '50' }"
                            @click="selectPoints('50')">
                            <div class="package-header">
                                <h3>充值积分</h3>
                                <div class="price">
                                    <span class="amount">¥50.00</span>
                                </div>
                                <div class="info">
                                    ¥50.00
                                </div>
                            </div>
                            <!-- 只在选中时显示激活图标 -->
                            <div v-if="selectedPoints === '50'" class="active-icon">
                                <img src="@/assets/image/member/renewal/card-active-icon.png" alt="已选中" />
                            </div>
                        </div>

                        <!-- 充值110积分 -->
                        <div class="package-card" :class="{ active: selectedPoints === '110' }"
                            @click="selectPoints('110')">
                            <div class="package-header">
                                <h3>充值积分</h3>
                                <div class="price">
                                    <span class="amount">¥110.00</span>
                                </div>
                                <div class="info">
                                    ¥110.00
                                </div>
                                <!-- 只在选中时显示激活图标 -->
                                <div v-if="selectedPoints === '110'" class="active-icon">
                                    <img src="@/assets/image/member/renewal/card-active-icon.png" alt="已选中" />
                                </div>
                            </div>
                        </div>
                        <!-- 充值580积分 -->
                        <div class="package-card" :class="{ active: selectedPoints === '580' }"
                            @click="selectPoints('580')">
                            <div class="package-header">
                                <h3>充值积分</h3>
                                <div class="price">
                                    <span class="amount">¥580.00</span>
                                </div>
                                <div class="info">
                                    ¥580.00
                                </div>
                                <!-- 只在选中时显示激活图标 -->
                                <div v-if="selectedPoints === '580'" class="active-icon">
                                    <img src="@/assets/image/member/renewal/card-active-icon.png" alt="已选中" />
                                </div>
                            </div>
                        </div>
                        <!-- 充值1250积分 -->
                        <div class="package-card" :class="{ active: selectedPoints === '1250' }"
                            @click="selectPoints('1250')">
                            <div class="package-header">
                                <h3>充值积分</h3>
                                <div class="price">
                                    <span class="amount">¥1250.00</span>
                                </div>
                                <div class="info">
                                    ¥1250.00
                                </div>
                                <!-- 只在选中时显示激活图标 -->
                                <div v-if="selectedPoints === '1250'" class="active-icon">
                                    <img src="@/assets/image/member/renewal/card-active-icon.png" alt="已选中" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 支付区域 -->
                <div class="payment-section">
                    <!-- 支付方式 -->
                    <div class="payment-methods">
                        <div class="payment-option" :class="{ active: paymentMethod === 'wechat' }"
                            @click="selectPayment('wechat')">
                            <div class="payment-icon wechat">
                                <img src="@/assets/image/member/renewal/wechatpay.png" alt="微信支付"
                                    class="payment-logo" />
                            </div>
                        </div>
                        <div class="payment-option" :class="{ active: paymentMethod === 'alipay' }"
                            @click="selectPayment('alipay')">
                            <div class="payment-icon alipay">
                                <img src="@/assets/image/member/renewal/alipay.png" alt="支付宝支付" class="payment-logo" />
                            </div>
                        </div>
                    </div>

                    <!-- 支付信息 -->
                    <div class="payment-info">
                        <div class="amount-display">
                            <span class="label">实付:</span>
                            <span class="amount">{{ getPointsPrice() }}</span>
                            <span class="currency">元</span>
                        </div>

                        <lay-button class="pay-button">
                            支付
                        </lay-button>
                    </div>
                </div>
            </div>

            <!-- 会员续费 -->
            <div v-else-if="activeTab === 'renewal'" class="member-renewal">
                <div class="membership-packages">
                    <div class="package-grid">
                        <!-- 续费一个月 -->
                        <div class="package-card" :class="{ active: selectedPackage === 'month' }"
                            @click="selectPackage('month')">
                            <div class="package-header">
                                <h3>续费一个月</h3>
                                <div class="price">
                                    <span class="amount">¥399.00</span>
                                </div>
                                <!-- 积分折扣信息一直显示 -->
                                <div class="info">
                                    积分抵扣率: 100.0% 最高可用100积分
                                </div>
                            </div>
                            <!-- 只在选中时显示激活图标 -->
                            <div v-if="selectedPackage === 'month'" class="active-icon">
                                <img src="@/assets/image/member/renewal/card-active-icon.png" alt="已选中" />
                            </div>
                        </div>

                        <!-- 续费半年 -->
                        <div class="package-card" :class="{ active: selectedPackage === 'halfYear' }"
                            @click="selectPackage('halfYear')">
                            <div class="package-header">
                                <h3>续费半年</h3>
                                <div class="price">
                                    <span class="amount">¥2199.00</span>
                                </div>
                                <!-- 积分折扣信息一直显示 -->
                                <div class="info">
                                    积分抵扣率: 109.0% 最高可用600积分
                                </div>
                            </div>
                            <!-- 只在选中时显示激活图标 -->
                            <div v-if="selectedPackage === 'halfYear'" class="active-icon">
                                <img src="@/assets/image/member/renewal/card-active-icon.png" alt="已选中" />
                            </div>
                        </div>

                        <!-- 续费一年 -->
                        <div class="package-card" :class="{ active: selectedPackage === 'year' }"
                            @click="selectPackage('year')">
                            <div class="package-header">
                                <h3>续费一年</h3>
                                <div class="price">
                                    <span class="currency"></span>
                                    <span class="amount">¥4199.00</span>
                                </div>
                                <!-- 积分折扣信息一直显示 -->
                                <div class="info">
                                    积分抵扣率: 114.0% 最高可用1300积分
                                </div>
                            </div>
                            <!-- 只在选中时显示激活图标 -->
                            <div v-if="selectedPackage === 'year'" class="active-icon">
                                <img src="@/assets/image/member/renewal/card-active-icon.png" alt="已选中" />
                            </div>
                        </div>

                        <!-- 续费三年 -->
                        <div class="package-card" :class="{ active: selectedPackage === 'threeYears' }"
                            @click="selectPackage('threeYears')">
                            <div class="package-header">
                                <h3>续费三年</h3>
                                <div class="price">
                                    <span class="amount">¥9999.00</span>
                                </div>
                                <!-- 积分折扣信息一直显示 -->
                                <div class="info">
                                    积分抵扣率: 144.0% 最高可用2600积分
                                </div>
                            </div>
                            <!-- 只在选中时显示激活图标 -->
                            <div v-if="selectedPackage === 'threeYears'" class="active-icon">
                                <img src="@/assets/image/member/renewal/card-active-icon.png" alt="已选中" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 支付区域 -->
                <div class="payment-section">
                    <!-- 支付方式 -->
                    <div class="payment-methods">
                        <div class="payment-option" :class="{ active: paymentMethod === 'wechat' }"
                            @click="selectPayment('wechat')">
                            <div class="payment-icon wechat">
                                <img src="@/assets/image/member/renewal/wechatpay.png" alt="微信支付"
                                    class="payment-logo" />
                            </div>
                        </div>
                        <div class="payment-option" :class="{ active: paymentMethod === 'alipay' }"
                            @click="selectPayment('alipay')">
                            <div class="payment-icon alipay">
                                <img src="@/assets/image/member/renewal/alipay.png" alt="支付宝支付" class="payment-logo" />
                            </div>
                        </div>
                    </div>

                    <!-- 会员续费的支付信息部分 -->
                    <div class="payment-info">
                        <div class="amount-display">
                            <span class="label">实付:</span>
                            <span class="amount">{{ finalAmount }}</span>
                            <span class="currency">元</span>
                        </div>

                        <div class="points-usage">
                            <label class="points-checkbox">
                                <input type="checkbox" v-model="usePoints" class="checkbox-input" />
                                <span class="checkbox-mark"></span>
                                <span class="checkbox-text">
                                    使用<span class="red-text">{{ availablePoints }}</span>积分 抵扣<span class="red-text">{{
                                        pointsDeduction }}</span>元
                                </span>
                            </label>
                        </div>

                        <lay-button class="pay-button">
                            支付
                        </lay-button>
                    </div>
                </div>
            </div>

            <!-- 云空间购买 -->
            <div v-else-if="activeTab === 'storage'" class="storage-purchase">
                <div class="storage-packages">
                    <div class="package-grid">
                        <!-- 500MB套餐 -->
                        <div class="package-card" :class="{ active: selectedStorage === '500mb' }"
                            @click="selectStorage('500mb')">
                            <div class="package-header">
                                <h3>云空间购买</h3>
                                <div class="price">
                                    <span class="amount">500MB</span>
                                </div>
                                <div class="info">
                                    ¥120.00
                                </div>
                            </div>
                            <!-- 只在选中时显示激活图标 -->
                            <div v-if="selectedStorage === '500mb'" class="active-icon">
                                <img src="@/assets/image/member/renewal/card-active-icon.png" alt="已选中" />
                            </div>
                        </div>

                        <!-- 1GB套餐 -->
                        <div class="package-card" :class="{ active: selectedStorage === '1gb' }"
                            @click="selectStorage('1gb')">
                            <div class="package-header">
                                <h3>云空间购买</h3>
                                <div class="price">
                                    <span class="amount">1GB</span>
                                </div>
                                <div class="info">
                                    ¥240.00
                                </div>
                            </div>
                            <!-- 只在选中时显示激活图标 -->
                            <div v-if="selectedStorage === '1gb'" class="active-icon">
                                <img src="@/assets/image/member/renewal/card-active-icon.png" alt="已选中" />
                            </div>
                        </div>

                        <!-- 10GB套餐 -->
                        <div class="package-card" :class="{ active: selectedStorage === '10gb' }"
                            @click="selectStorage('10gb')">
                            <div class="package-header">
                                <h3>云空间购买</h3>
                                <div class="price">
                                    <span class="amount">10GB</span>
                                </div>
                                <div class="info">
                                    ¥2307.00
                                </div>
                            </div>
                            <!-- 只在选中时显示激活图标 -->
                            <div v-if="selectedStorage === '10gb'" class="active-icon">
                                <img src="@/assets/image/member/renewal/card-active-icon.png" alt="已选中" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 支付区域 -->
                <div class="payment-section">
                    <!-- 支付方式 -->
                    <div class="payment-methods">
                        <div class="payment-option" :class="{ active: paymentMethod === 'wechat' }"
                            @click="selectPayment('wechat')">
                            <div class="payment-icon wechat">
                                <img src="@/assets/image/member/renewal/wechatpay.png" alt="微信支付"
                                    class="payment-logo" />
                            </div>
                        </div>
                        <div class="payment-option" :class="{ active: paymentMethod === 'alipay' }"
                            @click="selectPayment('alipay')">
                            <div class="payment-icon alipay">
                                <img src="@/assets/image/member/renewal/alipay.png" alt="支付宝支付" class="payment-logo" />
                            </div>
                        </div>
                    </div>

                    <!-- 支付信息 -->
                    <div class="payment-info">
                        <div class="amount-display">
                            <span class="label">实付:</span>
                            <span class="amount">{{ getStoragePrice() }}</span>
                            <span class="currency">元</span>
                        </div>

                        <lay-button class="pay-button">
                            支付
                        </lay-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 积分会员规则 -->
        <div class="points-rules">
            <div class="rules-header" @click="toggleRules">
                <div class="rules-title"><lay-icon type="layui-icon-util" />积分会员规则</div>
            </div>

            <div class="rules-content">
                <ol>
                    <li>1.积分永不过期。</li>
                    <li>2.云空间满额会员一起过期，会员过期积分可以保存今天。</li>
                    <li>3.积分可通过充值积分，也可通过平台活动获取。</li>
                    <li>4.会员续费时，可以用积分抵扣一定金额。</li>
                    <li>5.用户可以直接使用积分下载其他供应商报价。</li>
                    <li>6.成为会员，才能使用平台的核心功能。</li>
                    <li>7.具体会员续费规则见上方【会员续费】</li>
                    <li>8.本平台版权所有最终权。</li>
                </ol>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import Notify from '@/utils/notify';
import { useRouter } from 'vue-router';
import http from '@/utils/http';

const router = useRouter();

// 响应式数据
const activeTab = ref('points'); // 默认显示积分充值
const selectedPoints = ref('50'); // 默认选择50积分
const selectedPackage = ref('month'); // 默认选择续费一个月
const selectedStorage = ref('500mb'); // 默认选择500MB
const paymentMethod = ref('wechat');
const usePoints = ref(false);
const showRules = ref(false);

// 用户当前可用积分（这里假设是291，实际应该从接口获取）
const userAvailablePoints = ref(291);

// 积分充值价格数据
const pointsPrices = {
    '50': '50.00',
    '110': '100.00',
    '580': '500.00',
    '1250': '1000.00'
};

// 云空间价格数据
const storagePrices = {
    '500mb': '120.00',
    '1gb': '240.00',
    '10gb': '2307.00'
};

// 套餐价格数据
const packagePrices = {
    month: 399.00,
    halfYear: 2199.00,
    year: 4199.00,
    threeYears: 9999.00
};

// 可用积分抵扣配置
const pointsDeductionRates = {
    month: { rate: 1.0, maxPoints: 100 },
    halfYear: { rate: 1.09, maxPoints: 600 },
    year: { rate: 1.14, maxPoints: 1300 },
    threeYears: { rate: 1.44, maxPoints: 2600 }
};

// 计算当前套餐可用的最大积分数（取用户积分和套餐限制的最小值）
const availablePoints = computed(() => {
    const maxPoints = pointsDeductionRates[selectedPackage.value as keyof typeof pointsDeductionRates]?.maxPoints || 100;
    return Math.min(userAvailablePoints.value, maxPoints);
});

// 计算积分抵扣率
const pointsDeductionRate = computed(() => {
    return pointsDeductionRates[selectedPackage.value as keyof typeof pointsDeductionRates]?.rate || 1.0;
});

// 计算积分抵扣金额 = 积分抵扣率 × 实际使用的积分数，向下取整
const pointsDeduction = computed(() => {
    const deductionAmount = availablePoints.value * pointsDeductionRate.value;
    return Math.floor(deductionAmount); // 向下取整，不管是否勾选都计算显示
});

// 计算最终支付金额
const finalAmount = computed(() => {
    const baseAmount = packagePrices[selectedPackage.value as keyof typeof packagePrices] || 399.00;
    const deductionAmount = usePoints.value ? pointsDeduction.value : 0; // 只有勾选时才真正抵扣
    const finalPrice = Math.max(0, baseAmount - deductionAmount);
    return finalPrice.toFixed(2);
});

// 权限接口函数
const ExpiredAuthApi = async () => {
    try {
        const response = await http.get('auth/expiredAuth');
        return response;
    } catch {
        Notify.error({
            title: 'Session超时',
            content: '页面session超时，请重新登录',
            time: 2000
        });
        router.push('/login');
        return;
    }
};
onMounted(
    async () => {
        await ExpiredAuthApi();
    }

);

// 方法
const selectPoints = (points: string) => {
    selectedPoints.value = points;
};

const selectPackage = (packageType: string) => {
    selectedPackage.value = packageType;
};

const selectPayment = (method: string) => {
    paymentMethod.value = method;
};

const selectStorage = (storageType: string) => {
    selectedStorage.value = storageType;
};

const toggleRules = () => {
    showRules.value = !showRules.value;
};

const getPointsPrice = () => {
    return pointsPrices[selectedPoints.value as keyof typeof pointsPrices] || '50.00';
};

const getStoragePrice = () => {
    return storagePrices[selectedStorage.value as keyof typeof storagePrices] || '120.00';
};

</script>

<style scoped lang="scss">
.member-renewal-page {
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    position: relative;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 70%;
    height: 92vh;
    top: 1vh;
}

.company-header {
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    background: url('@/assets/image/member/renewal/topBg.png');
    background-size: 100% 100%;
    color: white;
    padding: 20px;

    .company-info {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 20px;

        .company-logo {
            img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: white;
                padding: 10px;
            }
        }

        .company-details {
            flex: 1;

            h2 {
                font-size: 24px;
                font-weight: 600;
            }

            .company-stats {
                display: flex;
                gap: 30px;
                font-size: 14px;

                .stat-item {
                    .label {
                        opacity: 0.8;
                        margin-right: 5px;
                    }

                    .value {
                        font-weight: 600;
                    }
                }
            }
        }
    }
}

.function-tabs {
    background: #e6e6e6;
    display: flex;

    .tab-item {
        flex: 1;
        font-size: 10px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        &.active {
            background: #fff;
            border-bottom: 1px solid #009688;
            color: #009688;
        }
    }
}

.page-content {
    position: relative;
    width: 100%;
}

.points-recharge,
.member-renewal,
.storage-purchase {
    position: absolute;
    width: 100%;
    padding: 0 10px;

    .points-packages,
    .membership-packages,
    .storage-packages {
        .package-grid {
            width: 100%;
            gap: 20px;
            display: flex;
            flex-wrap: nowrap;
            justify-content: center;
        }

        .package-card {
            top: 1vh;
            width: 100%;
            height: 80%;
            text-align: center;
            background: white;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid #fae8d0;
            position: relative;

            &.active {
                border-color: #ffa500;
            }

            // 激活图标样式
            .active-icon {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 16px;
                height: 16px;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }
            }

            .package-header {
                text-align: center;

                h3 {
                    margin-top: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                }

                .price {
                    margin-bottom: 10px;

                    .currency {
                        font-size: 16px;
                        color: #666;
                    }

                    .amount {
                        font-size: 18px;
                        font-weight: bold;
                        color: #b87100;
                    }
                }

                .info {
                    background: #fae8d0;
                    align-content: center;
                    text-align: center;
                    height: 20px;
                    font-size: 12px;
                    color: #666;
                    line-height: 1.2;
                    border-bottom-right-radius: 12px;
                    border-bottom-left-radius: 12px;
                }
            }
        }
    }
}

.payment-section {
    height: 26vh;
    background: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-top: 2vh;
    position: relative;
}

.payment-methods {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 10px;

    .payment-option {
        display: inline-block;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s ease;
        position: relative;
        border: 0.5px solid transparent;

        &:first-child {
            border-color: #1aad19;
        }

        &:last-child {
            border-color: #00a0e9;
        }

        // 微信支付勾选框
        &.active:first-child .payment-icon::after {
            content: "";
            width: 20px;
            height: 20px;
            position: absolute;
            right: 0px;
            bottom: 0px;
            z-index: 10;
            background: url("@/assets/image/member/renewal/checked2.png") center no-repeat;
            background-size: contain;
            display: block !important;
        }

        // 支付宝勾选框
        &.active:last-child .payment-icon::after {
            content: "";
            width: 20px;
            height: 20px;
            position: absolute;
            right: 0px;
            bottom: 0px;
            z-index: 10;
            background: url("@/assets/image/member/renewal/checked.png") center no-repeat;
            background-size: contain;
            display: block !important;
        }

        .payment-icon {

            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            .payment-logo {
                width: 80px;
                height: 40px;
                object-fit: contain;
            }
        }
    }
}

.payment-info {
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;

    .amount-display {
        height: 25px; // 固定高度
        display: flex;
        align-items: center;
        justify-content: center;

        .label {
            font-size: 14px;
            color: #666;
        }

        .amount {
            font-size: 18px;
            font-weight: bold;
            color: red; // 改为红色
            margin: 0 5px;
        }

        .currency {
            font-size: 14px;
            color: #666;
        }
    }

    .points-usage {
        height: 20px; // 固定高度，无论是否有内容都占据这个空间
        font-size: 12px;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1.2;

        .points-checkbox {
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;

            .checkbox-input {
                position: absolute;
                opacity: 0;
                cursor: pointer;

                &:checked+.checkbox-mark {
                    background-color: #1E9FFF;
                    border-color: #1E9FFF;

                    &::after {
                        display: block;
                    }
                }
            }

            .checkbox-mark {
                position: relative;
                width: 14px;
                height: 14px;
                border: 1px solid #d9d9d9;
                border-radius: 2px;
                background-color: white;
                margin-right: 6px;
                transition: all 0.3s ease;

                &::after {
                    content: "";
                    position: absolute;
                    display: none;
                    left: 4px;
                    top: 1px;
                    width: 4px;
                    height: 8px;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }
            }

            .checkbox-text {
                font-size: 12px;
                color: #666;

                .red-text {
                    color: red;
                    font-weight: bold; // 可选：让红色文字更突出
                }
            }

            &:hover .checkbox-mark {
                border-color: #1E9FFF;
            }
        }
    }

    .pay-button {
        background: #1E9FFF;
        color: #fff;
        width: 80px;
        height: 35px;
        font-size: 14px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease;
        flex-shrink: 0;

        &:hover {
            background: #1890ff;
        }
    }
}

// 积分会员规则样式
.points-rules {
    position: absolute;
    bottom: 0;
    width: 100%;

    .rules-header {
        position: relative;
        padding: 15px 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #009688;

        .rules-title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
        }
    }

    .rules-content {
        background: white;
        padding: 20px;
        border-radius: 0 0 8px 8px;
        border-top: 1px solid #009688;

        ol {
            padding-left: 20px;

            li {
                line-height: 1.6;
                color: #666;
                font-size: 12px;
            }
        }
    }
}

@media (max-width: 768px) {
    .company-info {
        flex-direction: column;
        text-align: center;
    }

    .company-stats {
        justify-content: center;
        flex-wrap: unwrap;
    }

    .package-grid {
        grid-template-columns: 1fr !important;
    }

    .payment-methods {
        flex-direction: column;
        align-items: center;
    }

    .function-tabs {
        .tab-item {
            padding: 15px 10px;
            font-size: 14px;
        }
    }
}

/* 支付样式 */
.pay-box {
    height: 280px;
    padding: 10px;
    box-sizing: border-box;
}

.pay-box .left {
    height: 280px;
    box-sizing: border-box;
    background: #f8f8f8;
}

.pay-way {
    width: 130px;
    height: 40px;
    border-radius: 5px;
    background: url("@/assets/image/member/renewal/wechatpay.png") center center no-repeat;
    background-size: contain;
    margin-right: 5px;
    margin-bottom: 5px;
    position: relative;
    cursor: pointer;
}

.pay-way-alipay {
    background: url("@/assets/image/member/renewal/alipay.png") center center no-repeat;
}

.pay-way-info {
    color: red;
    margin-top: 10px;
}
</style>
