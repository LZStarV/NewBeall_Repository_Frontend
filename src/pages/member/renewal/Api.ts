import http from '@/utils/http';
import Notify from '@/utils/notify';
import { useRouter } from 'vue-router';
import { companyInfo } from './type';
const router = useRouter();

//权限接口函数
export const ExpiredAuthApi = async () => {
  try {
    const response = await http.get('auth/expiredAuth');
    return response;
  } catch {
    Notify.error({
      title: 'Session超时',
      content: '页面session超时，请重新登录',
      time: 2000,
    });
    router.push('/login');
    return;
  }
};
export const CompanyInfo = async () => {
  try {
    const response = await http.get('about/getCompany');
    companyInfo.value = response.data;
    return response;
  } catch {
    Notify.error({
      title: '获取公司信息失败',
      content: '获取公司信息失败，请稍后重试',
      time: 2000,
    });
  }
};
