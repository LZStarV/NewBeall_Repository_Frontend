export interface InqueryRow {
  id: number;
  orderid: string; // 订单编号
  projectName: string; // 项目名称
  companyName: string; // 发送/接收公司
  uname: string; // 发布者
  phone: string; // 联系方式
  createtime: string; // 通知时间
  typeName: string; // 订单状态
  link: string;
  isShare: string;
  shareName: string;
  gynoticetype: number;
  gynoticeid: string;
  cgnoticetype: number;
  cgnoticeid: string;
  checkCompanyId: number; // 公司id，用于点击公司名称后续查询
}

export interface InqueryListResponse {
  rows: InqueryRow[];
  total: number;
}

export interface SendProduct {
  proId: string;
  oldProId: string;
  num: number;
  productPrice: number;
}

// 询价商品数据
export interface InquryProductData {
  pName: string; // 产品名称
  proId: string; // 产品id
  productDataList: ProductData[];
}

// 询价商品数据
export interface ProductData {
  brand: string; // 品牌
  companyName: string; // 报价公司
  id: number;
  isLowestPrice: boolean; // 更低价，显示大拇指
  model: string; // 规格/型号
  name: string; // 产品名称
  nub: number; // 数量
  ordersId: string; // 订单id
  param: string[];
  price: string; // 单价
  proId: string; // 产品id
  trait: string; // 参数特征
}
