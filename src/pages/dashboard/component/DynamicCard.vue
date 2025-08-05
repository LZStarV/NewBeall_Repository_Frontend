<template>
  <BaseCard title="最新动态">
    <template #actions>
      <lay-tooltip content="一键已读" trigger="hover">
        <SvgIcon name="clean" class="svgIcon" @click="handleMarkAllRead" />
      </lay-tooltip>
      <lay-icon
        :type="isExpanded ? 'layui-icon-left' : 'layui-icon-right'"
        class="action-icon expand-icon"
        @click="toggleExpand"
      />
    </template>

    <div class="dynamic-list">
      <div v-if="dynamicList.length === 0" class="empty-state">
        <div class="empty-text">暂无最新动态</div>
      </div>

      <!-- 动态列表 -->
      <div v-else class="dynamic-items">
        <div
          v-for="(item, index) in dynamicList"
          :key="item.id || index"
          class="dynamic-item"
          @click="handleItemClick(item)"
        >
          <!-- 圆点指示器 -->
          <div class="dot-indicator"></div>

          <!-- 内容区域 -->
          <div class="content-area">
            <div class="message-content">{{ item.messageContent }}</div>
            <div class="create-time">{{ formatDateTime(item.createTime) }}</div>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';
import BaseCard from './BaseCard.vue';
import { useDashboardStore } from '@/stores/dashboard';
import { computed } from 'vue';
import type { UserReceiveListRes } from '@/types/dashboard';
import { useFormatDate } from '@/composables/useFormatDate';
import messageApi from '@/api/message/messageApi';
import { layer } from '@layui/layui-vue';

interface Props {
  isExpanded: boolean;
}
defineProps<Props>();

const emit = defineEmits<{
  toggleExpand: [];
}>();

const toggleExpand = () => {
  emit('toggleExpand');
};

const dashboardStore = useDashboardStore();
// 使用时间格式化工具
const { formatDateTime } = useFormatDate();

// 获取最新动态数据
const dynamicList = computed(() => dashboardStore.dynamicData);
// 一键已读
const handleMarkAllRead = async () => {
  if (dynamicList.value.length === 0) {
    layer.msg('暂无数据', { icon: 0 });
    return;
  }
  try {
    // 收集所有ID
    const allIds = dynamicList.value.map((item) => item.id);

    await messageApi.msgReadAll(allIds);
    // 批量移除
    dashboardStore.removeReadMessages(allIds);
    layer.msg('全部已读', { icon: 1 });
  } catch (error) {
    console.error('❌ 全部已读失败:', error);
    layer.msg('操作失败，请重试', { icon: 2 });
  }
};

// 点击最新动态项
const handleItemClick = async (item: UserReceiveListRes) => {
  try {
    await messageApi.msgRead(item.id);
    dashboardStore.removeReadMessages(item.id);
    layer.msg('确认已读', { icon: 1 });
  } catch (error) {
    console.error('已读失败:', error);
    layer.msg('操作失败，请重试', { icon: 2 });
  }
};
</script>

<style lang="scss" scoped>
.dynamic-list {
  @include flex(column);
  height: 100%;
}

.svgIcon {
  color: var(--global-primary-color);
  cursor: pointer;
  @include flex(row, center, center);
}

// 空状态
.empty-state {
  @include flex(column, center, center);
  height: 200px;
  color: #999;

  .empty-text {
    font-size: 14px;
  }
}

.dynamic-items {
  @include flex(column, flex-start, stretch);
  height: 100%;
}

.dynamic-item {
  @include flex(row, flex-start, flex-start);
  margin: 10px 0;
}

// 圆点指示器
.dot-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--global-primary-color);
  margin-top: 5px;
  margin-right: 10px;
  flex-shrink: 0;
}

// 内容区域
.content-area {
  @include flex(row, space-between, center);
  flex: 1;
  min-width: 0; // 防止内容溢出
  color: #5f5f5f;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    color: var(--global-primary-color);
  }

  .message-content {
    @include text-ellipsis();
    margin-right: 30px;
  }

  .create-time {
    text-wrap: nowrap;
  }
}
</style>
