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
export const getMe = async () => {
  return await http.post<UserInfo>('/mgr/me');
};

// 获取管理员信息
export const getAdminInfo = async () => {
  return await http.get<UserInfo>('/mgr/getAdmin');
};

// 获取可以新建群聊的用户列表
export const getCanCreateGroupUserList = async (roleOutMe: boolean) => {
  const formData = new FormData();
  formData.append('roleOutMe', roleOutMe ? 'true' : 'false');
  const res = await http.post<FormData>('/mgr/users', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

// 获取消息列表通用接口
export const getAnyMessageList = async (url: string) => {
  return await http.post<ChatInfo[] | ContactInfo[]>(url);
};

// 获取未读用户列表
export const getUnreadUserList = async (read: number[], unread: number[]) => {
  return await http.post<{read: number[], unread: number[]} ,{ read: UserInfo[]; unRead: UserInfo[] }>(
    '/mgr/msgReadPersons',
    { read, unread },
  );
};

// 消息发送控制器
// 发送消息
export const sendMessage = async (chatMsg: ChatMessage) => {
  return await http.post<null, ChatMessage>('/chatMessage', null, { params: chatMsg});
};

// 获取临时聊天框;
export const getTempWindow = async () => {
  return await http.get<ChatInfo[]>('/chatMessage/getTempWindow');
};

// 获取用户未读消息数量
export const getUnreadMsgCount = async (count: number) => {
  return await http.get(`/chatMessage/getUnreadCount/${count}`);
};

// 标注消息已读
export const setMessageRead = async (toKey: string, id: string) => {
  return await http.get(`/chatMessage/read/${toKey}/${id}`);
};

// 存储临时聊天框
export const saveTempWindow = async (params: {
  prefix: string;
  toId: string;
  fromId: string;
  chatName: string;
  described: string;
  avatar: string;
}) => {
  const formData = new FormData();
  Object.keys(params).forEach(key => {
    formData.append(key, params[key as keyof typeof params]);
  });
  const res = await http.post<FormData>('/chatMessage/saveTempWindow', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

// 获取消息
export const getMessages = async (toKey: string) => {
  return await http.get<ChatMessage[]>(`/chatMessage/${toKey}`);
};

// 消息管理
// 单条记录标记为已读
export const setSingleMessageRead = async (id: string) => {
  return await http.get(`/message/msgRead?id=${id}`);
};

// 批量标注已读
export const setAllMessagesRead = async (ids: string[]) => {
  return await http.post(`/message/msgReadAll?ids[]=${ids}`);
};

// 删除消息记录
export const deleteMessage = async (orderId: string) => {
  return await http.get(`/message/msgReadByOrder?orderId=${orderId}`);
};

// 群聊人员控制器
// 加入群聊
export const joinGroup = async (toKey: string, userIds: string[]) => {
  return await http.post(`/chatGroupUser/joinGroup/${toKey}`, userIds);
};

// 根据聊天id获取群成员
export const getGroupMembers = async (toKey: string) => {
  return await http.get<UserInfo[]>(`/chatGroupUser/list/${toKey}`);
};

// 获取某个公司未加入指定群聊的人员
export const getNotJoinMember = async (groupId: string) => {
  return await http.get<UserInfo[]>(
    `/chatGroupUser/listNotJoinGroup/${groupId}`,
  );
};

// 群聊控制器
// 创建群组
export const createGroup = async (chatName: string, userIds: number[]) => {
  return await http.post('/chatGroup', { chatName, userIds });
};

// 获取当前登录用户加入的群组
export const getJoinGroupList = async () => {
  return await http.get('/chatGroup/joinGroupList');
};

// 聊天控制器
// 获取公司信息
export const getCompanyInfo = async (ToKey: string) => {
  return await http.get<CompanyInfo>(`/chat/companyGroup/${ToKey}`);
};

//  删除聊天
export const deleteChat = async (toKey: string) => {
  return await http.delete(`/chat/tempChat/${toKey}`);
};

// 聊天联系人分组控制器
// 获取聊天联系分组
export const getContactGroup = async () => {
  return await http.get<ContactGroup[]>('/chatContactModel');
};


// 提交意见
export const submitFeedback = async (feedback: string, phone: string) => {
  return await http.get('/suggest/add', { sugtext: feedback, phone });
};
