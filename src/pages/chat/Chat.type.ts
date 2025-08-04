// 聊天室概要信息
export interface ChatInfo {
  avatar: string;
  chatName: string; // 聊天室名称
  described: string;
  lastMessage: string; // 最近消息概览
  lastTime: string; // YYYY-MM-DD HH:mm:ss
  prefix: string;
  toKey: string; // 聊天室id
  type: boolean;
  unreadCount: number;
}

// 聊天列表中基础联系人信息
interface BaseContactInfo {
  avatar: string;
  describe: string;
  id: number;
  name: string;
}

// 聊天列表中联系人信息
export interface ContactInfo extends BaseContactInfo {
  profession?: string;
  createtime?: string;
  roleid?: string;
  sex?: number;
  deptid?: number;
  companyId?: number;
  times?: number;
  phone?: string;
  userRole?: number;
  account?: string;
  email?: string;
  status?: number;
}

// 聊天框数据
export interface ChatWindow extends ChatInfo {
  fromId: string;
  toId: string; // 聊天id
}

// 聊天消息
export interface ChatMessage {
  avatar?: string; // 头像
  chatName: string;
  content: string; // 消息内容
  fromId: number; // 消息发送者id
  id?: number; // 消息id
  read?: string; // 已读取本条消息的用户id数组字符串
  readStatus?: string;
  sendName?: string; // 本条消息者名字
  sendTime: string; // 本条消息发送时间戳
  toId: string; // 聊天室id，由toKey传入
  type: boolean; // 类型（是否群聊， number 否 number 是）
  unread?: string; // 未读取本条消息的用户id数组字符串
}

// 用户信息
export interface UserInfo {
  account: string;
  avatar: string;
  companyId: number;
  companyName: string;
  companyRole: string;
  companyRoleName: string;
  deptId: number;
  deptName: string;
  id: number;
  name: string;
  percent: string;
  profession: string;
  pushMessage: number;
  roleId: string;
  roleList: number[];
  roleNames: string[];
  times: string;
  vipIndate: string;
  wxOpenid: string;
}

// 聊天联系分组
export interface ContactGroup {
  groupName: string;
  icon: string;
  id: number;
  prefix: string;
  url: string;
}
