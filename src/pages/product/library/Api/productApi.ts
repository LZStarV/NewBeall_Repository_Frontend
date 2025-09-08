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
    name: string = '', // 产品名称检索
    brand: string = '', // 品牌筛选检索
    company: string = '', // 公司筛选检索
    model: string = '', // 型号筛选检索
    flag: number = 1, // 自建库1 产品云2 闲置云3
    checkProducts: number = 1, // 自建库1 产品云2 闲置云3
    provideCompany: string = '', // 公司筛选检索
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
    return http.post<FormData>('/product/list', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取品牌列表
  getBrandList(name: string = '') {
    const formData = new FormData();
    formData.append('name', name);
    return http.post<FormData, string[]>('/product/getBrandS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取产品类型列表
  getModelList(name: string = '', brand: string = '') {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('brand', brand);
    return http.post<FormData, string[]>('/product/getModelS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 查询所有产品来源公司
  getQueryFieldValue(
    name: string = '',
    brand: string = '',
    model: string = '',
    queryField: string = 'provideCompany', // 查询内容(provideCompany为查询产品来源公司（采购商），uname为查询产品创建人)
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
