import http from '@/utils/http';

export default {
  // 获取通知
  async getNotices(page: number, limit: number, type?: number) {
    return await http.get('/notice/getNotices', {
      page,
      limit,
      type,
    });
  },

  // 标记通知为已读
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

  // 标记全部通知为已读
  async clearAllNotice() {
    const formData = new FormData();
    formData.append('ids[]', '');

    return await http.post('/notice/clearNotice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 删除通知
  async deleteNotice(ids: number[]) {
    if (ids.length === 0) return;
    else {
      // 创建 FormData 对象
      const formData = new FormData();

      // 将每个 ID 添加到表单数据中
      ids.forEach((id) => {
        formData.append('ids[]', id.toString());
      });

      return await http.post('/notice/deleteNotice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  },

  // 删除全部通知
  async deleteAllNotice() {
    const formData = new FormData();
    formData.append('ids[]', '');

    return await http.post('/notice/deleteNotice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 查询消息详情
  async getNoticeDetail(id: number) {
    return await http.get(`/notice/GetDetail`, { id });
  },
};
