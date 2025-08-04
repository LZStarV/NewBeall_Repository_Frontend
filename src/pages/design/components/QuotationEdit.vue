<template>
  <lay-card class="quotation-edit-card">
    <lay-row :gutter="20">
      <lay-col :xs="24" :md="12">
        <!-- 客户信息模块 -->
        <div class="module-card">
          <div class="module-header">
            <h5>客户信息</h5>
          </div>
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label">客户单位</label>
              <lay-select v-model="customerInfo.unit" placeholder="请选择">
                <lay-select-option value="option1" label="选项1" />
              </lay-select>
              <lay-button type="normal" size="md" class="info-button">
                <SvgIcon name="group_chat" width="16" height="16" />
                客户详情
              </lay-button>
            </div>
            <div class="form-row">
              <label class="form-head-label">客户地址</label>
              <lay-input v-model="customerInfo.address" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">客户地址</label>
              <lay-input v-model="customerInfo.contact" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">联系电话</label>
              <lay-input v-model="customerInfo.phone" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">客户邮箱</label>
              <lay-input v-model="customerInfo.email" disabled />
              <lay-button
                type="normal"
                size="md"
                class="info-button"
                @click="showCustomerBankInfo = !showCustomerBankInfo"
              >
                {{ showCustomerBankInfo ? '收起信息' : '账户信息' }}
              </lay-button>
            </div>
            <div v-show="showCustomerBankInfo" class="bank-info-box">
              <div class="form-row">
                <label class="form-head-label">银行账号</label>
                <lay-input v-model="customerInfo.bankAccount" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">开户行</label>
                <lay-input v-model="customerInfo.bankName" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">税号</label>
                <lay-input v-model="customerInfo.taxNumber" disabled />
              </div>
            </div>
          </div>
        </div>

        <!-- 项目信息模块 -->
        <div class="module-card">
          <div class="module-header">
            <h5>项目信息</h5>
          </div>
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label required">项目名称</label>
              <lay-input v-model="projectInfo.name" placeholder="" />
            </div>
            <div class="form-row">
              <label class="form-head-label required">项目负责人</label>
              <lay-select v-model="projectInfo.manager" placeholder="请选择">
                <lay-select-option value="option1" label="选项1" />
              </lay-select>
            </div>
            <div class="form-row">
              <label class="form-head-label required">报价单类型</label>
              <div class="select-group">
                <lay-select
                  v-model="projectInfo.quoteType1"
                  placeholder="请选择"
                >
                  <lay-select-option value="option1" label="选项1" />
                </lay-select>
                <lay-select
                  v-model="projectInfo.quoteType2"
                  placeholder="请选择"
                >
                  <lay-select-option value="option1" label="选项1" />
                </lay-select>
                <lay-select
                  v-model="projectInfo.quoteType3"
                  placeholder="请选择"
                >
                  <lay-select-option value="option1" label="选项1" />
                </lay-select>
              </div>
            </div>
            <div class="form-row">
              <label class="form-head-label">报价单性质</label>
              <lay-select
                v-model="projectInfo.nature"
                placeholder="初步建议阶段"
              >
                <lay-select-option value="preliminary" label="初步建议阶段" />
              </lay-select>
            </div>
            <div class="form-row">
              <label class="form-head-label">项目备注</label>
              <lay-input v-model="projectInfo.remark" />
            </div>
          </div>
        </div>
      </lay-col>

      <lay-col :xs="24" :md="12">
        <!-- 我司信息模块 -->
        <div class="module-card">
          <div class="module-header">
            <h5>我司信息</h5>
          </div>
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label">设计单位</label>
              <lay-input v-model="companyInfo.name" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">企业地址</label>
              <lay-input v-model="companyInfo.address" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">联系人员</label>
              <lay-input v-model="companyInfo.contact" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">联系电话</label>
              <lay-input v-model="companyInfo.phone" disabled />
            </div>
            <div class="form-row">
              <label class="form-head-label">客户邮箱</label>
              <lay-input v-model="companyInfo.email" disabled />
              <lay-button
                type="normal"
                size="md"
                class="info-button"
                @click="showCompanyBankInfo = !showCompanyBankInfo"
              >
                {{ showCompanyBankInfo ? '收起信息' : '账户信息' }}
              </lay-button>
            </div>
            <div v-show="showCompanyBankInfo" class="bank-info-box">
              <div class="form-row">
                <label class="form-head-label">银行账号</label>
                <lay-input v-model="companyInfo.bankAccount" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">开户行</label>
                <lay-input v-model="companyInfo.bankName" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">税号</label>
                <lay-input v-model="companyInfo.taxNumber" disabled />
              </div>
            </div>
          </div>
        </div>

        <!-- 交易信息模块 -->
        <div class="module-card">
          <div class="module-header">
            <h5>交易信息</h5>
          </div>
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label">交货方式</label>
              <lay-select
                v-model="tradeInfo.deliveryMethod"
                placeholder="请选择"
              >
                <lay-select-option value="option1" label="选项1" />
              </lay-select>
            </div>
            <div class="form-row">
              <label class="form-head-label">交货时间</label>
              <lay-input v-model="tradeInfo.deliveryTime" placeholder="" />
            </div>
            <div class="form-row">
              <label class="form-head-label">交货地点</label>
              <div class="select-group">
                <lay-select v-model="tradeInfo.province" placeholder="请选择省">
                  <lay-select-option value="option1" label="选项1" />
                </lay-select>
                <lay-select v-model="tradeInfo.city" placeholder="请选择市">
                  <lay-select-option value="option1" label="选项1" />
                </lay-select>
                <lay-select v-model="tradeInfo.district" placeholder="请选择区">
                  <lay-select-option value="option1" label="选项1" />
                </lay-select>
              </div>
            </div>
            <div class="form-row">
              <label class="form-head-label">详细地址</label>
              <lay-input v-model="tradeInfo.address" placeholder="" />
            </div>
            <div class="form-row">
              <label class="form-head-label">结算方式</label>
              <lay-select
                v-model="tradeInfo.paymentMethod"
                placeholder="请选择"
              >
                <lay-select-option value="option1" label="选项1" />
              </lay-select>
            </div>
          </div>
        </div>
      </lay-col>
    </lay-row>
  </lay-card>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';
import { ref } from 'vue';

// 响应式数据
const showCustomerBankInfo = ref(false); // 显示客户账户信息
const showCompanyBankInfo = ref(false); // 显示我司账户信息

// 客户信息数据
const customerInfo = ref({
  unit: '',
  address: '',
  contact: '',
  phone: '',
  email: '',
  bankAccount: '',
  bankName: '',
  taxNumber: '',
});

// 我司信息数据
const companyInfo = ref({
  name: '网络科技有限公司',
  address: '南翔三路',
  contact: '11111',
  phone: '18664',
  email: 'yan@163.com',
  bankAccount: '',
  bankName: '',
  taxNumber: '',
});

// 项目信息数据
const projectInfo = ref({
  name: '',
  manager: '',
  quoteType1: '',
  quoteType2: '',
  quoteType3: '',
  nature: '',
  remark: '',
});

// 交易信息数据
const tradeInfo = ref({
  deliveryMethod: '',
  deliveryTime: '',
  province: '',
  city: '',
  district: '',
  address: '',
  paymentMethod: '',
});
</script>

<style scoped lang="scss">
// 每个子卡片的样式
@mixin form-module {
  padding: 16px;
  box-sizing: border-box;
}

// 表单行布局
@mixin form-row-layout {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

// 表单标签样式
@mixin form-head-label-style {
  font-size: 14px;
  color: #333;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;

  &.required::before {
    content: '*';
    color: #ff4757;
    margin-right: 4px;
  }
}

.module-card {
  @include form-module;
  height: 100%;
}

.module-header {
  margin-bottom: 20px;
}

.module-content {
  .form-row {
    @include form-row-layout;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-head-label {
    @include form-head-label-style;
  }

  .display-text {
    flex: 1;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 4px;
    font-size: 14px;
    color: #666;
  }

  .select-group {
    display: flex;
    gap: 8px;
    flex: 1;
    width: calc(100% - 100px - 16px);
  }

  // 输入框和选择框样式
  :deep(.layui-input),
  :deep(.layui-select) {
    flex: 1;
  }

  .bank-info-box {
    margin-top: 10px;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #f0f0f0;

    .form-head-label {
      min-width: calc(80px - 10px);
    }
  }
}
</style>
