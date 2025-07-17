import axios from 'axios';
import env from '@/utils/env';
import { getToken, removeToken } from '@/stores/auth';

// 创建一个专门用于验证token的axios实例，避免循环引用
const authApi = axios.create({
  baseURL: env.getApiBaseUrl(),
  timeout: 10000,
});

// 验证token有效性
export async function validateToken(): Promise<boolean> {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    await authApi.get('/auth/validate-token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error) {
    removeToken();
    return false;
  }
}
