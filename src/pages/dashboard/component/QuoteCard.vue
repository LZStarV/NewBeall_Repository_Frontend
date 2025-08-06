<template>
  <BaseCard title="我的临时报价">
    <div class="quote-content">
      <!-- 表格显示数据 -->
      <lay-table
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        size="sm"
        class="quote-table"
        even
        @row="handleRowClick"
      />
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
import { useDashboardStore } from '@/stores/dashboard';
import BaseCard from './BaseCard.vue';
import { computed, ref } from 'vue';

const dashboardStore = useDashboardStore();

// 获取临时报价数据
const tempQuotes = computed(() => dashboardStore.tempTotalData);

// 表格列配置
const columns = ref([
  {
    title: '序号',
    key: 'index',
    width: '100px',
    align: 'center',
  },
  {
    title: '报价名称',
    key: 'projectName',
    minWidth: '150px',
    align: 'center',
  },
]);

// 处理表格数据，添加序号
const tableData = computed(() => {
  return tempQuotes.value.map((item, index) => ({
    ...item,
    index: index + 1,
  }));
});

// 处理行点击事件
const handleRowClick = (row: any) => {
  const projectName = row.projectName;
  console.log('点击了项目:', projectName);
  // TODO:处理页面跳转
};

</script>

<style lang="scss" scoped>
.quote-content {
  height: 100%;
  @include flex(column);
}
</style>
