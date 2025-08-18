import { getMe, getTempWindow } from '@/api/chat/chatApi';
import type { ChatInfo, ChatMessage, UserInfo } from '@/pages/chat/Chat.type';
import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import notify from '@/utils/notify';

/**
 * useChatStore 即时聊天相关数据
 */
export const useChatStore = defineStore('chat', () => {
  // ========== State (存储的数据) ==========
  const userInfoData: Ref<UserInfo | null> = ref(null); // 用户数据

  const activeNavItem = ref<string>('temp'); // 当前激活的导航项，默认激活临时聊天框

  const chatInfo = ref<ChatInfo | null>(null); // 聊天信息

  const isCompanyInfoShow = ref(false); // 是否显示公司信息面板

  const currentTempChatList = ref<ChatInfo[]>(); // 当前临时聊天列表

  const currentToKey = computed(() => {
    return chatInfo.value?.toKey;
  });

  const unreadNumber = computed(() => {
    return currentTempChatList.value?.reduce(
      (acc, item) => acc + item.unreadCount,
      0,
    );
  });
  // ========== Actions (操作方法) ==========
  // 设置侧边导航栏激活项
  const setActiveNavItem = (newActiveNavItem: string) => {
    activeNavItem.value = newActiveNavItem;
  };
  // 设置当前聊天框信息
  const setChatInfo = (newChatInfo: ChatInfo) => {
    chatInfo.value = newChatInfo;
  };
  // 设置当前用户信息
  const setUserInfo = async () => {
    if (userInfoData.value) {
      return;
    }
    const res = await getMe();
    if (res.data) {
      userInfoData.value = res.data;
    } else {
      const router = useRouter();
      notify.error({
        title: '当前登录已失效',
        content: '请重新登录',
      });
      router.push('/login');
    }
  };
  // 设置公司信息面板是否显示
  const setCompanyInfoVisiable = (val: boolean) => {
    isCompanyInfoShow.value = val;
  };
  // 设置消息读取状态
  const setChatUnreadInfo = (unreadUserIds: number[]) => {
    if (chatInfo.value) {
      setChatInfo({
        ...chatInfo.value,
        unreadCount: unreadUserIds.length,
      });
    }
  };
  // 更新消息列表
  const updateTempChatList = async (message: ChatInfo | null = null) => {
    if (currentToKey.value && currentToKey.value == message?.toKey) {
      // 将本条消息的未读数量设置为0
      currentTempChatList.value = currentTempChatList.value?.map((item) => {
        if (item.toKey === message?.toKey) {
          return {
            ...item,
            unreadCount: 0,
          };
        }
        return item;
      });
      return;
    }
    const res = await getTempWindow();
    if (res.data instanceof Array) {
      currentTempChatList.value = res.data;
    }
  };
  // ========== 返回 State + Actions ==========
  return {
    userInfoData,
    activeNavItem,
    chatInfo,
    isCompanyInfoShow,
    currentToKey,
    currentTempChatList,
    unreadNumber,
    setActiveNavItem,
    setChatInfo,
    setCompanyInfoVisiable,
    setUserInfo,
    setChatUnreadInfo,
    updateTempChatList,
  };
});
