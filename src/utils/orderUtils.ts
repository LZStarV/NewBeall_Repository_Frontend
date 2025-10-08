import type { OrderDetail, SubproductHeader } from '@/api/orders/orderApi.type';

// QuotationItem 接口定义（从 QuotationEdit.vue 中提取）
export interface QuotationItem {
  id: number;
  name: Array<{
    label: string;
    type: string;
    size: string;
    action: string;
    customClass?: string;
  }>;
  brand: string;
  model: string;
  feature: Array<{
    label: string;
    type: string;
    size: string;
    action: string;
    customClass?: string;
  }>;
  unit: string;
  quantity: number;
  cost: number;
  costTotal: number;
  price: number;
  priceTotal: number;
  pic: string;
  company: string;
  operation: Array<{
    label: string;
    type: string;
    size: string;
    action: string;
    customStyle?: {
      backgroundColor?: string;
      color?: string;
      borderColor?: string;
      borderRadius?: string;
      padding?: string;
      fontSize?: string;
      fontWeight?: string;
    };
    customClass?: string;
  }>;
}

/**
 * 将 OrderDetail 转换为 QuotationItem
 * @param orderDetail OrderDetail 对象
 * @returns QuotationItem 对象
 */
export function orderDetailToQuotationItem(
  orderDetail: OrderDetail,
): QuotationItem {
  return {
    id: orderDetail.id,
    name: [
      {
        label: orderDetail.name,
        type: 'button',
        size: 'sm',
        action: 'view',
        customClass: 'text-primary',
      },
    ],
    brand: orderDetail.brand,
    model: orderDetail.model,
    feature: orderDetail.trait
      ? [
          {
            label: orderDetail.trait,
            type: 'button',
            size: 'xs',
            action: 'view',
            customClass: 'text-info',
          },
        ]
      : [],
    unit: orderDetail.unit,
    quantity: orderDetail.num,
    cost: orderDetail.purchaseprice,
    costTotal: orderDetail.purchaseprice * orderDetail.num,
    price: orderDetail.price,
    priceTotal: orderDetail.price * orderDetail.num,
    pic: orderDetail.pictureaddress,
    company: '', // 需要从其他字段获取或设置为默认值
    operation: [
      {
        label: '编辑',
        type: 'button',
        size: 'xs',
        action: 'edit',
        customStyle: {
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '12px',
        },
      },
      {
        label: '删除',
        type: 'button',
        size: 'xs',
        action: 'delete',
        customStyle: {
          backgroundColor: '#dc3545',
          color: '#fff',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '12px',
        },
      },
    ],
  };
}

/**
 * 将 QuotationItem 转换为 OrderDetail
 * @param quotationItem QuotationItem 对象
 * @param index 索引，用于生成 encryptId
 * @returns OrderDetail 对象
 */
export function quotationItemToOrderDetail(
  quotationItem:
    | QuotationItem
    | (SubproductHeader & {
        isSubProject?: boolean;
        isUtilRow?: boolean;
      }),
  index: number = 0,
): OrderDetail | SubproductHeader {
  if ('isSubProject' in quotationItem && quotationItem.isSubProject) {
    const item = quotationItem as SubproductHeader;
    return {
      encryptId: item.encryptId,
      productId: item.productId,
      subproject: item.subproject,
      subprojectClass: item.subprojectClass,
      subprojectColor: item.subprojectColor,
      subprojectLevel: item.subprojectLevel,
      subprojectParent: item.subprojectParent,
    };
  } else {
    const item = quotationItem as QuotationItem;
    return {
      brand: item.brand,
      changeState: 0,
      companyId: 0,
      costprice: item.cost,
      createrid: 0,
      discountprice: 0,
      encryptId: `temp_${Date.now()}_${index}`,
      gyCompany: 0,
      gysource: '',
      id: item.id,
      interestrateprice: 0,
      inventoryPrice: 0,
      inventoryRemark: '',
      isInventory: 0,
      isTemporary: 1,
      marketprice: item.price,
      model: item.model,
      modifyprice: 0,
      name: Array.isArray(item.name)
        ? item.name[0]?.label || ''
        : (item.name as any) || '',
      num: item.quantity,
      oldEncryptId: '',
      orderId: '',
      param: Array.isArray(item.feature)
        ? item.feature.map((f) => f.label).join(',')
        : '',
      pictureaddress: item.pic,
      pictureaddressOne: '',
      price: item.price,
      productCurrChainId: '',
      productCurrState: 0,
      productId: '',
      profitprice: 0,
      purchaseprice: item.cost,
      receiveid: 0,
      recommend: true,
      remark: '',
      sequence: index + 1,
      subproject: '',
      subprojectClass: '',
      subprojectColor: '',
      subprojectLevel: '',
      subprojectParent: '',
      trait: Array.isArray(item.feature)
        ? item.feature.map((f) => f.label).join(',')
        : '',
      unit: item.unit,
      xjProductId: '',
    };
  }
}

/**
 * 批量转换 OrderDetail 数组为 QuotationItem 数组
 * @param orderDetails OrderDetail 数组
 * @returns QuotationItem 数组
 */
export function orderDetailsToQuotationItems(
  orderDetails: OrderDetail[],
): QuotationItem[] {
  return orderDetails.map((orderDetail) =>
    orderDetailToQuotationItem(orderDetail),
  );
}

/**
 * 批量转换 QuotationItem 数组为 OrderDetail 数组
 * @param quotationItems QuotationItem 数组
 * @returns OrderDetail 数组
 */
export function quotationItemsToOrderDetails(
  quotationItems: QuotationItem[],
): (OrderDetail | SubproductHeader)[] {
  return quotationItems
    .slice(1) // 忽略第一行工具行
    .map((item, index) => quotationItemToOrderDetail(item, index));
}

/**
 * 创建空的 QuotationItem
 * @param id 项目ID
 * @returns 空的 QuotationItem 对象
 */
export function createEmptyQuotationItem(id: number): QuotationItem {
  return {
    id,
    name: [
      {
        label: '',
        type: 'button',
        size: 'sm',
        action: 'view',
        customClass: 'text-primary',
      },
    ],
    brand: '',
    model: '',
    feature: [],
    unit: '',
    quantity: 1,
    cost: 0,
    costTotal: 0,
    price: 0,
    priceTotal: 0,
    pic: '',
    company: '',
    operation: [
      {
        label: '编辑',
        type: 'button',
        size: 'xs',
        action: 'edit',
        customStyle: {
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '12px',
        },
      },
      {
        label: '删除',
        type: 'button',
        size: 'xs',
        action: 'delete',
        customStyle: {
          backgroundColor: '#dc3545',
          color: '#fff',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '12px',
        },
      },
    ],
  };
}

/**
 * 创建空的 OrderDetail
 * @param id 项目ID
 * @returns 空的 OrderDetail 对象
 */
export function createEmptyOrderDetail(id: number): OrderDetail {
  return {
    brand: '',
    changeState: 0,
    companyId: 0,
    costprice: 0,
    createrid: 0,
    discountprice: 0,
    encryptId: `temp_${Date.now()}_${id}`,
    gyCompany: 0,
    gysource: '',
    id,
    interestrateprice: 0,
    inventoryPrice: 0,
    inventoryRemark: '',
    isInventory: 0,
    isTemporary: 1,
    marketprice: 0,
    model: '',
    modifyprice: 0,
    name: '',
    num: 1,
    oldEncryptId: '',
    orderId: '',
    param: '',
    pictureaddress: '',
    pictureaddressOne: '',
    price: 0,
    productCurrChainId: '',
    productCurrState: 0,
    productId: '',
    profitprice: 0,
    purchaseprice: 0,
    receiveid: 0,
    recommend: true,
    remark: '',
    sequence: id + 1,
    subproject: '',
    subprojectClass: '',
    subprojectColor: '',
    subprojectLevel: '',
    subprojectParent: '',
    trait: '',
    unit: '',
    xjProductId: '',
  };
}

/*
使用示例：

// 1. 单个对象转换
const orderDetail: OrderDetail = {
  id: 1,
  name: '产品名称',
  brand: '品牌',
  model: '型号',
  trait: '特性描述',
  unit: '个',
  num: 10,
  purchaseprice: 100,
  price: 150,
  pictureaddress: 'image.jpg',
  // ... 其他必需字段
};

const quotationItem = orderDetailToQuotationItem(orderDetail);
const backToOrderDetail = quotationItemToOrderDetail(quotationItem, 0);

// 2. 批量转换
const orderDetails: OrderDetail[] = [orderDetail1, orderDetail2];
const quotationItems = orderDetailsToQuotationItems(orderDetails);
const backToOrderDetails = quotationItemsToOrderDetails(quotationItems);

// 3. 创建空对象
const emptyQuotationItem = createEmptyQuotationItem(1);
const emptyOrderDetail = createEmptyOrderDetail(1);

// 4. 在 QuotationEdit.vue 中使用
import { orderDetailsToQuotationItems, quotationItemsToOrderDetails } from '@/utils/orderUtils';

// 将 OrderDetail[] 转换为 QuotationItem[]
const quotationData = orderDetailsToQuotationItems(tableListData);

// 将 QuotationItem[] 转换为 OrderDetail[]
const orderDetailsList = quotationItemsToOrderDetails(quotationData);
*/
