<template>
  <section class="stats-section">
    <lay-container fluid>
      <lay-row space="24">
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
</template>
<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const dashboardStore = useDashboardStore();

// 定义统计卡片的类型接口
interface StatsCard {
  id: number;
  number: number;
  label: string;
  icon: string;
  colorClass:
    | 'card-blue'
    | 'card-purple'
    | 'card-pink'
    | 'card-orange'
    | 'card-green'
    | 'card-lime';
  route: string;
}

// 统计卡片数据
const statsCards = computed<StatsCard[]>(() => [
  {
    id: 1,
    number: dashboardStore.approNum,
    label: '报价审批',
    icon: 'layui-icon-edit',
    colorClass: 'card-blue',
    route: '/quote/approval-record',
  },
  {
    id: 2,
    number: dashboardStore.unReadNum,
    label: '即时通讯',
    icon: 'layui-icon-reply-fill',
    colorClass: 'card-purple',
    route: '/chat',
  },
  {
    id: 3,
    number: dashboardStore.delApproNum,
    label: '删除审批',
    icon: 'layui-icon-delete',
    colorClass: 'card-pink',
    route: '/quote/delete-application',
  },
  {
    id: 4,
    number: dashboardStore.unReadNoticeNum,
    label: '未读订单',
    icon: 'layui-icon-form',
    colorClass: 'card-orange',
    route: '/order/send-list',
  },
  {
    id: 5,
    number: dashboardStore.discountNum,
    label: '折率审批',
    icon: 'layui-icon-read',
    colorClass: 'card-green',
    route: '/quote/order-discount-application',
  },
  {
    id: 6,
    number: dashboardStore.inventoryOrdersNum,
    label: '未处理订单',
    icon: 'layui-icon-survey',
    colorClass: 'card-lime',
    route: '/order/receive-list',
  },
]);

// 点击卡片跳转页面
const handleCardClick = (card: StatsCard) => {
  if (card.route) {
    router.push(card.route);
  }
};
</script>

<style lang="scss" scoped>
.stats-section {
  margin-bottom: 10px;
}
.stat-card {
  @include flex(row, space-between, center);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  height: 110px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .card-content {
    @include flex(column, center, flex-start);
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

  .card-icon {
    @include flex-center();
    color: white;
    height: 100%;

    .layui-icon {
      font-size: 36px;
    }
  }

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
</style>
