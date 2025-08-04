import http from '@/utils/http';

// 产品控制器 Product Controller

export default {
  // 上传产品图片
  uploadProductImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return http.post<FormData, { name: string; url: string }>(
      '/product/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },
};
