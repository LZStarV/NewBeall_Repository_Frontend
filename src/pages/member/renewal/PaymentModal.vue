<template>
    <div class="payment-modal" v-if="visible" @click.self="closeModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>{{ paymentTitle }}</h3>
                <span class="close-btn" @click="closeModal">&times;</span>
            </div>

            <div class="modal-body">
                <div class="payment-info">
                    <div class="amount-info">
                        <span class="label">支付金额：</span>
                        <span class="amount">¥{{ amount }}</span>
                    </div>
                    <div class="payment-method">
                        <img src="@/assets/image/member/renewal/wechatpay.png" alt="微信支付" class="payment-icon" />
                        <span>微信扫码支付</span>
                    </div>
                </div>

                <div class="qrcode-container">
                    <div ref="qrcodeRef" class="qrcode"></div>
                    <p class="qrcode-tip">请使用微信扫一扫</p>
                </div>

                <div class="payment-status">
                    <div class="status-text">{{ statusText }}</div>
                    <div class="countdown" v-if="countdown > 0">
                        支付剩余时间：{{ formatTime(countdown) }}
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <lay-button @click="closeModal">取消支付</lay-button>
                <lay-button type="primary" @click="checkPaymentStatus">检查支付状态</lay-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, computed, onUnmounted } from 'vue'
import QRCode from 'qrcode'
import http from '@/utils/http'

const props = defineProps({
    visible: Boolean,
    paymentUrl: String,
    amount: String,
    paymentType: String
})

const emit = defineEmits(['close', 'payment-success', 'payment-timeout'])

const qrcodeRef = ref(null)
const countdown = ref(300) // 5分钟
const statusText = ref('等待支付...')
const timer = ref(null)

const paymentTitle = computed(() => {
    const typeMap = {
        'points': '积分充值',
        'renewal': '会员续费',
        'storage': '云空间购买',
        'ai': 'AI服务'
    }
    return typeMap[props.paymentType] || '支付'
})

const generateQRCode = async (url) => {
    if (!qrcodeRef.value || !url) {
        return
    }

    try {
        // 清空容器
        qrcodeRef.value.innerHTML = ''

        // 创建一个canvas元素
        const canvas = document.createElement('canvas')

        // 生成二维码到canvas
        await QRCode.toCanvas(canvas, url, {
            width: 200,
            height: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        })

        // 将canvas添加到容器中
        qrcodeRef.value.appendChild(canvas)
    } catch (error) {
        console.error('生成二维码失败:', error)
        qrcodeRef.value.innerHTML = '<p style="text-align:center;color:#666;">二维码生成失败</p>'
    }
}

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const startCountdown = () => {
    if (timer.value) clearInterval(timer.value)

    timer.value = setInterval(() => {
        countdown.value--

        if (countdown.value <= 0) {
            clearInterval(timer.value)
            statusText.value = '支付超时，请重新发起支付'
            emit('payment-timeout')
        }
    }, 1000)
}

const checkPaymentStatus = async () => {
    statusText.value = '检查支付状态中...'

    try {
        const response = await http.get('wx/checkPayStatus')

        if (response.code === '200' && response.data.status === 'success') {
            statusText.value = '支付成功！'
            clearInterval(timer.value)
            emit('payment-success')
            setTimeout(() => {
                closeModal()
            }, 1500)
        } else {
            statusText.value = '等待支付...'
        }
    } catch (error) {
        statusText.value = '检查支付状态失败'
        setTimeout(() => {
            statusText.value = '等待支付...'
        }, 2000)
    }
}

const closeModal = () => {
    if (timer.value) {
        clearInterval(timer.value)
        timer.value = null
    }
    emit('close')
}

// 监听支付URL和弹窗可见性的组合变化
watch([() => props.paymentUrl, () => props.visible], async ([newUrl, visible]) => {
    if (newUrl && visible) {
        await nextTick()
        await generateQRCode(newUrl)
        startCountdown()
        statusText.value = '等待支付...'
    }
}, { immediate: true })


watch(() => props.visible, (visible) => {
    if (visible) {
        countdown.value = 300
    } else {
        if (timer.value) {
            clearInterval(timer.value)
            timer.value = null
        }
    }
})

onUnmounted(() => {
    if (timer.value) {
        clearInterval(timer.value)
    }
})
</script>

<style lang="scss" scoped>
.payment-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    .modal-content {
        background: white;
        border-radius: 12px;
        width: 400px;
        max-width: 90vw;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
            background: #f8f9fa;

            h3 {
                margin: 0;
                font-size: 18px;
                color: #333;
            }

            .close-btn {
                font-size: 24px;
                cursor: pointer;
                color: #666;
                transition: color 0.3s;

                &:hover {
                    color: #333;
                }
            }
        }

        .modal-body {
            padding: 30px 20px;
            text-align: center;

            .payment-info {
                margin-bottom: 20px;

                .amount-info {
                    margin-bottom: 15px;

                    .label {
                        color: #666;
                        font-size: 14px;
                    }

                    .amount {
                        color: #ff4444;
                        font-size: 24px;
                        font-weight: bold;
                        margin-left: 8px;
                    }
                }

                .payment-method {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;

                    .payment-icon {
                        width: 24px;
                        height: 24px;
                    }
                }
            }

            .qrcode-container {
                margin: 20px 0;

                .qrcode {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 10px;

                    canvas {
                        border: 1px solid #ddd;
                        border-radius: 8px;
                    }
                }

                .qrcode-tip {
                    color: #666;
                    font-size: 14px;
                    margin: 0;
                }
            }

            .payment-status {
                margin-top: 20px;

                .status-text {
                    color: #333;
                    font-size: 16px;
                    margin-bottom: 10px;
                }

                .countdown {
                    color: #666;
                    font-size: 14px;
                }
            }
        }

        .modal-footer {
            padding: 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: center;
            gap: 15px;
        }
    }
}

@media (max-width: 480px) {
    .payment-modal {
        .modal-content {
            width: 350px;

            .modal-body {
                padding: 20px 15px;
            }
        }
    }
}
</style>
