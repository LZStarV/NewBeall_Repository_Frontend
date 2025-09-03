<template>
  <div class="sidebar-container" :class="{ collapsed }">
    <!-- 品牌标题区域 -->
    <div class="brand-header">
      <div class="brand-content">
        <div v-show="!collapsed" class="brand-info">
          <img
            src="@/assets/image/default/cover_logo.png"
            alt="Newbeall Logo"
            class="brand-logo-img"
          />
          <span class="brand-subtitle">-设计报价管理平台-</span>
        </div>
        <div v-show="collapsed" class="brand-logo">
          <img
            src="@/assets/image/default/cover_logo.png"
            alt="Newbeall Logo"
            class="logo-img-collapsed"
          />
        </div>
      </div>
    </div>

    <!-- 侧边栏菜单 -->
    <div class="sidebar-menu">
      <!-- 用户信息盒子 -->
      <div class="user-info-box">
        <div class="user-avatar">
          <lay-avatar
            :src="defaultAvatar"
            radius
            :style="
              collapsed
                ? 'width: 30px; height: 30px'
                : 'width: 50px; height: 50px'
            "
          />
        </div>
        <div v-show="!collapsed" class="user-details">
          <div class="username">张三</div>
          <div class="user-role">产品供应商</div>
        </div>
      </div>

      <!-- 菜单列表 - 可滚动区域 -->
      <div class="menu-list-container">
        <div class="menu-list">
          <template v-for="menuItem in menuStructure" :key="menuItem.key">
            <!-- 单级菜单 -->
            <div
              v-if="!menuItem.hasSubmenu"
              class="menu-item"
              :class="{ active: selectedKey === menuItem.key }"
              @click="navigateTo(getRouteConfig(menuItem.key).path)"
            >
              <!-- 只在折叠状态下显示图标 -->
              <lay-icon
                v-if="collapsed && getRouteConfig(menuItem.key).icon"
                :type="getRouteConfig(menuItem.key).icon"
                class="menu-icon"
              />
              <span v-show="!collapsed" class="menu-text">{{
                getRouteConfig(menuItem.key).title
              }}</span>
              <!-- 新订单提示（仅订单审批记录显示） -->
              <div
                v-show="
                  !collapsed &&
                  menuItem.key === 'order-approval' &&
                  hasNewOrders
                "
                class="notification-badge"
              >
                1
              </div>
            </div>

            <!-- 多级菜单 -->
            <div v-else class="menu-group">
              <div
                class="menu-item submenu-title"
                @click="toggleSubmenu(menuItem.key)"
              >
                <!-- 只在折叠状态下显示图标 -->
                <lay-icon
                  v-if="collapsed && getRouteConfig(menuItem.key).icon"
                  :type="getRouteConfig(menuItem.key).icon"
                  class="menu-icon"
                />
                <span v-show="!collapsed" class="menu-text">{{
                  getRouteConfig(menuItem.key).title
                }}</span>
                <!-- 新订单提示（仅订单审批记录显示） -->
                <div
                  v-show="
                    !collapsed &&
                    menuItem.key === 'order-approval' &&
                    hasNewOrders
                  "
                  class="notification-badge"
                >
                  1
                </div>
                <lay-icon
                  v-show="!collapsed"
                  type="layui-icon-right"
                  class="arrow-icon"
                  :class="{
                    expanded: submenuOpen[getSubmenuKey(menuItem.key)],
                  }"
                />
              </div>
              <div
                v-show="!collapsed && submenuOpen[getSubmenuKey(menuItem.key)]"
                class="submenu"
              >
                <div
                  v-for="subItemKey in menuItem.submenuItems"
                  :key="subItemKey"
                  class="menu-item submenu-item"
                  :class="{ active: selectedKey === subItemKey }"
                  @click="navigateTo(getRouteConfig(subItemKey).path)"
                >
                  <span class="menu-text">{{
                    getRouteConfig(subItemKey).title
                  }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTabsStore } from '@/stores/tabs';
import {
  ROUTE_CONFIG_MAP,
  MENU_STRUCTURE,
  getRouteKeyByPath,
  type RouteConfig,
} from '@/utils/routeConfig';
import { RouteNavigator } from '@/utils/routeUtils';
import defaultAvatar from '@/assets/image/default/defaultAvatar.png';

// 接收来自父组件的折叠状态
const props = defineProps<{
  collapsed: boolean;
}>();

const router = useRouter();
const route = useRoute();
const tabsStore = useTabsStore();
const routeNavigator = new RouteNavigator(router, tabsStore);

const hasNewOrders = ref(true); // 是否有新订单需要审批

// 当前选中的菜单key
const selectedKey = computed(() => {
  return getRouteKeyByPath(route.path) || 'cloud-space';
});

// 菜单结构
const menuStructure = MENU_STRUCTURE;

// 子菜单展开状态映射 - 添加缺少的映射
const submenuKeyMap: Record<string, string> = {
  'cloud-space': 'cloudSpace',
  'demand-management': 'demandManagement',
  'supply-chain': 'supplyChain',
  'design-quote': 'designQuote',
  'order-approval': 'orderApproval',
  'quote-approval': 'quoteApproval',
  'system-settings': 'systemSettings',
};

// 子菜单展开状态 - 添加缺少的状态
const submenuOpen = reactive<Record<string, boolean>>({
  cloudSpace: false,
  demandManagement: false,
  supplyChain: false,
  designQuote: false,
  orderApproval: false,
  quoteApproval: false,
  systemSettings: false,
});

// 获取路由配置
const getRouteConfig = (key: string): RouteConfig => {
  return ROUTE_CONFIG_MAP[key];
};

// 获取子菜单key
const getSubmenuKey = (menuKey: string): string => {
  return submenuKeyMap[menuKey] || menuKey;
};

// 切换子菜单 - 修改为互斥展开
const toggleSubmenu = (menuKey: string) => {
  if (props.collapsed) return;

  const submenuKey = getSubmenuKey(menuKey) as keyof typeof submenuOpen;

  if (submenuKey && submenuKey in submenuOpen) {
    // 如果当前菜单已经展开，则收起它
    if (submenuOpen[submenuKey]) {
      submenuOpen[submenuKey] = false;
    } else {
      // 先收起所有子菜单
      Object.keys(submenuOpen).forEach((k) => {
        submenuOpen[k as keyof typeof submenuOpen] = false;
      });
      // 然后展开当前菜单
      submenuOpen[submenuKey] = true;
    }
  }
};

// 导航到指定路由
const navigateTo = (path: string) => {
  // 特殊处理会员续费，在新标签页打开
  if (path === '/member/renewal') {
    window.open('/member-standalone', '_blank');
    return;
  }
  routeNavigator.navigateTo(path);
};
</script>

<style scoped lang="scss">
.sidebar-container {
  height: 100%;
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow: hidden; // 防止整个侧边栏滚动
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;

  &.collapsed {
    .menu-item {
      justify-content: center;
      padding: 12px 0;

      .menu-icon {
        margin: 0;
        font-size: 18px;
      }
    }

    .submenu-title .arrow-icon,
    .notification-badge {
      display: none;
    }
  }
}

// 品牌标题区域样式
.brand-header {
  background-image: url('@/assets/image/default/background.png');
  height: 80px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; // 防止被压缩

  .brand-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

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
        opacity: 0.8;
        display: block;
        letter-spacing: 0.5px;
        white-space: nowrap;
      }
    }

    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .logo-img-collapsed {
        width: 32px;
        height: 32px;
        object-fit: contain;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        padding: 4px;
      }
    }
  }
}

.sidebar-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; // 防止整个菜单区域滚动
  min-height: 0; // 确保flex子项能正确收缩
}

// 用户信息盒子样式
.user-info-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  height: 8rem;
  border-bottom: 1px solid #f0f0f0;
  background-image: url('@/assets/image/default/avatarBackground.png');
  flex-shrink: 0; // 防止被压缩

  .user-avatar {
    flex-shrink: 0;
  }

  .user-details {
    min-width: 0;
    margin: 5px;
    text-align: center;

    .username {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.4;
      color: #fff;
      margin-bottom: 5px;
    }

    .user-role {
      font-size: 12px;
      opacity: 0.6;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #fff;
    }
  }
}

// 菜单列表容器 - 可滚动区域
.menu-list-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0; // 确保能正确收缩

  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    transition: background 0.3s ease;

    &:hover {
      background: #a1a1a1;
    }
  }

  // 滚动条隐藏在折叠状态
  .sidebar-container.collapsed & {
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}

.menu-list {
  padding: 8px 0;
  min-height: 100%; // 确保内容至少填满容器
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
  font-size: 14px;
  position: relative;

  .menu-icon {
    font-size: 16px;
    color: #666;
    margin-right: 12px;
    min-width: 16px;
    transition: color 0.3s ease;
  }

  .menu-text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .arrow-icon {
    font-size: 12px;
    color: #999;
    transition: all 0.3s ease;
    margin-left: auto;
    transform-origin: center;

    // 默认状态：向左箭头
    &.layui-icon-right {
      transform: rotate(180deg);
    }

    // 展开状态：向下箭头
    &.expanded {
      transform: rotate(90deg);
    }
  }

  .notification-badge {
    background: #ff4d4f;
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 8px;
    margin-right: 8px;
    min-width: 16px;
    text-align: center;
    line-height: 1.2;
  }

  &:hover {
    background-color: #f5f7fa;

    .menu-icon {
      color: #409eff;
    }

    .arrow-icon {
      color: #409eff;
    }
  }

  &.active {
    background-color: #e6f7ff;
    color: #409eff;
    border-right: 3px solid #409eff;

    .menu-icon {
      color: #409eff;
    }
  }

  &.submenu-title {
    font-weight: 500;
  }

  // 子菜单项样式
  &.submenu-item {
    padding-left: 52px; // 增加左边距，显示层级关系
    font-size: 13px;

    .menu-icon {
      font-size: 14px;
    }
  }
}

.submenu {
  background-color: #f8f9fa;
}

// 折叠状态下的特殊样式
.sidebar-container.collapsed {
  .user-info-box {
    justify-content: center;
    padding: 20px 0;

    .user-avatar {
      margin-right: 0;
    }
  }

  .menu-item {
    padding: 12px 0;
    justify-content: center;

    .menu-icon {
      margin-right: 0;
      font-size: 18px;
    }
  }
}

// 响应式设计
@media (max-height: 600px) {
  .brand-header {
    height: 60px;
    padding: 15px;
  }

  .user-info-box {
    padding: 15px;
  }

  .menu-item {
    padding: 10px 20px;
    font-size: 13px;

    &.submenu-item {
      padding-left: 45px;
    }
  }
}
</style>
