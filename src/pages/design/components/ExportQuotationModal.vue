<template>
  <ModalWindow
    :visible="visible"
    title="导出报价单"
    :btn="[
      {
        text: '确认导出',
        callback: handleConfirm,
      },
      {
        text: '取消',
        callback: handleCancel,
      },
    ]"
    :maxmin="false"
    :resize="false"
    :area="['400px', '320px']"
    @close="handleCancel"
  >
    <div class="export-modal-content">
      <div class="export-message">您是否要导出此报价单</div>
      <div class="export-options">
        <div class="option-item">
          <lay-checkbox
            skin="primary"
            v-model="localExportOptions.derivePrime"
            value="derivePrime"
            size="lg"
          >
            同时导出成本价
          </lay-checkbox>
        </div>
        <div class="option-item">
          <lay-checkbox
            skin="primary"
            v-model="localExportOptions.isExplanation"
            value="isExplanation"
            size="lg"
          >
            导出报价说明
          </lay-checkbox>
        </div>
        <div class="option-item">
          <lay-checkbox
            skin="primary"
            v-model="localExportOptions.isSeal"
            value="isSeal"
            size="lg"
          >
            加盖印章
          </lay-checkbox>
        </div>
      </div>
    </div>
  </ModalWindow>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ModalWindow from '@/components/ModalWindow.vue';

// 定义 props
const props = defineProps<{
  visible: boolean;
  exportOptions: {
    derivePrime: boolean;
    isExplanation: boolean;
    isSeal: boolean;
  };
}>();

// 定义 emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', options: typeof props.exportOptions): void;
}>();

// 本地状态，用于 v-model
const localExportOptions = ref({ ...props.exportOptions });

// 监听 props.exportOptions 的变化，更新本地状态
watch(
  () => props.exportOptions,
  (newVal) => {
    localExportOptions.value = { ...newVal };
  },
  { deep: true },
);

const handleConfirm = () => {
  emit('confirm', localExportOptions.value);
  emit('update:visible', false);
};

const handleCancel = () => {
  emit('update:visible', false);
};
</script>

<style scoped lang="scss">
.export-modal-content {
  padding: 20px;

  .export-message {
    font-size: 18px;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
  }

  .export-options {
    .option-item {
      margin-bottom: 15px;
    }
  }
}
</style>
