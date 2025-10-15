<template>
  <!-- 表情选择面板 -->
  <div class="emoji-panel">
    <!-- 分类标签 -->
    <div class="emoji-categories">
      <div v-for="category in EMOJI_CATEGORIES" :key="category.id" class="category-item"
        :class="{ active: Boolean(currentCategoryId === category.id) }" @click="currentCategoryId = category.id">
        {{ category.name }}
      </div>
    </div>
    <!-- 表情网格 -->
    <div class="emoji-grid">
      <div v-for="(value, key) in currentEmojis" :key="key" class="emoji-item" @click="getEmoji(value)">
        <Avatar :prefix="currentEmojiPrefix" :url="key" :alt="value" size="1.5rem" :radius="false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EMOJI_CATEGORIES,
  EMOJI_RESOURCE_CONFIG,
  type EmojiCategory,
} from '@/utils/chat/emoji-config';
import { computed, ref } from 'vue';

const currentCategoryId = ref('default');

// 获取当前分类的表情
const currentEmojis = computed(() => {
  const category = EMOJI_CATEGORIES.find(
    (c: EmojiCategory) => c.id === currentCategoryId.value,
  );
  return category?.emojis || {};
});

// 获取当前分类的资源路径
const currentEmojiPrefix = computed(() => {
  const category = EMOJI_CATEGORIES.find(
    (c: EmojiCategory) => c.id === currentCategoryId.value,
  );
  if (category?.id === 'default') {
    return EMOJI_RESOURCE_CONFIG.DEFAULT;
  }
  return (
    EMOJI_RESOURCE_CONFIG[
    category?.id.toUpperCase() as keyof typeof EMOJI_RESOURCE_CONFIG
    ] || EMOJI_RESOURCE_CONFIG.DEFAULT
  );
});

const emit = defineEmits(['insertEmoji']);

// 获取到表情
const getEmoji = (emoji: string) => {
  emit('insertEmoji', emoji);
};
</script>

<style scoped lang="scss">
.emoji-panel {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: white;
  border: 1px solid #ededed;
  border-radius: $border-radius-large;
  width: 360px;
  max-height: 400px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;

  .emoji-categories {
    padding: 0.5rem;
    border-bottom: 1px solid #ededed;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;

    .category-item {
      padding: 0.25rem 0.75rem;
      border-radius: $border-radius-base;
      font-size: 0.875rem;
      cursor: pointer;
      color: #666;
      transition: all 0.2s;

      &:hover {
        background-color: #f5f5f5;
      }

      &.active {
        background-color: $primary-color;
        color: white;
      }
    }
  }

  .emoji-grid {
    padding: 1rem;
    overflow-y: auto;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 0.5rem;
    max-height: 300px;

    .emoji-item {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.25rem;
      border-radius: $border-radius-base;
      cursor: pointer;

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
