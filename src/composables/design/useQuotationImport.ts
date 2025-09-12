import { layer } from '@layui/layui-vue';
import { ref } from 'vue';
import ordersApi from '@/api/orders/ordersApi';
import notify from '@/utils/notify';

export type UseQuotationImportOptions = Record<string, never>;

export function useQuotationImport() {
  const importModalVisible = ref(false);

  const handleImport = () => {
    importModalVisible.value = true;
  };

  const handleImportConfirm = async (file: File) => {
    try {
      // await ordersApi.importQuotation(file); TODO
      notify.success('导入成功');
      importModalVisible.value = false;
    } catch (error) {
      console.error('导入失败:', error);
      layer.msg('导入失败，请检查文件后重试', { icon: 2 });
    }
  };

  return {
    importModalVisible,
    handleImport,
    handleImportConfirm,
  };
}
