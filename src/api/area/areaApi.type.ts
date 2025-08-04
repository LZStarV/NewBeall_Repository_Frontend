// 地区相关类型
export interface Province {
  citys: string;
  provinceCode: number;
  provinceId: number;
  provinceName: string;
  shortName: string;
}

export interface City {
  areas: string;
  cityCode: number;
  cityId: number;
  cityName: string;
  provinceCode: number;
  shortName: string;
}

export interface Area {
  areaCode: number;
  areaId: number;
  areaName: string;
  cityCode: number;
  shortName: string;
}
