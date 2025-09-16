export interface ApprovalData {
  approvalName: string; // 审批人
  createDate: string; // 申请时间
  deleteordiscount: number;
  discountprice: number;
  handler: string;
  id: number; // aid
  ident: string;
  isDelete: string;
  modifyprice: number;
  msg: string;
  msg2: string;
  oid: string; // 报价单编号/订单id
  proid: string;
  projectName: string; // 工程项目名称
  readable: number;
  state: number; // 状态 1：通过 2：驳回 其他数字：待审批
  superiorid: number;
  uid: number; // 提交ID
  uname: string; // 提交人
  updateDate: string; // 审批时间
  version: number;
}

export interface ApprovalListResponse {
  rows: ApprovalData[];
  total: number;
}
