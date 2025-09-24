<template>
    <!-- 询价弹窗 -->
    <div v-if="visible" class="inquiry-overlay">
        <div class="inquiry-modal">
            <div class="modal-header">
                <h2>信息</h2>
                <button class="close-btn" @click="handleClose">
                    <lay-icon type="layui-icon-close" />
                </button>
            </div>

            <div class="modal-content">
                <div class="form-group">
                    <label>有效期:</label>
                    <div class="validity-inputs">
                        <lay-date-picker v-model="inquiryForm.validityDateTime" type="datetime" placeholder="选择日期时间"
                            style="width: 200px;" />
                        <lay-select v-model="inquiryForm.validityPeriod" style="width: 80px;">
                            <lay-select-option value="1天">1天</lay-select-option>
                            <lay-select-option value="3天">3天</lay-select-option>
                            <lay-select-option value="7天">7天</lay-select-option>
                            <lay-select-option value="15天">15天</lay-select-option>
                            <lay-select-option value="30天">30天</lay-select-option>
                        </lay-select>
                    </div>
                </div>
                <div class="form-group">
                    <label>留言:</label>
                    <lay-textarea v-model="inquiryForm.message" placeholder="请输入留言内容" :rows="4" />
                </div>
            </div>

            <div class="modal-footer">
                <lay-button @click="handleClose">取消</lay-button>
                <lay-button type="primary" @click="handleConfirm">确定</lay-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Notify from '@/utils/notify'
import http from '@/utils/http'
import type { Product } from './type'

// 定义组件的props
const props = defineProps<{
    visible: boolean
    selectedProducts: Product[]
}>()

// 定义组件的emits
const emit = defineEmits<{
    close: []
    success: [data: any]
}>()

// 询价表单数据
const inquiryForm = ref({
    validityDateTime: '',
    validityPeriod: '3天',
    message: '广州壹新网络科技有限公司的张三发的询价链接:{此处会替换成链接}'
})

// 监听visible变化，重置表单
watch(() => props.visible, (newVal) => {
    if (newVal) {
        // 重置表单数据
        inquiryForm.value = {
            validityDateTime: '',
            validityPeriod: '3天',
            message: '广州壹新网络科技有限公司的张三发的询价链接:{此处会替换成链接}'
        }
    }
})

// 关闭弹窗
const handleClose = () => {
    emit('close')
}

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
        } else {
            // 降级到传统方法
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            textArea.style.top = '-999999px'
            textArea.style.opacity = '0'
            textArea.style.pointerEvents = 'none'
            textArea.setAttribute('readonly', '')

            document.body.appendChild(textArea)

            // 选择文本
            textArea.select()
            textArea.setSelectionRange(0, 99999) // 对于移动设备
            const successful = document.execCommand('copy')
            document.body.removeChild(textArea)
            if (!successful) {
                throw new Error('document.execCommand 复制失败')
            }
        }

        Notify.success({
            title: '复制成功',
            content: '链接已复制到剪贴板',
            time: 2000
        })
    } catch (error: any) {
        Notify.error({
            title: '复制失败',
            content: '请手动复制链接',
            time: 3000
        })
    }
}

// 确认询价
const handleConfirm = async () => {
    // 验证表单
    if (!inquiryForm.value.validityDateTime) {
        Notify.error({
            title: '提示',
            content: '请选择有效期日期时间',
            time: 3000
        })
        return
    }

    try {
        // 构建请求数据
        const requestData = {
            orderid: null,
            proIdS: props.selectedProducts.map(p => p.proId).join(','),
            products: props.selectedProducts.map(product => ({
                profitprice: product.price || '',
                productId: product.proId,
                num: "1", // 默认数量为1
                prosub: product.subprojectClass || '',
                purchaseprice: product.purchaseprice || '',
                unit: product.unit || '',
                param: product.param || '',
                pursub: '',
                trait: product.trait || '',
                model: product.model || '',
                proName: product.name || '',
                brand: product.brand || '',
                imgSrc: product.pictureaddress || ''
            })),
            expiryDate: new Date(inquiryForm.value.validityDateTime).getTime(),
            projectName: "自键库产品项目"
        }

        console.log('发送询价请求:', requestData)

        // 调用API
        const response = await http.post('/Inquery/notOrderCreateInquiryLink', requestData)

        // 由于http工具已经处理了响应拦截器，直接使用响应数据
        const responseData = response as any
        // 检查响应是否成功
        if (responseData && responseData.code === '200' && responseData.data && responseData.data.link) {
            // 显示成功提示
            Notify.success({
                title: '询价成功',
                content: responseData.msg || '询价链接已生成',
                time: 3000
            })

            // 询问用户是否复制链接
            const fullLink = `https://newbeall.com${responseData.data.link}`
            const shouldCopy = confirm(`询价链接已生成！\n\n完整链接：\n${fullLink}\n\n是否复制到剪贴板？`)

            if (shouldCopy) {
                await copyToClipboard(fullLink)
            }

            // 发送成功事件
            emit('success', {
                ...inquiryForm.value,
                response: responseData,
                requestData: requestData,
                link: responseData.data.link
            })
        } else {
            // API返回错误
            Notify.error({
                title: '询价失败',
                content: responseData?.msg || '询价链接生成失败',
                time: 3000
            })
            return
        }

        // 关闭弹窗
        handleClose()

    } catch (error: any) {
        console.error('询价失败:', error)
        Notify.error({
            title: '询价失败',
            content: error.message || '询价过程中发生错误，请重试',
            time: 3000
        })
    }
}
</script>

<style lang="scss" scoped>
// 询价弹窗样式
.inquiry-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.inquiry-modal {
    background: white;
    border-radius: 8px;
    width: 500px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e8e8e8;

    h2 {
        margin: 0;
        font-size: 18px;
        color: #333;
    }

    .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: #666;

        &:hover {
            color: #333;
        }
    }
}

.modal-content {
    padding: 20px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #e8e8e8;
}

.form-group {
    margin-bottom: 20px;

    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #333;
    }

    .validity-inputs {
        display: flex;
        gap: 10px;
        align-items: center;
    }
}
</style>
