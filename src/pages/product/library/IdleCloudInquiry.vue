<template>
  <!-- 闲置云询价弹窗 -->
  <RightSideModal 
    :visible="visible" 
    :title="`请输入闲置售价`" 
    :width="rightModalWidth" 
    :mask-closable="true"
    @close="handleClose"
  >
    <div class="idle-cloud-form">
      <div class="form-group">
        <label for="idlePrice">{{ selectedProduct?.name || '' }}：</label>
        <input 
          id="idlePrice" 
          v-model="formData.idlePrice" 
          type="text" 
          placeholder="请输入库存售价" 
        />
      </div>

      <!-- 备注选择开关 -->
      <div class="form-group">
        <label class="switch-label">
          <input v-model="formData.enableRemarks" type="checkbox" />
          <span class="switch-text">添加备注</span>
        </label>
      </div>

      <!-- 表格区域，根据备注开关决定是否显示 -->
      <div v-if="formData.enableRemarks" class="details-table">
        <div class="form-group">
          <label for="condition">成色：</label>
          <input 
            id="condition" 
            v-model="formData.condition" 
            type="text" 
            placeholder="请输入成色" 
          />
        </div>
        <div class="form-group">
          <label for="functionalState">功能状态：</label>
          <input 
            id="functionalState" 
            v-model="formData.functionalState" 
            type="text"
            placeholder="请输入功能状态" 
          />
        </div>
        <div class="form-group">
          <label for="equipmentDetails">设备详情：</label>
          <textarea 
            id="equipmentDetails" 
            v-model="formData.equipmentDetails"
            placeholder="请输入设备详情"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="isUnderWarranty">是否在保：</label>
          <input 
            id="isUnderWarranty" 
            v-model="formData.isUnderWarranty" 
            type="text"
            placeholder="请输入是否在保" 
          />
        </div>
        <div class="form-group">
          <label for="others">其他：</label>
          <textarea 
            id="others" 
            v-model="formData.others" 
            placeholder="请输入其他"
          ></textarea>
        </div>
      </div>
      <div class="form-actions">
        <lay-button type="primary" @click="handleSubmit">确定</lay-button>
        <lay-button @click="handleClose">取消</lay-button>
      </div>
    </div>
  </RightSideModal>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import RightSideModal from '@/components/RightSideModal.vue';
import http from '@/utils/http';
import Notify from '@/utils/notify';

// 定义组件的props
interface Props {
  visible: boolean
  selectedProduct?: any
  rightModalWidth: string
}

const props = withDefaults(defineProps<Props>(), {
  rightModalWidth: '35%'
});

// 定义组件的emits
const emit = defineEmits<{
  close: []
  submit: [data: any]
}>();

// 表单数据
const formData = reactive({
  idlePrice: '',        // 库存售价
  enableRemarks: false, // 是否添加备注
  remarks: '',          // 备注
  condition: '',        // 成色
  functionalState: '',  // 功能状态
  equipmentDetails: '', // 设备详情
  isUnderWarranty: '',  // 是否在保
  others: ''            // 其他
});

// 关闭弹窗
const handleClose = () => {
  // 重置表单数据
  formData.idlePrice = '';
  formData.enableRemarks = false;
  formData.remarks = '';
  formData.condition = '';
  formData.functionalState = '';
  formData.equipmentDetails = '';
  formData.isUnderWarranty = '';
  formData.others = '';
  
  emit('close');
};

// 提交表单
const handleSubmit = () => {
  // 验证必填字段
  if (!formData.idlePrice.trim()) {
    Notify.error({
      title: '提示',
      content: '请输入库存售价',
      time: 3000
    });
    return;
  }

  // 构建提交数据
  const submitData = {
    product: props.selectedProduct,
    formData: { ...formData }
  };

  // 发送事件给父组件
  emit('submit', submitData);
  
  // 关闭弹窗
  handleClose();
};
</script>

<style lang="scss" scoped>
// 闲置云询价弹窗样式
.idle-cloud-form {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;

  .form-group {
    margin-bottom: 16px;

    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #333;
      font-size: 14px;

      &.switch-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;

        input[type="checkbox"] {
          margin: 0;
        }

        .switch-text {
          color: #666;
          font-weight: normal;
        }
      }
    }

    input[type="text"],
    textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.2s ease;
      box-sizing: border-box;

      &:hover {
        border-color: #40a9ff;
      }

      &:focus {
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
        outline: none;
      }

      &::placeholder {
        color: #bfbfbf;
        font-size: 13px;
      }
    }

    textarea {
      min-height: 80px;
      resize: vertical;
    }
  }

  .details-table {
    margin-top: 16px;
    padding: 16px;
    background: #fafafa;
    border-radius: 6px;
    border: 1px solid #e8e8e8;

    .form-group {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e8e8e8;
  }
}
</style>
