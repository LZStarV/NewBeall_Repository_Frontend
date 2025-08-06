<template>
  <div v-if="visible" class="feedback-panel-overlay" @click.self="handleClose">
    <div class="feedback-panel">
      <h3>提交建议给壹新</h3>
      <div class="form-group">
        <label for="feedbackContent">建议内容 (5-200字):</label>
        <textarea
          id="feedbackContent"
          v-model="feedbackContent"
          :class="{ 'input-error': feedbackError }"
          placeholder="请输入您的建议"
          @input="validateFeedback"
        ></textarea>
        <p v-if="feedbackError" class="error-message">{{ feedbackError }}</p>
      </div>
      <div class="form-group">
        <label for="phoneNumber">电话号码:</label>
        <input
          id="phoneNumber"
          v-model="phoneNumber"
          type="tel"
          :class="{ 'input-error': phoneError }"
          placeholder="请输入您的手机号码"
          @input="validatePhone"
        />
        <p v-if="phoneError" class="error-message">{{ phoneError }}</p>
      </div>
      <div class="panel-actions">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button
          class="submit-btn"
          :disabled="
            !feedbackContent ||
            !phoneNumber ||
            feedbackError.length > 0 ||
            phoneError.length > 0
          "
          @click="handleSubmit"
        >
          提交
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { submitFeedback } from '@/api/chat/chatApi';
import notify from '@/utils/notify';

// Props
interface Props {
  visible: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>();

// 响应式数据
const feedbackContent = ref('');
const phoneNumber = ref('');
const feedbackError = ref('');
const phoneError = ref('');

// 验证建议内容
const validateFeedback = () => {
  if (feedbackContent.value.length < 5 || feedbackContent.value.length > 200) {
    feedbackError.value = '建议内容长度需在5-200字之间';
    return false;
  }
  feedbackError.value = '';
  return true;
};

// 验证手机号码
const validatePhone = () => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phoneNumber.value)) {
    phoneError.value = '请输入正确的11位手机号码';
    return false;
  }
  phoneError.value = '';
  return true;
};

// 处理提交
const handleSubmit = async () => {
  const isFeedbackValid = validateFeedback();
  const isPhoneValid = validatePhone();

  if (isFeedbackValid && isPhoneValid) {
    try {
      await submitFeedback(feedbackContent.value, phoneNumber.value);
      notify.success('意见提交成功！感谢您的宝贵建议。');
      handleClose();
    } catch (error) {
      console.error('提交意见失败:', error);
      notify.error('提交意见失败，请稍后再试。');
    }
  }
};

// 处理关闭
const handleClose = () => {
  emit('update:visible', false);
  // 清空表单数据
  feedbackContent.value = '';
  phoneNumber.value = '';
  feedbackError.value = '';
  phoneError.value = '';
};

// 监听 visible 变化，当组件显示时重置表单
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      // 组件显示时重置表单
      feedbackContent.value = '';
      phoneNumber.value = '';
      feedbackError.value = '';
      phoneError.value = '';
    }
  },
);
</script>

<style scoped lang="scss">
@use 'sass:color';

/* 意见反馈面板样式 */
.feedback-panel-overlay {
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

.feedback-panel {
  background-color: white;
  padding: 2rem;
  border-radius: $border-radius-large;
  box-shadow: $box-shadow-base;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: $font-size-large;
    color: $text-primary;
    text-align: center;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: $font-size-base;
      color: $text-regular;
    }

    textarea,
    input[type='tel'] {
      padding: 0.75rem;
      border: 1px solid $border-color-base;
      border-radius: $border-radius-base;
      font-size: $font-size-base;
      resize: vertical;
      min-height: 20px;

      &:focus {
        outline: none;
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
      }

      &.input-error {
        border-color: $danger-color;
      }
    }

    .error-message {
      color: $danger-color;
      font-size: $font-size-small;
      margin-top: 0.25rem;
      margin-bottom: 0;
    }
  }

  .panel-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;

    button {
      padding: 0.5rem 1.5rem;
      border-radius: $border-radius-middle;
      cursor: pointer;
      font-size: $font-size-base;
      transition: background-color 0.2s ease;

      &.cancel-btn {
        background-color: #e0e0e0;
        color: #333;
        border: none;

        &:hover {
          background-color: #c0c0c0;
        }
      }

      &.submit-btn {
        background-color: $primary-color;
        color: white;
        border: none;

        &:hover {
          background-color: color.adjust($primary-color, $lightness: -5%);
        }

        &:disabled {
          background-color: #cbd5e1;
          cursor: not-allowed;
        }
      }
    }
  }
}

/* 移动端样式调整 */
@media (max-width: 768px) {
  .feedback-panel {
    width: 95%;
    padding: 1.5rem;
  }
}
</style>
