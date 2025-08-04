<template>
  <div class="base-card" :class="cardClass">
    <div class="card-header">
      <div v-if="!$slots.tabs" class="header-main">
        <h3 class="card-title">{{ title }}</h3>
        <div v-if="$slots.actions" class="card-actions">
          <slot name="actions"></slot>
        </div>
      </div>

      <div v-if="$slots.tabs" class="header-with-tabs">
        <div class="card-tabs">
          <slot name="tabs"></slot>
        </div>
        <div v-if="$slots.actions" class="card-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
    <div class="card-content">
      <!-- 默认插槽 -->
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title: string; // 卡片标题
  cardClass?: string;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.base-card {
  background: white;
  border-radius: 16px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: 400px;
  @include flex(column);

  .card-header {
    border-bottom: 1px solid #e8e8e8;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    flex-shrink: 0;

    .header-main,
    .header-with-tabs {
      @include flex(row, space-between, center);
      padding: 20px 24px 16px;

      .card-title {
        margin: 0;
        font-size: 16px;
        height: 24px;
        line-height: 24px;
        font-weight: 500;
        color: #1b1b1b;
      }
    }

    // 有 tabs 时的布局
    .header-with-tabs {
      padding: 20px 24px 0;

      .card-actions {
        margin-bottom: 16px;
      }
    }
  }

  .card-actions {
    @include flex(row, center, center);
    gap: 10px;

    :deep(.action-icon) {
      color: #8c8c8c;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 16px;
      width: 24px;
      height: 24px;
      @include flex(row, center, center);

      &:hover {
        color: var(--global-primary-color);
      }
    }
  }
  .card-content {
    flex: 1;
    padding: 20px 24px 24px;
    overflow-y: auto;
  }
}
</style>
