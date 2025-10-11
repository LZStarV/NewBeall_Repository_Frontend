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

          <p class="welcome-text">找回密码</p>
          <lay-form
            ref="loginFormRef"
            class="login-form"
            :model="form"
            :rule="rules"
            is-label-tooltip
          >
            <lay-form-item
              label="电话"
              prop="phone"
              :label-width="labelWidth"
              required
              required-error-message="手机号不能为空"
              class="form-group"
            >
              <lay-input
                v-model="form.phone"
                :class="{ 'input-focus': phoneFocus }"
                placeholder="请输入手机号码"
                @focus="phoneFocus = true"
                @blur="phoneFocus = false"
              />
            </lay-form-item>
            <lay-form-item
              label="验证码"
              prop="password"
              :label-width="labelWidth"
              required
              required-error-message="验证码不能为空"
              class="form-group"
            >
              <div class="captcha">
                <lay-input
                  v-model="form.captcha"
                  :class="{ 'input-focus': captchaFocus }"
                  placeholder="短信验证码"
                  @focus="captchaFocus = true"
                  @blur="captchaFocus = false"
                />
                <lay-button
                  type="normal"
                  class="captcha-button"
                  :disabled="isCaptchaDisabled"
                  @click="getMessageCaptcha"
                >
                  {{ captchaButtonText }}
                </lay-button>
              </div>
            </lay-form-item>
            <lay-form-item
              label="新密码"
              prop="password"
              :label-width="labelWidth"
              required
              required-error-message="新密码不能为空"
              class="form-group"
            >
              <lay-input
                v-model="form.password"
                :class="{ 'input-focus': passwordFocus }"
                placeholder="请输入新的密码"
                type="password"
                @focus="passwordFocus = true"
                @blur="passwordFocus = false"
              />
            </lay-form-item>
            <lay-form-item
              label="确认密码"
              prop="confirmPassword"
              :label-width="labelWidth"
              required
              required-error-message="确认密码不能为空"
              class="form-group"
            >
              <lay-input
                v-model="form.confirmPassword"
                :class="{ 'input-focus': confirmPasswordFocus }"
                type="password"
                placeholder="请确认密码"
                @focus="confirmPasswordFocus = true"
                @blur="confirmPasswordFocus = false"
              />
            </lay-form-item>
            <lay-form-item style="text-align: center">
              <lay-button class="submit-btn" type="primary" @click="submit"
                >
提交
</lay-button
              >
            </lay-form-item>
          </lay-form>
        </section>
      </div>
    </template>
  </cover-layout>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

import CoverLayout from '@/layouts/CoverLayout.vue';
import notify from '@/utils/notify.ts';
import forgetApi from '@/api/forget/forgetApi.ts';

const router = useRouter();

// 表单校验规则
const rules = {
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    {
      len: 11,
      message: '请输入正确的电话格式',
      trigger: 'blur',
    },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      len: 6,
      message: '请输入6位验证码',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入新的密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码必须在6到20位', trigger: 'blur' },
    {
      pattern: /(?=.*[A-Za-z])(?=.*\d)/,
      message: '密码必须包含英文字母和数字',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认新的密码', trigger: 'blur' },
    {
      validator: (value: string, callback: (error: Error) => void) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          return true;
        }
      },
      trigger: 'blur',
    },
  ],
};
const loginFormRef = ref();

// 验证码按钮状态
const isCaptchaDisabled = ref(false);
const captchaButtonText = ref('获取验证码');

// 状态管理
const phoneFocus = ref(false);
const captchaFocus = ref(false);
const passwordFocus = ref(false);
const confirmPasswordFocus = ref(false);
// 标签宽度
const labelWidth = ref(90);
// 表单数据
const form = reactive({
  phone: '',
  captcha: '',
  password: '',
  confirmPassword: '',
});

// 获取短信验证码
const getMessageCaptcha = async () => {
  try {
    const res = await forgetApi.getMessageCaptcha({ phone: form.phone });
    if (res.code == 200) {
      notify.success('已发送验证码，请注意查收！');
    } else throw new Error(res.msg || '获取验证码失败，请稍后重试！');
    // 60秒倒计时逻辑
    let countdown = 60;
    isCaptchaDisabled.value = true;
    captchaButtonText.value = `${countdown}秒后重新获取`;

    const timer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(timer);
        isCaptchaDisabled.value = false;
        captchaButtonText.value = '获取验证码';
      } else {
        captchaButtonText.value = `${countdown}秒后重新获取`;
      }
    }, 1000);
  } catch (error) {
    notify.error({
      title: '获取验证码失败',
      content: (error as string) || '获取验证码失败，请稍后重试',
    });
    console.error(error);
  }
};

// 提交表单
const submit = async () => {
  // 校验表单填写
  const isValidate = await new Promise((resolve) => {
    loginFormRef.value.validate((isValid: boolean) => {
      resolve(isValid);
    });
  });

  if (!isValidate) {
    notify.error('请检查表单输入是否正确');
    return;
  }

  // TODO: 此处需要补充忘记密码的接口
  notify.success('成功提交！');
  console.log(form);
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
    width: 30rem;
    background: rgba(255, 255, 255);
    border-radius: $border-radius-large;
    padding: 1rem 3rem;
    box-shadow: $box-shadow-base;
    backdrop-filter: blur(5px);
    overflow: hidden;

    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .back {
      position: absolute;
      top: 2rem;
      left: 2rem;
    }
  }

  .welcome-text {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 1px;
    color: $primary-color;
    margin-top: 2rem;
  }

  .login-form {
    margin-top: 2rem;
    width: 100%;
  }

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
  }

  .captcha {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;

    .captcha-button {
      margin-left: 0.5rem;
    }
  }

  .submit-btn {
    margin-top: 0.5rem;
    width: 90%;
  }
}
</style>
