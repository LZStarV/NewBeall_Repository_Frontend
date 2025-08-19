export interface AllProvinceRes {
  citys: string;
  provinceCode: number;
  provinceId: number;
  provinceName: string;
  shortName: string;
}

export interface AllCityRes {
  areas: string;
  cityCode: number;
  cityId: number;
  cityName: string;
  provinceCode: number;
  shortName: string;
}

export interface AllAreaRes {
  areaCode: number;
  areaId: number;
  areaName: string;
  cityCode: number;
  shortName: string;
}
