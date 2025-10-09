import http from '@/utils/http';

export default {
  // 获取验证码
  async getAllNotices(page: number, limit: number, type?: number) {
    const res = await http.get('/notice/getNotices', {
      page,
      limit,
      type,
    });
    return res;
  },

  async clearNotice(ids: number[]) {
    if (ids.length === 0) return;
    else {
      // 创建 FormData 对象
      const formData = new FormData();

      // 将每个 ID 添加到表单数据中
      ids.forEach((id) => {
        formData.append('ids[]', id.toString());
      });

      return await http.post('/notice/clearNotice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  },
};
