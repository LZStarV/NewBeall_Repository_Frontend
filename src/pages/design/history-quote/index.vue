<template>
  <div class="history-quote-page">
    <div class="page-header">
      <h1>历史报价</h1>
      <p>查看和管理历史报价记录</p>
    </div>

    <div class="content-area">
      <lay-card title="历史报价列表">
        <div class="filter-bar">
          <lay-input placeholder="搜索报价" />
          <lay-date-picker placeholder="选择日期" />
          <lay-button type="primary">搜索</lay-button>
        </div>

        <div class="quote-table">
          <lay-table :columns="columns" :data-source="quoteList">
            <template #status="{ row }">
              <lay-tag :type="getStatusType(row.status)">{{
                row.status
              }}</lay-tag>
            </template>
            <template #action="{ row }">
              <lay-button size="sm" @click="viewQuote(row)">查看</lay-button>
              <lay-button size="sm" type="primary" @click="editQuote(row)"
                >编辑</lay-button
              >
            </template>
          </lay-table>
        </div>
      </lay-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const columns = [
  { title: '报价编号', key: 'quoteNo', width: 150 },
  { title: '项目名称', key: 'projectName', width: 200 },
  { title: '客户名称', key: 'customerName', width: 150 },
  { title: '报价金额', key: 'amount', width: 120 },
  { title: '状态', key: 'status', width: 100, customSlot: 'status' },
  { title: '创建时间', key: 'createTime', width: 150 },
  { title: '操作', key: 'action', width: 150, customSlot: 'action' },
];

const quoteList = ref([
  {
    quoteNo: 'Q202401001',
    projectName: '办公室装修设计',
    customerName: '某科技公司',
    amount: '¥50,000',
    status: '已完成',
    createTime: '2024-01-15',
  },
]);

const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    已完成: 'normal',
    进行中: 'warm',
    已取消: 'danger',
  };
  return statusMap[status] || 'normal';
};

const viewQuote = (row: any) => {
  console.log('查看报价:', row);
};

const editQuote = (row: any) => {
  console.log('编辑报价:', row);
};
</script>

<style scoped lang="scss">
.history-quote-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;

  h1 {
    margin: 0;
    color: #333;
    font-size: 28px;
  }

  p {
    margin: 8px 0 0 0;
    color: #666;
    font-size: 16px;
  }
}

.filter-bar {
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
