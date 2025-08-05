import http from '@/utils/http';

export default {
  // 单条记录标记已读
  msgRead(id: number | string) {
    return http.get('/message/msgRead', { id });
  },

  // 批量标注已读
  msgReadAll(ids: number[] | string[]) {
    // 创建 FormData 对象
    const formData = new FormData();

    // 将每个 ID 添加到表单数据中
    ids.forEach((id) => {
      formData.append('ids[]', id.toString());
    });

    return http.post('/message/msgReadAll', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
