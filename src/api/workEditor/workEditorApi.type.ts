// 纪要
export interface ListItem {
  avatar: string;
  content: string;
  createTime: string;
  createUser: number;
  id: number;
  name: string;
  title: string;
  titleStatus: number;
  updateTime: string;
}

// 获取列表
export type ListRes = ListItem[];

// 删除纪要
export type RemoveRes = ListItem[];

// 保存纪要
export type SaveWorkEditorRes = ListItem[];

// 纪要排序
export type SetTopReq = string[];

// 插入共线记录
export interface ShareEditorReq {
  editorID: number;
  ids: number[] | string[];
}

// 共享列表
export interface ShareTreeItem {
  checked: boolean;
  chkDisabled: string;
  id: string;
  isOpen: boolean;
  isUser: string;
  name: string;
  nocheck: string;
  open: boolean;
  pId: string;
}

export type ShareTreeRes = ShareTreeItem[];
