import type { Product } from '@/pages/product/library/type';

export interface OrderProduct extends Product {
  changeState: number;
  createrid: string;
  encryptId: string;
  oldEncryptId: string;
  orderId: string;
  productCurrChainId: string;
  productCurrState: string;
  productId: string;
  profitprice: string;
  recommend: false;
  remark: string;
  sequence: string;
  subproject: string; // 子项目
  subprojectClass: string;
  subprojectColor: string;
  subprojectLevel: string;
  subprojectParent: string;
  xjProductId: string;
}

export interface ProductCloudSearchParamData {
  brands: string[];
  models: string[];
  proCompanys: string[];
}
