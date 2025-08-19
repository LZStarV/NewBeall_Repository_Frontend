export interface CompanyBusiness {
  businessName: string;
  businessType: string;
  cid: number;
  icon: string;
  id: number;
  summary: string;
}

export interface CompanyData {
  abbreviation: string; // 公司简称
  adminId: string;
  agencyfile: string; // 代理证书
  aiindate: string; // ai服务有限期
  area: string; // 所在区
  areaCode: number; // 所在区代码
  auditStatus: number; // 审核状态
  bankAccount: string; // 银行账号
  bankName: string; // 开户行
  bonusPoints: string;
  business: string; // 主营业务
  career: string; // 职位
  career2: string;
  career3: string;
  cg: number; // 工程集成商
  city: string; // 所在市
  companyAddress: string; // 公司地址
  companyFax: string; // 公司座机
  companyName: string; // 公司名字
  companyName2: string; // 联系人姓名2
  companyName3: string; // 联系人姓名3
  companyPhone: string; // 公司手机号
  companyPhone2: string; // 联系人电话2
  companyPhone3: string; // 联系人电话3
  companyRegisterMonery: string; // 注册资本
  companyRegisterTime?: string; // 公司注册时间
  companyRegistertime: string; // 注册时间
  companyRole: string; // 公司类型,供应商(gy),集成商（cg）
  companyfile01: string; // 施工资质
  companyfile02: string; // 营业执照
  companyfile03: string; // 合同业绩
  companyfile04: string; // 安全生产许可证
  companyfile05: string; // 开户许可证
  companyfile06: string; // 其他附件
  companyfile07: string; // 其他附件2
  companylegalperson: string; // 企业法人代表
  companyurl: string; // 公司网址
  dd: ref; // 主营业务
  delflag: number;
  email: string;
  f1: string;
  f2: string;
  file04: string; // 等于1时，保存file041参数的链接，不等于时保存此参数
  file041: string; // 安全生产许可证
  freezeflag: string;
  fristSpell: string; // 简拼
  gy: number; // 产品供应商
  id: number;
  integration: number; // 积分
  isWX: number;
  loginCount: number;
  logoUrl: string;
  memory: number; // 公司可分配内存
  moduleName: string; // 修改类型，可为空，如果修改基本信息就传(basicInfo),公司注册信息传(registerInfo)
  msg: string;
  name: string;
  performance: string;
  performance01: string;
  performance02: string;
  performance03: string;
  performance04: string;
  proSize: string;
  profile: string;
  province: string;
  pushMessage: string;
  qualification: string;
  remarks: string;
  sex: number;
  taxId: string;
  totalMemory: number;
  verifiedStatus: number;
  vipindate: string;
  workarea: string;
  workarea2: string;
  yxRegisterTime: string; // 公司注册时间
}

// 公司信息
export interface CompanyInfo {
  companyBusinessData: CompanyBusiness[];
  companyData: CompanyData;
}

export interface ComnpanyRoleMapData {
  companyId: number;
  id: number;
  isOpen: number;
  maxFileSize: string;
  modelName: string;
  statusIcon: string;
  verifiedDesc: string;
  verifiedStatus: number;
}

// 公司类型用户
interface CompanyUserType {
  account: string;
  avatar: string;
  birthday: string;
  companyId: number;
  createtime: string;
  deptid: number;
  discount: string;
  email: string;
  flexCustom: string;
  hasPerm: string;
  id: number;
  isSignup: number;
  name: string;
  password: string;
  phone: string;
  profession: string;
  pushMessage: number;
  qqOpenid: string;
  roleid: string;
  salt: string;
  sex: number;
  status: number;
  times: number;
  userRole: number;
  version: string;
  wxOpenid: string;
}

export interface CompanyDetailResponseData {
  browseCount: number;
  company: CompanyData;
  companyBusList: CompanyBusiness[];
  companyInfoRole: string;
  companyMonery: string;
  companyRegisterTime: string;
  modelName: string;
  money: string;
  perfection: number;
  roleMap: {
    companyAttachment: ComnpanyRoleMapData;
    registerInfo: ComnpanyRoleMapData;
    achievement: ComnpanyRoleMapData;
    businessAreaInfo: ComnpanyRoleMapData;
    qualifica: ComnpanyRoleMapData;
    profile: ComnpanyRoleMapData;
    businessInfo: ComnpanyRoleMapData;
    basicInfo: ComnpanyRoleMapData;
  };
  user: CompanyUserType;
}

// 获取公司查看记录列表
export interface BrowseListRes {
  companyId: number;
  companyName: string;
  createDate: string;
  id: number;
  isRead: number;
  targetCompanyId: number;
}
