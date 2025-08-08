<template>
  <div class="dashboard-page">
    <lay-loading v-if="isConnecting" />

    <template v-else>
      <!-- 统计卡片区域 -->
      <StatsSection />
      <!-- 功能模块区域 -->
      <ModulesSection />

      <!-- 信息卡片区域 -->
      <div class="info-cards-section">
        <lay-container fluid>
          <lay-row space="24">
            <!-- 最新动态卡片 -->
            <lay-col
              :md="isExpanded ? '16' : '8'"
              :sm="isExpanded ? '24' : '12'"
              :xs="24"
              class="transition-col"
            >
              <DynamicCard
                :is-expanded="isExpanded"
                @toggle-expand="toggleExpand"
              />
            </lay-col>

            <!-- 数据概览 -->
            <lay-col md="8" sm="12" xs="24">
              <DataOverviewCard />
            </lay-col>

            <!-- 用户成员卡片 - 可隐藏 -->
            <lay-col
              v-show="!isExpanded"
              md="8"
              sm="12"
              xs="24"
              class="transition-col"
            >
              <MemberCard />
            </lay-col>

            <!-- 我的临时报价 -->
            <lay-col md="8" sm="12" xs="24">
              <QuoteCard />
            </lay-col>
            <!-- 历史报价状态 -->
            <lay-col md="8" sm="12" xs="24">
              <HistoryStatusCard />
            </lay-col>

            <!-- 笔记列表卡片 -->
            <lay-col md="8" sm="12" xs="24" class="transition-col">
              <NoteCard />
            </lay-col>
          </lay-row>
        </lay-container>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import StatsSection from './component/StatsSection.vue';
import ModulesSection from './component/ModulesSection.vue';
import DynamicCard from './component/DynamicCard.vue';
import DataOverviewCard from './component/DataOverviewCard.vue';
import MemberCard from './component/MemberCard.vue';
import QuoteCard from './component/QuoteCard.vue';
import HistoryStatusCard from './component/HistoryStatusCard.vue';
import NoteCard from './component/NoteCard.vue';
import type { WebSocketClient } from '@/utils/websocket';
import { useDashboardStore } from '@/stores/dashboard';
import { useChatStore } from '@/stores/chat';
import { createDashBoardWebSocket } from '@/websocket/dashboard';
import blackboardApi from '@/api/blackboard/blackboardApi';

// ws
let wsClient: WebSocketClient;
const dashboardStore = useDashboardStore();
const chatStore = useChatStore();

const isConnecting = ref(true);

// 展开状态控制
const isExpanded = ref(false);

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

onMounted(async () => {
  // 重置仪表盘数据
  dashboardStore.resetAllData();

  // 获取用户信息
  await chatStore.setUserInfo();
  const userId = chatStore.userInfoData?.id;

  // 获取工作台数据
  const res = await blackboardApi.getBlackboardData();
  dashboardStore.blackboardData = res.data || res;

  // 创建ws实例
  if (userId) {
    wsClient = createDashBoardWebSocket(userId, 0);
    // 启动连接
    wsClient.connect();
  }

  setTimeout(()=> {
    isConnecting.value = false;
  }, 500);
});

onUnmounted(() => {
  // 断开连接
  wsClient?.disconnect();
});
</script>

<style lang="scss" scoped>
.dashboard-page {
  @include flex(column);
  height: 100%;
}

.layui-loading {
  width: 100%;
  height: 100%;
}

:deep(.layui-loading-spinning) {
  background-color: transparent;
}

// 信息卡片区域
.info-cards-section {
  .transition-col {
    transition: all 1s ease;
  }
}
</style>
