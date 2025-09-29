<template>
  <div class="businessAreaInfoPage">
    <h4>业务覆盖区域</h4>
    <div class="select">
      <lay-select v-model="value" placeholder="请选择"></lay-select>
      <lay-button type="normal">确定</lay-button>
    </div>
  </div>
</template>
<script setup lang="ts"></script>

<style lang="scss" scoped>
h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  border-left: 3px solid var(--global-primary-color);
  padding-left: 15px;
}
.businessAreaInfoPage {
  .select {
    padding: 20px;
    @include flex();
    gap: 20px;
    .layui-select {
      display: inline-block;
    }
  }
}
</style>
