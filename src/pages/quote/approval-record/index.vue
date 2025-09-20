<template>
  <!-- 审批记录页面 -->
  <div class="approval-record-page">
    <ApprovalOrderListComponent page-type="discount" :is-order-record="true" />
  </div>
</template>

<script lang="ts" setup>
import ApprovalOrderListComponent from '../components/ApprovalOrderListComponent.vue';
</script>

<style scoped lang="scss">
.approval-record-page {
}
</style>
