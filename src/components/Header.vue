<template>
  <div class="header">
    <!-- 左侧区域 -->
    <div class="header-left">
      <div class="collapse-btn" @click="toggleSidebar">
        <lay-icon
          :type="
            sidebarCollapsed
              ? 'layui-icon-spread-left'
              : 'layui-icon-shrink-right'
          "
        />
      </div>
      <!-- 刷新按钮 -->
      <div class="collapse-btn" @click="refreshPage">
        <lay-icon type="layui-icon-refresh" />
      </div>
    </div>

    <!-- 右侧工具栏 -->
    <div class="header-right">
      <div class="toolbar">
        <!-- 邀请好友 -->
        <lay-tooltip content="邀请好友">
          <lay-button class="toolbar-btn" @click="inviteFriends">
            <lay-icon type="layui-icon-user" />
          </lay-button>
        </lay-tooltip>

        <!-- 用户建议 -->
        <lay-tooltip content="用户建议">
          <lay-button class="toolbar-btn" @click="userSuggestion">
            <lay-icon type="layui-icon-survey" />
          </lay-button>
        </lay-tooltip>

        <!-- 微信公众号 -->
        <lay-tooltip content="微信公众号">
          <lay-button class="toolbar-btn" @click="wechatPublic">
            <lay-icon type="layui-icon-cellphone" />
          </lay-button>
        </lay-tooltip>

        <!-- 便签 -->
        <lay-tooltip content="便签">
          <lay-button class="toolbar-btn" @click="notepad">
            <lay-icon type="layui-icon-note" />
          </lay-button>
        </lay-tooltip>

        <!-- 消息通知 -->
        <lay-dropdown>
          <lay-button class="toolbar-btn">
            <lay-badge :count="messageCount" dot>
              <lay-icon type="layui-icon-notice" />
            </lay-badge>
          </lay-button>
          <template #content>
            <lay-dropdown-menu>
              <lay-dropdown-menu-item>系统通知 (3)</lay-dropdown-menu-item>
              <lay-dropdown-menu-item>待办事项 (2)</lay-dropdown-menu-item>
              <lay-dropdown-menu-item>查看全部</lay-dropdown-menu-item>
            </lay-dropdown-menu>
          </template>
        </lay-dropdown>

        <!-- 主题切换 -->
        <lay-tooltip content="主题">
          <lay-button class="toolbar-btn" @click="toggleTheme">
            <lay-icon
              :type="isDarkTheme ? 'layui-icon-moon' : 'layui-icon-light'"
            />
          </lay-button>
        </lay-tooltip>

        <!-- 全屏按钮 -->
        <lay-tooltip content="全屏">
          <lay-button class="toolbar-btn" @click="toggleFullscreen">
            <lay-icon type="layui-icon-screen-full" />
          </lay-button>
        </lay-tooltip>

        <!-- 用户头像和菜单 -->
        <lay-dropdown>
          <div class="user-info">
            <lay-avatar :src="defaultAvatar" radius size="sm" />
            <span class="username">管理员</span>
            <lay-icon type="layui-icon-down" />
          </div>
          <template #content>
            <lay-dropdown-menu>
              <lay-dropdown-menu-item @click="viewProfile">
                个人中心
              </lay-dropdown-menu-item>
              <lay-dropdown-menu-item @click="changePassword">
                修改密码
              </lay-dropdown-menu-item>
              <lay-dropdown-menu-item divided @click="logout">
                退出登录
              </lay-dropdown-menu-item>
            </lay-dropdown-menu>
          </template>
        </lay-dropdown>
      </div>
    </div>
  </div>
  <!-- 用户建议组件 -->
  <FeedbackPanel v-model:visible="showFeedbackPanel" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FeedbackPanel from '@/components/FeedbackPanel.vue';
import defaultAvatar from '@/assets/image/default/defaultAvatar.png';

const router = useRouter();

// 定义 emit
const emit = defineEmits<{
  'toggle-sidebar': [collapsed: boolean];
}>();

// 添加侧边栏折叠状态
const sidebarCollapsed = ref(false);
// 消息数量
const messageCount = ref(5);
// 主题状态
const isDarkTheme = ref(false);

const showFeedbackPanel = ref(false);

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  emit('toggle-sidebar', sidebarCollapsed.value);
};

// 刷新页面
const refreshPage = () => {
  window.location.reload();
};

// 邀请好友
const inviteFriends = () => {
  console.log('邀请好友');
  // 这里可以打开邀请好友的对话框或页面
};

// 用户建议
const userSuggestion = () => {
  console.log('用户建议');
  showFeedbackPanel.value = true;
};

// 微信公众号
const wechatPublic = () => {
  console.log('微信公众号');
  // 这里可以显示二维码或跳转到公众号
};

// 便签
const notepad = () => {
  console.log('便签');
  // 这里可以打开便签功能
};

// 主题切换
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  console.log('切换主题:', isDarkTheme.value ? '深色' : '浅色');
  // 这里可以实现主题切换逻辑
};

// 全屏切换
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

// 查看个人资料
const viewProfile = () => {
  console.log('查看个人资料');
};

// 修改密码
const changePassword = () => {
  console.log('修改密码');
};

// 退出登录
const logout = () => {
  console.log('退出登录');
  router.push('/default');
};
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/image/default/background.png');
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .collapse-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
      }

      .layui-icon {
        font-size: 16px;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 12px;

    .toolbar-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.3s ease;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
        transform: translateY(-1px);
      }

      .layui-icon {
        font-size: 16px;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.9);

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
      }

      .username {
        font-size: 14px;
        font-weight: 500;
      }

      .layui-icon {
        font-size: 12px;
        opacity: 0.7;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .header {
    padding: 0 10px;

    .header-left {
      gap: 8px;

      .header-title {
        .title-text {
          font-size: 16px;
        }

        .subtitle {
          font-size: 10px;
        }
      }
    }

    .toolbar {
      gap: 8px;

      .toolbar-btn {
        width: 32px;
        height: 32px;

        .layui-icon {
          font-size: 14px;
        }
      }

      .user-info {
        padding: 4px 8px;

        .username {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
