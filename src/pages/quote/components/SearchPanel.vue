<template>
  <div class="search-panel">
    <!-- 顶部工具栏 -->
    <lay-card class="toolbar-card">
      <lay-form
        layout="inline"
        :pane="true"
        :label-width="80"
        class="toolbar-form-items"
      >
        <lay-form-item label="工程项目名称" class="panel-form-item">
          <lay-input
            v-model="projectNameValue"
            placeholder="请输入工程项目名称"
            class="search-input"
            mode="block"
          />
        </lay-form-item>

        <lay-form-item label="提交人" class="panel-form-item">
          <lay-input
            v-model="submitterValue"
            placeholder="请输入提交人"
            class="search-input"
            mode="block"
          />
        </lay-form-item>

        <lay-form-item label="申请日期" class="panel-form-item">
          <lay-date-picker
            v-model="createTime"
            placeholder="选择申请日期"
            allow-clear
          />
        </lay-form-item>

        <lay-form-item label="审批日期" class="panel-form-item">
          <lay-date-picker
            v-model="approvalTime"
            placeholder="选择审批日期"
            allow-clear
          />
        </lay-form-item>

        <div class="toolbar-btns">
          <button title="搜索" @click="handleSearch">
            <SvgIcon name="search" width="1.1rem" />
          </button>
          <button title="刷新" @click="handleRefresh">
            <SvgIcon name="refresh" width="1.2rem" />
          </button>
        </div>
      </lay-form>
    </lay-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';
import approvalApi from '@/api/approval/approvalApi';
import type { ApprovalListResponse } from '@/api/approval/approvalApi.type';

// 定义组件属性
const props = defineProps({
  deleteordiscount: {
    type: Number,
    required: true,
    validator: (value: number) => [0, 1].includes(value),
  },
  pageSize: {
    type: Number,
    default: 20,
  },
});

// 定义事件
const emit = defineEmits(['search-result', 'loading-change']);

// 搜索条件
const projectNameValue = ref('');
const submitterValue = ref('');
const createTime = ref('');
const approvalTime = ref('');

// 分页参数
const currentPage = ref(1);

// 监听搜索条件变化，自动触发搜索
watch(
  [projectNameValue, submitterValue, createTime, approvalTime],
  () => {
    // 搜索条件变化时，重置页码并执行搜索
    currentPage.value = 1;
    handleSearch();
  },
  { deep: true },
);

// 搜索方法
const handleSearch = async () => {
  try {
    // 通知父组件开始加载
    emit('loading-change', true);

    // 构建查询参数
    const queryParams: Record<string, string> = {};

    // 添加工程项目名称
    if (projectNameValue.value) {
      queryParams['projectName'] = projectNameValue.value;
    }

    // 添加提交人
    if (submitterValue.value) {
      queryParams['uidorsuperiorid'] = submitterValue.value;
    }

    // 添加申请日期
    if (createTime.value) {
      queryParams['createTime'] = createTime.value;
    }

    // 添加审批日期
    if (approvalTime.value) {
      queryParams['approvalTime'] = approvalTime.value;
    }

    // 调用API获取审批列表
    const result = (await approvalApi.getApprovalList(
      props.deleteordiscount,
      'desc', // 默认降序排列
      (currentPage.value - 1) * props.pageSize,
      props.pageSize,
      queryParams,
    )) as unknown as ApprovalListResponse;

    // 将结果发送给父组件
    emit('search-result', result);
  } catch (error) {
    console.error('获取审批列表失败:', error);
  } finally {
    // 通知父组件加载完成
    emit('loading-change', false);
  }
};

// 刷新方法
const handleRefresh = () => {
  // 清空所有搜索条件
  projectNameValue.value = '';
  submitterValue.value = '';
  createTime.value = '';
  approvalTime.value = '';

  // 重置页码
  currentPage.value = 1;

  // 执行搜索
  handleSearch();
};

// 暴露方法给父组件
defineExpose({
  handleSearch,
  handleRefresh,
  setPage: (page: number) => {
    currentPage.value = page;
    handleSearch();
  },
});
</script>

<style scoped lang="scss">
.search-panel {
  width: 100%;
  :deep(.layui-form-item) {
    label {
      width: 100px !important;
    }
  }

  .toolbar-form-items {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .panel-form-item {
    min-width: 280px;

    :deep(.layui-form-label) {
      padding: 0;
    }
  }

  .search-input {
    width: 100%;
  }

  .toolbar-btns {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-left: 0.5rem;

    button {
      @include button-style($primary-color);
    }
  }

  @media (max-width: $desktop_layout_breakpoint) {
    :deep(.layui-date-picker) {
      width: 100%;
    }

    .panel-form-item {
      width: 100%;
    }

    .toolbar-btns {
      margin-left: 0;
      margin-bottom: 0.5rem;
    }
  }

  @media (min-width: $desktop_layout_breakpoint) {
    .toolbar-form-items {
      display: flex;
      gap: 10px;

      :deep(.layui-form-item) {
        margin-bottom: 0;
      }
    }
  }
}
</style>
