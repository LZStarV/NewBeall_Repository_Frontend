<template>
  <BaseCard title="数据概览">
    <template #actions>
      <lay-icon
        :type="
          currentView === 'chart' ? 'layui-icon-radio' : 'layui-icon-circle'
        "
        class="action-icon"
        :title="'最新订单统计'"
        @click="switchView('chart')"
      />
      <lay-icon
        :type="
          currentView === 'progress' ? 'layui-icon-radio' : 'layui-icon-circle'
        "
        class="action-icon"
        :title="'报价比'"
        @click="switchView('progress')"
      />
    </template>
    <div class="overview-content">
      <!-- 折线图视图 -->
      <div v-show="currentView === 'chart'" class="chart-view">
        <div class="chart-header">
          <h4 class="chart-title">最新订单统计</h4>
        </div>

        <div ref="chartContainer" class="chart-container">
          <canvas ref="lineChartRef"></canvas>
        </div>
      </div>

      <!-- 比例图视图 -->
      <div v-show="currentView === 'progress'" class="progress-view">
        <div class="charts-container">
          <!-- 临时报价/历史报价 -->
          <div class="chart-item">
            <div class="chart-wrapper">
              <canvas ref="doughnutChart1Ref"></canvas>
              <div class="chart-center-text">
                <div class="center-title">临时报价/历史报价</div>
                <div class="center-value">{{ ourselfRatio }}</div>
              </div>
            </div>
          </div>

          <!-- 个人报价/公司报价 -->
          <div class="chart-item">
            <div class="chart-wrapper">
              <canvas ref="doughnutChart2Ref"></canvas>
              <div class="chart-center-text">
                <div class="center-title">个人报价/公司报价</div>
                <div class="center-value">{{ wholeRatio }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import blackboardApi from '@/api/blackboard/blackboardApi';
import BaseCard from './BaseCard.vue';
import type {
  GetOurselfOrderNumRes,
  GetLastSixMonthsOrdeNoticeRes,
  GetWholeOrderNumRes,
} from '@/api/blackboard/blackboardApi.type';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'; // 添加 computed 导入
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  LineController,
  DoughnutController,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  DoughnutController,
);

// 展示数据
const lastSixMonthOrders = ref<GetLastSixMonthsOrdeNoticeRes>([
  0, 0, 0, 0, 0, 0,
]);
const ourselfOrderNum = ref<GetOurselfOrderNumRes>();
const wholeOrderNum = ref<GetWholeOrderNumRes>();

// 视图
const currentView = ref<'chart' | 'progress'>('chart');
// 悬停数据
const hoveredMonthIndex = ref<number>(-1);

// DOM引用
const chartContainer = ref<HTMLElement>();
const lineChartRef = ref<HTMLCanvasElement>();
const doughnutChart1Ref = ref<HTMLCanvasElement>();
const doughnutChart2Ref = ref<HTMLCanvasElement>();

// Chart实例
let lineChart: ChartJS | null = null;
let doughnutChart1: ChartJS | null = null;
let doughnutChart2: ChartJS | null = null;

// 获取主题色
const getPrimaryColor = () => {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue('--global-primary-color')
      ?.trim() || '#2d72eb'
  );
};

// 生成月份名称
const getMonthName = (index: number) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11，当前月份

  // 计算目标月份（当前月份往前推 5-index 个月）
  const targetMonth = currentMonth - (5 - index);

  // 处理跨年情况
  const monthIndex = targetMonth < 0 ? targetMonth + 12 : targetMonth;

  const monthNames = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ];

  return monthNames[monthIndex];
};

// 生成月份标签数组
const monthLabels = computed(() => {
  return Array.from({ length: 6 }, (_, i) => getMonthName(i));
});

// 创建折线图
const createLineChart = () => {
  if (!lineChartRef.value) return;

  // 销毁旧图表
  if (lineChart) {
    lineChart.destroy();
  }

  const primaryColor = getPrimaryColor();

  lineChart = new ChartJS(lineChartRef.value, {
    type: 'line',
    data: {
      labels: monthLabels.value,
      datasets: [
        {
          label: '订单数量',
          data: lastSixMonthOrders.value,
          borderColor: primaryColor,
          backgroundColor: `${primaryColor}20`, // 透明度
          pointBackgroundColor: '#ffffff',
          pointBorderColor: primaryColor,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBorderWidth: 3,
          tension: 0.3, // 曲线平滑度
          fill: true, // 填充区域
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: window.devicePixelRatio || 1, // 高DPI支持
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            font: {
              size: 12,
            },
            color: '#8c8c8c', // 图例文字颜色
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          cornerRadius: 6,
          displayColors: false,
          callbacks: {
            title: (tooltipItems) => {
              return tooltipItems[0]?.label || '';
            },
            label: (context) => {
              return `订单数量: ${context.parsed.y}`;
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false, // 隐藏垂直网格线
          },
          ticks: {
            color: '#8c8c8c',
            font: { size: 11 },
            maxTicksLimit: 6, // 最大刻度数
          },
        },
        y: {
          display: true,
          beginAtZero: true,
          grid: {
            color: '#f0f0f0',
            lineWidth: 1,
          },
          ticks: {
            color: '#8c8c8c',
            font: { size: 11 },
            // 只显示整数刻度
            callback: (value) => {
              return Number.isInteger(value as number) ? value : '';
            },
            // 设置合适的步长
            stepSize: 1,
          },
        },
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
      },
      onHover: (event, activeElements) => {
        // 更新悬停状态
        const newHoveredIndex =
          activeElements.length > 0 ? activeElements[0].index : -1;
        if (newHoveredIndex !== hoveredMonthIndex.value) {
          hoveredMonthIndex.value = newHoveredIndex;
        }
      },
      animation: {
        duration: 1200,
        easing: 'easeOutQuart',
      },
      elements: {
        line: {
          borderCapStyle: 'round',
          borderJoinStyle: 'round',
        },
        point: {
          hoverRadius: 8,
        },
      },
    },
  });
};

// 解析报价数据
const ourselfData = computed(() => {
  if (!ourselfOrderNum.value) {
    return { history: 0, temp: 0 };
  }
  const historyItem = ourselfOrderNum.value.find(
    (item) => item.name === '历史报价',
  );
  const tempItem = ourselfOrderNum.value.find(
    (item) => item.name === '临时报价',
  );

  return {
    history: historyItem ? parseInt(historyItem.value) : 0,
    temp: tempItem ? parseInt(tempItem.value) : 0,
  };
});

const wholeData = computed(() => {
  if (!wholeOrderNum.value) {
    return { personal: 0, company: 0 };
  }
  const personalItem = wholeOrderNum.value.find(
    (item) => item.name === '个人报价',
  );
  const companyItem = wholeOrderNum.value.find(
    (item) => item.name === '公司报价',
  );

  return {
    personal: personalItem ? parseInt(personalItem.value) : 0,
    company: companyItem ? parseInt(companyItem.value) : 0,
  };
});

// 计算比例显示文本
const ourselfRatio = computed(() => {
  const { history, temp } = ourselfData.value;
  return `${temp}/${history}`; // 临时报价/历史报价
});

const wholeRatio = computed(() => {
  const { personal, company } = wholeData.value;
  return `${personal}/${company}`; // 个人报价/公司报价
});

// 创建环形图
const createDoughnutCharts = () => {
  // 创建临时报价/历史报价图
  if (doughnutChart1Ref.value) {
    if (doughnutChart1) {
      doughnutChart1.destroy();
    }

    const { history, temp } = ourselfData.value;

    doughnutChart1 = new ChartJS(doughnutChart1Ref.value, {
      type: 'doughnut',
      data: {
        labels: ['历史报价', '临时报价'],
        datasets: [
          {
            data: [history, temp],
            backgroundColor: ['#1890ff', '#e0e0e0'], // 蓝色 + 浅灰色
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '90%', // 内圆大小，形成环形效果
        layout: {
          padding: 10,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top', // 图例在顶部
            labels: {
              font: { size: 12 },
              color: '#8c8c8c',
              padding: 8,
              boxWidth: 16,
              boxHeight: 8,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}:${value} (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          duration: 1500,
        },
      },
    });
  }

  // 创建个人报价/公司报价图
  if (doughnutChart2Ref.value) {
    if (doughnutChart2) {
      doughnutChart2.destroy();
    }

    const { personal, company } = wholeData.value;

    doughnutChart2 = new ChartJS(doughnutChart2Ref.value, {
      type: 'doughnut',
      data: {
        labels: ['个人报价', '公司报价'],
        datasets: [
          {
            data: [personal, company],
            backgroundColor: ['#ff9c6e', '#52c41a'], // 橙色 + 绿色
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '90%',
        layout: {
          padding: 10,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 12 },
              color: '#8c8c8c',
              padding: 8,
              boxWidth: 16,
              boxHeight: 8,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}:${value} (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          duration: 1500,
        },
      },
    });
  }
};

// 切换视图
const switchView = (viewKey: 'chart' | 'progress') => {
  currentView.value = viewKey;

  nextTick(() => {
    if (viewKey === 'chart') {
      createLineChart();
    } else if (viewKey === 'progress') {
      createDoughnutCharts();
    }
  });
};

// API数据获取
// 获取最近六月份的订单数量
const getLastSixMonthOrders = async () => {
  const res = await blackboardApi.getLastSixMonthsOrdeNotice();
  if (!res) return;
  lastSixMonthOrders.value = res.data || res;
};

// 获取历史/临时报价比
const getOurselfOrderNum = async () => {
  const res = await blackboardApi.getOurselfOrderNum();
  if (!res) return;

  ourselfOrderNum.value = res.data || res;
};

// 获取个人/公司报价比例
const getWholeOrderNum = async () => {
  const res = await blackboardApi.getWholeOrderNum();
  if (!res) return;
  wholeOrderNum.value = res.data || res;
};

// 初始化数据和图表
const initializeChart = async () => {
  // 1. 先获取所有数据
  await Promise.all([
    getLastSixMonthOrders(),
    getOurselfOrderNum(),
    getWholeOrderNum(),
  ]);

  // 2. 数据获取完成后创建图表
  await nextTick();
  if (currentView.value === 'chart') {
    createLineChart();
  } else if (currentView.value === 'progress') {
    createDoughnutCharts();
  }
};

// 初始化
onMounted(() => {
  initializeChart();
});

// 清理资源
onUnmounted(() => {
  if (lineChart) {
    lineChart.destroy();
    lineChart = null;
  }
  if (doughnutChart1) {
    doughnutChart1.destroy();
    doughnutChart1 = null;
  }
  if (doughnutChart2) {
    doughnutChart2.destroy();
    doughnutChart2 = null;
  }
});
</script>

<style lang="scss" scoped>
.overview-content {
  height: 100%;
  @include flex(column);
}

.action-icon {
  &:hover {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

// 折线图视图
.chart-view {
  height: 100%;
  @include flex(column);

  .chart-header {
    margin-bottom: 8px;

    .chart-title {
      font-size: 14px;
      color: #262626;
      margin: 0;
      font-weight: 500;
    }
  }

  .chart-container {
    flex: 1;
    position: relative;
    margin-bottom: 10px;
    min-height: 250px;

    canvas {
      width: 100% !important;
      height: 100% !important;
      border-radius: 8px;
    }
  }
}

// 比例图视图
.progress-view {
  height: 100%;
  @include flex(column);
  padding: 4px 0;

  .charts-container {
    flex: 1;
    @include flex(row, space-around, center);
    gap: 10px;

    .chart-item {
      @include flex(column, center, center);
      flex: 1;

      .chart-wrapper {
        position: relative;
        width: 100%;
        height: 250px; // 增加高度容纳图例
        overflow: visible;

        canvas {
          overflow: visible !important;
          width: 100% !important;
          height: 100% !important;
        }

        .chart-center-text {
          position: absolute;
          top: 60%; // 调整位置，因为图例在顶部
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          pointer-events: none;

          .center-title {
            font-size: 10px;
            color: #8c8c8c;
            margin-bottom: 3px;
            line-height: 1.2;
            white-space: nowrap;
          }

          .center-value {
            font-size: 16px;
            font-weight: 600;
            color: var(--global-primary-color);
          }
        }
      }
    }
  }
}
</style>
