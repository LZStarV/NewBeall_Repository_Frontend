// 订单控制器 Orders Notice Controller

import http from '@/utils/http';
import type { OrdersNoticeDeatilData } from './ordersNotice.type';

export default {
  /**
   * @description 获取通知列表
   * @param viewName 视图名称
   * @returns 通知列表
   */
  getNoticeList: (
    viewName: string,
    order: string,
    offset: number,
    limit: number,
    queryParams?: Record<string, string>,
  ) => {
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
    return http.post<FormData>(`/ordersNotice/list/${viewName}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteNotice: (ordersNoticeId: string) => {
    const formData = new FormData();
    formData.append('ordersNoticeIds[]', ordersNoticeId);
    return http.post<FormData>(`/ordersNotice/delete`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getNoticeDetail: (params: Record<string, string | number>) => {
    return http.get<OrdersNoticeDeatilData>(
      `/ordersNotice/ordersNoticeDetails`,
      params,
    );
  },

  /** 产品供应商保存订单通知（入参关于产品信息的都是列表[]格式，各个列表数据一一对应） */
  closeAndSaveNotice: (params: Record<string, string | number>) => {
    const formData = new FormData();
    Object.keys(params).forEach((key) => {
      formData.append(key, String(params[key]));
    });
    return http.post<FormData>('/ordersNotice/close', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
