import http from '@/utils/http';

// 产品分类接口类型定义
export interface ProductCategory {
  categoryName: string;
  id: string;
  levels: number | string;
  parentName: string;
  pid: string;
  productItems: ProductCategory[] | string;
}

// 分类API响应接口
export interface CategoryResponse {
  code?: string;
  data?: ProductCategory[];
  msg?: string;
}

// 产品分类API
export const categoryApi = {
  // 获取产品大类列表
  getMainCategories: (): Promise<any> => {
    return http.get('/productItem/findItem1');
  },

  // 获取产品小类列表
  getSubCategories: (parentId: string): Promise<any> => {
    // 使用URLSearchParams发送application/x-www-form-urlencoded数据
    const params = new URLSearchParams();
    params.append('proItem1', parentId);

    return http.post('/productItem/findItem23', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    });
  },
};

export default categoryApi;
