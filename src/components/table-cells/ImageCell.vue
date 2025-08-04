<template>
  <div class="image-cell">
    <lay-avatar
      v-if="imageUrl"
      :src="imageUrl"
      shape="square"
      @click="handlePreview"
    />
    <div v-else class="no-image">
      <lay-icon type="layui-icon-picture" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { layer } from '@layui/layui-vue';
import { computed } from 'vue';

interface Props {
  data: Record<string, unknown>;
  index: number;
  column: {
    key: string;
    [key: string]: unknown;
  };
  previewable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 32,
  previewable: true,
});

const imageUrl = computed(() => {
  const value = props.column.key
    .split('.')
    .reduce((obj: unknown, k: string) => {
      return obj && typeof obj === 'object' && k in obj
        ? (obj as Record<string, unknown>)[k]
        : undefined;
    }, props.data);
  return String(value || '');
});

const handlePreview = () => {
  if (props.previewable && imageUrl.value) {
    // 使用 layui 的 layer.photos 功能预览图片
    layer.photos({
      imgList: [
        {
          src: imageUrl.value,
          alt: '图片预览',
        },
      ],
    });
  }
};
</script>

<style scoped lang="scss">
.image-cell {
  display: flex;
  align-items: center;
  justify-content: center;

  .no-image {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $border-color-extra-light;
    border-radius: $border-radius-small;
    color: $text-secondary;
  }

  :deep(.layui-avatar) {
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
