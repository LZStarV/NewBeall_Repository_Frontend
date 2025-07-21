<template>
    <div class="sales-permission-config-page">
        <div class="page-header">
            <h1>销售权限配置</h1>
            <p>配置销售人员的系统权限和数据访问范围</p>
        </div>

        <div class="content-area">
            <lay-row :space="24">
                <!-- 权限组管理 -->
                <lay-col :md="8">
                    <lay-card title="权限组">
                        <div class="toolbar">
                            <lay-button type="primary" size="sm" @click="showAddGroupModal">
                                <lay-icon type="layui-icon-add-1" />
                                新建权限组
                            </lay-button>
                        </div>

                        <div class="permission-groups">
                            <div v-for="group in permissionGroups" :key="group.id" class="group-item"
                                :class="{ active: selectedGroup?.id === group.id }" @click="selectGroup(group)">
                                <div class="group-header">
                                    <span class="group-name">{{ group.name }}</span>
                                    <span class="member-count">{{ group.memberCount }}人</span>
                                </div>
                                <div class="group-description">{{ group.description }}</div>
                                <div class="group-actions">
                                    <lay-button size="xs" @click.stop="editGroup(group)">编辑</lay-button>
                                    <lay-button size="xs" type="danger" @click.stop="deleteGroup(group)">删除</lay-button>
                                </div>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>

                <!-- 权限详情配置 -->
                <lay-col :md="16">
                    <lay-card title="权限配置" v-if="selectedGroup">
                        <div class="permission-config">
                            <div class="config-header">
                                <h3>{{ selectedGroup.name }} - 权限配置</h3>
                                <lay-button type="primary" @click="savePermissions">保存配置</lay-button>
                            </div>

                            <!-- 功能权限 -->
                            <div class="permission-section">
                                <h4>功能权限</h4>
                                <div class="permission-grid">
                                    <div v-for="func in functionalPermissions" :key="func.id" class="permission-item">
                                        <div class="permission-header">
                                            <lay-checkbox :model-value="func.enabled"
                                                @change="toggleFunctionalPermission(func.id, $event)">
                                                {{ func.name }}
                                            </lay-checkbox>
                                        </div>
                                        <div class="permission-actions" v-if="func.enabled">
                                            <lay-checkbox-group :model-value="func.actions"
                                                @change="updateFunctionalActions(func.id, $event)">
                                                <lay-checkbox value="read">查看</lay-checkbox>
                                                <lay-checkbox value="create">创建</lay-checkbox>
                                                <lay-checkbox value="update">编辑</lay-checkbox>
                                                <lay-checkbox value="delete">删除</lay-checkbox>
                                            </lay-checkbox-group>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 数据权限 -->
                            <div class="permission-section">
                                <h4>数据权限</h4>
                                <div class="data-permission-config">
                                    <lay-form label-width="120px">
                                        <lay-form-item label="客户数据范围">
                                            <lay-radio-group v-model="dataPermissions.customerScope">
                                                <lay-radio value="all">全部客户</lay-radio>
                                                <lay-radio value="own">仅自己的客户</lay-radio>
                                                <lay-radio value="team">本团队客户</lay-radio>
                                                <lay-radio value="department">本部门客户</lay-radio>
                                            </lay-radio-group>
                                        </lay-form-item>

                                        <lay-form-item label="项目数据范围">
                                            <lay-radio-group v-model="dataPermissions.projectScope">
                                                <lay-radio value="all">全部项目</lay-radio>
                                                <lay-radio value="own">仅自己的项目</lay-radio>
                                                <lay-radio value="team">本团队项目</lay-radio>
                                                <lay-radio value="department">本部门项目</lay-radio>
                                            </lay-radio-group>
                                        </lay-form-item>

                                        <lay-form-item label="报价数据范围">
                                            <lay-radio-group v-model="dataPermissions.quoteScope">
                                                <lay-radio value="all">全部报价</lay-radio>
                                                <lay-radio value="own">仅自己的报价</lay-radio>
                                                <lay-radio value="team">本团队报价</lay-radio>
                                                <lay-radio value="department">本部门报价</lay-radio>
                                            </lay-radio-group>
                                        </lay-form-item>

                                        <lay-form-item label="财务数据权限">
                                            <lay-checkbox-group v-model="dataPermissions.financialData">
                                                <lay-checkbox value="revenue">收入数据</lay-checkbox>
                                                <lay-checkbox value="cost">成本数据</lay-checkbox>
                                                <lay-checkbox value="profit">利润数据</lay-checkbox>
                                                <lay-checkbox value="commission">佣金数据</lay-checkbox>
                                            </lay-checkbox-group>
                                        </lay-form-item>
                                    </lay-form>
                                </div>
                            </div>

                            <!-- 时间限制 -->
                            <div class="permission-section">
                                <h4>时间限制</h4>
                                <lay-form label-width="120px">
                                    <lay-form-item label="登录时间限制">
                                        <lay-checkbox
                                            v-model="timeRestrictions.loginTimeEnabled">启用登录时间限制</lay-checkbox>
                                    </lay-form-item>
                                    <lay-form-item v-if="timeRestrictions.loginTimeEnabled" label="允许登录时间">
                                        <lay-time-picker v-model="timeRestrictions.loginStartTime" placeholder="开始时间" />
                                        <span style="margin: 0 8px;">至</span>
                                        <lay-time-picker v-model="timeRestrictions.loginEndTime" placeholder="结束时间" />
                                    </lay-form-item>

                                    <lay-form-item label="IP地址限制">
                                        <lay-checkbox
                                            v-model="timeRestrictions.ipRestrictionEnabled">启用IP地址限制</lay-checkbox>
                                    </lay-form-item>
                                    <lay-form-item v-if="timeRestrictions.ipRestrictionEnabled" label="允许的IP地址">
                                        <lay-textarea v-model="timeRestrictions.allowedIPs"
                                            placeholder="请输入允许的IP地址，多个IP用换行分隔" :rows="3" />
                                    </lay-form-item>
                                </lay-form>
                            </div>
                        </div>
                    </lay-card>

                    <lay-card v-else>
                        <div class="empty-state">
                            <lay-icon type="layui-icon-vercode" size="64" />
                            <p>请选择一个权限组进行配置</p>
                        </div>
                    </lay-card>
                </lay-col>
            </lay-row>
        </div>

        <!-- 添加/编辑权限组弹窗 -->
        <lay-layer v-model="showGroupModal" title="权限组信息" :area="['500px', '400px']">
            <div class="group-modal-content">
                <lay-form :model="groupForm" ref="groupFormRef" label-width="80px">
                    <lay-form-item label="组名称" prop="name" required>
                        <lay-input v-model="groupForm.name" placeholder="请输入权限组名称" />
                    </lay-form-item>

                    <lay-form-item label="描述" prop="description">
                        <lay-textarea v-model="groupForm.description" placeholder="请输入权限组描述" :rows="3" />
                    </lay-form-item>

                    <lay-form-item label="状态">
                        <lay-radio-group v-model="groupForm.status">
                            <lay-radio value="active">启用</lay-radio>
                            <lay-radio value="inactive">禁用</lay-radio>
                        </lay-radio-group>
                    </lay-form-item>
                </lay-form>

                <div class="modal-actions">
                    <lay-button type="primary" @click="saveGroup">保存</lay-button>
                    <lay-button @click="closeGroupModal">取消</lay-button>
                </div>
            </div>
        </lay-layer>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const selectedGroup = ref<any>(null);
const showGroupModal = ref(false);
const groupFormRef = ref();

const groupForm = reactive({
    id: '',
    name: '',
    description: '',
    status: 'active'
});

const permissionGroups = ref([
    {
        id: 1,
        name: '高级销售',
        description: '具有完整销售功能权限',
        memberCount: 5,
        status: 'active'
    },
    {
        id: 2,
        name: '初级销售',
        description: '基础销售功能权限',
        memberCount: 12,
        status: 'active'
    },
    {
        id: 3,
        name: '销售主管',
        description: '销售管理和审批权限',
        memberCount: 3,
        status: 'active'
    }
]);

const functionalPermissions = ref([
    {
        id: 'customer',
        name: '客户管理',
        enabled: true,
        actions: ['read', 'create', 'update']
    },
    {
        id: 'quote',
        name: '报价管理',
        enabled: true,
        actions: ['read', 'create', 'update']
    },
    {
        id: 'order',
        name: '订单管理',
        enabled: true,
        actions: ['read', 'create']
    },
    {
        id: 'project',
        name: '项目管理',
        enabled: false,
        actions: []
    }
]);

const dataPermissions = reactive({
    customerScope: 'own',
    projectScope: 'team',
    quoteScope: 'own',
    financialData: ['revenue']
});

const timeRestrictions = reactive({
    loginTimeEnabled: false,
    loginStartTime: '',
    loginEndTime: '',
    ipRestrictionEnabled: false,
    allowedIPs: ''
});

const selectGroup = (group: any) => {
    selectedGroup.value = group;
    // 加载该组的权限配置
    loadGroupPermissions(group.id);
};

const loadGroupPermissions = (groupId: number) => {
    // 模拟加载权限配置
    console.log('加载权限组配置:', groupId);
};

const toggleFunctionalPermission = (permissionId: string, enabled: boolean) => {
    const permission = functionalPermissions.value.find(p => p.id === permissionId);
    if (permission) {
        permission.enabled = enabled;
        if (!enabled) {
            permission.actions = [];
        }
    }
};

const updateFunctionalActions = (permissionId: string, actions: string[]) => {
    const permission = functionalPermissions.value.find(p => p.id === permissionId);
    if (permission) {
        permission.actions = actions;
    }
};

const showAddGroupModal = () => {
    resetGroupForm();
    showGroupModal.value = true;
};

const resetGroupForm = () => {
    Object.keys(groupForm).forEach(key => {
        if (key === 'status') {
            groupForm[key as keyof typeof groupForm] = 'active';
        } else {
            groupForm[key as keyof typeof groupForm] = '';
        }
    });
};

const closeGroupModal = () => {
    showGroupModal.value = false;
    resetGroupForm();
};

const saveGroup = () => {
    console.log('保存权限组:', groupForm);
    closeGroupModal();
};

const editGroup = (group: any) => {
    Object.keys(groupForm).forEach(key => {
        groupForm[key as keyof typeof groupForm] = group[key] || '';
    });
    showGroupModal.value = true;
};

const deleteGroup = (group: any) => {
    console.log('删除权限组:', group);
};

const savePermissions = () => {
    console.log('保存权限配置:', {
        groupId: selectedGroup.value?.id,
        functionalPermissions: functionalPermissions.value,
        dataPermissions: dataPermissions,
        timeRestrictions: timeRestrictions
    });
};
</script>

<style scoped lang="scss">
.sales-permission-config-page {
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

.toolbar {
    margin-bottom: 16px;
}

.permission-groups {
    max-height: 600px;
    overflow-y: auto;
}

.group-item {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        border-color: #409eff;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
    }

    &.active {
        border-color: #409eff;
        background: #f0f9ff;
    }

    .group-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .group-name {
            font-weight: 600;
            color: #333;
        }

        .member-count {
            font-size: 12px;
            color: #999;
            background: #f0f0f0;
            padding: 2px 8px;
            border-radius: 12px;
        }
    }

    .group-description {
        font-size: 14px;
        color: #666;
        margin-bottom: 12px;
    }

    .group-actions {
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover .group-actions {
        opacity: 1;
    }
}

.permission-config {
    .config-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e0e0e0;

        h3 {
            margin: 0;
            color: #333;
        }
    }
}

.permission-section {
    margin-bottom: 32px;

    h4 {
        margin: 0 0 16px 0;
        color: #333;
        font-size: 16px;
    }
}

.permission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
}

.permission-item {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 16px;

    .permission-header {
        margin-bottom: 12px;

        .lay-checkbox {
            font-weight: 500;
        }
    }

    .permission-actions {
        padding-left: 24px;

        .lay-checkbox {
            margin-right: 16px;
            margin-bottom: 8px;
        }
    }
}

.data-permission-config {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #999;

    .layui-icon {
        margin-bottom: 16px;
        color: #ddd;
    }

    p {
        margin: 0;
        font-size: 14px;
    }
}

.group-modal-content {
    padding: 20px;
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