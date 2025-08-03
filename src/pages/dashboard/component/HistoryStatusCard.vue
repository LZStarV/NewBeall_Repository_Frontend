<template>
  <BaseCard title="历史报价状态">
    <div class="status-content">
      <div class="chart-container">
        <canvas ref="pieChartRef"></canvas>
      </div>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import BaseCard from './BaseCard.vue';
import type { GetOrdersTypeRes } from '@/api/blackboard/blackboardApi.type';
import blackboardApi from '@/api/blackboard/blackboardApi';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PieController,
} from 'chart.js';

// 注册Chart.js组件
ChartJS.register(ArcElement, Tooltip, Legend, PieController);

const orderType = ref<GetOrdersTypeRes>();
const pieChartRef = ref<HTMLCanvasElement>();

// Chart实例
let pieChart: ChartJS | null = null;

// 计算图表数据
const chartData = computed(() => {
  if (!orderType.value?.right) {
    return {
      labels: [],
      data: [],
      total: 0,
    };
  }

  const labels = orderType.value.right.map((item) => item.name);
  const originalData = orderType.value.right.map(
    (item) => parseFloat(item.value) || 0,
  );
  const total = originalData.reduce((sum, val) => sum + val, 0);

  let displayData = originalData;
  let isAllZero = total === 0;

  if (isAllZero && labels.length > 0) {
    // 如果全为0，给每个分段分配相等的值（比如1）用于显示
    displayData = new Array(labels.length).fill(1);
  }

  return {
    labels,
    data: displayData,
    originalData,
    total,
    isAllZero,
  };
});

// 状态对应的颜色配置
const getStatusColors = () => {
  return [
    '#f191a2', // 红色
    '#4fd4b0', // 蓝绿色
    '#62a4e9', // 蓝色
    '#9ac640', // 绿色
    '#f9ab54', // 橙色
    '#a2aefe', // 紫色
  ];
};

// 创建饼图
const createPieChart = () => {
  if (!pieChartRef.value || chartData.value.labels.length === 0) {
    return;
  }

  // 销毁已存在的图表
  if (pieChart) {
    pieChart.destroy();
  }

  const { labels, data, originalData, total, isAllZero } = chartData.value;
  const colors = getStatusColors();
  pieChart = new ChartJS(pieChartRef.value, {
    type: 'pie',
    data: {
      labels: labels as string[],
      datasets: [
        {
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          hoverOffset: 30, // 悬停时的偏移效果
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1,
      layout: {
        padding: 10,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: { size: 12 },
            color: '#666',
            padding: 12,
            boxWidth: 32,
            boxHeight: 12,
            usePointStyle: false,
            generateLabels: function (chart) {
              const data = chart.data;
              if (data.labels) {
                return data.labels.map((label, i) => {
                  const value = originalData![i] || 0;
                  const backgroundColor = data.datasets?.[0]?.backgroundColor;
                  const color = Array.isArray(backgroundColor)
                    ? backgroundColor[i]
                    : backgroundColor;

                  return {
                    text: `${label} 累计: ¥${value.toFixed(2)}`,
                    fillStyle: color || '#ccc',
                    strokeStyle: color || '#ccc',
                    lineWidth: 0,
                    hidden: false,
                    index: i,
                  };
                });
              }
              return [];
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#333',
          borderWidth: 1,
          cornerRadius: 6,
          callbacks: {
            title: () => {
              return ''; // 不显示标题
            },
            label: (context) => {
              const originalValue = originalData?.[context.dataIndex] || 0;
              const label = labels[context.dataIndex];

              if (isAllZero) {
                return `${label}: ${originalValue} (0%)`;
              } else {
                const percentage =
                  total > 0 ? ((originalValue / total) * 100).toFixed(1) : '0';
                return `${label}: ${originalValue} (${percentage}%)`;
              }
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1500,
        easing: 'easeOutQuart',
      },
      interaction: {
        intersect: false,
        mode: 'point',
      },
    },
  });
};

const getOrderType = async () => {
  const res = await blackboardApi.getOrdersType();
  if (!res) return;
  orderType.value = res.data || res;

  // 数据加载完成后创建图表
  await nextTick();
  createPieChart();
};

onMounted(() => {
  getOrderType();
});

onUnmounted(() => {
  if (pieChart) {
    pieChart.destroy();
    pieChart = null;
  }
});
</script>

<style lang="scss" scoped>
.status-content {
  height: 100%;
  @include flex(column);

  .chart-container {
    flex: 1;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 250px;

    canvas {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>
