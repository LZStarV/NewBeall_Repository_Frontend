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
  const res = await http.post<{ data: UserInfo }>('/mgr/me');
  return res.data;
};

// 获取管理员信息
export const getAdminInfo = async () => {
  const res = await http.get<{ data: UserInfo }>('/mgr/getAdmin');
  return res.data;
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
  return res.data;
};

// 获取消息列表通用接口
export const getAnyMessageList = async (url: string) => {
  const res = await http.post<{ data: ChatInfo[] | ContactInfo[] }>(url);
  return res.data;
};

// 获取未读用户列表
export const getUnreadUserList = async (read: number[], unread: number[]) => {
  const res = await http.post<{read: number[], unread: number[]} ,{ data: { read: UserInfo[]; unRead: UserInfo[] } }>(
    '/mgr/msgReadPersons',
    { read, unread },
  );
  return res.data;
};

// 消息发送控制器
// 发送消息
export const sendMessage = async (chatMsg: ChatMessage) => {
  const res = await http.post<null, ChatMessage>('/chatMessage', null, { params: chatMsg});
  return res.data;
};

// 获取临时聊天框;
export const getTempWindow = async () => {
  const res = await http.get<{ data: ChatInfo[] }>('/chatMessage/getTempWindow');
  return res.data;
};

// 获取用户未读消息数量
export const getUnreadMsgCount = async (count: number) => {
  const res = await http.get(`/chatMessage/getUnreadCount/${count}`);
  return res.data;
};

// 标注消息已读
export const setMessageRead = async (toKey: string, id: string) => {
  const res = await http.get(`/chatMessage/read/${toKey}/${id}`);
  return res.data;
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
  return res.data;
};

// 获取消息
export const getMessages = async (toKey: string) => {
  const res = await http.get<{ data: ChatMessage[] }>(`/chatMessage/${toKey}`);
  return res.data;
};

// 消息管理
// 单条记录标记为已读
export const setSingleMessageRead = async (id: string) => {
  const res = await http.get(`/message/msgRead?id=${id}`);
  return res.data;
};

// 批量标注已读
export const setAllMessagesRead = async (ids: string[]) => {
  const res = await http.post(`/message/msgReadAll?ids[]=${ids}`);
  return res.data;
};

// 删除消息记录
export const deleteMessage = async (orderId: string) => {
  const res = await http.get(`/message/msgReadByOrder?orderId=${orderId}`);
  return res.data;
};

// 群聊人员控制器
// 加入群聊
export const joinGroup = async (toKey: string, userIds: string[]) => {
  const res = await http.post(`/chatGroupUser/joinGroup/${toKey}`, userIds);
  return res.data;
};

// 根据聊天id获取群成员
export const getGroupMembers = async (toKey: string) => {
  const res = await http.get<{ data: UserInfo[] }>(`/chatGroupUser/list/${toKey}`);
  return res.data;
};

// 获取某个公司未加入指定群聊的人员
export const getNotJoinMember = async (groupId: string) => {
  const res = await http.get<{ data: UserInfo[] }>(
    `/chatGroupUser/listNotJoinGroup/${groupId}`,
  );
  return res.data;
};

// 群聊控制器
// 创建群组
export const createGroup = async (chatName: string, userIds: number[]) => {
  const res = await http.post('/chatGroup', { chatName, userIds });
  return res.data;
};

// 获取当前登录用户加入的群组
export const getJoinGroupList = async () => {
  const res = await http.get('/chatGroup/joinGroupList');
  return res.data;
};

// 聊天控制器
// 获取公司信息
export const getCompanyInfo = async (ToKey: string) => {
  const res = await http.get<{ data: CompanyInfo }>(`/chat/companyGroup/${ToKey}`);
  return res.data;
};

//  删除聊天
export const deleteChat = async (toKey: string) => {
  const res = await http.delete(`/chat/tempChat/${toKey}`);
  return res.data;
};

// 聊天联系人分组控制器
// 获取聊天联系分组
export const getContactGroup = async () => {
  const res = await http.get<{ data: ContactGroup[] }>('/chatContactModel');
  return res.data;
};


// 提交意见
export const submitFeedback = async (feedback: string, phone: string) => {
  const res = await http.get('/suggest/add', { sugtext: feedback, phone });
  return res.data;
};
