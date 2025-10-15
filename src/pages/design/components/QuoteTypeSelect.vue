<template>
  <AdvancedSelector :model-value="modelValue" :placeholder="placeholder" :options="state.options"
    :loading="state.loading" value-key="value" label-key="name" @update:model-value="handleValueChange" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ordersApi from '@/api/orders/ordersApi';
import AdvancedSelector from '@/components/AdvancedSelector.vue';

interface QuoteTypeOption {
  name: string;
  value: number;
  selected: string;
}

interface QuoteTypeState {
  options: QuoteTypeOption[];
  loading: boolean;
}

interface Props {
  modelValue?: number | string;
  category: number;
  ordersId?: string;
  placeholder?: string;
}

interface Emits {
  (e: 'update:modelValue', value: number | string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请选择',
  ordersId: '',
});

const emit = defineEmits<Emits>();

// 组件状态
const state = ref<QuoteTypeState>({
  options: [],
  loading: false,
});

// 获取报价单类型数据
const getQuoteTypeData = async () => {
  try {
    state.value.loading = true;
    const response = await ordersApi.getOrderType(
      props.category,
      props.ordersId,
    );

    if (response.data && Array.isArray(response.data)) {
      state.value.options = response.data;
      orderTypeList.value = response.data;
    }
  } catch (error) {
    console.error(
      `获取报价单类型数据失败 (category: ${props.category}):`,
      error,
    );
  } finally {
    state.value.loading = false;
  }
};

// 对外提供报价单类型列表
const orderTypeList = ref<QuoteTypeOption[]>([]);
defineExpose({
  orderTypeList,
});

// 值变化处理
const handleValueChange = (value: number | string | object) => {
  emit('update:modelValue', value as number | string);
};

// 初始化数据
onMounted(() => {
  getQuoteTypeData();
});
</script>
