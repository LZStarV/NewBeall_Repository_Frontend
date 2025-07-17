import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import { computed } from 'vue';

// Token相关常量
const TOKEN_KEY = 'auth_token';
const USER_INFO_KEY = 'user_info';

// 简单函数
export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function removeToken(): void {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_INFO_KEY);
}

export function hasToken(): boolean {
  const token = getToken();
  return !!token && token.trim() !== '';
}

export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, { expires: 7 });
}

export function getUserInfo(): any {
  const userInfo = Cookies.get(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
}

export function setUserInfo(userInfo: any): void {
  Cookies.set(USER_INFO_KEY, JSON.stringify(userInfo), { expires: 7 });
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
