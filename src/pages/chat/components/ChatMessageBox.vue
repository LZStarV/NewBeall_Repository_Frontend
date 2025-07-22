<template>
  <div class="chat-msg-box">
    <!-- 顶部栏 -->
    <header class="header">
      <div class="left">
        <Avatar :url="chatboxInfo?.avatar" radius size="3rem" />
        <strong>{{ chatboxInfo?.chatName }}</strong>
      </div>
      <div class="right">
        <!-- 公司信息按钮 - 当聊天对象有公司信息时显示 -->
        <button
          v-if="
            chatboxInfo?.toKey?.startsWith('PY') ||
            chatboxInfo?.toKey?.startsWith('PRO')
          "
          class="tool-btn"
          :class="{ active: showCompanyInfo }"
          @click="$emit('toggle-company-info')"
        >
          <SvgIcon name="company_information" />
        </button>
        <!-- 群聊相关按钮 -->
        <template v-if="chatboxInfo?.type">
          <div class="group-btn-container">
            <button
              class="tool-btn"
              :class="{ active: showMemberPanel }"
              @click="showGroupMember"
            >
              <SvgIcon name="group_chat" />
            </button>
            <!-- 群成员面板 -->
            <div v-if="showMemberPanel" class="member-panel" @click.stop>
              <h3>群成员列表</h3>
              <div class="member-list">
                <div
                  v-for="member in groupMembers"
                  :key="member.id"
                  class="member-item"
                >
                  <div class="member-info">
                    <Avatar :url="member.avatar" size="2rem" radius />
                    <span class="member-name">{{ member.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="group-btn-container">
            <button
              class="tool-btn"
              :class="{ active: showAddMemberPanel }"
              @click="addGroupMember"
            >
              <SvgIcon name="add_to" />
            </button>
            <!-- 添加成员面板 -->
            <div
              v-if="showAddMemberPanel"
              class="member-panel add-member-panel"
              @click.stop
            >
              <h3>添加群成员</h3>
              <div class="member-list">
                <div
                  v-for="member in notJoinMembers"
                  :key="member.id"
                  class="member-item"
                  :class="{
                    selected: selectedMembers.includes(String(member.id)),
                  }"
                  @click="toggleMemberSelection(String(member.id))"
                >
                  <div class="member-info">
                    <Avatar :url="member.avatar" size="2rem" radius />
                    <span class="member-name">{{ member.name }}</span>
                  </div>
                  <div class="select-box">
                    <SvgIcon
                      :name="
                        selectedMembers.includes(String(member.id))
                          ? 'hook'
                          : 'select_box'
                      "
                      class="select-icon"
                    />
                  </div>
                </div>
              </div>
              <div class="panel-footer">
                <button
                  class="confirm-btn"
                  :disabled="selectedMembers.length === 0"
                  @click="handleConfirmAdd"
                >
                  确认添加
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </header>
    <!-- 客服页面 -->
    <div v-if="!chatboxInfo" class="cs-page">
      <ChatMessageItem
        avatar-url=""
        user-name="客服"
        :time="String(Date.now())"
        content="您好！壹新Newbeall设计报价管理云平台欢迎您的咨询与提出宝贵意见！"
        :is-my-message="false"
      />
    </div>
    <!-- 聊天内容 -->
    <main ref="msgAreaRef" class="msg-area">
      <template v-for="[date, messages] in groupedMessages" :key="date">
        <div class="date-divider">
          <span class="date-text">{{ formatDateHeader(date) }}</span>
        </div>
        <ChatMessageItem
          v-for="msg of messages"
          :key="msg.id"
          :avatar-url="msg.avatar!"
          :user-name="msg.sendName!"
          :time="msg.sendTime"
          :content="msg.content"
          :is-my-message="userInfo.id == msg.fromId"
          :unread-users="parseJsonSafely(msg.unread)"
          :read-users="parseJsonSafely(msg.read)"
          :is-group-chat="chatboxInfo?.type || false"
        />
      </template>
    </main>

    <!-- 底部输入框 -->
    <footer v-if="chatboxInfo" class="input-box">
      <div class="toolbar">
        <div class="toolbar-btn" @click.stop="showEmojiPanel = !showEmojiPanel">
          <SvgIcon name="smile" width="1.25rem" height="1.25rem" />
          <!-- 表情选择面板 -->
          <div v-if="showEmojiPanel" class="emoji-panel" @click.stop>
            <!-- 分类标签 -->
            <div class="emoji-categories">
              <div
                v-for="category in EMOJI_CATEGORIES"
                :key="category.id"
                class="category-item"
                :class="{ active: currentCategoryId === category.id }"
                @click="currentCategoryId = category.id"
              >
                {{ category.name }}
              </div>
            </div>
            <!-- 表情网格 -->
            <div class="emoji-grid">
              <div
                v-for="(value, key) in currentEmojis"
                :key="key"
                class="emoji-item"
                @click="insertEmoji(value)"
              >
                <Avatar
                  :prefix="currentEmojiPrefix"
                  :url="key"
                  :alt="value"
                  size="1.5rem"
                  :radius="false"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="input-area">
        <div class="preview-area">
          <template v-for="(part, index) in renderInputContent" :key="index">
            <template v-if="typeof part === 'string'">{{ part }}</template>
            <Avatar
              v-else
              :prefix="getEmojiPrefix(part.categoryId)"
              :url="part.fileName"
              size="1.25rem"
              :radius="false"
              style="display: inline-block; vertical-align: middle"
            />
          </template>
        </div>
        <textarea
          ref="textareaRef"
          v-model="inputContent"
          @keydown.enter.prevent="handleKeyDown"
        ></textarea>
      </div>
      <div class="tips-bar">Tips: PC端下按下 Shift + Enter 换行</div>
      <button class="send-btn" @click="handleSendMessage">
        <SvgIcon name="send" width="0.75rem" height="0.75rem" />
        发送
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch, computed } from 'vue';
import type { ChatInfo, ChatMessage, UserInfo } from '../Chat.type';
import SvgIcon from '@/components/SvgIcon.vue';
import ChatMessageItem from './ChatMessageItem.vue';
import {
  getMessages,
  sendMessage,
  getGroupMembers,
  getNotJoinMember,
  joinGroup,
} from '@/api/chat/chatApi';
import Avatar from '@/components/Avatar.vue';
import { useFormatDate } from '@/composables/useFormatDate';
import dayjs from 'dayjs';
import {
  EMOJI_CATEGORIES,
  EMOJI_RESOURCE_CONFIG,
  emojiRegex,
  getEmojiInfo,
  type EmojiCategory,
} from '@/utils/chat/emoji-config';

const { formatDateTime } = useFormatDate();

const showEmojiPanel = ref(false);
const currentCategoryId = ref('default');

// 获取当前分类的表情
const currentEmojis = computed(() => {
  const category = EMOJI_CATEGORIES.find(
    (c: EmojiCategory) => c.id === currentCategoryId.value,
  );
  return category?.emojis || {};
});

// 获取当前分类的资源路径
const currentEmojiPrefix = computed(() => {
  const category = EMOJI_CATEGORIES.find(
    (c: EmojiCategory) => c.id === currentCategoryId.value,
  );
  if (category?.id === 'default') {
    return EMOJI_RESOURCE_CONFIG.DEFAULT;
  }
  return (
    EMOJI_RESOURCE_CONFIG[
      category?.id.toUpperCase() as keyof typeof EMOJI_RESOURCE_CONFIG
    ] || EMOJI_RESOURCE_CONFIG.DEFAULT
  );
});

// 在文本框中插入表情
const insertEmoji = (emoji: string) => {
  const textarea = textareaRef.value as HTMLTextAreaElement | null;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  inputContent.value =
    inputContent.value.substring(0, start) +
    emoji +
    inputContent.value.substring(end);

  nextTick(() => {
    textarea.focus();
    const newCursorPos = start + emoji.length;
    textarea.selectionStart = textarea.selectionEnd = newCursorPos;
  });

  showEmojiPanel.value = false;
};

// 渲染输入框内容（包含表情）
const renderInputContent = computed(() => {
  if (!inputContent.value.includes('[')) return inputContent.value;

  const parts: (
    | string
    | { isEmoji: true; fileName: string; categoryId: string }
  )[] = [];
  let lastIndex = 0;

  inputContent.value.replace(emojiRegex, (match, code, offset) => {
    // 添加表情前的文本
    if (offset > lastIndex) {
      parts.push(inputContent.value.slice(lastIndex, offset));
    }

    // 查找表情信息
    const emojiInfo = getEmojiInfo(`[${code}]`);
    if (emojiInfo) {
      parts.push({
        isEmoji: true,
        fileName: emojiInfo.fileName,
        categoryId: emojiInfo.categoryId,
      });
    } else {
      parts.push(match); // 如果找不到表情，保留原文本
    }

    lastIndex = offset + match.length;
    return match;
  });

  // 添加剩余的文本
  if (lastIndex < inputContent.value.length) {
    parts.push(inputContent.value.slice(lastIndex));
  }

  return parts;
});

// 获取表情资源路径
const getEmojiPrefix = (categoryId: string) => {
  const key = categoryId.toUpperCase() as keyof typeof EMOJI_RESOURCE_CONFIG;
  return EMOJI_RESOURCE_CONFIG[key] || EMOJI_RESOURCE_CONFIG.DEFAULT;
};

// 按天对消息进行分组
const groupedMessages = computed(() => {
  if (!chatMessages.value) return new Map<string, ChatMessage[]>();

  const groups = new Map<string, ChatMessage[]>();

  chatMessages.value.forEach((msg) => {
    // 获取消息的日期（去掉时间部分）
    const date = dayjs(Number(msg.sendTime)).format('YYYY-MM-DD');
    if (!groups.has(date)) {
      groups.set(date, []);
    }
    groups.get(date)!.push(msg);
  });

  return groups;
});

// 格式化日期显示
const formatDateHeader = (date: string) => {
  const today = dayjs().format('YYYY-MM-DD');
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

  if (date === today) {
    return '今天';
  } else if (date === yesterday) {
    return '昨天';
  }
  return formatDateTime(date);
};

const chatMessages = ref<ChatMessage[]>();

const chatboxInfo = ref<ChatInfo>();

const inputContent = ref('');

const msgAreaRef = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLElement | null>(null);

const handleSendMessage = async () => {
  if (inputContent.value.length <= 0) {
    return;
  }
  if (chatboxInfo.value) {
    const chatMsg: ChatMessage = {
      chatName: chatboxInfo.value.chatName,
      content: inputContent.value,
      fromId: props.userInfo.id,
      sendTime: String(Date.now()),
      toId: chatboxInfo.value.toKey,
      type: chatboxInfo.value.type,
    };
    const res: ChatMessage | undefined = await sendMessage(chatMsg);
    if (res) {
      inputContent.value = '';
      if (textareaRef.value) textareaRef.value.focus();
      await getMessageList();
      nextTick(() => {
        scrollToBottom(); // 让页面滚到底端最新消息
      });
    }
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.shiftKey) {
    // Shift + Enter 换行，不阻止默认行为
    e.preventDefault(); // 取消先前的 prevent
    const textarea = e.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    inputContent.value =
      inputContent.value.substring(0, start) +
      '\n' +
      inputContent.value.substring(end);
    nextTick(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    });
  } else {
    // 仅按下Enter键时发送消息
    e.preventDefault();
    handleSendMessage();
  }
};

const parseJsonSafely = (jsonString: string | undefined | null): number[] => {
  if (!jsonString) return [];
  try {
    const result = JSON.parse(jsonString);
    return Array.isArray(result) ? result : [];
  } catch (e) {
    console.warn('JSON parse failed:', e);
    return [];
  }
};

const props = defineProps<{
  chatInfo: ChatInfo;
  userInfo: UserInfo;
  showCompanyInfo?: boolean;
}>();

// Emits
defineEmits<{
  'toggle-company-info': [];
  'view-group-members': [];
  'add-group-member': [];
}>();

const getMessageList = async () => {
  const res = await getMessages(props.chatInfo.toKey);
  chatMessages.value = res.data.sort((a: ChatMessage, b: ChatMessage) => {
    return Number(a.sendTime) - Number(b.sendTime);
  });
};

watch(
  () => props.chatInfo,
  async (newVal) => {
    chatboxInfo.value = newVal;
    // 重新调用api
    await getMessageList();
    if (textareaRef.value) textareaRef.value.focus();
    nextTick(() => {
      scrollToBottom(); // 此时DOM已经更新，可以操作
    });
  },
);

// 控制聊天列表滚动到底部
const scrollToBottom = () => {
  const el = msgAreaRef.value;
  if (el) {
    el.scrollTop = el.scrollHeight;
  }
};

onMounted(() => {
  chatboxInfo.value = props.chatInfo;
});

// 群成员相关
const showMemberPanel = ref(false);
const showAddMemberPanel = ref(false);
const groupMembers = ref<UserInfo[]>([]);
const notJoinMembers = ref<UserInfo[]>([]);
const selectedMembers = ref<string[]>([]);

// 获取群成员列表
const showGroupMember = async () => {
  if (!chatboxInfo.value?.toKey) return;

  try {
    const res = await getGroupMembers(chatboxInfo.value.toKey);
    groupMembers.value = res.data;
    showMemberPanel.value = true;
    showAddMemberPanel.value = false; // 关闭其他面板
  } catch (error) {
    console.error('获取群成员失败:', error);
  }
};

// 获取可添加的成员列表
const addGroupMember = async () => {
  if (!chatboxInfo.value?.toKey) return;

  try {
    const res = await getNotJoinMember(chatboxInfo.value.toKey);
    notJoinMembers.value = res.data;
    selectedMembers.value = []; // 清空选择
    showAddMemberPanel.value = true;
    showMemberPanel.value = false; // 关闭其他面板
  } catch (error) {
    console.error('获取可添加成员失败:', error);
  }
};

// 切换成员选择状态
const toggleMemberSelection = (memberId: string) => {
  const index = selectedMembers.value.indexOf(memberId);
  if (index === -1) {
    selectedMembers.value.push(memberId);
  } else {
    selectedMembers.value.splice(index, 1);
  }
};

// 确认添加成员
const handleConfirmAdd = async () => {
  if (!chatboxInfo.value?.toKey || selectedMembers.value.length === 0) return;

  try {
    await joinGroup(chatboxInfo.value.toKey, selectedMembers.value);
    showAddMemberPanel.value = false;
    selectedMembers.value = [];
    // 刷新群成员列表
    await showGroupMember();
  } catch (error) {
    console.error('添加群成员失败:', error);
  }
};

// 点击其他地方关闭面板
onMounted(() => {
  document.addEventListener('click', () => {
    showMemberPanel.value = false;
    showAddMemberPanel.value = false;
  });
});
</script>

<style scoped lang="scss">
.chat-msg-box {
  width: 100%;
  display: flex;
  flex-direction: column;

  .header {
    padding: 1.25rem 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    height: 75px;
    width: 100%;
    border-bottom: 1px solid #ededed;

    .left {
      .layui-avatar {
        width: 3rem;
        height: 3rem;
        margin-right: 0.5rem;
      }
    }

    .right {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-right: 0.5rem;
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

  .cs-page {
    padding: 1rem;
    width: 100%;
    align-items: center;
  }

  .msg-area {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 1rem;
    padding-bottom: 0;
    flex: 1;
    width: 100%;
    align-items: center;
    flex-shrink: none;
  }

  .input-box {
    border-top: 1px solid #ededed;
    display: flex;
    flex-direction: column;
    height: 200px;
    position: relative;

    .toolbar {
      display: flex;
      align-items: center;
      padding: 0.5rem 0.5rem;
      max-height: 3rem;

      .toolbar-btn {
        color: #808080;
        padding: 0.5rem;
        border-radius: $border-radius-base;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        &:hover {
          background-color: #ededed;
        }
      }
    }

    .input-area {
      padding: 0 1rem 1rem 1rem;
      position: relative;

      .preview-area {
        position: absolute;
        top: 0;
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
        pointer-events: none;
        white-space: pre-wrap;
        word-wrap: break-word;
        visibility: hidden;

        :deep(.layui-avatar) {
          visibility: visible;
          margin: 0 1px;
          vertical-align: middle;
        }
      }

      textarea {
        width: 100%;
        height: 100px;
        resize: none;
        border: none;
        background: transparent;
        font: inherit;
        line-height: inherit;
        position: relative;
        z-index: 1;
      }
    }

    .tips-bar {
      text-align: center;
      font-size: 12px;
      user-select: none;
      color: #8c8c8c;
      z-index: 10;
      margin-bottom: 1rem;
    }

    .send-btn {
      font-size: 13px;
      letter-spacing: 6px;
      color: white;
      background-color: $primary-color;
      padding: 0.3rem 0.8rem;
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      align-items: center;
      border: none;
      border-radius: $border-radius-base;
      position: absolute;
      right: 1rem;
      bottom: 1rem;
    }
  }
}

.toolbar {
  .toolbar-btn {
    position: relative;
    cursor: pointer;

    .emoji-panel {
      position: absolute;
      bottom: 100%;
      left: 0;
      background: white;
      border: 1px solid #ededed;
      border-radius: $border-radius-large;
      width: 360px;
      max-height: 400px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      display: flex;
      flex-direction: column;

      .emoji-categories {
        padding: 0.5rem;
        border-bottom: 1px solid #ededed;
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;

        .category-item {
          padding: 0.25rem 0.75rem;
          border-radius: $border-radius-base;
          font-size: 0.875rem;
          cursor: pointer;
          color: #666;
          transition: all 0.2s;

          &:hover {
            background-color: #f5f5f5;
          }

          &.active {
            background-color: $primary-color;
            color: white;
          }
        }
      }

      .emoji-grid {
        padding: 1rem;
        overflow-y: auto;
        overflow-x: hidden;
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 0.5rem;
        max-height: 300px;

        .emoji-item {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.25rem;
          border-radius: $border-radius-base;
          cursor: pointer;

          &:hover {
            background-color: #f5f5f5;
          }
        }
      }
    }
  }
}

.date-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;

  .date-text {
    background-color: #f0f2f5;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    color: #666;
  }
}

.group-btn-container {
  position: relative;
}

.member-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border: 1px solid #ededed;
  border-radius: $border-radius-large;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 280px;
  max-height: 400px;
  z-index: 1000;

  h3 {
    margin: 0;
    padding: 1rem;
    font-size: 1rem;
    border-bottom: 1px solid #ededed;
  }

  .member-list {
    padding: 0.5rem;
    max-height: 300px;
    overflow-y: auto;

    .member-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem;
      border-radius: $border-radius-base;
      cursor: pointer;

      &:hover {
        background-color: #f5f5f5;
      }

      &.selected {
        background-color: rgba($primary-color, 0.1);
      }

      .member-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .member-name {
        font-size: 0.9rem;
        color: #1e293b;
      }

      .select-box {
        color: $primary-color;
      }
    }
  }
}

.add-member-panel {
  .panel-footer {
    padding: 1rem;
    border-top: 1px solid #ededed;
    display: flex;
    justify-content: flex-end;

    .confirm-btn {
      background-color: $primary-color;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: $border-radius-base;
      cursor: pointer;
      font-size: 0.9rem;

      &:hover {
        background-color: darken($primary-color, 5%);
      }

      &:disabled {
        background-color: #cbd5e1;
        cursor: not-allowed;
      }
    }
  }
}
</style>
