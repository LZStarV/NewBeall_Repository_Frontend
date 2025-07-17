<template>
    <div class="dashboard">
        <div class="dashboard-header">
            <h1>工作台</h1>
            <p>欢迎回来！这里是您的工作台概览。</p>
        </div>

        <!-- 统计卡片 -->
        <lay-row :space="16" class="stats-row">
            <lay-col :md="6" :sm="12" :xs="24" v-for="stat in stats" :key="stat.title">
                <lay-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon" :style="{ backgroundColor: stat.color }">
                            <lay-icon :type="stat.icon" />
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">{{ stat.value }}</div>
                            <div class="stat-title">{{ stat.title }}</div>
                        </div>
                    </div>
                </lay-card>
            </lay-col>
        </lay-row>

        <!-- 快捷操作 -->
        <lay-card title="快捷操作" class="quick-actions">
            <lay-row :space="16">
                <lay-col :md="4" :sm="8" :xs="12" v-for="action in quickActions" :key="action.title">
                    <div class="action-item" @click="action.action">
                        <lay-icon :type="action.icon" />
                        <span>{{ action.title }}</span>
                    </div>
                </lay-col>
            </lay-row>
        </lay-card>

        <!-- 最近活动 -->
        <lay-card title="最近活动" class="recent-activities">
            <lay-table :columns="activityColumns" :data-source="activities" :pagination="false" size="sm" />
        </lay-card>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 统计数据
const stats = ref([
    {
        title: '项目总数',
        value: '128',
        icon: 'layui-icon-file',
        color: '#1890ff'
    },
    {
        title: '待处理报价',
        value: '23',
        icon: 'layui-icon-dollar',
        color: '#52c41a'
    },
    {
        title: '客户数量',
        value: '89',
        icon: 'layui-icon-friends',
        color: '#faad14'
    },
    {
        title: '本月收入',
        value: '¥156,789',
        icon: 'layui-icon-chart',
        color: '#f5222d'
    }
])

// 快捷操作
const quickActions = ref([
    {
        title: '新建项目',
        icon: 'layui-icon-add-1',
        action: () => router.push('/business/project')
    },
    {
        title: '创建报价',
        icon: 'layui-icon-dollar',
        action: () => router.push('/business/quote')
    },
    {
        title: '客户管理',
        icon: 'layui-icon-user',
        action: () => router.push('/business/customer')
    },
    {
        title: '数据报表',
        icon: 'layui-icon-chart-screen',
        action: () => router.push('/analytics/reports')
    },
    {
        title: '系统设置',
        icon: 'layui-icon-set',
        action: () => router.push('/settings')
    },
    {
        title: '帮助文档',
        icon: 'layui-icon-help',
        action: () => console.log('打开帮助文档')
    }
])

// 活动表格列
const activityColumns = ref([
    {
        title: '时间',
        key: 'time',
        width: '150px'
    },
    {
        title: '操作',
        key: 'action'
    },
    {
        title: '详情',
        key: 'detail'
    },
    {
        title: '状态',
        key: 'status',
        customSlot: 'status'
    }
])

// 最近活动数据
const activities = ref([
    {
        time: '2024-01-15 14:30',
        action: '创建项目',
        detail: '智能安防系统集成项目',
        status: '成功'
    },
    {
        time: '2024-01-15 11:20',
        action: '生成报价',
        detail: '办公楼监控系统报价单',
        status: '成功'
    },
    {
        time: '2024-01-15 09:15',
        action: '客户登记',
        detail: '新增客户：XX科技有限公司',
        status: '成功'
    },
    {
        time: '2024-01-14 16:45',
        action: '系统备份',
        detail: '数据库定时备份',
        status: '成功'
    }
])
</script>

<style scoped lang="scss">
.dashboard {
    .dashboard-header {
        margin-bottom: 24px;

        h1 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 600;
            color: var(--text-primary);
        }

        p {
            margin: 0;
            color: var(--text-secondary);
        }
    }

    .stats-row {
        margin-bottom: 24px;
    }

    .stat-card {
        .stat-content {
            display: flex;
            align-items: center;

            .stat-icon {
                width: 48px;
                height: 48px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 16px;

                .layui-icon {
                    font-size: 24px;
                    color: white;
                }
            }

            .stat-info {
                .stat-value {
                    font-size: 24px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 4px;
                }

                .stat-title {
                    font-size: 14px;
                    color: var(--text-secondary);
                }
            }
        }
    }

    .quick-actions {
        margin-bottom: 24px;

        .action-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
                background-color: var(--background-color-page);
                transform: translateY(-2px);
            }

            .layui-icon {
                font-size: 32px;
                color: var(--global-primary-color);
                margin-bottom: 8px;
            }

            span {
                font-size: 14px;
                color: var(--text-primary);
            }
        }
    }

    .recent-activities {
        // 活动表格样式可以在这里自定义
    }
}
</style>
```

```
