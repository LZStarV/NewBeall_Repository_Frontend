// 类型定义
// 最近六月份订单数量
import type { UserReceiveListRes } from '@/types/dashboard';
// [6个月前, 5个月前, 4个月前, 3个月前, 2个月前, 上个月]
export type GetLastSixMonthsOrdeNoticeRes = number[];

// 最近六月份报价单数量
export type GetLastSixMonthsOrdersRes = number[];

// 报价单类型占比
export interface OrderTypeItem {
  name: string;
  value: string;
}

export interface GetOrdersTypeRes {
  left: OrderTypeItem[];
  right: OrderTypeItem[];
}

// 自己报价比例
export type GetOurselfOrderNumRes = OrderTypeItem[];

// 自己报价 公司报价比例
export type GetWholeOrderNumRes = OrderTypeItem[];

// 用户成员
export interface UserRes {
  birthday: string;
  profession: string;
  createtime: string;
  roleid: string;
  sex: number;
  deptid: number;
  avatar: string;
  companyId: number;
  times: number;
  phone: string;
  name: string;
  id: number;
  userRole: number;
  account: string;
  email: string;
  status: number;
}

// 工作台数据
export interface GetBlackboardDataRes {
  delAppro: number;
  discount: number;
  firstLogin: boolean;
  flexArr: string;
  inventoryCount: number;
  isMemberPay: boolean;
  msgList: UserReceiveListRes[];
  noCertified: number;
  noHandleCount: number;
  noreadCount: number;
  overtime: boolean;
  roleId: string;
  unWxBind: boolean;
  userRole: string;
  users: UserRes[];
}
