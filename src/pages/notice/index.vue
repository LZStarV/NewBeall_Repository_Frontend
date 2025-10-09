<template>
  <div class="notice-page">
    <!-- 顶部工具栏 -->
    <lay-card class="toolbar-card">
      <div class="toolbar-content">
        <!-- 左侧按钮组 -->
        <div class="button-group">
          <lay-button
            :type="activeTab === 'all' ? 'primary' : 'default'"
            size="sm"
            class="tab-button"
            @click="switchTab('all')"
          >
            全部消息
          </lay-button>
          <lay-button
            :type="activeTab === 'system' ? 'primary' : 'default'"
            size="sm"
            class="tab-button"
            @click="switchTab('system')"
          >
            系统消息
          </lay-button>
          <lay-button
            :type="activeTab === 'activity' ? 'primary' : 'default'"
            size="sm"
            class="tab-button"
            @click="switchTab('activity')"
          >
            活动消息
          </lay-button>
          <lay-button
            :type="activeTab === 'user' ? 'primary' : 'default'"
            size="sm"
            class="tab-button"
            @click="switchTab('user')"
          >
            用户动态消息
          </lay-button>
        </div>

        <!-- 右侧操作按钮 -->
        <div class="toolbar-btns">
          <lay-button size="sm" @click="markAsRead">标记已读</lay-button>
          <lay-button size="sm" @click="markAllAsRead">全部已读</lay-button>
          <lay-button size="sm" @click="deleteSelected">删除</lay-button>
          <lay-button size="sm" @click="deleteAll">全部删除</lay-button>
        </div>
      </div>
    </lay-card>

    <!-- 底部列表区域 -->
    <lay-card class="content-list-card">
      <lay-table
        :page="paginator"
        :columns="columns"
        :data-source="noticeList"
        :default-toolbar="defaultToolbars"
        :loading="loading"
        even
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
      >
        <template #titleContent="{ row }">
          <span :class="{ 'unread-title': !row.isRead }">
            {{ row.titleContent }}
          </span>
        </template>
        <template #type="{ row }">
          <lay-tag :type="getTagType(row.type)">{{ row.type }}</lay-tag>
        </template>
      </lay-table>
      <div
        style="
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div class="page-info"></div>
      </div>
    </lay-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import type {
  TableColumn,
  TableDefaultToolbar,
} from '@layui/layui-vue/types/component/table/typing';
import noticeApi from '@/api/notice/noticeApi.ts';
import Notify from '@/utils/notify.ts';

// API返回的通知数据类型
interface ApiNoticeItem {
  content: string;
  contents: string;
  creater: string;
  createrName: string;
  createtime: string; // 时间
  id: number; // 消息ID
  title: string; // 标题
  type: number; // 类型编号
  typeMsg: string; // 类型描述
  unid: string;
}

// 前端使用的通知数据类型
interface NoticeItem {
  id: string;
  titleContent: string; // 标题内容
  time: string; // 时间
  type: string; // 类型
}

// 标签页状态
const activeTab = ref<string>('all');

// 加载状态
const loading = ref<boolean>(false);

// 选中的通知项
const selectedRows = ref<NoticeItem[]>([]);

// 存储从API获取的通知数据
const apiNoticeData = ref<NoticeItem[]>([]);

// 总未读信息数量
const totalUnreadCount = ref(0);
// 系统消息未读数量
const systemUnreadCount = ref(0);
// 活动消息未读数量
const activityUnreadCount = ref(0);
// 用户动态消息未读数量
const userUnreadCount = ref(0);

// 将API返回的通知数据转换为前端需要的格式
const transformApiData = (apiData: ApiNoticeItem[]): NoticeItem[] => {
  return apiData.map((item) => ({
    id: item.id.toString(),
    titleContent: item.title,
    time: item.createtime,
    type: item.typeMsg || item.type.toString(), // 使用类型描述或类型编号
  }));
};

// 根据选中的标签页过滤通知列表
const noticeList = computed<NoticeItem[]>(() => {
  let filtered = [...apiNoticeData.value];

  if (activeTab.value !== 'all') {
    const typeMap: Record<string, string> = {
      system: '系统消息',
      activity: '活动消息',
      user: '用户动态消息',
    };
    filtered = filtered.filter(
      (item) => item.type === typeMap[activeTab.value],
    );
  }
  return filtered;
});

// 表头配置
const defaultToolbars: TableDefaultToolbar[] = [
  {
    icon: 'layui-icon-refresh',
    title: '刷新',
    onClick: () => {
      loadNotices();
    },
  },
  'filter',
];

// 分页器配置
const paginator = reactive({
  current: 1,
  limit: 50,
  total: 100,
  limits: [10, 20, 50, 100], // 可选每页条数（下拉选择）
  hideOnSinglePage: false, // 只有一页时是否隐藏分页器（默认 false）
  change: async (current, pageSize?: number) => {
    console.log(current, pageSize);
    if (pageSize !== undefined) {
      paginator.limit = pageSize;
    }
    paginator.current = current.current;
    paginator.limit = current.limit;
    try {
      await loadNotices();
    } catch (err) {
      Notify.error('查询失败，请稍后再试！');
      console.error(err);
    }
  },
});

// 表格列配置
const columns = [
  {
    title: '选中情况',
    width: '20px',
    type: 'checkbox',
    fixed: 'left' as const,
  },
  {
    title: '标题内容',
    width: '250px',
    key: 'titleContent',
    ellipsisTooltip: true,
    align: 'left',
  },
  {
    title: '时间',
    width: '180px',
    key: 'time',
    sort: true,
    align: 'left',
  },
  {
    title: '类型',
    width: '120px',
    key: 'type',
    customSlot: 'type',
    align: 'left',
  },
] as TableColumn[];

// 获取标签类型样式
const getTagType = (type: string): string => {
  const typeMap: Record<string, string> = {
    系统消息: 'primary',
    活动消息: 'success',
    用户动态消息: 'primary',
  };
  return typeMap[type] || 'normal';
};

// 排序处理
const sortChange = (key: string, sort: string) => {
  // 实际项目中应该调用API进行排序
  console.log(`排序：${key} ${sort}`);
};

// 处理选择变化
const handleSelectionChange = (rows: NoticeItem[]) => {
  selectedRows.value = rows;
};

// 加载通知数据
const loadNotices = async () => {
  loading.value = true;
  try {
    // 调用API获取通知数据
    const response = await noticeApi.getAllNotices(
      paginator.current,
      paginator.limit,
    );
    const responseData = response.data || [];
    ({
      count: totalUnreadCount.value,
      systemCount: systemUnreadCount.value,
      activityCount: activityUnreadCount.value,
      userCount: userUnreadCount.value,
    } = response);

    // 转换API数据
    apiNoticeData.value = transformApiData(responseData);

    // 检查是否有数据
    if (responseData && responseData.length === 0) {
      Notify.warn('当前没有消息！');
    }
  } catch (error) {
    Notify.warn('加载通知失败，请重试');
    // 出错时不使用mock数据
    apiNoticeData.value = [];
    // 打印错误信息到控制台
    console.error('API调用错误:', error);
  } finally {
    loading.value = false;
  }
};

// 标记已读
const markAsRead = async () => {
  if (selectedRows.value.length === 0) {
    Notify.warn('请先选择要标记的通知');
    return;
  }

  loading.value = true;
  try {
    const selectedIds = selectedRows.value.map((item) => item.id);

    // 实际项目中应该调用API
    // 这里直接处理成功

    // 清空选中状态
    selectedRows.value = [];

    Notify.success('已成功标记为已读');
  } catch (error) {
    Notify.warn('标记已读失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 全部已读
const markAllAsRead = async () => {
  loading.value = true;
  try {
    // TODO:实际项目中应该调用API

    // 清空选中状态
    selectedRows.value = [];

    Notify.success('已全部标记为已读');
  } catch (error) {
    Notify.warn('标记全部已读失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 删除选中
const deleteSelected = async () => {
  if (selectedRows.value.length === 0) {
    Notify.warn('请先选择要删除的通知');
    return;
  }

  loading.value = true;
  try {
    // TODO: 实际项目中应该调用API
    const selectedIds = selectedRows.value.map((item) => item.id);

    // 直接处理成功

    // 清空选中状态
    selectedRows.value = [];

    // 重新加载数据以更新分页
    loadNotices();

    Notify.success('已成功删除选中通知');
  } catch (error) {
    Notify.warn('删除通知失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 删除全部
const deleteAll = async () => {
  loading.value = true;
  try {
    // TODO: 实际项目中应该调用API

    // 直接处理成功

    // 清空选中状态
    selectedRows.value = [];

    // 重新加载数据以更新分页
    loadNotices();

    Notify.success('已成功删除全部通知');
  } catch (error) {
    Notify.warn('删除全部通知失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 切换标签
const switchTab = (tabId: string) => {
  activeTab.value = tabId;
  paginator.current = 1; // 切换标签时重置到第一页
  loadNotices();
};

// 页面加载时
onMounted(() => {
  loadNotices();
});
</script>

<style scoped lang="scss">
.notice-page {
  :deep(.layui-form-item) {
    label {
      width: 100px !important;
    }
  }

  .toolbar-card {
    :deep(.layui-card-body) {
      padding: 10px !important;
    }
  }

  .toolbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
  }

  .button-group {
    display: flex;
    gap: 10px;
  }

  .tab-button {
    min-width: 100px;
  }

  .toolbar-btns {
    display: flex;
    gap: 10px;
  }

  .content-list-card {
    height: 100%;
    margin-top: 16px;

    :deep(.layui-card-body) {
      padding: 0 0 10px 0 !important;
      overflow: hidden;
      border-radius: var(--card-border-radius);
    }

    .unread-title {
      font-weight: bold;
    }
  }

  .page-info {
    margin-top: 1rem;
    font-size: 14px;
    margin-left: 20px;
    color: $text-regular;
  }

  :deep(.layui-tab) {
    margin: 0;

    .layui-tab-title {
      padding: 0;
    }

    .layui-tab-content {
      padding: 0;
    }
  }

  @media (max-width: $desktop_layout_breakpoint) {
    .toolbar-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .button-group {
      width: 100%;
      flex-wrap: wrap;
    }

    .tab-button {
      flex: 1;
      min-width: calc(50% - 5px);
    }

    .toolbar-btns {
      width: 100%;
      justify-content: flex-end;
    }
  }
}
</style>
