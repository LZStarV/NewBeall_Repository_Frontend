import http from '@/utils/http';
import type {
  ListItem,
  ListRes,
  RemoveRes,
  SaveWorkEditorRes,
  SetTopReq,
  ShareTreeRes,
} from './workEditorApi.type';

export default {
  /**
   *根据id查询纪要
   * @param id
   * @returns 返回纪要详细信息
   */
  findById(id: number | string) {
    return http.get<ListItem>('/workEditor/findById', { id });
  },

  /**
   *获取工作纪要内容
   * @param id
   * @returns 返回纪要详细信息
   */
  getWorkMinutes(id: number | string) {
    return http.get<ListItem>('/workEditor/getWorkMinutes', { id });
  },

  /**
   *获取纪要列表
   * @returns 返回纪要列表数组
   */
  list() {
    return http.post<ListRes>('/workEditor/list');
  },

  /**
   *删除纪要
   * @param id
   * @returns 返回删除纪要后的新列表
   */
  remove(id: number | string) {
    return http.get<RemoveRes>('/workEditor/remove', { id });
  },

  /**
   * 保存工作纪要
   * @param {ListItem} workEditor - 要保存的工作纪要数据(title, content)
   * @returns 返回纪要列表
   */
  saveWorkEditor(workEditor: ListItem) {
    return http.post<ListItem, SaveWorkEditorRes>(
      '/workEditor/saveWorkEditor',
      workEditor,
    );
  },

  /**
   *纪要排序
   * @param idsArr -纪要排序顺序，id列表转字符串格式传入
   * @returns code:0
   */
  setTop(idsArr: SetTopReq) {
    return http.get('/workEditor/setTop', { idsArr: JSON.stringify(idsArr) });
  },

  /**
   * 插入共享纪要
   * @param {number | string} editorID - 纪要ID
   * @param {string[] | number[]} ids - 用户id列表
   * @returns {Promise<any>} code:0成功, 1失败 (错误提示msg)
   */
  shareEditor(editorID: number, ids: number[] | string[]) {
    // 构造表单数据格式
    const formData = new URLSearchParams();
    formData.append('editorID', String(editorID));

    // 为每个id添加 ids[] 参数
    ids.forEach((id) => {
      formData.append('ids[]', String(id));
    });

    return http.post<URLSearchParams, unknown>(
      '/workEditor/shareEditor',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  },

  /**
   * 共享列表
   * @param {number} editorID -  用户id 可选(query参数)
   * @param {number | string} id - 纪要id (path参数)
   * @returns {Promise<ShareTreeRes>} 返回共享列表
   */
  shareTree(id: number | string, editorID?: number) {
    return http.post<undefined, ShareTreeRes>(
      `/workEditor/shareTree/${id}`,
      undefined,
      {
        params: { editorID },
      },
    );
  },
};
