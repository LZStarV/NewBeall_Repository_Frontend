<template>
  <div class="new-quote-page">
    <QuotationEdit
      ref="quotationEditRef"
      :quotation-menu-config="quotationMenuConfig"
      :is-new-quotation="true"
      @data-submit="handleDataSubmit"
      @temp-save="handleTempSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { layer } from '@layui/layui-vue';
import QuotationEdit from '../components/QuotationEdit.vue';
import ordersApi from '@/api/orders/ordersApi';
import { writeQuotationAuth } from '@/api/auth/authApi';
import { hasPermission } from '@/api/mgr/mgrApi';
import notify from '@/utils/notify';
import type { Quotation } from '@/api/orders/orderApi.type';
import { useRouter } from 'vue-router';

// 报价说明文本
const quotationExplanation = ref('');

// 按钮配置
const quotationMenuConfig = [
  {
    iconName: 'add_to',
    name: '新建子项目',
    btnAction: () => {
      // 打开新建子项目 drawer
      quotationEditRef.value.showSubProjectDrawer = true;
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

// 处理数据提交
const handleDataSubmit = async (data: Quotation) => {
  try {
    data.param = 'orderCreat'; // 正式创建标识
    data.approvalType = 1; // 报价单类型

    // 1: 调用writeQuotationAuth方法
    const authResponse = await writeQuotationAuth();
    const authResult = authResponse as unknown as {
      code: '200' | '300';
      data: string;
      msg: string;
    };

    if (authResult.code !== '200') {
      console.error('写入报价单权限验证失败:', authResult);
      notify.error(`权限验证失败: ${authResult.msg || '无权限写入报价单'}`);
      return;
    }

    // 2: 调用hasPermission方法检查审批权限
    const permissionResponse = await hasPermission('/approval/detail_audit');
    const permissionResult = permissionResponse as unknown as {
      code: '200' | '300';
      data: boolean;
      msg: string;
    };

    if (!permissionResult.data) {
      console.error('审批权限检查失败:', permissionResult);
      notify.error(`权限检查失败: ${permissionResult.msg || '无审批权限'}`);
      return;
    }

    // 3: 调用isCoop方法检查是否为合作单
    const coopResponse = await ordersApi.isCoop(data.ordersId || '');
    const coopResult = coopResponse as unknown as {
      code: '200' | '300';
      data: boolean;
      msg: string;
    };

    if (coopResult.code !== '300') {
      console.error('合作状态检查失败:', coopResult);
      notify.error(
        `合作状态检查失败: ${coopResult.msg || '检查合作状态时出错'}`,
      );
      return;
    }

    // 4: 调用writeQuotation方法
    // 添加报价单说明
    data.explanation = quotationExplanation.value;

    const writeResponse = await ordersApi.writeQuotation(data);
    const writeResult = writeResponse as unknown as {
      code: '200' | '300';
      data: { orderId: string; sendType: boolean } | '';
      msg: string;
    };

    if (writeResult.code !== '300' || !writeResult.data) {
      console.error('写入报价单失败:', writeResult);
      notify.error(`写入报价单失败: ${writeResult.msg || '写入报价单时出错'}`);
      return;
    }

    // 5: 再次调用hasPermission方法检查审批权限
    const finalPermissionResponse = await hasPermission(
      '/approval/detail_audit',
    );
    const finalPermissionResult = finalPermissionResponse as unknown as {
      code: '200' | '300';
      data: boolean;
      msg: string;
    };

    if (!finalPermissionResult.data) {
      console.error('最终权限检查失败:', finalPermissionResult);
      notify.error(
        `最终权限检查失败: ${finalPermissionResult.msg || '无审批权限'}`,
      );
      return;
    }

    // 6: 执行路由跳转
    notify.success('报价单提交成功');
    router.push('/design/history-quote');
  } catch (error) {
    console.error('处理报价单数据提交时发生错误:', error);
    notify.error('提交报价单时发生错误，请稍后重试');
  }
};

const router = useRouter();

// 处理临时保存
const handleTempSave = async (data: Quotation) => {
  try {
    // 添加报价单说明
    data.explanation = quotationExplanation.value;

    await ordersApi.writeQuotation(data);
    notify.success('临时保存成功');
    router.push('/design/temp-quote');
  } catch (error) {
    console.error('临时保存失败:', error);
    notify.error('临时保存失败');
  }
};
</script>

<style scoped lang="scss"></style>
