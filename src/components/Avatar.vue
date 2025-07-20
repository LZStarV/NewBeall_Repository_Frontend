<!-- 封装lay-avatar -->
<template>
  <lay-avatar
    :src="prefix + url"
    :alt="alt"
    :fallback="defaultImgUrl"
    :radius="radius"
    :style="{ width: size, height: size }"
  />
</template>

<script setup lang="ts">
import env from '@/utils/env';
import { ref, watch } from 'vue';

// 默认头像链接
const defaultImgUrl = env.getApiBaseUrl() + '/static/img/images/newbeall.png';

const avatarUrl = ref(defaultImgUrl);

const {
  url = '',
  size = '2rem',
  prefix = 'https://yx.newbeall.com/softLink/',
  alt = '头像',
  radius = true,
} = defineProps<{
  url?: string; // 头像url
  size?: string; // 头像尺寸，可写px、rem、em
  prefix?: string; // 头像url前缀
  alt?: string; // 头像文本描述
  radius?: boolean; // 是否圆形
}>();

watch(
  () => url,
  (newVal) => {
    if (newVal.length > 0) avatarUrl.value = prefix + url;
    else avatarUrl.value = defaultImgUrl;
  },
);
</script>
