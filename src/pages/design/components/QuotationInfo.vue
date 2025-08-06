<template>
  <div v-if="selectedRow" class="detail-content">
    <h3 class="detail-title">报价单详细信息</h3>
  </div>

  <!-- <lay-descriptions :column="2" :bordered="true">
      <lay-descriptions-item label="报价单编号:">
        {{ selectedRow.ordersId }}
      </lay-descriptions-item>
      <lay-descriptions-item label="工程项目名称">
        {{ selectedRow.projectName }}
      </lay-descriptions-item>
      <lay-descriptions-item label="客户单位">
        {{ selectedRow.contacts }}
      </lay-descriptions-item>
      <lay-descriptions-item label="制单时间">
        {{ selectedRow.createDate }}
      </lay-descriptions-item>
      <lay-descriptions-item label="报价类型">
        {{
          [
            selectedRow.ordersType1,
            selectedRow.ordersType2,
            selectedRow.ordersType3,
          ]
            .filter(Boolean)
            .join('/')
        }}
      </lay-descriptions-item>
      <lay-descriptions-item label="总售价">
        ¥{{ selectedRow.priceSum?.toLocaleString() || '0' }}
      </lay-descriptions-item>
      <lay-descriptions-item label="总成本">
        ¥{{ selectedRow.purchasepriceSum?.toLocaleString() || '0' }}
      </lay-descriptions-item>
      <lay-descriptions-item label="交货时间">
        {{ selectedRow.deliveryTime || '未设置' }}
      </lay-descriptions-item>
      <lay-descriptions-item label="项目负责人">
        {{ selectedRow.chargePersonInfo }}
      </lay-descriptions-item>
      <lay-descriptions-item label="制单人">
        {{ selectedRow.name }}
      </lay-descriptions-item>
      <lay-descriptions-item label="项目备注" :span="2">
        {{ selectedRow.projectRemark || '无备注' }}
      </lay-descriptions-item>
      <lay-descriptions-item label="评论" :span="2">
        {{ selectedRow.explanation || '无评论' }}
      </lay-descriptions-item>
    </lay-descriptions> -->
</template>

<script setup lang="ts">
import type { QuotationListResponse } from '@/api/orders/orderApi.type';

const { selectedRow } = defineProps<{
  selectedRow: QuotationListResponse;
}>();
</script>

<style scoped lang="scss">
// 详细信息内容样式
.detail-content {
  padding: 20px;

  .detail-title {
    text-align: center;
    margin-bottom: 20px;
  }

  :deep(.layui-descriptions) {
  }
}
</style>
