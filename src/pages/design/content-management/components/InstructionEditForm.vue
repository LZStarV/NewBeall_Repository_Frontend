<template>
  <ModalWindow
    :visible="visible"
    :title="editingInstruction ? '修改方案' : '添加方案'"
    :btn="btn"
    @close="handleClose"
  >
    <div class="edit-form">
      <!-- 标签选择器 -->
      <div class="form-group">
        <label class="form-label">添加标签</label>
        <div class="tag-selector">
          <!-- 添加标签区域 -->
          <div class="tag-add-row">
            <lay-input
              v-model="newTagName"
              placeholder="输入新标签名称"
              class="tag-name-input"
              @keyup.enter="handleAddNewTag"
            />
            <div class="color-picker-wrapper">
              <input
                v-model="selectedColor"
                type="color"
                class="color-picker"
                title="选择标签颜色"
              />
              <div
                class="color-preview"
                :style="getColorPreviewStyle()"
                title="颜色预览"
              >
                示例标签
              </div>
            </div>
            <lay-button
              type="primary"
              :loading="addingTag"
              @click="handleAddNewTag"
            >
              添加
            </lay-button>
          </div>

          <!-- 可选标签列表 -->
          <div class="tag-options-container">
            <div class="tag-options-header">
              <span class="options-title">可选标签</span>
              <span class="selected-count"
                >已选择 {{ selectedTagIds.length }} 个</span
              >
            </div>

            <!-- 标签输入框样式容器 -->
            <div class="tag-options-input-box">
              <div v-if="tagList.length === 0" class="empty-tags-inline">
                暂无标签，请先添加标签
              </div>
              <div v-else class="tag-options-list">
                <div
                  v-for="tag in tagList"
                  :key="tag.id"
                  :class="[
                    'tag-option-item',
                    { selected: selectedTagIds.includes(tag.id) },
                  ]"
                  :style="getTagOptionStyle(tag)"
                >
                  <lay-checkbox
                    :model-value="selectedTagIds.includes(tag.id)"
                    :value="tag.id"
                    skin="primary"
                    @change="toggleTag(tag.id)"
                    @click.stop
                  />
                  <span class="tag-label" @click="toggleTag(tag.id)">{{
                    tag.content
                  }}</span>
                  <button
                    class="tag-delete-btn"
                    title="删除标签"
                    @click.stop="handleDeleteTag(tag)"
                  >
                    <SvgIcon name="cancel" width="10" height="10" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文案名称 -->
      <div class="form-group">
        <label class="form-label"> 方案名称 </label>
        <lay-input
          v-model="editForm.insTitle"
          placeholder="请输入方案名称"
          class="form-input"
        />
      </div>

      <!-- 文案详细内容 -->
      <div class="form-group">
        <label class="form-label"> 方案介绍 </label>
        <lay-textarea
          v-model="editForm.insContent"
          placeholder="请输入方案详细内容"
          :rows="6"
          class="form-textarea"
        />
      </div>

      <!-- 图片上传器 -->
      <div class="form-group">
        <label class="form-label"> 方案图片 </label>
        <div class="image-uploader">
          <!-- 已上传的图片预览 -->
          <div
            v-if="editForm.images.length > 0 || uploadingImages.size > 0"
            class="image-preview-list"
          >
            <!-- 已上传完成的图片 -->
            <div
              v-for="(image, index) in editForm.images"
              :key="`uploaded_${index}`"
              class="image-preview-item"
            >
              <img :src="`${baseImgUrl}${image}`" :alt="`图片${index + 1}`" />
              <button
                class="image-remove-btn"
                title="删除图片"
                @click="removeImage(index)"
              >
                <SvgIcon name="cancel" width="14" height="14" />
              </button>
            </div>

            <!-- 正在上传的图片 -->
            <div
              v-for="tempId in Array.from(uploadingImages)"
              :key="tempId"
              class="image-preview-item uploading"
            >
              <div class="upload-placeholder">
                <SvgIcon name="load" width="24" height="24" class="spinning" />
                <span class="upload-text">上传中...</span>
              </div>
            </div>
          </div>

          <div
            class="upload-area"
            :class="{ disabled: uploadingImages.size > 0 }"
            @click="uploadingImages.size === 0 ? triggerImageUpload() : null"
          >
            <SvgIcon name="add_to" width="24" height="24" />
            <span>{{
              uploadingImages.size > 0 ? '上传中...' : '点击上传图片'
            }}</span>
          </div>
          <input
            ref="imageInputRef"
            type="file"
            accept="image/*"
            multiple
            style="display: none"
            @change="handleImageUpload"
          />
        </div>
      </div>
    </div>
  </ModalWindow>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue';
import ModalWindow from '@/components/ModalWindow.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import ordersApi from '@/api/orders/ordersApi';
import tagApi from '@/api/tag/tagApi';
import productApi from '@/api/product/productApi';
import type { Instruction } from '@/api/orders/orderApi.type';
import type { TagType } from '@/types/tag';
import notify from '@/utils/notify';
import env from '@/utils/env';
import { layer } from '@layui/layui-vue';
import {
  getTagOptionStyle,
  lightenColor,
  generateTagStyleString,
} from '@/utils/tagUtils';

const baseImgUrl = env.getBaseStaticUrl();

interface Props {
  visible: boolean;
  editingInstruction?: Instruction | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 响应式数据
const tagList = ref<TagType[]>([]);
const selectedTagIds = ref<string[]>([]);
const submitLoading = ref(false);

// 添加标签相关
const newTagName = ref('');
const selectedColor = ref('#409eff');
const addingTag = ref(false);

// 图片上传相关
const imageInputRef = ref<HTMLInputElement>();
const uploadingImages = ref<Set<string>>(new Set());

// 编辑表单
const editForm = reactive({
  insTitle: '',
  insContent: '',
  images: [] as string[],
});

// 底部按钮
const btn = ref([
  {
    text: computed(() => (props.editingInstruction ? '更新方案' : '创建方案')),
    loading: submitLoading, // 不使用computed就无法响应条件的变化
    callback: () => {
      handleSubmitForm();
    },
  },
  {
    text: '取消',
    callback: () => {
      handleClose();
    },
  },
]);

// 监听弹窗显示状态和编辑数据变化
watch(
  [() => props.visible, () => props.editingInstruction],
  async ([newVisible, newInstruction]) => {
    if (newVisible) {
      await loadTagList();
      if (newInstruction) {
        fillEditForm(newInstruction);
      } else {
        resetEditForm();
      }
    }
  },
);

// 加载标签列表
const loadTagList = async () => {
  try {
    const response = await tagApi.getTagList();
    tagList.value = response.data;
  } catch (error) {
    console.error('获取标签列表失败:', error);
  }
};

// 重置编辑表单
const resetEditForm = () => {
  editForm.insTitle = '';
  editForm.insContent = '';
  editForm.images = [];
  selectedTagIds.value = [];
  uploadingImages.value.clear();
  // 重置添加标签相关
  newTagName.value = '';
  selectedColor.value = '#409eff';
};

// 填充编辑表单
const fillEditForm = (instruction: Instruction) => {
  editForm.insTitle = instruction.insTitle;
  editForm.insContent = instruction.insContent;

  // 处理图片数据 - 优先使用 images 数组，其次使用 imgList，最后尝试解析 insImgs
  if (instruction.images && instruction.images.length > 0) {
    editForm.images = [...instruction.images];
  } else if (instruction.imgList && Array.isArray(instruction.imgList)) {
    editForm.images = instruction.imgList
      .map((img) => (typeof img === 'string' ? img : img.url))
      .filter(Boolean);
  } else if (instruction.insImgs) {
    // 如果 insImgs 是逗号分隔的字符串，尝试解析
    editForm.images = instruction.insImgs
      .map((img: { url: string }) => img.url)
      .filter(Boolean);
  } else {
    editForm.images = [];
  }

  // 解析标签ID
  if (instruction.tagIds) {
    selectedTagIds.value = JSON.parse(instruction.tagIds);
  } else {
    selectedTagIds.value = [];
  }

  // 清空上传状态
  uploadingImages.value.clear();
};

// 关闭编辑窗口
const handleClose = () => {
  emit('close');
};

// 标签选择切换
const toggleTag = (tagId: string) => {
  const index = selectedTagIds.value.indexOf(tagId);
  if (index > -1) {
    selectedTagIds.value.splice(index, 1);
  } else {
    selectedTagIds.value.push(tagId);
  }
};

// 获取颜色预览样式
const getColorPreviewStyle = () => {
  return {
    color: selectedColor.value,
    backgroundColor: lightenColor(selectedColor.value),
    borderColor: selectedColor.value,
  };
};

// 处理添加新标签
const handleAddNewTag = async () => {
  if (!newTagName.value.trim()) {
    notify.error('请输入标签名称');
    return;
  }

  // 检查标签是否已存在
  const existingTag = tagList.value.find(
    (tag) => tag.content === newTagName.value.trim(),
  );
  if (existingTag) {
    notify.error('该标签已存在');
    return;
  }

  try {
    addingTag.value = true;

    // 生成样式字符串
    const styleString = generateTagStyleString(selectedColor.value);

    const tagData: TagType = {
      content: newTagName.value.trim(),
      companyId: 0, // 根据实际情况设置
      createTime: new Date().toISOString(),
      id: '', // 由后端生成
      style: styleString,
    };

    await tagApi.addTag(tagData);
    notify.success('添加标签成功');

    // 重置输入
    newTagName.value = '';
    selectedColor.value = '#409eff';

    // 重新加载标签列表
    await loadTagList();
  } catch (error) {
    console.error('添加标签失败:', error);
    notify.error('添加标签失败');
  } finally {
    addingTag.value = false;
  }
};

// 处理删除标签
const handleDeleteTag = async (tag: TagType) => {
  try {
    layer.confirm(`确定要删除标签"${tag.content}"吗？`, {
      btn: [
        {
          text: '确定',
          callback: async (id) => {
            try {
              await tagApi.deleteTag(tag.id);
              layer.close(id);

              // 如果被删除的标签在已选择列表中，移除它
              const index = selectedTagIds.value.indexOf(tag.id);
              if (index > -1) {
                selectedTagIds.value.splice(index, 1);
              }

              // 重新加载标签列表
              await loadTagList();
              notify.success('删除标签成功');
            } catch (error) {
              console.error('删除标签失败:', error);
              notify.error('删除标签失败');
              layer.close(id);
            }
          },
        },
        {
          text: '取消',
          callback: (id) => {
            layer.close(id);
          },
        },
      ],
    });
  } catch (error) {
    console.error('删除标签失败:', error);
    notify.error('删除标签失败');
  }
};

// 触发图片上传
const triggerImageUpload = () => {
  imageInputRef.value?.click();
};

// 处理图片上传
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files && files.length > 0) {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      // 生成临时ID用于跟踪上传状态
      const tempId = `temp_${Date.now()}_${Math.random()}`;
      uploadingImages.value.add(tempId);

      try {
        // 上传到服务器
        const response = await productApi.uploadProductImage(file);

        // 上传成功，添加服务器返回的URL
        if (response.data && response.data.url) {
          editForm.images.push(response.data.name);
        }

        notify.success(`图片"${file.name}"上传成功`);
      } catch (error) {
        console.error('图片上传失败:', error);
        notify.error(`图片"${file.name}"上传失败`);
      } finally {
        // 移除上传状态
        uploadingImages.value.delete(tempId);
      }
    }
  }

  // 清空input的值，以便可以重复选择同一个文件
  target.value = '';
};

// 移除图片
const removeImage = (index: number) => {
  editForm.images.splice(index, 1);
};

// 提交表单
const handleSubmitForm = async () => {
  // 表单验证
  if (!editForm.insTitle.trim()) {
    notify.error('请输入方案名称');
    return;
  }
  if (!editForm.insContent.trim()) {
    notify.error('请输入方案内容');
    return;
  }

  try {
    submitLoading.value = true;

    const tagIds = JSON.stringify(selectedTagIds.value); // 将标签ID数组转换为JSON字符串

    // 准备提交数据
    const instructionData: Instruction = {
      id: props.editingInstruction?.id || '',
      insTitle: editForm.insTitle.trim(),
      insContent: editForm.insContent.trim(),
      insImgs: editForm.images.map((name) => ({ url: name })), // 将图片数组转换为逗号分隔的字符串
      tagIds: tagIds,
    };

    await ordersApi.addInstruction(instructionData);

    notify.success(props.editingInstruction ? '更新方案成功' : '创建方案成功');
    emit('success');
    emit('close');
  } catch (error) {
    console.error('提交表单失败:', error);
    notify.error(props.editingInstruction ? '更新方案失败' : '创建方案失败');
  } finally {
    submitLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.edit-form {
  padding: 1rem;

  .form-group {
    margin-bottom: 20px;

    .form-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;

      .lay-icon {
        font-size: 16px;
        color: $primary-color;
      }
    }

    .form-input,
    .form-textarea {
      width: 100%;
    }

    .tag-selector {
      .tag-add-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 1rem;

        .tag-name-input {
          flex: 1;
          min-width: 0;
        }

        .color-picker-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;

          .color-picker {
            width: 32px;
            height: 32px;
            border-radius: $border-radius-middle;
            cursor: pointer;
            border: 1px solid transparent;

            &:hover {
              border-color: #40a9ff;
            }
          }

          .color-preview {
            width: 60px;
            height: 32px;
            border-radius: $border-radius-middle;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
          }
        }
      }

      .tag-options-container {
        .tag-options-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;

          .options-title {
            font-size: 14px;
            font-weight: 500;
            color: #333;
          }

          .selected-count {
            font-size: 12px;
            color: #666;
            background-color: #f0f0f0;
            padding: 2px 8px;
            border-radius: 10px;
          }
        }

        .tag-options-input-box {
          border: 1px solid var(--input-border-color);
          border-radius: var(--input-border-radius);
          padding: 8px;
          overflow-y: auto;
          transition: border-color 0.3s;

          .empty-tags-inline {
            color: #999;
            font-size: 14px;
            text-align: center;
            padding: 20px;
            user-select: none;
          }

          .tag-options-list {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            align-items: flex-start;

            .tag-option-item {
              display: flex;
              align-items: center;
              gap: 4px;
              padding: 3px 8px;
              height: 32px;
              border-radius: $border-radius-middle;
              font-size: 12px;
              transition: all 0.2s;
              position: relative;

              :deep(.layui-form-checkbox[lay-skin='primary']) {
                padding: 0;
              }

              &:hover {
                transform: translateY(-1px);
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
              }

              &.selected {
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
                transform: translateY(-1px);
              }

              .tag-label {
                flex: 1;
                font-size: 12px;
                user-select: none;
                cursor: pointer;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 60px;
              }

              .tag-delete-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                background: none;
                border: none;
                cursor: pointer;
                opacity: 0.6;
                transition: opacity 0.2s;
                padding: 1px;
                margin-left: 2px;

                &:hover {
                  opacity: 1;
                  color: #ff4d4f;
                }
              }
            }
          }
        }
      }
    }

    .image-uploader {
      .image-preview-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;

        .image-preview-item {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #d9d9d9;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .image-remove-btn {
            position: absolute;
            top: 2px;
            right: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            background-color: rgba(0, 0, 0, 0.5);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;

            &:hover {
              background-color: rgba(0, 0, 0, 0.7);
            }
          }

          &.uploading {
            border: 1px dashed $primary-color;
            background-color: #f0f9ff;

            .upload-placeholder {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              color: $primary-color;

              .spinning {
                animation: spin 1s linear infinite;
                margin-bottom: 4px;
              }

              .upload-text {
                font-size: 10px;
                text-align: center;
              }
            }
          }
        }
      }

      .upload-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 120px;
        border-radius: 4px;
        background-color: $card-header-background-color;
        cursor: pointer;
        color: $primary-color;
        transition: all 0.3s;

        &.disabled {
          cursor: not-allowed;
          opacity: 0.6;
          background-color: #f0f0f0;
          color: #ccc;
        }

        span {
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }
}

// 响应式样式调整
@media (max-width: 768px) {
  .edit-form {
    .form-group {
      .tag-selector {
        .tag-add-section {
          padding: 12px;

          .tag-add-row {
            flex-direction: column;
            gap: 8px;

            .tag-name-input {
              width: 100%;
            }

            .color-picker-wrapper {
              align-self: stretch;
              justify-content: center;

              .color-picker,
              .color-preview {
                width: 28px;
                height: 28px;
              }
            }
          }
        }

        .tag-options-container {
          .tag-options-input-box {
            padding: 6px;

            .tag-options-list {
              gap: 4px;

              .tag-option-item {
                padding: 2px 4px;
                font-size: 10px;

                .tag-label {
                  max-width: 50px;
                }

                .tag-delete-btn {
                  padding: 0;
                  margin-left: 1px;
                }
              }
            }

            .empty-tags-inline {
              padding: 15px;
              font-size: 13px;
            }
          }
        }
      }

      .image-uploader {
        .image-preview-list {
          .image-preview-item {
            width: 60px;
            height: 60px;
          }
        }

        .upload-area {
          height: 100px;

          span {
            font-size: 12px;
          }
        }
      }
    }

    .form-actions {
      flex-direction: column;
      gap: 8px;
    }
  }
}

// 旋转动画
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
