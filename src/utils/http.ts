import axios from 'axios';
import type {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import useAuthStore from '@/stores/auth';
import type { ApiResponse } from '@/types/Api/index';

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
        this.instance.interceptors.response.use(
            <T extends object | any[]>(
                response: AxiosResponse<ApiResponse<T>>,
            ): T | Promise<never> => {
                const { code, data, message } = response.data;
                if (code === 200) {
                    return data; // 返回 T
                } else {
                    return Promise.reject(
                        new Error(message || '请求响应失败！'),
                    );
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
}

const http = new HttpClient('');

export default http;
