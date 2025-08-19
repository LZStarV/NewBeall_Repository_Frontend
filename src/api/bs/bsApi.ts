import http from '@/utils/http';
import type { AllAreaRes, AllCityRes, AllProvinceRes } from './bsApi.type';

export default {
  getAllProvince() {
    return http.post<undefined, AllProvinceRes[]>('/bsProvince/AllProvice');
  },

  getAllCity(provinceCode: number) {
    return http.post<undefined, AllCityRes[]>(
      `/bsCity/AllCity/${provinceCode}`,
    );
  },

  getAllArea(cityCode: number) {
    return http.post<undefined, AllAreaRes[]>(`/bsArea/AllArea/${cityCode}`);
  },
};
