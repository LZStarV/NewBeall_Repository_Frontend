<template>
  <div class="login-page">
    <section class="login-card">
      <div class="login-left">
        <img :src="loginbjt" alt="企业数字化管理背景" class="loginbjt" />
      </div>

      <div class="login-right">
        <p class="welcome-text">欢迎登录</p>

        <lay-form
          required
          class="login-form"
          :model="form"
          isLabelTooltip
          @submit.prevent="handleLogin"
        >
          <lay-form-item
            label="用户名"
            prop="username"
            :label-width="labelWidth"
            required
            required-error-message="请输入用户名"
            class="form-group"
          >
            <lay-input
              v-model="form.username"
              placeholder="请输入用户名"
              :class="{ 'input-focus': usernameFocus }"
              @focus="usernameFocus = true"
              @blur="usernameFocus = false"
              @keydown.enter="handleLogin"
            />
          </lay-form-item>

          <lay-form-item
            label="密码"
            prop="password"
            :label-width="labelWidth"
            required
            required-error-message="请输入密码"
            class="form-group"
          >
            <lay-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              :class="{ 'input-focus': passwordFocus }"
              @focus="passwordFocus = true"
              @blur="passwordFocus = false"
              @keydown.enter="handleLogin"
            />
          </lay-form-item>

          <lay-form-item
            label="验证码"
            prop="captcha"
            :label-width="labelWidth"
            required
            required-error-message="请输入验证码"
            class="form-group"
          >
            <div class="captcha">
              <lay-input
                v-model="form.captcha"
                placeholder="请输入验证码"
                :class="{ 'input-focus': captchaFocus }"
                @focus="captchaFocus = true"
                @blur="captchaFocus = false"
                @keydown.enter="handleLogin"
              />
              <img
                v-if="captchaUrl"
                :src="captchaUrl"
                alt="验证码图片"
                class="captcha-item"
                @click="refreshCaptcha"
              />
              <span v-else class="captcha-item" @click="refreshCaptcha"
                >点击获取验证码</span
              >
            </div>
          </lay-form-item>

          <!-- 记住密码和协议选项 -->
          <div class="down-check">
            <div class="remember-me">
              <lay-checkbox
                v-model="rememberMe"
                skin="primary"
                name="remember"
                label="7天免登录"
              />
              <lay-checkbox
                v-model="agreement"
                skin="primary"
                name="agreement"
                label="我已阅读并同意"
              />
            </div>

            <div class="link-section">
              <div>
                <router-link to="/service">忘记密码</router-link>
                <lay-line direction="vertical" theme="black" />
                <router-link to="/register">注册账号</router-link>
              </div>
              <div>
                <router-link to="/service">服务协议</router-link>
                <lay-line direction="vertical" theme="black" />
                <router-link to="/privacy">隐私协议</router-link>
              </div>
            </div>
          </div>

          <lay-form-item>
            <lay-ripple class="login-ripple">
              <button
                class="login-btn"
                :class="{ 'opacity-75 cursor-not-allowed': loginLoading }"
                :disabled="loginLoading || !agreement"
                @click="handleLogin"
              >
                {{ loginLoading ? '登录中...' : '登录' }}
              </button>
            </lay-ripple>
          </lay-form-item>
        </lay-form>

        <!-- 其他登录方式 -->
        <div class="other-login-section">
          <lay-line>
            <span class="divider-text">其他登录方式</span>
          </lay-line>

          <div class="login-logo-section">
            <lay-icon class="login-logo-item" type="layui-icon-login-wechat" />
            <lay-icon class="login-logo-item" type="layui-icon-login-qq" />
          </div>
        </div>
      </div>

      <!-- 右下角二维码区域 -->
      <div class="qrcode-container">
        <lay-tooltip trigger="hover">
          <template #content>
            <img
              :src="customer_service_QR"
              alt="扫码登录"
              class="qrcode-icon"
            />
          </template>
          <div class="qrcode-popup">
            <img :src="QRCode" alt="登录二维码" class="full-qrcode" />
            <p class="qrcode-desc">扫码登录更快捷</p>
          </div>
        </lay-tooltip>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { layer } from '@layui/layui-vue';

import loginbjt from '@assets/image/default/loginbjt.png';
import QRCode from '@assets/image/default/QRcode.png';
import customer_service_QR from '@assets/image/default/customer_service_QR.jpg';

import loginApi from '@/api/login/loginApi';
import notify from '@/utils/notify.js';

// 表单数据
const form = reactive({
  username: '',
  password: '',
  captcha: '',
});

// 状态管理
const usernameFocus = ref(false);
const passwordFocus = ref(false);
const captchaFocus = ref(false);
// 输入框标签宽度
const labelWidth = 70;

const loginLoading = ref(false);
const rememberMe = ref(false);
const agreement = ref(false);
// 验证码url
const captchaUrl = ref();
// 旧的验证码url，用于刷新时对比
let oldUrl = '';

// 获取验证码
const getCaptcha = async () => {
  try {
    captchaUrl.value = await loginApi.getCaptcha();
  } catch (err) {
    console.error('获取验证码失败:', err);
    notify.error('获取验证码失败', '获取验证码失败，请稍后重试');
  }
};

// 刷新验证码
const refreshCaptcha = async () => {
  // 释放旧 URL
  if (oldUrl) {
    URL.revokeObjectURL(oldUrl);
  }
  // 获取新 URL
  try {
    const newUrl = await loginApi.getCaptcha();
    captchaUrl.value = newUrl;
    oldUrl = newUrl;
  } catch (err) {
    console.error('刷新验证码失败:', err);
    notify.error('刷新验证码失败', '刷新验证码失败，请稍后重试');
  }
};

// 登录处理函数
const handleLogin = async () => {
  if (!agreement.value) {
    notify.warn('请阅读并同意服务协议和隐私政策');
    return;
  }

  loginLoading.value = true;
  try {
    console.log(form);
    // 实际项目中替换为真实接口调用
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 登录成功处理
    layer.msg('登录成功，正在跳转...');
    console.log('登录参数:', form.value);

    // 存储记住密码状态
    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('username', form.value.username);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('username');
    }

    // 登录成功后跳转到首页或指定页面
    // router.push('/dashboard');
  } catch (error) {
    layer.msg('登录失败，请重试');
    console.error('登录错误:', error);
    // 刷新验证码
    refreshCaptcha();
  } finally {
    loginLoading.value = false;
  }
};

// 页面加载时检查是否记住密码
onMounted(() => {
  getCaptcha();
  if (localStorage.getItem('rememberMe') === 'true') {
    rememberMe.value = true;
    form.value.username = localStorage.getItem('username') || '';
  }
});
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
  position: relative;

  .login-card {
    max-width: 50rem;
    background: rgba(255, 255, 255);
    border-radius: $border-radius-large;
    padding: 1rem 3rem;
    box-shadow: $box-shadow-base;
    backdrop-filter: blur(5px);
    overflow: hidden;

    position: relative;
    overflow: hidden;

    display: flex;
    flex-direction: row;
    align-items: center;

    .loginbjt {
      width: 20rem;
      margin-right: 2rem;
    }

    .login-right {
      .welcome-text {
        text-align: center;
        font-size: 1.5rem;
        font-weight: 600;
        letter-spacing: 1px;
        color: $primary-color;
        margin: 2rem;
      }

      .login-form {
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

          .captcha-item {
            margin-left: 0.5rem;
            height: 2rem;
            object-fit: cover;
            border-radius: $border-radius-base;
            transition: all 0.3s ease;

            &:hover {
              cursor: pointer;
              opacity: 0.9;
              transform: scale(1.02);
            }
          }
        }
        .down-check {
          display: flex;
          align-items: center;
          justify-content: space-around;
          margin-top: 0.5rem;

          .remember-me {
            display: flex;
            flex-direction: column;

            :deep(.layui-checkbox-label) {
              height: auto;
            }
          }

          .link-section {
            display: flex;
            flex-direction: column;
            font-size: 0.8rem;

            a {
              color: $primary-color;
              text-decoration: none;

              &:hover {
                text-decoration: underline;
              }
            }
          }
        }

        .login-ripple {
          margin-top: 1rem;
          width: 100%;
          height: 2.5rem;
        }

        .login-btn {
          width: 100%;
          height: 2.5rem;
          background-color: $primary-color;
          color: #fff;
          border: none;
          border-radius: $border-radius-base;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            background-color: darken($primary-color, 5%);
          }

          &:active {
            background-color: darken($primary-color, 10%);
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }
      }

      .other-login-section {
        display: flex;
        flex-direction: column;
        align-items: center;

        .divider-text {
          color: $text-secondary;
          font-size: 0.8rem;
        }

        .login-logo-section {
          width: 50%;
          display: flex;
          justify-content: space-around;
        }

        .login-logo-item {
          font-size: 2rem;
          color: $primary-color;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            color: darken($primary-color, 10%);
            transform: scale(1.1);
          }
        }
      }
    }
  }
}

.qrcode-container {
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translate(40%, 60%);
  transition: transform 0.3s ease;

  &:hover {
    transform: translate(30%, 50%);
  }
}

.qrcode-icon {
  width: 10rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: #fff;
  padding: 4px;
  cursor: pointer;
}

.qrcode-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;

  .full-qrcode {
    width: 5rem;
    margin-bottom: 8px;
  }

  .qrcode-desc {
    font-size: 0.8rem;
    color: $text-secondary;
  }
}

// 响应式调整
@media (max-width: $pad_layout_breakpoint) {
  .login-left {
    display: none;
  }

  .login-right {
    padding: 20px !important;
  }

  .brand-title {
    font-size: 22px !important;
  }

  .brand-desc {
    font-size: 13px !important;
  }

  .form-group {
    margin-bottom: 15px !important;
  }

  .login-form {
    .form-group {
      .form-label {
        font-size: 13px;
      }
    }
  }

  .wechat-login-section {
    margin-top: 20px;
  }
}
</style>
