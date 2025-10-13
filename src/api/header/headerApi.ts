import http from '@/utils/http';

export default {
  // 获取通知栏内容
  async getNoticeList() {
    return await http.get('/company/getNotice');
  },
  // 获取微信公众号链接
  async getWechatAccount() {
    const res = await http.get<Blob>(
      '/static/img/user/wxcommon.jpg',
      {},
      {
        responseType: 'blob',
      },
    );
    // 检查是否是有效的 blob 类型
    if (!(res instanceof Blob)) {
      throw new Error(`未获取到正确的微信公众号信息，请稍后重试`);
    }
    return URL.createObjectURL(res);
  },

  // 每日打卡
  async checkout() {
    return await http.get('/mgr/everyDaySignIn');
  },

  // 用户建议
  async userSuggest(sugtext: string, phone: string) {
    return await http.get('/suggest/add', {
      sugtext,
      phone,
    });
  },
};
