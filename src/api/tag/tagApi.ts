import http from '@/utils/http';
import type { TagType } from '@/types/tag';

// 文案标签管理 Tag Controller
export default {
  // 添加标签
  addTag(tagData: TagType) {
    return http.post<TagType>('/tag/add', tagData);
  },
  // 获取全部标签
  getTagList() {
    return http.get<TagType[]>('/tag/list');
  },
  // 删除标签
  deleteTag(tagId: string) {
    return http.get<string>(`/tag/del?id=${tagId}`);
  },
};

