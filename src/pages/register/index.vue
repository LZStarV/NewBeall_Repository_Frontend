<template>
  <cover-layout>
    <template #content>
      <div class="login-page">
        <section class="login-card">
          <lay-button
            size="sm"
            class="back"
            prefix-icon="layui-icon-left"
            @click="router.back()"
          >
            返回
          </lay-button>

          <p class="welcome-text">用户注册</p>
          <lay-tab v-model="activeTab" type="brief" class="register-tabs">
            <lay-tab-item id="personal" title="个人注册"></lay-tab-item>
            <lay-tab-item id="enterprise" title="企业注册"></lay-tab-item>
          </lay-tab>

          <!-- Step component -->
          <lay-step v-model="currentStep" :steps="steps" class="step-component"></lay-step>

          <lay-form
            class="login-form"
              :model="form"
              :rules="rules"
              ref="registerFormRef"
              isLabelTooltip
            >
              <!-- 个人注册表单 -->
              <div v-if="activeTab === 'personal'">
                <!-- 步骤内容区域 -->
                <div v-if="currentStep === 0">
              <lay-form-item
                label="用户名"
                prop="username"
                :label-width="labelWidth"
                required
                required-error-message="用户名不能为空"
                class="form-group"
              >
                <lay-input
                  v-model="form.username"
                  :class="{ 'input-focus': usernameFocus }"
                  placeholder="请输入字母、数字、下划线、减号，以字母开头、3-20位"
                  @focus="usernameFocus = true"
                  @blur="usernameFocus = false"
                />
              </lay-form-item>

              <lay-form-item
                label="密码"
                prop="password"
                :label-width="labelWidth"
                required
                required-error-message="密码不能为空"
                class="form-group"
              >
                <lay-input
                  v-model="form.password"
                  :class="{ 'input-focus': passwordFocus }"
                  type="password"
                  placeholder="6-20位英文（区分大小写）、数字、字符的组合"
                  @focus="passwordFocus = true"
                  @blur="passwordFocus = false"
                />
                <div class="password-strength">
                  安全程度：
                  <span
                    :class="['strength-indicator', getStrengthClass(0)]"
                  ></span>
                  <span
                    :class="['strength-indicator', getStrengthClass(1)]"
                  ></span>
                  <span
                    :class="['strength-indicator', getStrengthClass(2)]"
                  ></span>
                </div>
              </lay-form-item>

              <lay-form-item
                label="确认密码"
                prop="confirmPassword"
                :label-width="labelWidth"
                required
                required-error-message="请再输入一遍上面的密码"
                class="form-group"
              >
                <lay-input
                  v-model="form.confirmPassword"
                  :class="{ 'input-focus': confirmPasswordFocus }"
                  type="password"
                  placeholder="请再输入一遍上面的密码"
                  @focus="confirmPasswordFocus = true"
                  @blur="confirmPasswordFocus = false"
                />
              </lay-form-item>

              <lay-form-item
                label="真实姓名"
                prop="realName"
                :label-width="labelWidth"
                required
                required-error-message="真实姓名不能为空"
                class="form-group"
              >
                <lay-input
                  v-model="form.realName"
                  :class="{ 'input-focus': realNameFocus }"
                  placeholder="2-10位，中文真实姓名"
                  @focus="realNameFocus = true"
                  @blur="realNameFocus = false"
                />
              </lay-form-item>

              <lay-form-item
                label="性别"
                prop="gender"
                :label-width="labelWidth"
                required
                required-error-message="请选择性别"
                class="form-group"
              >
                <div class="gender-options">
                  <lay-radio v-model="form.gender" name="gender" value="male"
                    >男</lay-radio
                  >
                  <lay-radio v-model="form.gender" name="gender" value="female"
                    >女</lay-radio
                  >
                </div>
              </lay-form-item>

              <lay-form-item
                label="手机号"
                prop="phone"
                :label-width="labelWidth"
                required
                required-error-message="手机号不能为空"
                class="form-group"
              >
                <lay-input
                  v-model="form.phone"
                  :class="{ 'input-focus': phoneFocus }"
                  placeholder="请填写11位有效的手机号码"
                  @focus="phoneFocus = true"
                  @blur="phoneFocus = false"
                />
              </lay-form-item>

              <lay-form-item
                label="所在地区"
                prop="province"
                :label-width="labelWidth"
                required
                required-error-message="请选择所在地区"
                class="form-group"
              >
                <div class="col-xs-9 ShrinkInside">
                  <div class="col-xs-3">
                    <lay-select v-model="form.province" placeholder="请选择省" @change="handleProvinceChange">
                      <lay-option v-for="province in provinces" :value="province.code" :label="province.name"></lay-option>
                    </lay-select>
                  </div>
                  <div class="col-xs-3">
                    <lay-select v-model="form.city" placeholder="请选择市" @change="handleCityChange">
                      <lay-option v-for="city in cities" :value="city.code" :label="city.name"></lay-option>
                    </lay-select>
                  </div>
                  <div class="col-xs-3">
                    <lay-select v-model="form.district" placeholder="请选择区">
                      <lay-option v-for="district in districts" :value="district.code" :label="district.name"></lay-option>
                    </lay-select>
                  </div>
                <!-- 注册成功步骤 -->
                <div v-else-if="currentStep === 2">
                  <lay-result status="success" title="注册成功">
                    <template #description>
                      <p>恭喜您完成注册，请点击下方按钮返回登录页面</p>
                    </template>
                    <template #extra>
                      <lay-button type="primary" @click="goToLogin">返回登录页</lay-button>
                    </template>
                  </lay-result>
                </div>
              </div>
                      <div class="item col-xs-12">
                        <span class="intelligent-label f-fl">法人代表：</span>
                        <div class="f-fl item-ifo">
                          <lay-input
                            v-model="form.legalPerson"
                            placeholder="请输入法人代表姓名"
                          />
                        </div>
                      </div>
              </lay-form-item>

              <lay-form-item
                label="验证码"
                prop="captcha"
                :label-width="labelWidth"
                required
                required-error-message="验证码不能为空"
                class="form-group"
              >
                <div class="captcha">
                  <lay-input
                    v-model="form.captcha"
                    :class="{ 'input-focus': captchaFocus }"
                    placeholder="请查收手机短信，并填写短信中的验证码"
                    @focus="captchaFocus = true"
                    @blur="captchaFocus = false"
                  />
                  <lay-button
                    type="normal"
                    class="captcha-button"
                    @click="sendCaptcha"
                    :disabled="isCaptchaDisabled"
                  >
                    {{ captchaButtonText }}
                  </lay-button>
                </div>
                <p class="captcha-tip">此验证码15分钟内有效</p>
              </lay-form-item>

              <lay-form-item
                label="邀请码"
                prop="invitationCode"
                :label-width="labelWidth"
                class="form-group"
              >
                <lay-input
                  v-model="form.invitationCode"
                  :class="{ 'input-focus': invitationCodeFocus }"
                  placeholder="选填"
                  @focus="invitationCodeFocus = true"
                  @blur="invitationCodeFocus = false"
                />
              </lay-form-item>

              <div class="agreement">
                <lay-checkbox
                  v-model="form.agreed"
                  skin="primary"
                  name="agreed"
                  required
                  class="checkbox"
                >
                  我已阅读并同意<a
                    href="https://newbeall.com/serviceAgreement"
                    class="agreement-link"
                    >服务协议</a
                  >和<a
                    href="https://newbeall.com/privacyPolicy"
                    class="agreement-link"
                    >隐私协议</a
                  >
                </lay-checkbox>
              </div>

              <lay-form-item style="text-align: center">
                  <lay-button
                    type="default"
                    @click="prevStep"
                    class="prev-btn"
                  >
                    上一步
                  </lay-button>
                  <lay-button
                    class="submit-btn"
                    type="primary"
                    @click="handleSubmit"
                  >
                    下一步
                  </lay-button>
                </lay-form-item>
              </div>
              <!-- 注册成功步骤 -->
              <div v-else-if="currentStep === 1">
                <lay-result status="success" title="注册成功">
                  <template #description>
                    <p>恭喜您完成注册，请点击下方按钮返回登录页面</p>
                  </template>
                  <template #extra>
                    <lay-button type="primary" @click="goToLogin">返回登录页</lay-button>
                  </template>
                </lay-result>
              </div>

            <!-- 企业注册表单 -->
              <div v-if="activeTab === 'enterprise'">
                <!-- 步骤内容区域 -->
                <div v-if="currentStep === 0">
              <lay-form-item
                label="企业名称"
                prop="enterpriseName"
                :label-width="labelWidth"
                required
                required-error-message="企业名称不能为空"
                class="form-group"
              >
                <lay-input
                  v-model="form.enterpriseName"
                  :class="{ 'input-focus': enterpriseNameFocus }"
                  placeholder="请输入企业名称"
                  @focus="enterpriseNameFocus = true"
                  @blur="enterpriseNameFocus = false"
                />
              </lay-form-item>

              <lay-form-item
                label="用户名"
                prop="username"
                :label-width="labelWidth"
                required
                required-error-message="用户名不能为空"
                class="form-group"
              >
                <lay-input
                  v-model="form.username"
                  :class="{ 'input-focus': usernameFocus }"
                  placeholder="请输入字母、数字、下划线、减号，以字母开头、3-20位"
                  @focus="usernameFocus = true"
                  @blur="usernameFocus = false"
                />
              </lay-form-item>

              <lay-form-item
                label="密码"
                prop="password"
                :label-width="labelWidth"
                required
                required-error-message="密码不能为空"
                class="form-group"
              >
                <lay-input
                  v-model="form.password"
                  :class="{ 'input-focus': passwordFocus }"
                  type="password"
                  placeholder="6-20位英文（区分大小写）、数字、字符的组合"
                  @focus="passwordFocus = true"
                  @blur="passwordFocus = false"
                />
                <div class="password-strength">
                  安全程度：
                  <span
                    :class="['strength-indicator', getStrengthClass(0)]"
                  ></span>
                  <span
                    :class="['strength-indicator', getStrengthClass(1)]"
                  ></span>
                  <span
                    :class="['strength-indicator', getStrengthClass(2)]"
                  ></span>
                </div>
              </lay-form-item>

              <lay-form-item
                label="确认密码"
                prop="confirmPassword"
                :label-width="labelWidth"
                required
                required-error-message="请再输入一遍上面的密码"
                class="form-group"
              >
                <lay-input
                  v-model="form.confirmPassword"
                  :class="{ 'input-focus': confirmPasswordFocus }"
                  type="password"
                  placeholder="请再输入一遍上面的密码"
                  @focus="confirmPasswordFocus = true"
                  @blur="confirmPasswordFocus = false"
                />
              </lay-form-item>

              <lay-form-item
                label="联系人姓名"
                prop="contactName"
                :label-width="labelWidth"
                required
                required-error-message="联系人姓名不能为空"
                class="form-group"
              >
                <lay-input
                  v-model="form.contactName"
                  :class="{ 'input-focus': contactNameFocus }"
                  placeholder="请输入联系人姓名"
                  @focus="contactNameFocus = true"
                  @blur="contactNameFocus = false"
                />
              </lay-form-item>

              <lay-form-item
                label="联系电话"
                prop="contactPhone"
                :label-width="labelWidth"
                required
                required-error-message="联系电话不能为空"
                class="form-group"
              >
                <lay-input
                  v-model="form.contactPhone"
                  :class="{ 'input-focus': contactPhoneFocus }"
                  placeholder="请填写11位有效的手机号码"
                  @focus="contactPhoneFocus = true"
                  @blur="contactPhoneFocus = false"
                />
              </lay-form-item>

              <lay-form-item
                label="验证码"
                prop="captcha"
                :label-width="labelWidth"
                required
                required-error-message="验证码不能为空"
                class="form-group"
              >
                <div class="captcha">
                  <lay-input
                    v-model="form.captcha"
                    :class="{ 'input-focus': captchaFocus }"
                    placeholder="请查收手机短信，并填写短信中的验证码"
                    @focus="captchaFocus = true"
                    @blur="captchaFocus = false"
                  />
                  <lay-button
                    type="normal"
                    class="captcha-button"
                    @click="sendCaptcha"
                    :disabled="isCaptchaDisabled"
                  >
                    {{ captchaButtonText }}
                  </lay-button>
                </div>
                <p class="captcha-tip">此验证码15分钟内有效</p>
              </lay-form-item>

              <lay-form-item
                label="邀请码"
                prop="invitationCode"
                :label-width="labelWidth"
                class="form-group"
              >
                <lay-input
                  v-model="form.invitationCode"
                  :class="{ 'input-focus': invitationCodeFocus }"
                  placeholder="选填"
                  @focus="invitationCodeFocus = true"
                  @blur="invitationCodeFocus = false"
                />
              </lay-form-item>

              <div class="agreement">
                <lay-checkbox
                  value="agreed"
                  v-model="form.agreed"
                  skin="primary"
                  name="agreed"
                  required
                >
                  我已阅读并同意<a
                    href="https://newbeall.com/serviceAgreement"
                    class="agreement-link"
                    >服务协议</a
                  >和<a
                    href="https://newbeall.com/privacyPolicy"
                    class="agreement-link"
                    >隐私协议</a
                  >
                </lay-checkbox>
              </div>

              <lay-form-item style="text-align: center">
                <lay-button
                  class="submit-btn"
                  type="primary"
                  @click="handleSubmit"
                >
                  下一步
                </lay-button>
              </lay-form-item>
            </div>
          </lay-form>
        </section>
      </div>
    </template>
  </cover-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import CoverLayout from '@/layouts/CoverLayout.vue';
import notify from '@/utils/notify.ts';

const router = useRouter();
const registerFormRef = ref();
const activeTab = ref('personal');
const currentStep = ref(0);
const steps = computed(() => {
  return activeTab.value === 'personal'
    ? [
        { title: '填写账户信息' },
        { title: '注册成功' }
      ]
    : [
        { title: '填写账户信息' },
        { title: '填写公司信息' },
        { title: '注册成功' }
      ];
});
const labelWidth = ref(100);

// 验证码按钮状态
const isCaptchaDisabled = ref(false);
const captchaButtonText = ref('发送验证码');

// 状态管理
const usernameFocus = ref(false);
const passwordFocus = ref(false);
const confirmPasswordFocus = ref(false);
const realNameFocus = ref(false);
const phoneFocus = ref(false);
const captchaFocus = ref(false);
const invitationCodeFocus = ref(false);
const enterpriseNameFocus = ref(false);
const contactNameFocus = ref(false);
const contactPhoneFocus = ref(false);

// 表单数据
const form = reactive({
  // 公共字段
  username: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  invitationCode: '',
  agreed: false,
  // 个人注册字段
  realName: '',
  gender: 'male',
  phone: '',
  // 企业注册字段
  enterpriseName: '',
  companyAbbreviation: '',
  role: 'gy',
  province: '',
  city: '',
  district: '',
  address: '',
  legalPerson: '',
  contactName: '',
  contactPhone: '',
});

// 表单校验规则
const rules = {
  companyName: [
    { required: true, message: '请输入公司名称', trigger: 'blur' },
    { min: 3, message: '公司名称至少3个字符', trigger: 'blur' }
  ],
  companyAbbreviation: [
    { required: true, message: '请输入公司简称', trigger: 'blur' },
    { min: 2, max: 6, message: '公司简称2-6个字符', trigger: 'blur' }
  ],
  province: [
    { required: true, message: '请选择省份', trigger: 'change' }
  ],
  city: [
    { required: true, message: '请选择城市', trigger: 'change' }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 3, message: '详细地址至少3个字符', trigger: 'blur' }
  ],
  legalPerson: [
    { required: true, message: '请输入法人代表', trigger: 'blur' },
    { pattern: /^[一-龥]{2,10}$/, message: '请输入2-10位中文', trigger: 'blur' }
  ],

  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/,
      message: '请输入字母、数字、下划线、减号，以字母开头、3-20位',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' },
    {
      pattern:
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-=\[\]{};':",.\/?])/,
      message: '6-20位英文（区分大小写）、数字、字符的组合',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (value: string) => value === form.password,
      message: '两次输入的密码不一致',
      trigger: 'blur',
    },
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5]{2,10}$/,
      message: '2-10位中文真实姓名',
      trigger: 'blur',
    },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入11位有效的手机号码',
      trigger: 'blur',
    },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '请输入6位验证码', trigger: 'blur' },
  ],
  enterpriseName: [
    { required: true, message: '请输入企业名称', trigger: 'blur' },
  ],
  contactName: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入11位有效的手机号码',
      trigger: 'blur',
    },
  ],
  agreed: [
    {
      required: true,
      message: '请阅读并同意服务协议和隐私协议',
      trigger: 'change',
    },
  ],
};

// 地区选择逻辑
const provinces = ref([
  { code: '110000', name: '北京' },
  { code: '310000', name: '上海' },
  { code: '440000', name: '广东' }
  // 其他省份数据
]);
const cities = ref([]);
const districts = ref([]);

const handleProvinceChange = (code) => {
  // 模拟城市数据加载
  cities.value = [
    { code: code + '01', name: '市辖区' },
    { code: code + '02', name: '其他区' }
  ];
  districts.value = [];
};

const handleCityChange = (code) => {
  // 模拟区县数据加载
  districts.value = [
    { code: code + '01', name: '城区' },
    { code: code + '02', name: '郊区' }
  ];
};

// 发送验证码
const sendCaptcha = async () => {
  const phone = activeTab.value === 'personal' ? form.phone : form.contactPhone;
  if (!phone) {
    notify.error('请先输入手机号码');
    return;
  }

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    notify.error('请输入有效的手机号码');
    return;
  }

  try {
    isCaptchaDisabled.value = true;
    captchaButtonText.value = '发送中...';

    // 模拟API调用，实际项目中替换为真实接口
    await new Promise((resolve) => setTimeout(resolve, 1500));

    notify.success('验证码已发送，请注意查收');

    // 60秒倒计时
    let countdown = 60;
    const timer = setInterval(() => {
      countdown--;
      captchaButtonText.value = `${countdown}秒后重新发送`;
      if (countdown <= 0) {
        clearInterval(timer);
        isCaptchaDisabled.value = false;
        captchaButtonText.value = '发送验证码';
      }
    }, 1000);
  } catch (error) {
    notify.error('验证码发送失败，请稍后重试');
    console.error(error);
    isCaptchaDisabled.value = false;
    captchaButtonText.value = '发送验证码';
  }
};

// 密码强度检测
const getStrengthClass = (index: number) => {
  const strength = form.password ? getPasswordStrength(form.password) : 0;
  return strength > index ? 'strength-high' : 'strength-low';
};

// 计算密码强度
const getPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return Math.min(strength, 3);
};

// 表单提交
const handleSubmit = async () => {
  const isValid = await new Promise((resolve) => {
    registerFormRef.value.validate((valid: boolean) => resolve(valid));
  });

  if (!isValid) return;

  try {
    // 根据当前步骤和注册类型执行不同验证
    if ((activeTab.value === 'personal' && currentStep.value === 0) ||
        (activeTab.value === 'enterprise' && currentStep.value === 0)) {
      // 验证账户信息
      const isValid = await registerFormRef.value.validateField(['username', 'password', 'confirmPassword', 'captcha']);
      if (!isValid) return;
    } else if (activeTab.value === 'enterprise' && currentStep.value === 1) {
      // 验证企业信息
      const isValid = await registerFormRef.value.validateField(['companyName', 'companyAbbreviation', 'province', 'city', 'address']);
      if (!isValid) return;
    }

    // 模拟API调用，实际项目中替换为真实接口
    await new Promise((resolve) => setTimeout(resolve, 1500));
    currentStep.value++;
  } catch (error) {
    notify.error('注册失败，请稍后重试');
    console.error(error);
  }
};

// 前往登录页
const goToLogin = () => {
  router.push('/login');
};

// 下一步
const nextStep = () => {
  currentStep.value++;
};

// 上一步
const prevStep = () => {
  currentStep.value--;
};
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;

  .login-card {
    width: 40rem;
    background: rgba(255, 255, 255);
    border-radius: $border-radius-large;
    padding: 2rem 3rem;
    box-shadow: $box-shadow-base;
    backdrop-filter: blur(5px);
    overflow: hidden;
    position: relative;

    .back {
      position: absolute;
      top: 1rem;
      left: 1rem;
    }

    .welcome-text {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 1px;
      color: $primary-color;
      margin: 2rem 0;
    }

    .register-tabs {
      margin-bottom: 1.5rem;
    }

    .login-form {
      width: 100%;

      .form-group {
        :deep(.layui-input) {
          padding: 0 0.5rem;
          border: 1px solid #e2e2e2;
          border-radius: $border-radius-base;
          font-size: 0.8rem;
          transition: all 0.3s ease;

          &.input-focus,
          &:focus {
            border-color: $input-focus-border-color;
            box-shadow: 0 0 0 2px $primary-color-light;
            outline: none;
          }
        }

        :deep(.layui-form-item-label) {
          padding: 0.5rem 0;
        }
      }

      .gender-options {
        display: flex;
        gap: 1rem;
        padding-top: 0.3rem;
      }

      .captcha {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .captcha-button {
          min-width: 100px;
        }
      }

      .captcha-tip {
        font-size: 0.7rem;
        color: $text-secondary;
        margin-top: 0.3rem;
      }

      .password-strength {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.3rem;
        font-size: 0.7rem;

        .strength-indicator {
          display: inline-block;
          width: 20px;
          height: 6px;
          border-radius: 3px;
          background-color: #e5e5e5;

          &.strength-high {
            background-color: $primary-color;
          }
        }
      }

      .agreement {
        margin: 1rem 0;
        font-size: 0.8rem;
        display: flex;
        align-items: center;

        .checkbox {
          :deep(.layui-checkbox-label) {
            height: auto;
          }
        }

        .agreement-link {
          color: $primary-color;
          margin: 0 0.2rem;
        }
      }

      .submit-btn {
        width: 90%;
        height: 2.5rem;
        font-size: 1rem;
      }
    }
  }
}

@media (max-width: $pad_layout_breakpoint) {
  .login-card {
    width: 90%;
    padding: 1rem;
  }

  .welcome-text {
    font-size: 1.2rem;
  }

  .submit-btn {
    width: 100%;
  }
}
</style>
