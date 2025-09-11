// 订单控制器 Orders Notice Controller

import http from '@/utils/http';

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
};
