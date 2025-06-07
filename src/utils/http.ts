import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/stores/auth';

//any->指定调用时具体的数据类型
interface ApiResponse<T = any> {
    code: number;
    data: T;
    message: string;
}

class HttpClient {
    private instance: AxiosInstance;

    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
            timeout: 10000, // 请求超时时间
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
            }
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            (response: AxiosResponse<ApiResponse>) => {
                const { code, data, message } = response.data;
                if (code === 200) {
                    return data;
                } else {
                    return Promise.reject(new Error(message || '请求响应失败！'));
                }
            },
            (error) => {
                if (error.response) {
                    const { status } = error.response;
                    if (status === 401) {
                        // token 失效，清除 token 并跳转登录
                        const authStore = useAuthStore();
                        authStore.clearToken();
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }
    // 封装请求
    get<T = any>(url: string, params?: any): Promise<T> { return this.instance.get(url, { params }); }
    post<T = any>(url: string, data?: any): Promise<T> { return this.instance.post(url, data); }
    delete<T = any>(url: string): Promise<T> { return this.instance.delete(url); }
    put<T = any>(url: string, data?: any): Promise<T> { return this.instance.put(url, data); }
}

// 建立API 基础URL
const http = new HttpClient('');

export default http;