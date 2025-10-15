<template>
  <transition name="slide-right">
    <div v-if="visible" class="comment-panel">
      <div class="panel-header">
        <span>评论记录</span>
        <button title="关闭面板" @click="closePanel">
          <SvgIcon name="cancel" width="0.8rem" />
        </button>
      </div>
      <div class="panel-body">
        <div v-if="isLoading" class="loading">加载中...</div>
        <div v-else>
          <div class="comment-list">
            <div v-if="commentMessageList.length === 0" class="empty-state">
              <div class="empty-icon">💬</div>
              <p class="empty-text">暂无评论</p>
            </div>
            <div v-else class="comments-container">
              <ChatMessageItem v-for="comment in commentMessageList" :key="`${comment.topicId}-${comment.topicTime}`"
                :avatar-url="comment.avatar || ''" :user-name="comment.userName || '未知用户'"
                :time="String(comment.topicTime)" :content="comment.content" :is-my-message="comment.fromUid === userId"
                :enable-read-status="false" />
            </div>
          </div>
        </div>
      </div>
      <div class="panel-footer">
        <div class="input-container">
          <textarea v-model="messageContent" class="message-input" placeholder="输入评论内容..." rows="3"
            @keydown.enter.prevent="handleSendMessage"></textarea>
          <EmojiSelectPanel v-if="showEmojiPanel" @insertEmoji="insertEmoji" />
          <div class="footer-buttons">
            <button class="emoji-button" @click="toggleEmojiPanel" title="选择表情">
              <SvgIcon name="smile" width="1rem" />
            </button>
            <lay-button class="send-button" type="primary" size="sm" @click="handleSendMessage"
              :disabled="!messageContent.trim() || isSending">{{ isSending ? '发送中...' : '发送' }}</lay-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { CommentMessage } from '@/websocket/orderDetailComment';
import { ref, watch, onUnmounted } from 'vue';
import ChatMessageItem from '@/pages/chat/components/ChatMessageItem.vue';
import EmojiSelectPanel from '@/pages/chat/components/EmojiSelectPanel.vue';
import { useChatStore } from '@/stores/chat';
import topicApi from '@/api/topic/topicApi';

const props = defineProps<{
  visible: boolean;
  commentList: CommentMessage[];
  chatType: number;
  orderId: number | string;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const isLoading = ref(false);
const commentMessageList = ref<CommentMessage[]>([]);
const messageContent = ref('');
const isSending = ref(false);
const showEmojiPanel = ref(false);

const closePanel = () => {
  emit('update:visible', false);
};

const chatStore = useChatStore();
const userId = ref<string | number>();
userId.value = chatStore.userInfoData?.id;

// 发送消息
const handleSendMessage = async () => {
  if (!messageContent.value.trim() || isSending.value) return;

  try {
    isSending.value = true;
    await topicApi.addTopic({
      content: messageContent.value.trim(),
      oid: props.orderId,
      type: props.chatType,
      userids: [] // 按要求先置空
    });

    // 发送成功后清空输入框
    messageContent.value = '';

    // 这里可以触发评论列表刷新或者添加新评论到列表
    // emit('comment-sent'); // 如果需要通知父组件刷新评论列表

  } catch (error) {
    console.error('发送评论失败:', error);
    // 这里可以添加错误提示
  } finally {
    isSending.value = false;
  }
};

// 切换表情面板显示状态
const toggleEmojiPanel = () => {
  showEmojiPanel.value = !showEmojiPanel.value;
};

// 插入表情到输入框
const insertEmoji = (emoji: string) => {
  messageContent.value += emoji;
  showEmojiPanel.value = false; // 选择表情后关闭面板
};

// 点击外部关闭表情面板
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  const emojiPanel = document.querySelector('.emoji-panel');
  const emojiButton = document.querySelector('.emoji-button');

  if (showEmojiPanel.value &&
    emojiPanel &&
    !emojiPanel.contains(target) &&
    emojiButton &&
    !emojiButton.contains(target)) {
    showEmojiPanel.value = false;
  }
};

// 监听点击事件
watch(showEmojiPanel, (newVal) => {
  if (newVal) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
});

// 组件卸载时清理事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// 当面板显示或 commentList 变化时设置数据
watch(
  () => [props.visible, props.commentList],
  ([visible]) => {
    if (visible) {
      commentMessageList.value = props.commentList;
    }
  },
  { immediate: false },
);
</script>

<style scoped lang="scss">
.comment-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 340px;
  height: 100%;
  background: #fff;
  border-left: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  display: flex;
  flex-direction: column;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid #f0f0f0;
    font-weight: 600;

    button {
      @include button-style($primary-color);
      color: #999;
    }
  }

  .panel-body {
    padding: 10px 12px;
    overflow: auto;
    flex: 1;
  }

  .loading,
  .empty {
    text-align: center;
    color: #999;
    padding: 12px 0;
  }

  .panel-footer {
    border-top: 1px solid #f0f0f0;
    padding: 12px;
    background: #fafafa;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }

  .message-input {
    width: 100%;
    min-height: 60px;
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    line-height: 1.4;
    resize: vertical;
    font-family: inherit;
    background: #fff;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  .footer-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;

    .emoji-button {
      @include button-style($primary-color);
      color: #999;
    }

    .send-button {
      min-width: 80px;
    }
  }

  .input-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
  }

  // 表情面板样式调整
  :deep(.emoji-panel) {
    position: absolute;
    bottom: 100%;
    left: -40px;
    right: 0;
    margin-bottom: 8px;
    z-index: 1001;
  }
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
