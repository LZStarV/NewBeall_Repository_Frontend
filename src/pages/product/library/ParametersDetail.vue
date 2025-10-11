<template>
  <!-- 右侧参数详情弹窗 -->
  <RightSideModal
:visible="visible" :title="`${selectedProduct?.name || ''} - 产品详情`" :width="rightModalWidth"
    :mask-closable="true" @close="handleClose">
    <div v-if="selectedProduct" class="parameters-detail">
      <!-- 产品基本信息 -->
      <div class="info-section">
        <h4 class="section-title">
          <lay-icon type="layui-icon-list" />
          基本信息
        </h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">产品名称：</span>
            <span class="value">{{ selectedProduct?.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">品牌：</span>
            <span class="value">{{ selectedProduct?.brand }}</span>
          </div>
          <div class="info-item">
            <span class="label">型号：</span>
            <span class="value">{{ selectedProduct?.model }}</span>
          </div>
          <div class="info-item">
            <span class="label">单位：</span>
            <span class="value">{{ selectedProduct?.unit }}</span>
          </div>
        </div>
      </div>

      <!-- 产品图片 -->
      <div class="info-section">
        <h4 class="section-title">
          <lay-icon type="layui-icon-picture" />
          产品图片
        </h4>
        <div class="product-images">
          <div
v-if="selectedProduct?.pictureaddress || selectedProduct?.pictureaddressOne"
            class="single-image-container">
            <img
              :src="`https://yx.newbeall.com/softLink/${selectedProduct?.pictureaddress || selectedProduct?.pictureaddressOne}`"
              :alt="selectedProduct?.name" class="product-image-full" @error="handleImageError" />
          </div>
          <div v-else class="single-image-container no-image">
            <lay-icon type="layui-icon-picture" />
            <span>暂无图片</span>
          </div>
        </div>
      </div>

      <!-- 产品特点 -->
      <div class="info-section">
        <h4 class="section-title">
          <lay-icon type="layui-icon-star-fill" />
          产品特点
        </h4>
        <div class="features-content">
          <p class="description">{{ selectedProduct?.trait || '暂无产品特点描述' }}</p>
        </div>
      </div>

      <!-- 详细参数 -->
      <div class="info-section">
        <h4 class="section-title">
          <lay-icon type="layui-icon-set" />
          详细参数
        </h4>
        <div class="params-content">
          <div class="param-description">
            <div class="param-text" v-html="formatParamText(selectedProduct?.param || '暂无详细参数描述')">
            </div>
          </div>
          <div class="params-grid">
            <div class="param-item">
              <span class="param-label">库存数量：</span>
              <span class="param-value">{{ selectedProduct?.inventory }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">销售数量：</span>
              <span class="param-value">{{ selectedProduct?.sales }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">默认折扣：</span>
              <span class="param-value">{{ selectedProduct?.defaultDiscount }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 产品资料 -->
      <div class="info-section">
        <h4 class="section-title">
          <lay-icon type="layui-icon-file" />
          产品资料
        </h4>
        <div class="no-data-message">
          <p>暂无数据</p>
        </div>
      </div>
    </div>
  </RightSideModal>
</template>

<script lang="ts" setup>
import RightSideModal from '@/components/RightSideModal.vue';
import type { Product } from './type';


// 定义组件的props
interface Props {
  visible: boolean
  selectedProduct?: Product | null
  rightModalWidth: string
}

const props = withDefaults(defineProps<Props>(), {
  rightModalWidth: '35%'
});

// 定义组件的emits
const emit = defineEmits<{
  close: []
}>();

// 关闭弹窗
const handleClose = () => {
  emit('close');
};

// 图片加载失败处理
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'https://via.placeholder.com/150'; // 替换为默认图片
  target.alt = '加载失败';
};

// 格式化参数文本，处理分号和逗号的换行
const formatParamText = (text: string) => {
  if (!text) return '';
  // 将分号替换为换行符，并确保换行符后有空格
  return text.replace(/;/g, '<br />&nbsp;&nbsp;').replace(/,/g, '<br />&nbsp;&nbsp;');
};
</script>

<style lang="scss" scoped>
// 右侧弹窗内容样式优化
.parameters-detail {
  .info-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #333;
      font-weight: 600;
      padding-bottom: 8px;
      border-bottom: 2px solid #1890ff;

      .layui-icon {
        color: #1890ff;
        font-size: 16px;
      }
    }

    .info-grid,
    .params-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 16px;

      .info-item,
      .param-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        background: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #e8e8e8;

        .label,
        .param-label {
          font-weight: 500;
          color: #333;
          min-width: 80px;
          font-size: 13px;
        }

        .value,
        .param-value {
          color: #666;
          flex: 1;
          font-size: 13px;
        }
      }
    }

    .product-images {
      .single-image-container {
        width: 100%;
        min-height: 200px;
        background: #f8f9fa;
        border: 1px solid #e8e8e8;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        &.no-image {
          flex-direction: column;
          gap: 8px;
          color: #999;

          .layui-icon {
            font-size: 48px;
          }

          span {
            font-size: 14px;
          }
        }

        .product-image-full {
          max-width: 100%;
          max-height: 400px;
          object-fit: contain;
          border-radius: 6px;
        }
      }
    }

    .features-content {
      .description {
        color: #666;
        line-height: 1.6;
        font-size: 14px;
        margin: 0;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #e8e8e8;
      }
    }

    .params-content {
      .param-description {
        margin-bottom: 16px;

        .param-text {
          color: #666;
          line-height: 1.8;
          font-size: 14px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e8e8e8;

          :deep(br) {
            line-height: 2;
          }
        }
      }
    }

    .no-data-message {
      text-align: center;
      padding: 40px 20px;
      color: #999;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e8e8e8;

      p {
        margin: 0;
        font-size: 14px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .parameters-detail {
    .info-section {

      .info-grid,
      .params-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
