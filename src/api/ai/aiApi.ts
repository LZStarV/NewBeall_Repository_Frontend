import http from '@/utils/http';

// AI聊天请求接口
export default {
  // 根据标题和提示词生成文案内容
  getAiChat(aiInstructionContextDTO: { context: string; title: string }) {
    return http.post('/AI/AiInstructionContext', aiInstructionContextDTO);
  },
};
