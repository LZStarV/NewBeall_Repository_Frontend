// 报价单控制器 Orders Controller

import http from '@/utils/http';
import type {
  Instruction,
  ExportProductDetailed,
  Settle,
  QuotationListResponse,
  OrderPrice,
  OrderLogsRecordResponse,
  Quotation,
  OrderChargePerson,
  OrderModuleListResponse,
  OrderModuleDetail,
} from './orderApi.type';
import type { GetOrdersListParams } from './orderApi.type';
import type { Product } from '../../pages/product/library/Api/type/productApi.type';
import env from '@/utils/env';
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
  getOrdersList(params: GetOrdersListParams) {
    const formData = new FormData();

    // 必填
    formData.append('order', params.order);
    formData.append('offset', params.offset.toString());
    formData.append('limit', params.limit.toString());

    // 公共处理函数
    const appendField = (key: keyof GetOrdersListParams) => {
      const value = params[key];
      if (value !== undefined) {
        formData.append(key, String(value));
        formData.append(`query[${key}]`, String(value));
      }
    };

    // 非互斥字段
    [
      'type',
      'pageNumber',
      'attr',
      'chargePerson',
      'createName',
      'createDate',
    ].forEach((k) => appendField(k as keyof GetOrdersListParams));

    // 互斥字段
    ['projectName', 'contacts', 'ordersType'].forEach((k) =>
      appendField(k as keyof GetOrdersListParams),
    );

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
    formData.append('ordersId', orderId);
    return http.post<FormData>(`/orders/copyOrders`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 删除报价单
  deleteOrders(orderId: string) {
    const formData = new FormData();
    formData.append('ordersId', orderId);
    return http.post<FormData>('/orders/delete', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 导出报价单
  exportQuotation(
    orderId: string,
    derivePrime: boolean, // 是否同时导出成本价
    isExplanation: boolean, // 是否导出报价说明
    isSeal: boolean, // 是否加盖印章
  ) {
    window.location.href = `${env.getApiBaseUrl()}/orders/exportQuotation?ordersId=${orderId}&derivePrime=${Number(derivePrime)}&isExplanation=${Number(isExplanation)}&isSeal=${Number(isSeal)}`;
  },

  // 设置报价单属性
  setOrdersAttr(orderId: string, attr: number) {
    const formData = new FormData();
    formData.append('orderid', orderId);
    formData.append('attr', attr.toString());
    return http.post<FormData>('/orders/setPropert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取报价单信息-操作记录
  getOrderLogsRecord(
    orderId: string,
    phaseType: number,
    offset: number,
    limit: number,
  ) {
    const formData = new FormData();
    formData.append('ordersId', orderId);
    formData.append('phaseType', phaseType.toString());
    formData.append('offset', offset.toString());
    formData.append('limit', limit.toString());
    return http.post<FormData, OrderLogsRecordResponse>(
      '/orders/orders_logs_record',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },

  // 获取报价单详情
  getOrderDetail(ordersId: string) {
    return http.get<QuotationListResponse>('/orders/GetOrdersDetailed', {
      ordersId,
    });
  },

  // 获取报价产品信息列表
  getOrderProductList(orderId: string, page: number, limit: number) {
    return http.get<{ count: number; data: Product[] }>('/orders/findProlist', {
      orderId,
      page,
      limit,
    });
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
    return http.post<
      Quotation,
      {
        code: '200' | '300';
        data: { orderId: string; sendType: boolean } | '';
        msg: string;
      }
    >('/orders/writeQuotation', quotation);
  },

  // 获取临时报价列表
  getQuotationList(
    order: string = 'desc',
    offset: number,
    limit: number,
    projectName?: string,
    contacts?: string,
    createDate?: string,
    orderstype?: string,
  ) {
    const formData = new FormData();
    formData.append('order', order);
    formData.append('offset', offset.toString());
    formData.append('limit', limit.toString());
    if (projectName) {
      formData.append('projectName', projectName);
    }
    if (contacts) {
      formData.append('contacts', contacts);
    }
    if (createDate) {
      formData.append('createDate', createDate);
    }
    if (orderstype) {
      formData.append('orderstype', orderstype);
    }
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
    projectName?: string,
    ordersType1?: string,
    ordersType2?: string,
    ordersType3?: string,
    ordersType4?: string,
    ordersType5?: string,
    ordersType6?: string,
    ordersType7?: string,
  ) {
    const formData = new FormData();

    // 必填参数
    formData.append('order', order);
    formData.append('offset', offset.toString());
    formData.append('limit', limit.toString());

    // 可选参数处理
    const optionalParams = {
      projectName,
      ordersType1,
      ordersType2,
      ordersType3,
      ordersType4,
      ordersType5,
      ordersType6,
      ordersType7,
    };

    Object.entries(optionalParams).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
        formData.append(`query[${key}]`, String(value));
      }
    });

    return http.post<
      FormData,
      { rows: OrderModuleListResponse[]; total: number }
    >('/orderModule/moduleList', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取报价单模块详情
  getOrderModuleDetail(orderId: string) {
    return http.get<OrderModuleDetail>('/orderModule/GetOrderModuleDetail', {
      ordersId: orderId,
    });
  },

  // 设置报价单属性
  setOrdersProperty(
    type: number,
    important: boolean,
    purchase: boolean,
    lockMark: boolean,
    integration: number,
    shareName: string,
    orderid: string,
  ) {
    const formData = new FormData();
    formData.append('type', type.toString());
    formData.append('important', Number(important).toString());
    formData.append('purchase', Number(purchase).toString());
    formData.append('lockMark', Number(lockMark).toString());
    formData.append('integration', integration.toString());
    formData.append('shareName', shareName);
    formData.append('orderid', orderid);
    return http.post<FormData>('/orders/setProperty', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  //发送报价单给客户
  sendOrdersClient(orderId: string) {
    const formData = new FormData();
    formData.append('ordersId', orderId);
    return http.post<FormData>('/orders/sendOrdersClient', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 查询报价单供应商
  queryOrdersStatus(orderId: string) {
    const formData = new FormData();
    formData.append('ordersId', orderId);
    return http.post<FormData>('/ordersNotice/queryOrdersStatu', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取当前报价单协作状态
  getCoopState(orderId: string) {
    const formData = new FormData();
    formData.append('orderId', orderId);
    return http.post<FormData>('/orders/coopState', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 开始协作
  coopStart(orderId: string, coopUser: string, projectName: string) {
    const formData = new FormData();
    formData.append('ordersId', orderId);
    formData.append('coopUser', coopUser);
    formData.append('projectName', projectName);
    return http.post<FormData>('/orders/coopStart', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 是否为合作单
  isCoop(ordersId: string) {
    const formData = new FormData();
    formData.append('ordersId', ordersId);
    return http.post<
      FormData,
      { code: '200' | '300'; data: boolean; msg: string }
    >('/orders/isCoop', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
