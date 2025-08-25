<template>
  <lay-loading v-if="isConnecting" />

  <div v-else class="basicInfoPage">
    <h4>企业基本信息</h4>

    <lay-form
      ref="formRef"
      :model="formData"
      label-position="left"
      :rules="rules"
    >
      <div class="basic-info">
        <lay-form-item label="注册角色" prop="role">
          <div class="role">
          <span>{{ formData.role === 1 ? '产品供应商' : '工程集成商' }}</span>
          <img :src="formData.logoUrl" alt="logo"></img>
          </div>

        </lay-form-item>
        <lay-form-item label="企业全称" prop="companyName">
          <span>{{ formData.companyName }}</span>
        </lay-form-item>
        <lay-form-item label="企业简称" prop="abbreviation">
          <lay-input
            placeholder="请输入企业简称"
            v-model="formData.abbreviation"
          />
        </lay-form-item>
        <lay-form-item label="所在地区" prop="area" required>
          <div class="region-select">
            <lay-select
              v-model="formData.province"
              placeholder="省份"
              @change="handleProvinceChange"
            >
              <lay-select-option
                v-for="province in provincesOpt"
                :key="province.key"
                :value="province.value"
                :label="province.label"
              />
            </lay-select>

            <lay-select
              v-model="formData.city"
              placeholder="城市"
              @change="handleCityChange"
            >
              <lay-select-option
                v-for="city in cityOpt"
                :key="city.key"
                :value="city.value"
                :label="city.label"
              />
            </lay-select>

            <lay-select
              v-model="formData.area"
              placeholder="区县"
            >
              <lay-select-option
                v-for="area in areaOpt"
                :key="area.key"
                :value="area.value"
                :label="area.label"
              />
            </lay-select>
          </div>
        </lay-form-item>
      </div>

      <h4>联系人信息</h4>
      <div class="contact-info">
        <lay-form-item label="姓名" prop="name" required>
          <lay-input
            v-model="formData.name"
            placeholder="请输入联系人姓名"
          />
        </lay-form-item>
        <lay-form-item label="性别" prop="sex" required>
          <lay-radio-group v-model="formData.sex">
            <lay-radio value="1">男</lay-radio>
            <lay-radio value="0">女</lay-radio>
          </lay-radio-group>
        </lay-form-item>
        <lay-form-item label="电话" prop="companyPhone" required>
          <lay-input v-model="formData.companyPhone" placeholder="请输入联系电话" />
        </lay-form-item>
        <lay-form-item label="邮箱" prop="email" required>
          <lay-input v-model="formData.email" placeholder="请输入邮箱地址" />
        </lay-form-item>
        <lay-form-item label="职位" prop="career" required>
          <lay-input v-model="formData.career" placeholder="请输入职位" />
        </lay-form-item>
      </div>
      <lay-form-item style="text-align: end; margin-right: 40px">
        <lay-button type="normal" @click="submit" :loading="submitting">保存</lay-button>
      </lay-form-item>
    </lay-form>
  </div>
</template>

<script setup lang="ts">
import bsApi from '@/api/bs/bsApi';
import companyApi from '@/api/company/companyApi';
import type { CompanyDetailResponseData } from '@/api/company/companyApi.type';
import registerApi from '@/api/register/registerApi';
import { layer } from '@layui/layui-vue';
import { onMounted, reactive, ref, watch } from 'vue';

const isConnecting = ref(true);

// 定义props
interface Props {
  companyData?: CompanyDetailResponseData;
}

const props = withDefaults(defineProps<Props>(), {
  companyData: undefined,
});

// 通信
const emit = defineEmits(['dataUpdated']);

// 表单引用和加载状态
const formRef = ref();
const submitting = ref(false);

// 需要提交的数据
const submitData = ref();

// 表单数据
const formData = reactive({
  role: 1,
  companyName: '',
  abbreviation: '',
  province: '',
  city: '',
  area: '',
  name: '',
  sex: '',
  companyPhone: '',
  email: '',
  career: '',
  logoUrl: '',
});

//表单验证规则
const rules = reactive({
  name: [
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  companyPhone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ],
  email: [
    { type: 'email' as const, message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  career: [
    { min: 1, max: 30, message: '职位长度在 1 到 30 个字符', trigger: 'blur' }
  ],
});

// 省份数据
const provincesOpt = ref();
// 城市数据
const cityOpt = ref();
// 区县数据
const areaOpt = ref();

// 根据对应的名称找到对应的代码
const getCode = (type: number, name: string | number | object) => {
  if(type === 1)
    return provincesOpt.value?.find((item: any) => item.value === name).key;
  if(type === 2)
    return cityOpt.value?.find((item: any) => item.value === name).key;
  if(type === 3)
    return areaOpt.value?.find((item: any) => item.value === name).key;
}

// 处理省份选择变化
const handleProvinceChange = async (provinceName: string | number | object) => {
  // 清空城市和区县
  formData.city = '';
  formData.area = '';
  cityOpt.value = [];
  areaOpt.value = [];

  await loadCityOpt(provinceName);
}

// 加载城市
const loadCityOpt = async (provinceName: string | number | object) => {
    // 根据省份名称找到对应的省份代码
  const selectedProvince = getCode(1, provinceName);
  try {
    const res = await bsApi.getAllCity(selectedProvince);
    const cityRes = res.data || res;
    cityOpt.value = cityRes.map((item: any) => ({
      value: item.cityName,
      label: item.cityName,
      key: item.cityCode,
    }));
  } catch (error) {
    console.error('获取城市数据失败:', error);
  }
}

// 处理城市选择变化
const handleCityChange = async (cityName: string | number | object) => {
  // 清空区县
  formData.area = '';
  areaOpt.value = [];

  await loadAreaOpt(cityName);
}

// 加载区域
const loadAreaOpt = async (cityName: string | number | object) => {
  // 根据城市名称找到对应的城市代码
  const selectedCity = getCode(2, cityName);
  try {
    const res = await bsApi.getAllArea(selectedCity);
    const areaRes = res.data || res;
    areaOpt.value = areaRes.map((item: any) => ({
      value: item.areaName,
      label: item.areaName,
      key: item.areaCode,
    }));
  } catch (error) {
    console.error('获取区县数据失败:', error);
  }
}

// 初始化表单数据的函数
const initFormData = async (companyData?: CompanyDetailResponseData) => {
  if (companyData && companyData.company) {
    const company = companyData.company;

    // 更新表单数据
    Object.assign(formData, {
      role: company.gy,
      companyName: company.companyName,
      abbreviation: company.abbreviation,
      province: company.province,
      city: company.city,
      area: company.area,
      name: company.name,
      sex: company.sex.toString(),
      companyPhone: company.companyPhone,
      email: company.email,
      career: company.career,
      logoUrl: `https://yx.newbeall.com/softLink/${company.logoUrl}`,
    });

    // 如果有省份，自动加载对应的城市
    if (company.province) {
      await loadCityOpt(company.province);
    }

    // 如果有城市，自动加载对应的区县
    if (company.city) {
      await loadAreaOpt(company.city);
    }
  }
};

// 监听 props 变化，更新表单数据
watch(
  () => props.companyData,
  async (newData) => {
    await initFormData(newData);
  },
  { immediate: true, deep: true },
);

// 保存信息
const submit = async () => {
  try {
    submitting.value = true;
    // 表单验证
    const valid = await formRef.value.validate();
    if (!valid) {
      return;
    }

    // 准备要提交的数据
    submitData.value = {
      ...formData,
      province_code: getCode(1, formData.province),
      city_code: getCode(2, formData.city),
      area_code: getCode(3, formData.area),
      areaCode:getCode(3, formData.area),
      logoUrl: formData.logoUrl.replace('https://yx.newbeall.com/softLink/', ''),
      id: props.companyData?.company.id,
      moduleName: 'basicInfo',
    };

    // 检查简称是否被占用
    await registerApi.existAbbreviation(formData.abbreviation, formData.role === 1 ? 'gy': 'cg');

    // 保存
    await companyApi.updateMyCompanyInfo(submitData.value);

    layer.msg('保存成功', { icon: 1 });
    // 通知父组件重新获取数据
    emit('dataUpdated');
  } catch (error) {
    console.error('保存失败:', error);
    layer.msg('保存失败, 请检查输入', { icon: 2 });
  } finally {
    submitting.value = false;
  }
};

onMounted(async ()=> {
  // 首先加载省份数据
  const res = await bsApi.getAllProvince();
  const provincesRes = res.data || res;
  provincesOpt.value = provincesRes.map((item) => ({
    value: item.provinceName,
    label: item.provinceName,
    key: item.provinceCode,
  }));

  // 如果props中已经有数据，立即初始化表单
  if (props.companyData) {
    await initFormData(props.companyData);
  }
  setTimeout(()=> {
    isConnecting.value = false;
  }, 500);
});
</script>

<style lang="scss" scoped>
.basicInfoPage {
  .basic-info,
  .contact-info {
    padding: 20px 40px;
  }


  .basic-info {
    .role {
      @include flex(row, space-between, center);
    }
    span {
      height: 38px;
      line-height: 38px;
      padding: 0 10px;
    }
    img {
      width: 100px;
      object-fit: scale-down;
    }
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
    border-left: 3px solid var(--global-primary-color);
    padding-left: 15px;
  }
}

.layui-select {
  width: 170px;
  display: inline-block;
  margin-right: 20px;
}


.layui-loading {
  width: 100%;
  height: 100vh;
}

:deep(.layui-loading-spinning) {
  background-color: transparent;
}
</style>
