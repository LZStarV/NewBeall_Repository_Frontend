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
