<template>
  <transition name="slide-left">
    <div v-if="visible" class="operation-log-panel">
      <div class="panel-header">
        <span>跟进记录</span>
        <button title="关闭" @click="closePanel">
          <SvgIcon name="cancel" width="0.8rem" />
        </button>
      </div>
      <div class="panel-body">
        <div v-if="notesList.length === 0" class="empty">暂无记录</div>
        <ul v-else class="log-list">
          <li v-for="(item, idx) in notesList" :key="idx" class="log-item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  visible: boolean;
  notes: string;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const closePanel = () => {
  emit('update:visible', false);
};

const notesList = ref<string[]>([]);

// 当面板显示或 orderId 变化时加载
watch(
  () => [props.visible, props.notes],
  async ([visible]) => {
    if (visible) {
      notesList.value = props.notes
        .split('\n')
        .filter((item) => item.trim() !== '');
    }
  },
  { immediate: false },
);
</script>

<style scoped lang="scss">
.operation-log-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 340px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  display: flex;
  flex-direction: column;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid #f0f0f0;
    font-weight: 600;

    button {
      @include button-style($primary-color);
      color: #999;
    }
  }

  .panel-body {
    padding: 0 12px;
    overflow: auto;
    flex: 1;
  }

  .log-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .log-item {
    padding: 8px 6px;
    border-bottom: 1px dashed #f0f0f0;
  }

  .log-line {
    display: flex;
    justify-content: space-between;
    color: #888;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .log-actions {
    text-align: right;
  }

  .log-msg {
    color: #333;
    font-size: 13px;
    line-height: 1.5;
  }

  .loading,
  .empty {
    text-align: center;
    color: #999;
    padding: 12px 0;
  }

  .panel-footer {
    text-align: center;
    padding: 10px 0 4px 0;
  }
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>

