import http from '@/utils/http';
import type {
  GetLastSixMonthsOrdeNoticeRes,
  GetLastSixMonthsOrdersRes,
  GetOrdersTypeRes,
  GetOurselfOrderNumRes,
  GetWholeOrderNumRes,
} from './blackboardApi.type';

//  API
export default {
  // 获取最近六月份订单数量
  getLastSixMonthsOrdeNotice() {
    return http.get<GetLastSixMonthsOrdeNoticeRes>(
      '/blackboard/getLastSixMonthsOrdeNotice',
    );
  },

  // 获取最近六月份报价单数量
  getLastSixMonthsOrders() {
    return http.get<GetLastSixMonthsOrdersRes>(
      '/blackboard/getLastSixMonthsOrders',
    );
  },

  // 获取报价单类型占比
  getOrdersType() {
    return http.get<GetOrdersTypeRes>('/blackboard/getOrdersType');
  },

  // 获取自己报价比例
  getOurselfOrderNum() {
    return http.get<GetOurselfOrderNumRes>('/blackboard/getOurselfOrderNum');
  },

  // 获取自己报价 公司报价比例
  getWholeOrderNum() {
    return http.get<GetWholeOrderNumRes>('/blackboard/getWholeOrderNum');
  },
};

