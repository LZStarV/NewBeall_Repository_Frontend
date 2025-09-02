import http from '@/utils/http';
import type {
  ClientQueryListType,
  ClientType,
  UserTreeType,
  GyClientQueryListType,
} from './clinetApi.type';

// 客户控制器 Client Controller
export default {
  // 新增客户
  addClient: (params: ClientType) => http.post('/client/add', null, { params }),

  // 共享客户
  clientShare: (clients: number[], uIds: number[]) =>
    http.post(
      `/client/clientShare?clients[]=${JSON.stringify(clients)}&uIds[]=${JSON.stringify(uIds)}`,
    ),

  // 单个客户回显树
  clientShareTree: (clientId: string | number) =>
    http.post<null, UserTreeType>(`/client/clientShareTree/${clientId}`),

  // 复制客户信息
  copyClient: (id: string | number) => http.get(`/client/codyClient/${id}`),

  // 删除客户
  deleteClient: (clientIds: number[], lientIds: number[]) =>
    http.post(
      `/client/delete?clientIds[]=${clientIds}&lientIds[]=${JSON.stringify(lientIds)}`,
    ),

  // 获取客户信息
  clientDetail: (clientId: string | number) =>
    http.post<null, ClientType>(`/client/detail/${clientId}`),

  // 刷新客户和供应商拼音
  flushPinyin: () => http.get('/client/flushPinyin'),

  // 获取客户类型列表
  getClientCategoryName: () => http.get('/client/getClientCategoryName'),

  // 获取客户详情
  getClientDetailed: (clientId: string | number) =>
    http.get<ClientType>('/client/getClientDetailed', {
      clientId,
    }),

  // 获取客户列表
  clientList: (params: ClientQueryListType) => {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return http.post<FormData, { rows: ClientType[] }>(
      '/client/list',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },

  // 获取重复客户列表
  clientDuplicateList: (params: ClientQueryListType) =>
    http.post<null, { rows: ClientType[] }>('/client/list_dup', null, {
      params,
    }),

  // 修改客户 nowdate: 2020-03-06 11:35:14
  updateClient: (params: unknown | { nowdate: string }) =>
    http.post('/client/update', null, { params }),

  // 客户与产品供应商界面所用的用户树
  userTree: () => http.post<null, UserTreeType[]>('/client/userTree'),

  // 获取供应商客户列表
  gyClientList: (params: GyClientQueryListType) => {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return http.post<FormData, { rows: ClientType[] }>(
      '/client/gyClientList',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },
};
