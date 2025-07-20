import axios from 'axios';
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { ApiResponse } from '@/types/Api';
import env from './env';
import { useAuthStore } from '@/stores/auth';

class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      <T extends object | any[]>(
        response: AxiosResponse<ApiResponse<T> | Blob>,
      ): AxiosResponse<T | Blob> => {
        // 如果是 Blob 类型（如图片），直接返回，不解析结构
        if (response.data instanceof Blob) {
          return response as AxiosResponse<Blob>;
        }
        // 处理 JSON 响应
        const { code, data, message } = response.data;
        if (code === 200) {
          return {
            ...response,
            data, // 此时 data 为 T 类型
          } as AxiosResponse<T>;
        } else {
          throw new Error(message || '请求响应失败！');
        }
      },
      (error) => {
        if (error.response?.status === 401) {
          const authStore = useAuthStore();
          authStore.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    );
  }

  // 封装请求方法
  get<T extends object | any[]>(url: string, params?: any): Promise<T> {
    return this.instance.get(url, { params });
  }

  post<T extends object | any[]>(url: string, data?: any): Promise<T> {
    return this.instance.post(url, data);
  }

  delete<T extends object | any[]>(url: string): Promise<T> {
    return this.instance.delete(url);
  }

  put<T extends object | any[]>(url: string, data?: any): Promise<T> {
    return this.instance.put(url, data);
  }

  // 新增：获取二进制数据（如图片）的方法，不解析为 ApiResponse
  getBlob(url: string, params?: any): Promise<Blob> {
    return this.instance
      .get(url, {
        params,
        responseType: 'blob',
      })
      .then((response) => response.data);
  }
}

const http = new HttpClient(env.getApiBaseUrl());

export default http;
