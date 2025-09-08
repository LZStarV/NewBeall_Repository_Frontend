import { ref, type Ref } from 'vue';
import { layer } from '@layui/layui-vue';
import ordersApi from '@/api/orders/ordersApi';
import notify from '@/utils/notify';
import type { TableColumn } from '@layui/layui-vue/types/component/table/typing';

export interface UseQuotationActionsOptions {
  selectedKey: Ref<string | undefined>;
  columns?: Ref<TableColumn[]>;
  editModalVisible?: Ref<boolean>;
  getOrdersList?: (type?: number) => Promise<void>;
  tabItem?: Array<{ title: string; type: number }>;
  current2?: Ref<string>;
}

export function useQuotationActions(options: UseQuotationActionsOptions) {
  const {
    selectedKey,
    columns,
    editModalVisible,
    getOrdersList,
    tabItem,
    current2,
  } = options;

  const showPriceColumns = ref(false);

  /**
   * 显示/隐藏价格列
   */
  const handleShowPrice = () => {
    if (!columns) return;
    showPriceColumns.value = !showPriceColumns.value;
    // 动态更新表格列的显示状态
    columns.value.forEach((column) => {
      if (column.key === 'priceSum' || column.key === 'purchasepriceSum') {
        column.hide = !showPriceColumns.value;
      }
    });
  };

  /**
   * 编辑报价单
   */
  const handleEdit = () => {
    if (!editModalVisible) return;
    console.log(selectedKey.value);
    if (!selectedKey.value) {
      layer.msg('请先选择要修改的报价单', { icon: 2 });
      return;
    }
    editModalVisible.value = true;
  };

  /**
   * 编辑保存回调
   */
  const handleEditSave = (data: any) => {
    if (!editModalVisible) return;
    console.log('保存编辑数据:', data);
    // TODO: 实现保存逻辑
    editModalVisible.value = false;
    layer.msg('保存成功', { icon: 1 });
  };

  /**
   * 复制报价单
   */
  const handleCopy = async () => {
    if (!getOrdersList || !tabItem || !current2) return;
    // 检查是否有选中的行
    if (!selectedKey.value) {
      layer.msg('请先选择要复制的订单', { icon: 2 });
      return;
    }

    // 弹出确认对话框
    layer.confirm('确定要复制选中的订单吗？', {
      title: '确认复制',
      icon: 3,
      yes: async (index: number) => {
        try {
          // 调用复制API
          await ordersApi.copyOrders(selectedKey.value!);

          // 操作成功提示
          notify.success('订单复制成功');

          // 刷新当前页面数据
          const currentTab = tabItem.find(
            (item) => item.title === current2.value,
          );
          const type = currentTab ? currentTab.type : undefined;
          await getOrdersList(type === -1 ? undefined : type);

          // 关闭确认对话框
          layer.close(index);
        } catch (error) {
          console.error('复制订单失败:', error);
          notify.error('复制订单失败，请重试');
        }
      },
    });
  };

  return {
    showPriceColumns,
    handleShowPrice,
    handleEdit,
    handleEditSave,
    handleCopy,
  };
}

