<template>
  <div class="register-container">
    <div class="register-card">
      <!-- 标题 -->
      <div class="register-title">
        <h2>用户注册</h2>
      </div>

      <!-- 注册类型切换 -->
      <lay-tab v-model="activeTab" class="register-tabs">
        <lay-tab-item label="个人注册" name="personal"></lay-tab-item>
        <lay-tab-item label="企业注册" name="enterprise"></lay-tab-item>
      </lay-tab>

      <!-- 个人注册表单 -->
      <div v-if="activeTab === 'personal'" class="register-form">
        <!-- 步骤指示器 -->
        <div class="steps">
          <div class="step-item" :class="{ active: currentStep === 0 }"></div>
          <div class="step-line" :class="{ active: currentStep >= 1 }"></div>
          <div class="step-item" :class="{ active: currentStep === 1 }"></div>
        </div>
        <div class="step-titles">
          <div :class="{ active: currentStep === 0 }">
            <span>1</span> 填写账户信息
          </div>
          <div :class="{ active: currentStep === 1 }">
            <span>2</span> 注册成功
          </div>
        </div>

        <!-- 步骤内容 -->
        <div v-if="currentStep === 0">
          <lay-form
            ref="personalFormRef"
            :model="personalForm"
            :rules="personalRules"
          >
            <lay-form-item
              label="用户名"
              prop="username"
              :label-width="labelWidth"
              required
            >
              <lay-input
                v-model="personalForm.username"
                placeholder="请输入字母、数字、下划线、减号，以字母开头、3-20位"
              />
            </lay-form-item>

            <lay-form-item
              label="密码"
              prop="password"
              :label-width="labelWidth"
              required
            >
              <lay-input
                v-model="personalForm.password"
                type="password"
                placeholder="6-20位英文（区分大小写）、数字、字符的组合"
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
            >
              <lay-input
                v-model="personalForm.confirmPassword"
                type="password"
                placeholder="请再输入一遍上面的密码"
              />
            </lay-form-item>

            <lay-form-item
              label="真实姓名"
              prop="realName"
              :label-width="labelWidth"
              required
            >
              <lay-input
                v-model="personalForm.realName"
                placeholder="2-10位，中文真实姓名"
              />
            </lay-form-item>

            <lay-form-item
              label="性别"
              prop="gender"
              :label-width="labelWidth"
              required
            >
              <div class="gender-radio">
                <lay-radio v-model="personalForm.gender" name="gender" value="1"
                  >男</lay-radio
                >
                <lay-radio v-model="personalForm.gender" name="gender" value="2"
                  >女</lay-radio
                >
              </div>
            </lay-form-item>

            <lay-form-item
              label="手机号"
              prop="phone"
              :label-width="labelWidth"
              required
            >
              <lay-input
                v-model="personalForm.phone"
                placeholder="请填写11位有效的手机号码"
              />
            </lay-form-item>

            <lay-form-item
              label="验证码"
              prop="captcha"
              :label-width="labelWidth"
              required
            >
              <div class="captcha-container">
                <lay-input
                  v-model="personalForm.captcha"
                  placeholder="请查收手机短信，并填写短信中的验证码"
                />
                <lay-button
                  :disabled="isCaptchaDisabled"
                  @click="sendPersonalCaptcha"
                  >{{ captchaButtonText }}</lay-button
                >
              </div>
              <p class="captcha-tip">此验证码15分钟内有效</p>
            </lay-form-item>

            <lay-form-item
              label="邀请码"
              prop="invitationCode"
              :label-width="labelWidth"
            >
              <lay-input
                v-model="personalForm.invitationCode"
                placeholder="选填"
              />
            </lay-form-item>

            <div class="agreement">
              <lay-checkbox v-model="personalForm.agreed" required
                >我已阅读并同意<a
                  href="https://newbeall.com/serviceAgreement"
                  class="agreement-link"
                  >服务协议</a
                >和<a
                  href="https://newbeall.com/privacyPolicy"
                  class="agreement-link"
                  >隐私协议</a
                ></lay-checkbox
              >
            </div>

            <lay-form-item style="text-align: center">
              <lay-button type="primary" @click="handlePersonalSubmit"
                >下一步</lay-button
              >
            </lay-form-item>
          </lay-form>
        </div>

        <!-- 注册成功页面 -->
        <div v-else-if="currentStep === 1">
          <lay-result status="success" title="注册成功">
            <template #description>
              <p>恭喜您完成注册，请点击下方按钮返回登录页面</p>
            </template>
            <template #extra>
              <lay-button type="primary" @click="goToLogin"
                >返回登录页</lay-button
              >
            </template>
          </lay-result>
        </div>
      </div>

      <!-- 企业注册表单 -->
      <div v-else-if="activeTab === 'enterprise'" class="register-form">
        <!-- 步骤指示器 -->
        <div class="steps">
          <div class="step-item" :class="{ active: currentStep === 0 }"></div>
          <div class="step-line" :class="{ active: currentStep >= 1 }"></div>
          <div class="step-item" :class="{ active: currentStep === 1 }"></div>
          <div class="step-line" :class="{ active: currentStep >= 2 }"></div>
          <div class="step-item" :class="{ active: currentStep === 2 }"></div>
        </div>
        <div class="step-titles">
          <div :class="{ active: currentStep === 0 }">
            <span>1</span> 填写账户信息
          </div>
          <div :class="{ active: currentStep === 1 }">
            <span>2</span> 填写公司信息
          </div>
          <div :class="{ active: currentStep === 2 }">
            <span>3</span> 注册成功
          </div>
        </div>

        <!-- 步骤内容 -->
        <div v-if="currentStep === 0">
          <lay-form
            ref="enterpriseFormRef"
            :model="enterpriseForm"
            :rules="enterpriseRules"
          >
            <lay-form-item
              label="企业名称"
              prop="enterpriseName"
              :label-width="labelWidth"
              required
            >
              <lay-input
                v-model="enterpriseForm.enterpriseName"
                placeholder="请输入企业名称"
              />
            </lay-form-item>

            <lay-form-item
              label="用户名"
              prop="username"
              :label-width="labelWidth"
              required
            >
              <lay-input
                v-model="enterpriseForm.username"
                placeholder="请输入字母、数字、下划线、减号，以字母开头、3-20位"
              />
            </lay-form-item>

            <lay-form-item
              label="密码"
              prop="password"
              :label-width="labelWidth"
              required
            >
              <lay-input
                v-model="enterpriseForm.password"
                type="password"
                placeholder="6-20位英文（区分大小写）、数字、字符的组合"
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
            >
              <lay-input
                v-model="enterpriseForm.confirmPassword"
                type="password"
                placeholder="请再输入一遍上面的密码"
              />
            </lay-form-item>

            <lay-form-item
              label="联系人姓名"
              prop="contactName"
              :label-width="labelWidth"
              required
            >
              <lay-input
                v-model="enterpriseForm.contactName"
                placeholder="请输入联系人姓名"
              />
            </lay-form-item>

            <lay-form-item
              label="联系电话"
              prop="contactPhone"
              :label-width="labelWidth"
              required
            >
              <lay-input
                v-model="enterpriseForm.contactPhone"
                placeholder="请填写11位有效的手机号码"
              />
            </lay-form-item>

            <lay-form-item
              label="验证码"
              prop="captcha"
              :label-width="labelWidth"
              required
            >
              <div class="captcha-container">
                <lay-input
                  v-model="enterpriseForm.captcha"
                  placeholder="请查收手机短信，并填写短信中的验证码"
                />
                <lay-button
                  :disabled="isCaptchaDisabled"
                  @click="sendEnterpriseCaptcha"
                  >{{ captchaButtonText }}</lay-button
                >
              </div>
              <p class="captcha-tip">此验证码15分钟内有效</p>
            </lay-form-item>

            <lay-form-item
              label="邀请码"
              prop="invitationCode"
              :label-width="labelWidth"
            >
              <lay-input
                v-model="enterpriseForm.invitationCode"
                placeholder="选填"
              />
            </lay-form-item>

            <div class="agreement">
              <lay-checkbox v-model="enterpriseForm.agreed" required
                >我已阅读并同意<a
                  href="https://newbeall.com/serviceAgreement"
                  class="agreement-link"
                  >服务协议</a
                >和<a
                  href="https://newbeall.com/privacyPolicy"
                  class="agreement-link"
                  >隐私协议</a
                ></lay-checkbox
              >
            </div>

            <lay-form-item style="text-align: center">
              <lay-button type="primary" @click="handleEnterpriseSubmit"
                >下一步</lay-button
              >
            </lay-form-item>
          </lay-form>
        </div>

        <!-- 公司信息填写页面 -->
        <div v-else-if="currentStep === 1">
          <lay-form
            ref="companyInfoFormRef"
            :model="enterpriseForm"
            :rules="companyInfoRules"
          >
            <lay-form-item
              label="公司简称"
              prop="companyAbbreviation"
              :label-width="labelWidth"
              required
            >
              <lay-input
                v-model="enterpriseForm.companyAbbreviation"
                placeholder="请输入公司简称"
              />
            </lay-form-item>

            <lay-form-item
              label="公司角色"
              prop="role"
              :label-width="labelWidth"
              required
            >
              <lay-radio v-model="enterpriseForm.role" name="role" value="gy"
                >产品供应商</lay-radio
              >
              <lay-radio v-model="enterpriseForm.role" name="role" value="cg"
                >工程集成商</lay-radio
              >
              <p class="role-tip">一个公司可以注册两个不同的角色账号哦！</p>
            </lay-form-item>

            <lay-form-item
              label="所在地区"
              prop="province"
              :label-width="labelWidth"
              required
            >
              <div class="region-selector">
                <lay-select
                  v-model="enterpriseForm.province"
                  placeholder="请选择省"
                  @change="handleProvinceChange"
                >
                  <lay-option
                    v-for="province in provinces"
                    :value="province.code"
                    :label="province.name"
                    :key="province.code"
                  />
                </lay-select>
                <lay-select
                  v-model="enterpriseForm.city"
                  placeholder="请选择市"
                  @change="handleCityChange"
                >
                  <lay-option
                    v-for="city in cities"
                    :value="city.code"
                    :label="city.name"
                    :key="city.code"
                  />
                </lay-select>
                <lay-select
                  v-model="enterpriseForm.district"
                  placeholder="请选择区"
                >
                  <lay-option
                    v-for="district in districts"
                    :value="district.code"
                    :label="district.name"
                    :key="district.code"
                  />
                </lay-select>
              </div>
            </lay-form-item>

            <lay-form-item
              label="详细地址"
              prop="address"
              :label-width="labelWidth"
              required
            >
              <lay-input
                v-model="enterpriseForm.address"
                placeholder="请输入详细地址"
              />
            </lay-form-item>

            <lay-form-item
              label="法人代表"
              prop="legalPerson"
              :label-width="labelWidth"
              required
            >
              <lay-input
                v-model="enterpriseForm.legalPerson"
                placeholder="请输入法人代表姓名"
              />
            </lay-form-item>

            <lay-form-item
              label="税务登记号"
              prop="taxId"
              :label-width="labelWidth"
              required
            >
              <lay-input
                v-model="enterpriseForm.taxId"
                placeholder="请输入15位或者18位的英文字母和数字"
              />
            </lay-form-item>

            <lay-form-item
              label="营业执照"
              prop="businessLicense"
              :label-width="labelWidth"
              required
            >
              <div class="upload-container">
                <lay-input
                  v-model="enterpriseForm.businessLicense"
                  readonly
                  placeholder="请上传jpg、png格式图片"
                />
                <lay-button @click="uploadBusinessLicense">上传</lay-button>
              </div>
            </lay-form-item>

            <lay-form-item
              label="施工资质"
              prop="constructionQualification"
              :label-width="labelWidth"
            >
              <div class="upload-container">
                <lay-input
                  v-model="enterpriseForm.constructionQualification"
                  readonly
                  placeholder="请上传jpg、png格式图片（选填）"
                />
                <lay-button @click="uploadConstructionQualification"
                  >上传</lay-button
                >
              </div>
            </lay-form-item>

            <lay-form-item style="text-align: center">
              <lay-button type="default" @click="prevStep">上一步</lay-button>
              <lay-button type="primary" @click="handleCompanyInfoSubmit"
                >下一步</lay-button
              >
            </lay-form-item>
          </lay-form>
        </div>

        <!-- 注册成功页面 -->
        <div v-else-if="currentStep === 2">
          <lay-result status="success" title="注册成功">
            <template #description>
              <p>恭喜您完成注册，请点击下方按钮返回登录页面</p>
            </template>
            <template #extra>
              <lay-button type="primary" @click="goToLogin"
                >返回登录页</lay-button
              >
            </template>
          </lay-result>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { type LayFormInstance } from 'layui-vue';

// 路由
const router = useRouter();

// 响应式数据
const activeTab = ref('personal');
const currentStep = ref(0);
const labelWidth = '120px';

// 个人注册表单
const personalFormRef = ref<LayFormInstance>();
const personalForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  realName: '',
  gender: '1',
  phone: '',
  captcha: '',
  invitationCode: '',
  agreed: false,
});

// 企业注册表单
const enterpriseFormRef = ref<LayFormInstance>();
const companyInfoFormRef = ref<LayFormInstance>();
const enterpriseForm = reactive({
  enterpriseName: '',
  username: '',
  password: '',
  confirmPassword: '',
  contactName: '',
  contactPhone: '',
  captcha: '',
  invitationCode: '',
  agreed: false,
  companyAbbreviation: '',
  role: 'gy',
  province: '',
  city: '',
  district: '',
  address: '',
  legalPerson: '',
  taxId: '',
  businessLicense: '',
  constructionQualification: '',
});

// 验证码相关
const isCaptchaDisabled = ref(false);
const captchaButtonText = ref('发送验证码');
const countdown = ref(60);

// 个人注册验证规则
const personalRules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度3-20位', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/,
      message: '只能输入字母、数字、下划线、减号，且以字母开头',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度6-20位', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d).{6,20}$/,
      message: '密码至少包含字母和数字',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请再输入一遍密码', trigger: 'blur' },
    {
      validator: (rule, value) => value === personalForm.password,
      message: '两次密码输入不一致',
      trigger: 'blur',
    },
  ],
  realName: [
    { required: true, message: '真实姓名不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '真实姓名长度2-10位', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5]+$/, message: '只能输入中文', trigger: 'blur' },
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入有效的手机号码',
      trigger: 'blur',
    },
  ],
  captcha: [
    { required: true, message: '验证码不能为空', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位数字验证码', trigger: 'blur' },
  ],
  agreed: [{ required: true, message: '请先同意条款', trigger: 'change' }],
};

// 企业注册验证规则
const enterpriseRules = {
  enterpriseName: [
    { required: true, message: '企业名称不能为空', trigger: 'blur' },
    { min: 3, message: '企业名称至少3个字符', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度3-20位', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/,
      message: '只能输入字母、数字、下划线、减号，且以字母开头',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度6-20位', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d).{6,20}$/,
      message: '密码至少包含字母和数字',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请再输入一遍密码', trigger: 'blur' },
    {
      validator: (rule, value) => value === enterpriseForm.password,
      message: '两次密码输入不一致',
      trigger: 'blur',
    },
  ],
  contactName: [
    { required: true, message: '联系人姓名不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '联系人姓名长度2-10位', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5]+$/, message: '只能输入中文', trigger: 'blur' },
  ],
  contactPhone: [
    { required: true, message: '联系电话不能为空', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入有效的手机号码',
      trigger: 'blur',
    },
  ],
  captcha: [
    { required: true, message: '验证码不能为空', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位数字验证码', trigger: 'blur' },
  ],
  agreed: [{ required: true, message: '请先同意条款', trigger: 'change' }],
};

// 公司信息验证规则
const companyInfoRules = {
  companyAbbreviation: [
    { required: true, message: '公司简称不能为空', trigger: 'blur' },
    { min: 2, max: 6, message: '请输入2~6个字符', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
      message: '无法输入特殊符号',
      trigger: 'blur',
    },
  ],
  role: [{ required: true, message: '请选择公司角色', trigger: 'change' }],
  province: [{ required: true, message: '请选择省份', trigger: 'change' }],
  city: [{ required: true, message: '请选择城市', trigger: 'change' }],
  address: [
    { required: true, message: '详细地址不能为空', trigger: 'blur' },
    { min: 3, message: '最少输入3个字符', trigger: 'blur' },
  ],
  legalPerson: [
    { required: true, message: '请输入法人代表', trigger: 'blur' },
    { min: 2, max: 10, message: '法人代表长度2-10位', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5]+$/, message: '只能输入中文', trigger: 'blur' },
  ],
  taxId: [
    { required: true, message: '税务登记号不能为空', trigger: 'blur' },
    {
      pattern: /^[A-Za-z0-9]{15,18}$/,
      message: '请输入15位或者18位的英文字母和数字',
      trigger: 'blur',
    },
  ],
  businessLicense: [
    { required: true, message: '请上传营业执照', trigger: 'blur' },
  ],
};

// 地区数据（模拟）
const provinces = [
  { code: '110000', name: '北京' },
  { code: '120000', name: '天津' },
  { code: '130000', name: '河北省' },
  { code: '140000', name: '山西省' },
  // 更多省份数据...
];

const cities = ref([]);
const districts = ref([]);

// 处理省份变化
const handleProvinceChange = (code) => {
  // 模拟根据省份加载城市数据
  cities.value = [
    { code: `${code}01`, name: '市辖区' },
    {
      code: `${code}02`,
      name: `${provinces.find((p) => p.code === code)?.name}市`,
    },
  ];
  districts.value = [];
};

// 处理城市变化
const handleCityChange = (code) => {
  // 模拟根据城市加载区县数据
  districts.value = [
    { code: `${code}01`, name: '区1' },
    { code: `${code}02`, name: '区2' },
    { code: `${code}03`, name: '区3' },
  ];
};

// 发送个人注册验证码
const sendPersonalCaptcha = () => {
  if (!personalForm.phone) {
    alert('请输入手机号码');
    return;
  }

  // 模拟发送验证码
  isCaptchaDisabled.value = true;
  captchaButtonText.value = `${countdown.value}s后可重发`;

  const timer = setInterval(() => {
    countdown.value--;
    captchaButtonText.value = `${countdown.value}s后可重发`;

    if (countdown.value <= 0) {
      clearInterval(timer);
      isCaptchaDisabled.value = false;
      captchaButtonText.value = '发送验证码';
      countdown.value = 60;
    }
  }, 1000);
};

// 发送企业注册验证码
const sendEnterpriseCaptcha = () => {
  if (!enterpriseForm.contactPhone) {
    alert('请输入手机号码');
    return;
  }

  // 模拟发送验证码
  isCaptchaDisabled.value = true;
  captchaButtonText.value = `${countdown.value}s后可重发`;

  const timer = setInterval(() => {
    countdown.value--;
    captchaButtonText.value = `${countdown.value}s后可重发`;

    if (countdown.value <= 0) {
      clearInterval(timer);
      isCaptchaDisabled.value = false;
      captchaButtonText.value = '发送验证码';
      countdown.value = 60;
    }
  }, 1000);
};

// 密码强度检测
const getPasswordStrength = (password) => {
  let strength = 0;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^A-Za-z\d]/.test(password)) strength++;
  return Math.min(strength, 3);
};

// 获取密码强度样式
const getStrengthClass = (index) => {
  const password =
    activeTab.value === 'personal'
      ? personalForm.password
      : enterpriseForm.password;
  const strength = getPasswordStrength(password);
  return index < strength ? 'strong' : 'weak';
};

// 处理个人注册提交
const handlePersonalSubmit = async () => {
  if (!personalFormRef.value) return;

  try {
    await personalFormRef.value.validate();
    // 模拟提交成功，进入下一步
    currentStep.value = 1;
  } catch (error) {
    // 验证失败
    console.log('验证失败:', error);
  }
};

// 处理企业注册提交
const handleEnterpriseSubmit = async () => {
  if (!enterpriseFormRef.value) return;

  try {
    await enterpriseFormRef.value.validate();
    // 模拟提交成功，进入下一步
    currentStep.value = 1;
  } catch (error) {
    // 验证失败
    console.log('验证失败:', error);
  }
};

// 处理公司信息提交
const handleCompanyInfoSubmit = async () => {
  if (!companyInfoFormRef.value) return;

  try {
    await companyInfoFormRef.value.validate();
    // 模拟提交成功，进入下一步
    currentStep.value = 2;
  } catch (error) {
    // 验证失败
    console.log('验证失败:', error);
  }
};

// 上一步
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// 返回登录页
const goToLogin = () => {
  router.push('/login');
};

// 上传营业执照
const uploadBusinessLicense = () => {
  // 模拟文件上传
  enterpriseForm.businessLicense = 'business_license.jpg';
};

// 上传施工资质
const uploadConstructionQualification = () => {
  // 模拟文件上传
  enterpriseForm.constructionQualification = 'construction_qualification.jpg';
};
</script>

<style lang="scss" scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.register-title {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.register-tabs {
  margin: 20px;
}

.register-form {
  padding: 0 20px 20px;
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.step-item {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #dcdcdc;
  position: relative;
  transition: all 0.3s;
}

.step-item.active {
  background-color: #1890ff;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: #dcdcdc;
  margin: 0 10px;
  transition: all 0.3s;
}

.step-line.active {
  background-color: #1890ff;
}

.step-titles {
  display: flex;
  justify-content: space-between;
  margin: -10px 50px 20px;
}

.step-titles > div {
  color: #999;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.step-titles > div.active {
  color: #1890ff;
}

.step-titles > div span {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #dcdcdc;
  color: #fff;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  margin-right: 5px;
}

.step-titles > div.active span {
  background-color: #1890ff;
}

.gender-radio {
  display: flex;
  gap: 20px;
}

.password-strength {
  margin-top: 10px;
  font-size: 14px;
}

.strength-indicator {
  display: inline-block;
  width: 60px;
  height: 8px;
  margin: 0 5px;
  background-color: #dcdcdc;
  border-radius: 4px;
  transition: all 0.3s;
}

.strength-indicator.strong {
  background-color: #52c41a;
}

.captcha-container {
  display: flex;
  gap: 10px;
}

.captcha-container .lay-input {
  flex: 1;
}

.captcha-tip {
  margin-top: 5px;
  font-size: 12px;
  color: #999;
}

.agreement {
  margin: 20px 0;
  text-align: center;
  font-size: 14px;
}

.agreement-link {
  color: #1890ff;
  text-decoration: underline;
}

.region-selector {
  display: flex;
  gap: 10px;
}

.region-selector .lay-select {
  flex: 1;
}

.upload-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.upload-container .lay-input {
  flex: 1;
}

.role-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}

.prev-btn {
  margin-right: 10px;
}
</style>
