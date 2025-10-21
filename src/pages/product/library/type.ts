// 产品接口类型定义
export interface Product {
  checked?: boolean; // 前端添加的选中状态
  approved: boolean; // 审核状态
  autoHandle: number; // 自动处理
  brand: string; // 品牌
  company: string; // 公司
  companyId: number; // 公司ID
  costprice: string; // 成本价
  createtime: string; // 创建时间
  createuser: string; // 创建用户
  defaultDiscount: string; // 默认折扣
  delflag: string; // 删除标志
  discountprice: string; // 折扣价
  gyCompany: string; // 供应商公司
  gysource: string; // 供应商来源
  id: string; // ID
  interestrateprice: string; // 利率价格
  inventory: number; // 库存
  inventoryPrice: string; // 库存价格
  inventoryRemark: string; // 库存备注
  isInventory: number; // 是否库存管理
  isOpen: number; // 是否开放
  isTemporary: number; // 是否临时
  item: string; // 项目
  marketprice: string; // 市场价
  model: string; // 型号
  modifyprice: string; // 修改价格
  modifytime: string; // 修改时间
  modifyuser: string; // 修改用户
  name: string; // 产品名称
  noStarParam: string; // 非星级参数
  notStarTrait: string; // 非星级特征
  num: string; // 数量
  param: string; // 参数
  pendingParam: string; // 待处理参数
  pictureaddress: string; // 图片地址
  pictureaddressOne: string; // 图片地址1
  points: string; // 积分
  price: string; // 价格
  proId: string; // 产品ID
  productAtlas: string; // 产品图册
  purchaseprice: string; // 采购价
  receiveName: string; // 接收名称
  receiveid: string; // 接收ID
  repeal: string; // 撤销
  sales: number; // 销售数量
  subprojectClass: string; // 子项目类别
  trait: string; // 特征
  uname: string; // 用户名称
  unit: string; // 单位
  version: string; // 版本
}
// 公司接口类型定义
export interface Company {
  id: number | string;
  name: string;
  status: string;
}

// 产品类型/型号接口类型定义
export interface ProductModel {
  value: string;
  label: string;
  [key: string]: string;
}
// 产品分类接口类型定义
export interface ProductCategory {
  categoryName: string;
  id: string;
  levels: number | string;
  parentName: string;
  pid: string;
  productItems: ProductCategory[] | string;
}

// 分类API响应接口
export interface CategoryResponse {
  code?: string;
  data?: ProductCategory[];
  msg?: string;
}

// 产品表单数据接口
export interface ProductForm {
  proId: string;
  name: string;
  brand: string;
  model: string;
  unit: string;
  purchaseprice: string;
  price: string;
  marketprice: string;
  inventory: string;
  defaultDiscount: string;
  trait: string;
  param: string;
  isOpen: boolean;
  autoHandle: boolean;
  pictureaddress: string;
  mainCategoryId: string;
  subCategoryId: string;
}
// 表格列配置
export const allColumns: any[] = [
  {
    title: '',
    key: 'checkbox',
    width: '40px',
    customSlot: 'checkbox',
    fixed: 'left',
  },
  { title: '产品编号', key: 'proId', width: '100px', ellipsisTooltip: true },
  {
    title: '产品名称',
    key: 'name',
    width: '100px',
    customSlot: 'productName',
    ellipsisTooltip: true,
  },
  { title: '品牌', key: 'brand', width: '100px', ellipsisTooltip: true },
  { title: '型号', key: 'model', width: '100px', ellipsisTooltip: true },
  {
    title: '参数/特性',
    key: 'trait',
    width: '100px',
    customSlot: 'parameters',
    ellipsisTooltip: true,
  },
  { title: '单位', key: 'unit', width: '60px', ellipsisTooltip: true },
  { title: '成本', key: 'purchaseprice', width: '80px' },
  { title: '参考售价', key: 'price', width: '80px' },
  { title: '市场指导价', key: 'marketprice', width: '100px' },
  { title: '创建人', key: 'uname', width: '80px' },
  {
    title: '云端库',
    key: 'cloudLibrary',
    width: '80px',
    customSlot: 'cloudLibrary',
  },
  {
    title: '开放星标',
    key: 'openUpdate',
    width: '80px',
    customSlot: 'openUpdate',
  },
  {
    title: '指定开放',
    key: 'designatedOpen',
    width: '80px',
    customSlot: 'designatedOpen',
  },
  { title: '默认折率(%)', key: 'defaultDiscount', width: '100px' },
  {
    title: '自动报价',
    key: 'autoHandle',
    width: '80px',
    customSlot: 'autoPrice',
  },
];

// 产品分类接口类型定义
export interface ProductCategory {
  categoryName: string;
  id: string;
  levels: number | string;
  parentName: string;
  pid: string;
  productItems: ProductCategory[] | string;
}

// 分类API响应接口
export interface CategoryResponse {
  code?: string;
  data?: ProductCategory[];
  msg?: string;
}
