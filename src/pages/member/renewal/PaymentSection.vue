<template>
    <div class="payment-section">
        <!-- 支付方式 -->
        <div class="payment-methods">
            <div class="payment-option" :class="{ active: modelValue === 'wechat' }"
                @click="$emit('update:modelValue', 'wechat')">
                <img src="@/assets/image/member/renewal/wechatpay.png" alt="微信支付" />
            </div>
            <div class="payment-option" :class="{ active: modelValue === 'alipay' }"
                @click="$emit('update:modelValue', 'alipay')">
                <img src="@/assets/image/member/renewal/alipay.png" alt="支付宝支付" />
            </div>
        </div>

        <!-- 支付信息 -->
        <div class="payment-info">
            <div class="amount">实付: <span class="price">{{ amount }}</span>元</div>
            <lay-button class="pay-button" @click="handlePayClick">支付</lay-button>
        </div>
    </div>
</template>

<script setup>
defineProps(['amount', 'modelValue'])
const emit = defineEmits(['update:modelValue', 'pay'])

const handlePayClick = () => {
    emit('pay')
}
</script>

<style lang="scss" scoped>
.payment-section {
    background: #f8f8f8;
    border-radius: 8px;
    padding: 20px;
    margin-top: 20px;
}

.payment-methods {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;

    .payment-option {
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;

        &.active {
            transform: scale(1.1);
        }

        &.active::after {
            content: "";
            width: 20px;
            height: 20px;
            position: absolute;
            right: 0;
            top: 0;
            background: url("@/assets/image/member/renewal/checked.png") center no-repeat;
            background-size: contain;
        }

        img {
            width: 80px;
            height: 40px;
            object-fit: contain;
        }
    }
}

.payment-info {
    text-align: center;

    .amount {
        font-size: 18px;
        margin-bottom: 15px;
        color: #666;

        .price {
            color: #ff4444;
            font-weight: bold;
            font-size: 24px;
        }
    }

    .pay-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        padding: 12px 40px;
        border-radius: 25px;
        font-weight: 600;
    }
}
</style>
