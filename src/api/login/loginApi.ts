import http from '@/utils/http';
import type { getWechatLoginUrlRes } from './loginApi.type.ts';
import type { ApiResponse } from '@/types/Api';
import type { loginData } from '@/types/Login';

export default {
  // 获取验证码
  async getCaptcha() {
    const blob = await http.getBlob('/getCode', {
      random: Math.random(), // 加随机参数防缓存
    });
    const url: string = URL.createObjectURL(blob);
    return url;
  },

  // 获取微信登录二维码URL
  async getWechatLoginUrl() {
    const res =
      await http.post<ApiResponse<getWechatLoginUrlRes>>('/getWxTicket');
    const ticket: string = res.data?.ticket || '';
    if (!ticket) {
      throw new Error('未获取到微信登录二维码的ticket，请稍后再试');
    }
    return `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`;
  },

  // 登录
  async login(data: loginData) {
    return await http.post('/loginApi', data);
  },
};
