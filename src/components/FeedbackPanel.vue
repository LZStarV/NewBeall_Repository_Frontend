<template>
  <!-- 使用lay-layer组件作为模板调用 -->
  <lay-layer v-model="visible" :shade="true" :area="modalArea" :btn="actionBtns" title="提交建议给壹新">
    <div style="padding: 20px;">
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px;">建议内容 (5-200字):</label>
        <textarea v-model="feedbackContent" :class="{ 'input-error': feedbackError }" placeholder="请输入建议内容，5到200字"
          @input="validateFeedback" style="
            width: 100%;
            padding: 10px;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
            min-height: 100px;
            resize: vertical;
            font-size: 14px;
            box-sizing: border-box;
          "></textarea>
        <p v-if="feedbackError" style="color: #ff5722; margin-top: 4px; font-size: 12px;">{{ feedbackError }}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px;">联系电话:</label>
        <input v-model="phoneNumber" type="tel" :class="{ 'input-error': phoneError }" placeholder="输入联系电话"
          @input="validatePhone" style="
            width: 100%;
            padding: 10px;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
          " />
        <p v-if="phoneError" style="color: #ff5722; margin-top: 4px; font-size: 12px;">{{ phoneError }}</p>
      </div>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { submitFeedback } from '@/api/chat/chatApi';
import notify from '@/utils/notify';
import { debounce } from '@/utils/debounce';
import env from '@/utils/env';

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

// 绑定到lay-layer的visible属性
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// 获取当前屏幕宽度
const getScreenWidth = () => {
  return window.innerWidth;
};

// 根据屏幕宽度设置弹窗大小
const getModalSize = () => {
  const screenWidth = getScreenWidth();
  if (screenWidth < env.getPadLayoutBreakpoint()) {
    // 移动端 - 宽度90%
    return ['90%', 'auto'];
  } else if (screenWidth < env.getDesktopLayoutBreakpoint()) {
    // 平板端 - 宽度70%
    return ['70%', 'auto'];
  } else {
    // 桌面端 - 固定宽度500px
    return ['500px', 'auto'];
  }
};

// 响应式弹窗大小
const modalArea = ref(getModalSize());

// 监听窗口大小变化，更新弹窗大小
const handleResize = debounce(() => {
  modalArea.value = getModalSize();
}, 200);

// 组件挂载时添加窗口大小变化监听
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

// 组件卸载时移除窗口大小变化监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 定义弹窗按钮
const actionBtns = ref([
  {
    text: "取消",
    callback: () => {
      handleClose();
    }
  },
  {
    text: "提交",
    callback: () => {
      handleSubmit();
    }
  }
]);

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
      console.log(feedbackContent.value + phoneNumber.value);
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

// 监听visible变化，当组件显示时重置表单
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
  }
);
</script>

<style scoped>
/* 错误输入样式 */
.input-error {
  border-color: #ff5722 !important;
}
</style>
