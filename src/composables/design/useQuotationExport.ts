import { reactive, type Ref } from 'vue';
import { layer } from '@layui/layui-vue';
import ordersApi from '@/api/orders/ordersApi';
import notify from '@/utils/notify';

export interface ExportOptions {
  derivePrime: boolean; // 同时导出成本价
  isExplanation: boolean; // 导出报价说明
  isSeal: boolean; // 加盖印章
}

export interface UseQuotationExportOptions {
  selectedKey: Ref<string | undefined>;
  exportModalVisible: Ref<boolean>;
}

export function useQuotationExport(options: UseQuotationExportOptions) {
  const { selectedKey, exportModalVisible } = options;

  // 导出选项
  const exportOptions = reactive<ExportOptions>({
    derivePrime: false, // 同时导出成本价
    isExplanation: false, // 导出报价说明
    isSeal: false, // 加盖印章
  });

  /**
   * 导出报价单
   */
  const handleExport = () => {
    // 检查是否有选中的行
    if (!selectedKey.value) {
      layer.msg('请先选择要导出的报价单', { icon: 2 });
      return;
    }

    // 重置导出选项
    exportOptions.derivePrime = false;
    exportOptions.isExplanation = false;
    exportOptions.isSeal = false;

    // 显示导出确认弹窗
    exportModalVisible.value = true;
  };

  /**
   * 确认导出
   */
  const handleExportConfirm = async () => {
    try {
      // 调用导出API
      await ordersApi.exportQuotation(
        selectedKey.value!,
        exportOptions.derivePrime,
        exportOptions.isExplanation,
        exportOptions.isSeal,
      );

      // 操作成功提示
      notify.success('报价单成功导出');

      // 关闭弹窗
      exportModalVisible.value = false;
    } catch (error) {
      console.error('导出报价单失败:', error);
      notify.error('导出报价单失败，请重试');
    }
  };

  return {
    exportOptions,
    handleExport,
    handleExportConfirm,
  };
}