// 文案类型
export interface Instruction {
  companyId?: number;
  creatDate?: string;
  creatUser?: number;
  id: number | string;
  images?: string[];
  imgList?:
    | {
        additionalProp1: string;
        additionalProp2: string;
        additionalProp3: string;
      }
    | { url: string }[];
  insContent: string;
  insImgs: { url: string }[];
  insTitle: string;
  tagIds: string;
  tagList?: {
    companyId: number;
    content: string;
    createTime: string;
    id: string;
    style: string;
  }[];
  testList?: string[];
}

// 导出文案配置类型
export interface ExportProductDetailed {
  brand?: string;
  detailedList?: {
    brand: string;
    model: string;
    name: string;
    param: string;
    paramList: string[];
    pictureaddress: string;
    trait: string;
  }[];
  exportBrand?: boolean;
  exportImg?: boolean;
  exportModel?: boolean;
  exportOrders?: boolean;
  insIds: number[];
  model?: string;
  name?: string;
  ordersId?: string;
  param?: string;
  paramList?: string[];
  pictureaddress?: string;
  projectName: string;
  titlesWithNumbers: {
    id?: string;
    level: string;
    number: string;
    pageNumber?: number;
    title: string;
  }[];
  trait?: string;
}
