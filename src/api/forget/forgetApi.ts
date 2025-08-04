import http from '@/utils/http';

export default {
  // 获取短信验证码
  async getMessageCaptcha(phone: object) {
    return await http.post('/sendMsg/forgetPassword', null, {
      params: phone,
    });
  },
};
