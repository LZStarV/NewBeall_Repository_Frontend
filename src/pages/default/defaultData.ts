import {
  buyer,
  seller,
  consultant,
  trade,
  engineer,
  sales,
} from '@assets/image/default/index.ts';

interface Features {
  title: string;
  desc: string;
}
interface Stats {
  value: number;
  label: string;
}
interface UsageImg {
  name: string;
  url: string;
}
interface Questions {
  question: string;
  answer: string;
}

// 特性数据
const features: Features[] = [
  {
    title: '先进 Advanced',
    desc: '引领设计报价工作的升级转型，打造企业核心竞争力，为企业实现降本增效',
  },
  {
    title: '安全 Security',
    desc: '壹新公司启用严格的云平台安全保障、安全研发等全方位的安全保障',
  },
  {
    title: '便捷 Convenient',
    desc: '以技术为驱动，实用为导向，致力于打造成便捷的设计报价管理工具软件',
  },
  {
    title: '高效 Efficient',
    desc: '利用先进的功能模块，海量的云端共享资源，建设绝对高效的互联网应用平台',
  },
];

// 数据指标
const stats: Stats[] = [
  { value: 300, label: '办公效率提升' },
  { value: 100, label: '项目进度把控' },
  { value: 50, label: '资源成本节省' },
  { value: 50, label: '企业效益提升' },
];

// 受众数据
const usageImg: UsageImg[] = [
  {
    name: '工程集成',
    url: engineer,
  },
  {
    name: '产品销售',
    url: sales,
  },
  {
    name: '顾问设计',
    url: consultant,
  },
  {
    name: '贸易行业',
    url: trade,
  },
  {
    name: '卖家',
    url: seller,
  },
  {
    name: '买家',
    url: buyer,
  },
];

// 特权数据列信息
const privilegedColumn = [
  {
    title: '功能',
    width: '120px',
    key: 'name',
  },
  {
    title: '个人版',
    children: [
      {
        title: '普通版',
        key: 'normal',
        width: '100px',
      },
      {
        title: '会员版',
        key: 'member',
        width: '100px',
      },
    ],
  },
  {
    title: '企业版',
    children: [
      {
        title: '工程集成商',
        key: 'engineeringIntegrators',
        width: '100px',
      },
      {
        title: '产品供应商',
        key: 'productSuppliers',
        width: '100px',
      },
    ],
  },
];

// 特权具体内容
const privilegedData = [
  {
    name: '使用规则',
    normal: '免费使用',
    member: '19元/月',
    engineeringIntegrators: '399元/月',
    productSuppliers: '399元/月',
  },
  {
    name: '适用群体',
    normal: '无明确信息',
    member: '无明确信息',
    engineeringIntegrators: '无明确信息',
    productSuppliers: '无明确信息',
  },
  {
    name: '导入/导出次数',
    normal: '限制为5次',
    member: '不限制次数',
    engineeringIntegrators: '不限制次数',
    productSuppliers: '不限制次数',
  },
  {
    name: '笔记列表',
    normal: '√',
    member: '√',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '笔记栏',
    normal: '√',
    member: '√',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '云端共享方案',
    normal: '×',
    member: '√',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '赠送服务',
    normal: '无赠送服务',
    member: '无赠送服务',
    engineeringIntegrators: '注册赠送一周会员',
    productSuppliers: '注册赠送一周会员',
  },
  {
    name: '报价单打印功能',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '添加企业图章',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '合作伙伴',
    normal: '×',
    member: '×',
    engineeringIntegrators: '×',
    productSuppliers: '√',
  },
  {
    name: '报价单导出word',
    normal: '×',
    member: '√',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '报价单导出PDF',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '报价单导出excel',
    normal: '×',
    member: '√',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '产品价格咨询',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '订单审批记录',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '文字方案管理',
    normal: '×',
    member: '√',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '报价模块列表',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '模块合成报价单',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '企业信息管理',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '企业宣传资料扩容',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '客户信息管理',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '产品供应商信息管理',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '单个新增产品',
    normal: '√',
    member: '√',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '批量新增产品',
    normal: '√',
    member: '√',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '自建产品库',
    normal: '√',
    member: '√',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '新建设计报价',
    normal: '√',
    member: '√',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '历史设计报价',
    normal: '√',
    member: '√',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '临时报价功能',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '报价单删除申请',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '报价单审批记录',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '企业内部协作',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '企业内部通讯',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '订单审批权限管理',
    normal: '×',
    member: '×',
    engineeringIntegrators: '×',
    productSuppliers: '√',
  },
  {
    name: '订单接收列表',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '订单发送列表',
    normal: '×',
    member: '×',
    engineeringIntegrators: '×',
    productSuppliers: '√',
  },
  {
    name: '订单折率申请',
    normal: '×',
    member: '×',
    engineeringIntegrators: '×',
    productSuppliers: '√',
  },
  {
    name: '用户管理',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
  {
    name: '部门管理',
    normal: '×',
    member: '×',
    engineeringIntegrators: '√',
    productSuppliers: '√',
  },
];

// 常见问题
const questions: Questions[] = [
  {
    question: '我导入平台的产品是有参数的，为什么没有显示？',
    answer: '平台会限制导入产品参数的格式，不符合要求的产品参数会被过滤。',
  },
  {
    question: '企业用户注册了然后登录进去怎么使用不了？',
    answer:
      '新注册的企业用户需经过后台的审批后方可使用，如果后台人员审批未通过的暂时无法使用。',
  },
  {
    question: '为什么我导出不了报价单了呢？',
    answer:
      '亲，我们平台的非会员用户只提供五次的免费导出服务，如后续想继续导出请充值会员后使用。',
  },
  {
    question: '产品导入失败，我该怎么弄？',
    answer:
      '请检查导入文件的格式与模板是否一致，请检查产品参数是否符合导入格式等。',
  },
  {
    question: '我充值会员后，如果发现不是我想要的，可以退款吗？',
    answer:
      '由于商品/服务的特殊性质，不适用无理由退款范围，但我们仍然为您提供完善的管理服务。',
  },
  {
    question: '企业用户注册了然后登录进去怎么使用不了？',
    answer:
      '登录之后，在首页界面右上角有邀请注册按钮，点击之后生成邀请码即可分享使用。',
  },
  {
    question: '充值后可以开发票吗？发票的类型是什么？',
    answer:
      '您可以通过添加客服微信提交申请， 发票类型为电子普通发票，开票内容为研发和技术服务费。',
  },
  {
    question: '产品导入失败，我该怎么弄？',
    answer:
      '平台产品供应商之间的信息是不可见的，如果您需要查看跟你合作的产品供应商的信息，需要该产品供应商在平台授权。',
  },
];

export {
  features,
  stats,
  usageImg,
  privilegedColumn,
  privilegedData,
  questions,
};
