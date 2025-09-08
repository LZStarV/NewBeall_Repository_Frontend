import { type Ref } from 'vue';
import { layer } from '@layui/layui-vue';
import ordersApi from '@/api/orders/ordersApi';
import notify from '@/utils/notify';
import type { QuotationListResponse } from '@/api/orders/orderApi.type';

export interface UseQuotationDeleteOptions {
  selectedKey: Ref<string | undefined>;
  dataSource: Ref<QuotationListResponse[]>;
  deleteModalVisible: Ref<boolean>;
  getOrdersList?: (type?: number) => Promise<void>;
  refreshHandler?: () => void;
  tabItem?: Array<{ title: string; type: number }>;
  current2?: Ref<string>;
}

export function useQuotationDelete(options: UseQuotationDeleteOptions) {
  const {
    selectedKey,
    deleteModalVisible,
    getOrdersList,
    refreshHandler,
    tabItem,
    current2,
  } = options;

  const handleDelete = () => {
    // 检查是否有选中的行
    if (!selectedKey.value) {
      layer.msg('请先选择要删除的报价单', { icon: 2 });
      return;
    }
    deleteModalVisible.value = true;
  };

  /**
   * 删除确认处理
   */
  const handleDeleteConfirm = async () => {
    if (!selectedKey.value) return;

    try {
      // 调用删除API
      await ordersApi.deleteOrders(selectedKey.value);

      // 操作成功提示
      notify.success('删除成功');

      // 关闭弹窗
      deleteModalVisible.value = false;

      // 刷新当前页面数据
      if (tabItem && current2 && getOrdersList) {
        const currentTab = tabItem.find(
          (item) => item.title === current2.value,
        );
        const type = currentTab ? currentTab.type : undefined;
        await getOrdersList(type === -1 ? undefined : type);
      } else {
        refreshHandler?.();
      }
    } catch (error) {
      console.error('删除报价单失败:', error);
      notify.error('删除失败，请重试');
    }
  };

  return {
    handleDelete,
    handleDeleteConfirm,
  };
}

