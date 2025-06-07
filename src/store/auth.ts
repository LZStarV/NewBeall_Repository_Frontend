// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // 使用 ref 响应式存储 token
  const token = ref(localStorage.getItem('token'));

  // 设置 token 并同步到 localStorage
  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  // 清除 token
  const clearToken = () => {
    token.value = null;
    localStorage.removeItem('token');
  };

  return { token, setToken, clearToken };
});