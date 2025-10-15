import http from '@/utils/http';

// 用户权限表控制管理 Auth Controller
// 判断用户可用功能（返回code=200为有，400为没有）
export function getExpiredAuth() {
  return http.get<{ code: number }>('/auth/expiredAuth');
}

// 订单审批记录处理信息
export function getOrdersNoticeHandlerAuth() {
  return http.post<{ code: string; data: string; msg: string }>(
    '/auth/ordersNoticeHandlerAuth',
  );
}

// 写入报价单鉴权
export function writeQuotationAuth() {
  return http.post<{ code: string; data: string; msg: string }>(
    '/auth/writeQuotationAuth',
  );
}
