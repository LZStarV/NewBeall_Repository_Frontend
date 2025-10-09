import http from '@/utils/http';

// API返回的通知数据类型
interface ApiNoticeItem {
  content: string;
  contents: string;
  creater: string;
  createrName: string;
  createtime: string; // 时间
  id: number; // 消息ID
  title: string; // 标题
  type: number; // 类型编号
  typeMsg: string; // 类型描述
  unid: string;
}

export default {
  // 获取验证码
  async getAllNotices(page: number, limit: number): Promise<ApiNoticeItem[] | []> {
    const res = await http.get<Blob>(
      '/notice/getNotices',
      {
        page,
        limit
      }
    );
    return res;
  },
};
