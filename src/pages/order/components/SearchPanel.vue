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
        <lay-form-item class="panel-form-item">
          <template #label>
            <lay-select v-model="queryField" class="search-select">
              <lay-select-option value="companyName">公司</lay-select-option>
              <lay-select-option value="createrName">发布者</lay-select-option>
              <lay-select-option value="phone">联系方式</lay-select-option>
              <lay-select-option value="orderid">订单id</lay-select-option>
              <lay-select-option value="projectName"
                >项目名称</lay-select-option
              >
              <lay-select-option value="typeName">订单状态</lay-select-option>
            </lay-select>
          </template>
          <lay-input
            v-model="queryValue"
            placeholder="请输入搜索内容"
            class="search-input"
            mode="block"
          />
        </lay-form-item>

        <lay-form-item label="通知时间" class="panel-form-item">
          <lay-date-picker
            v-model="beginTime"
            placeholder="选择开始日期"
            allow-clear
          />
        </lay-form-item>

        <lay-form-item label="结束时间" class="panel-form-item">
          <lay-date-picker
            v-model="endTime"
            placeholder="选择结束日期"
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
import ordersNoticeApi from '@/api/orders/ordersNotice';
import inqueryApi from '@/api/inquery/inqueryApi';
import type { OrdersNoticeListResponse } from '@/api/orders/ordersNotice.type';
import type { InqueryListResponse } from '@/api/inquery/inqueryApi.type';

// 定义组件属性
const props = defineProps({
  apiName: {
    type: String as () => 'ordersNotice' | 'inquery',
    required: true,
    validator: (value: string) => ['ordersNotice', 'inquery'].includes(value),
  },
  viewName: {
    type: String,
    default: 'default',
  },
  pageSize: {
    type: Number,
    default: 20,
  },
});

// 定义事件
const emit = defineEmits(['search-result', 'loading-change']);

// 搜索条件
const queryField = ref('companyName');
const queryValue = ref('');
const beginTime = ref('');
const endTime = ref('');

// 分页参数
const currentPage = ref(1);

// 监听搜索条件变化，自动触发搜索
watch(
  [queryField, queryValue, beginTime, endTime],
  (newVal, oldVal) => {
    if (newVal[1].length <= 0 && newVal[0] !== oldVal[0]) {
      // 搜索字段为空时，切换queryField不触发搜索
      return;
    }
    // 其他搜索条件变化时，重置页码并执行搜索
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

    // 添加搜索字段和值
    if (queryField.value && queryValue.value) {
      queryParams['queryField'] = queryField.value;
      queryParams['queryVal'] = queryValue.value;
    }

    // 添加日期范围
    if (beginTime.value) {
      queryParams['beginTime'] = beginTime.value;
    }

    if (endTime.value) {
      queryParams['endTime'] = endTime.value;
    }

    const apiFunction =
      props.apiName === 'ordersNotice'
        ? ordersNoticeApi.getNoticeList
        : inqueryApi.getInqueryList;

    // 调用API获取通知列表
    const result = (await apiFunction(
      props.viewName,
      'desc', // 默认降序排列
      (currentPage.value - 1) * props.pageSize,
      props.pageSize,
      queryParams,
    )) as unknown as OrdersNoticeListResponse | InqueryListResponse;

    // 将结果发送给父组件
    emit('search-result', result);
  } catch (error) {
    console.error('获取通知列表失败:', error);
  } finally {
    // 通知父组件加载完成
    emit('loading-change', false);
  }
};

// 刷新方法
const handleRefresh = () => {
  // 清空所有搜索条件
  queryField.value = 'companyName';
  queryValue.value = '';
  beginTime.value = '';
  endTime.value = '';

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
      width: 120px !important;
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

    .search-select {
      :deep(.layui-input) {
        border-color: transparent;
        input {
          text-align: center;
        }
      }
    }

    .layui-select {
      width: 100%;
      border-radius: 0;
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
