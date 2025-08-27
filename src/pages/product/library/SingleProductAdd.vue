<template>
  <!-- 单个新增弹窗 -->
  <div v-if="visible" class="single-add-overlay">
    <div class="single-add-modal">
      <div class="modal-header">
        <h2>新增产品</h2>
        <button class="close-btn" @click="handleClose">
          <lay-icon type="layui-icon-close" />
        </button>
      </div>
      
      <div class="modal-content">
        <lay-form :model="productForm" ref="formRef" label-width="100px">
          <div class="form-row">
            <lay-form-item label="产品编号" prop="proId" required>
              <lay-input v-model="productForm.proId" placeholder="请输入产品编号" />
            </lay-form-item>
            <lay-form-item label="产品名称" prop="name" required>
              <lay-input v-model="productForm.name" placeholder="请输入产品名称" />
            </lay-form-item>
          </div>
          
          <div class="form-row">
            <lay-form-item label="品牌" prop="brand">
              <lay-select v-model="productForm.brand" placeholder="请选择品牌">
                <lay-select-option value="华为">华为</lay-select-option>
                <lay-select-option value="海康威视">海康威视</lay-select-option>
                <lay-select-option value="大华">大华</lay-select-option>
                <lay-select-option value="锐捷">锐捷</lay-select-option>
                <lay-select-option value="思科">思科</lay-select-option>
              </lay-select>
            </lay-form-item>
            <lay-form-item label="型号" prop="model">
              <lay-input v-model="productForm.model" placeholder="请输入型号" />
            </lay-form-item>
          </div>
          
          <div class="form-row">
            <lay-form-item label="单位" prop="unit">
              <lay-select v-model="productForm.unit" placeholder="请选择单位">
                <lay-select-option value="台">台</lay-select-option>
                <lay-select-option value="套">套</lay-select-option>
                <lay-select-option value="个">个</lay-select-option>
                <lay-select-option value="只">只</lay-select-option>
                <lay-select-option value="块">块</lay-select-option>
              </lay-select>
            </lay-form-item>
            <lay-form-item label="成本价" prop="purchaseprice">
              <lay-input v-model="productForm.purchaseprice" placeholder="请输入成本价" type="number" />
            </lay-form-item>
          </div>
          
          <div class="form-row">
            <lay-form-item label="参考售价" prop="price">
              <lay-input v-model="productForm.price" placeholder="请输入参考售价" type="number" />
            </lay-form-item>
            <lay-form-item label="市场指导价" prop="marketprice">
              <lay-input v-model="productForm.marketprice" placeholder="请输入市场指导价" type="number" />
            </lay-form-item>
          </div>
          
          <div class="form-row">
            <lay-form-item label="库存数量" prop="inventory">
              <lay-input v-model="productForm.inventory" placeholder="请输入库存数量" type="number" />
            </lay-form-item>
            <lay-form-item label="默认折率" prop="defaultDiscount">
              <lay-input v-model="productForm.defaultDiscount" placeholder="请输入默认折率(%)" type="number" />
            </lay-form-item>
          </div>
          
          <lay-form-item label="产品特性" prop="trait">
            <lay-textarea v-model="productForm.trait" placeholder="请输入产品特性描述" rows="3" />
          </lay-form-item>
          
          <lay-form-item label="详细参数" prop="param">
            <lay-textarea v-model="productForm.param" placeholder="请输入详细参数" rows="4" />
          </lay-form-item>
          
          <div class="form-row">
            <lay-form-item label="云端库">
              <lay-switch v-model="productForm.isOpen" onswitch-text="开启" offswitch-text="关闭" />
            </lay-form-item>
            <lay-form-item label="自动报价">
              <lay-switch v-model="productForm.autoHandle" onswitch-text="开启" offswitch-text="关闭" />
            </lay-form-item>
          </div>
          
          <lay-form-item label="产品图片" prop="pictureaddress">
            <div class="upload-area">
              <lay-input v-model="productForm.pictureaddress" placeholder="请输入图片URL或点击上传" />
              <lay-button type="primary" style="margin-left: 10px;">
                <lay-icon type="layui-icon-upload" /> 上传图片
              </lay-button>
            </div>
          </lay-form-item>
          
          <div class="image-preview" v-if="productForm.pictureaddress">
            <img :src="productForm.pictureaddress" alt="产品图片预览" @error="handleImageError" />
          </div>
        </lay-form>
      </div>
      
      <div class="modal-footer">
        <lay-button @click="handleClose">取消</lay-button>
        <lay-button type="primary" @click="handleSubmit">保存</lay-button>
        <lay-button type="normal" @click="handleSaveAndContinue">保存并继续新增</lay-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import Notify from '@/utils/notify'
import http from '@/utils/http'

// 产品表单数据接口
interface ProductForm {
  proId: string
  name: string
  brand: string
  model: string
  unit: string
  purchaseprice: string
  price: string
  marketprice: string
  inventory: string
  defaultDiscount: string
  trait: string
  param: string
  isOpen: boolean
  autoHandle: boolean
  pictureaddress: string
}

// 定义组件的props
interface Props {
  visible: boolean
}

const props = defineProps<Props>()

// 定义组件的emits
const emit = defineEmits<{
  close: []
  success: [product: ProductForm]
}>()

// 表单引用
const formRef = ref()

// 产品表单数据
const productForm = reactive<ProductForm>({
  proId: '',
  name: '',
  brand: '',
  model: '',
  unit: '',
  purchaseprice: '',
  price: '',
  marketprice: '',
  inventory: '',
  defaultDiscount: '',
  trait: '',
  param: '',
  isOpen: false,
  autoHandle: false,
  pictureaddress: ''
})

// 重置表单
const resetForm = () => {
  Object.assign(productForm, {
    proId: '',
    name: '',
    brand: '',
    model: '',
    unit: '',
    purchaseprice: '',
    price: '',
    marketprice: '',
    inventory: '',
    defaultDiscount: '',
    trait: '',
    param: '',
    isOpen: false,
    autoHandle: false,
    pictureaddress: ''
  })
}

// 生成产品编号
const generateProductId = () => {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `PRD${timestamp.slice(-8)}${random}`
}

// 监听弹窗显示状态，自动生成产品编号
watch(() => props.visible, (newVal) => {
  if (newVal) {
    resetForm()
    productForm.proId = generateProductId()
  }
})

// 关闭弹窗
const handleClose = () => {
  resetForm()
  emit('close')
}

// 表单验证
const validateForm = (): boolean => {
  if (!productForm.proId.trim()) {
    Notify.error({
      title: '验证失败',
      content: '请输入产品编号',
      time: 3000
    })
    return false
  }
  
  if (!productForm.name.trim()) {
    Notify.error({
      title: '验证失败',
      content: '请输入产品名称',
      time: 3000
    })
    return false
  }
  
  if (productForm.purchaseprice && productForm.price) {
    const cost = parseFloat(productForm.purchaseprice)
    const sellPrice = parseFloat(productForm.price)
    if (cost > sellPrice) {
      Notify.warning({
        title: '价格提醒',
        content: '成本价高于参考售价，请检查价格设置',
        time: 4000
      })
    }
  }
  
  return true
}

// 提交保存
const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    // 这里调用新增产品API
    const response = await http.post('/product/addProduct', {
      ...productForm,
      createtime: new Date().toISOString(),
      uname: '当前用户' // 这里应该从用户状态获取
    })
    
    if (response && (response.status === 200 || response.code === 200)) {
      Notify.success({
        title: '新增成功',
        content: `产品 "${productForm.name}" 已成功添加`,
        time: 3000
      })
      
      emit('success', { ...productForm })
      handleClose()
    } else {
      throw new Error(response?.message || '新增产品失败')
    }
  } catch (error) {
    console.error('新增产品失败:', error)
    Notify.error({
      title: '新增失败',
      content: error instanceof Error ? error.message : '新增产品失败，请稍后重试',
      time: 3000
    })
  }
}

// 保存并继续新增
const handleSaveAndContinue = async () => {
  if (!validateForm()) return
  
  try {
    // 先保存当前产品
    const response = await http.post('/product/addProduct', {
      ...productForm,
      createtime: new Date().toISOString(),
      uname: '当前用户'
    })
    
    if (response && (response.status === 200 || response.code === 200)) {
      Notify.success({
        title: '新增成功',
        content: `产品 "${productForm.name}" 已成功添加，继续新增下一个产品`,
        time: 3000
      })
      
      emit('success', { ...productForm })
      
      // 重置表单并生成新的产品编号
      resetForm()
      productForm.proId = generateProductId()
    } else {
      throw new Error(response?.message || '新增产品失败')
    }
  } catch (error) {
    console.error('新增产品失败:', error)
    Notify.error({
      title: '新增失败',
      content: error instanceof Error ? error.message : '新增产品失败，请稍后重试',
      time: 3000
    })
  }
}

// 图片加载错误处理
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/150x150?text=图片加载失败'
  target.alt = '图片加载失败'
}
</script>

<style lang="scss" scoped>
.single-add-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.single-add-modal {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    transition: all 0.2s ease;

    &:hover {
      background: #f0f0f0;
      color: #333;
    }

    .layui-icon {
      font-size: 16px;
    }
  }
}

.modal-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .upload-area {
    display: flex;
    align-items: center;
    
    .layui-input {
      flex: 1;
    }
  }

  .image-preview {
    margin-top: 10px;
    text-align: center;
    
    img {
      max-width: 200px;
      max-height: 150px;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      object-fit: cover;
    }
  }
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f8f9fa;

  .layui-btn {
    margin: 0;
  }
}

// 表单样式优化
:deep(.layui-form-item) {
  margin-bottom: 16px;

  .layui-form-label {
    width: 100px;
    padding: 9px 0;
    font-weight: 500;
    color: #333;
  }

  .layui-input-wrapper {
    margin-left: 110px;
  }

  .layui-input,
  .layui-textarea,
  .layui-select {
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }
}

// 开关样式
:deep(.layui-switch) {
  transform: scale(0.9);
}

// 响应式设计
@media (max-width: 768px) {
  .single-add-modal {
    width: 95%;
    margin: 20px;
  }

  .modal-content {
    padding: 16px;
  }

  :deep(.layui-form-item) {
    .layui-form-label {
      width: 80px;
      font-size: 14px;
    }

    .layui-input-wrapper {
      margin-left: 90px;
    }
  }
}
</style>
