<template>
    <div class="sales-permission-config-page">
        <div class="content-area">
            <lay-card>
                <!-- 工具栏区域 -->
                <div class="fixed-table-toolbar">
                    <span data-title="产品分配" class="btnIcon invite-but" @click="handleProductAssign">
                        <lay-icon type="layui-icon-component" />
                    </span>
                    <span data-title="品牌分配" class="btnIcon invite-but" @click="handleBrandAssign">
                        <lay-icon type="layui-icon-diamond" />
                    </span>
                    <span data-title="地区分配" class="btnIcon invite-but" @click="handleRegionAssign">
                        <lay-icon type="layui-icon-location" />
                    </span>
                    <span data-title="客户分配" class="btnIcon invite-but" @click="handleCustomerAssign">
                        <lay-icon type="layui-icon-group" />
                    </span>
                    <span data-title="打折权限" class="btnIcon invite-but" @click="handleDiscountPermission">
                        <lay-icon type="layui-icon-dollar" />
                    </span>

                    <button
class="btn btn-default btn-outline" type="button" name="refresh" aria-label="refresh"
                        title="刷新" @click="handleRefresh">
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
v-model="columnVisibility.sex" type="checkbox"
                                        @change="updateVisibleColumns" /> 性别
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
v-model="columnVisibility.deptName" type="checkbox"
                                        @change="updateVisibleColumns" /> 部门
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input
v-model="columnVisibility.discount" type="checkbox"
                                        @change="updateVisibleColumns" /> 最低折扣(%)
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

                <!-- 销售权限配置列表表格 -->
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
                            <span>{{ getSexName(row.sex) }}</span>
                        </template>

                        <!-- 角色列 -->
                        <template #role="{ row }">
                            <span class="role-text">{{ row.roleName }}</span>
                        </template>

                        <!-- 折扣列 -->
                        <template #discount="{ row }">
                            <span class="discount-text">{{ row.discount }}%</span>
                        </template>
                    </lay-table>
                </div>
            </lay-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import http from '@/utils/http';
import Notify from '@/utils/notify';

// 销售权限配置接口类型定义 - 匹配用户管理API数据结构
interface SalesPermissionConfig {
    checked?: boolean;              // 前端添加的选中状态
    profession?: string;            // 职务(可选)
    deptName: string;              // 部门名称
    createtime: string;            // 创建时间
    roleid: string;                // 角色ID
    sex: number;                   // 性别(数字)
    deptid: number;                // 部门ID
    discount: number;              // 折扣权限
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

// 列显示控制
const columnVisibility = reactive({
    account: true,
    name: true,
    sex: true,
    roleName: true,
    deptName: true,
    discount: true,
    phone: true
});

const showColumnsDropdown = ref(false);

// 所有列配置
const allColumns = [
    { title: '', key: 'checkbox', width: '50px', customSlot: 'checkbox', type: 'custom' },
    { title: '账号', key: 'account', width: '120px', type: 'text' },
    { title: '姓名', key: 'name', width: '100px', type: 'text' },
    { title: '性别', key: 'sex', width: '80px', customSlot: 'sex', type: 'custom' },
    { title: '角色', key: 'roleName', width: '120px', customSlot: 'role', type: 'custom' },
    { title: '部门', key: 'deptName', width: '120px', type: 'text' },
    { title: '最低折扣(%)', key: 'discount', width: '120px', customSlot: 'discount', type: 'custom' },
    { title: '电话', key: 'phone', width: '150px', type: 'text' }
];

// 计算可见列
const visibleColumns = computed(() => {
    return allColumns.filter(column => {
        if (column.key === 'checkbox') return true;
        return columnVisibility[column.key as keyof typeof columnVisibility];
    });
});

// 表格数据 - 初始化为空数组，数据从API获取
const tableData = ref<SalesPermissionConfig[]>([]);

// 分页配置
const pagination = reactive({
    current: 1,
    limit: 10,
    total: 0
});

// 获取销售权限配置列表
const getSalesPermissionList = async () => {
    try {
        // 使用FormData格式发送表单数据，参考用户管理页面的实现
        const formData = new FormData();
        formData.append('order', 'desc');
        formData.append('offset', ((pagination.current - 1) * pagination.limit).toString());
        formData.append('limit', pagination.limit.toString());

        const response = await http.post('/mgr/userList', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        console.log(response);
        // 处理返回的数据
        if (response && Array.isArray(response)) {
            tableData.value = response.map((item: SalesPermissionConfig) => ({
                ...item,
                checked: false
            }));
            pagination.total = response.length;
        }
    } catch {
        Notify.error({
            title: '获取数据失败',
            content: '无法获取销售权限配置数据，请稍后重试',
            time: 3000
        });
    }
};

// 更新可见列
const updateVisibleColumns = () => {
    // 列显示状态更新时的处理逻辑
};

// 切换列下拉菜单
const toggleColumnsDropdown = () => {
    showColumnsDropdown.value = !showColumnsDropdown.value;
};

// 切换行复选框状态
const toggleRowCheck = (row: SalesPermissionConfig) => {
    row.checked = !row.checked;
    console.log('选中行:', row);
};

// 表格变化处理
const handleTableChange = (pageData: { current: number; limit: number }) => {
    pagination.current = pageData.current;
    pagination.limit = pageData.limit;
    getSalesPermissionList();
};

// 刷新
const handleRefresh = () => {
    console.log('刷新数据');
    getSalesPermissionList();
};

// 产品分配
const handleProductAssign = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要分配产品的用户');
        return;
    }
    console.log('产品分配:', selectedRows);
    // 这里可以打开产品分配弹窗
};

// 品牌分配
const handleBrandAssign = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要分配品牌的用户');
        return;
    }
    console.log('品牌分配:', selectedRows);
    // 这里可以打开品牌分配弹窗
};

// 地区分配
const handleRegionAssign = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要分配地区的用户');
        return;
    }
    console.log('地区分配:', selectedRows);
    // 这里可以打开地区分配弹窗
};

// 客户分配
const handleCustomerAssign = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要分配客户的用户');
        return;
    }
    console.log('客户分配:', selectedRows);
    // 这里可以打开客户分配弹窗
};

// 打折权限
const handleDiscountPermission = () => {
    const selectedRows = tableData.value.filter(row => row.checked);
    if (selectedRows.length === 0) {
        console.log('请选择要设置打折权限的用户');
        return;
    }
    console.log('打折权限设置:', selectedRows);
    // 这里可以打开打折权限设置弹窗
};

// 性别转换函数
const getSexName = (sex: number) => {
    return sex === 1 ? '男' : '女';
};

onMounted(() => {
    getSalesPermissionList();
});
</script>

<style scoped lang="scss">
// 销售权限配置页面样式
.sales-permission-config-page {
    padding: 24px;
    min-height: 100vh;
}

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

// 工具栏样式
.fixed-table-toolbar {
    padding: 15px 0;
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

// 角色文本样式
.role-text {
    font-size: 12px;
    color: #333;
}

// 折扣文本样式
.discount-text {
    font-size: 12px;
    color: #f5222d;
    font-weight: 500;
    padding: 2px 6px;
    background: #fff1f0;
    border-radius: 4px;
    border: 1px solid #ffa39e;
}
</style>