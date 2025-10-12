<template>
  <div class="area-select-group">
    <!-- 省份选择 -->
    <lay-select
      v-model="selectedProvince"
      placeholder="请选择省"
      :disabled="provinceLoading"
      allow-clear
      @update:model-value="handleProvinceChange"
    >
      <lay-select-option
        v-for="province in provinces"
        :key="province.provinceCode"
        :value="province.provinceCode"
        :label="province.provinceName"
      />
    </lay-select>

    <!-- 城市选择 -->
    <lay-select
      v-model="selectedCity"
      placeholder="请选择市"
      :disabled="cityLoading || !selectedProvince"
      allow-clear
      @update:model-value="handleCityChange"
    >
      <lay-select-option
        v-for="city in cities"
        :key="city.cityCode"
        :value="city.cityCode"
        :label="city.cityName"
      />
    </lay-select>

    <!-- 区县选择 -->
    <lay-select
      v-model="selectedArea"
      placeholder="请选择区"
      :disabled="areaLoading || !selectedCity"
      allow-clear
      @update:model-value="handleAreaChange"
    >
      <lay-select-option
        v-for="area in areas"
        :key="area.areaCode"
        :value="area.areaCode"
        :label="area.areaName"
      />
    </lay-select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import areaApi from '@/api/area/areaApi';
import type { Province, City, Area } from '@/api/area/areaApi.type';

interface Props {
  modelValue?: {
    province?: number;
    city?: number;
    area?: number;
  };
}

interface Emits {
  (
    e: 'update:modelValue',
    value: { province?: number; city?: number; area?: number },
  ): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
});

const emit = defineEmits<Emits>();

// 数据状态
const provinces = ref<Province[]>([]);
const cities = ref<City[]>([]);
const areas = ref<Area[]>([]);

// 选择状态
const selectedProvince = ref<number | ''>('');
const selectedCity = ref<number | ''>('');
const selectedArea = ref<number | ''>('');

// 加载状态
const provinceLoading = ref(false);
const cityLoading = ref(false);
const areaLoading = ref(false);

// 获取所有省份
const getProvinces = async () => {
  try {
    provinceLoading.value = true;
    const response = await areaApi.getProvince();
    if (response && Array.isArray(response)) {
      provinces.value = response;
    }
  } catch (error) {
    console.error('获取省份数据失败:', error);
  } finally {
    provinceLoading.value = false;
  }
};

// 获取省份下的城市
const getCities = async (provinceCode: number) => {
  try {
    cityLoading.value = true;
    const response = await areaApi.getCityOfProvince(provinceCode.toString());
    if (response && Array.isArray(response)) {
      cities.value = response;
    }
  } catch (error) {
    console.error('获取城市数据失败:', error);
  } finally {
    cityLoading.value = false;
  }
};

// 获取城市下的区县
const getAreas = async (cityCode: number) => {
  try {
    areaLoading.value = true;
    const response = await areaApi.getAreaOfCity(cityCode.toString());
    if (response && Array.isArray(response)) {
      areas.value = response;
    }
  } catch (error) {
    console.error('获取区县数据失败:', error);
  } finally {
    areaLoading.value = false;
  }
};

// 省份变化处理
const handleProvinceChange = async (value: string | number | object) => {
  const provinceCode = value as number;
  selectedProvince.value = provinceCode;
  selectedCity.value = '';
  selectedArea.value = '';

  // 清空城市和区县数据
  cities.value = [];
  areas.value = [];

  // 获取新省份的城市数据
  if (provinceCode) {
    await getCities(provinceCode);

    // 如果有城市数据，自动选择第一个城市并获取其区县
    if (cities.value.length > 0) {
      selectedCity.value = cities.value[0].cityCode;
      await getAreas(cities.value[0].cityCode);

      // 如果有区县数据，自动选择第一个区县
      if (areas.value.length > 0) {
        selectedArea.value = areas.value[0].areaCode;
      }
    }
  }

  updateModelValue();
};

// 城市变化处理
const handleCityChange = async (value: string | number | object) => {
  const cityCode = value as number;
  selectedCity.value = cityCode;
  selectedArea.value = '';

  // 清空区县数据
  areas.value = [];

  // 获取新城市的区县数据
  if (cityCode) {
    await getAreas(cityCode);

    // 如果有区县数据，自动选择第一个区县
    if (areas.value.length > 0) {
      selectedArea.value = areas.value[0].areaCode;
    }
  }

  updateModelValue();
};

// 区县变化处理
const handleAreaChange = (value: string | number | object) => {
  const areaCode = value as number;
  selectedArea.value = areaCode;
  updateModelValue();
};

// 更新v-model值
const updateModelValue = () => {
  emit('update:modelValue', {
    province: selectedProvince.value || undefined,
    city: selectedCity.value || undefined,
    area: selectedArea.value || undefined,
  });
};

// 初始化数据
onMounted(async () => {
  await getProvinces();

  // 如果有初始值，设置选择状态
  if (props.modelValue && props.modelValue.province) {
    selectedProvince.value = props.modelValue.province;
    await getCities(props.modelValue.province);

    if (props.modelValue.city) {
      selectedCity.value = props.modelValue.city;
      await getAreas(props.modelValue.city);

      if (props.modelValue.area) {
        selectedArea.value = props.modelValue.area;
      }
    }
  }
  // 默认不选择任何省份，等待用户手动选择
});

// 监听props变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedProvince.value = newValue.province || '';
      selectedCity.value = newValue.city || '';
      selectedArea.value = newValue.area || '';
    }
  },
  { deep: true },
);
</script>

<style scoped lang="scss">
.area-select-group {
  display: flex;
  gap: 8px;
  flex: 1;
  width: calc(100% - 100px - 16px);

  :deep(.layui-select) {
    flex: 1;
    min-width: 0; // 允许flex shrink
  }
}
</style>
