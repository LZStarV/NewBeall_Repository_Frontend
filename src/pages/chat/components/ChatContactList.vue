<template>
  <section class="chat-contact-list">
    <header class="header">
      <div class="search">
        <SvgIcon name="search" />
        <input
          v-model="searchKeyword"
          type="text"
          class="search-bar"
          placeholder="搜索"
          @input="handleSearch"
        />
      </div>
      <div class="tool">
        <button class="tool-btn">
          <SvgIcon name="groups" />
        </button>
        <button class="tool-btn">
          <SvgIcon name="user_management" />
        </button>
      </div>
    </header>
    <div class="list">
      <div
        v-for="item of contactList"
        :key="
          isChatInfo(item)
            ? item.toKey
            : 'id' in item && item.id !== undefined
              ? String(item.id)
              : ''
        "
        class="item"
        :class="{
          active:
            activeItemId ===
            (isChatInfo(item)
              ? item.toKey
              : 'id' in item && item.id !== undefined
                ? String(item.id)
                : ''),
        }"
        @click="handleClickItem(item)"
      >
        <div class="avatar">
          <Avatar :url="item.avatar" radius size="3rem" />
        </div>
        <div class="meta-left">
          <strong>{{ isChatInfo(item) ? item.chatName : item.name }}</strong>
          <span>{{ isChatInfo(item) ? item.lastMessage : item.describe }}</span>
        </div>
        <div class="meta-right">
          <span>{{
            formatDateTime(isChatInfo(item) ? item.lastTime : item.times || '')
          }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';
import { useFormatDate } from '@/composables/useFormatDate';
import { onMounted, ref, watch, nextTick } from 'vue';
import type { ChatInfo, ContactInfo } from '../Chat.type';
import {
  getAnyMessageList,
  getTempWindow,
  saveTempWindow,
} from '@/api/chat/chatApi';
import Avatar from '@/components/Avatar.vue';

const { formatDateTime, compareDateTime } = useFormatDate();

const contactList = ref<ChatInfo[] | ContactInfo[]>();
const originalContactList = ref<ChatInfo[] | ContactInfo[]>(); // 保存原始列表
const searchKeyword = ref(''); // 搜索关键词

const handleSearch = () => {
  if (!searchKeyword.value) {
    // 搜索框为空，恢复原始列表
    contactList.value = originalContactList.value;
    return;
  }

  if (!originalContactList.value) return;

  // 在原始列表中搜索
  const filtered = originalContactList.value.filter((item) => {
    const searchText = searchKeyword.value.toLowerCase();
    if (isChatInfo(item)) {
      return item.chatName.toLowerCase().includes(searchText);
    } else {
      return item.name.toLowerCase().includes(searchText);
    }
  });

  // 根据原始列表的类型来设置过滤后的列表类型
  if (originalContactList.value.length > 0) {
    const first = originalContactList.value[0];
    if (isChatInfo(first)) {
      contactList.value = filtered as ChatInfo[];
    } else {
      contactList.value = filtered as ContactInfo[];
    }
  } else {
    contactList.value = [];
  }
};

const activeItemId = ref('');

const toKey = ref(''); // 用来自动选中

const emit = defineEmits<{
  (event: 'click-item', chatInfo: ChatInfo): void;
  (event: 'update-contact-list', contactUrl: string): void;
}>();

function isChatInfo(item: unknown): item is ChatInfo {
  return (
    !!item && typeof item === 'object' && 'toKey' in item && 'chatName' in item
  );
}

const handleClickItem = async (chatInfo: ChatInfo | ContactInfo) => {
  let id = '';
  if (isChatInfo(chatInfo)) {
    id = chatInfo.toKey || '';
  } else if ('id' in chatInfo && chatInfo.id !== undefined) {
    id = String(chatInfo.id);
  }
  activeItemId.value = id;

  if (contactUrl === 'temp') {
    // 传出点击item的chatInfo，供聊天框使用
    if (isChatInfo(chatInfo)) {
      emit('click-item', chatInfo);
    }
    return;
  }

  // 组装formData对象
  let prefix = '';
  if (navItemsList && navItemsList.length > 0) {
    // contactUrl就是url字段
    const found = navItemsList.find((item) => item.url === contactUrl);
    if (found) prefix = found.prefix;
  }
  const toId = isChatInfo(chatInfo)
    ? chatInfo.toKey
    : String((chatInfo as ContactInfo).id);
  const fromId = userInfo.id ? String(userInfo.id) : '';
  const formData = {
    prefix,
    toId,
    fromId,
    chatName: isChatInfo(chatInfo)
      ? chatInfo.chatName
      : (chatInfo as ContactInfo).name,
    described: isChatInfo(chatInfo)
      ? chatInfo.described
      : (chatInfo as ContactInfo).describe,
    avatar: isChatInfo(chatInfo)
      ? chatInfo.avatar
      : (chatInfo as ContactInfo).avatar,
  };
  await saveTempWindow(formData);
  // 通知父组件/ChatNavbar切换到临时聊天
  if (prefix == 'PY') toKey.value = `${toId}`;
  else
    toKey.value =
      toId.slice(0, prefix.length) == prefix ? toId : `${prefix}-${toId}`;
  emit('update-contact-list', 'temp');
};

const { contactUrl, userInfo, navItemsList } = defineProps<{
  contactUrl: string;
  userInfo: import('../Chat.type').UserInfo;
  navItemsList: import('../Chat.type').ContactGroup[];
}>();

const getContactList = async () => {
  let res: { data: ChatInfo[] | ContactInfo[] };
  if (contactUrl == 'temp') {
    res = await getTempWindow();
  } else if (contactUrl.length >= 0) {
    res = await getAnyMessageList(contactUrl);
  } else {
    return;
  }
  if (res.data instanceof Array) {
    const first = res.data[0];
    if ('lastTime' in first) {
      // 是 ChatInfo[]
      (res.data as ChatInfo[]).sort((a, b) =>
        compareDateTime(b.lastTime, a.lastTime),
      );
    } else if ('times' in first) {
      // 是 ContactInfo[]
      (res.data as ContactInfo[]).sort((a, b) =>
        compareDateTime(b.times!, a.times!),
      );
    }
    originalContactList.value = res.data; // 保存原始列表
    contactList.value = res.data;

    // 如果当前有搜索关键词，立即执行搜索
    if (searchKeyword.value) {
      handleSearch();
    }

    // 如果有 toKey，就选中
    if (toKey.value.length > 0) {
      const itemIndex = contactList.value.findIndex((item) => {
        if ('lastTime' in item) {
          // 是 ChatInfo
          return item.toKey.includes(toKey.value);
        }
        return false;
      });
      if (itemIndex != -1) {
        const item = contactList.value[itemIndex];
        activeItemId.value = (item as ChatInfo).toKey;
        await handleClickItem(item);
        // 跳至activeItemId处
        nextTick(() => {
          const activeElement = document.querySelector('.item.active');
          if (activeElement) {
            activeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        });
      }
    }
  }
};

// 当切换contactUrl时，清空搜索框
watch(
  () => contactUrl,
  () => {
    searchKeyword.value = '';
    getContactList();
  },
);

onMounted(() => getContactList());
</script>

<style scoped lang="scss">
.chat-contact-list {
  border-right: 1px solid #ededed;
  display: flex;
  flex-direction: column;

  .header {
    background-color: #f5f9ff;
    padding: 1.25rem 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    max-height: 75px;
    width: 100%;

    .search {
      background-color: white;
      border-radius: 1.2rem;
      padding: 0.4rem 1rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      width: 20px;
      flex: 1;

      .search-bar {
        outline: none;
        border: none;
        background: transparent;
        flex: 1;
        width: 10px;
      }
    }

    .tool {
      display: flex;
      align-items: center;

      gap: 0.75rem;

      .tool-btn {
        cursor: pointer;
        border: none;
        border-radius: $border-radius-middle;
        background-color: #deedff;
        color: #2b5bb2;
        padding: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
        }
      }
    }
  }

  .list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    .item {
      margin: 0.5rem 0.5rem 0 0.5rem;
      border-radius: 8px;
      display: flex;
      height: 65px;
      padding: 8px;

      &:last-child {
        margin-bottom: 0.5rem;
      }

      &.active {
        background-color: $primary-color;
        strong,
        span {
          color: white !important; // 强制覆盖原来的深色
        }
      }

      &:hover {
        background-color: lighten($primary-color, 5%);
        strong,
        span {
          color: white !important; // 强制覆盖原来的深色
        }
      }

      .avatar {
        .layui-avatar {
          width: 3rem;
          height: 3rem;
          margin-right: 0.5rem;
        }
      }

      .meta-left {
        width: calc(100% - 8rem);

        strong,
        span {
          display: block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        strong {
          margin-bottom: 0.25rem;
        }

        span {
          font-size: 13px;
          color: #616161;
        }
      }

      .meta-right {
        width: 5rem;

        span {
          display: block;
          float: right;
          font-size: 11px;
          color: #a1a1a1;
        }
      }
    }
  }
}
</style>
