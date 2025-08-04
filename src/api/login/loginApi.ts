import http from '@/utils/http';

export default {
  // 获取验证码
  async getCaptcha() {
    const res = await http.get<Blob>(
      '/getCode',
      {},
      {
        responseType: 'blob',
      },
    );
    // 检查是否是有效的 blob 类型
    if (!(res instanceof Blob)) {
      throw new Error(`未获取到正确的验证码信息，请稍后重试`);
    }
    return URL.createObjectURL(res);
  },

  // 获取微信登录二维码URL
  async getWechatLoginUrl() {
    const res = await http.post('/getWxTicket');
    const ticket = res.data?.ticket || '';
    if (!ticket) {
      throw new Error('未获取到微信登录二维码的ticket，请稍后再试');
    }
    return `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`;
  },

  // 登录
  async login(data: string): Promise<unknown> {
    return await http.post<string, any>('/loginApi', data);
  },
};
