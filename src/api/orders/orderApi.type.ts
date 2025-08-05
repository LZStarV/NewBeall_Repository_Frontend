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

export interface OrderDetail {
  brand: string;
  changeState: number;
  companyId: number;
  costprice: number;
  createrid: number;
  discountprice: number;
  encryptId: string;
  gyCompany: number;
  gysource: string;
  id: number;
  interestrateprice: number;
  inventoryPrice: number;
  inventoryRemark: string;
  isInventory: number;
  isTemporary: number;
  marketprice: number;
  model: string;
  modifyprice: number;
  name: string;
  num: number;
  oldEncryptId: string;
  orderId: string;
  param: string;
  pictureaddress: string;
  pictureaddressOne: string;
  price: number;
  productCurrChainId: string;
  productCurrState: number;
  productId: string;
  profitprice: number;
  purchaseprice: number;
  receiveid: number;
  recommend: true;
  remark: string;
  sequence: number;
  subproject: string;
  subprojectClass: string;
  subprojectColor: string;
  subprojectLevel: string;
  subprojectParent: string;
  trait: string;
  unit: string;
  xjProductId: string;
}

export interface OrderInquiry {
  cgnoticeid: string;
  cgnoticetype: number;
  companyid: number;
  createrid: number;
  createtime: string;
  delflag: number;
  gynoticeid: string;
  gynoticetype: number;
  id: number;
  link: string;
  orderid: string;
  ordertype: number;
  proIds: string;
  receiveid: string;
  sendordersid: string;
  tel: string;
  updateTimeCg: string;
  updateTimeGy: string;
  version: number;
}

// 临时报价单类型
export interface Quotation {
  DeliveryAddress: string;
  DeliveryTime: string;
  approvalType?: number;
  area: string;
  chargePerson: number;
  chargePersonInfo: string;
  city: string;
  clientBankAccount: string | null;
  clientBankName: string | null;
  clientId: number;
  clientTexId: string | null;
  companyAddres: string;
  companyName: string;
  contactPhone: string;
  contacts: string;
  deliveryMethod: string;
  explanation: string | null;
  orderdetailsList: OrderDetail[];
  ordersCharacter: string;
  ordersId?: string; // 新建报价单暂无id
  ordersInquiryList?: OrderInquiry[];
  orderstype1: string;
  orderstype2: string;
  orderstype3: string;
  param: string;
  projectName: string;
  projectRemark: string;
  province: string;
  selfBank: string;
  selfId: number;
  settleMethod: number;
  shareOrders?: number; // 新建报价单暂无
  type?: number; // 新建报价单暂无
  version?: number; // 新建报价单暂无
}

// Templist 返回类型
export interface QuotationListResponse extends Quotation {
  chargePerson: number;
  chargePersonInfo: string;
  clientId: number;
  contacts: string;
  coopUser: string;
  coopUserId: string;
  createDate: string;
  deliveryTime: string;
  deliveryAddress: string;
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
  ordersCharacter: string;
  ordersIntegration: number;
  ordersType1: string;
  ordersType2: string;
  ordersType3: string;
  overruleMsg: string;
  parentId: string;
  priceSum: number;
  projectName: string;
  projectRemark: string;
  purchase: number;
  purchasepriceSum: number;
  shareName: string;
  shareOrders: number;
  type: number;
  uid: number;
  updateDate: string;
  updateUser: string;
}

export interface OrderModuleListResponse {
  beFromCompany: string;
  chargePerson: string;
  chargePersonInfo: string;
  clientId: string;
  contacts: string;
  coopUser: string;
  coopUserId: string;
  createDate: string;
  deliveryTime: string;
  gyClient: number;
  important: string;
  isAudit: number;
  isSeal: string;
  isXJ: number;
  lockMark: string;
  lockOwner: string;
  lockOwnerName: string;
  menuIcon: string;
  method: string;
  money: string;
  name: string;
  ordersId: string;
  ordersIntegration: string;
  ordersType1: string;
  ordersType2: string;
  ordersType3: string;
  overruleMsg: string;
  parentId: string;
  priceSum: string;
  projectName: string;
  projectRemark: string;
  purchase: string;
  purchasepriceSum: string;
  rate: string;
  shareName: string;
  shareOrders: string;
  type: string;
  uid: number;
  updateDate: string;
  updateUser: string;
}

// 项目负责人数据
export interface OrderChargePerson {
  id: number;
  name: string;
}
