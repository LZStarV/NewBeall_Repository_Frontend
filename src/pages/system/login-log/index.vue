<template>
    <div class="login-log-page">
        <!-- 搜索过滤区域 -->
        <lay-card class="filter-card">
            <div class="filter-section">
                <lay-form :model="filterForm" layout="inline">
                    <lay-form-item label="开始时间">
                        <lay-date-picker
v-model="filterForm.startTime" type="datetime" placeholder="请选择开始时间"
                            style="width: 150px" />
                    </lay-form-item>
                    <lay-form-item label="结束时间">
                        <lay-date-picker
v-model="filterForm.endTime" type="datetime" placeholder="请选择结束时间"
                            style="width: 150px" />
                    </lay-form-item>
                    <lay-form-item label="日志名称">
                        <lay-select v-model="filterForm.logName" placeholder="全部" style="width: 150px">
                            <lay-select-option value="全部">全部</lay-select-option>
                            <lay-select-option value="业务日志">业务日志</lay-select-option>
                            <lay-select-option value="异常日志">异常日志</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item label="用户名称">
                        <lay-select v-model="filterForm.userName" placeholder="请选择" style="width: 120px">
                            <lay-select-option value="">请选择</lay-select-option>
                            <lay-select-option value="张三">张三</lay-select-option>
                            <lay-select-option value="李四">李四</lay-select-option>
                            <lay-select-option value="王五">王五</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item>
                        <lay-button type="primary" @click="handleSearch">
                            <lay-icon type="layui-icon-search" />
                        </lay-button>
                    </lay-form-item>
                </lay-form>
            </div>
        </lay-card>

        <!-- 表格区域 -->
        <lay-card class="table-card">
            <!-- 工具栏区域 -->
            <div class="fixed-table-toolbar">
                <span data-title="导出" class="btnIcon invite-but" @click="handleExport">
                    <lay-icon type="layui-icon-download-circle" />
                </span>
                <span data-title="清空日志" class="btnIcon invite-but" @click="handleClearLog">
                    <lay-icon type="layui-icon-delete" />
                </span>

                <button
class="btn btn-default btn-outline" type="button" name="refresh" aria-label="refresh" title="刷新"
                    @click="handleRefresh">
                    <lay-icon type="layui-icon-refresh" />
                </button>

                <div class="dropdown-container">
                    <button
type="button" aria-label="columns" class="btn btn-default btn-outline dropdown-toggle"
                        @click="toggleColumnsDropdown">
                        <lay-icon type="layui-icon-shrink-right" />
                    </button>
                    <ul class="dropdown-menu" :class="{ 'show': showColumnsDropdown }">
                        <li role="menuitem">
                            <label>
                                <input
v-model="columnVisibility.logname" type="checkbox"
                                    @change="updateVisibleColumns" /> 日志名称
                            </label>
                        </li>
                        <li role="menuitem">
                            <label>
                                <input
v-model="columnVisibility.userName" type="checkbox"
                                    @change="updateVisibleColumns" /> 用户名称
                            </label>
                        </li>
                        <li role="menuitem">
                            <label>
                                <input
v-model="columnVisibility.createtime" type="checkbox"
                                    @change="updateVisibleColumns" /> 创建时间
                            </label>
                        </li>
                        <li role="menuitem">
                            <label>
                                <input
v-model="columnVisibility.message" type="checkbox"
                                    @change="updateVisibleColumns" /> 具体消息
                            </label>
                        </li>
                        <li role="menuitem">
                            <label>
                                <input v-model="columnVisibility.ip" type="checkbox" @change="updateVisibleColumns" />
                                IP地址
                            </label>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- 登录日志列表表格 -->
            <div class="table-container">
                <lay-table
:columns="visibleColumns" :data-source="tableData" :page="pagination"
                    @change="handleTableChange">
                    <!-- 具体消息列 -->
                    <template #message="{ row }">
                        <span class="message-text" :title="row.message">
                            {{ row.message }}
                        </span>
                    </template>
                    <!-- IP列 -->
                    <template #ip="{ row }">
                        <span class="ip-text">{{ row.ip }}</span>
                    </template>
                </lay-table>
            </div>
        </lay-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import http from '@/utils/http';
import Notify from '@/utils/notify';

// 登录日志接口类型定义
interface LoginLog {
    logname: string;      // 对应返回数据的 logname
    userName: string;     // 对应返回数据的 userName  
    createtime: string;   // 对应返回数据的 createtime
    message: string;      // 对应返回数据的 message
    ip: string;          // 对应返回数据的 ip
    userid?: number;     // 可选的用户ID
    regularMessage?: string; // 可选的规范化消息
}

// 工具栏状态
const showColumnsDropdown = ref(false);

// 列显示控制
const columnVisibility = reactive({
    logname: true,        // 修改为 logname
    userName: true,
    createtime: true,     // 修改为 createtime  
    message: true,
    ip: true
});

// 过滤表单
const filterForm = reactive({
    startTime: '',
    endTime: '',
    logName: '',
    userName: ''
});

// 所有可用的列配置
const allColumns = [
    { title: '日志名称', key: 'logname', width: '150px' },
    { title: '用户名称', key: 'userName', width: '120px' },
    { title: '创建时间', key: 'createtime', width: '180px' },      // 更新列标题
    { title: '具体消息', key: 'message', width: '300px', customSlot: 'message' },
    { title: 'IP地址', key: 'ip', width: '200px', customSlot: 'ip' }
];

// 动态计算可见的列
const visibleColumns = computed(() => {
    return allColumns.filter(column => columnVisibility[column.key as keyof typeof columnVisibility]);
});
// 获取登录日志列表
const fetchLoginLogList = async () => {
    try {
        // 使用FormData格式发送表单数据
        const formData = new FormData();
        formData.append('order', 'desc');
        formData.append('offset', ((pagination.current - 1) * pagination.limit).toString());
        formData.append('limit', pagination.limit.toString());

        const response = await http.post('/loginLog/list', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        // 处理返回的数据，提取rows数组
        if (response && response.rows && Array.isArray(response.rows)) {
            tableData.value = response.rows;
        }
    } catch {
        Notify.error({
            title: '获取数据失败',
            content: '无法获取登录日志，请稍后重试',
            time: 3000
        });
    }
};

// 表格数据
const tableData = ref<LoginLog[]>([]);
// 分页配置
const pagination = reactive({
    current: 1,
    limit: 50,
    total: 1115
});

// 更新可见列（当checkbox状态改变时触发）
const updateVisibleColumns = () => {
    console.log('当前可见列:', Object.keys(columnVisibility).filter(key => columnVisibility[key as keyof typeof columnVisibility]));
};

// 表格变化处理
const handleTableChange = (pageData: { current: number; limit: number }) => {
    pagination.current = pageData.current;
    pagination.limit = pageData.limit;
    fetchLoginLogList(); // 重新获取数据
};

// 搜索处理
const handleSearch = () => {
    pagination.current = 1;
    fetchLoginLogList(); // 重新获取数据
};

// 导出日志
const handleExport = () => {
    console.log('导出登录日志');
};

// 清空日志
const handleClearLog = () => {
    console.log('清空登录日志');
};

// 刷新
const handleRefresh = () => {
    fetchLoginLogList(); // 直接重新获取数据
};

// 切换列显示下拉菜单
const toggleColumnsDropdown = () => {
    showColumnsDropdown.value = !showColumnsDropdown.value;
};
onMounted(() => {
    fetchLoginLogList();
});
</script>

<style scoped lang="scss">
// 登录日志页面样式
.login-log-page {
    padding: 24px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

// 搜索过滤卡片
.filter-card {
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

// 表格卡片
.table-card {
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    flex: 1;
}

// 搜索过滤区域样式
.filter-section {
    background: white;
    padding: 16px 20px;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

    :deep(.layui-form) {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0 12px;
        margin: 0;
    }

    :deep(.layui-form-item) {
        margin: 0 12px 8px 0;
        flex-shrink: 0;
        display: flex;
        align-items: stretch;
        position: relative;
    }

    :deep(.layui-form-label) {
        font-size: 12px;
        font-weight: 500;
        color: #333;
        background: #fafafa;
        border: 1px solid #d9d9d9;
        border-right: none;
        border-radius: 4px 0 0 4px;
        padding: 0 8px;
        margin: 0;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        line-height: 1;
        min-width: 70px;

        &::after {
            display: none;
        }
    }

    :deep(.layui-input) {
        height: 32px;
        font-size: 12px;
        border: 1px solid #d9d9d9;
        border-left: none;
        border-radius: 0 4px 4px 0;
        padding: 0 12px;
        margin: 0;
        transition: all 0.2s ease;

        &:hover {
            border-color: #40a9ff;
        }

        &:focus {
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
            outline: none;
        }

        &::placeholder {
            color: #bfbfbf;
            font-size: 11px;
        }
    }

    :deep(.layui-select) {
        .layui-select-input {
            height: 32px;
            font-size: 12px;
            border: 1px solid #d9d9d9;
            border-left: none;
            border-radius: 0 4px 4px 0;
            padding: 0 12px;
            margin: 0;
            transition: all 0.2s ease;

            &:hover {
                border-color: #40a9ff;
            }

            &:focus {
                border-color: #1890ff;
                box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
            }
        }
    }

    :deep(.layui-date-picker) {
        .layui-input {
            height: 32px;
            font-size: 12px;
            border: 1px solid #d9d9d9;
            border-left: none;
            border-radius: 0 4px 4px 0;
            padding: 0 12px;
            margin: 0;
            transition: all 0.2s ease;

            &:hover {
                border-color: #40a9ff;
            }

            &:focus {
                border-color: #1890ff;
                box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
            }
        }
    }

    :deep(.layui-form-item) {
        &:focus-within {
            .layui-form-label {
                border-color: #1890ff;
                background: #e6f7ff;
            }
        }

        &:hover {
            .layui-form-label {
                border-color: #40a9ff;
                background: #f0f9ff;
            }
        }
    }

    :deep(.layui-btn) {
        height: 32px;
        padding: 0 12px;
        font-size: 12px;
        border-radius: 4px;
        margin-right: 8px;
        min-width: 36px;
        line-height: 20px;
        transition: all 0.2s ease;


    }
}

// 工具栏样式
.fixed-table-toolbar {
    padding: 15px 20px;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 0;
    background: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;

    .btnIcon,
    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #495057;

        &:hover {
            background: #e9ecef;
            border-color: #adb5bd;
        }

        .layui-icon {
            font-size: 15px;
            line-height: 1;
        }
    }

    .invite-but {
        position: relative;

        &:hover::after {
            content: attr(data-title);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 8px;
            padding: 6px 10px;
            background: #333;
            color: #fff;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        &:hover::before {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 2px;
            border: 4px solid transparent;
            border-top-color: #333;
            z-index: 1001;
        }
    }

    .dropdown-container {
        position: relative;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 1000;
        display: none;
        min-width: 160px;
        padding: 5px 0;
        margin: 2px 0 0;
        font-size: 12px;
        text-align: left;
        list-style: none;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);

        &.show {
            display: block;
        }

        li {
            &:hover {
                background-color: #f5f5f5;
            }

            label {
                display: block;
                padding: 8px 15px;
                font-weight: normal;
                line-height: 1.4;
                color: #333;
                white-space: nowrap;
                cursor: pointer;
                margin: 0;

                input[type="checkbox"] {
                    margin-right: 8px;
                }
            }
        }
    }
}

// 表格容器样式
.table-container {
    padding: 0 20px 20px;

    :deep(.layui-table) {
        border: 1px solid #e8e8e8;
        border-radius: 6px;
        overflow: hidden;

        .layui-table-header {
            background: #fafafa;
        }

        .layui-table-body {
            font-size: 12px;

            tr:nth-child(even) {
                background-color: #fafafa;
            }

            tr:hover {
                background-color: #f5f5f5;
            }
        }

        th,
        td {
            border-color: #e8e8e8;
            text-align: center;
            padding: 8px 6px;
        }

        .layui-table-cell-content {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}

// 具体消息文本样式
.message-text {
    font-size: 12px;
    color: #333;
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: help;
}

// IP文本样式
.ip-text {
    font-size: 12px;
    color: #666;
    font-family: monospace;
}
</style>
<style lang="scss">
.layui-table-cell-content {
    display: flex;
    word-break: break-word;
    align-items: center;
    justify-content: center;
}

.layui-table th {
    text-align: center;
}
</style>