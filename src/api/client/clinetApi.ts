import http from '@/utils/http';
import { objectToFormData } from '@/utils/formData';
import type {
  ClientQueryListType,
  ClientType,
  UserTreeType,
  ClientCategoryNameRes,
} from './clinetApi.type';

// 客户控制器 Client Controller
export default {
  // 新增客户
  addClient: (data: any, jstime: number) => {
    const formData = objectToFormData(data);
    return http.post(`/client/add?jstime=${jstime}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 共享客户
  clientShare: (clientIds: number[], uIds: number[], jstime: number) => {
    const formData = new FormData();
    // 添加客户ID数组
    clientIds.forEach((id) => {
      formData.append('clients[]', id.toString());
    });
    // 添加用户ID数组
    uIds.forEach((id) => {
      formData.append('uIds[]', id.toString());
    });
    return http.post(`/client/clientShare?jstime=${jstime}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 单个客户回显树
  clientShareTree: (clientId: string | number) =>
    http.post<null, UserTreeType>(`/client/clientShareTree/${clientId}`),

  // 复制客户信息
  copyClient: (id: string | number) => http.get(`/client/codyClient?id=${id}`),

  // 删除客户
  deleteClient: (clientIds: number[], jstime: number) => {
    const formData = new FormData();
    clientIds.forEach((id) => {
      formData.append('clientIds[]', id.toString());
    });
    return http.post(`/client/delete?jstime=${jstime}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取客户信息
  clientDetail: (clientId: string | number) =>
    http.post<null, ClientType>(`/client/detail/${clientId}`),

  // 刷新客户和供应商拼音
  flushPinyin: () => http.get('/client/flushPinyin'),

  // 获取客户类型列表
  getClientCategoryName: () =>
    http.get<ClientCategoryNameRes[]>('/client/getClientCategoryName'),

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
    return http.post<FormData, { rows: ClientType[]; total: number }>(
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
  clientDuplicateList: (params: ClientQueryListType) => {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return http.post<FormData, { rows: ClientType[]; total: number }>(
      '/client/list_dup',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },

  // 修改客户 nowdate: 2020-03-06 11:35:14
  updateClient: (data: any, jstime: number) => {
    const formData = objectToFormData(data);
    return http.post(`/client/update?jstime=${jstime}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 客户与产品供应商界面所用的用户树
  userTree: () => http.post<null, UserTreeType[]>('/client/userTree'),
};
