<template>
  <lay-layer
    v-model="dialogVisible"
    title="预设产品利率"
    :shade="true"
    @close="handleClose"
  >
    <div class="interest-rate-dialog">
      <div class="form-content">
        <!-- 产品利率输入 -->
        <div class="form-row">
          <label class="form-label">产品利率 (%)</label>
          <lay-input
            v-model="interestRate"
            type="number"
            placeholder="请输入0-100之间的数值"
            :disabled="useDefaultPrice"
            :min="0"
            :max="100"
            @input="handleInterestRateInput"
          >
            <template #suffix> % </template>
          </lay-input>
        </div>

        <!-- 分隔线 -->
        <div class="divider">
          <span class="divider-text">或</span>
        </div>

        <!-- 默认市场指导价选项 -->
        <div class="form-row">
          <lay-checkbox
            v-model="useDefaultPrice"
            value="default"
            skin="primary"
            size="lg"
            @change="handleDefaultPriceChange"
          >
            使用默认市场指导价
          </lay-checkbox>
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>

      <!-- 按钮区域 -->
      <div class="dialog-footer">
        <lay-button @click="handleClose">取消</lay-button>
        <lay-button type="primary" @click="handleConfirm" :disabled="!isValid">
          确认
        </lay-button>
      </div>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  visible: boolean;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (
    e: 'confirm',
    data: { interestRate?: number; useDefaultPrice: boolean },
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 使用计算属性来处理visible的双向绑定
const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

// 响应式数据
const interestRate = ref<number | undefined>(undefined);
const useDefaultPrice = ref(false);
const errorMessage = ref('');

// 计算属性
const isValid = computed(() => {
  if (useDefaultPrice.value) {
    return true;
  }
  if (interestRate.value === undefined || interestRate.value === null) {
    return false;
  }
  return interestRate.value >= 0 && interestRate.value <= 100;
});

// 监听visible变化
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      // 重置表单
      resetForm();
    }
  },
);

// 处理利率输入
const handleInterestRateInput = (value: string) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    interestRate.value = undefined;
  } else {
    interestRate.value = Math.min(100, Math.max(0, numValue));
  }
  validateForm();
};

// 处理默认价格选项变化
const handleDefaultPriceChange = (checked: boolean) => {
  useDefaultPrice.value = checked;
  if (checked) {
    interestRate.value = undefined;
  }
  validateForm();
};

// 验证表单
const validateForm = () => {
  errorMessage.value = '';

  if (useDefaultPrice.value) {
    return;
  }

  if (interestRate.value === undefined || interestRate.value === null) {
    errorMessage.value = '请输入产品利率';
    return;
  }

  if (interestRate.value < 0 || interestRate.value > 100) {
    errorMessage.value = '产品利率必须在0-100%之间';
    return;
  }
};

// 重置表单
const resetForm = () => {
  interestRate.value = undefined;
  useDefaultPrice.value = false;
  errorMessage.value = '';
};

// 处理关闭
const handleClose = () => {
  dialogVisible.value = false;
};

// 处理确认
const handleConfirm = () => {
  if (!isValid.value) {
    validateForm();
    return;
  }

  const data = {
    interestRate: useDefaultPrice.value ? undefined : interestRate.value,
    useDefaultPrice: useDefaultPrice.value,
  };

  console.log('产品利率弹窗确认:', data);
  emit('confirm', data);
  dialogVisible.value = false;
};
</script>

<style scoped lang="scss">
.interest-rate-dialog {
  width: 500px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .form-content {
    flex: 1;

    .form-row {
      margin-bottom: 20px;

      .form-label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #333;
      }
    }

    .divider {
      position: relative;
      text-align: center;
      margin: 20px 0;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background-color: #e4e7ed;
      }

      .divider-text {
        background-color: #fff;
        padding: 0 15px;
        color: #909399;
        font-size: 12px;
      }
    }

    .error-message {
      color: #f56c6c;
      font-size: 12px;
      margin-top: 8px;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;
  }
}
</style>
