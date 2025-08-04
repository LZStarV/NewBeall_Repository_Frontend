// 报价单控制器 Orders Controller

import http from '@/utils/http';
import type { Instruction, ExportProductDetailed } from './orderApi.type';
// import { getExpiredAuth } from '@/api/auth/authApi';

export default {
  // 文案获取或搜索
  getInstructionList(insTitle: string, tagId: string) {
    // getExpiredAuth();
    return http.get<Instruction[]>('/orders/instructionList', {
      insTitle,
      tagId,
    });
  },
  // 添加/修改文案
  addInstruction(orderInstruction: Instruction) {
    return http.post('/orders/addInstruction', orderInstruction);
  },
  // 查询文案详细信息
  getInstructionDetail(id: number) {
    return http.get<Instruction>(`/orders/queryInstruction/${id}`);
  },
  // 删除文案
  deleteInstruction(id: number | string) {
    return http.get(`/orders/deleteInstruction/${id}`);
  },
  // 导出文案
  exportInstruction(exportProductDetailedOV: ExportProductDetailed) {
    return http.post('/orders/exportInstruction', exportProductDetailedOV);
  },
};
