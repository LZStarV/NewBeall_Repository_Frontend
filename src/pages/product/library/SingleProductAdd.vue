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
        <lay-form ref="formRef" :model="productForm">
          <!-- 产品名称和单位 -->
          <div class="form-row">
            <div class="custom-form-item">
              <label class="form-label">产品名称</label>
              <lay-input v-model="productForm.name" placeholder="请输入产品名称" />
            </div>
            <div class="custom-form-item">
              <label class="form-label">产品单位</label>
              <lay-select v-model="productForm.unit" placeholder="请选择单位">
                <lay-select-option value="台">台</lay-select-option>
                <lay-select-option value="套">套</lay-select-option>
                <lay-select-option value="个">个</lay-select-option>
                <lay-select-option value="只">只</lay-select-option>
                <lay-select-option value="块">块</lay-select-option>
              </lay-select>
            </div>
          </div>

          <!-- 品牌和成本 -->
          <div class="form-row">
            <div class="custom-form-item">
              <label class="form-label">品牌</label>
              <lay-input v-model="productForm.brand" placeholder="请输入品牌" />
            </div>
            <div class="custom-form-item">
              <label class="form-label">成本</label>
              <lay-input v-model="productForm.purchaseprice" placeholder="请输入成本" />
            </div>
          </div>

          <!-- 型号和参考售价 -->
          <div class="form-row">
            <div class="custom-form-item">
              <label class="form-label">型号</label>
              <lay-input v-model="productForm.model" placeholder="请输入型号" />
            </div>
            <div class="custom-form-item">
              <label class="form-label">参考售价</label>
              <lay-input v-model="productForm.price" placeholder="请输入参考售价" />
            </div>
          </div>

          <!-- 产品库存和市场指导价 -->
          <div class="form-row">
            <div class="custom-form-item">
              <label class="form-label">产品库存</label>
              <lay-input v-model="productForm.inventory" placeholder="请输入库存数量" />
            </div>
            <div class="custom-form-item">
              <label class="form-label">市场指导价</label>
              <lay-input v-model="productForm.marketprice" placeholder="请输入市场指导价" />
            </div>
          </div>

          <!-- 产品类别 -->
          <div class="form-row">
            <div class="custom-form-item category-item">
              <label class="form-label">产品类别</label>
              <div style="display: flex;">
                <lay-select
v-model="productForm.mainCategoryId" placeholder="-请选择-" style="flex: 1;"
                  @change="onMainCategoryChange">
                  <lay-select-option v-for="category in mainCategories" :key="category.id" :value="category.id">
                    {{ category.categoryName }}
                  </lay-select-option>
                </lay-select>
                <lay-select
v-model="productForm.subCategoryId" placeholder="-请选择-"
                  :disabled="!productForm.mainCategoryId" style="flex: 2;">
                  <template v-for="group in subCategoryGroups" :key="group.id">
                    <!-- 父级分类（不可选择） -->
                    <lay-select-option :value="group.id" disabled class="category-group-header">
                      {{ group.categoryName }}
                    </lay-select-option>
                    <!-- 子级分类（可选择） -->
                    <template v-if="Array.isArray(group.productItems)">
                      <lay-select-option
v-for="subCategory in group.productItems" :key="subCategory.id"
                        :value="subCategory.id" class="category-sub-item">
                        {{ subCategory.categoryName }}
                      </lay-select-option>
                    </template>
                  </template>
                </lay-select>
              </div>
            </div>
          </div>

          <!-- 产品图片 -->
          <div class="custom-form-item full-width">
            <label class="form-label">产品图片</label>
            <div class="image-upload-container">
              <!-- 图片上传区域 -->
              <div class="image-upload-area" @click="triggerFileUpload">
                <input
ref="fileInputRef" type="file" accept="image/*" style="display: none;"
                  @change="handleFileUpload" />

                <!-- 如果已上传图片，显示图片预览 -->
                <div v-if="uploadedImageData" class="image-preview-container">
                  <img :src="uploadedImageData" alt="产品图片预览" @error="handleImageError" />
                  <div class="image-overlay">
                    <lay-icon type="layui-icon-upload" />
                    <span>重新上传</span>
                  </div>
                </div>

                <!-- 如果未上传图片，显示占位符 -->
                <div v-else class="image-placeholder">
                  <div class="plus-icon">+</div>
                </div>
              </div>

              <!-- 推荐文本 -->
              <div class="upload-tip">推荐上传无底透明的png格式</div>
            </div>
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
import { ref, reactive, watch, onMounted } from 'vue';
import Notify from '@/utils/notify';
import http from '@/utils/http';
import categoryApi from '@/api/product/categoryApi';
import type { ProductForm, ProductCategory } from './type';

// 定义组件的props
interface Props {
  visible: boolean
}

const props = defineProps<Props>();

// 定义组件的emits
const emit = defineEmits<{
  close: []
  success: [product: ProductForm]
}>();

// 表单引用
const formRef = ref();

// 文件输入框引用
const fileInputRef = ref<HTMLInputElement>();

// 存储上传的图片 base64 数据
const uploadedImageData = ref<string>('');

// 分类相关的响应式数据
const mainCategories = ref<ProductCategory[]>([]);
const subCategories = ref<ProductCategory[]>([]);
const subCategoryGroups = ref<ProductCategory[]>([]); // 保持分组结构的子分类

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
  pictureaddress: '',
  mainCategoryId: '',
  subCategoryId: ''
});

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
    pictureaddress: '',
    mainCategoryId: '',
    subCategoryId: ''
  });
  // 重置分类数据
  subCategories.value = [];
  subCategoryGroups.value = [];
  // 重置上传的图片数据
  uploadedImageData.value = '';
};

// 生成产品编号
const generateProductId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PRD${timestamp.slice(-8)}${random}`;
};

// 监听弹窗显示状态，自动生成产品编号
watch(() => props.visible, (newVal) => {
  if (newVal) {
    resetForm();
    productForm.proId = generateProductId();
  }
});

// 关闭弹窗
const handleClose = () => {
  resetForm();
  emit('close');
};

// 表单验证
const validateForm = (): boolean => {
  if (!productForm.proId.trim()) {
    Notify.error({
      title: '验证失败',
      content: '请输入产品编号',
      time: 3000
    });
    return false;
  }

  if (!productForm.name.trim()) {
    Notify.error({
      title: '验证失败',
      content: '请输入产品名称',
      time: 3000
    });
    return false;
  }

  if (productForm.purchaseprice && productForm.price) {
    const cost = parseFloat(productForm.purchaseprice);
    const sellPrice = parseFloat(productForm.price);
    if (cost > sellPrice) {
      Notify.error({
        title: '价格提醒',
        content: '成本价高于参考售价，请检查价格设置',
        time: 4000
      });
    }
  }

  return true;
};

// 提交保存
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    // 这里调用新增产品API
    const response = await http.post('/product/addProduct', {
      ...productForm,
      // 如果有上传的图片数据，使用 base64 数据，否则使用输入的 URL
      pictureaddress: uploadedImageData.value || productForm.pictureaddress,
      createtime: new Date().toISOString(),
      uname: '当前用户' // 这里应该从用户状态获取
    });

    if (response && (response.status === 200 || (response as any).code === 200)) {
      Notify.success({
        title: '新增成功',
        content: `产品 "${productForm.name}" 已成功添加`,
        time: 3000
      });

      emit('success', { ...productForm });
      handleClose();
    } else {
      throw new Error('新增产品失败');
    }
  } catch (error) {
    console.error('新增产品失败:', error);
    Notify.error({
      title: '新增失败',
      content: error instanceof Error ? error.message : '新增产品失败，请稍后重试',
      time: 3000
    });
  }
};

// 保存并继续新增
const handleSaveAndContinue = async () => {
  if (!validateForm()) return;

  try {
    // 先保存当前产品
    const response = await http.post('/product/addProduct', {
      ...productForm,
      // 如果有上传的图片数据，使用 base64 数据，否则使用输入的 URL
      pictureaddress: uploadedImageData.value || productForm.pictureaddress,
      createtime: new Date().toISOString(),
      uname: '当前用户'
    });

    if (response && (response.status === 200 || (response as any).code === 200)) {
      Notify.success({
        title: '新增成功',
        content: `产品 "${productForm.name}" 已成功添加，继续新增下一个产品`,
        time: 3000
      });

      emit('success', { ...productForm });

      // 重置表单并生成新的产品编号
      resetForm();
      productForm.proId = generateProductId();
    } else {
      throw new Error('新增产品失败');
    }
  } catch (error) {
    console.error('新增产品失败:', error);
    Notify.error({
      title: '新增失败',
      content: error instanceof Error ? error.message : '新增产品失败，请稍后重试',
      time: 3000
    });
  }
};

// 获取主分类数据
const fetchMainCategories = async () => {
  try {
    const response = await categoryApi.getMainCategories();
    mainCategories.value = response;
  } catch (error) {
    console.error('获取主分类失败:', error);
    Notify.error({
      title: '错误',
      content: '获取产品分类失败',
      time: 3000
    });
  }
};

// 获取子分类数据
const fetchSubCategories = async (parentId: string) => {
  try {
    const response = await categoryApi.getSubCategories(parentId);
    if (response.data) {
      // 保持分组结构用于显示
      subCategoryGroups.value = response.data;

      // 提取所有子分类用于选择验证
      const allSubCategories: ProductCategory[] = [];
      response.data.forEach((item: any) => {
        if (Array.isArray(item.productItems)) {
          allSubCategories.push(...item.productItems);
        }
      });
      subCategories.value = allSubCategories;
    }
  } catch (error) {
    console.error('获取子分类失败:', error);
    subCategories.value = [];
    subCategoryGroups.value = [];
  }
};

// 主分类变化处理
const onMainCategoryChange = async () => {
  productForm.subCategoryId = ''; // 重置子分类选择
  subCategories.value = []; // 清空子分类列表
  subCategoryGroups.value =[]; // 清空分组数据

  if (productForm.mainCategoryId) {
    await fetchSubCategories(productForm.mainCategoryId);
  }
};

// 触发文件选择
const triggerFileUpload = () => {
  fileInputRef.value?.click();
};

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  console.log('选择的文件:', {
    name: file.name,
    type: file.type,
    size: file.size
  });

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    Notify.error({
      title: '文件类型错误',
      content: '请选择图片文件',
      time: 3000
    });
    return;
  }

  // 验证文件大小 (限制为5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    Notify.error({
      title: '文件过大',
      content: '图片大小不能超过5MB',
      time: 3000
    });
    return;
  }

  try {
    // 使用 FileReader 读取文件并转换为 base64 或 blob URL
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // 将 base64 数据存储到单独变量中
        uploadedImageData.value = result;
        // 设置一个简单的预览标识，不显示 base64 数据
        productForm.pictureaddress = '已选择图片';

        Notify.success({
          title: '图片选择成功',
          content: '图片已选择，可以预览',
          time: 2000
        });

        console.log('图片已加载到预览区域');
      }
    };

    reader.onerror = () => {
      Notify.error({
        title: '图片读取失败',
        content: '无法读取选择的图片文件',
        time: 3000
      });
    };

    // 读取为 Data URL (base64)
    reader.readAsDataURL(file);

  } catch (error) {
    console.error('图片处理失败:', error);
    Notify.error({
      title: '图片处理失败',
      content: '处理图片时发生错误',
      time: 3000
    });
  } finally {
    // 清空文件输入框
    if (target) {
      target.value = '';
    }
  }
};

// 图片加载错误处理
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'https://via.placeholder.com/150x150?text=图片加载失败';
  target.alt = '图片加载失败';
};

// 组件挂载时获取分类数据
onMounted(async () => {
  await fetchMainCategories();
});
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
  width: 95%;
  max-width: 900px;
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
    margin-left: 110px !important; // 调整这个值，原来可能是更大的值
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

// 产品分类选择器样式
:deep(.category-group-header) {
  font-weight: bold;
  background-color: #f5f5f5 !important;
  color: #666 !important;
}

:deep(.category-sub-item) {
  padding-left: 20px;
  color: #333;

  &:hover {
    background-color: #e6f7ff;
  }
}

// 针对整个产品类别行的样式调整
:deep(.category-form-item) {
  // 重置整个表单项的布局
  display: flex !important;
  align-items: center;

  .layui-form-label {
    width: 100px;
    margin-right: 10px;
    flex-shrink: 0;
  }

  .layui-input-wrapper {
    margin-left: 0 !important;
    flex: 1;

    >div {
      display: flex;
      gap: 8px;

      .layui-select {
        flex: 1;
        min-width: 150px;
      }
    }
  }
}

// 自定义表单项样式
.custom-form-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex: 1;

  .form-label {
    width: 100px;
    margin-right: 10px;
    font-weight: 500;
    color: #333;
    flex-shrink: 0;
    text-align: right;
    padding-right: 8px;
  }

  .layui-input,
  .layui-select {
    flex: 1;
  }

  // 产品类别特殊处理
  &.category-item {
    >div:last-child {
      flex: 1;
    }
  }

  // 全宽度项目（如图片上传）
  &.full-width {
    flex: none;
    width: 100%;
  }
}

// 表单行样式
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
}

// 图片上传容器样式
.image-upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

// 图片上传区域样式
.image-upload-area {
  width: 120px;
  height: 120px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor:pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: #fafafa;

  &:hover {
    border-color: #1890ff;
    background-color: #f0f8ff;
  }
}

// 图片占位符样式
.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;

  .plus-icon {
    font-size: 32px;
    color: #999;
    font-weight: 300;
    line-height: 1;
  }
}

// 图片预览容器样式
.image-preview-container {
  width: 100%;
  height: 100%;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 6px;
    color: white;

    .layui-icon {
      font-size: 20px;
      margin-bottom: 4px;
    }

    span {
      font-size: 12px;
    }
  }

  &:hover .image-overlay {
    opacity: 1;
  }
}

// 上传提示文本样式
.upload-tip {
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 4px;
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
      margin-left: 90px !important; // 调整移动端的左边距
    }
  }
}
</style>
