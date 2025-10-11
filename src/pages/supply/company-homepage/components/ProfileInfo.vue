<template>
  <div class="profileInfoPage">
    <h4>企业简介</h4>
    <div class="profile">
      <lay-textarea
        v-model="profileData"
        placeholder="请输入企业简介"
        show-count
        :maxlength="1000"
        :autosize="{ minHeight: 500, maxHeight: 500 }"
      />
    </div>
    <div class="savebtn">
      <lay-button type="normal" :loading="saving" @click="handleSave"
        >
保存
</lay-button
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import companyApi from '@/api/company/companyApi';
import type { CompanyDetailResponseData } from '@/api/company/companyApi.type';
import { layer } from '@layui/layui-vue';
import { ref, watch } from 'vue';

// 定义参数
interface Props {
  companyData?: CompanyDetailResponseData;
}

const props = withDefaults(defineProps<Props>(), {
  companyData: undefined,
});

const emits = defineEmits(['dataUpdated']);

// 页面数据
const profileData = ref('');
const saving = ref(false);

const handleSave = async () => {
  try {
    saving.value = true;
    await companyApi.updateProfileOrWorkarea(profileData.value);
    layer.msg('保存成功', { icon: 1 });
    emits('dataUpdated');
  } catch (error) {
    layer.msg('保存失败', { icon: 2 });
  } finally {
    saving.value = false;
  }
};
// 初始化数据
const initData = async (companyData?: CompanyDetailResponseData) => {
  try {
    if (companyData?.company) {
      profileData.value = companyData.company.profile || '';
    }
  } catch (error) {
    console.error('初始化数据失败:', error);
    layer.msg('数据加载失败', { icon: 2 });
  }
};

// 监听 props 变化，更新数据
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
.profileInfoPage {
  .profile {
    padding: 20px 40px;
  }
  .savebtn {
    text-align: end;
    padding: 30px;
  }
}
:deep(.layui-textarea) {
  color: #555;
  padding: 20px;
  border-radius: 12px;
  background-color: color-mix(
    in srgb,
    var(--global-primary-color),
    transparent 90%
  );
  &:hover {
    border-color: var(--global-primary-color) !important;
  }
}
:deep(.layui-texterea-count) {
  color: #999;
}
</style>
