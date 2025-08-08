import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TempTotalRes, UserReceiveListRes } from '@/types/dashboard';
import type { GetBlackboardDataRes } from '@/api/blackboard/blackboardApi.type';

export const useDashboardStore = defineStore('dashboard', () => {
  // 工作台api数据
  const blackboardData = ref<GetBlackboardDataRes>();

  // 工作台 ws数据

  // 临时报价数据
  const tempTotalData = ref<TempTotalRes[]>([]);

  // 获取当前在线用户
  const onlineUserList = ref<number[]>([]);

  // 最新动态数据
  const dynamicData = ref<UserReceiveListRes[]>([]);

  // 上线人员
  const userOnline = ref<number>(0);

  // 下线人员
  const userOnClose = ref<number>(0);

  // 报价审批数量
  const approNum = ref<number>(0);

  // 未读即时通讯数量
  const unReadNum = ref<number>(0);

  // 删除审批数量
  const delApproNum = ref<number>(0);

  // 未读订单数量
  const unReadNoticeNum = ref<number>(0);

  // 未读闲置订单数量
  const inventoryOrdersNum = ref<number>(0);

  // 折率审批数量
  const discountNum = ref<number>(0);

  // 设置工作台api数据
  const setBlackboardData = (data: GetBlackboardDataRes) => {
    blackboardData.value = data;
  };

  // 设置临时报价数据
  const setTempTotalData = (data: TempTotalRes[]) => {
    tempTotalData.value = data;
    console.log('🔄 更新临时报价数据:', data.length, '条');
  };

  // 设置在线用户列表
  const setOnlineUserList = (userList: number[]) => {
    onlineUserList.value = userList;
    console.log('👥 更新在线用户列表:', userList.length, '人');
  };

  // 设置最新动态数据
  const setDynamicData = (data: UserReceiveListRes[]) => {
    dynamicData.value = data;
    console.log('📢 更新最新动态数据:', data.length, '条');
  };

  // 移除已读消息
  const removeReadMessages = (messageIds: number | number[]) => {
    // 统一转换为数组格式
    const idsArray = Array.isArray(messageIds) ? messageIds : [messageIds];

    // 过滤掉要移除的消息
    dynamicData.value = dynamicData.value.filter(
      (item) => !idsArray.includes(item.id),
    );

    console.log('已移除', messageIds);
  };

  // 设置上线人员数量
  const setUserOnline = (count: number) => {
    userOnline.value = count;
    console.log('✅ 更新上线人员数量:', count);
  };

  // 设置下线人员数量
  const setUserOnClose = (count: number) => {
    userOnClose.value = count;
    console.log('❌ 更新下线人员数量:', count);
  };

  // 设置报价审批数量
  const setApproNum = (count: number) => {
    approNum.value = count;
    console.log('📝 更新报价审批数量:', count);
  };

  // 设置未读即时通讯数量
  const setUnReadNum = (count: number) => {
    unReadNum.value = count;
    console.log('💬 更新未读即时通讯数量:', count);
  };

  // 设置删除审批数量
  const setDelApproNum = (count: number) => {
    delApproNum.value = count;
    console.log('🗑️ 更新删除审批数量:', count);
  };

  // 设置未读订单数量
  const setUnReadNoticeNum = (count: number) => {
    unReadNoticeNum.value = count;
    console.log('📋 更新未读订单数量:', count);
  };

  // 设置未读闲置订单数量
  const setInventoryOrdersNum = (count: number) => {
    inventoryOrdersNum.value = count;
    console.log('📦 更新未读闲置订单数量:', count);
  };
  // 设置折率审批数量
  const setDiscountNum = (count: number) => {
    discountNum.value = count;
    console.log('📦 更新折率审批数量:', count);
  };

  // 重置所有数据
  const resetAllData = () => {
    tempTotalData.value = [];
    onlineUserList.value = [];
    dynamicData.value = [];
    userOnline.value = 0;
    userOnClose.value = 0;
    approNum.value = 0;
    unReadNum.value = 0;
    delApproNum.value = 0;
    unReadNoticeNum.value = 0;
    inventoryOrdersNum.value = 0;
    discountNum.value = 0;
    console.log('重置所有仪表盘数据');
  };

  return {
    blackboardData,
    // ws数据
    tempTotalData,
    onlineUserList,
    dynamicData,
    userOnline,
    userOnClose,
    approNum,
    unReadNum,
    delApproNum,
    unReadNoticeNum,
    inventoryOrdersNum,
    discountNum,

    setBlackboardData,
    // ws设置方法
    setTempTotalData,
    setOnlineUserList,
    setDynamicData,
    setUserOnline,
    setUserOnClose,
    setApproNum,
    setUnReadNum,
    setDelApproNum,
    setUnReadNoticeNum,
    setInventoryOrdersNum,
    setDiscountNum,
    resetAllData,
    removeReadMessages,
  };
});
