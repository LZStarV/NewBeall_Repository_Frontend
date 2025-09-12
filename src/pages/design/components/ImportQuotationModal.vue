<template>
  <ModalWindow :visible="visible" title="批量导入报价单信息" :btn="[
    { text: '开始导入', callback: handleConfirm },
    { text: '取消', callback: handleCancel },
  ]" :area="['800px', '500px']" :is-teleport="true" @close="handleCancel">
    <div class="import-modal-content">
      <div class="tips">
        <div class="tips-left">请选择xls和xlsx文件</div>
        <div class="tips-right">
          <p>请以此模板为原型</p>
          <lay-button type="primary">点我下载</lay-button>
        </div>
      </div>

      <div class="import-content">
        <div class="import-head">
          当前导入报价单中的产品 若已存在自建库，您可选择产品价格导入方式：
          <lay-select v-model="importMethod" placeholder="请选择">
            <lay-select-option :value="0" label="第一方式"></lay-select-option>
            <lay-select-option :value="1" label="第二方式"></lay-select-option>
            <lay-select-option :value="2" label="第三方式"></lay-select-option>
          </lay-select>
        </div>
        <div class="method-tips">
          <p>第一方式：选择报价单产品价格，不同时修改自建库产品</p>
          <p>第二方式：选择报价单产品价格，同步修改自建库产品</p>
          <p>第三方式：报价单产品导入自建库（非临时产品）并进行AI填充出来</p>
          <p>ps：报价单中产品的图片请设置为悬浮图片</p>
          <p>ps：导入的报价单默认为市场指导价，修改的价格为市场指导价和成本价(价格与数量都四舍五入到小数点后两位)</p>
        </div>
      </div>



      <div v-if="selectedFile" class="file-preview">
        <div class="name">{{ selectedFile.name }}</div>
        <div class="size">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</div>
        <div class="status" :class="{ ok: valid, err: !valid }">
          {{ valid ? '校验通过' : invalidReason }}
        </div>
      </div>
    </div>
  </ModalWindow>

</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import ModalWindow from '@/components/ModalWindow.vue';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void;
  (e: 'confirm', file: File): void;
}>();

// 导入方式
const importMethod = ref(0);

const uploadRef = ref();
const selectedFile = ref<File | null>(null);

watch(
  () => props.visible,
  (v) => {
    if (!v) {
      selectedFile.value = null;
    }
  },
);

const MAX_SIZE = 20 * 1024 * 1024; // 20MB
const valid = computed(() => {
  if (!selectedFile.value) return false;
  const name = selectedFile.value.name.toLowerCase();
  const isExcel = name.endsWith('.xlsx') || name.endsWith('.xls');
  const sizeOk = selectedFile.value.size <= MAX_SIZE;
  return isExcel && sizeOk;
});

const invalidReason = computed(() => {
  if (!selectedFile.value) return '未选择文件';
  const name = selectedFile.value.name.toLowerCase();
  if (!(name.endsWith('.xlsx') || name.endsWith('.xls'))) return '仅支持 .xlsx/.xls 文件';
  if (selectedFile.value.size > MAX_SIZE) return '文件大小超过 20MB';
  return '文件不符合要求';
});

const onFileChange = (files: File[]) => {
  selectedFile.value = files?.[0] ?? null;
};

const handleConfirm = () => {
  if (!selectedFile.value || !valid.value) return;
  emit('confirm', selectedFile.value);
  emit('update:visible', false);
};

const handleCancel = () => {
  emit('update:visible', false);
};
</script>

<style scoped lang="scss">
.import-modal-content {
  padding: 18px;

  .tips {
    margin-bottom: 12px;
    color: #333;
    font-weight: 500;
    display: flex;
    justify-content: space-between;

    .tips-left {
      display: flex;
      align-items: center;
    }

    .tips-right {
      display: flex;
      align-items: center;
      gap: 10px;

      p {
        margin: 0;
      }

      lay-button {
        margin: 0;
      }
    }
  }


  .import-content {
    margin-bottom: 12px;
    color: #333;
    font-size: 14px;
    line-height: 1.2;

    .import-head {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      :deep(.layui-select) {
        width: 200px;
      }
    }

    .method-tips {
      margin-bottom: 12px;
      color: #ef5757;
    }
  }

  .file-preview {
    margin-top: 14px;
    display: flex;
    gap: 10px;
    align-items: center;

    .name {
      max-width: 260px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .size {
      color: #666;
    }

    .status {
      margin-left: auto;
    }

    .ok {
      color: #16baaa;
    }

    .err {
      color: #ff5722;
    }
  }
}
</style>
