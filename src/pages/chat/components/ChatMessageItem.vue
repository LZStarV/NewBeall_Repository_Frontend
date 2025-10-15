<template>
  <div class="chat-message-item" :class="{ 'my-message': isMyMessage }">
    <!-- 对方消息 - 左对齐 -->
    <div v-if="!isMyMessage" class="message-container left-aligned">
      <div class="avatar">
        <Avatar :url="avatarUrl" :alt="userName" radius size="2.5rem" />
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="dropdown-display-name">{{ userName }}</span>
          <span class="time">{{ parseDateTime(parseInt(time)) }}</span>
        </div>
        <div class="message-bubble other-message">
          <template v-for="(part, index) in renderMessageContent" :key="index">
            <template v-if="typeof part === 'string'">{{ part }}</template>
            <Avatar v-else :prefix="getEmojiPrefix(part.categoryId)" :url="part.fileName" :alt="part.emojiAlt"
              size="1.25rem" style="display: inline-block; vertical-align: middle" :radius="false" />
          </template>
        </div>
      </div>
    </div>

    <!-- 自己的消息 - 右对齐 -->
    <div v-else class="message-container right-aligned">
      <div class="message-content">
        <div class="message-header">
          <span class="time">{{ parseDateTime(parseInt(time)) }}</span>
        </div>
        <div class="message-footer">
          <template v-if="enableReadStatus">
            <span v-if="unreadText" class="unread-status" @click="isGroupChat && handleShowReadStatus()">{{ unreadText
              }}</span>
            <span v-else class="read-status">{{ isGroupChat ? '全部' : '' }}已读</span>
          </template>
          <div class="message-bubble my-message-bubble">
            <template v-for="(part, index) in renderMessageContent" :key="index">
              <template v-if="typeof part === 'string'">{{ part }}</template>
              <Avatar v-else :prefix="getEmojiPrefix(part.categoryId)" :url="part.fileName" size="1.25rem"
                :alt="part.emojiAlt" style="display: inline-block; vertical-align: middle" :radius="false" />
            </template>
          </div>
        </div>
      </div>
      <div class="avatar">
        <Avatar :url="avatarUrl" :alt="userName" radius size="2.5rem" />
      </div>
    </div>

    <!-- 已读未读状态弹窗 -->
    <div v-if="showReadStatusDialog" class="read-status-dialog">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>消息状态</h3>
          <button class="close-btn" @click="showReadStatusDialog = false">
            <SvgIcon name="cancel" />
          </button>
        </div>
        <div class="dialog-body">
          <div class="status-section">
            <h4>已读 ({{ readUsersList?.length }})</h4>
            <div class="user-list">
              <div v-for="user in readUsersList" :key="user.id" class="user-item">
                <Avatar :url="user.avatar" :alt="user.name" radius size="2rem" />
                <span>{{ user.name }}</span>
              </div>
            </div>
          </div>
          <div class="status-section">
            <h4>未读 ({{ unreadUsersList?.length }})</h4>
            <div class="user-list">
              <div v-for="user in unreadUsersList" :key="user.id" class="user-item">
                <Avatar :url="user.avatar" :alt="user.name" radius size="2rem" />
                <span>{{ user.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormatDate } from '@/composables/useFormatDate';
import { computed, ref } from 'vue';
import { getUnreadUserList } from '@/api/chat/chatApi';
import type { UserInfo } from '@/pages/chat/Chat.type';
import {
  EMOJI_RESOURCE_CONFIG,
  emojiRegex,
  getEmojiInfo,
} from '@/utils/chat/emoji-config';

const { parseDateTime } = useFormatDate();

interface Props {
  avatarUrl: string;
  userName: string;
  time: string;
  content: string;
  isMyMessage?: boolean; // 是否是用户自己发送的信息
  unreadUsers?: number[]; // 未读用户ID数组
  isGroupChat?: boolean; // 是否是群聊
  readUsers?: number[];
  enableReadStatus?: boolean;
}

const {
  avatarUrl,
  userName,
  time,
  content,
  isMyMessage = false,
  unreadUsers = [],
  isGroupChat = false,
  readUsers = [],
  enableReadStatus = true,
} = defineProps<Props>();

const showReadStatusDialog = ref(false);
const readUsersList = ref<UserInfo[]>();
const unreadUsersList = ref<UserInfo[]>();

const handleShowReadStatus = async () => {
  try {
    const response = await getUnreadUserList(readUsers, unreadUsers);
    readUsersList.value = response.data.read;
    unreadUsersList.value = response.data.unRead;
    showReadStatusDialog.value = true;
  } catch (error) {
    console.error('获取已读未读用户列表失败:', error);
  }
};

// 计算未读状态显示文本
const unreadText = computed(() => {
  if (!isMyMessage || unreadUsers.length === 0) return '';

  if (isGroupChat) {
    return `${unreadUsers.length}人未读`;
  }
  return '未读';
});

// 添加表情渲染函数
const renderMessageContent = computed(() => {
  const decodedContent = decodeURIComponent(content);
  if (!decodedContent.includes('[')) return decodedContent;

  const parts: (
    | string
    | { isEmoji: true; fileName: string; emojiAlt: string; categoryId: string }
  )[] = [];
  let lastIndex = 0;

  decodedContent.replace(emojiRegex, (match, code, offset) => {
    // 添加表情前的文本
    if (offset > lastIndex) {
      parts.push(decodedContent.slice(lastIndex, offset));
    }

    // 查找表情信息
    const emojiInfo = getEmojiInfo(`[${code}]`);
    if (emojiInfo) {
      parts.push({
        isEmoji: true,
        fileName: emojiInfo.fileName,
        emojiAlt: `[${code}]`,
        categoryId: emojiInfo.categoryId,
      });
    } else {
      parts.push(match); // 如果找不到表情，保留原文本
    }

    lastIndex = offset + match.length;
    return match;
  });

  // 添加剩余的文本
  if (lastIndex < decodedContent.length) {
    parts.push(decodedContent.slice(lastIndex));
  }

  return parts;
});

// 获取表情资源路径
const getEmojiPrefix = (categoryId: string) => {
  const key = categoryId.toUpperCase() as keyof typeof EMOJI_RESOURCE_CONFIG;
  return EMOJI_RESOURCE_CONFIG[key] || EMOJI_RESOURCE_CONFIG.DEFAULT;
};
</script>

<style lang="scss" scoped>
.chat-message-item {
  margin-bottom: 16px;
  width: 100%;
}

.message-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 80%;
}

.left-aligned {
  justify-content: flex-start;
}

.right-aligned {
  justify-content: flex-end;
  margin-left: auto;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.dropdown-display-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.time {
  font-size: 12px;
  color: #9ca3af;
}

.message-bubble {
  display: inline-block;
  padding: 8px 12px;
  max-width: 100%;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;

  :deep(.layui-avatar) {
    margin: 0 1px;
  }
}

.other-message {
  background-color: #dbeafe;
  color: #1f2937;
  border-radius: 0 $border-radius-middle $border-radius-middle $border-radius-middle;
}

.my-message-bubble {
  background-color: $primary-color;
  color: white;
  border-radius: $border-radius-middle 0 $border-radius-middle $border-radius-middle;
}

.message-footer {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.unread-status {
  font-size: 12px;
  color: $primary-color;
  align-self: flex-end;
  margin-right: 0.25rem;
  cursor: pointer;
  text-wrap: nowrap;

  &:hover {
    text-decoration: underline;
  }
}

.read-status {
  font-size: 12px;
  color: #9ca3af;
  align-self: flex-end;
  margin-right: 0.25rem;
}

/* 右对齐消息的时间显示在右侧 */
.right-aligned .message-header {
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message-container {
    max-width: 90%;
  }

  .avatar {
    width: 36px;
    height: 36px;
  }

  .message-bubble {
    font-size: 13px;
  }
}

.read-status-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .dialog-content {
    background: white;
    border-radius: $border-radius-large;
    width: 400px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }

  .dialog-header {
    padding: 1rem;
    border-bottom: 1px solid #ededed;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 1.1rem;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #666;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: #333;
      }
    }
  }

  .dialog-body {
    padding: 1rem;
    overflow-y: auto;

    .status-section {
      margin-bottom: 1.5rem;

      h4 {
        margin: 0 0 0.5rem 0;
        font-size: 16px;
        color: #666;
      }

      .user-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .user-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: $border-radius-base;

          &:hover {
            background-color: #f5f5f5;
          }

          span {
            font-size: 0.9rem;
          }
        }
      }
    }
  }
}
</style>
