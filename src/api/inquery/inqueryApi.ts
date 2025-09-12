import http from '@/utils/http';
import type { Product } from '../../pages/product/library/Api/type/productApi.type';

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
};
