<template>
  <div class="header">
    <!-- 左侧区域 -->
    <div class="header-left">
      <!-- 品牌标题区域 -->
      <div class="brand-content" @click="router.push('/')">
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
      <NoticeBar :textlist="companyNoticeList" :width="noticeBarWidth[0]" />
      <NoticeBar :textlist="productNoticeList" :width="noticeBarWidth[1]" />
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
          <lay-tooltip content="消息">
            <lay-button class="toolbar-btn" @click="openNotice">
              <lay-icon type="layui-icon-notice" />
            </lay-button>
          </lay-tooltip>

          <!-- 签到 -->
          <lay-tooltip content="签到">
            <lay-button class="toolbar-btn" @click="checkout">
              <lay-icon type="layui-icon-gift" />
            </lay-button>
          </lay-tooltip>

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
                <lay-dropdown-menu-item @click="openUserCenter">
                  个人中心
                </lay-dropdown-menu-item>
                <!--                <lay-dropdown-menu-item @click="changePassword">-->
                <!--                  修改密码-->
                <!--                </lay-dropdown-menu-item>-->
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
  <feedback-panel v-model:visible="showFeedbackPanel" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { layer } from '@layui/layui-vue';
import NoticeBar from '@/components/NoticeBar.vue';
import FeedbackPanel from '@/components/FeedbackPanel.vue';
import defaultAvatar from '@/assets/image/default/defaultAvatar.png';
import { debounce } from '@/utils/debounce';
import Notify from '@/utils/notify.ts';
import headerApi from '@/api/header/headerApi.ts';
import { RouteNavigator } from '@/utils/routeUtils.ts';
import { useTabsStore } from '@stores/tabs.ts';

const tabsStore = useTabsStore();
const router = useRouter();
const routeNavigator = new RouteNavigator(router, tabsStore);

const emit = defineEmits<{
  'toggle-sidebar': [collapsed: boolean];
}>();

// 两个通知栏的内容列表
const companyNoticeList = ref(['加载中...']);
const productNoticeList = ref(['加载中...']);
// 通知栏宽度数组 - [左侧宽度, 右侧宽度]
const noticeBarWidth = ref([700, 300]);
const headerMiddleDOM = ref<HTMLElement>();
const wechatAccountURL = ref<string | null>();
// 屏幕宽度响应式变量
const screenWidth = ref(window.innerWidth);
// 定义最大和最小宽度
const MAX_WIDTHS = [700, 300]; // 最大宽度[左侧, 右侧]
const MIN_WIDTHS = [200, 100]; // 最小宽度[左侧, 右侧]

// 计算通知栏宽度函数 - 实现线性下降的宽度调整逻辑
const calculateNoticeBarWidth = () => {
  // 获取header-middle元素
  const headerMiddleElement = headerMiddleDOM.value;

  // 如果元素存在
  if (headerMiddleElement) {
    // 获取当前屏幕宽度
    const currentScreenWidth = screenWidth.value;

    // 定义宽度变化的临界点
    const MAX_SCREEN_WIDTH = 1600; // 最大屏幕宽度
    const MIN_SCREEN_WIDTH = 1200; // 最小屏幕宽度（低于此值不显示通知栏）

    // 计算宽度比例因子（线性下降）
    const widthFactor =
      currentScreenWidth < MIN_SCREEN_WIDTH
        ? 0
        : currentScreenWidth > MAX_SCREEN_WIDTH
          ? 1
          : (currentScreenWidth - MIN_SCREEN_WIDTH) /
            (MAX_SCREEN_WIDTH - MIN_SCREEN_WIDTH);

    // 计算整体header-middle的宽度（线性下降）
    const headerMiddleWidth = Math.floor(800 * widthFactor); // 最大800px
    headerMiddleElement.style.width = `${headerMiddleWidth}px`;

    // 计算两个通知栏的宽度（线性下降）
    const firstBarWidth = Math.floor(
      MIN_WIDTHS[0] + (MAX_WIDTHS[0] - MIN_WIDTHS[0]) * widthFactor,
    );
    const secondBarWidth = Math.floor(
      MIN_WIDTHS[1] + (MAX_WIDTHS[1] - MIN_WIDTHS[1]) * widthFactor,
    );

    noticeBarWidth.value = [firstBarWidth, secondBarWidth];
  } else {
    // 如果元素不存在，设置默认宽度
    noticeBarWidth.value = [300, 150];
  }
};

// 使用防抖函数包装处理函数
const debouncedHandleResize = debounce(calculateNoticeBarWidth, 300);
// 添加侧边栏折叠状态
const sidebarCollapsed = ref(false);
// 消息数量
const messageCount = ref(5);
// 主题状态
const isDarkTheme = ref(false);
// 展示用户建议弹窗
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
  routeNavigator.navigateTo('/invite');
};

// 用户建议
const userSuggestion = () => {
  showFeedbackPanel.value = true;
};

// 微信公众号
const wechatPublic = async () => {
  try {
    wechatAccountURL.value = await headerApi.getWechatAccount();
    layer.open({
      title: '壹新微信公众号',
      isHtmlFragment: true,
      content: `<img src="${wechatAccountURL.value}" alt="图片"></img>`,
    });
  } catch (err) {
    Notify.error('获取失败，请稍后重试！');
    console.error(err);
  }
};

// 便签
const notepad = () => {
  console.log('便签');
  // 这里可以打开便签功能
};

// 打开消息通知
const openNotice = () => {
  routeNavigator.navigateTo('/notice');
};

// 打开个人中心
const openUserCenter = () => {
  routeNavigator.navigateTo('/user');
};

// 签到
const checkout = async () => {
  try {
    const res = await headerApi.checkout();
    if (res.msg) {
      Notify.success(res.msg);
    } else {
      console.error('收到响应：' + res);
      Notify.error('签到失败，请稍后再试！');
    }
  } catch (err) {
    console.error('签到异常：', err);
    Notify.error('签到失败，请稍后再试！');
  }
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

// 修改密码
const changePassword = () => {
  console.log('修改密码');
};

// 退出登录
const logout = () => {
  console.log('退出登录');
  router.push('/default');
};

// 获取通知栏内容的方法
const fetchNoticeBarContent = async () => {
  try {
    const res = await headerApi.getNoticeList();

    // 检查数据结构是否符合预期
    if (res && res.data) {
      const { companyList = [], productList = [] } = res.data;

      // 从companyList中提取name字段到companyNoticeList
      if (Array.isArray(companyList)) {
        companyNoticeList.value = companyList
          .filter((item) => item && item.name)
          .map((item) => item.name) || ['暂无公司通知'];
      } else {
        companyNoticeList.value = ['暂无公司通知'];
      }

      // 从productList中提取name字段到productNoticeList
      if (Array.isArray(productList)) {
        productNoticeList.value = productList
          .filter((item) => item && item.name)
          .map((item) => item.name) || ['暂无产品通知'];
      } else {
        productNoticeList.value = ['暂无产品通知'];
      }

      console.log('公司通知列表:', companyNoticeList.value);
      console.log('产品通知列表:', productNoticeList.value);
    }
  } catch (err) {
    console.error('获取通知栏内容异常：', err);
    companyNoticeList.value = ['获取通知失败，请稍后刷新'];
    productNoticeList.value = ['获取通知失败，请稍后刷新'];
  }
};

// 组件挂载时计算初始宽度并添加事件监听器
onMounted(async () => {
  calculateNoticeBarWidth();
  window.addEventListener('resize', () => {
    screenWidth.value = window.innerWidth;
  });
  window.addEventListener('resize', debouncedHandleResize);

  // 调用获取通知栏内容的方法
  await fetchNoticeBarContent();
});

// 添加屏幕宽度变化的watch监听器
watch(screenWidth, (newWidth) => {
  // 当屏幕宽度低于1200px时，隐藏通知栏
  if (headerMiddleDOM.value) {
    if (newWidth < 1200) {
      headerMiddleDOM.value.style.display = 'none';
    } else {
      headerMiddleDOM.value.style.display = 'flex';
    }
  }
  // 触发宽度计算
  calculateNoticeBarWidth();
});

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', debouncedHandleResize);
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
      padding: 5px 16px 0 0;

      &:hover {
        cursor: pointer;
      }

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
    flex: 0 1 auto;
  }

  .header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1 0 auto;
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
      display: none;
    }

    .header-right {
      flex: 1;
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

// 响应式设计 - 平板和小屏幕
@media (max-width: $pad_layout_breakpoint) {
  .header {
    .header-middle {
      display: none !important;
    }
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
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 0;
    }

    .header-middle > :first-child {
      display: none;
    }

    .header-middle > :last-child {
      width: 100%;
      min-width: 200px;
    }
  }
}
</style>
