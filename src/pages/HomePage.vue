<template>
  <div class="page">
    <lay-button type="primary" @click="getOrderData"> 原始按钮 </lay-button>
    <lay-button type="primary" @click="getOrderData2"> 原始按钮 </lay-button>

    <div class="test">
      <lay-container fluid>
        <lay-row space="10">
          <lay-col md="4" sm="12" xs="24">
            <div class="grid-demo">1</div>
          </lay-col>
          <lay-col md="4" sm="12" xs="24">
            <div class="grid-demo">2</div>
          </lay-col>
          <lay-col md="4" sm="12" xs="24">
            <div class="grid-demo">3</div>
          </lay-col>
          <lay-col md="4" sm="12" xs="24">
            <div class="grid-demo">4</div>
          </lay-col>
          <lay-col md="4" sm="12" xs="24">
            <div class="grid-demo">5</div>
          </lay-col>
          <lay-col md="4" sm="12" xs="24">
            <div class="grid-demo">6</div>
          </lay-col>
        </lay-row>
      </lay-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import blackboardApi from '@/api/blackboard/blackboardApi';
import type { GetLastSixMonthsOrdeNoticeRes } from '@/api/blackboard/blackboardApi.type';
import { ref } from 'vue';

// 获取最近六个月的的订单数量
const orderData = ref<GetLastSixMonthsOrdeNoticeRes>([]);

const getOrderData = async () => {
  const res = await blackboardApi.getLastSixMonthsOrdeNotice();
  orderData.value = res;
  console.log('最近六月订单数量', res);
  if (!res) {
    console.log('获取最近六月订单数量');
  }
};

const getOrderData2 = async () => {
  const res = await blackboardApi.getLastSixMonthsOrders();
  orderData.value = res;
  console.log('最近六月订单数量', res);
  if (!res) {
    console.log('获取最近六月订单数量');
  }
};
</script>

<style lang="scss" scoped>
.page {
  @include flex(column);
}

.grid-demo {
  background-color: lavender;
}
</style>
