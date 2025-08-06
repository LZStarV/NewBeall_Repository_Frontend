import http from '@/utils/http';
import type { Area, City, Province } from './areaApi.type';

// 地区数据获取相关API
export default {
  // 获取所有省份
  getProvince() {
    return http.post<null, Province[]>('/bsProvince/AllProvice');
  },

  // 获取省份的所有城市
  getCityOfProvince(provinceCode: string) {
    return http.post<null, City[]>(`/bsCity/AllCity/${provinceCode}`);
  },

  // 获取城市的所有区
  getAreaOfCity(cityCode: string) {
    return http.post<null, Area[]>(`/bsArea/AllArea/${cityCode}`);
  },
};
