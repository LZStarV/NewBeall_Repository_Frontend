import http from '@/utils/http';

export interface AddTopicReq {
  content: string;
  oid: number | string; // 接收者id
  type: number;
  userids: number[] | string[];
}
export default {
  addTopic(topic: AddTopicReq) {
    // 转换为表单数据
    const formData = new FormData();
    formData.append('type', topic.type.toString());
    formData.append('content', topic.content);
    formData.append('oid', topic.oid.toString());
    formData.append('userids', topic.userids.toString());

    return http.post('/topic/addTopic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
