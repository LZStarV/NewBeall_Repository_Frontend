<template>
  <div class="side-toolbar">
    <div class="side-toolbar-item" title="返回顶部">
      <SvgIcon name="expand_light_reverse" />
    </div>
    <div class="side-toolbar-item" title="折叠所有子项目">
      <SvgIcon name="shrink_item" />
    </div>
    <div class="side-toolbar-item" title="总价预览">
      <SvgIcon name="rmb" />
    </div>
    <div class="side-toolbar-item" title="提取模块">
      <SvgIcon name="plus" />
    </div>
    <div class="side-toolbar-item" title="查看方案云">
      <SvgIcon name="query" />
    </div>
    <div class="side-toolbar-item" title="导入模块">
      <SvgIcon name="order_receive_order" />
    </div>
    <div class="side-toolbar-item" title="临时产品载入数据库">
      <SvgIcon name="house_manager" />
    </div>
    <div class="side-toolbar-item" title="返回底部">
      <SvgIcon name="expand_light" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';
</script>

<style scoped lang="scss">
.side-toolbar {
  position: fixed;
  top: 50%;
  transform: translate(0%, -50%);
  right: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .side-toolbar-item {
    width: 40px;
    height: 40px;
    background-color: #f6f6f6;
    color: #a1a1a1;
    border-radius: 12px 0 0 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;

    &:hover {
      color: #000;
      background-color: #f0f0f0;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
