<template>
    <div class="sidebar-container" :class="{ collapsed }">
        <!-- 侧边栏菜单 -->
        <div class="sidebar-menu">
            <!-- 用户信息盒子 -->
            <div class="user-info-box">
                <div class="user-avatar">
                    <lay-avatar src="https://portrait.gitee.com/uploads/avatars/user/1611/4834751_Jmysy_1578975358.png"
                        :size="collapsed ? 'sm' : 'md'" />
                </div>
                <div v-show="!collapsed" class="user-details">
                    <div class="username">管理员</div>
                    <div class="user-role">系统管理员</div>
                </div>
            </div>

            <!-- 菜单列表 -->
            <div class="menu-list">
                <!-- 工作台 -->
                <div class="menu-item" :class="{ active: selectedKey === 'dashboard' }"
                    @click="navigateTo('/dashboard')">
                    <lay-icon type="layui-icon-home" class="menu-icon" />
                    <span v-show="!collapsed" class="menu-text">工作台</span>
                </div>

                <!-- 系统管理 -->
                <div class="menu-group">
                    <div class="menu-item submenu-title" @click="toggleSubmenu('system')">
                        <lay-icon type="layui-icon-set" class="menu-icon" />
                        <span v-show="!collapsed" class="menu-text">系统管理</span>
                        <lay-icon v-show="!collapsed && submenuOpen.system" type="layui-icon-up" class="arrow-icon" />
                        <lay-icon v-show="!collapsed && !submenuOpen.system" type="layui-icon-down"
                            class="arrow-icon" />
                    </div>
                    <div v-show="!collapsed && submenuOpen.system" class="submenu">
                        <div class="menu-item submenu-item" :class="{ active: selectedKey === 'user' }"
                            @click="navigateTo('/system/user')">
                            <lay-icon type="layui-icon-user" class="menu-icon" />
                            <span class="menu-text">用户管理</span>
                        </div>
                        <div class="menu-item submenu-item" :class="{ active: selectedKey === 'role' }"
                            @click="navigateTo('/system/role')">
                            <lay-icon type="layui-icon-group" class="menu-icon" />
                            <span class="menu-text">角色管理</span>
                        </div>
                        <div class="menu-item submenu-item" :class="{ active: selectedKey === 'menu' }"
                            @click="navigateTo('/system/menu')">
                            <lay-icon type="layui-icon-layouts" class="menu-icon" />
                            <span class="menu-text">菜单管理</span>
                        </div>
                    </div>
                </div>

                <!-- 业务管理 -->
                <div class="menu-group">
                    <div class="menu-item submenu-title" @click="toggleSubmenu('business')">
                        <lay-icon type="layui-icon-template" class="menu-icon" />
                        <span v-show="!collapsed" class="menu-text">业务管理</span>
                        <lay-icon v-show="!collapsed && submenuOpen.business" type="layui-icon-up" class="arrow-icon" />
                        <lay-icon v-show="!collapsed && !submenuOpen.business" type="layui-icon-down"
                            class="arrow-icon" />
                    </div>
                    <div v-show="!collapsed && submenuOpen.business" class="submenu">
                        <div class="menu-item submenu-item" :class="{ active: selectedKey === 'project' }"
                            @click="navigateTo('/business/project')">
                            <lay-icon type="layui-icon-file" class="menu-icon" />
                            <span class="menu-text">项目管理</span>
                        </div>
                        <div class="menu-item submenu-item" :class="{ active: selectedKey === 'quote' }"
                            @click="navigateTo('/business/quote')">
                            <lay-icon type="layui-icon-dollar" class="menu-icon" />
                            <span class="menu-text">报价管理</span>
                        </div>
                        <div class="menu-item submenu-item" :class="{ active: selectedKey === 'customer' }"
                            @click="navigateTo('/business/customer')">
                            <lay-icon type="layui-icon-friends" class="menu-icon" />
                            <span class="menu-text">客户管理</span>
                        </div>
                    </div>
                </div>

                <!-- 数据分析 -->
                <div class="menu-group">
                    <div class="menu-item submenu-title" @click="toggleSubmenu('analytics')">
                        <lay-icon type="layui-icon-chart" class="menu-icon" />
                        <span v-show="!collapsed" class="menu-text">数据分析</span>
                        <lay-icon v-show="!collapsed && submenuOpen.analytics" type="layui-icon-up"
                            class="arrow-icon" />
                        <lay-icon v-show="!collapsed && !submenuOpen.analytics" type="layui-icon-down"
                            class="arrow-icon" />
                    </div>
                    <div v-show="!collapsed && submenuOpen.analytics" class="submenu">
                        <div class="menu-item submenu-item" :class="{ active: selectedKey === 'dashboard' }"
                            @click="navigateTo('/analytics/dashboard')">
                            <lay-icon type="layui-icon-chart-screen" class="menu-icon" />
                            <span class="menu-text">数据看板</span>
                        </div>
                        <div class="menu-item submenu-item" :class="{ active: selectedKey === 'reports' }"
                            @click="navigateTo('/analytics/reports')">
                            <lay-icon type="layui-icon-table" class="menu-icon" />
                            <span class="menu-text">报表管理</span>
                        </div>
                    </div>
                </div>

                <!-- 系统设置 -->
                <div class="menu-item" :class="{ active: selectedKey === 'settings' }" @click="navigateTo('/settings')">
                    <lay-icon type="layui-icon-set-sm" class="menu-icon" />
                    <span v-show="!collapsed" class="menu-text">系统设置</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useTabsStore } from '@/stores/tabs';

// 接收来自父组件的折叠状态
const props = defineProps<{
    collapsed: boolean
}>();

const router = useRouter();
const tabsStore = useTabsStore();
const selectedKey = ref('dashboard');

// 子菜单展开状态
const submenuOpen = reactive({
    system: false,
    business: false,
    analytics: false
});

// 切换子菜单
const toggleSubmenu = (menuKey: string) => {
    if (props.collapsed) return; // 使用props中的collapsed状态

    submenuOpen[menuKey] = !submenuOpen[menuKey];
};

// 导航到指定路由
const navigateTo = (path: string) => {
    // 设置选中状态
    const pathMap: Record<string, string> = {
        '/dashboard': 'dashboard',
        '/system/user': 'user',
        '/system/role': 'role',
        '/system/menu': 'menu',
        '/business/project': 'project',
        '/business/quote': 'quote',
        '/business/customer': 'customer',
        '/analytics/dashboard': 'analytics-dashboard',
        '/analytics/reports': 'reports',
        '/settings': 'settings',
    };
    selectedKey.value = pathMap[path] || 'dashboard';

    // 添加标签页
    const menuMap: Record<string, { title: string; icon: string }> = {
        '/dashboard': { title: '工作台', icon: 'layui-icon-home' },
        '/system/user': { title: '用户管理', icon: 'layui-icon-user' },
        '/system/role': { title: '角色管理', icon: 'layui-icon-group' },
        '/system/menu': { title: '菜单管理', icon: 'layui-icon-layouts' },
        '/business/project': { title: '项目管理', icon: 'layui-icon-file' },
        '/business/quote': { title: '报价管理', icon: 'layui-icon-dollar' },
        '/business/customer': { title: '客户管理', icon: 'layui-icon-friends' },
        '/analytics/dashboard': { title: '数据看板', icon: 'layui-icon-chart-screen' },
        '/analytics/reports': { title: '报表管理', icon: 'layui-icon-table' },
        '/settings': { title: '系统设置', icon: 'layui-icon-set-sm' },
    };

    const menuInfo = menuMap[path];
    if (menuInfo) {
        tabsStore.addTab({
            path,
            title: menuInfo.title,
            icon: menuInfo.icon,
        });
    }

    router.push(path);
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
    overflow: hidden;

    &.collapsed {
        .menu-item {
            justify-content: center;
            padding: 12px 0;

            .menu-icon {
                margin: 0;
                font-size: 18px;
            }
        }

        .submenu-title .arrow-icon {
            display: none;
        }
    }
}

.sidebar-menu {
    height: 100%;
    display: flex;
    flex-direction: column;
}

// 用户信息盒子样式
.user-info-box {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    margin-bottom: 8px;

    .user-avatar {
        flex-shrink: 0;
        margin-right: 12px;
    }

    .user-details {
        flex: 1;
        min-width: 0;

        .username {
            font-size: 16px;
            font-weight: 600;
            line-height: 1.4;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .user-role {
            font-size: 12px;
            opacity: 0.8;
            line-height: 1.3;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}

.menu-list {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px 0;
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
        transition: transform 0.3s ease;
    }

    &:hover {
        background-color: #f5f7fa;

        .menu-icon {
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
}

.submenu {
    background-color: #f8f9fa;

    .submenu-item {
        padding-left: 48px;
        background-color: transparent;

        &:hover {
            background-color: #ecf5ff;
        }

        &.active {
            background-color: #e6f7ff;
            border-right: 3px solid #409eff;
        }
    }
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

    .submenu-item {
        padding-left: 0;
    }
}
</style>