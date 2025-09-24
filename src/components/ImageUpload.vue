<template>
  <div class="nb-image-upload">
    <lay-upload
      ref="uploadRef"
      :auto="false"
      :accept-mime="acceptMime"
      :field="field"
      :multiple="false"
      :drag="false"
      @on-change="onFileChange"
    >
      <template #default>
        <div
          class="placeholder"
          :style="{
            width: `${size}px`,
            height: `${size}px`,
          }"
        >
          <template v-if="!imgUrl">
            <lay-icon type="layui-icon-addition" size="32px"></lay-icon>
          </template>
          <template v-else>
            <img :src="imgUrl" :alt="alt" @click.stop="preview" />
          </template>
        </div>
      </template>
    </lay-upload>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { layer } from '@layui/layui-vue';
import env from '@/utils/env';
import companyApi from '@/api/company/companyApi';

interface Props {
  modelValue?: string; // 仅存储后端返回的相对路径，如 /upload/xxx.jpg
  moduleName?: string; // 可选：后端需要的模块名
  size?: number; // 正方形边长
  alt?: string;
  acceptMime?: string; // 默认图片
  field?: string; // 后端文件字段名
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  moduleName: undefined,
  size: 100,
  alt: 'image',
  acceptMime: 'image/png, image/jpeg',
  field: 'file',
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'uploaded', v: string): void; // 返回后端存储的相对路径
}>();

const baseUrl = env.getBaseStaticUrl();
const uploadRef = ref();

const innerPath = ref<string>(props.modelValue || '');
const imgUrl = computed(() =>
  innerPath.value ? `${baseUrl}${innerPath.value}` : '',
);

watch(
  () => props.modelValue,
  (v) => {
    if (v !== innerPath.value) innerPath.value = v || '';
  },
);

const onFileChange = async (files: File[]) => {
  try {
    const file = files?.[0];
    if (!file) return;
    // 直接走代理的 /api 前缀，由 http 封装自动拼接
    const res: any = await companyApi.uploadFile(file, props.moduleName);
    // 根据后端返回结构取路径，假设 res.data/path/url 三种可能
    const path = res?.data?.path || res?.data || res?.path || res?.url || '';
    if (!path) {
      layer.msg('上传成功，但未返回图片路径', { icon: 0 });
      return;
    }
    innerPath.value = path;
    emit('update:modelValue', path);
    emit('uploaded', path);
  } catch (e: any) {
    layer.msg(e?.message || '上传失败', { icon: 2 });
  }
};

const preview = () => {
  if (!imgUrl.value) return;
  layer.open({
    type: 1,
    title: false,
    shadeClose: true,
    area: ['80%', '80%'],
    content: `<div style=\"display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#000;\"><img src=\"${imgUrl.value}\" style=\"max-width:100%;max-height:100%;object-fit:contain;\"/></div>`,
  });
};
</script>

<style scoped lang="scss">
.nb-image-upload {
  display: inline-block;
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 12px;
  color: var(--global-primary-color);
  overflow: hidden;
  cursor: pointer;
}
.placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}
</style>

