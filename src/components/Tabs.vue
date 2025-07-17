<template>
    <div class="tabs-container">
        <!-- 标签页列表 -->
        <div class="tabs-wrapper">
            <div class="tabs-list">
                <div v-for="tab in tabs" :key="tab.path" class="tab-item" :class="{ active: activeTab === tab.path }"
                    @click="switchTab(tab.path)">
                    <div class="tab-content">
                        <lay-icon :type="tab.icon" class="tab-icon" v-if="tab.icon" />
                        <span class="tab-title">{{ tab.title }}</span>
                        <lay-icon v-if="tab.path !== '/dashboard'" type="layui-icon-close" class="tab-close"
                            @click.stop="closeTab(tab.path)" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 标签页操作按钮 -->
        <div class="tabs-actions">
            <lay-dropdown>
                <div class="action-btn">
                    <lay-icon type="layui-icon-down" />
                </div>
                <template #content>
                    <lay-dropdown-menu>
                        <lay-dropdown-menu-item @click="refreshCurrentTab">
                            <lay-icon type="layui-icon-refresh" />
                            刷新当前页
                        </lay-dropdown-menu-item>
                        <lay-dropdown-menu-item @click="closeOtherTabs">
                            <lay-icon type="layui-icon-close" />
                            关闭其他标签
                        </lay-dropdown-menu-item>
                        <lay-dropdown-menu-item @click="closeAllTabs">
                            <lay-icon type="layui-icon-close-fill" />
                            关闭全部标签
                        </lay-dropdown-menu-item>
                    </lay-dropdown-menu>
                </template>
            </lay-dropdown>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTabsStore } from '@/stores/tabs';

const router = useRouter();
const route = useRoute();
const tabsStore = useTabsStore();

// 响应式数据
const tabs = computed(() => tabsStore.tabs);
const activeTab = computed({
    get: () => tabsStore.activeTab,
    set: (value: string) => tabsStore.setActiveTab(value)
});

// 监听路由变化，自动添加标签页
watch(
    () => route.path,
    (newPath) => {
        if (newPath !== '/') {
            tabsStore.setActiveTab(newPath);
        }
    },
    { immediate: true }
);

// 切换标签页
const switchTab = (path: string) => {
    tabsStore.setActiveTab(path)
    router.push(path);
};

// 关闭标签页
const closeTab = (path: string) => {
    const nextTab = tabsStore.removeTab(path);
    if (nextTab && nextTab !== route.path) {
        router.push(nextTab);
    }
};

// 刷新当前标签页
const refreshCurrentTab = () => {
    window.location.reload();
};

// 关闭其他标签页
const closeOtherTabs = () => {
    tabsStore.closeOtherTabs(route.path);
};

// 关闭全部标签页
const closeAllTabs = () => {
    tabsStore.closeAllTabs();
    router.push('/dashboard');
};
</script>

<style scoped lang="scss">
.tabs-container {
    display: flex;
    align-items: center;
    height: 100%;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 16px;
}

.tabs-wrapper {
    flex: 1;
    overflow: hidden;
}

.tabs-list {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 100%;
}

.tab-item {
    display: flex;
    align-items: center;
    height: 32px;
    background: #e4e7ed;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;
    flex-shrink: 0;

    &:hover {
        background: #d3d4d6;
    }

    &.active {
        background: #5470c6;
        color: white;

        .tab-icon,
        .tab-title {
            color: white;
        }

        .tab-close {
            color: rgba(255, 255, 255, 0.8);

            &:hover {
                color: white;
                background: rgba(255, 255, 255, 0.2);
            }
        }
    }
}

.tab-content {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 12px;
    height: 100%;
}

.tab-icon {
    font-size: 12px;
    color: #666;
}

.tab-title {
    font-size: 13px;
    color: #333;
    white-space: nowrap;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tab-close {
    font-size: 12px;
    color: #999;
    padding: 2px;
    border-radius: 2px;
    transition: all 0.2s ease;

    &:hover {
        color: #f56c6c;
        background: rgba(245, 108, 108, 0.1);
    }
}

.tabs-actions {
    margin-left: 16px;

    .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        color: #666;

        &:hover {
            background: #e4e7ed;
            color: #409eff;
        }
    }
}
</style>
