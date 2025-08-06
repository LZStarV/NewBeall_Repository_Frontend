<template>
  <lay-collapse v-model="localActiveItems" class="instruction-collapse">
    <lay-collapse-item
      :id="instruction.id.toString()"
      :key="instruction.id"
      :title="instruction.insTitle"
      class="instruction-item"
    >
      <!-- 标题插槽：显示标签和操作按钮 -->
      <template #title>
        <div class="instruction-header">
          <div class="header-left">
            <span class="instruction-title">{{ instruction.insTitle }}</span>
            <div class="instruction-tags">
              <lay-tag
                v-for="tag in instruction.tagList"
                :key="tag.id"
                :style="getTagStyleForCard(tag)"
                size="sm"
                class="custom-tag"
              >
                {{ tag.content }}
              </lay-tag>
            </div>
          </div>
          <div class="header-right">
            <button class="delete-btn" @click.stop="handleDelete(instruction)">
              删除
            </button>
            <button class="edit-btn" @click.stop="handleEdit(instruction)">
              修改
            </button>
          </div>
        </div>
      </template>

      <!-- 折叠内容：文案正文和图片 -->
      <div class="instruction-content">
        <div class="content-text">
          <div class="content-body">{{ instruction.insContent }}</div>
        </div>

        <!-- 图片展示 -->
        <div
          v-if="
            Array.isArray(instruction.imgList) && instruction.imgList.length > 0
          "
          class="content-images"
        >
          <div class="image-grid">
            <div
              v-for="(img, imgIndex) in instruction.imgList as {
                url: string;
              }[]"
              :key="imgIndex"
              class="image-item"
            >
              <img
                :src="`${baseImgUrl}${img.url}`"
                :alt="`图片${imgIndex + 1}`"
                @click="handleImagePreview(img)"
              />
            </div>
          </div>
        </div>

        <div class="mobile-btn-group">
          <lay-button
            class="delete-btn"
            type="danger"
            @click.stop="handleDelete(instruction)"
          >
            删除
          </lay-button>
          <lay-button
            class="edit-btn"
            type="primary"
            @click.stop="handleEdit(instruction)"
          >
            修改
          </lay-button>
        </div>
      </div>
    </lay-collapse-item>
  </lay-collapse>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Instruction } from '@/api/orders/orderApi.type';
import env from '@/utils/env';
import { getTagStyleForCard } from '@/utils/tagUtils';

const baseImgUrl = env.getBaseStaticUrl();

// Props
interface Props {
  instruction: Instruction;
  activeItems: string[];
}

const props = defineProps<Props>();

// Events
interface Emits {
  edit: [instruction: Instruction];
  delete: [instruction: Instruction];
  imagePreview: [img: { url: string }];
  'update:activeItems': [value: string[]];
}

const emit = defineEmits<Emits>();

// 本地激活项状态
const localActiveItems = computed({
  get: () => props.activeItems,
  set: (value: string[]) => {
    emit('update:activeItems', value);
  },
});

// 事件处理
const handleEdit = (instruction: Instruction) => {
  emit('edit', instruction);
};

const handleDelete = (instruction: Instruction) => {
  emit('delete', instruction);
};

const handleImagePreview = (img: { url: string }) => {
  emit('imagePreview', img);
};
</script>

<style lang="scss" scoped>
@use 'sass:color';

.instruction-collapse {
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  background: #fff;
  overflow: hidden;
  margin-bottom: 4px;

  :deep(.lay-collapse-item) {
    border: none;

    .lay-collapse-item-header {
      padding: 12px 16px;
      background: #fafafa;
      border-bottom: 1px solid #e6e6e6;

      &:hover {
        background: #f5f5f5;
      }
    }

    .lay-collapse-item-body {
      padding: 16px;
      border-top: none;
    }
  }

  .instruction-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;

    .header-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .instruction-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        line-height: 1.4;
      }

      .instruction-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;

        .custom-tag {
          font-weight: 500;

          :deep(.lay-tag) {
            background-color: inherit;
            color: inherit;
          }
        }
      }
    }

    .header-right {
      display: flex;
      gap: 8px;
      margin-left: 16px;

      .delete-btn,
      .edit-btn {
        background-color: transparent;
        color: $success-color;
        border: none;
        cursor: pointer;
        width: 2rem;
      }

      .delete-btn {
        color: $danger-color;
      }
    }
  }

  .instruction-content {
    .content-text {
      .content-body {
        line-height: 1.6;
        color: #333;
        font-size: 14px;
        word-break: break-word;
      }
    }

    .content-images {
      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 8px;

        .image-item {
          img {
            width: 100%;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              transform: scale(1.05);
            }
          }
        }
      }
    }
  }

  .mobile-btn-group {
    display: none;
  }
}

:deep(.layui-colla-content) {
  p {
    margin: 0;
  }
}

// 响应式样式
@media (max-width: $phone_layout_breakpoint) {
  .instruction-collapse {
    .instruction-header {
      .header-left {
        width: 100%;
      }

      .header-right {
        display: none;
      }
    }

    .mobile-btn-group {
      display: flex;
      align-items: center;
      width: 100%;
      margin-top: 12px;
    }
  }
}
</style>
