<template>
  <div class="chat-msg-box">
    <!-- 顶部栏 -->
    <header class="header">
      <div class="left">
        <button v-if="showBackButton" class="back-button" @click="handleBackClick">
          <SvgIcon name="to_the_left" width="1.25rem" height="1.25rem" />
        </button>
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
          :class="{ active: chatStore.isCompanyInfoShow }"
          @click="chatStore.setCompanyInfoVisiable(!chatStore.isCompanyInfoShow)"
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
      <button class="feedback-btn" @click="showFeedbackPanel = true">
        <SvgIcon name="consult" />
        提交意见
      </button>
    </div>

    <!-- 意见反馈面板 -->
    <div v-if="showFeedbackPanel" class="feedback-panel-overlay" @click.self="closeFeedbackPanel">
      <div class="feedback-panel">
        <h3>提交建议给壹新</h3>
        <div class="form-group">
          <label for="feedbackContent">建议内容 (5-200字):</label>
          <textarea
            id="feedbackContent"
            v-model="feedbackContent"
            @input="validateFeedback"
            :class="{ 'input-error': feedbackError }"
            placeholder="请输入您的建议"
          ></textarea>
          <p v-if="feedbackError" class="error-message">{{ feedbackError }}</p>
        </div>
        <div class="form-group">
          <label for="phoneNumber">电话号码:</label>
          <input
            type="tel"
            id="phoneNumber"
            v-model="phoneNumber"
            @input="validatePhone"
            :class="{ 'input-error': phoneError }"
            placeholder="请输入您的手机号码"
          />
          <p v-if="phoneError" class="error-message">{{ phoneError }}</p>
        </div>
        <div class="panel-actions">
          <button class="cancel-btn" @click="closeFeedbackPanel">取消</button>
          <button
            class="submit-btn"
            :disabled="!feedbackContent || !phoneNumber || feedbackError.length > 0 || phoneError.length > 0"
            @click="handleSubmitFeedback"
          >提交</button>
        </div>
      </div>
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
          :is-my-message="userInfo!.id == msg.fromId"
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
                :class="{ active: Boolean(currentCategoryId === category.id) }"
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
import { nextTick, onMounted, ref, watch, computed, onUnmounted } from 'vue';
import type { ChatInfo, ChatMessage, UserInfo } from '../Chat.type';
import SvgIcon from '@/components/SvgIcon.vue';
import ChatMessageItem from './ChatMessageItem.vue';
import {
  getMessages,
  sendMessage,
  getGroupMembers,
  getNotJoinMember,
  joinGroup,
  submitFeedback, // 导入 submitFeedback API
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
import { useChatStore } from '@/stores/chat';

// Props
defineProps<{
  showBackButton?: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: 'back-clicked'): void;
}>();

// 处理返回按钮点击
const handleBackClick = () => {
  emit('back-clicked');
};

const { formatDateTime } = useFormatDate();

const showEmojiPanel = ref(false);
const currentCategoryId = ref('default');

// 意见反馈相关
const showFeedbackPanel = ref(false);
const feedbackContent = ref('');
const phoneNumber = ref('');
const feedbackError = ref('');
const phoneError = ref('');

const validateFeedback = () => {
  if (feedbackContent.value.length < 5 || feedbackContent.value.length > 200) {
    feedbackError.value = '建议内容长度需在5-200字之间';
    return false;
  }
  feedbackError.value = '';
  return true;
};

const validatePhone = () => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phoneNumber.value)) {
    phoneError.value = '请输入正确的11位手机号码';
    return false;
  }
  phoneError.value = '';
  return true;
};

const handleSubmitFeedback = async () => {
  const isFeedbackValid = validateFeedback();
  const isPhoneValid = validatePhone();

  if (isFeedbackValid && isPhoneValid) {
    try {
      await submitFeedback(feedbackContent.value, phoneNumber.value);
      alert('意见提交成功！感谢您的宝贵建议。');
      showFeedbackPanel.value = false;
      feedbackContent.value = '';
      phoneNumber.value = '';
    } catch (error) {
      console.error('提交意见失败:', error);
      alert('提交意见失败，请稍后再试。');
    }
  }
};

const closeFeedbackPanel = () => {
  showFeedbackPanel.value = false;
  feedbackContent.value = '';
  phoneNumber.value = '';
  feedbackError.value = '';
  phoneError.value = '';
};

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
      fromId: userInfo.value!.id,
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

const chatStore = useChatStore();

const userInfo = ref<UserInfo>();

onMounted(async () => {
  await chatStore.setUserInfo();
  userInfo.value = chatStore.userInfoData!;
});

const getMessageList = async () => {
  const res = await getMessages(chatStore.chatInfo!.toKey);
  chatMessages.value = res.data.sort((a: ChatMessage, b: ChatMessage) => {
    return Number(a.sendTime) - Number(b.sendTime);
  });
};

watch(
  () => chatStore.chatInfo,
  async (newVal) => {
    chatboxInfo.value = newVal!;
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

// 关闭成员、表情面板
const closePanel = () => {
  showMemberPanel.value = false;
  showAddMemberPanel.value = false;
  showEmojiPanel.value = false;
};

// 点击其他地方关闭面板
onMounted(() => {
  document.addEventListener('click', closePanel);
});

onUnmounted(() => {
  document.removeEventListener('click', closePanel);
});
</script>

<style scoped lang="scss">
@use "sass:color";

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
      display: flex;
      align-items: center;

      .back-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        padding: 0.5rem;
        margin-right: 0.5rem;
        color: #2b5bb2;
        border-radius: $border-radius-base;

        &:hover {
          background-color: #f5f5f5;
        }
      }

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

    .feedback-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 2rem auto;
      padding: 0.5rem 1rem;
      background-color: $primary-color;
      color: white;
      border: none;
      border-radius: $border-radius-base;
      cursor: pointer;

      &:hover {
        background-color: color.adjust($primary-color, $lightness: -5%);
      }
    }
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

      &:hover {
        background-color: color.adjust($primary-color, $lightness: -5%);
      }
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
    border-radius: $border-radius-extra-large;
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
        background-color: color.adjust($primary-color, $lightness: -5%);
      }

      &:disabled {
        background-color: #cbd5e1;
        cursor: not-allowed;
      }
    }
  }
}

/* 意见反馈面板样式 */
.feedback-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.feedback-panel {
  background-color: white;
  padding: 2rem;
  border-radius: $border-radius-large;
  box-shadow: $box-shadow-base;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: $font-size-large;
    color: $text-primary;
    text-align: center;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: $font-size-base;
      color: $text-regular;
    }

    textarea,
    input[type="tel"] {
      padding: 0.75rem;
      border: 1px solid $border-color-base;
      border-radius: $border-radius-base;
      font-size: $font-size-base;
      resize: vertical;
      min-height: 20px;

      &:focus {
        outline: none;
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
      }

      &.input-error {
        border-color: $danger-color;
      }
    }

    .error-message {
      color: $danger-color;
      font-size: $font-size-small;
      margin-top: 0.25rem;
      margin-bottom: 0;
    }
  }

  .panel-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;

    button {
      padding: 0.5rem 1.5rem;
      border-radius: $border-radius-middle;
      cursor: pointer;
      font-size: $font-size-base;
      transition: background-color 0.2s ease;

      &.cancel-btn {
        background-color: #e0e0e0;
        color: #333;
        border: none;

        &:hover {
          background-color: #c0c0c0;
        }
      }

      &.submit-btn {
        background-color: $primary-color;
        color: white;
        border: none;

        &:hover {
          background-color: color.adjust($primary-color, $lightness: -5%);
        }


      }
    }
  }
}

/* 移动端样式调整 */
@media (max-width: 768px) {
  .emoji-panel {
    width: 300px !important;

    .emoji-grid {
      grid-template-columns: repeat(6, 1fr) !important;
    }
  }

  .member-panel {
    width: 250px !important;
  }

  .input-box {
    height: 180px !important;

    .input-area textarea {
      height: 80px !important;
    }
  }

  .tips-bar {
    display: none;
  }
}
</style>
