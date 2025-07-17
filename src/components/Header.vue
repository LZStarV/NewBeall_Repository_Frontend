<template>
    <div class="header">
        <!-- 左侧折叠按钮 -->
        <div class="header-left">
            <div class="collapse-btn" @click="toggleSidebar">
                <lay-icon :type="sidebarCollapsed ? 'layui-icon-spread-left' : 'layui-icon-shrink-right'" />
            </div>
            <!-- 刷新按钮 -->
            <div class="collapse-btn" @click="refreshPage">
                <lay-icon type="layui-icon-refresh" />
            </div>
        </div>
        <!-- 右侧工具栏 -->
        <div class="header-right">
            <div class="toolbar">


                <!-- 全屏按钮 -->
                <lay-tooltip content="全屏">
                    <lay-button class="toolbar-btn" @click="toggleFullscreen">
                        <lay-icon type="layui-icon-screen-full" />
                    </lay-button>
                </lay-tooltip>

                <!-- 消息通知 -->
                <lay-dropdown>
                    <lay-button class="toolbar-btn">
                        <lay-badge :count="5">
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

                <!-- 用户头像和菜单 -->
                <lay-dropdown>
                    <div class="user-info">
                        <lay-avatar
                            src="https://portrait.gitee.com/uploads/avatars/user/1611/4834751_Jmysy_1578975358.png"
                            size="sm" />
                        <span class="username">管理员</span>
                        <lay-icon type="layui-icon-down" />
                    </div>
                    <template #content>
                        <lay-dropdown-menu>
                            <lay-dropdown-menu-item @click="viewProfile">个人中心</lay-dropdown-menu-item>
                            <lay-dropdown-menu-item @click="changePassword">修改密码</lay-dropdown-menu-item>
                            <lay-dropdown-menu-item divided @click="logout">退出登录</lay-dropdown-menu-item>
                        </lay-dropdown-menu>
                    </template>
                </lay-dropdown>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 定义 emit
const emit = defineEmits<{
    'toggle-sidebar': [collapsed: boolean]
}>();

// 添加侧边栏折叠状态
const sidebarCollapsed = ref(false);

// 切换侧边栏
const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
    emit('toggle-sidebar', sidebarCollapsed.value);
};

// 刷新页面
const refreshPage = () => {
    window.location.reload();
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

    .header-left {
        display: flex;
        align-items: center;

        .collapse-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.3s ease;
            color: #666;

            &:hover {
                background-color: #f5f7fa;
                color: #409eff;
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
        gap: 16px;

        .toolbar-btn {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: background-color 0.3s ease;

            &:hover {
                background-color: #f5f7fa;
            }
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s ease;

            &:hover {
                background-color: #f5f7fa;
            }

            .username {
                font-size: 14px;
                color: #333;
                font-weight: 500;
            }

            .layui-icon {
                font-size: 12px;
                color: #999;
            }
        }
    }
}
</style>