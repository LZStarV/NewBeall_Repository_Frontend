<template>
    <div class="login-log-page">
        <div class="page-header">
            <h1>登录日志</h1>
            <p>查看用户登录记录和系统安全日志</p>
        </div>

        <div class="content-area">
            <!-- 统计概览 -->
            <lay-row :space="16" class="stats-section">
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <h3>今日登录</h3>
                            <span class="stat-number">45</span>
                            <span class="stat-trend up">+12%</span>
                        </div>
                    </lay-card>
                </lay-col>
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <h3>活跃用户</h3>
                            <span class="stat-number">28</span>
                            <span class="stat-trend up">+5%</span>
                        </div>
                    </lay-card>
                </lay-col>
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <h3>异常登录</h3>
                            <span class="stat-number warning">3</span>
                            <span class="stat-trend down">-2</span>
                        </div>
                    </lay-card>
                </lay-col>
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <h3>失败次数</h3>
                            <span class="stat-number danger">8</span>
                            <span class="stat-trend up">+3</span>
                        </div>
                    </lay-card>
                </lay-col>
            </lay-row>

            <!-- 筛选器 -->
            <lay-card class="filter-card">
                <lay-form :model="filterForm" layout="inline">
                    <lay-form-item label="用户名">
                        <lay-input v-model="filterForm.username" placeholder="输入用户名" />
                    </lay-form-item>
                    <lay-form-item label="登录状态">
                        <lay-select v-model="filterForm.status" placeholder="选择状态">
                            <lay-select-option value="">全部状态</lay-select-option>
                            <lay-select-option value="success">成功</lay-select-option>
                            <lay-select-option value="failed">失败</lay-select-option>
                            <lay-select-option value="suspicious">异常</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item label="登录时间">
                        <lay-date-picker v-model="filterForm.startDate" placeholder="开始日期" />
                        <span style="margin: 0 8px;">至</span>
                        <lay-date-picker v-model="filterForm.endDate" placeholder="结束日期" />
                    </lay-form-item>
                    <lay-form-item label="IP地址">
                        <lay-input v-model="filterForm.ipAddress" placeholder="输入IP地址" />
                    </lay-form-item>
                    <lay-form-item>
                        <lay-button type="primary" @click="searchLogs">查询</lay-button>
                        <lay-button @click="resetFilter">重置</lay-button>
                        <lay-button @click="exportLogs">导出日志</lay-button>
                    </lay-form-item>
                </lay-form>
            </lay-card>

            <!-- 登录日志表格 -->
            <lay-card title="登录记录">
                <lay-table :columns="logColumns" :data-source="loginLogs" :pagination="pagination">
                    <template #status="{ row }">
                        <lay-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</lay-tag>
                    </template>
                    <template #device="{ row }">
                        <div class="device-info">
                            <lay-icon :type="getDeviceIcon(row.device)" />
                            <span>{{ row.device }}</span>
                        </div>
                    </template>
                    <template #location="{ row }">
                        <div class="location-info">
                            <lay-icon type="layui-icon-location" />
                            <span>{{ row.location }}</span>
                        </div>
                    </template>
                    <template #action="{ row }">
                        <lay-button size="sm" @click="viewDetails(row)">详情</lay-button>
                        <lay-button v-if="row.status === 'suspicious'" size="sm" type="danger" @click="blockIP(row)">
                            封禁IP
                        </lay-button>
                    </template>
                </lay-table>
            </lay-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const filterForm = reactive({
    username: '',
    status: '',
    startDate: '',
    endDate: '',
    ipAddress: ''
});

const logColumns = [
    { title: '用户名', key: 'username', width: 120 },
    { title: '登录时间', key: 'loginTime', width: 150 },
    { title: '登录状态', key: 'status', width: 100, customSlot: 'status' },
    { title: 'IP地址', key: 'ipAddress', width: 130 },
    { title: '地理位置', key: 'location', width: 150, customSlot: 'location' },
    { title: '设备信息', key: 'device', width: 120, customSlot: 'device' },
    { title: '浏览器', key: 'browser', width: 120 },
    { title: '持续时长', key: 'duration', width: 100 },
    { title: '操作', key: 'action', width: 120, customSlot: 'action' }
];

const loginLogs = ref([
    {
        id: 1,
        username: 'admin',
        loginTime: '2024-01-20 14:30:25',
        status: 'success',
        ipAddress: '192.168.1.100',
        location: '北京市朝阳区',
        device: 'Windows 10',
        browser: 'Chrome 120',
        duration: '2小时15分'
    },
    {
        id: 2,
        username: 'zhangsan',
        loginTime: '2024-01-20 13:45:18',
        status: 'success',
        ipAddress: '192.168.1.101',
        location: '上海市浦东新区',
        device: 'macOS',
        browser: 'Safari 17',
        duration: '3小时42分'
    },
    {
        id: 3,
        username: 'lisi',
        loginTime: '2024-01-20 12:20:05',
        status: 'failed',
        ipAddress: '203.0.113.45',
        location: '广东省深圳市',
        device: 'Windows 11',
        browser: 'Edge 119',
        duration: '-'
    },
    {
        id: 4,
        username: 'wangwu',
        loginTime: '2024-01-20 11:15:33',
        status: 'suspicious',
        ipAddress: '198.51.100.24',
        location: '海外IP',
        device: 'Linux',
        browser: 'Firefox 121',
        duration: '5分钟'
    }
]);

const pagination = reactive({
    current: 1,
    pageSize: 20,
    total: loginLogs.value.length
});

const getStatusType = (status: string) => {
    const statusMap: Record<string, string> = {
        'success': 'normal',
        'failed': 'danger',
        'suspicious': 'warm'
    };
    return statusMap[status] || 'normal';
};

const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
        'success': '成功',
        'failed': '失败',
        'suspicious': '异常'
    };
    return statusMap[status] || status;
};

const getDeviceIcon = (device: string) => {
    if (device.includes('Windows')) return 'layui-icon-windows';
    if (device.includes('macOS')) return 'layui-icon-apple';
    if (device.includes('Linux')) return 'layui-icon-linux';
    return 'layui-icon-cellphone';
};

const searchLogs = () => {
    console.log('查询登录日志:', filterForm);
};

const resetFilter = () => {
    Object.keys(filterForm).forEach(key => {
        filterForm[key as keyof typeof filterForm] = '';
    });
};

const exportLogs = () => {
    console.log('导出登录日志');
};

const viewDetails = (row: any) => {
    console.log('查看详情:', row);
};

const blockIP = (row: any) => {
    console.log('封禁IP:', row.ipAddress);
};
</script>

<style scoped lang="scss">
.login-log-page {
    padding: 24px;
}

.page-header {
    margin-bottom: 32px;

    h1 {
        margin: 0;
        color: #333;
        font-size: 28px;
    }

    p {
        margin: 8px 0 0 0;
        color: #666;
        font-size: 16px;
    }
}

.stats-section {
    margin-bottom: 24px;
}

.stat-card {
    .stat-content {
        text-align: center;
        padding: 20px;

        h3 {
            margin: 0 0 8px 0;
            color: #666;
            font-size: 14px;
        }

        .stat-number {
            display: block;
            font-size: 32px;
            font-weight: bold;
            color: #409eff;
            margin-bottom: 4px;

            &.warning {
                color: #e6a23c;
            }

            &.danger {
                color: #f56c6c;
            }
        }

        .stat-trend {
            font-size: 12px;

            &.up {
                color: #67c23a;

                &::before {
                    content: '↗ ';
                }
            }

            &.down {
                color: #f56c6c;

                &::before {
                    content: '↘ ';
                }
            }
        }
    }
}

.filter-card {
    margin-bottom: 24px;
}

.device-info,
.location-info {
    display: flex;
    align-items: center;
    gap: 4px;

    .layui-icon {
        font-size: 14px;
        color: #666;
    }
}
</style>