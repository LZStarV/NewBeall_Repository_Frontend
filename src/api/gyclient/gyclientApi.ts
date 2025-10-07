import http from '@/utils/http';
import { objectToFormData } from '@/utils/formData';
import type {
  SupplierQueryListType,
  SupplierType,
  UserTreeType,
} from './gyclientApi.type';

// 供应商控制器 Supplier Controller
export default {
  // 新增供应商
  addSupplier: (data: Partial<SupplierType>, jstime: number) => {
    const formData = objectToFormData(data);
    return http.post(`/gyclient/add?jstime=${jstime}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 批量导入供应商
  addBatch: (data: FormData) => {
    return http.post('/gyclient/addBatch', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 复制供应商信息
  copySupplier: (id: string | number) => http.get(`/gyclient/codyGy?id=${id}`),

  // 删除供应商
  deleteSupplier: (supplierIds: number[], jstime: number) => {
    const formData = new FormData();
    supplierIds.forEach((id) => {
      formData.append('clientIds[]', id.toString());
    });
    return http.post(`/gyclient/delete?jstime=${jstime}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取供应商详情
  supplierDetail: (supplierId: string | number) =>
    http.get<SupplierType>(`/gyclient/detail/${supplierId}`),

  // 获取供应商详细信息
  getSupplierDetailed: (supplierId: string | number) =>
    http.get<SupplierType>('/gyclient/gyclientDetailed', {
      clientId: supplierId,
    }),

  // 共享供应商
  supplierShare: (supplierIds: number[], uIds: number[], jstime: number) => {
    const formData = new FormData();
    // 添加供应商ID数组
    supplierIds.forEach((id) => {
      formData.append('clients[]', id.toString());
    });
    // 添加用户ID数组
    uIds.forEach((id) => {
      formData.append('uIds[]', id.toString());
    });
    return http.post(`/gyclient/gyclientShare?jstime=${jstime}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 单个供应商回显树
  supplierShareTree: (supplierId: string | number) =>
    http.post<null, UserTreeType>(`/gyclient/gyclientShareTree/${supplierId}`),

  // 获取供应商列表
  supplierList: (params: SupplierQueryListType) => {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return http.post<FormData, { rows: SupplierType[]; total: number }>(
      '/gyclient/list',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },

  // 获取重复供应商列表
  supplierDuplicateList: (params: SupplierQueryListType) => {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return http.post<FormData, { rows: SupplierType[]; total: number }>(
      '/gyclient/list_dup',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },

  // 根据角色选择用户
  selectByRole: () => http.get('/gyclient/selectByRole'),

  // 修改供应商
  updateSupplier: (data: Partial<SupplierType>, jstime: number) => {
    const formData = objectToFormData(data);
    return http.post(`/gyclient/update?jstime=${jstime}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 供应商界面所用的用户树
  userTree: () => http.post<null, UserTreeType[]>('/gyclient/userTree'),
};
