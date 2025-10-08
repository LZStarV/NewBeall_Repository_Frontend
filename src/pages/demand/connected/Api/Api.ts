import http from '@/utils/http';

// 获取已对接需求列表
export const getConnectedDemandList = (params?: any) => {
  const requestParams: any = {};

  if (params) {
    if (params.order) {
      requestParams.order = params.order;
    }
    if (params.offset !== undefined) {
      requestParams.offset = params.offset;
    }
    if (params.limit !== undefined) {
      requestParams.limit = params.limit;
    }
    if (params.queryParams) {
      Object.assign(requestParams, params.queryParams);
    }
  } else {
    // 使用默认值
    requestParams.offset = 0;
    requestParams.limit = 50;
  }

  return http.get('/programmeor/list', requestParams);
};
