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
        <lay-checkbox-group v-model="selectedUsers">
          <div
            v-for="user in blackboardData?.users"
            :key="user.id || user.phone"
            class="member-item"
          >
            <lay-checkbox :value="user.id || user.phone" skin="primary" />

            <div class="user-avatar">
              <Avatar :url="user.avatar" :alt="user.name" size="2.5rem" />
            </div>

            <div class="dropdown">
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
    <template #footer>
      <div class="chat-comment">
        <div class="user-avatar">
          <Avatar
            :url="chatStore.userInfoData?.avatar"
            :alt="chatStore.userInfoData?.name"
            size="2rem"
          />
        </div>
        <div class="chat-input">
          <lay-textarea
            v-model="newMessage.content"
            :rows="1"
            :maxlength="500"
          />
        </div>
        <div class="input-actions">
          <lay-button type="primary" size="sm" @click="sendMessage">
            评论
          </lay-button>
        </div>
      </div>
    </template>
  </lay-layer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseCard from './BaseCard.vue';
import Avatar from '@/components/Avatar.vue';
import { useChatStore } from '@/stores/chat';
import type { WebSocketClient } from '@/utils/websocket';
import { createMemberChatWebSocket } from '@/websocket/memberChat';
import type { MemberChatRes } from '@/types/dashboard';
import { layer } from '@layui/layui-vue';
import { useFormatDate } from '@/composables/useFormatDate';
import topicApi from '@/api/topic/topicApi';
import { useDashboardStore } from '@/stores/dashboard';

const dashboardStore = useDashboardStore();

const blackboardData = computed(() => dashboardStore.blackboardData);
const selectedUsers = ref<(string | number)[]>([]);
const isSelectAll = ref(false);

// 留言相关
let wsClient: WebSocketClient;
const chatStore = useChatStore();
const showChatDrawer = ref(false);
const chatMessages = ref<MemberChatRes[]>([]);
const currentChatUser = ref<string>('');
const newMessage = ref({
  content: '',
  oid: 0 as number | string,
  type: 2,
  userids: [] as (number | string)[],
});
const userId = ref<string | number>();
const receptionUserid = ref();
userId.value = chatStore.userInfoData?.id;

// 使用时间格式化组合函数
const { parseDateTime } = useFormatDate();

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

// 点击留言
const handleClickChat = () => {
  if (selectedUsers.value.length === 0) {
    layer.msg('请先选择要留言的用户', { icon: 2 });
    return;
  }

  // 获取选中用户的姓名列表
  const selectedUserNames = selectedUsers.value.map((userId) => {
    const user = blackboardData.value?.users?.find(
      (user) => (user.id || user.phone) === userId,
    );
    return user?.name || '未知用户';
  });

  if (selectedUsers.value.length === 1) {
    // 只留言一个用户时
    // ws: /TopicServer/userId/receptionUserid/type
    /* addTopic: {
      content,
      type,
      oid: selectedUsers.value[0],
      userids: null,
    }*/
    receptionUserid.value = selectedUsers.value[0];
    // 接收留言用户id
    newMessage.value.oid = selectedUsers.value[0];
    newMessage.value.userids = []; // 单个用户时清空userids
    currentChatUser.value = selectedUserNames[0];
  } else {
    // 多个用户时
    // ws: /TopicServer/userId/0/type
    /* addTopic: {
      content,
      type,
      oid: 0,
      userids: selectedUsers.value;
    }*/
    newMessage.value.oid = 0;
    receptionUserid.value = 0;
    newMessage.value.userids = selectedUsers.value;
    // 多个用户时，标题显示所有用户名
    currentChatUser.value = selectedUserNames.join('、');
  }

  // 创建ws实例
  if (userId.value) {
    wsClient = createMemberChatWebSocket(
      userId.value,
      Number(receptionUserid.value),
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
  newMessage.value.content = '';
  console.log('关闭');
  // 关闭WebSocket连接
  if (wsClient) {
    wsClient.disconnect();
  }
};

// 发送消息
const sendMessage = async () => {
  if (!newMessage.value?.content) {
    layer.msg('请输入消息内容', { icon: 2 });
    return;
  }
  try {
    // 构造API请求数据，确保类型正确
    const apiData = {
      content: newMessage.value.content,
      oid: newMessage.value.oid,
      type: newMessage.value.type,
      userids: newMessage.value.userids.map((id) => Number(id)), // 统一转换为number类型
    };

    await topicApi.addTopic(apiData);
    layer.msg('评论成功', { icon: 1 });
    // 清空输入框
    newMessage.value.content = '';
  } catch (error) {
    layer.msg('评论失败, 请稍后重试。', { icon: 2 });
  }
};
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

  .dropdown {
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
.chat-messages {
  padding: 20px;
  border-radius: 8px;
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
        @include flex(row, flex-start, center);
        margin-bottom: 5px;

        .message-user {
          font-size: 12px;
          font-weight: 500;
          color: var(--global-primary-color);
          margin-right: 8px;
        }

        .message-time {
          font-size: 10px;
          color: #999;
        }
      }

      .message-content {
        font-size: 14px;
        color: #333;
        line-height: 1.4;
        word-wrap: break-word;
        padding: 8px 0px;
      }
    }
  }
}

.chat-comment {
  border-top: 1px solid #eaeaea;
  @include flex(row, space-between, center);
  padding: 20px;
  gap: 10px;
  .chat-input {
    flex: 1;
    flex-shrink: 0;
  }
}
</style>
