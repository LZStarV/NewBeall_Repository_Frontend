<template>
  <div class="registerInfoPage">
    <h4>企业注册信息</h4>

    <lay-form
      ref="formRef"
      :model="formData"
      label-position="left"
      :rules="rules"
    >
      <div class="register-info">
        <lay-form-item label="企业全称" prop="companyName">
          <lay-input v-model="formData.companyName" readonly />
        </lay-form-item>

        <lay-form-item label="企业注册地址" prop="companyAddress" required>
          <lay-input
            v-model="formData.companyAddress"
            placeholder="请输入企业注册地址"
          />
        </lay-form-item>

        <lay-form-item label="企业法人代表" prop="companylegalperson">
          <lay-input v-model="formData.companylegalperson" />
        </lay-form-item>

        <lay-form-item label="银行账号" prop="bankAccount">
          <lay-input v-model="formData.bankAccount" />
        </lay-form-item>

        <lay-form-item label="开户行" prop="bankName">
          <lay-input v-model="formData.bankName" />
        </lay-form-item>

        <lay-form-item label="税号" prop="taxId">
          <lay-input v-model="formData.taxId" />
        </lay-form-item>

        <lay-form-item label="企业座机" prop="companyFax">
          <lay-input v-model="formData.companyFax" />
        </lay-form-item>

        <lay-form-item label="企业网址" prop="companyurl">
          <lay-input v-model="formData.companyurl" />
        </lay-form-item>

        <lay-form-item label="企业注册时间" prop="companyRegisterTime">
          <lay-date-picker
            v-model="formData.companyRegistertime"
            type="date"
            placeholder="点击选择"
          />
        </lay-form-item>

        <lay-form-item label="注册资本(万)" prop="companyRegisterMonery">
          <div class="money-input">
            <lay-input
              v-model="formData.companyMonery"
              placeholder="请输入注册资本"
            />
            <lay-select v-model="formData.money" placeholder="币种">
              <lay-select-option value="人民币" label="人民币" />
              <lay-select-option value="港元" label="港元" />
              <lay-select-option value="台币" label="台币" />
              <lay-select-option value="美元" label="美元" />
              <lay-select-option value="欧元" label="欧元" />
              <lay-select-option value="英镑" label="英镑" />
            </lay-select>
          </div>
        </lay-form-item>
      </div>
      <lay-form-item style="text-align: center">
        <lay-button type="primary" @click="submit" :loading="submitting"
          >保存</lay-button
        >
      </lay-form-item>
    </lay-form>
  </div>
</template>
<script setup lang="ts">
import companyApi from '@/api/company/companyApi';
import type { CompanyDetailResponseData } from '@/api/company/companyApi.type';
import { layer } from '@layui/layui-vue';
import { onMounted, reactive, ref, watch } from 'vue';

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

// 表单数据
const formData = reactive({
  companyName: '',
  companyAddress: '',
  companylegalperson: '',
  bankAccount: '',
  bankName: '',
  taxId: '',
  companyFax: '',
  companyurl: '',
  companyRegistertime: '',
  companyMonery: '',
  money: '人民币',
});

// 表单验证规则
const rules = reactive({
  companyMonery: {
    pattern: /^(0\.\d+|[1-9]\d*(\.\d+)?)$/,
    message: '请输入正确的金额',
  },
});

// 初始化表单数据的函数
const initFormData = async (companyData?: CompanyDetailResponseData) => {
  if (companyData && companyData.company) {
    const company = companyData.company;

    // 更新表单数据
    Object.assign(formData, {
      companyName: company.companyName || '',
      companyAddress: company.companyAddress || '',
      companylegalperson: company.companylegalperson || '',
      bankAccount: company.bankAccount || '',
      bankName: company.bankName || '',
      taxId: company.taxId || '',
      companyFax: company.companyFax || '',
      companyurl: company.companyurl || '',
      companyRegistertime:
        companyData.companyRegisterTime ||
        company.companyRegisterTime ||
        company.yxRegisterTime ||
        '',
      companyMonery:
        company.companyRegisterMonery || companyData.companyMonery || '',
      money: companyData.money,
    });
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
    const submitData = {
      ...formData,
      role: props.companyData?.company.gy,
      id: props.companyData?.company.id,
      sex: props.companyData?.company.sex,
      zhuceziben: `${formData.money}:${formData.companyMonery}万`,
      moduleName: 'registerInfo',
    };

    console.log('提交注册信息数据:', submitData);

    // 保存
    await companyApi.updateMyCompanyInfo(submitData);

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

// 组件挂载时初始化数据
onMounted(async () => {
  // 如果props中已经有数据，立即初始化表单
  if (props.companyData) {
    await initFormData(props.companyData);
  }
});
</script>

<style lang="scss" scoped>
.registerInfoPage {
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
    border-left: 3px solid var(--global-primary-color);
    padding-left: 15px;
  }
  .register-info {
    padding: 20px 40px;

    .money-input {
      @include flex-center();
      gap: 20px;
      .layui-input {
        flex: 1;
      }

      .layui-select {
        width: 120px;
      }
    }
  }
}

:deep(.layui-form-label) {
  width: 120px !important;
}
</style>
