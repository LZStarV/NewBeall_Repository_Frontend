import axios from 'axios';
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

import env from './env';

class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: env.getRequestTimeout(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // GET请求添加时间戳防缓存
        if (config.method?.toUpperCase() === 'GET') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          };
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const responseData: unknown | string =
          error.response?.data || `未知错误，请联系管理员:\n${error}`;
        return Promise.reject(responseData);
      },
    );
  }

  // 封装请求方法

  /**
   * 发送GET请求
   * @template T - 响应数据的类型
   * @param {string} url - 请求地址
   * @param {Record<string, any>} [params] - 查询参数，会合并到config.params中
   * @param {AxiosRequestConfig} [config] - Axios请求配置对象，若提供params参数将与其合并
   * @returns {Promise<AxiosResponse<T>>} - 返回包含响应数据的Promise对象
   * @example
   * // 基础用法
   * http.get<User>('/user').then(response => {
   *   console.log(response.data);
   * });
   * // 带请求配置
   * http.get<Article[]>('/articles', { page: 1, limit: 10 }, {
   *   responseType: 'blob',
   * });
   */
  get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const requestConfig = {
      ...config,
      params: { ...config?.params, ...params },
    };
    return this.instance.get(url, requestConfig);
  }

  /**
   * 发送POST请求
   * @template D - 请求数据的类型
   * @template T - 响应数据的类型
   * @param {string} url - 请求地址
   * @param {D} [data] - 要发送的数据
   * @param {AxiosRequestConfig} [config] - Axios请求配置对象
   * @returns {Promise<AxiosResponse<T>>} - 返回包含响应数据的Promise对象
   * @example
   * // 提交表单数据
   * http.post<User>('/login', {
   *   username: 'admin',
   *   password: 'password'
   * }).then(response => {
   *   console.log('登录成功', response.data);
   * });
   */
  post<D = any, T = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config);
  }

  /**
   * 发送DELETE请求
   * @template T - 响应数据的类型
   * @param {string} url - 请求地址
   * @param {AxiosRequestConfig} [config] - Axios请求配置对象
   * @returns {Promise<AxiosResponse<T>>} - 返回包含响应数据的Promise对象
   * @example
   * // 删除资源
   * http.delete<{ success: boolean }>('/users/1').then(response => {
   *   if (response.data.success) {
   *     console.log('删除成功');
   *   }
   * });
   */
  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }

  /**
   * 发送PUT请求
   * @template D - 请求数据的类型
   * @template T - 响应数据的类型
   * @param {string} url - 请求地址
   * @param {D} [data] - 要发送的数据
   * @param {AxiosRequestConfig} [config] - Axios请求配置对象
   * @returns {Promise<AxiosResponse<T>>} - 返回包含响应数据的Promise对象
   * @example
   * // 更新用户信息
   * http.put<User>('/users/1', {
   *   name: 'New Name',
   *   email: 'new@example.com'
   * }).then(response => {
   *   console.log('更新成功', response.data);
   * });
   */
  put<D = any, T = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config);
  }
}

const http = new HttpClient(env.getApiBaseUrl());

export default http;
