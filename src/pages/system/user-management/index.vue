<template>
    <div class="user-management-page">
        <div class="layout-container">
            <!-- 左侧组织结构 -->
            <div class="sidebar">
                <lay-card title="组织机构">
                    <div class="org-tree">
                        <div
class="tree-node" :class="{ active: selectedNode === 'company' }"
                            @click="selectNode('company')">
                            <lay-icon type="layui-icon-home" />
                            <span>总公司</span>
                        </div>
                        <div class="tree-children">
                            <div
class="tree-node" :class="{ active: selectedNode === 'admin' }"
                                @click="selectNode('admin')">
                                <lay-icon type="layui-icon-user" />
                                <span>销售部门</span>
                            </div>
                        </div>
                    </div>
                </lay-card>
            </div>

            <!-- 右侧内容区域 -->
            <div class="main-content">
                <!-- 搜索过滤区域 -->
                <lay-card class="filter-card">
                    <div class="filter-section">
                        <lay-form :model="filterForm" layout="inline">
                            <lay-form-item label="用户名称">
                                <lay-input v-model="filterForm.userName" placeholder="账号/姓名/手机号" style="width: 180px" />
                            </lay-form-item>
                            <lay-form-item label="注册开始日期">
                                <lay-date-picker
v-model="filterForm.registerStartDate" placeholder="注册开始日期"
                                    style="width: 150px" />
                            </lay-form-item>
                            <lay-form-item label="注册结束日期">
                                <lay-date-picker
v-model="filterForm.registerEndDate" placeholder="注册结束日期"
                                    style="width: 150px" />
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
                        <span data-title="添加" class="btnIcon invite-but" @click="handleAdd">
                            <lay-icon type="layui-icon-add-circle" />
                        </span>
                        <span data-title="冻结" class="btnIcon invite-but" @click="handleFreeze">
                            <lay-icon type="layui-icon-pause" />
                        </span>
                        <span data-title="解除冻结" class="btnIcon invite-but" @click="handleUnfreeze">
                            <lay-icon type="layui-icon-play" />
                        </span>
                        <span data-title="个人权限" class="btnIcon invite-but" @click="handlePersonalPermission">
                            <lay-icon type="layui-icon-user" />
                        </span>
                        <span data-title="报价查阅权限" class="btnIcon invite-but" @click="handleQuotePermission">
                            <lay-icon type="layui-icon-chart-screen" />
                        </span>

                        <button
class="btn btn-default btn-outline" type="button" name="refresh" aria-label="refresh"
                            title="刷新" @click="handleRefresh">
                            <lay-icon type="layui-icon-refresh" />
                        </button>

                        <div class="dropdown-container">
                            <button
type="button" aria-label="columns"
                                class="btn btn-default btn-outline dropdown-toggle" @click="toggleColumnsDropdown">
                                <lay-icon type="layui-icon-shrink-right" />
                            </button>
                            <ul class="dropdown-menu" :class="{ 'show': showColumnsDropdown }">
                                <li role="menuitem">
                                    <label>
                                        <input
v-model="columnVisibility.account" type="checkbox"
                                            @change="updateVisibleColumns" /> 账号
                                    </label>
                                </li>
                                <li role="menuitem">
                                    <label>
                                        <input
v-model="columnVisibility.name" type="checkbox"
                                            @change="updateVisibleColumns" /> 姓名
                                    </label>
                                </li>
                                <li role="menuitem">
                                    <label>
                                        <input
v-model="columnVisibility.profession" type="checkbox"
                                            @change="updateVisibleColumns" /> 职务
                                    </label>
                                </li>
                                <li role="menuitem">
                                    <label>
                                        <input
v-model="columnVisibility.sex" type="checkbox"
                                            @change="updateVisibleColumns" /> 性别
                                    </label>
                                </li>
                                <li role="menuitem">
                                    <label>
                                        <input
v-model="columnVisibility.deptName" type="checkbox"
                                            @change="updateVisibleColumns" /> 部门
                                    </label>
                                </li>
                                <li role="menuitem">
                                    <label>
                                        <input
v-model="columnVisibility.roleName" type="checkbox"
                                            @change="updateVisibleColumns" /> 角色
                                    </label>
                                </li>
                                <li role="menuitem">
                                    <label>
                                        <input
v-model="columnVisibility.email" type="checkbox"
                                            @change="updateVisibleColumns" /> 邮箱
                                    </label>
                                </li>
                                <li role="menuitem">
                                    <label>
                                        <input
v-model="columnVisibility.phone" type="checkbox"
                                            @change="updateVisibleColumns" /> 电话
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- 用户管理列表表格 -->
                    <div class="table-container">
                        <lay-table
:columns="visibleColumns" :data-source="tableData" :page="pagination"
                            @change="handleTableChange">
                            <!-- 选择框列 -->
                            <template #checkbox="{ row }">
                                <div class="custom-checkbox" @click="toggleRowCheck(row)">
                                    <div class="checkbox-square" :class="{ checked: row.checked }">
                                        <lay-icon v-if="row.checked" type="layui-icon-ok" />
                                    </div>
                                </div>
                            </template>

                            <!-- 性别列 -->
                            <template #sex="{ row }">
                                <span class="sex-text">
                                    {{ getSexName(row.sex) }}
                                </span>
                            </template>

                            <!-- 邮箱列 -->
                            <template #email="{ row }">
                                <span class="email-text" :title="row.email">
                                    {{ row.email }}
                                </span>
                            </template>

                            <!-- 状态列 -->
                            <template #status="{ row }">
                                <span class="status-text" :class="getStatusClass(row.statusName)">
                                    {{ row.statusName }}
                                </span>
                            </template>

                            <!-- 操作列 -->
                            <template #actions="{ row }">
                                <div class="action-buttons">
                                    <span class="action-btn modify" @click="handleModify(row)">修改</span>
                                    <span class="action-btn delete" @click="handleUserDelete(row)">删除</span>
                                    <span class="action-btn permission" @click="handleSetPermission(row)">查看权限</span>
                                </div>
                            </template>
                        </lay-table>
                    </div>
                </lay-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import http from '@/utils/http';
import Notify from '@/utils/notify';

// 用户管理接口类型定义
interface UserManagement {
    checked?: boolean;              // 前端添加的选中状态
    profession: string;             // 职务
    deptName: string;              // 部门名称
    createtime: string;            // 创建时间
    roleid: string;                // 角色ID
    sex: number;                   // 性别(数字)
    deptid: number;                // 部门ID
    avatar: string;                // 头像
    companyId: number;             // 公司ID
    times: number;                 // 登录次数
    phone: string;                 // 电话
    sexName: number;               // 性别名称(数字)
    name: string;                  // 姓名
    roleName: string;              // 角色名称
    statusName: string;            // 状态名称
    id: number;                    // 用户ID
    userRole: number;              // 用户角色
    account: string;               // 账号
    email: string;                 // 邮箱
    status: number;                // 状态(数字)
    birthday?: string;             // 生日(可选)
}

// 工具栏状态
const showColumnsDropdown = ref(false);
const selectedNode = ref('company');

// 列显示控制
const columnVisibility = reactive({
    account: true,
    name: true,
    profession: true,
    sex: true,
    deptName: true,
    roleName: true,
    email: true,
    phone: true,
    statusName: true,
    actions: true
});

// 过滤表单
const filterForm = reactive({
    userName: '',
    registerStartDate: '',
    registerEndDate: ''
});

// 所有可用的列配置
const allColumns = [
    { title: '', key: 'checkbox', width: '50px', customSlot: 'checkbox', type: 'custom' },
    { title: '账号', key: 'account', width: '120px', type: 'text' },
    { title: '姓名', key: 'name', width: '100px', type: 'text' },
    { title: '职务', key: 'profession', width: '120px', type: 'text' },
    { title: '性别', key: 'sex', width: '60px', customSlot: 'sex', type: 'custom' },
    { title: '部门', key: 'deptName', width: '120px', type: 'text' },
    { title: '角色', key: 'roleName', width: '120px', type: 'text' },
    { title: '邮箱', key: 'email', width: '200px', customSlot: 'email', type: 'custom' },
    { title: '电话', key: 'phone', width: '130px', type: 'text' },
    { title: '状态', key: 'statusName', width: '80px', customSlot: 'status', type: 'custom' },
    { title: '操作', key: 'actions', width: '200px', customSlot: 'actions', type: 'custom' }
];

// 动态计算可见的列
const visibleColumns = computed(() => {
    const baseColumns = [allColumns[0]]; // 始终显示选择框列
    const visibleDataColumns = allColumns.slice(1).filter(column =>
        columnVisibility[column.key as keyof typeof columnVisibility]
    );
    return [...baseColumns, ...visibleDataColumns];
});
// 获取用户列表
const fetchUserList = async () => {
    try {
        // 使用FormData格式发送表单数据
        const formData = new FormData();
        formData.append('order', 'desc');
        formData.append('offset', ((pagination.current - 1) * pagination.limit).toString());
        formData.append('limit', pagination.limit.toString());

        const response = await http.post('/mgr/list', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        console.log(response);
        // 处理返回的数据
        if (response && Array.isArray(response)) {
            tableData.value = response.map((item: UserManagement) => ({
                ...item,
                checked: false
            }));
            pagination.total = response.length;
        }
    } catch {
        Notify.error({
            title: '获取数据失败',
            content: '无法获取用户数据，请稍后重试',
            time: 3000
        });
    }
};
// 表格数据 - 初始化为空数组，数据从API获取
const tableData = ref<UserManagement[]>([]);

// 分页配置
const pagination = reactive({
    current: 1,
    limit: 10,
    total: 0
});

// 获取状态样式
const getStatusClass = (status: string) => {
    return status === '启用' ? 'status-enabled' : 'status-disabled';
};

// 性别转换函数
const getSexName = (sex: number) => {
    return sex === 1 ? '男' : '女';
};

// 选择组织节点
const selectNode = (node: string) => {
    selectedNode.value = node;
    console.log('选择组织节点:', node);
    // 根据选择的节点加载用户数据
};

// 更新可见列
const updateVisibleColumns = () => {
    console.log('当前可见列:', Object.keys(columnVisibility).filter(key => columnVisibility[key as keyof typeof columnVisibility]));
};

// 切换行复选框状态
const toggleRowCheck = (row: UserManagement) => {
    row.checked = !row.checked;
    console.log('选中行:', row);
};

// 表格变化处理
const handleTableChange = (pageData: { current: number; limit: number }) => {
    pagination.current = pageData.current;
    pagination.limit = pageData.limit;
    console.log('页面变化:', pageData);
};

// 搜索处理
const handleSearch = () => {
    pagination.current = 1;
    console.log('搜索条件:', filterForm);
};

// 添加用户
const handleAdd = () => {
    console.log('添加用户');
};

// 冻结用户
const handleFreeze = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要冻结的用户');
        return;
    }
    console.log('冻结用户:', selectedRows);
};

// 解除冻结
const handleUnfreeze = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要解除冻结的用户');
        return;
    }
    console.log('解除冻结用户:', selectedRows);
};

// 个人权限
const handlePersonalPermission = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要设置权限的用户');
        return;
    }
    console.log('设置个人权限:', selectedRows);
};

// 报价查阅权限
const handleQuotePermission = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要设置报价权限的用户');
        return;
    }
    console.log('设置报价查阅权限:', selectedRows);
};

// 修改用户
const handleModify = (row: UserManagement) => {
    console.log('修改用户:', row);
};

// 删除用户
const handleUserDelete = (row: UserManagement) => {
    console.log('删除用户:', row);
};

// 查看权限
const handleSetPermission = (row: UserManagement) => {
    console.log('查看用户权限:', row);
};

// 刷新
const handleRefresh = () => {
    console.log('刷新数据');
    handleSearch();
};

// 切换列显示下拉菜单
const toggleColumnsDropdown = () => {
    showColumnsDropdown.value = !showColumnsDropdown.value;
};
onMounted(() => {
    fetchUserList();
});
</script>

<style scoped lang="scss">
// 用户管理页面样式
.user-management-page {
    padding: 24px;
    min-height: 100vh;
}

.layout-container {
    display: flex;
    gap: 24px;
    height: calc(100vh - 48px);
}

// 左侧组织结构
.sidebar {
    width: 250px;
    flex-shrink: 0;

    .org-tree {
        .tree-node {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s ease;
            margin-bottom: 4px;

            &:hover {
                background: #f5f5f5;
            }

            &.active {
                background: #e6f7ff;
                color: #1890ff;
            }

            .layui-icon {
                font-size: 16px;
            }

            span {
                font-size: 14px;
            }
        }

        .tree-children {
            margin-left: 20px;
        }
    }
}

// 右侧主内容
.main-content {
    flex: 1;
    min-width: 0;

    .content-area {
        background: white;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        padding: 0;

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
}

.filter-section {
    background: white;
    padding: 16px 20px;
    margin-bottom: 16px;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

    :deep(.layui-form) {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        gap: 0 6px;
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
        min-width: 100px;

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

    :deep(.layui-btn) {
        height: 32px;
        padding: 0 12px;
        font-size: 12px;
        border-radius: 4px;
        margin-right: 8px;
        min-width: 36px;
        line-height: 20px;
        transition: all 0.2s ease;

        .layui-icon {
            font-size: 12px;
            line-height: 1;
            width: auto;
            height: auto;
        }
    }
}

// 工具栏样式
.fixed-table-toolbar {
    padding: 15px 0;
    border-bottom: 1px solid #fff;
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

// 表格容器居中样式
.table-container {
    display: flex;
    justify-content: center;
    width: 100%;

    :deep(.layui-table) {
        margin: 0 auto;
    }
}

// 复选框样式
.custom-checkbox {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.checkbox-square {
    width: 14px;
    height: 14px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    .layui-icon {
        font-size: 10px;
        line-height: 1;
    }

    &.checked {
        background-color: #5FB878;
        border-color: #5FB878;
        color: white;
    }
}

// 邮箱文本样式
.email-text {
    font-size: 12px;
    color: #333;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: help;
}

// 性别文本样式
.sex-text {
    font-size: 12px;
    color: #333;
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: help;
}

// 状态样式
.status-text {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 12px;

    &.status-enabled {
        background: #f6ffed;
        color: #52c41a;
        border: 1px solid #b7eb8f;
    }

    &.status-disabled {
        background: #fff1f0;
        color: #f5222d;
        border: 1px solid #ffa39e;
    }
}

// 操作按钮样式
.action-buttons {
    display: flex;
    gap: 4px;
    justify-content: center;
    flex-wrap: wrap;
}

.action-btn {
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid;

    &.modify {
        background: #e6f7ff;
        color: #1890ff;
        border-color: #91d5ff;

        &:hover {
            background: #bae7ff;
        }
    }

    &.delete {
        background: #fff1f0;
        color: #f5222d;
        border-color: #ffa39e;

        &:hover {
            background: #ffccc7;
        }
    }

    &.permission {
        background: #f6ffed;
        color: #52c41a;
        border-color: #b7eb8f;

        &:hover {
            background: #d9f7be;
        }
    }
}

// 响应式设计
@media (max-width: 1200px) {
    .layout-container {
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
        margin-bottom: 24px;
    }

    .filter-section {
        :deep(.layui-form) {
            flex-wrap: wrap;
        }

        :deep(.layui-form-item) {
            margin-bottom: 12px;
        }
    }
}
</style>