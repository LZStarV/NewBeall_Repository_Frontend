import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import { computed } from 'vue';

// Token相关常量
const SHIRO_COOKIE = 'shiroCookie';

// 获取Token
export function getToken(): string | undefined {
  return Cookies.get(SHIRO_COOKIE);
}

// 移除Token
export function removeToken(): void {
  Cookies.remove(SHIRO_COOKIE);
}

// 验证是否存在Token
export function hasToken(): boolean {
  const token = getToken();
  return !!token && token.trim() !== '';
}

// 设置Token
export function setToken(token: string): void {
  Cookies.set(SHIRO_COOKIE, token, { expires: 7 });
}

// Pinia Store
export const useAuthStore = defineStore('auth', () => {
  const token = computed(() => getToken());

  const clearToken = () => {
    removeToken();
  };

  return {
    token,
    clearToken,
  };
});
