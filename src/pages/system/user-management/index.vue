<template>
    <div class="user-management-page">
        <div class="page-header">
            <h1>用户管理</h1>
            <p>管理系统用户账号、角色权限和基本信息</p>
        </div>

        <div class="content-area">
            <!-- 统计概览 -->
            <lay-row :space="16" class="stats-section">
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <lay-icon type="layui-icon-username" class="stat-icon" />
                            <div class="stat-info">
                                <h3>总用户数</h3>
                                <span class="stat-number">128</span>
                                <span class="stat-trend up">+8</span>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <lay-icon type="layui-icon-face-smile" class="stat-icon active" />
                            <div class="stat-info">
                                <h3>活跃用户</h3>
                                <span class="stat-number">95</span>
                                <span class="stat-trend up">+12</span>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <lay-icon type="layui-icon-face-cry" class="stat-icon inactive" />
                            <div class="stat-info">
                                <h3>禁用用户</h3>
                                <span class="stat-number">8</span>
                                <span class="stat-trend down">-2</span>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <lay-icon type="layui-icon-user" class="stat-icon new" />
                            <div class="stat-info">
                                <h3>新增用户</h3>
                                <span class="stat-number">25</span>
                                <span class="stat-trend">本月</span>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>
            </lay-row>

            <!-- 操作栏 -->
            <lay-card class="toolbar-card">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <lay-button type="primary" @click="showAddUserModal">
                            <lay-icon type="layui-icon-add-1" />
                            新增用户
                        </lay-button>
                        <lay-button @click="batchEnable" :disabled="selectedUsers.length === 0">
                            <lay-icon type="layui-icon-ok" />
                            批量启用
                        </lay-button>
                        <lay-button @click="batchDisable" :disabled="selectedUsers.length === 0">
                            <lay-icon type="layui-icon-close" />
                            批量禁用
                        </lay-button>
                        <lay-button @click="exportUsers">
                            <lay-icon type="layui-icon-export" />
                            导出用户
                        </lay-button>
                    </div>
                    <div class="toolbar-right">
                        <lay-input v-model="searchKeyword" placeholder="搜索用户名、姓名或邮箱" :suffix-icon="'layui-icon-search'"
                            @keyup.enter="searchUsers" style="width: 250px;" />
                        <lay-button @click="searchUsers">搜索</lay-button>
                    </div>
                </div>
            </lay-card>

            <!-- 筛选器 -->
            <lay-card class="filter-card">
                <lay-form :model="filterForm" layout="inline">
                    <lay-form-item label="用户状态">
                        <lay-select v-model="filterForm.status" placeholder="选择状态">
                            <lay-select-option value="">全部状态</lay-select-option>
                            <lay-select-option value="active">激活</lay-select-option>
                            <lay-select-option value="inactive">禁用</lay-select-option>
                            <lay-select-option value="pending">待激活</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item label="用户角色">
                        <lay-select v-model="filterForm.role" placeholder="选择角色">
                            <lay-select-option value="">全部角色</lay-select-option>
                            <lay-select-option value="admin">超级管理员</lay-select-option>
                            <lay-select-option value="manager">部门经理</lay-select-option>
                            <lay-select-option value="sales">销售人员</lay-select-option>
                            <lay-select-option value="designer">设计师</lay-select-option>
                            <lay-select-option value="user">普通用户</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item label="所属部门">
                        <lay-select v-model="filterForm.department" placeholder="选择部门">
                            <lay-select-option value="">全部部门</lay-select-option>
                            <lay-select-option value="sales">销售部</lay-select-option>
                            <lay-select-option value="design">设计部</lay-select-option>
                            <lay-select-option value="tech">技术部</lay-select-option>
                            <lay-select-option value="admin">行政部</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item label="注册时间">
                        <lay-date-picker v-model="filterForm.startDate" placeholder="开始日期" />
                        <span style="margin: 0 8px;">至</span>
                        <lay-date-picker v-model="filterForm.endDate" placeholder="结束日期" />
                    </lay-form-item>
                    <lay-form-item>
                        <lay-button type="primary" @click="applyFilter">筛选</lay-button>
                        <lay-button @click="resetFilter">重置</lay-button>
                    </lay-form-item>
                </lay-form>
            </lay-card>

            <!-- 用户列表 -->
            <lay-card title="用户列表">
                <lay-table :columns="userColumns" :data-source="userList" :pagination="pagination"
                    v-model:selectedKeys="selectedUsers" :default-toolbar="true" :even="true">
                    <template #avatar="{ row }">
                        <div class="user-avatar">
                            <img v-if="row.avatar" :src="row.avatar" :alt="row.realName" />
                            <div v-else class="avatar-placeholder">
                                {{ row.realName ? row.realName.charAt(0) : row.username.charAt(0) }}
                            </div>
                        </div>
                    </template>

                    <template #userInfo="{ row }">
                        <div class="user-info">
                            <div class="user-name">
                                <span class="real-name">{{ row.realName }}</span>
                                <span class="username">@{{ row.username }}</span>
                            </div>
                            <div class="user-contact">
                                <span v-if="row.email" class="email">{{ row.email }}</span>
                                <span v-if="row.phone" class="phone">{{ row.phone }}</span>
                            </div>
                        </div>
                    </template>

                    <template #role="{ row }">
                        <lay-tag :type="getRoleTagType(row.role)">{{ getRoleName(row.role) }}</lay-tag>
                    </template>

                    <template #department="{ row }">
                        <div class="department-info">
                            <lay-icon type="layui-icon-group" />
                            <span>{{ getDepartmentName(row.department) }}</span>
                        </div>
                    </template>

                    <template #status="{ row }">
                        <lay-tag :type="getStatusTagType(row.status)">{{ getStatusName(row.status) }}</lay-tag>
                    </template>

                    <template #lastLogin="{ row }">
                        <div class="login-info">
                            <div class="login-time">{{ row.lastLoginTime || '从未登录' }}</div>
                            <div v-if="row.lastLoginIp" class="login-ip">{{ row.lastLoginIp }}</div>
                        </div>
                    </template>

                    <template #action="{ row }">
                        <div class="action-buttons">
                            <lay-button size="sm" @click="viewUser(row)">
                                <lay-icon type="layui-icon-about" />
                                详情
                            </lay-button>
                            <lay-button size="sm" @click="editUser(row)">
                                <lay-icon type="layui-icon-edit" />
                                编辑
                            </lay-button>
                            <lay-button size="sm" :type="row.status === 'active' ? 'warm' : 'normal'"
                                @click="toggleUserStatus(row)">
                                <lay-icon :type="row.status === 'active' ? 'layui-icon-pause' : 'layui-icon-play'" />
                                {{ row.status === 'active' ? '禁用' : '启用' }}
                            </lay-button>
                            <lay-button size="sm" @click="resetPassword(row)">
                                <lay-icon type="layui-icon-password" />
                                重置密码
                            </lay-button>
                            <lay-button size="sm" type="danger" @click="deleteUser(row)">
                                <lay-icon type="layui-icon-delete" />
                                删除
                            </lay-button>
                        </div>
                    </template>
                </lay-table>
            </lay-card>
        </div>

        <!-- 新增/编辑用户弹窗 -->
        <lay-layer v-model="showUserModal" :title="userModalTitle" :area="['800px', '600px']">
            <div class="user-modal-content">
                <lay-form :model="userForm" ref="userFormRef" label-width="120px">
                    <lay-row :space="16">
                        <lay-col :md="12">
                            <lay-form-item label="用户名" prop="username" required>
                                <lay-input v-model="userForm.username" placeholder="请输入用户名" :disabled="isEditMode" />
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="12">
                            <lay-form-item label="真实姓名" prop="realName" required>
                                <lay-input v-model="userForm.realName" placeholder="请输入真实姓名" />
                            </lay-form-item>
                        </lay-col>
                    </lay-row>

                    <lay-row :space="16">
                        <lay-col :md="12">
                            <lay-form-item label="邮箱" prop="email" required>
                                <lay-input v-model="userForm.email" placeholder="请输入邮箱地址" type="email" />
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="12">
                            <lay-form-item label="手机号" prop="phone">
                                <lay-input v-model="userForm.phone" placeholder="请输入手机号码" />
                            </lay-form-item>
                        </lay-col>
                    </lay-row>

                    <lay-row :space="16" v-if="!isEditMode">
                        <lay-col :md="12">
                            <lay-form-item label="密码" prop="password" required>
                                <lay-input v-model="userForm.password" placeholder="请输入密码" type="password"
                                    show-password />
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="12">
                            <lay-form-item label="确认密码" prop="confirmPassword" required>
                                <lay-input v-model="userForm.confirmPassword" placeholder="请再次输入密码" type="password"
                                    show-password />
                            </lay-form-item>
                        </lay-col>
                    </lay-row>

                    <lay-row :space="16">
                        <lay-col :md="12">
                            <lay-form-item label="用户角色" prop="role" required>
                                <lay-select v-model="userForm.role" placeholder="选择用户角色">
                                    <lay-select-option value="admin">超级管理员</lay-select-option>
                                    <lay-select-option value="manager">部门经理</lay-select-option>
                                    <lay-select-option value="sales">销售人员</lay-select-option>
                                    <lay-select-option value="designer">设计师</lay-select-option>
                                    <lay-select-option value="user">普通用户</lay-select-option>
                                </lay-select>
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="12">
                            <lay-form-item label="所属部门" prop="department" required>
                                <lay-select v-model="userForm.department" placeholder="选择所属部门">
                                    <lay-select-option value="sales">销售部</lay-select-option>
                                    <lay-select-option value="design">设计部</lay-select-option>
                                    <lay-select-option value="tech">技术部</lay-select-option>
                                    <lay-select-option value="admin">行政部</lay-select-option>
                                </lay-select>
                            </lay-form-item>
                        </lay-col>
                    </lay-row>

                    <lay-form-item label="用户状态" prop="status">
                        <lay-radio-group v-model="userForm.status">
                            <lay-radio value="active">激活</lay-radio>
                            <lay-radio value="inactive">禁用</lay-radio>
                            <lay-radio value="pending">待激活</lay-radio>
                        </lay-radio-group>
                    </lay-form-item>

                    <lay-form-item label="备注">
                        <lay-textarea v-model="userForm.remark" placeholder="请输入备注信息" :rows="3" />
                    </lay-form-item>
                </lay-form>

                <div class="modal-actions">
                    <lay-button type="primary" @click="saveUser">
                        <lay-icon type="layui-icon-ok" />
                        保存
                    </lay-button>
                    <lay-button @click="closeUserModal">
                        <lay-icon type="layui-icon-close" />
                        取消
                    </lay-button>
                </div>
            </div>
        </lay-layer>

        <!-- 用户详情弹窗 -->
        <lay-layer v-model="showUserDetailModal" title="用户详情" :area="['700px', '500px']">
            <div class="user-detail-content" v-if="selectedUser">
                <div class="user-profile">
                    <div class="profile-avatar">
                        <img v-if="selectedUser.avatar" :src="selectedUser.avatar" :alt="selectedUser.realName" />
                        <div v-else class="avatar-placeholder large">
                            {{ selectedUser.realName ? selectedUser.realName.charAt(0) : selectedUser.username.charAt(0)
                            }}
                        </div>
                    </div>
                    <div class="profile-info">
                        <h3>{{ selectedUser.realName }}</h3>
                        <p>@{{ selectedUser.username }}</p>
                        <lay-tag :type="getRoleTagType(selectedUser.role)">{{ getRoleName(selectedUser.role)
                            }}</lay-tag>
                    </div>
                </div>

                <div class="detail-sections">
                    <div class="detail-section">
                        <h4>基本信息</h4>
                        <lay-form label-width="100px">
                            <lay-row :space="16">
                                <lay-col :md="12">
                                    <lay-form-item label="邮箱">
                                        <span>{{ selectedUser.email }}</span>
                                    </lay-form-item>
                                </lay-col>
                                <lay-col :md="12">
                                    <lay-form-item label="手机号">
                                        <span>{{ selectedUser.phone || '未设置' }}</span>
                                    </lay-form-item>
                                </lay-col>
                            </lay-row>
                            <lay-row :space="16">
                                <lay-col :md="12">
                                    <lay-form-item label="所属部门">
                                        <span>{{ getDepartmentName(selectedUser.department) }}</span>
                                    </lay-form-item>
                                </lay-col>
                                <lay-col :md="12">
                                    <lay-form-item label="用户状态">
                                        <lay-tag :type="getStatusTagType(selectedUser.status)">{{
                                            getStatusName(selectedUser.status) }}</lay-tag>
                                    </lay-form-item>
                                </lay-col>
                            </lay-row>
                        </lay-form>
                    </div>

                    <div class="detail-section">
                        <h4>账户信息</h4>
                        <lay-form label-width="100px">
                            <lay-row :space="16">
                                <lay-col :md="12">
                                    <lay-form-item label="注册时间">
                                        <span>{{ selectedUser.createTime }}</span>
                                    </lay-form-item>
                                </lay-col>
                                <lay-col :md="12">
                                    <lay-form-item label="最后登录">
                                        <span>{{ selectedUser.lastLoginTime || '从未登录' }}</span>
                                    </lay-form-item>
                                </lay-col>
                            </lay-row>
                            <lay-form-item label="登录IP">
                                <span>{{ selectedUser.lastLoginIp || '无' }}</span>
                            </lay-form-item>
                            <lay-form-item label="备注">
                                <span>{{ selectedUser.remark || '无' }}</span>
                            </lay-form-item>
                        </lay-form>
                    </div>
                </div>

                <div class="modal-actions">
                    <lay-button @click="closeUserDetailModal">关闭</lay-button>
                </div>
            </div>
        </lay-layer>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';

// 响应式数据
const searchKeyword = ref('');
const selectedUsers = ref([]);
const showUserModal = ref(false);
const showUserDetailModal = ref(false);
const isEditMode = ref(false);
const selectedUser = ref(null);
const userFormRef = ref();

// 筛选表单
const filterForm = reactive({
    status: '',
    role: '',
    department: '',
    startDate: '',
    endDate: ''
});

// 用户表单
const userForm = reactive({
    id: '',
    username: '',
    realName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
    status: 'active',
    remark: ''
});

// 表格列配置
const userColumns = [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '头像', key: 'avatar', width: 80, customSlot: 'avatar' },
    { title: '用户信息', key: 'userInfo', width: 200, customSlot: 'userInfo' },
    { title: '角色', key: 'role', width: 120, customSlot: 'role' },
    { title: '部门', key: 'department', width: 120, customSlot: 'department' },
    { title: '状态', key: 'status', width: 100, customSlot: 'status' },
    { title: '注册时间', key: 'createTime', width: 150 },
    { title: '最后登录', key: 'lastLogin', width: 150, customSlot: 'lastLogin' },
    { title: '操作', key: 'action', width: 300, fixed: 'right', customSlot: 'action' }
];

// 用户数据
const userList = ref([
    {
        id: 1,
        username: 'admin',
        realName: '系统管理员',
        email: 'admin@newbeall.com',
        phone: '13800138000',
        role: 'admin',
        department: 'admin',
        status: 'active',
        avatar: '',
        createTime: '2024-01-01 10:00:00',
        lastLoginTime: '2024-01-20 14:30:25',
        lastLoginIp: '192.168.1.100',
        remark: '系统超级管理员账户'
    },
    {
        id: 2,
        username: 'zhangsan',
        realName: '张三',
        email: 'zhangsan@newbeall.com',
        phone: '13800138001',
        role: 'sales',
        department: 'sales',
        status: 'active',
        avatar: '',
        createTime: '2024-01-05 09:15:00',
        lastLoginTime: '2024-01-20 13:45:18',
        lastLoginIp: '192.168.1.101',
        remark: '销售部主管'
    },
    {
        id: 3,
        username: 'lisi',
        realName: '李四',
        email: 'lisi@newbeall.com',
        phone: '13800138002',
        role: 'designer',
        department: 'design',
        status: 'active',
        avatar: '',
        createTime: '2024-01-08 14:20:00',
        lastLoginTime: '2024-01-19 16:22:33',
        lastLoginIp: '192.168.1.102',
        remark: '资深设计师'
    },
    {
        id: 4,
        username: 'wangwu',
        realName: '王五',
        email: 'wangwu@newbeall.com',
        phone: '',
        role: 'user',
        department: 'sales',
        status: 'inactive',
        avatar: '',
        createTime: '2024-01-10 11:30:00',
        lastLoginTime: null,
        lastLoginIp: null,
        remark: '临时账户，已停用'
    }
]);

// 分页配置
const pagination = reactive({
    current: 1,
    pageSize: 20,
    total: userList.value.length
});

// 计算属性
const userModalTitle = computed(() => {
    return isEditMode.value ? '编辑用户' : '新增用户';
});

// 辅助方法
const getRoleTagType = (role: string) => {
    const typeMap: Record<string, string> = {
        'admin': 'danger',
        'manager': 'warm',
        'sales': 'normal',
        'designer': 'primary',
        'user': 'success'
    };
    return typeMap[role] || 'normal';
};

const getRoleName = (role: string) => {
    const nameMap: Record<string, string> = {
        'admin': '超级管理员',
        'manager': '部门经理',
        'sales': '销售人员',
        'designer': '设计师',
        'user': '普通用户'
    };
    return nameMap[role] || role;
};

const getStatusTagType = (status: string) => {
    const typeMap: Record<string, string> = {
        'active': 'normal',
        'inactive': 'danger',
        'pending': 'warm'
    };
    return typeMap[status] || 'normal';
};

const getStatusName = (status: string) => {
    const nameMap: Record<string, string> = {
        'active': '激活',
        'inactive': '禁用',
        'pending': '待激活'
    };
    return nameMap[status] || status;
};

const getDepartmentName = (department: string) => {
    const nameMap: Record<string, string> = {
        'sales': '销售部',
        'design': '设计部',
        'tech': '技术部',
        'admin': '行政部'
    };
    return nameMap[department] || department;
};

// 方法实现
const searchUsers = () => {
    console.log('搜索用户:', searchKeyword.value);
};

const applyFilter = () => {
    console.log('应用筛选:', filterForm);
};

const resetFilter = () => {
    Object.keys(filterForm).forEach(key => {
        filterForm[key as keyof typeof filterForm] = '';
    });
};

const showAddUserModal = () => {
    isEditMode.value = false;
    resetUserForm();
    showUserModal.value = true;
};

const resetUserForm = () => {
    Object.keys(userForm).forEach(key => {
        if (key === 'status') {
            userForm[key as keyof typeof userForm] = 'active';
        } else {
            userForm[key as keyof typeof userForm] = '';
        }
    });
};

const closeUserModal = () => {
    showUserModal.value = false;
    resetUserForm();
};

const saveUser = () => {
    console.log('保存用户:', userForm);
    closeUserModal();
};

const viewUser = (user: any) => {
    selectedUser.value = user;
    showUserDetailModal.value = true;
};

const closeUserDetailModal = () => {
    showUserDetailModal.value = false;
    selectedUser.value = null;
};

const editUser = (user: any) => {
    isEditMode.value = true;
    Object.keys(userForm).forEach(key => {
        if (key !== 'password' && key !== 'confirmPassword') {
            userForm[key as keyof typeof userForm] = user[key] || '';
        }
    });
    showUserModal.value = true;
};

const toggleUserStatus = (user: any) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    console.log(`将用户 ${user.username} 状态改为: ${newStatus}`);
};

const resetPassword = (user: any) => {
    console.log('重置用户密码:', user.username);
};

const deleteUser = (user: any) => {
    console.log('删除用户:', user.username);
};

const batchEnable = () => {
    console.log('批量启用用户:', selectedUsers.value);
};

const batchDisable = () => {
    console.log('批量禁用用户:', selectedUsers.value);
};

const exportUsers = () => {
    console.log('导出用户数据');
};
</script>

<style scoped lang="scss">
.user-management-page {
    padding: 24px;
}

.page-header {
    margin-bottom: 32px;

    h1 {
        margin: 0;
        color: #333;
        font-size: 28px;
        font-weight: 600;
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
        display: flex;
        align-items: center;
        padding: 20px;

        .stat-icon {
            font-size: 48px;
            margin-right: 16px;
            color: #409eff;

            &.active {
                color: #67c23a;
            }

            &.inactive {
                color: #f56c6c;
            }

            &.new {
                color: #e6a23c;
            }
        }

        .stat-info {
            flex: 1;

            h3 {
                margin: 0 0 8px 0;
                color: #666;
                font-size: 14px;
                font-weight: normal;
            }

            .stat-number {
                display: block;
                font-size: 32px;
                font-weight: bold;
                color: #333;
                margin-bottom: 4px;
            }

            .stat-trend {
                font-size: 12px;
                color: #999;

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
}

.toolbar-card,
.filter-card {
    margin-bottom: 24px;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .toolbar-left,
    .toolbar-right {
        display: flex;
        align-items: center;
        gap: 8px;
    }
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .avatar-placeholder {
        width: 100%;
        height: 100%;
        background: #409eff;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 16px;

        &.large {
            width: 80px;
            height: 80px;
            font-size: 24px;
        }
    }
}

.user-info {
    .user-name {
        margin-bottom: 4px;

        .real-name {
            font-weight: 600;
            color: #333;
            margin-right: 8px;
        }

        .username {
            color: #999;
            font-size: 12px;
        }
    }

    .user-contact {
        font-size: 12px;
        color: #666;

        .email,
        .phone {
            margin-right: 12px;
        }
    }
}

.department-info {
    display: flex;
    align-items: center;
    gap: 4px;

    .layui-icon {
        color: #666;
        font-size: 14px;
    }
}

.login-info {
    .login-time {
        font-size: 14px;
        color: #333;
        margin-bottom: 2px;
    }

    .login-ip {
        font-size: 12px;
        color: #999;
    }
}

.action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    .lay-btn {
        margin: 0;
    }
}

.user-modal-content,
.user-detail-content {
    padding: 20px;
}

.user-profile {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;

    .profile-avatar {
        margin-right: 20px;
    }

    .profile-info {
        flex: 1;

        h3 {
            margin: 0 0 8px 0;
            color: #333;
            font-size: 20px;
        }

        p {
            margin: 0 0 12px 0;
            color: #666;
            font-size: 14px;
        }
    }
}

.detail-sections {
    .detail-section {
        margin-bottom: 24px;

        h4 {
            margin: 0 0 16px 0;
            color: #333;
            font-size: 16px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 8px;
        }
    }
}

.modal-actions {
    text-align: right;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e0e0e0;

    .lay-btn+.lay-btn {
        margin-left: 8px;
    }
}
</style>