import http from '@/utils/http';

// 产品控制器 Product Controller

export default {
  // 上传产品图片
  uploadProductImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return http.post<FormData, { name: string; url: string }>(
      '/product/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },

  // 查询所有产品分类列表
  queryProItem() {
    return http.post('/product/queryProItem');
  },

  // 查询
  getProPlatformSearch(name: string, brand: string, model: string) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('brand', brand);
    formData.append('model', model);
    return http.post<FormData>('/product/proPlatformSearch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取产品列表
  getProductList(
    province: string = '',
    city: string = '',
    name: string = '',
    brand: string = '',
    company: string = '',
    model: string = '',
    flag: number = 1,
    checkProducts: number = 1,
    provideCompany: string = '',
    order: string = 'desc',
    offset: number = 0,
    limit: number = 50,
  ) {
    const formData = new FormData();
    formData.append('province', province);
    formData.append('city', city);
    formData.append('name', name);
    formData.append('brand', brand);
    formData.append('company', company);
    formData.append('model', model);
    formData.append('flag', flag.toString());
    formData.append('checkProducts', checkProducts.toString());
    formData.append('provideCompany', provideCompany);
    formData.append('order', order);
    formData.append('offset', offset.toString());
    formData.append('limit', limit.toString());
    return http.post<FormData>('product/list', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取品牌列表
  getBrandList(name: string) {
    const formData = new FormData();
    formData.append('name', name);
    return http.post<FormData, string[]>('/product/getBrandS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取型号列表
  getQueryFieldValue(
    name: string,
    brand: string,
    model: string,
    queryField: string,
  ) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('queryField', queryField);
    return http.post<FormData, string[]>(
      '/product/getQueryFieldVal',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },

  // 获取模块详细（导入模块用）
  getModuleDetails(orderIds: string[], lastNum: number) {
    const formData = new FormData();
    formData.append('orderIds[]', JSON.stringify(orderIds));
    formData.append('lastNum', lastNum.toString());
    return http.post<FormData>('/orderModule/getModuleDetails', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
