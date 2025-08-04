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

// 结算单类型
export interface Settle {
  id: number;
  method: string;
}

// 报价单价格类型
export interface OrderPrice {
  orderId: string;
  priceSum: number;
  purchasepriceSum: number;
}

// 报价单列表行类型
export interface OrderListRow {
  chargePerson: number;
  chargePersonInfo: string;
  clientId: number;
  contacts: string;
  coopUser: string;
  coopUserId: string;
  createDate: string;
  deliveryTime: string;
  important: number;
  isAudit: number;
  isSeal: string;
  isXJ: string;
  lockMark: string;
  lockOwner: string;
  lockOwnerName: string;
  menuIcon: string;
  method: string;
  money: string;
  name: string;
  ordersId: string;
  ordersIntegration: number;
  ordersType1: string;
  ordersType2: string;
  ordersType3: string;
  overruleMsg: string;
  parentId: string;
  priceSum: string;
  projectName: string;
  projectRemark: string;
  purchase: number;
  purchasepriceSum: string;
  shareName: string;
  shareOrders: number;
  type: number;
  uid: number;
  updateDate: string;
  updateUser: string;
}
