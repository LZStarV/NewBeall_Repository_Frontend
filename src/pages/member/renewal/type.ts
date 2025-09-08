import { ref } from 'vue';
// 积分充值价格数据
export const pointsPrices = {
  '50': '50.00',
  '110': '100.00',
  '580': '500.00',
  '1250': '1000.00',
};

// 云空间价格数据
export const storagePrices = {
  '500mb': '120.00',
  '1gb': '240.00',
  '10gb': '2307.00',
};

// 套餐价格数据
export const packagePrices = {
  month: 399.0,
  halfYear: 2199.0,
  year: 4199.0,
  threeYears: 9999.0,
};
//公司信息
export const companyInfo = ref<any>({});

// 可用积分抵扣配置
export const pointsDeductionRates = {
  month: { rate: 1.0, maxPoints: 100 },
  halfYear: { rate: 1.09, maxPoints: 600 },
  year: { rate: 1.14, maxPoints: 1300 },
  threeYears: { rate: 1.44, maxPoints: 2600 },
};
