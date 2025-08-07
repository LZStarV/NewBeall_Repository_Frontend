import http from '@/utils/http';
import type {
  GetBlackboardDataRes,
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
    return http.post<GetLastSixMonthsOrdeNoticeRes>(
      '/blackboard/getLastSixMonthsOrdeNotice',
    );
  },

  // 获取最近六月份报价单数量
  getLastSixMonthsOrders() {
    return http.post<GetLastSixMonthsOrdersRes>(
      '/blackboard/getLastSixMonthsOrders',
    );
  },

  // 获取报价单类型占比
  getOrdersType() {
    return http.post<GetOrdersTypeRes>('/blackboard/getOrdersType');
  },

  // 获取自己报价比例
  getOurselfOrderNum() {
    return http.post<GetOurselfOrderNumRes>('/blackboard/getOurselfOrderNum');
  },

  // 获取自己报价 公司报价比例
  getWholeOrderNum() {
    return http.post<GetWholeOrderNumRes>('/blackboard/getWholeOrderNum');
  },

  // 获取工作台数据
  getBlackboardData() {
    return http.get<GetBlackboardDataRes>('/blackboard/GetBlackboardData');
  },
};
