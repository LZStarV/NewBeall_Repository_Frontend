import http from '@/utils/http';

export default {
  // 检查公司简称是否被占用
  existAbbreviation(abbreviation: string, role: string) {
    return http.get('register/existAbbreviation', {
      abbreviation,
      role,
    });
  },
};
