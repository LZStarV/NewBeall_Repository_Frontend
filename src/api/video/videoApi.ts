import http from '@/utils/http';
import type { VideoData } from './videoApi.type';

// 视频控制器
export default {
  // 帮助页查询列表
  getVideoHelpList() {
    return http.get<{ data: VideoData[] }>('/operationVideo/helpList');
  },

  // 首页查询列表
  getVideoIndexList() {
    return http.get<VideoData[]>('/operationVideo/indexList');
  },
};

