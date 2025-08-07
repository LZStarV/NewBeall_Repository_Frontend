<template>
  <BaseCard title="用户成员">
    <template #actions>
      <lay-icon
        type="layui-icon-reply-fill"
        class="action-icon"
        @click="handleClickChat"
      />
    </template>
    <div class="member-content">
      <!-- 全选框 -->
      <div class="select-all">
        <lay-checkbox
          v-model="isSelectAll"
          :isIndeterminate="isIndeterminate"
          skin="primary"
          value="selectAll"
          @change="handleSelectAll"
        >
          全选
        </lay-checkbox>
      </div>

      <!-- 用户列表 -->
      <div class="member-list">
        <lay-checkbox-group v-model="selectedUsers" @change="handleGroupChange">
          <div
            v-for="user in blackboardData?.users"
            :key="user.id || user.phone"
            class="member-item"
          >
            <lay-checkbox :value="user.id || user.phone" skin="primary" />

            <div class="user-avatar">
              <Avatar :url="user.avatar" :alt="user.name" size="2.5rem" />
            </div>

            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-phone">{{ user.phone }}</div>
            </div>
          </div>
        </lay-checkbox-group>
      </div>
    </div>
  </BaseCard>

  <!-- 聊天抽屉 -->
  <lay-layer
    v-model="showChatDrawer"
    :title="`与 ${currentChatUser} 的聊天记录`"
    type="drawer"
    area="400px"
    offset="r"
    @close="handleCloseChatDrawer"
  >
    <div class="chat-content">
      <div class="chat-messages">
        <div
          v-for="message in chatMessages"
          :key="message.topicId"
          class="message-item"
        >
          <div class="message-avatar">
            <Avatar :url="message.avatar" :alt="message.userName" size="2rem" />
          </div>
          <div class="message-body">
            <div class="message-header">
              <span class="message-user">{{ message.userName }}</span>
              <span class="message-time">{{
                parseDateTime(message.topicTime)
              }}</span>
            </div>
            <div class="message-content">{{ message.content }}</div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <lay-textarea
          v-model="newMessage"
          placeholder="请输入留言内容..."
          :rows="3"
          :maxlength="500"
          show-count
        />
        <div class="input-actions">
          <lay-button type="primary" size="sm" @click="sendMessage">
            发送
          </lay-button>
        </div>
      </div>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import BaseCard from './BaseCard.vue';
import Avatar from '@/components/Avatar.vue';
import blackboardApi from '@/api/blackboard/blackboardApi';
import type { GetBlackboardDataRes } from '@/api/blackboard/blackboardApi.type';
import { useChatStore } from '@/stores/chat';
import type { WebSocketClient } from '@/utils/websocket';
import { createMemberChatWebSocket } from '@/websocket/memberChat';
import type { MemberChatRes } from '@/types/dashboard';
import { layer } from '@layui/layui-vue';
import { useFormatDate } from '@/composables/useFormatDate';

const blackboardData = ref<GetBlackboardDataRes>();
const selectedUsers = ref<(string | number)[]>([]);
const isSelectAll = ref(false);

// 留言相关
let wsClient: WebSocketClient;
const chatStore = useChatStore();
const showChatDrawer = ref(false);
const chatMessages = ref<MemberChatRes[]>([]);
const currentChatUser = ref<string>('');
const newMessage = ref('');

// 使用时间格式化组合函数
const { parseDateTime } = useFormatDate();

const getBlackboardData = async () => {
  const res = await blackboardApi.getBlackboardData();
  blackboardData.value = res.data || res;
};

// 监听选中用户变化，更新全选状态
watch(
  selectedUsers,
  () => {
    const totalUsers = blackboardData.value?.users?.length || 0;
    isSelectAll.value =
      totalUsers > 0 && selectedUsers.value.length === totalUsers;
  },
  { deep: true },
);

// 半选状态计算, 当选中数量大于0且小于总数时为半选状态
const isIndeterminate = computed(() => {
  const totalUsers = blackboardData.value?.users?.length || 0;
  const selectedCount = selectedUsers.value.length;
  return selectedCount > 0 && selectedCount < totalUsers && !isSelectAll.value;
});

// 处理全选
const handleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedUsers.value =
      blackboardData.value?.users?.map((user) => user.id || user.phone) || [];
  } else {
    selectedUsers.value = [];
  }
};

// 处理组变化
const handleGroupChange = (val: (string | number)[]) => {
  console.log('组选择变化:', val);
};

// 留言
const handleClickChat = () => {
  if (selectedUsers.value.length === 0) {
    layer.msg('请先选择要留言的用户', { icon: 2 });
    return;
  }

  if (selectedUsers.value.length > 1) {
    layer.msg('一次只能与一个用户聊天，请选择一个用户', { icon: 2 });
    return;
  }

  const userId = chatStore.userInfoData?.id;
  const receptionUserid = selectedUsers.value[0];

  // 获取选中用户的姓名
  const selectedUser = blackboardData.value?.users?.find(
    (user) => (user.id || user.phone) === receptionUserid,
  );
  currentChatUser.value = selectedUser?.name || '未知用户';

  // 创建ws实例
  if (userId) {
    wsClient = createMemberChatWebSocket(
      userId,
      Number(receptionUserid),
      2,
      (data: unknown) => {
        // 处理接收到的消息
        const messageData = data as { topicList?: MemberChatRes[] };
        if (messageData.topicList && Array.isArray(messageData.topicList)) {
          chatMessages.value = messageData.topicList;
          // 显示聊天抽屉
          showChatDrawer.value = true;
        }
      },
    );

    // 启动连接
    wsClient.connect();
  }
};

// 关闭聊天抽屉
const handleCloseChatDrawer = () => {
  showChatDrawer.value = false;
  chatMessages.value = [];
  currentChatUser.value = '';
  newMessage.value = '';

  // 关闭WebSocket连接
  if (wsClient) {
    wsClient.disconnect();
  }
};

// 发送消息
const sendMessage = () => {
  if (!newMessage.value.trim()) {
    layer.msg('请输入消息内容', { icon: 2 });
    return;
  }

  // TODO: 实现发送消息功能
  // 这里需要根据具体的WebSocket协议发送消息
  if (wsClient) {
    const messageData = JSON.stringify({
      content: newMessage.value.trim(),
      type: 'message',
    });

    wsClient.send(messageData);

    // 清空输入框
    newMessage.value = '';
  }
};

onMounted(() => {
  getBlackboardData();
});
</script>

<style lang="scss" scoped>
.member-content {
  height: 100%;
  @include flex(column);
}

:deep(
  .layui-checkbox[size='md']
    .layui-form-checkbox[lay-skin='primary']
    .layui-checkbox-label
) {
  height: 20px;
  padding: 0;
}

.select-all {
  margin-bottom: 8px;
}

.member-list {
  flex: 1;
}

.member-item {
  @include flex(row, flex-start, center);
  padding: 8px 0;

  .user-avatar {
    margin-right: 12px;
  }

  .user-info {
    flex: 1;
    min-width: 0;

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: #4d4d4d;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-phone {
      font-size: 12px;
      color: #9a9a9a;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

// 聊天抽屉样式
.chat-content {
  height: 100%;
  @include flex(column);
  padding: 20px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 15px;
  background-color: #fafafa;

  .message-item {
    @include flex(row, flex-start, flex-start);
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }

    .message-avatar {
      margin-right: 10px;
      flex-shrink: 0;
    }

    .message-body {
      flex: 1;
      min-width: 0;

      .message-header {
        @include flex(row, space-between, center);
        margin-bottom: 5px;

        .message-user {
          font-size: 13px;
          font-weight: 500;
          color: var(--global-primary-color);
        }

        .message-time {
          font-size: 12px;
          color: #999;
        }
      }

      .message-content {
        font-size: 14px;
        color: #333;
        line-height: 1.4;
        word-wrap: break-word;
        background: white;
        padding: 8px 12px;
        border-radius: 8px;
        border: 1px solid #e8e8e8;
      }
    }
  }
}

.chat-input {
  flex-shrink: 0;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 15px;
  background: white;

  .input-actions {
    @include flex(row, flex-end, center);
    margin-top: 10px;
  }
}
</style>
