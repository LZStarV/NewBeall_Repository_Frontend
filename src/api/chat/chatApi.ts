import http from '@/utils/http';
import type {
  ChatInfo,
  ChatMessage,
  CompanyInfo,
  ContactGroup,
  ContactInfo,
  UserInfo,
} from '@/pages/chat/Chat.type';

// 获取当前用户
export const getMe = () => {
  return http.post<{ data: UserInfo }>('/mgr/me');
};

// 获取消息列表通用接口
export const getAnyMessageList = (url: string) => {
  return http.post<{ data: ChatInfo[] | ContactInfo[] }>(url);
};

// 获取未读用户列表
export const getUnreadUserList = (read: number[], unread: number[]) => {
  return http.post<{ data: { read: UserInfo[]; unRead: UserInfo[] } }>(
    '/mgr/msgReadPersons',
    { read, unread },
  );
};

// 消息发送控制器
// 发送消息
export const sendMessage = (chatMsg: ChatMessage) => {
  return http.post<ChatMessage>('/chatMessage', null, chatMsg);
};

// 获取临时聊天框;
export const getTempWindow = () => {
  return http.get<{ data: ChatInfo[] }>('/chatMessage/getTempWindow');
};

// 获取用户未读消息数量
export const getUnreadMsgCount = (count: number) => {
  return http.get(`/chatMessage/getUnreadCount/${count}`);
};

// 标注消息已读
export const setMessageRead = (toKey: string, id: string) => {
  return http.get(`/chatMessage/read/${toKey}/${id}`);
};

// 存储临时聊天框
export const saveTempWindow = (formData: {
  prefix: string;
  toId: string;
  fromId: string;
  chatName: string;
  described: string;
  avatar: string;
}) => {
  return http.post('/chatMessage/saveTempWindow', null, formData);
};

// 获取消息
export const getMessages = (toKey: string) => {
  return http.get<{ data: ChatMessage[] }>(`/chatMessage/${toKey}`);
};

// 消息管理
// 单条记录标记为已读
export const setSingleMessageRead = (id: string) => {
  return http.get(`/message/msgRead?id=${id}`);
};

// 批量标注已读
export const setAllMessagesRead = (ids: string[]) => {
  return http.post(`/message/msgReadAll?ids[]=${ids}`);
};

// 删除消息记录
export const deleteMessage = (orderId: string) => {
  return http.get(`/message/msgReadByOrder?orderId=${orderId}`);
};

// 群聊人员控制器
// 加入群聊
export const joinGroup = (toKey: string, userIds: string[]) => {
  return http.post(`/chatGroupUser/joinGroup/${toKey}`, userIds);
};

// 根据聊天id获取群成员
export const getGroupMembers = (toKey: string) => {
  return http.get<{ data: UserInfo[] }>(`/chatGroupUser/list/${toKey}`);
};

// 获取某个公司未加入指定群聊的人员
export const getNotJoinMember = (groupId: string) => {
  return http.get<{ data: UserInfo[] }>(
    `/chatGroupUser/listNotJoinGroup/${groupId}`,
  );
};

// 群聊控制器
// 创建群组
export const createGroup = (chatName: string, userIds: number[]) => {
  return http.post('/chatGroup', { chatName, userIds });
};

// 获取当前登录用户加入的群组
export const getJoinGroupList = () => {
  return http.get('/chatGroup/joinGroupList');
};

// 聊天控制器
// 获取公司信息
export const getCompanyInfo = (ToKey: string) => {
  return http.get<{ data: CompanyInfo }>(`/chat/companyGroup/${ToKey}`);
};

//  删除聊天
export const deleteChat = (toKey: string) => {
  return http.delete(`/chat/tempChat/${toKey}`);
};

// 聊天联系人分组控制器
// 获取聊天联系分组
export const getContactGroup = () => {
  return http.get<{ data: ContactGroup[] }>('/chatContactModel');
};
