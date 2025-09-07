import { reactive, computed, type Ref } from 'vue';
import { layer } from '@layui/layui-vue';
import ordersApi from '@/api/orders/ordersApi';
import notify from '@/utils/notify';
import type { QuotationListResponse } from '@/api/orders/orderApi.type';

export interface PropertyForm {
  shareOrdersEnabled: boolean; // 审核状态开关
  auditStatus: number; // 审核状态下拉值
  ordersIntegration: number; // 积分设置值
  shareName: string; // 共享名称
  projectStatusEnabled: boolean; // 项目状态开关
  projectStatus: number; // 项目状态值
  important: boolean; // 重要项目
  purchase: boolean; // 采购订单
  lockMark: boolean; // 锁定状态
}

export interface UseQuotationPropertyOptions {
  selectedKey: Ref<string | undefined>;
  dataSource: Ref<QuotationListResponse[]>;
  propertyModalVisible: Ref<boolean>;
  getOrdersList: (type?: number) => Promise<void>;
  tabItem: Array<{ title: string; type: number }>;
  current2: Ref<string>;
}

export function useQuotationProperty(options: UseQuotationPropertyOptions) {
  const {
    selectedKey,
    dataSource,
    propertyModalVisible,
    getOrdersList,
    tabItem,
    current2,
  } = options;

  // 属性设置表单
  const propertyForm = reactive<PropertyForm>({
    shareOrdersEnabled: false, // 审核状态开关
    auditStatus: 0, // 审核状态下拉值
    ordersIntegration: 0, // 积分设置值
    shareName: '', // 共享名称
    projectStatusEnabled: false, // 项目状态开关
    projectStatus: 0, // 项目状态值
    important: false, // 重要项目
    purchase: false, // 采购订单
    lockMark: false, // 锁定状态
  });

  // 审核状态数组
  const shareStatus = [
    '审核状态:(未设置)',
    '审核状态:(已通过)',
    '审核状态:(审核中)',
    '审核状态:(驳回)',
  ];

  // 积分选项数组
  const integrationOptions = [
    { value: 0, label: '0积分' },
    { value: 1, label: '1积分' },
    { value: 2, label: '2积分' },
    { value: 5, label: '5积分' },
    { value: 8, label: '8积分' },
    { value: 10, label: '10积分' },
  ];

  // 项目状态数组
  const projectStatusOptions = [
    { value: -1, label: '未选择' },
    { value: 0, label: '已失败' },
    { value: 1, label: '已中标' },
    { value: 2, label: '进行中' },
  ];

  // 当前选中行的数据计算属性
  const selectedRowData = computed(() => {
    return dataSource.value.find((item) => item.ordersId === selectedKey.value);
  });

  // 计算审核状态显示文本
  const auditStatusText = computed(() => {
    const shareOrders = selectedRowData.value?.shareOrders || 0;
    return shareStatus[shareOrders] || shareStatus[0];
  });

  /**
   * 设置报价单属性
   */
  const handleProperty = () => {
    // 检查是否有选中的行
    if (!selectedKey.value) {
      layer.msg('请先选择要设置属性的报价单', { icon: 2 });
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

    // 初始化表单数据
    // 审核状态：shareOrders为0时关闭，其他情况开启
    propertyForm.shareOrdersEnabled = selectedRowData.shareOrders !== 0;
    propertyForm.auditStatus = selectedRowData.shareOrders || 0;

    propertyForm.ordersIntegration = selectedRowData.ordersIntegration || 0;
    propertyForm.shareName = selectedRowData.shareName || '';
    // 项目状态：type为-1时关闭，其他情况（0,1,2）开启
    propertyForm.projectStatusEnabled = selectedRowData.type !== -1;
    propertyForm.projectStatus = selectedRowData.type;
    propertyForm.important = selectedRowData.important === 1;
    propertyForm.purchase = selectedRowData.purchase === 1;
    propertyForm.lockMark = Number(selectedRowData.lockMark) === 1;

    // 显示属性设置弹窗
    propertyModalVisible.value = true;
  };

  /**
   * 确认属性设置
   */
  const handlePropertyConfirm = async () => {
    try {
      // 调用设置属性API
      await ordersApi.setOrdersProperty(
        propertyForm.projectStatus,
        propertyForm.important,
        propertyForm.purchase,
        propertyForm.lockMark,
        propertyForm.ordersIntegration,
        propertyForm.shareName,
        selectedKey.value!,
      );

      // 操作成功提示
      notify.success('属性设置成功');

      // 刷新当前页面数据
      const currentTab = tabItem.find((item) => item.title === current2.value);
      const type = currentTab ? currentTab.type : undefined;
      await getOrdersList(type === -1 ? undefined : type);

      // 关闭弹窗
      propertyModalVisible.value = false;
    } catch (error) {
      console.error('设置属性失败:', error);
      notify.error('设置属性失败，请重试');
    }
  };

  /**
   * 审核状态开关变化处理
   */
  const handleAuditStatusChange = (value: boolean) => {
    if (!value) {
      // 关闭审核状态时，清空积分设置和共享名称
      propertyForm.ordersIntegration = 0;
      propertyForm.shareName = '';
      propertyForm.auditStatus = 0;
    }
  };

  /**
   * 项目状态开关变化处理
   */
  const handleProjectStatusChange = (value: boolean) => {
    if (!value) {
      // 关闭项目状态时，重置项目状态为未选择状态
      propertyForm.projectStatus = -1;
    }
  };

  return {
    propertyForm,
    shareStatus,
    integrationOptions,
    projectStatusOptions,
    selectedRowData,
    auditStatusText,
    handleProperty,
    handlePropertyConfirm,
    handleAuditStatusChange,
    handleProjectStatusChange,
  };
}