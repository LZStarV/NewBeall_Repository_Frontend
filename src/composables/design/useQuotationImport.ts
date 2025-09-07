import { layer } from '@layui/layui-vue';

export function useQuotationImport() {
  /**
   * 导入功能
   * 注意：此功能目前为占位符，待后续实现
   */
  const handleImport = () => {
    // TODO: 实现导入功能
    layer.msg('导入功能待实现', { icon: 1 });
  };

  return {
    handleImport,
  };
}