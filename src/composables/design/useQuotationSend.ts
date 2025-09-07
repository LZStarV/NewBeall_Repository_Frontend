import { type Ref } from 'vue';
import { layer } from '@layui/layui-vue';
import ordersApi from '@/api/orders/ordersApi';
import notify from '@/utils/notify';
import type { QuotationListResponse } from '@/api/orders/orderApi.type';
import type { UserInfo } from '@/pages/chat/Chat.type';

export interface UseQuotationSendOptions {
  selectedKey: Ref<string | undefined>;
  dataSource: Ref<QuotationListResponse[]>;
  currentUser: Ref<UserInfo | null>;
  getOrdersList: (type?: number) => Promise<void>;
  tabItem: Array<{ title: string; type: number }>;
  current2: Ref<string>;
}

export function useQuotationSend(options: UseQuotationSendOptions) {
  const {
    selectedKey,
    dataSource,
    currentUser,
    getOrdersList,
    tabItem,
    current2,
  } = options;

  /**
   * 发送订单
   */
  const handleSend = () => {
    // 检查是否有选中的行
    if (!selectedKey.value) {
      layer.msg('请先选择要发送的报价单', { icon: 2 });
      return;
    }

    // 获取选中行的数据
    const selectedRowData = dataSource.value.find(
      (item) => item.ordersId === selectedKey.value,
    );

    if (!selectedRowData) {
      layer.msg('未找到选中的报价单数据', { icon: 2 });
      return;
    }

    // 检查用户权限：只有制单人才能发送
    if (!currentUser.value) {
      layer.msg('用户信息未加载，请稍后重试', { icon: 2 });
      return;
    }

    if (selectedRowData.uid !== currentUser.value.id) {
      layer.msg('只有制单人才能发送订单', { icon: 2 });
      return;
    }

    // 如果当前订单为协作状态，提示用户先结束协作状态
    if (selectedRowData.coopUser && selectedRowData.coopUser !== '') {
      layer.msg('当前订单处于协作状态，请先结束协作状态后再发送给供应商', {
        icon: 2,
      });
      return;
    }

    // 弹出选择发送对象的确认框
    layer.confirm('请选择发送对象', {
      btn: [
        {
          text: '客户',
          callback: async (id) => {
            await handleSendToClient();
            layer.close(id);
          },
        },
        {
          text: '供应商',
          callback: async (id) => {
            await handleSendToSupplier();
            layer.close(id);
          },
        },
      ],
    });
  };

  /**
   * 发送给客户
   */
  const handleSendToClient = async () => {
    try {
      // 调用发送给客户的API
      await ordersApi.sendOrdersClient(selectedKey.value!);

      // 操作成功提示
      notify.success('订单已成功发送给客户');

      // 刷新当前页面数据
      const currentTab = tabItem.find((item) => item.title === current2.value);
      const type = currentTab ? currentTab.type : undefined;
      await getOrdersList(type === -1 ? undefined : type);
    } catch (error) {
      console.error('发送给客户失败:', error);
      notify.error('发送给客户失败，请重试');
    }
  };

  /**
   * 发送给供应商
   */
  const handleSendToSupplier = async () => {
    try {
      // 调用查询订单状态API（查询有没有可以发送的供应商）
      const res = (await ordersApi.queryOrdersStatus(
        selectedKey.value!,
      )) as unknown as { code: string; msg: string };
      if (res.code == '404') {
        layer.msg(res.msg, { icon: 2 });
        return;
      }

      // 操作成功提示
      notify.success('订单已成功发送给供应商');

      // 刷新当前页面数据
      const currentTab = tabItem.find((item) => item.title === current2.value);
      const type = currentTab ? currentTab.type : undefined;
      await getOrdersList(type === -1 ? undefined : type);
    } catch (error) {
      console.error('发送给供应商失败:', error);
      notify.error('发送给供应商失败，请重试');
    }
  };

  return {
    handleSend,
    handleSendToClient,
    handleSendToSupplier,
  };
}
