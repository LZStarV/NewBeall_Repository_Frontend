import http from '@/utils/http';

export default {
  // 获取验证码
  async getCaptcha() {
    const blob = await http.getBlob('/api/getCode', {
      random: Math.random(), // 加随机参数防缓存
    });
    const url: string = URL.createObjectURL(blob);
    return url;
  },
};
