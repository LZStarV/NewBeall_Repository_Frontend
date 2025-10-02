import http from '@/utils/http';

//获取所有省份
export const getProvinces = () => {
  return http.post('/bsProvince/AllProvice');
};

//获取闲置云列表数据
export const getIdleCloudList = (params?: any) => {
  const queryParams = {
    page: params?.page || '1',
    limit: params?.limit || '50',
    ...params,
  };
  return http.get('/product/inventoryList', queryParams);
};

//获取闲置云公司列表
export const getIdleCloudCompanyList = () => {
  //model=
  return http.post('/product/inventoryCompanyList');
};

//获取闲置云品牌
export const getIdleCloudBrandList = () => {
  const params = new URLSearchParams();
  params.append('search', 'brand');
  return http.post('/product/inventoryBrandOrModelList', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};
//获取闲置云型号
export const getIdleCloudModelList = () => {
  const params = new URLSearchParams();
  params.append('search', 'model');
  return http.post('/product/inventoryBrandOrModelList', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

//使用PromiseAll实现批量网络请求
export const getBatchData = async () => {
  const [provinces, idleCloudList, brands, models, companies] =
    await Promise.all([
      getProvinces(),
      getIdleCloudList(),
      getIdleCloudBrandList(),
      getIdleCloudModelList(),
      getIdleCloudCompanyList(),
    ]);

  return {
    provinces: provinces.data || provinces,
    idleCloudList: idleCloudList.data || idleCloudList,
    brands: brands.data || brands,
    models: models.data || models,
    companies: companies.data || companies,
  };
};
