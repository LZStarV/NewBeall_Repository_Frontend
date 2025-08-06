<!-- 产品表单组件 -->
<template>
  <div class="check-product-page">
    <lay-card>
      <!-- 顶部工具栏 -->
      <div class="toolbar">
        <lay-tab v-model="currentTab" type="brief" @change="handleTabChange">
          <lay-tab-item
            v-for="item in tabItem"
            :id="item.title"
            :key="item.title"
            :title="item.title"
            :icon="item.iconRenderFunction"
          />
        </lay-tab>
      </div>
    </lay-card>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';

// tab数据
const currentTab = ref('全部');
const tabItem = [
  {
    title: '自建库',
    type: -1,
    iconRenderFunction: () => [
      h(SvgIcon, {
        name: 'toolbox',
        width: '1rem',
        style: 'margin-right: 8px;',
      }),
    ],
  },
  {
    title: '产品云',
    type: 2,
    iconRenderFunction: () => [
      h(SvgIcon, {
        name: 'cloud_disk',
        width: '1rem',
        style: 'margin-right: 8px;',
      }),
    ],
  },
  {
    title: '闲置云',
    type: 1,
    iconRenderFunction: () => [
      h(SvgIcon, {
        name: 'product',
        width: '0.9rem',
        style: 'margin-right: 8px;',
      }),
    ],
  },
  {
    title: '已失效',
    type: 0,
    iconRenderFunction: () => [
      h(SvgIcon, {
        name: 'cancel',
        width: '0.8rem',
        style: 'margin-right: 8px;',
      }),
    ],
  },
];
</script>

<style scoped lang="scss"></style>
