/**
 * 将对象转换为 FormData
 * @param obj 要转换的对象
 * @returns FormData 对象
 */
export function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== null && value !== undefined) {
      // 处理文件类型
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      }
      // 处理数组
      else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && !(item instanceof File)) {
            formData.append(`${key}[${index}]`, JSON.stringify(item));
          } else {
            formData.append(`${key}[${index}]`, item.toString());
          }
        });
      }
      // 处理对象（排除 File、Blob、Date 等特殊对象）
      else if (typeof value === 'object' && !(value instanceof Date)) {
        formData.append(key, JSON.stringify(value));
      }
      // 处理基本类型
      else {
        formData.append(key, value.toString());
      }
    }
  });

  return formData;
}

/**
 * 直接将任意数量的参数转换为 FormData
 * @param params 参数键值对
 * @returns FormData 对象
 */
export function createFormData(params: Record<string, any>): FormData {
  const formData = new FormData();

  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== null && value !== undefined) {
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  return formData;
}
