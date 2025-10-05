import http from '@/utils/http';
import type { Product } from '../../pages/product/library/Api/type/productApi.type';
import type { OrdersNoticeDeatilData } from '../orders/ordersNotice.type';
import type { SendProduct } from './inqueryApi.type';

// 询价接口
export default {
  // 添加询价
  addInquery(ordersId: string, proIds: string[], cids: number[]) {
    const formData = new FormData();
    formData.append('ordersId', ordersId);
    proIds.forEach((proId) => {
      formData.append('proIds[]', proId);
    });
    cids.forEach((cid) => {
      formData.append('cids[]', cid.toString());
    });
    return http.post<FormData, string>('/Inquery/addInquiry', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 创建询价连接
  createInqueryLink(data: {
    expiryDate: number;
    orderId: string;
    proIds: string; // "'P2022...', 'P2024...'"
    products: Product[];
  }) {
    return http.post<typeof data, { link: string }>(
      '/Inquery/createInquiryLink',
      data,
    );
  },

  // 获取询价列表
  getInqueryList(
    viewName: string,
    order: string,
    offset: number,
    limit: number,
    queryParams?: Record<string, string>,
  ) {
    const formData = new FormData();
    formData.append('order', order);
    formData.append('offset', offset.toString());
    formData.append('limit', limit.toString());
    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        formData.append(key, queryParams[key]);
        formData.append(`query[${key}]`, queryParams[key]);
      });
    }
    return http.post<FormData>(`/Inquery/list/${viewName}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 标记已读
  // type: 1为标记选定数据，2为所有
  // viewName: 模式，询价方（send）或被询价方（其余）
  markRead(viewName: string, ids: number[], type: number) {
    return http.post<{ view: string; ids: number[]; type: number }, string>(
      '/Inquery/markRead',
      {
        ids,
        type,
        view: viewName,
      },
    );
  },

  // 删除询价
  deleteInquiry(noticeIds: number[]) {
    const formData = new FormData();
    formData.append('nIds[]', String(noticeIds));
    return http.post<FormData, string>('/Inquery/deleteInquiry', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 分享询价
  setInqueryShare(data: { inqueryIdList: number[]; userIdList: number[] }) {
    return http.post<typeof data, string>('/Inquery/SetInqueryShare', data);
  },

  // 询价订单详情
  getInqueryNoticeDetails: (params: Record<string, string | number>) => {
    return http.get<OrdersNoticeDeatilData>(
      `/Inquery/InquryNoticeDetails`,
      params,
    );
  },

  // 导入历史报价
  setHistoryQuote(nid: number) {
    return http.get(`/Inquery/setHistoryQuote?nid=${nid}`);
  },

  // 发送询价订单
  sendInquery(
    inquiryId: number,
    sendProducts: SendProduct[],
    ordersId: string,
  ) {
    const formData = new FormData();
    formData.append('inquiryId', inquiryId.toString());
    formData.append('ordersId', ordersId);
    sendProducts.forEach((sendProduct) => {
      formData.append('num[]', sendProduct.num.toString());
      formData.append('proId[]', sendProduct.proId);
      formData.append('oldProId[]', sendProduct.oldProId);
      formData.append('productPrice[]', sendProduct.productPrice.toString());
    });
    return http.post<FormData, string>('/Inquery/sendOrdersClient', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
