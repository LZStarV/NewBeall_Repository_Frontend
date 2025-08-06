// 报价单控制器 Orders Controller

import http from '@/utils/http';
import type {
  Instruction,
  ExportProductDetailed,
  Settle,
  OrderPrice,
  OrderListRow,
  Quotation,
  QuotationListResponse,
  OrderModuleListResponse,
  OrderChargePerson,
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

  // 获取报价单类型列表 category: 1 | 2 | 3 | 4 | 5 | 6 | 7
  getOrderType(category: number, ordersId?: string) {
    return http.get(
      `/ordersType/getOrderType?category=${category}${ordersId ? `&ordersId=${ordersId}` : ''}`,
    );
  },

  // 获取报价单结算方式
  getOrdersSettle() {
    return http.get<Settle[]>('/orders/GetOrdersSettle');
  },

  // 获取全部报价单属性
  getOrdersType() {
    return http.get<{ id: number; name: string }[]>('/orders/GetOrdersType');
  },

  // 获取报价单列表（历史报价）
  getOrdersList(
    order: string,
    offset: number,
    limit: number,
    type?: number,
    pageNumber?: number,
  ) {
    const formData = new FormData();
    formData.append('order', order);
    formData.append('offset', offset.toString());
    formData.append('limit', limit.toString());
    if (type !== undefined) {
      formData.append('type', type.toString());
    }
    if (pageNumber !== undefined) {
      formData.append('pageNumber', pageNumber.toString());
    }
    return http.post<
      FormData,
      { rows: QuotationListResponse[]; total: number }
    >(`/orders/list`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取报价单价格
  getPriceByOrderId(orderId: string[]) {
    return http.post<string[], Record<string, OrderPrice>>(
      '/orders/getPriceByOrdersId',
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

  // 获取报价单详情
  getOrderDetail(ordersId: string) {
    return http.get<QuotationListResponse>('/orders/GetOrdersDetailed', {
      ordersId,
    });
  },

  // 获取报价产品信息列表
  getOrderProductList(orderId: string, page: number, limit: number) {
    return http.get<Product[]>('/orders/findProlist', { orderId, page, limit });
  },

  // 获取查看方案云列表
  getOrderShareList(page: number, limit: number) {
    return http.get('ordersShare/list', { page, limit });
  },

  // 获取全部项目负责人列表
  getOrdersChargePerson() {
    return http.get<OrderChargePerson[]>('/orders/OrdersChargePerson');
  },

  // 获取全部制单人列表
  getOrdersCreateUserList() {
    return http.get<string[]>('/orders/GetOrdersCreateUserList');
  },

  // 写入临时报价单
  writeQuotation(quotation: Quotation) {
    return http.post<Quotation>('/orders/writeQuotation', quotation);
  },

  // 获取临时报价列表
  getQuotationList(order: string = 'desc', offset: number, limit: number) {
    const formData = new FormData();
    formData.append('order', order);
    formData.append('offset', offset.toString());
    formData.append('limit', limit.toString());
    return http.post<
      FormData,
      { rows: QuotationListResponse[]; total: number }
    >('/orders/Templist', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取报价模块
  getOrderModuleList(
    order: string = 'desc',
    offset: number = 0,
    limit: number = 50,
  ) {
    const formData = new FormData();
    formData.append('order', order);
    formData.append('offset', offset.toString());
    formData.append('limit', limit.toString());
    return http.post<
      FormData,
      { rows: OrderModuleListResponse[]; total: number }
    >('/orderModule/moduleList', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
