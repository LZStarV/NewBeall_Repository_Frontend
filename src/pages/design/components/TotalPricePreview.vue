<template>
  <div class="total-price-preview">
    <div v-if="productRate || isDefaultProductInterestRate" class="total-price-preview-item">
      <strong>预设产品利率：</strong><span>{{ isDefaultProductInterestRate ? '默认市场指导价' : productRate.toFixed(2) }}%</span>
    </div>
    <div class="total-price-preview-item">
      <strong>总售价合计：</strong><span>¥ {{ totalPrice.toFixed(2) }}</span>
    </div>
    <div class="total-price-preview-item">
      <strong>总成本合计：</strong><span>¥ {{ totalCost.toFixed(2) }}</span>
    </div>
    <div class="total-price-preview-item">
      <strong>合计毛利润：</strong><span>¥ {{ (totalPrice - totalCost).toFixed(2) }}</span>
    </div>
    <div class="total-price-preview-item">
      <strong>毛利率：</strong><span>{{ totalPrice === 0 ? '0.00' : ((totalPrice - totalCost) / totalPrice * 100).toFixed(2)
      }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { productRate, totalCost, totalPrice } = defineProps({
  isDefaultProductInterestRate: {
    type: Boolean,
    default: false,
  },
  productRate: {
    type: Number,
    default: 0,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});
</script>

<style scoped lang="scss">
.total-price-preview {
  padding: 12px;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid $border-color-light;
  box-shadow: $box-shadow-base;
  font-size: 14px;
  color: #333;

  position: absolute;
  top: 50%;
  transform: translate(0%, -70%);
  right: 50px;
  z-index: 10000;

  .total-price-preview-item {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 2px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
