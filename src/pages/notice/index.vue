<template>
  <div class="notice-page">
    <!-- 顶部工具栏 -->
    <lay-card class="toolbar-card">
      <div class="toolbar-content">
        <!-- 左侧按钮组 -->
        <div class="button-group">
          <lay-badge
            :value="systemUnreadCount + activityUnreadCount + userUnreadCount"
            :max="999"
          >
            <lay-button
              :type="activeTab === 0 ? 'primary' : 'default'"
              size="sm"
              class="tab-button"
              @click="switchTab(0)"
            >
              全部消息
            </lay-button>
          </lay-badge>

          <lay-badge :value="systemUnreadCount" :max="999">
            <lay-button
              :type="activeTab === 1 ? 'primary' : 'default'"
              size="sm"
              class="tab-button"
              @click="switchTab(1)"
            >
              系统消息
            </lay-button>
          </lay-badge>

          <lay-badge :value="activityUnreadCount" :max="999">
            <lay-button
              :type="activeTab === 2 ? 'primary' : 'default'"
              size="sm"
              class="tab-button"
              @click="switchTab(2)"
            >
              活动消息
            </lay-button>
          </lay-badge>

          <lay-badge :value="userUnreadCount" :max="999">
            <lay-button
              :type="activeTab === 3 ? 'primary' : 'default'"
              size="sm"
              class="tab-button"
              @click="switchTab(3)"
            >
              用户动态消息
            </lay-button>
          </lay-badge>
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
        ref="msgTable"
        :page="paginator"
        :columns="columns"
        :data-source="noticeList"
        :default-toolbar="defaultToolbars"
        :loading="loading"
        even
        @sort-change="sortChange"
        v-model:selected-keys="selectedKeys"
      >
        <template #titleContent="{ row }">
          <span :class="{ 'unread-title': !row.isRead }">
            {{ row.titleContent }}
          </span>
        </template>
        <template #type="{ row }">
          <lay-tag class="log-type-tag" :class="getLogtypeClass(row.type)">{{
            row.type
          }}</lay-tag>
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
        <div class="page-info">共 {{ totalCount }} 条数据</div>
      </div>
    </lay-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import type {
  TableColumn,
  TableDefaultToolbar,
} from '@layui/layui-vue/types/component/table/typing';
import { layer } from '@layui/layui-vue';
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

// 表格 DOM Ref
const msgTable = ref();
// 标签页状态
const activeTab = ref<number>(0);
// 加载状态
const loading = ref<boolean>(false);
// 存储从API获取的通知数据
const noticeList = ref<NoticeItem[]>([]);
// 总信息数量
const totalCount = ref(0);
// 系统消息未读数量
const systemUnreadCount = ref(0);
// 活动消息未读数量
const activityUnreadCount = ref(0);
// 用户动态消息未读数量
const userUnreadCount = ref(0);
// 表格选中行
const selectedKeys = ref(0);

// 将API返回的通知数据转换为前端需要的格式
const transformApiData = (apiData: ApiNoticeItem[]): NoticeItem[] => {
  return apiData.map((item) => ({
    id: item.id.toString(),
    titleContent: item.title,
    time: item.createtime,
    type: item.typeMsg,
  }));
};

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
  total: 0,
  limits: [10, 20, 50, 100],
  hideOnSinglePage: false,
  change: async (current, pageSize?: number) => {
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
    width: '150px',
    key: 'time',
    sort: true,
    align: 'left',
  },
  {
    title: '类型',
    width: '120px',
    key: 'type',
    customSlot: 'type',
  },
] as TableColumn[];

// 切换标签
const switchTab = (tabId: number) => {
  activeTab.value = tabId;
  paginator.current = 1;
  loadNotices();
};

// 获取标签类型样式类名
const getLogtypeClass = (logtype: string) => {
  const typeMap: Record<string, string> = {
    系统信息: 'system',
    活动消息: 'activity',
    用户动态信息: 'user',
  };
  return typeMap[logtype] || 'default';
};

// 排序处理
const sortChange = (key: string, sort: string) => {
  // 实际项目中应该调用API进行排序
  console.log(`排序：${key} ${sort}`);
};

// 加载通知数据
const loadNotices = async () => {
  loading.value = true;
  try {
    // 调用API获取通知数据
    const response = await noticeApi.getAllNotices(
      paginator.current,
      paginator.limit,
      activeTab.value,
    );
    const responseData = response.data || [];
    ({
      count: totalCount.value,
      systemCount: systemUnreadCount.value,
      activityCount: activityUnreadCount.value,
      userCount: userUnreadCount.value,
    } = response);

    // 转换API数据
    noticeList.value = transformApiData(responseData);

    paginator.total = response.count;

    // 检查是否有数据
    if (responseData && responseData.length === 0) {
      Notify.warn('当前没有消息！');
    }
  } catch (error) {
    Notify.warn('加载通知失败，请重试');
    noticeList.value = [];
    // 打印错误信息到控制台
    console.error('API调用错误:', error);
  } finally {
    loading.value = false;
  }
};

// 标记已读
const markAsRead = () => {
  if (msgTable.value.getCheckData().length === 0) {
    Notify.warn('请先选择要标记的通知');
    return;
  }
  layer.confirm(
    `是否将标记的 ${msgTable.value.getCheckData().length} 条消息设为已读？`,
    {
      btn: [
        {
          text: '确定',
          callback: async (id) => {
            loading.value = true;
            try {
              const selectedIds = msgTable.value
                .getCheckData()
                .map((item) => Number(item.id));
              await noticeApi.clearNotice(selectedIds);
              await loadNotices();
              Notify.success('已成功标记为已读');
            } catch (error) {
              Notify.warn('标记已读失败，请重试');
            } finally {
              loading.value = false;
              layer.close(id);
            }
          },
        },
        {
          text: '取消',
          callback: (id) => {
            layer.close(id);
          },
        },
      ],
    },
  );
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
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

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
    gap: 20px;
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

    // 日志类型标签样式
    :deep(.log-type-tag) {
      &.activity {
        background: #f6ffed;
        color: #52c41a;
        border-color: #b7eb8f;
      }

      &.user {
        background: #e6f7ff;
        color: #1890ff;
        border-color: #91d5ff;
      }

      &.system {
        background: #fff7e6;
        color: #d48806;
        border-color: #ffd591;
      }

      &.default {
        background: #e6f7ff;
        color: #1890ff;
        border-color: #91d5ff;
      }
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
