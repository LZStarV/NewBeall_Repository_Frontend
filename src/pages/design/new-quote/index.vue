<template>
  <div class="new-quote-page">
    <QuotationEdit
      ref="quotationEditRef"
      :quotation-menu-config="quotationMenuConfig"
      :is-new-quotation="true"
      @data-submit="handleDataSubmit"
      @temp-save="handleTempSave"
    />

    <!-- 新建子项目 drawer -->
    <SubProjectDrawer
      v-model:visible="showSubProjectDrawer"
      @submit="handleSubProjectSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { layer } from '@layui/layui-vue';
import QuotationEdit from '../components/QuotationEdit.vue';
import SubProjectDrawer from '../components/SubProjectDrawer.vue';
import ordersApi from '@/api/orders/ordersApi';
import notify from '@/utils/notify';
import type { Quotation } from '@/api/orders/orderApi.type';

// 报价说明文本
const quotationExplanation = ref('');

// 控制 drawer 显示
const showSubProjectDrawer = ref(false);

// 按钮配置
const quotationMenuConfig = [
  {
    iconName: 'add_to',
    name: '新建子项目',
    btnAction: () => {
      // 打开新建子项目 drawer
      showSubProjectDrawer.value = true;
    },
  },
  {
    iconName: 'doc',
    name: '报价单说明',
    btnAction: () => {
      // 打开layui textarea弹窗，收集用户输入的数据
      layer.prompt({
        type: 1,
        title: '报价单说明',
        formType: 'textarea',
        area: ['500px', '300px'],
        btn: [
          {
            text: '确定',
            callback: (index: string, data) => {
              quotationExplanation.value = data;
              layer.close(index);
              notify.success('报价单说明已保存');
            },
          },
          {
            text: '取消',
            callback: (index: string) => {
              layer.close(index);
            },
          },
        ],
      });
    },
  },
  {
    iconName: 'pin',
    name: '临时保存',
    btnAction: () => {
      // 触发临时保存事件
      quotationEditRef.value?.triggerTempSave();
    },
  },
  {
    iconName: 'send',
    name: '提交',
    btnAction: () => {
      // 弹出询问弹窗，确认后提交数据
      layer.confirm('确定要提交报价单吗？', {
        title: '提交报价单',
        btn: [
          {
            text: '确定',
            callback: (index: string) => {
              // 触发提交事件
              quotationEditRef.value?.triggerSubmit();
              layer.close(index);
            },
          },
          {
            text: '取消',
            callback: (index: string) => {
              layer.close(index);
            },
          },
        ],
      });
    },
  },
  {
    iconName: 'rmb',
    name: '修改售价',
    btnAction: () => {
      // 打开ModalWindow组件（预留功能，后续编写）
      layer.open({
        type: 1,
        title: '修改价格',
        area: ['600px', '400px'],
        content: '',
        btn: [
          {
            text: '确定',
            callback: (index: string) => {
              layer.close(index);
            },
          },
          {
            text: '取消',
            callback: (index: string) => {
              layer.close(index);
            },
          },
        ],
      });
    },
  },
];

// QuotationEdit 组件引用
const quotationEditRef = ref();

// 处理子项目提交
const handleSubProjectSubmit = (data: {
  name: string;
  level: string;
  color: string;
  parentId?: string;
}) => {
  console.log('新建子项目数据:', data);
  // 这里可以处理子项目的创建逻辑
  notify.success('子项目创建成功');
};

// 处理数据提交
const handleDataSubmit = (data: Quotation) => {
  console.log('报价单数据:', data);
  notify.success('报价单提交成功');
};

// 处理临时保存
const handleTempSave = async (data: Quotation) => {
  try {
    // 添加报价单说明
    data.explanation = quotationExplanation.value;

    await ordersApi.writeQuotation(data);
    notify.success('临时保存成功');
  } catch (error) {
    console.error('临时保存失败:', error);
    notify.error('临时保存失败');
  }
};
</script>

<style scoped lang="scss"></style>
