import http from '@/utils/http';
import type { getWechatLoginUrlRes } from './loginApi.type.ts';

export default {
  // 获取验证码
  async getCaptcha() {
    const response = await http.get<Blob>(
      '/getCode',
      {},
      {
        responseType: 'blob',
      },
    );
    const blob = response.data;
    // 检查是否是有效的 blob 类型
    if (!(blob instanceof Blob)) {
      throw new Error(`未获取到正确的验证码信息，请稍后重试`);
    }
    return URL.createObjectURL(blob);
  },

  // 获取微信登录二维码URL
  async getWechatLoginUrl() {
    const res = await http.post<any, getWechatLoginUrlRes>('/getWxTicket');
    const ticket = res.data?.ticket || '';
    if (!ticket) {
      throw new Error('未获取到微信登录二维码的ticket，请稍后再试');
    }
    return `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`;
  },

  // 登录
  async login(data: string): Promise<unknown> {
    const res = await http.post<string, any>('/loginApi', data);
    return res.data;
  },
};
