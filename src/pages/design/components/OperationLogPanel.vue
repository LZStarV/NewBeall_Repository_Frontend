<template>
  <transition name="slide-left">
    <div v-if="visible" class="operation-log-panel">
      <div class="panel-header">
        <span>操作记录</span>
        <button title="删除" @click="closePanel">
          <SvgIcon name="cancel" width="0.8rem" />
        </button>
      </div>
      <div class="panel-body">
        <div v-if="isLoading" class="loading">加载中...</div>
        <div v-else>
          <div v-if="logs.length === 0" class="empty">暂无记录</div>
          <ul v-else class="log-list">
            <li v-for="(item, idx) in logs" :key="item.id || idx" class="log-item">
              <div class="log-line">
                <span class="log-time">{{ item.createTime || '-' }}</span>
                <span class="log-user">{{ item.createUser || '-' }}</span>
              </div>
              <div class="log-actions">
                <lay-button type="primary" size="sm" @click="onViewChange(item)">查看修改内容</lay-button>
              </div>
            </li>
          </ul>
          <div class="panel-footer" v-if="hasMore">
            <lay-button :disabled="isLoadingMore" @click="loadMore" size="sm">{{ isLoadingMore ? '加载中...' : '加载更多'
              }}</lay-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import ordersApi from '@/api/orders/ordersApi';
import type { OrderLogsRecord } from '@/api/orders/orderApi.type';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  visible: boolean;
  orderId?: string;
  phaseType?: number; // 默认：1（与现有页面一致）
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  'view-change': [record: OrderLogsRecord];
}>();

const logs = ref<OrderLogsRecord[]>([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const limit = ref(20);
const offset = ref(1);
const total = ref<number | null>(null);

const hasMore = computed(() => {
  if (total.value === null) return true;
  return logs.value.length < (total.value as number);
});

const resetLogs = () => {
  logs.value = [];
  offset.value = 1;
  total.value = null;
};

const fetchLogs = async (append = false) => {
  if (!props.orderId) return;
  if (append) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
  }
  try {
    const res: any = await ordersApi.getOrderLogsRecord(
      props.orderId,
      props.phaseType ?? 1,
      offset.value,
      limit.value,
    );
    let rows: OrderLogsRecord[] = [];
    let totalVal: number | undefined;
    if (res && Array.isArray(res.rows)) {
      rows = res.rows as OrderLogsRecord[];
      totalVal = res.total as number | undefined;
    } else if (res && res.data && Array.isArray(res.data.records)) {
      rows = res.data.records as OrderLogsRecord[];
      totalVal = res.data.total as number | undefined;
    }
    if (append) {
      logs.value = logs.value.concat(rows);
    } else {
      logs.value = rows;
    }
    if (typeof totalVal === 'number') {
      total.value = totalVal;
    } else if (total.value === null) {
      total.value = rows.length;
    }
    offset.value += 1;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('获取操作记录失败', e);
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

const loadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return;
  await fetchLogs(true);
};

const closePanel = () => {
  emit('update:visible', false);
};

const onViewChange = (record: OrderLogsRecord) => {
  emit('view-change', record);
};

// 当面板显示或 orderId 变化时加载
watch(
  () => [props.visible, props.orderId],
  async ([visible]) => {
    if (visible) {
      resetLogs();
      await fetchLogs(false);
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
    padding: 10px 12px;
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
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
