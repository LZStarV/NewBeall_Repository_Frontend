<template>
  <div class="dashboard-page">
    <!-- 统计卡片区域 -->
    <section class="stats-section">
      <lay-container fluid>
        <lay-row space="16">
          <lay-col
            v-for="stat in statsCards"
            :key="stat.id"
            md="4"
            sm="12"
            xs="24"
          >
            <div
              class="stat-card"
              :class="stat.colorClass"
              @click="handleCardClick(stat)"
            >
              <div class="card-content">
                <div class="card-number">{{ stat.number }}</div>
                <div class="card-label">{{ stat.label }}</div>
              </div>
              <div class="card-icon">
                <lay-icon :type="stat.icon" />
              </div>
            </div>
          </lay-col>
        </lay-row>
      </lay-container>
    </section>
    <!-- 功能模块区域 -->
    <section class="modules-section">
      <lay-container fluid>
        <lay-row space="16">
          <lay-col
            v-for="module in moduleCards"
            :key="module.id"
            md="4"
            sm="8"
            xs="12"
          >
            <div
              class="module-card"
              :class="module.colorClass"
              @click="handleModuleClick(module)"
            >
              <div class="module-icon">
                <lay-icon :type="module.icon" size="32" />
              </div>
              <div class="module-label">{{ module.label }}</div>
            </div>
          </lay-col>
        </lay-row>
      </lay-container>
    </section>

    <!-- 信息卡片区域 -->
    <div class="info-cards-section">
      <lay-container fluid>
        <lay-row space="16">
          <!-- 最新动态卡片 -->
          <lay-col
            :md="isExpanded ? '16' : '8'"
            :sm="isExpanded ? '24' : '12'"
            :xs="24"
            class="transition-col"
          >
            <div class="info-card">
              <div class="card-header">
                <h3 class="card-title">最新动态</h3>
                <div class="card-actions">
                  <lay-icon
                    type="layui-icon-more-vertical"
                    class="action-icon"
                  />
                  <lay-icon
                    :type="isExpanded ? 'layui-icon-left' : 'layui-icon-right'"
                    class="expand-icon"
                    @click="toggleExpand"
                  />
                </div>
              </div>
              <div class="card-content">
                <div class="dynamic-list">
                  <div
                    v-for="item in dynamicData"
                    :key="item.id"
                    class="dynamic-item"
                  >
                    <div class="item-dot"></div>
                    <div class="item-content">
                      <div class="item-text">{{ item.text }}</div>
                      <div class="item-date">{{ item.date }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </lay-col>

          <!-- 笔记列表卡片 -->
          <lay-col md="8" sm="12" xs="24" class="transition-col">
            <div class="info-card">
              <div class="card-header">
                <h3 class="card-title">笔记列表</h3>
                <div class="card-actions">
                  <lay-icon type="layui-icon-add-1" class="action-icon" />
                  <lay-icon
                    type="layui-icon-more-vertical"
                    class="action-icon"
                  />
                </div>
              </div>
              <div class="card-content">
                <div class="note-list">
                  <div
                    v-for="note in noteData"
                    :key="note.id"
                    class="note-item"
                  >
                    <div class="note-avatar">
                      <div class="avatar-circle">{{ note.avatar }}</div>
                    </div>
                    <div class="note-content">
                      <div class="note-title">{{ note.title }}</div>
                      <div class="note-subtitle">{{ note.subtitle }}</div>
                    </div>
                    <div class="note-actions">
                      <lay-icon type="layui-icon-share" />
                      <lay-icon type="layui-icon-top" />
                      <lay-icon type="layui-icon-delete" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </lay-col>

          <!-- 用户成员卡片 - 可隐藏 -->
          <lay-col
            v-show="!isExpanded"
            md="8"
            sm="12"
            xs="24"
            class="transition-col"
          >
            <div class="info-card">
              <div class="card-header">
                <h3 class="card-title">用户成员</h3>
                <div class="card-actions">
                  <lay-icon
                    type="layui-icon-more-vertical"
                    class="action-icon"
                  />
                </div>
              </div>
              <div class="card-content">
                <div class="member-list">
                  <div class="member-item all-members">
                    <lay-checkbox name="like" skin="primary" value="1"
                      >全选</lay-checkbox
                    >
                  </div>
                  <div
                    v-for="member in memberData"
                    :key="member.id"
                    class="member-item"
                  >
                    <lay-checkbox name="like" skin="primary" value="1" />
                    <div class="member-avatar">
                      <div class="avatar-circle">{{ member.avatar }}</div>
                    </div>
                    <div class="member-info">
                      <div class="member-name">{{ member.name }}</div>
                      <div class="member-id">{{ member.num }}</div>
                    </div>
                    <div class="member-status">{{ member.status }}</div>
                  </div>
                </div>
              </div>
            </div>
          </lay-col>
        </lay-row>

        <!-- 第二行卡片 -->
        <lay-row space="16" style="margin-top: 16px">
          <!-- 我的临时报价 -->
          <lay-col md="8" sm="12" xs="24">
            <div class="info-card">
              <div class="card-header">
                <h3 class="card-title">我的临时报价</h3>
              </div>
              <div class="card-content">
                <div class="quote-table">
                  <div class="table-header">
                    <div class="col-no">序号</div>
                    <div class="col-name">报价名称</div>
                  </div>
                  <div
                    v-for="quote in quoteData"
                    :key="quote.id"
                    class="table-row"
                  >
                    <div class="col-no">{{ quote.id }}</div>
                    <div class="col-name">{{ quote.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </lay-col>

          <!-- 历史报价状态 -->
          <lay-col md="8" sm="12" xs="24">
            <div class="info-card">
              <div class="card-header">
                <h3 class="card-title">历史报价状态</h3>
              </div>
              <div class="card-content">
                <div class="chart-container">
                  <div class="pie-chart">
                    <div class="chart-legend">
                      <div class="legend-item">
                        <span class="legend-dot blue"></span>
                        <span>进行中</span>
                      </div>
                      <div class="legend-item">
                        <span class="legend-dot orange"></span>
                        <span>已完成</span>
                      </div>
                      <div class="legend-item">
                        <span class="legend-dot green"></span>
                        <span>已取消</span>
                      </div>
                    </div>
                    <!-- 这里可以集成图表库如 ECharts -->
                    <div class="pie-placeholder">饼图区域</div>
                  </div>
                </div>
              </div>
            </div>
          </lay-col>

          <!-- 数据概览 -->
          <lay-col md="8" sm="12" xs="24">
            <div class="info-card">
              <div class="card-header">
                <h3 class="card-title">数据概览</h3>
              </div>
              <div class="card-content">
                <div class="chart-container">
                  <div class="line-chart">
                    <div class="chart-title">最新订单统计</div>
                    <!-- 这里可以集成图表库如 ECharts -->
                    <div class="chart-placeholder">折线图区域</div>
                  </div>
                </div>
              </div>
            </div>
          </lay-col>
        </lay-row>
      </lay-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 展开状态控制
const isExpanded = ref(false);

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// 统计卡片数据
const statsCards = ref([
  {
    id: 1,
    number: 0,
    label: '报价审批',
    icon: 'layui-icon-edit',
    colorClass: 'card-blue',
    route: '/quote/approval',
  },
  {
    id: 2,
    number: 0,
    label: '即时通讯',
    icon: 'layui-icon-reply-fill',
    colorClass: 'card-purple',
    route: '/chat',
  },
  {
    id: 3,
    number: 0,
    label: '删除审批',
    icon: 'layui-icon-delete',
    colorClass: 'card-pink',
    route: '/delete/approval',
  },
  {
    id: 4,
    number: 1,
    label: '未读订单',
    icon: 'layui-icon-form',
    colorClass: 'card-orange',
    route: '/order/unread',
  },
  {
    id: 5,
    number: 0,
    label: '折率审批',
    icon: 'layui-icon-read',
    colorClass: 'card-green',
    route: '/review/approval',
  },
  {
    id: 6,
    number: 0,
    label: '未处理订单',
    icon: 'layui-icon-survey',
    colorClass: 'card-lime',
    route: '/relation/audit',
  },
]);

// 更新统计数据
// const updateStatsFromAPI = (data: GetLastSixMonthsOrdeNoticeRes) => {
//   if (Array.isArray(data) && data.length > 0) {
//     //更新未读订单数量
//     statsCards.value[3].number = data.length;
//   }
// };

// 处理统计卡片点击
const handleCardClick = (card: any) => {
  console.log('点击统计卡片:', card.label);
  if (card.route) {
    router.push(card.route);
  }
};

// 功能模块数据
const moduleCards = ref([
  {
    id: 1,
    label: '新建报价',
    icon: 'layui-icon-add-circle',
    route: '/quote/create',
    colorClass: 'module-blue',
  },
  {
    id: 2,
    label: '历史报价',
    icon: 'layui-icon-time',
    route: '/quote/history',
    colorClass: 'module-purple',
  },
  {
    id: 3,
    label: '客户管理',
    icon: 'layui-icon-user',
    route: '/customer/manage',
    colorClass: 'module-pink',
  },
  {
    id: 4,
    label: '公司云盘',
    icon: 'layui-icon-upload-drag',
    route: '/cloud/storage',
    colorClass: 'module-orange',
  },
  {
    id: 5,
    label: '自建产品',
    icon: 'layui-icon-component',
    route: '/product/custom',
    colorClass: 'module-green',
  },
  {
    id: 6,
    label: '用户管理',
    icon: 'layui-icon-username',
    route: '/product/template',
    colorClass: 'module-lime',
  },
]);

// 处理功能模块点击
const handleModuleClick = (module: any) => {
  console.log('点击功能模块:', module.label);
  if (module.route) {
    router.push(module.route);
  }
};

// 最新动态数据
const dynamicData = ref([
  { id: 1, text: '[何松大] 销售员增加了…', date: '2023-06-08' },
  { id: 2, text: '[何松大] 销售员增加了…', date: '2023-06-08' },
  { id: 3, text: '[何松大] 销售员增加了…', date: '2023-06-08' },
  { id: 4, text: '[何松大] 销售员增加了…', date: '2023-06-08' },
  { id: 5, text: '[何松大] 销售员增加了…', date: '2023-06-08' },
  { id: 6, text: '[何松大] 销售员增加了…', date: '2023-06-08' },
]);

// 笔记数据
const noteData = ref([
  { id: 1, avatar: '张', title: '1111', subtitle: '第三' },
  { id: 2, avatar: '张', title: '1111', subtitle: '第三' },
]);

// 用户成员数据
const memberData = ref([
  { id: 1, avatar: '张', name: '张三', num: '12345678901', status: '在线' },
  { id: 2, avatar: '张', name: '张三', num: '12345678901', status: '在线' },
  { id: 3, avatar: '张', name: '张三', num: '12345678901', status: '在线' },
]);

// 临时报价数据
const quoteData = ref([
  { id: 1, name: 'XTV变速器齿轮齿' },
  { id: 2, name: '某某项目' },
]);

// const getOrderData = async () => {
//   const res = await blackboardApi.getLastSixMonthsOrdeNotice();
//   orderData.value = res;
//   console.log('最近六月订单数量', res);
//   if (!res) {
//     console.log('获取最近六月订单数量');
//   }
// };
</script>

<style lang="scss" scoped>
.dashboard-page {
  @include flex(column);
}

// 统计卡片区域
.stats-section,
.modules-section {
  margin-bottom: 10px;
}

.stat-card {
  @include flex(row, space-between, flex-start);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 110px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .card-content {
    @include flex(column, flex-start, flex-start);
    flex: 1;

    .card-number {
      font-size: 2.5rem;
      color: white;
      line-height: 1;
      margin-bottom: 8px;
    }

    .card-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  // 图标
  .card-icon {
    @include flex(row, center, center);
    color: white;
    height: 100%;

    .layui-icon {
      font-size: 36px;
    }
  }

  // 颜色标签
  &.card-blue {
    background: #62a4e9;
  }

  &.card-purple {
    background: #a2aefe;
  }

  &.card-pink {
    background: #f191a2;
  }

  &.card-orange {
    background: #f9ab54;
  }

  &.card-green {
    background: #4fd4b0;
  }

  &.card-lime {
    background: #9ac640;
  }
}

// 功能模块区域
.modules-section {
  .module-card {
    background: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
    height: 100px;
    @include flex(column, center, center);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .module-icon {
      transition: all 0.3s ease;

      .layui-icon {
        font-size: 32px;
      }
    }

    .module-label {
      font-size: 14px;
      color: #676a6c;
    }

    &.module-blue {
      .module-icon {
        color: #62a4e9;
      }
    }

    &.module-purple {
      .module-icon {
        color: #a2aefe;
      }
    }

    &.module-pink {
      .module-icon {
        color: #f191a2;
      }
    }

    &.module-orange {
      .module-icon {
        color: #f9ab54;
      }
    }

    &.module-green {
      .module-icon {
        color: #4fd4b0;
      }
    }

    &.module-lime {
      .module-icon {
        color: #9ac640;
      }
    }
  }
}

// 信息卡片区域
.info-cards-section {
  .transition-col {
    transition: all 1s ease;
  }
}

.info-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  height: 400px;
  @include flex(column);

  .card-header {
    @include flex(row, space-between, center);
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;

    .card-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .card-actions {
      @include flex(row, center, center);
      gap: 8px;

      .action-icon,
      .expand-icon {
        color: #666;
        cursor: pointer;
        transition: color 0.3s ease;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  .card-content {
    flex: 1;
    padding: 16px 20px;
    overflow-y: auto;
  }
}

// 最新动态样式
.dynamic-list {
  .dynamic-item {
    @include flex(row, flex-start, flex-start);
    margin-bottom: 16px;

    .item-dot {
      width: 6px;
      height: 6px;
      background-color: #52c41a;
      border-radius: 50%;
      margin-top: 6px;
      margin-right: 12px;
      flex-shrink: 0;
    }

    .item-content {
      flex: 1;

      .item-text {
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
      }

      .item-date {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

// 笔记列表样式
.note-list {
  .note-item {
    @include flex(row, space-between, center);
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .note-avatar {
      .avatar-circle {
        width: 32px;
        height: 32px;
        background-color: #1890ff;
        color: white;
        border-radius: 50%;
        @include flex(row, center, center);
        font-size: 14px;
      }
    }

    .note-content {
      flex: 1;
      margin: 0 12px;

      .note-title {
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
      }

      .note-subtitle {
        font-size: 12px;
        color: #999;
      }
    }

    .note-actions {
      @include flex(row, center, center);
      gap: 8px;

      .layui-icon {
        color: #666;
        cursor: pointer;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }
}

// 用户成员样式
.member-list {
  .member-item {
    @include flex(row, flex-start, center);
    padding: 8px 0;

    &.all-members {
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 8px;
      padding-bottom: 12px;
    }

    .member-avatar {
      margin: 0 12px;

      .avatar-circle {
        width: 28px;
        height: 28px;
        background-color: #52c41a;
        color: white;
        border-radius: 50%;
        @include flex(row, center, center);
        font-size: 12px;
      }
    }

    .member-info {
      flex: 1;

      .member-name {
        font-size: 14px;
        color: #333;
        margin-bottom: 2px;
      }

      .member-id {
        font-size: 12px;
        color: #999;
      }
    }

    .member-status {
      font-size: 12px;
      color: #52c41a;
      padding: 2px 8px;
      background-color: #f6ffed;
      border-radius: 4px;
    }
  }
}

// 报价表格样式
.quote-table {
  .table-header {
    @include flex(row, flex-start, center);
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    font-weight: 600;
    background-color: #fafafa;
    margin: 0 -20px 12px -20px;
    padding: 12px 20px;

    .col-no {
      width: 60px;
      text-align: center;
    }

    .col-name {
      flex: 1;
    }
  }

  .table-row {
    @include flex(row, flex-start, center);
    padding: 8px 0;
    border-bottom: 1px solid #f9f9f9;

    &:last-child {
      border-bottom: none;
    }

    .col-no {
      width: 60px;
      text-align: center;
      color: #666;
    }

    .col-name {
      flex: 1;
      font-size: 14px;
      color: #333;
    }
  }
}

// 图表容器样式
.chart-container {
  height: 100%;
  @include flex(column, center, center);

  .pie-chart,
  .line-chart {
    width: 100%;
    height: 100%;
    @include flex(column, center, center);
  }

  .chart-legend {
    margin-bottom: 20px;

    .legend-item {
      @include flex(row, flex-start, center);
      margin-bottom: 8px;

      .legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;

        &.blue {
          background-color: #1890ff;
        }
        &.orange {
          background-color: #fa8c16;
        }
        &.green {
          background-color: #52c41a;
        }
      }
    }
  }

  .pie-placeholder,
  .chart-placeholder {
    width: 100%;
    height: 150px;
    background-color: #f9f9f9;
    border: 2px dashed #d9d9d9;
    @include flex(row, center, center);
    color: #999;
    font-size: 14px;
  }

  .chart-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 16px;
  }
}
</style>
