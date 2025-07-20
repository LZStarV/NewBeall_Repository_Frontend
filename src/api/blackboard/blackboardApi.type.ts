// 类型定义

// 最近六月份订单数量
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
