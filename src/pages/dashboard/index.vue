<template>
  <div class="dashboard-page">
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import StatsSection from './component/StatsSection.vue';
import ModulesSection from './component/ModulesSection.vue';
import DynamicCard from './component/DynamicCard.vue';
import DataOverviewCard from './component/DataOverviewCard.vue';
import MemberCard from './component/MemberCard.vue';
import QuoteCard from './component/QuoteCard.vue';
import HistoryStatusCard from './component/HistoryStatusCard.vue';
import NoteCard from './component/NoteCard.vue';

// 展开状态控制
const isExpanded = ref(false);

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style lang="scss" scoped>
.dashboard-page {
  @include flex(column);
}

// 信息卡片区域
.info-cards-section {
  .transition-col {
    transition: all 1s ease;
  }
}
</style>
