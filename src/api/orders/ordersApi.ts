// 报价单控制器 Orders Controller

import http from '@/utils/http';
import type {
  Instruction,
  ExportProductDetailed,
  Settle,
  OrderPrice,
  OrderListRow,
} from './orderApi.type';
import type { Product } from '../product/productApi.type';
// import { getExpiredAuth } from '@/api/auth/authApi';

export default {
  // 文案获取或搜索
  getInstructionList(insTitle: string, tagId: string) {
    // getExpiredAuth();
    return http.get<Instruction[]>('/orders/instructionList', {
      insTitle,
      tagId,
    });
  },
  // 添加/修改文案
  addInstruction(orderInstruction: Instruction) {
    return http.post('/orders/addInstruction', orderInstruction);
  },
  // 查询文案详细信息
  getInstructionDetail(id: number) {
    return http.get<Instruction>(`/orders/queryInstruction/${id}`);
  },
  // 删除文案
  deleteInstruction(id: number | string) {
    return http.get(`/orders/deleteInstruction/${id}`);
  },
  // 导出文案
  exportInstruction(exportProductDetailedOV: ExportProductDetailed) {
    return http.post('/orders/exportInstruction', exportProductDetailedOV);
  },

  // 报价单属性 category: 1 | 2 | 3
  getOrderType(category: number) {
    return http.get(`/ordersType/getOrderType?category=${category}`);
  },

  // 获取报价单结算方式
  getOrdersSettle() {
    return http.get<Settle[]>('/orders/GetOrdersSettle');
  },

  // 获取报价单列表
  getOrdersList(order: string, offset: number, limit: number) {
    const formData = new FormData();
    formData.append('order', order);
    formData.append('offset', offset.toString());
    formData.append('limit', limit.toString());
    return http.get<FormData>(`/orders/list`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取报价单价格
  getPriceByOrderId(orderId: string[]) {
    return http.post<string[], OrderPrice[]>(
      `/orders/getPriceByOrderId`,
      orderId,
    );
  },

  // 复制报价单
  copyOrders(orderId: string) {
    const formData = new FormData();
    formData.append('orderId', orderId);
    return http.post<FormData, { rows: OrderListRow[] }>(
      `/orders/copyOrders`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },

  // 获取报价单信息-操作记录
  getOrderLogsRecord(
    orderId: string,
    phaseType: number,
    offset: number,
    limit: number,
  ) {
    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('phaseType', phaseType.toString());
    formData.append('offset', offset.toString());
    formData.append('limit', limit.toString());
    return http.post<FormData>('/orders/orders_logs_record', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取报价产品信息列表
  getOrderProductList(orderId: string, page: number, limit: number) {
    return http.get<Product[]>('/orders/findProlist', { orderId, page, limit });
  },
};
