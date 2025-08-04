import type { CompanyData, CompanyDetailResponseData } from './companyApi.type';
import http from '@/utils/http';

// 公司控制器
export default {
  // 删除业绩信息：performance01为业绩1，performance02为业绩2，performance03为业绩3，performance04为业绩4
  deletePerformance(companyfield: string) {
    return http.post('/company/deletePerformance', null, {
      params: { companyfield },
    });
  },
  // 删除上传的宣传资料
  deleteUploadData(id: string) {
    return http.get('/company/deleteUploadData', {
      params: { id },
    });
  },
  // 下载上传的宣传资料
  downloadUploadData(id: string) {
    return http.get('/company/downloadUploadData', {
      params: { id },
    });
  },
  // 查询上传的宣传资料
  findUploadData(companyId: string) {
    return http.get('/company/findUploadData', {
      params: { companyId },
    });
  },
  // 获取所有公司
  gatAllCompanyInfo() {
    return http.get('/company/getAllCompany');
  },
  // 获取公司业务
  getCompanyBusiness() {
    return http.get('/company/getCompanyBusiness');
  },
  // 获取我司详情
  getMyCompanyDetailed() {
    return http.get<CompanyDetailResponseData>('/company/getMyCompanyDetailed');
  },
  // 获取喇叭通知内容
  getNotice() {
    return http.get('/company/getNotice');
  },
  // 获取登录用户公司信息接口
  getUserCompanyMsg() {
    return http.get('/company/getUserCompanyMsg');
  },
  // 获取业务覆盖信息
  getWorkarea(cid: string) {
    return http.post('/company/getWorkarea', null, {
      params: {
        cid,
      },
    });
  },
  // 记录浏览公司信息记录 currCompanyId 浏览目标公司id
  sendBrowse(currCompanyId: string) {
    return http.get('/company/sendBrowse', {
      params: {
        currCompanyId,
      },
    });
  },
  // 修改我司信息
  updateMyCompanyInfo(companyData: CompanyData) {
    return http.post('/company/update', null, { params: companyData });
  },
  // 更新公司业务信息
  updateCompanyBusiness(
    list: string,
    moduleName: string,
    paramMap: {
      additionalProp1?: string;
      additionalProp2?: string;
      additionalProp3?: string;
    },
  ) {
    return http.post(`/company/updateBusiness/${moduleName}`, paramMap, {
      params: { list },
    });
  },
  // 扣除积分20(只需要传入id)
  updateIntegration(id: string) {
    return http.post('/company/updateIntegration', null, {
      params: { id },
    });
  },
  // 公司相关图片上传,带水印
  upload(file: string, moduleName: string) {
    return http.post('/company/upload', null, {
      params: {
        file,
        moduleName,
      },
    });
  },
  // 上传宣传资料 id: 宣传质料id
  uploadData(companyId: string, file: string, id: string) {
    return http.post('/company/uploadData', null, {
      params: {
        companyId,
        file,
        id,
      },
    });
  },
  // 上传logo
  uploadLogo(id: string, file: string) {
    return http.post(`/company/uploadLogo/${id}`, null, {
      params: {
        file,
      },
    });
  },
  // 更新未注册平台用户的信息（链接询价处使用）
  wxUpCompanyMsg(companyPhone: string, companyData: CompanyData) {
    return http.post('/company/wxUpCompanyMsg', companyData, {
      params: companyPhone,
    });
  },

  // 获取公司查看记录列表
  getBrowseList() {
    return http.get('/companyBrowse/browseList');
  },
};
