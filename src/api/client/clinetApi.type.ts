// 客户类型
export interface ClientType {
  address: string;
  assignUser: number;
  clientArea: string;
  clientCategory: number;
  clientCity: string;
  clientProvince: string;
  clientSize: number;
  clientSizeMsg: string;
  clientSource: string;
  clientStatus: string;
  clientStreet: string;
  clientWebsite: string;
  contactUser: string;
  contacts: string;
  createtime: string;
  createuser: number;
  delflag: number;
  email: string;
  fax: string;
  id: number;
  job: string;
  modifytime: string;
  note: string;
  pinyin: string;
  qq: string;
  remark: string;
  revisitTime: string;
  tel: string;
  wechat: string;
}

// 查询客户列表类型
export interface ClientQueryListType {
  // 客户类型（可为空，查询时使用）
  categoryName?: string;
  // 客户来源(可为空，查询时使用)
  clientSource?: string;
  // 跟进状态(可为空，查询时使用)
  clientStatus?: string;
  // 联系人名称(可为空，查询时使用)
  contactUser?: string;
  // 公司名称(可为空，查询时使用)
  contacts?: string;
  // 每页数量
  limit: number;
  // 目前浏览的总数
  offset: number;
  // 排序（可为空，asc或desc）
  order?: string;
  // 拼音查询
  pinyin?: string;
  // 排序类型，根据创建时间排序或者拼音（可为空，revisitTime或pinyin）
  sort?: string;
}

// 查询供应商客户列表类型
export interface GyClientQueryListType extends ClientQueryListType {
  gyType?: string;
}

// 用户树类型
export interface UserTreeType {
  checked: boolean;
  chkDisabled: boolean;
  id: string;
  isOpen: boolean;
  isUser: string;
  name: string;
  nocheck: boolean;
  open: boolean;
  pId: string;
}

export interface ClientCategoryNameRes {
  clientCategory: string;
  id: number;
  type: number;
}
