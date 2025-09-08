<template>
  <ModalWindow
    :visible="visible"
    title="删除确认"
    :btn="[
      {
        text: '确认删除',
        style: 'background-color: #ff4d4f; border-color: #ff4d4f;',
        disabled: !isDeleteButtonEnabled,
        callback: handleConfirm,
      },
      {
        text: '取消',
        callback: handleCancel,
      },
    ]"
    :maxmin="false"
    :resize="false"
    :area="['400px', '350px']"
    @close="handleCancel"
  >
    <div class="delete-confirm-content">
      <div class="warning-text">
        正在删除报价 "<span class="project-name-red">{{ itemName }}</span
        >"
      </div>
      <div class="warning-info">报价删除后，报价内容无法恢复，请谨慎操作！</div>
      <div class="confirm-input-section">
        <label>请输入 "DELETE" 确认删除：</label>
        <lay-input
          v-model="deleteConfirmInput"
          placeholder="请输入 DELETE"
          class="confirm-input"
        />
      </div>
    </div>
  </ModalWindow>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ModalWindow from '@/components/ModalWindow.vue';

// 定义 props
defineProps<{
  visible: boolean;
  itemName: string | undefined;
}>();

// 定义 emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm'): void;
}>();

const deleteConfirmInput = ref('');

const isDeleteButtonEnabled = computed(() => {
  return deleteConfirmInput.value === 'DELETE';
});

const handleConfirm = () => {
  if (isDeleteButtonEnabled.value) {
    emit('confirm');
    emit('update:visible', false);
    deleteConfirmInput.value = ''; // Reset after confirm
  }
};

const handleCancel = () => {
  emit('update:visible', false);
  deleteConfirmInput.value = ''; // Reset on cancel
};
</script>

<style scoped lang="scss">
// 删除确认弹窗样式
.delete-confirm-content {
  padding: 20px;

  .warning-text {
    font-size: 16px;
    margin-bottom: 15px;
    color: #333;

    .project-name-red {
      color: #ff4d4f;
      font-weight: bold;
    }
  }

  .warning-info {
    background-color: #fff2f0;
    border: 1px solid #ffccc7;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 20px;
    color: #cf1322;
    font-size: 14px;
  }

  .confirm-input-section {
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .confirm-input {
      width: 100%;
    }
  }
}
</style>
