/**
 * 路由配置映射
 * 统一管理路由路径、标题、图标的映射关系
 */
export interface RouteConfig {
  path: string;
  title: string;
  icon: string;
  parentPath?: string; // 父级路由路径，用于面包屑导航
}

export const ROUTE_CONFIG_MAP: Record<string, RouteConfig> = {
  // 云空间 - 父级菜单
  'cloud-space': {
    path: '/cloud',
    title: '云空间',
    icon: 'layui-icon-component',
  },
  'kuozhi-cloud': {
    path: '/cloud/kuozhi',
    title: '阔置云',
    icon: 'layui-icon-cloud',
    parentPath: '/cloud',
  },
  'scheme-cloud': {
    path: '/cloud/scheme',
    title: '方案云',
    icon: 'layui-icon-template',
    parentPath: '/cloud',
  },
  'company-cloud-disk': {
    path: '/cloud/company-disk',
    title: '公司云盘',
    icon: 'layui-icon-file',
    parentPath: '/cloud',
  },

  // 自建产品库
  'product-library': {
    path: '/product/library',
    title: '自建产品库',
    icon: 'layui-icon-home',
  },

  // 需求发布管理 - 父级菜单
  'demand-management': {
    path: '/demand',
    title: '需求发布管理',
    icon: 'layui-icon-form',
  },
  'cloud-demand-list': {
    path: '/demand/cloud-list',
    title: '云端需求列表',
    icon: 'layui-icon-list',
    parentPath: '/demand',
  },
  'connected-demand': {
    path: '/demand/connected',
    title: '已对接需求',
    icon: 'layui-icon-link',
    parentPath: '/demand',
  },

  // 供应链管理 - 父级菜单
  'supply-chain': {
    path: '/supply',
    title: '供应链管理',
    icon: 'layui-icon-engine',
  },
  'company-homepage': {
    path: '/supply/company-homepage',
    title: '公司主页',
    icon: 'layui-icon-website',
    parentPath: '/supply',
  },
  'customer-management': {
    path: '/supply/customer-management',
    title: '客户管理',
    icon: 'layui-icon-friends',
    parentPath: '/supply',
  },
  'supplier-management': {
    path: '/supply/supplier-management',
    title: '供应商管理',
    icon: 'layui-icon-user',
    parentPath: '/supply',
  },

  // 设计报价管理 - 父级菜单
  'design-quote': {
    path: '/design',
    title: '设计报价管理',
    icon: 'layui-icon-file',
  },
  'new-quote': {
    path: '/design/new-quote',
    title: '新建报价',
    icon: 'layui-icon-add-1',
    parentPath: '/design',
  },
  'history-quote': {
    path: '/design/history-quote',
    title: '历史报价',
    icon: 'layui-icon-table',
    parentPath: '/design',
  },
  'temp-quote': {
    path: '/design/temp-quote',
    title: '临时报价',
    icon: 'layui-icon-release',
    parentPath: '/design',
  },
  'quote-template': {
    path: '/design/quote-template',
    title: '报价模块',
    icon: 'layui-icon-template-1',
    parentPath: '/design',
  },
  'content-management': {
    path: '/design/content-management',
    title: '文案管理',
    icon: 'layui-icon-edit',
    parentPath: '/design',
  },

  // 订单审批记录 - 父级菜单
  'order-approval': {
    path: '/order',
    title: '订单审批记录',
    icon: 'layui-icon-user',
  },
  'order-receive-list': {
    path: '/order/receive-list',
    title: '订单接收列表',
    icon: 'layui-icon-download-circle',
    parentPath: '/order',
  },
  'order-send-list': {
    path: '/order/send-list',
    title: '订单发送列表',
    icon: 'layui-icon-upload-circle',
    parentPath: '/order',
  },
  'inquiry-receive-list': {
    path: '/order/inquiry-receive-list',
    title: '询价接收列表',
    icon: 'layui-icon-survey',
    parentPath: '/order',
  },

  // 报价审批 - 父级菜单
  'quote-approval': {
    path: '/quote',
    title: '报价审批',
    icon: 'layui-icon-edit',
  },
  'order-discount-application': {
    path: '/quote/order-discount-application',
    title: '订单折率申请',
    icon: 'layui-icon-rate',
    parentPath: '/quote',
  },
  'delete-application': {
    path: '/quote/delete-application',
    title: '删除申请',
    icon: 'layui-icon-delete',
    parentPath: '/quote',
  },
  'approval-record': {
    path: '/quote/approval-record',
    title: '审批记录',
    icon: 'layui-icon-log',
    parentPath: '/quote',
  },

  // 会员续费
  'member-renewal': {
    path: '/member/renewal',
    title: '会员续费',
    icon: 'layui-icon-diamond',
  },

  // 系统设置 - 父级菜单
  'system-settings': {
    path: '/system',
    title: '系统设置',
    icon: 'layui-icon-set',
  },
  'department-management': {
    path: '/system/department-management',
    title: '部门管理',
    icon: 'layui-icon-group',
    parentPath: '/system',
  },
  'user-management': {
    path: '/system/user-management',
    title: '用户管理',
    icon: 'layui-icon-username',
    parentPath: '/system',
  },
  'sales-permission-config': {
    path: '/system/sales-permission-config',
    title: '销售权限匹配置',
    icon: 'layui-icon-vercode',
    parentPath: '/system',
  },
  'login-log': {
    path: '/system/login-log',
    title: '登录日志',
    icon: 'layui-icon-log',
    parentPath: '/system',
  },
  'custom-dynamic': {
    path: '/system/custom-dynamic',
    title: '自定义动态',
    icon: 'layui-icon-slider',
    parentPath: '/system',
  },
  'business-log': {
    path: '/system/business-log',
    title: '业务日志',
    icon: 'layui-icon-chart',
    parentPath: '/system',
  },

  // 视频演示
  'video-demo': {
    path: '/video/demo',
    title: '视频演示',
    icon: 'layui-icon-play',
  },
};

/**
 * 根据路径获取路由配置
 */
export const getRouteConfigByPath = (path: string): RouteConfig | undefined => {
  return Object.values(ROUTE_CONFIG_MAP).find((config) => config.path === path);
};

/**
 * 根据路径获取路由key
 */
export const getRouteKeyByPath = (path: string): string | undefined => {
  return Object.keys(ROUTE_CONFIG_MAP).find(
    (key) => ROUTE_CONFIG_MAP[key].path === path,
  );
};

/**
 * 获取面包屑路径数组
 */
export const getBreadcrumbPath = (path: string): RouteConfig[] => {
  const config = getRouteConfigByPath(path);
  if (!config) return [];

  const breadcrumbs: RouteConfig[] = [];

  // 如果有父级路由，递归获取父级面包屑
  if (config.parentPath) {
    breadcrumbs.push(...getBreadcrumbPath(config.parentPath));
  }

  breadcrumbs.push(config);
  return breadcrumbs;
};

/**
 * 菜单结构配置
 */
export interface MenuStructure {
  key: string;
  hasSubmenu: boolean;
  submenuItems?: string[];
}

export const MENU_STRUCTURE: MenuStructure[] = [
  {
    key: 'cloud-space',
    hasSubmenu: true,
    submenuItems: ['kuozhi-cloud', 'scheme-cloud', 'company-cloud-disk'],
  },
  {
    key: 'product-library',
    hasSubmenu: false,
  },
  {
    key: 'demand-management',
    hasSubmenu: true,
    submenuItems: ['cloud-demand-list', 'connected-demand'],
  },
  {
    key: 'supply-chain',
    hasSubmenu: true,
    submenuItems: [
      'company-homepage',
      'customer-management',
      'supplier-management',
    ],
  },
  {
    key: 'design-quote',
    hasSubmenu: true,
    submenuItems: [
      'new-quote',
      'history-quote',
      'temp-quote',
      'quote-template',
      'content-management',
    ],
  },
  {
    key: 'order-approval',
    hasSubmenu: true,
    submenuItems: [
      'order-receive-list',
      'order-send-list',
      'inquiry-receive-list',
    ],
  },
  {
    key: 'quote-approval',
    hasSubmenu: true,
    submenuItems: [
      'order-discount-application',
      'delete-application',
      'approval-record',
    ],
  },
  {
    key: 'member-renewal',
    hasSubmenu: false,
  },
  {
    key: 'system-settings',
    hasSubmenu: true,
    submenuItems: [
      'department-management',
      'user-management',
      'sales-permission-config',
      'login-log',
      'custom-dynamic',
      'business-log',
    ],
  },
  {
    key: 'video-demo',
    hasSubmenu: false,
  },
];
