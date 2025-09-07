<template>
  <div class="header">
    <!-- 左侧区域 -->
    <div class="header-left">
      <!-- 品牌标题区域 -->
      <div class="brand-content">
        <div class="brand-info">
          <img
            src="@/assets/image/default/cover_logo.png"
            alt="Newbeall Logo"
            class="brand-logo-img"
          />
          <span class="brand-subtitle">-设计报价管理平台-</span>
        </div>
        <div class="header-actions">
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
      </div>
    </div>

    <!--通知栏-->
    <div ref="headerMiddleDOM" class="header-middle">
      <NoticeBar :textlist="noticeList" :width="noticeBarWidth" />
    </div>

    <!-- 右侧工具栏 -->
    <div class="header-right">
      <div class="toolbar">
        <!-- 常规屏幕显示的按钮 -->
        <div class="toolbar-normal">
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
        </div>

        <!-- 小屏幕显示的更多按钮 -->
        <div class="toolbar-mobile">
          <lay-tooltip placement="left">
            <lay-dropdown>
              <lay-button class="toolbar-btn">
                <lay-icon size="20px" type="layui-icon-more" />
              </lay-button>
              <template #content>
                <lay-dropdown-menu>
                  <lay-dropdown-menu-item @click="inviteFriends">
                    <lay-icon type="layui-icon-user" />
                    <span style="margin-left: 8px">邀请好友</span>
                  </lay-dropdown-menu-item>
                  <lay-dropdown-menu-item @click="userSuggestion">
                    <lay-icon type="layui-icon-survey" />
                    <span style="margin-left: 8px">用户建议</span>
                  </lay-dropdown-menu-item>
                  <lay-dropdown-menu-item @click="wechatPublic">
                    <lay-icon type="layui-icon-cellphone" />
                    <span style="margin-left: 8px">微信公众号</span>
                  </lay-dropdown-menu-item>
                  <lay-dropdown-menu-item @click="notepad">
                    <lay-icon type="layui-icon-note" />
                    <span style="margin-left: 8px">便签</span>
                  </lay-dropdown-menu-item>
                  <lay-dropdown-menu-item>
                    <lay-icon type="layui-icon-notice" />
                    <span style="margin-left: 8px">消息通知</span>
                    <lay-badge :count="messageCount" style="margin-left: 8px" />
                  </lay-dropdown-menu-item>
                  <lay-dropdown-menu-item @click="toggleTheme">
                    <lay-icon
                      :type="
                        isDarkTheme ? 'layui-icon-moon' : 'layui-icon-light'
                      "
                    />
                    <span style="margin-left: 8px">主题切换</span>
                  </lay-dropdown-menu-item>
                  <lay-dropdown-menu-item @click="toggleFullscreen">
                    <lay-icon type="layui-icon-screen-full" />
                    <span style="margin-left: 8px">全屏</span>
                  </lay-dropdown-menu-item>
                </lay-dropdown-menu>
              </template>
            </lay-dropdown>
          </lay-tooltip>
        </div>

        <!-- 用户头像和菜单 - 始终显示 -->
        <div class="user-dropdown">
          <lay-dropdown>
            <div class="dropdown">
              <lay-avatar :src="defaultAvatar" radius size="sm" />
              <span class="dropdown-display-name">管理员</span>
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
  </div>
  <!-- 用户建议组件 -->
  <FeedbackPanel v-model:visible="showFeedbackPanel" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import NoticeBar from '@/components/NoticeBar.vue';
import FeedbackPanel from '@/components/FeedbackPanel.vue';
import defaultAvatar from '@/assets/image/default/defaultAvatar.png';
import { debounce } from '@/utils/debounce';

const router = useRouter();

// 定义 emit
const emit = defineEmits<{
  'toggle-sidebar': [collapsed: boolean];
}>();
// 通知
const noticeList = ref([
  '1111111111111111111111111111111111111111111111',
  '2',
  '3',
  '4',
]);
// 通知栏宽度
const noticeBarWidth = ref(200);
const headerMiddleDOM = ref<HTMLElement>();

// 计算通知栏宽度函数 - 获取header-middle元素的实际宽度
const calculateNoticeBarWidth = () => {
  // 获取header-middle元素
  const headerMiddleElement = headerMiddleDOM.value;

  // 如果元素存在，则设置通知栏宽度为元素宽度减去10px
  if (headerMiddleElement) {
    const headerMiddleWidth = headerMiddleElement.offsetWidth;
    noticeBarWidth.value = Math.max(headerMiddleWidth - 80, 0);
  } else {
    // 如果元素不存在，设置一个默认宽度
    noticeBarWidth.value = 200;
  }
};

// 使用防抖函数包装计算宽度函数
const debouncedCalculateWidth = debounce(calculateNoticeBarWidth, 300);
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

// 组件挂载时计算初始宽度并添加事件监听器
onMounted(() => {
  calculateNoticeBarWidth();
  window.addEventListener('resize', debouncedCalculateWidth);
});

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', debouncedCalculateWidth);
});
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1.5;

    .brand-content {
      display: flex;
      align-items: center;
      margin-right: 16px;
      padding-right: 16px;

      .brand-info {
        text-align: center;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .brand-logo-img {
          max-height: 30px;
          max-width: 150px;
          width: auto;
          height: auto;
          object-fit: contain;
          margin-bottom: 4px;
        }

        .brand-subtitle {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.8);
        }
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 16px;

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
    }
  }

  .header-middle {
    display: flex;
    align-items: center;
    margin-right: 20px;
    flex: 3;
  }

  .header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 3;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 12px;

    // 常规屏幕显示的工具栏
    .toolbar-normal {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    // 小屏幕显示的工具栏
    .toolbar-mobile {
      display: none;
    }

    .toolbar-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      border: none;
      border-radius: $border-radius-large;
      background-color: rgba(27, 27, 27, 0.3);
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background-color: rgb(255, 255, 255);
        color: $primary-color;
        transform: translateY(-1px);
      }

      .layui-icon {
        font-size: 16px;
      }
    }

    .dropdown {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      margin-left: 8px;
      min-width: 124px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.9);

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
      }

      .dropdown-display-name {
        font-size: 14px;
        font-weight: 500;
      }

      .layui-icon {
        font-size: 12px;
        opacity: 0.7;
      }
    }

    // 用户下拉菜单始终显示
    .user-dropdown {
      display: block;
    }
  }
}

// 响应式设计 - 中大屏幕
@media (max-width: $desktop_layout_breakpoint) {
  .header {
    padding: 0 15px;

    .header-left {
      flex: 1;
    }

    .header-middle {
      flex: 2;
    }

    .header-right {
      flex: 2;
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

    .dropdown {
      padding: 4px 10px;

      .dropdown-display-name {
        font-size: 13px;
      }
    }
  }
}

// 响应式设计 - 小屏幕
@media (max-width: $pad_layout_breakpoint) {
  .header {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;

    .header-left {
      gap: 8px;
    }

    .toolbar {
      gap: 6px;

      // 在小屏幕上隐藏常规工具栏
      .toolbar-normal {
        display: none;
      }

      // 在小屏幕上显示更多按钮
      .toolbar-mobile {
        display: block;
      }

      .toolbar-btn {
        width: 28px;

        .layui-icon {
          font-size: 13px;
        }
      }

      .dropdown {
        padding: 4px 8px;

        .dropdown-display-name {
          display: none;
        }
      }
    }

    .header-middle {
      width: 0;
    }
  }
}
</style>
