import http from '@/utils/http';
import type { ApprovalListResponse } from './approvalApi.type';

// 地区数据获取相关API
export default {
  /**
   * @description 获取报价审批列表
   * @param deleteordiscount 审批类型（删除（0）/打折（1）/ 审批（2））
   * @returns 报价审批列表
   */
  getApprovalList(
    deleteordiscount: number,
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
      });
    }
    return http.post<FormData, ApprovalListResponse[]>(
      `/approval/list?deleteordiscount=${deleteordiscount}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },
};
