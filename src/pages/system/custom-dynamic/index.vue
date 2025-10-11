<template>
    <div class="custom-dynamic-page">
        <lay-card class="table-card">
            <!-- 工具栏区域 -->
            <div class="fixed-table-toolbar">
                <span data-title="动态接收人" class="btnIcon invite-but" @click="handleAuthorize">
                    <lay-icon type="layui-icon-add-circle" />
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
v-model="columnVisibility.functionDescription" type="checkbox"
                                    @change="updateVisibleColumns" /> 功能描述
                            </label>
                        </li>
                        <li role="menuitem">
                            <label>
                                <input
v-model="columnVisibility.functionTopicDescription" type="checkbox"
                                    @change="updateVisibleColumns" /> 功能主题
                            </label>
                        </li>
                        <li role="menuitem">
                            <label>
                                <input
v-model="columnVisibility.functionType" type="checkbox"
                                    @change="updateVisibleColumns" /> 功能类型
                            </label>
                        </li>
                        <li role="menuitem">
                            <label>
                                <input
v-model="columnVisibility.defaultRecipient" type="checkbox"
                                    @change="updateVisibleColumns" /> 默认接收人
                            </label>
                        </li>
                        <li role="menuitem">
                            <label>
                                <input
v-model="columnVisibility.messageType" type="checkbox"
                                    @change="updateVisibleColumns" /> 消息类型
                            </label>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- 自定义动态列表表格 -->
            <div class="table-container">
                <lay-table
:columns="visibleColumns" :data-source="tableData" :page="pagination"
                    @change="handleTableChange">
                    <!-- 功能主题描述列 -->
                    <template #functionTopicDescription="{ row }">
                        <span class="topic-text" :title="row.functionTopicDescription">
                            {{ row.functionTopicDescription }}
                        </span>
                    </template>

                    <!-- 功能类型列 -->
                    <template #functionType="{ row }">
                        <span class="type-tag" :class="getTypeTagClass(row.functionType)">
                            {{ getFunctionTypeName(row.functionType) }}
                        </span>
                    </template>

                    <!-- 默认接收人列 -->
                    <template #defaultRecipient="{ row }">
                        <div class="recipient-tags">
                            <span
v-for="tag in parseRecipients(row.defaultRecipient)" :key="tag" class="recipient-tag"
                                :class="getRecipientTagClass(tag)">
                                {{ tag }}
                            </span>
                        </div>
                    </template>

                    <!-- 消息类型列 -->
                    <template #messageType="{ row }">
                        <span class="message-type-tag" :class="getMessageTypeClass(row.messageType)">
                            {{ getMessageTypeName(row.messageType) }}
                        </span>
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

// 自定义动态接口类型定义
interface CustomDynamic {
    id: number;
    functionDescription: string;
    functionEnum: string;
    functionState: string;
    functionTopicDescription: string;
    functionType: number;
    defaultRecipient: string;
    messageDescription: string;
    messageType: number;
    queryType: string;
    templateId: string;
    templateParam: string;
}

// 工具栏状态
const showColumnsDropdown = ref(false);

// 列显示控制
const columnVisibility = reactive({
    functionDescription: true,
    functionTopicDescription: true,
    functionType: true,
    defaultRecipient: true,
    messageType: true
});

// 所有可用的列配置
const allColumns = [
    { title: '功能描述', key: 'functionDescription', width: '200px' },
    { title: '功能主题', key: 'functionTopicDescription', width: '350px', customSlot: 'functionTopicDescription' },
    { title: '功能类型', key: 'functionType', width: '120px', customSlot: 'functionType' },
    { title: '默认接收人', key: 'defaultRecipient', width: '280px', customSlot: 'defaultRecipient' },
    { title: '消息类型', key: 'messageType', width: '120px', customSlot: 'messageType' }
];

// 动态计算可见的列
const visibleColumns = computed(() => {
    return allColumns.filter(column => columnVisibility[column.key as keyof typeof columnVisibility]);
});

// 获取自定义动态列表
const fetchCustomDynamicList = async () => {
    try {
        const formData = new FormData();
        formData.append('order', 'desc');
        formData.append('offset', ((pagination.current - 1) * pagination.limit).toString());
        formData.append('limit', pagination.limit.toString());

        const response = await http.post('/msgType/list', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if (response && response.rows && Array.isArray(response.rows)) {
            tableData.value = response.rows;
            pagination.total = response.total || response.rows.length;
        }
    } catch {
        Notify.error({
            title: '获取数据失败',
            content: '无法获取自定义动态数据，请稍后重试',
            time: 3000
        });
    }
};

// 表格数据
const tableData = ref<CustomDynamic[]>([]);

// 分页配置
const pagination = reactive({
    current: 1,
    limit: 50,
    total: 0
});

// 解析接收人字符串为数组
const parseRecipients = (recipients: string) => {
    if (!recipients) return [];
    return recipients.split('，').filter(item => item.trim());
};

// 获取功能类型名称
const getFunctionTypeName = (type: number) => {
    const typeMap: Record<number, string> = {
        1: '审批申请',
        2: '审批结果',
        3: '删除申请',
        4: '删除结果',
        10: '系统通知',
        11: '操作通知',
        12: '共享通知',
        13: '会员通知',
        14: '协作通知',
        15: '用户通知',
        16: '报价通知',
        17: '奖励通知',
        18: '自动处理',
        20: '需求通知'
    };
    return typeMap[type] || `类型${type}`;
};

// 获取消息类型名称
const getMessageTypeName = (type: number) => {
    const messageMap: Record<number, string> = {
        1: '审批消息',
        2: '共享消息',
        5: '删除消息',
        8: '操作消息',
        9: '协作消息',
        10: '系统消息',
        12: '建议消息',
        13: '结束消息',
        14: '审核消息',
        15: '接收消息',
        17: '奖励消息',
        18: '自动消息'
    };
    return messageMap[type] || `消息${type}`;
};

// 获取功能类型标签样式
const getTypeTagClass = (type: number) => {
    if (type >= 1 && type <= 4) return 'approval';
    if (type >= 10 && type <= 11) return 'system';
    if (type === 12) return 'share';
    if (type === 13) return 'member';
    if (type === 14) return 'cooperation';
    if (type === 15) return 'user';
    if (type >= 16 && type <= 18) return 'business';
    if (type === 20) return 'demand';
    return 'default';
};

// 获取消息类型样式
const getMessageTypeClass = (type: number) => {
    if (type === 1 || type === 5) return 'approval';
    if (type === 2) return 'share';
    if (type === 8) return 'operation';
    if (type === 9 || type === 13) return 'cooperation';
    if (type === 10 || type === 12 || type === 14) return 'system';
    if (type === 15 || type === 17 || type === 18) return 'business';
    return 'default';
};

// 获取接收人标签样式
const getRecipientTagClass = (recipient: string) => {
    const classMap: Record<string, string> = {
        '拥有审批权限上级': 'approval-superior',
        '管理员': 'admin',
        '所有处理人': 'processor',
        '创建者': 'creator',
        '所有上级': 'all-superior',
        '负责人及其上级': 'manager',
        '拥有会员管理权限的用户': 'member-admin',
        '拥有会员建议权限的用户': 'suggest-admin',
        '协作人': 'collaborator',
        '协作人或者发起人': 'cooperation-user',
        '公司注册人': 'register-user',
        '指定用户': 'specific-user'
    };
    return classMap[recipient] || 'default';
};

// 更新可见列
const updateVisibleColumns = () => {
    console.log('当前可见列:', Object.keys(columnVisibility).filter(key => columnVisibility[key as keyof typeof columnVisibility]));
};

// 表格变化处理
const handleTableChange = (pageData: { current: number; limit: number }) => {
    pagination.current = pageData.current;
    pagination.limit = pageData.limit;
    fetchCustomDynamicList();
};

// 动态接收人授权处理
const handleAuthorize = () => {
    console.log('动态接收人授权');
};

// 刷新
const handleRefresh = () => {
    fetchCustomDynamicList();
};

// 切换列显示下拉菜单
const toggleColumnsDropdown = () => {
    showColumnsDropdown.value = !showColumnsDropdown.value;
};

onMounted(() => {
    fetchCustomDynamicList();
});
</script>

<style scoped lang="scss">
// 自定义动态页面样式
.custom-dynamic-page {
    padding: 24px;
    min-height: 100vh;
}

// 表格卡片
.table-card {
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
            font-size: 18px;
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

// 功能主题文本样式
.topic-text {
    font-size: 12px;
    color: #333;
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: help;
}

// 功能类型标签样式
.type-tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    border: 1px solid;

    &.approval {
        background: #fff7e6;
        color: #fa8c16;
        border-color: #ffd591;
    }

    &.system {
        background: #f9f0ff;
        color: #722ed1;
        border-color: #d3adf7;
    }

    &.share {
        background: #e6fffb;
        color: #13c2c2;
        border-color: #87e8de;
    }

    &.member {
        background: #f0f9ff;
        color: #096dd9;
        border-color: #bae7ff;
    }

    &.cooperation {
        background: #fff2e8;
        color: #fa8c16;
        border-color: #ffbb96;
    }

    &.user {
        background: #f6ffed;
        color: #52c41a;
        border-color: #b7eb8f;
    }

    &.business {
        background: #e6f7ff;
        color: #1890ff;
        border-color: #91d5ff;
    }

    &.demand {
        background: #fff1f0;
        color: #f5222d;
        border-color: #ffa39e;
    }

    &.default {
        background: #fafafa;
        color: #666;
        border-color: #d9d9d9;
    }
}

// 消息类型标签样式
.message-type-tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    border: 1px solid;

    &.approval {
        background: #fff7e6;
        color: #fa8c16;
        border-color: #ffd591;
    }

    &.share {
        background: #e6fffb;
        color: #13c2c2;
        border-color: #87e8de;
    }

    &.operation {
        background: #f0f9ff;
        color: #096dd9;
        border-color: #bae7ff;
    }

    &.cooperation {
        background: #fff2e8;
        color: #fa8c16;
        border-color: #ffbb96;
    }

    &.system {
        background: #f9f0ff;
        color: #722ed1;
        border-color: #d3adf7;
    }

    &.business {
        background: #e6f7ff;
        color: #1890ff;
        border-color: #91d5ff;
    }

    &.default {
        background: #fafafa;
        color: #666;
        border-color: #d9d9d9;
    }
}

// 接收人标签样式
.recipient-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
}

.recipient-tag {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 500;
    white-space: nowrap;
    border: 1px solid;

    &.approval-superior {
        background: #fff1f0;
        color: #f5222d;
        border-color: #ffa39e;
    }

    &.admin {
        background: #f6ffed;
        color: #52c41a;
        border-color: #b7eb8f;
    }

    &.processor {
        background: #e6f7ff;
        color: #1890ff;
        border-color: #91d5ff;
    }

    &.creator {
        background: #fff2e8;
        color: #fa8c16;
        border-color: #ffbb96;
    }

    &.all-superior {
        background: #f9f0ff;
        color: #722ed1;
        border-color: #d3adf7;
    }

    &.manager {
        background: #e6fffb;
        color: #13c2c2;
        border-color: #87e8de;
    }

    &.member-admin,
    &.suggest-admin {
        background: #fff7e6;
        color: #fa8c16;
        border-color: #ffd591;
    }

    &.collaborator,
    &.cooperation-user {
        background: #f0f9ff;
        color: #096dd9;
        border-color: #bae7ff;
    }

    &.register-user,
    &.specific-user {
        background: #f6ffed;
        color: #52c41a;
        border-color: #b7eb8f;
    }

    &.default {
        background: #fafafa;
        color: #666;
        border-color: #d9d9d9;
    }
}
</style>
