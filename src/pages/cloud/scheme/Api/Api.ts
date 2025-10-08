import http from '@/utils/http';
//获取一级报价单类型
export const getFirstOrderType = () => {
  return http.get('/ordersType/getOrderType', { category: '1' });
};

//获取二级报价单类型
export const getSecondOrderType = () => {
  return http.get('/ordersType/getOrderType', { category: '2' });
};

//获取三级报价单类型
export const getThirdOrderType = () => {
  return http.get('/ordersType/getOrderType', { category: '3' });
};

//使用PromiseAll实现批量网络请求
export const getOrderType = async () => {
  const [firstOrderType, secondOrderType, thirdOrderType] = await Promise.all([
    getFirstOrderType(),
    getSecondOrderType(),
    getThirdOrderType(),
  ]);
  return {
    firstOrderType,
    secondOrderType,
    thirdOrderType,
  };
};

// 获取方案列表数据
export const getSchemeList = (params?: any) => {
  return http.get('/scheme/list', params);
};
