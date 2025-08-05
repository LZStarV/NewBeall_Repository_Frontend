// 工作台webSocket获取类型定义
export interface TempTotalRes {
  ordersId: string;
  projectName: string;
  LAY_TABLE_INDEX: number;
}

export interface UserReceiveListRes {
  createTime: number;
  deflag: number;
  id: number;
  messageContent: string;
  messageOrderId: string;
  messageType: number;
  receivePersons: number;
}

// websocketMessage
export interface DashboardMessage {
  count: number;
  domId: string;
  group: boolean;
  isGroup: boolean;
  isMeReadMessage: boolean;
  isMessage: boolean;
  meReadMessage: boolean;
  message: boolean;
  temOrder: TempTotalRes[]; // 临时报价数据
  userList: number[]; // 当前在线用户
  messageUserReceiveList: UserReceiveListRes[]; // 获取公告内容
}
