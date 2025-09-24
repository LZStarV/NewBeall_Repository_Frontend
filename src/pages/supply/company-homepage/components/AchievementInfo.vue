<template>
  <div class="achievementInfoPage">
    <h4>企业工程业绩</h4>
    <div class="performance">
      <div
        class="performanceItem"
        v-for="(item, index) in performanceList"
        :key="index"
      >
        <ImageUpload v-model="item.img" :size="100" alt="业绩图片" />

        <div class="text">
          <lay-textarea
            v-model="item.text"
            placeholder="请上传公司业绩相关照片, 并进行简单介绍, 字数不超过90字"
            show-count
            :maxlength="90"
            :autosize="{ minHeight: 100, maxHeight: 100 }"
          >
          </lay-textarea>
        </div>
        <div class="btn">
          <lay-button v-if="!item.text" type="primary">保存上传</lay-button>
          <lay-button v-else type="primary">删除上传</lay-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 图片预览组件 -->
</template>
<script setup lang="ts">
import type { CompanyDetailResponseData } from '@/api/company/companyApi.type';
import { layer } from '@layui/layui-vue';
import { ref, watch } from 'vue';
import ImageUpload from '@/components/ImageUpload.vue';

// 定义参数
interface Props {
  companyData: CompanyDetailResponseData;
}
const props = withDefaults(defineProps<Props>(), {
  companyData: undefined,
});

const emits = defineEmits(['dataUpdated']);

interface Performance {
  img: string;
  text: string;
}
// 页面数据
const performanceList = ref<Performance[]>([]);

// 图片前缀由 ImageUpload 组件内部处理

// 占位：后续若有交互事件可在此扩展

// 安全解析JSON字符串
const parsePerformance = (jsonString: string): Performance => {
  try {
    return jsonString ? JSON.parse(jsonString) : { img: '', text: '' };
  } catch {
    return { img: '', text: '' };
  }
};

// 初始化数据
const initData = async (companyData?: CompanyDetailResponseData) => {
  try {
    if (companyData?.company) {
      const { company } = companyData;
      performanceList.value = [
        parsePerformance(company.performance01),
        parsePerformance(company.performance02),
        parsePerformance(company.performance03),
        parsePerformance(company.performance04),
      ];
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
.performance {
  @include flex(column, flex-start, center);
  margin: 20px 40px;
  gap: 15px;
  .performanceItem {
    @include flex(row, space-between, flex-start);
    width: 100%;
    gap: 20px;
    border-radius: 12px;
    background-color: color-mix(
      in srgb,
      var(--global-primary-color),
      transparent 95%
    );
    padding: 20px 20px 0;
    .upload {
      @include flex-center();
      width: 100px;
      height: 100px;
      background-color: #ffffff;
      border-radius: 12px;
      color: var(--global-primary-color);
    }
    .text {
      flex: 1;
    }
    .btn {
      height: 100px;
      @include flex(column, flex-end, center);
    }
  }
}

:deep(.layui-textarea) {
  color: #555;
  border-radius: 12px;
  padding: 10px;
  &:focus {
    border-color: var(--global-primary-color) !important;
  }
}
:deep(.layui-texterea-count) {
  color: #999;
}
</style>
