import type { ModuleOrderDetail } from './orderApi.type';

export interface OrdersNoticeRow {
  id: number;
  orderid: string; // 订单编号
  projectName: string; // 项目名称
  companyName: string; // 发送/接收公司
  uname: string; // 发布者
  phone: string; // 联系方式
  createtime: string; // 通知时间
  typeName: string; // 订单状态
  gynoticetype: number;
  gynoticeid: string;
  cgnoticetype: number;
  cgnoticeid: string;
  checkCompanyId: number; // 公司id，用于点击公司名称后续查询
}

export interface OrdersNoticeListResponse {
  rows: OrdersNoticeRow[];
  total: number;
}

export interface OrdersNoticeDeatilData {
  cglogList: LogData[];
  company: string; // 接收公司
  discount: string;
  distinctBrand: string[]; // 品牌名称合集（供筛选用）
  nid: string;
  orderType: string;
  orderid: string; // 订单id
  orders: ModuleOrderDetail;
  pSize: string;
  proIds: string;
  productList: ProductData[];
  projectAddress: string;
  receiveName: (string | null)[];
  sureDisplay: boolean;
  uplogList: LogData[];
  viewName: string;
}

export interface LogData {
  createtime: string; // 审批时间
  createuserid: string;
  id: string;
  logcontent: string; // 内容HTML
  logtype: string;
  opid: string;
  receiveCId: string;
  receiveId: string;
  succeed: string;
  ucid: string;
  ucname: string;
  uname: string; // 处理者
  version: number;
}

export interface ProductData {
  approved: true;
  autoHandle: string;
  brand: string; // 品牌名称
  company: string;
  companyId: string;
  costprice: string;
  createtime: string;
  createuser: string;
  defaultDiscount: string;
  delflag: string;
  discountprice: string;
  gyCompany: string;
  gysource: string;
  id: string;
  interestrateprice: string;
  inventory: string;
  inventoryPrice: string;
  inventoryRemark: string;
  isInventory: string;
  isOpen: string;
  isTemporary: string;
  item: string;
  marketprice: string;
  model: string; // 规格型号
  modifyprice: string; // 折后单价
  modifytime: string;
  modifyuser: string;
  name: string; // 产品名称
  noStarParam: string;
  notStarTrait: string;
  num: string; // 数量
  param: string;
  pendingParam: string;
  pictureaddress: string;
  pictureaddressOne: string;
  points: string;
  price: string; // 原单价
  proId: string; // 产品编号
  productAtlas: string;
  purchaseprice: string;
  receiveName: string;
  receiveid: string;
  repeal: string;
  sales: string;
  sourceType: string;
  subprojectClass: string;
  trait: string;
  uname: string;
  unit: string;
  version: string;
}
