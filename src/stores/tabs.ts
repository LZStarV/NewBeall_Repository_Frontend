import { defineStore } from 'pinia';

export interface TabItem {
  path: string;
  title: string;
  icon?: string;
}

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    tabs: [
      {
        path: '/dashboard',
        title: '工作台',
        icon: 'layui-icon-home',
      },
    ] as TabItem[],
    activeTab: '/dashboard',
  }),

  actions: {
    // 添加标签页
    addTab(tab: TabItem) {
      const existingTab = this.tabs.find((t) => t.path === tab.path);
      if (!existingTab) {
        this.tabs.push(tab);
      }
      this.activeTab = tab.path;
    },

    // 移除标签页
    removeTab(path: string): string | null {
      const index = this.tabs.findIndex((tab) => tab.path === path);
      if (index === -1 || this.tabs.length <= 1) return null;

      this.tabs.splice(index, 1);

      // 如果关闭的是当前活动标签页，需要切换到其他标签页
      if (this.activeTab === path) {
        const nextTab = this.tabs[Math.min(index, this.tabs.length - 1)];
        this.activeTab = nextTab.path;
        return nextTab.path;
      }

      return null;
    },

    // 设置活动标签页
    setActiveTab(path: string) {
      this.activeTab = path;
    },

    // 关闭其他标签页
    closeOtherTabs(currentPath: string) {
      this.tabs = this.tabs.filter(
        (tab) => tab.path === currentPath || tab.path === '/dashboard',
      );
      this.activeTab = currentPath;
    },

    // 关闭全部标签页
    closeAllTabs() {
      this.tabs = [
        {
          path: '/dashboard',
          title: '工作台',
          icon: 'layui-icon-home',
        },
      ];
      this.activeTab = '/dashboard';
    },
  },
});
