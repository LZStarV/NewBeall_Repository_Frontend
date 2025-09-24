<template>
  <div class="attachmentInfoPage">
    <h4>企业宣传资料</h4>
    <div class="attachment">
    </div>
  </div>
  <!-- 图片预览组件 -->
</template>
<script setup lang="ts">
import type { CompanyDetailResponseData } from '@/api/company/companyApi.type';
import { layer } from '@layui/layui-vue';
import { ref, watch } from 'vue';

// 定义参数
interface Props {
  companyData: CompanyDetailResponseData;
}
const props = withDefaults(defineProps<Props>(), {
  companyData: undefined,
});

const emits = defineEmits(['dataUpdated']);


// 初始化数据
const initData = async (companyData?: CompanyDetailResponseData) => {
  try {
    if(companyData?.company) {

    }
  } catch (error) {
    console.error('初始化数据失败:', error);
    layer.msg('数据加载失败', { icon: 2 });
  }
};

// 监听props变化, 更新数据
watch(
  () => props.companyData,
  async (newData) => {
    await initData(newData);
  },
  { immediate: true, deep: true },
);
</script>

<style lang="scss" scoped>
h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  border-left: 3px solid var(--global-primary-color);
  padding-left: 15px;
}
</style>
