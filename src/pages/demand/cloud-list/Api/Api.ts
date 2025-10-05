import http from '@/utils/http';

// 获取云端需求表单数据
export const getDemandList = (params: any) => {
  const requestParams: any = {};
  requestParams.order = params.order;
  requestParams.offset = params.offset;
  requestParams.limit = params.limit;
  requestParams.queryParams = params.queryParams;
  return http.get('/programme/demandList', requestParams, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
