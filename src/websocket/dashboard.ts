import { WebSocketClient } from '@/utils/websocket';
import { useDashboardStore } from '@/stores/dashboard';
import type { DashboardMessage } from '@/types/dashboard';

/**
 * 处理仪表盘WebSocket消息
 * @param messageData WebSocket消息数据
 */
function handleDashboardMessage(messageData: string) {
  let message: DashboardMessage;

  try {
    message = JSON.parse(messageData);
  } catch (error) {
    console.error('❌ JSON 解析失败:', {
      error,
      data: messageData.substring(0, 100) + '...',
    });
    return;
  }

  const dashboardStore = useDashboardStore();

  // 根据domId字段区分不同类型的消息
  switch (message.domId) {
    case '#tempTotal':
      // 临时报价数据
      dashboardStore.setTempTotalData(message.temOrder);
      break;

    case '#userList':
      // 在线用户列表
      dashboardStore.setOnlineUserList(message.userList);
      break;

    case '#dynamic':
      // 最新动态通知
      dashboardStore.setDynamicData(message.messageUserReceiveList);
      break;

    case '#consoleUserOnline':
      // 上线人员数量
      dashboardStore.setUserOnline(message.count);
      break;

    case '#consoleUserOnClose':
      // 下线人员数量
      dashboardStore.setUserOnClose(message.count);
      break;

    case '#appro':
      // 报价审批数量
      dashboardStore.setApproNum(message.count);
      break;

    case '#unRead':
      // 未读即时通讯数量
      dashboardStore.setUnReadNum(message.count);
      break;

    case '#delAppro':
      // 删除审批数量
      dashboardStore.setDelApproNum(message.count);
      break;

    case '#unReadNotice':
      // 未读订单数量
      dashboardStore.setUnReadNoticeNum(message.count);
      break;

    case '#inventoryOrders':
      // 未读闲置订单数量
      dashboardStore.setInventoryOrdersNum(message.count);
      break;

    case '#discount':
      // 折率审批数量
      dashboardStore.setDiscountNum(message.count);
      break;

    default:
      console.warn('⚠️ 未知的消息类型:', message.domId, message);
      break;
  }
}

/**
 * 创建首页仪表盘WebSocket连接
 * @param userId 用户ID
 * @param index 仪表盘索引
 * @returns WebSocketClient
 */
export function createDashBoardWebSocket(
  userId: string | number,
  index: number,
): WebSocketClient {
  return new WebSocketClient({
    targetPath: `/imserver/${userId}/${index}`,
    onOpen: () => {
      console.log('仪表盘连接已建立!');
    },
    onMessage: (event) => {
      const messageData = event.data;
      // 忽略空消息
      if (!messageData || !messageData.trim()) {
        console.warn('⚠️ 收到空消息，已忽略');
        return;
      }
      console.log('收到仪表盘消息:', event.data);
      handleDashboardMessage(event.data);
    },
    onClose: (event) => {
      console.log('仪表盘连接已断开:', event.code, event.reason);
    },
    onError: (event) => {
      console.error('仪表盘连接出错，请检查网络:', event);
    },
  });
}
