<template>
  <!-- 删除申请页面 -->
  <div class="delete-application-page">
    <!-- <SearchPanel ref="searchPanelRef" :deleteordiscount="0" /> -->
    <ApprovalOrderListComponent page-type="delete" />
  </div>
</template>

<script lang="ts" setup>
import ApprovalOrderListComponent from '../components/ApprovalOrderListComponent.vue';
</script>

<style scoped lang="scss">
.delete-application-page {
}
</style>
