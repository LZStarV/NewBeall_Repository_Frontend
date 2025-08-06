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
        <button class="tool-btn" title="客服" @click="connectWithAdmin">
          <SvgIcon name="user_management" />
        </button>
        <button
          class="tool-btn"
          title="创建群聊"
          @click="openCreateGroupDialog"
        >
          <SvgIcon name="groups" />
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

    <!-- 创建群聊对话框 -->
    <div v-if="showCreateGroupDialog" class="create-group-dialog">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>创建群聊</h3>
          <button class="close-btn" @click="closeCreateGroupDialog">
            <SvgIcon name="cancel" />
          </button>
        </div>
        <div class="dialog-body">
          <div class="group-name-input">
            <label for="groupName">群聊名称</label>
            <input
              id="groupName"
              v-model="groupChatName"
              type="text"
              placeholder="请输入群聊名称"
            />
          </div>
          <div class="user-selection">
            <h4>选择群聊成员</h4>
            <div class="user-list">
              <div
                v-for="user in userList"
                :key="user.id"
                class="user-item"
                :class="{ selected: selectedUsers.includes(user.id) }"
                @click="toggleUserSelection(user)"
              >
                <div class="user-avatar">
                  <Avatar :url="user.avatar" radius size="2rem" />
                </div>
                <div class="user-name">{{ user.name }}</div>
                <div class="user-checkbox">
                  <input
                    type="checkbox"
                    :checked="selectedUsers.includes(user.id)"
                    @change="toggleUserSelection(user)"
                    @click.stop
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="cancel-btn" @click="closeCreateGroupDialog">
            取消
          </button>
          <button
            class="create-btn"
            :disabled="!groupChatName || selectedUsers.length === 0"
            @click="handleCreateGroup"
          >
            创建群聊
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="showCreateGroupDialog"
      class="dialog-overlay"
      @click="closeCreateGroupDialog"
    ></div>
  </section>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';
import { useFormatDate } from '@/composables/useFormatDate';
import { onMounted, ref, watch, nextTick, computed } from 'vue';
import type { ChatInfo, ContactInfo, UserInfo } from '../Chat.type';
import {
  getAnyMessageList,
  getTempWindow,
  saveTempWindow,
  getCanCreateGroupUserList,
  createGroup,
  getAdminInfo,
} from '@/api/chat/chatApi';
import Avatar from '@/components/Avatar.vue';
import { useChatStore } from '@/stores/chat';

const { formatDateTime, compareDateTime } = useFormatDate();

const contactList = ref<ChatInfo[] | ContactInfo[]>();
const originalContactList = ref<ChatInfo[] | ContactInfo[]>(); // 保存原始列表
const searchKeyword = ref(''); // 搜索关键词

const chatStore = useChatStore();

// Emits
const emit = defineEmits<{
  (e: 'contact-selected'): void;
}>();

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

  // 触发联系人选择事件，用于移动端视图切换
  emit('contact-selected');

  if (contactUrl.value === 'temp') {
    // 传出点击item的chatInfo，供聊天框使用
    if (isChatInfo(chatInfo)) {
      chatStore.setChatInfo(chatInfo);
    }
    return;
  }

  // 如果不是临时聊天
  // 组装params对象
  let prefix = '';
  if (navItemsList && navItemsList.length > 0) {
    // contactUrl就是url字段
    const found = navItemsList.find((item) => item.url === contactUrl.value);
    if (found) prefix = found.prefix;
  }
  const toId = isChatInfo(chatInfo)
    ? chatInfo.toKey
    : String((chatInfo as ContactInfo).id);
  const fromId = userInfo.value?.id ? String(userInfo.value.id) : '';
  const params = {
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
  await saveTempWindow(params);
  // 切换到临时聊天
  if (prefix == 'PY') toKey.value = `${toId}`;
  else
    toKey.value =
      toId.slice(0, prefix.length) == prefix ? toId : `${prefix}-${toId}`;
  chatStore.setActiveNavItem('temp');
};

const contactUrl = computed(() => {
  return chatStore.activeNavItem;
});

const { navItemsList } = defineProps<{
  navItemsList: import('../Chat.type').ContactGroup[];
}>();

const userInfo = ref<UserInfo>();

onMounted(async () => {
  await chatStore.setUserInfo();
  userInfo.value = chatStore.userInfoData!;
});

const getContactList = async () => {
  let res: { data: ChatInfo[] | ContactInfo[] };
  if (contactUrl.value == 'temp') {
    res = await getTempWindow();
  } else if (contactUrl.value.length >= 0) {
    res = await getAnyMessageList(contactUrl.value);
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
watch(contactUrl, () => {
  searchKeyword.value = '';
  getContactList();
});

onMounted(() => getContactList());

// 创建群聊相关
const showCreateGroupDialog = ref(false);
const userList = ref<UserInfo[]>([]);
const selectedUsers = ref<number[]>([]);
const groupChatName = ref('');

// 打开创建群聊对话框
const openCreateGroupDialog = async () => {
  showCreateGroupDialog.value = true;
  // 获取可以创建群聊的用户列表
  try {
    const response = await getCanCreateGroupUserList(true);
    userList.value = response.data;
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
};

// 关闭创建群聊对话框
const closeCreateGroupDialog = () => {
  showCreateGroupDialog.value = false;
  selectedUsers.value = [];
  groupChatName.value = '';
};

// 切换用户选择状态
const toggleUserSelection = (user: UserInfo) => {
  if (!user.id) return;

  const index = selectedUsers.value.indexOf(user.id);
  if (index === -1) {
    selectedUsers.value.push(user.id);
  } else {
    selectedUsers.value.splice(index, 1);
  }
};

// 创建群聊
const handleCreateGroup = async () => {
  if (!groupChatName.value || selectedUsers.value.length === 0) {
    return;
  }

  try {
    await createGroup(groupChatName.value, selectedUsers.value);
    // 创建成功后，重新获取临时聊天列表
    await getContactList();
    closeCreateGroupDialog();
  } catch (error) {
    console.error('创建群聊失败', error);
  }
};

// 连接客服
const connectWithAdmin = async () => {
  try {
    // 获取管理员信息
    const response = await getAdminInfo();
    const admin = response.data;

    if (!admin || !admin.id) {
      console.error('获取管理员信息失败');
      return;
    }

    // 准备参数
    const prefix = 'PY'; // 假设管理员使用个人聊天前缀
    const toId = String(admin.id);
    const fromId = userInfo.value?.id ? String(userInfo.value.id) : '';

    const params = {
      prefix,
      toId,
      fromId,
      chatName: admin.name || '客服',
      described: admin.profession || '客户服务', // 使用profession代替describe
      avatar: admin.avatar || '',
    };

    // 保存临时聊天窗口
    await saveTempWindow(params);

    // 切换到临时聊天
    chatStore.setActiveNavItem('temp');
    toKey.value = 'PY-' + fromId + '-' + toId;

    // 重新获取临时聊天列表
    await getContactList();
  } catch (error) {
    console.error('连接客服失败', error);
  }
};
</script>

<style scoped lang="scss">
@use 'sass:color';

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
        background-color: color.adjust($primary-color, $lightness: 5%);
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

  // 创建群聊对话框样式
  .create-group-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    width: 450px;
    max-width: 90vw;
    z-index: 1001;

    .dialog-content {
      display: flex;
      flex-direction: column;

      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #ededed;

        h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #999;

          &:hover {
            color: #333;
          }
        }
      }

      .dialog-body {
        padding: 1rem;
        max-height: 60vh;
        overflow-y: auto;

        .group-name-input {
          margin-bottom: 1rem;

          label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
          }

          input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;

            &:focus {
              outline: none;
              border-color: $primary-color;
            }
          }
        }

        .user-selection {
          h4 {
            margin-top: 0;
            margin-bottom: 0.5rem;
          }

          .user-list {
            max-height: 300px;
            overflow-y: auto;

            .user-item {
              display: flex;
              align-items: center;
              padding: 0.5rem;
              border-radius: 4px;
              margin-bottom: 0.5rem;
              cursor: pointer;

              &:hover {
                background-color: #f5f5f5;
              }

              &.selected {
                background-color: rgba($primary-color, 0.1);
              }

              .user-avatar {
                margin-right: 0.5rem;
              }

              .user-name {
                flex: 1;
              }

              .user-checkbox {
                input {
                  cursor: pointer;
                }
              }
            }
          }
        }
      }

      .dialog-footer {
        display: flex;
        justify-content: flex-end;
        padding: 1rem;
        border-top: 1px solid #ededed;
        gap: 0.5rem;

        button {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;

          &.cancel-btn {
            background-color: #f5f5f5;
            border: 1px solid #ddd;

            &:hover {
              background-color: #e5e5e5;
            }
          }

          &.create-btn {
            background-color: $primary-color;
            color: white;
            border: none;

            &:hover {
              background-color: color.adjust($primary-color, $lightness: -5%);
            }

            &:disabled {
              background-color: #cccccc;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
}
</style>
