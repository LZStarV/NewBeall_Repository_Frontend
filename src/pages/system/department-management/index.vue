<template>
  <div class="department-management-page">
    <div class="page-header">
      <h1>部门管理</h1>
      <p>管理公司组织架构和部门层级关系</p>
    </div>

    <div class="content-area">
      <lay-row :space="24">
        <!-- 部门树形结构 -->
        <lay-col :md="10">
          <lay-card title="组织架构">
            <div class="toolbar">
              <lay-button type="primary" size="sm" @click="addRootDepartment">
                <lay-icon type="layui-icon-add-1" />
                添加顶级部门
              </lay-button>
              <lay-button size="sm" @click="expandAll">展开全部</lay-button>
              <lay-button size="sm" @click="collapseAll">收起全部</lay-button>
              <lay-button size="sm" @click="refreshDepartments">
                <lay-icon type="layui-icon-refresh-3" />
                刷新
              </lay-button>
            </div>

            <div class="department-tree">
              <div v-for="department in departmentTree" :key="department.id" class="tree-node"
                :class="{ 'selected': selectedDepartment?.id === department.id }" @click="selectDepartment(department)">
                <div class="node-content">
                  <div class="node-info">
                    <lay-icon v-if="department.children && department.children.length > 0"
                      :type="department.expanded ? 'layui-icon-subtraction' : 'layui-icon-addition'" class="expand-icon"
                      @click.stop="toggleExpand(department)" />
                    <lay-icon type="layui-icon-group" class="dept-icon" />
                    <span class="dept-name">{{ department.name }}</span>
                    <span class="dept-code">({{ department.code }})</span>
                  </div>
                  <div class="node-actions">
                    <lay-button size="xs" @click.stop="addSubDepartment(department)">
                      <lay-icon type="layui-icon-add-1" />
                    </lay-button>
                    <lay-button size="xs" @click.stop="editDepartment(department)">
                      <lay-icon type="layui-icon-edit" />
                    </lay-button>
                    <lay-button size="xs" type="danger" @click.stop="deleteDepartment(department)">
                      <lay-icon type="layui-icon-delete" />
                    </lay-button>
                  </div>
                </div>

                <!-- 子部门 -->
                <div v-if="department.children && department.expanded" class="children-nodes">
                  <div v-for="child in department.children" :key="child.id" class="tree-node child-node"
                    :class="{ 'selected': selectedDepartment?.id === child.id }" @click.stop="selectDepartment(child)">
                    <div class="node-content">
                      <div class="node-info">
                        <div class="tree-line"></div>
                        <lay-icon type="layui-icon-group" class="dept-icon" />
                        <span class="dept-name">{{ child.name }}</span>
                        <span class="dept-code">({{ child.code }})</span>
                      </div>
                      <div class="node-actions">
                        <lay-button size="xs" @click.stop="addSubDepartment(child)">
                          <lay-icon type="layui-icon-add-1" />
                        </lay-button>
                        <lay-button size="xs" @click.stop="editDepartment(child)">
                          <lay-icon type="layui-icon-edit" />
                        </lay-button>
                        <lay-button size="xs" type="danger" @click.stop="deleteDepartment(child)">
                          <lay-icon type="layui-icon-delete" />
                        </lay-button>
                      </div>
                    </div>

                    <!-- 三级部门 -->
                    <div v-if="child.children && child.expanded" class="children-nodes">
                      <div v-for="grandChild in child.children" :key="grandChild.id" class="tree-node grandchild-node"
                        :class="{ 'selected': selectedDepartment?.id === grandChild.id }"
                        @click.stop="selectDepartment(grandChild)">
                        <div class="node-content">
                          <div class="node-info">
                            <div class="tree-line double"></div>
                            <lay-icon type="layui-icon-group" class="dept-icon" />
                            <span class="dept-name">{{ grandChild.name }}</span>
                            <span class="dept-code">({{ grandChild.code }})</span>
                          </div>
                          <div class="node-actions">
                            <lay-button size="xs" @click.stop="editDepartment(grandChild)">
                              <lay-icon type="layui-icon-edit" />
                            </lay-button>
                            <lay-button size="xs" type="danger" @click.stop="deleteDepartment(grandChild)">
                              <lay-icon type="layui-icon-delete" />
                            </lay-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </lay-card>
        </lay-col>

        <!-- 部门详情 -->
        <lay-col :md="14">
          <lay-card title="部门详情" v-if="selectedDepartment">
            <div class="department-detail">
              <!-- 基本信息 -->
              <div class="detail-section">
                <h4>基本信息</h4>
                <lay-form label-width="120px">
                  <lay-row :space="16">
                    <lay-col :md="12">
                      <lay-form-item label="部门名称">
                        <span>{{ selectedDepartment.name }}</span>
                      </lay-form-item>
                    </lay-col>
                    <lay-col :md="12">
                      <lay-form-item label="部门编码">
                        <span>{{ selectedDepartment.code }}</span>
                      </lay-form-item>
                    </lay-col>
                  </lay-row>
                  <lay-row :space="16">
                    <lay-col :md="12">
                      <lay-form-item label="部门类型">
                        <lay-tag :type="getDeptTypeColor(selectedDepartment.type)">
                          {{ getDeptTypeName(selectedDepartment.type) }}
                        </lay-tag>
                      </lay-form-item>
                    </lay-col>
                    <lay-col :md="12">
                      <lay-form-item label="部门状态">
                        <lay-tag :type="selectedDepartment.status === 'active' ? 'normal' : 'danger'">
                          {{ selectedDepartment.status === 'active' ? '启用' : '禁用' }}
                        </lay-tag>
                      </lay-form-item>
                    </lay-col>
                  </lay-row>
                  <lay-row :space="16">
                    <lay-col :md="12">
                      <lay-form-item label="上级部门">
                        <span>{{ getParentDepartmentName(selectedDepartment.parentId) }}</span>
                      </lay-form-item>
                    </lay-col>
                    <lay-col :md="12">
                      <lay-form-item label="部门负责人">
                        <span>{{ selectedDepartment.manager || '未设置' }}</span>
                      </lay-form-item>
                    </lay-col>
                  </lay-row>
                  <lay-form-item label="部门描述">
                    <span>{{ selectedDepartment.description || '无' }}</span>
                  </lay-form-item>
                  <lay-row :space="16">
                    <lay-col :md="12">
                      <lay-form-item label="创建时间">
                        <span>{{ selectedDepartment.createTime }}</span>
                      </lay-form-item>
                    </lay-col>
                    <lay-col :md="12">
                      <lay-form-item label="排序">
                        <span>{{ selectedDepartment.sort }}</span>
                      </lay-form-item>
                    </lay-col>
                  </lay-row>
                </lay-form>
              </div>

              <!-- 统计信息 -->
              <div class="detail-section">
                <h4>统计信息</h4>
                <lay-row :space="16">
                  <lay-col :md="6">
                    <div class="stat-item">
                      <div class="stat-icon">
                        <lay-icon type="layui-icon-username" />
                      </div>
                      <div class="stat-info">
                        <div class="stat-number">{{ selectedDepartment.userCount || 0 }}</div>
                        <div class="stat-label">部门人数</div>
                      </div>
                    </div>
                  </lay-col>
                  <lay-col :md="6">
                    <div class="stat-item">
                      <div class="stat-icon">
                        <lay-icon type="layui-icon-group" />
                      </div>
                      <div class="stat-info">
                        <div class="stat-number">{{ getSubDepartmentCount(selectedDepartment) }}</div>
                        <div class="stat-label">子部门数</div>
                      </div>
                    </div>
                  </lay-col>
                  <lay-col :md="6">
                    <div class="stat-item">
                      <div class="stat-icon">
                        <lay-icon type="layui-icon-face-smile" />
                      </div>
                      <div class="stat-info">
                        <div class="stat-number">{{ selectedDepartment.activeUserCount || 0 }}</div>
                        <div class="stat-label">活跃用户</div>
                      </div>
                    </div>
                  </lay-col>
                  <lay-col :md="6">
                    <div class="stat-item">
                      <div class="stat-icon">
                        <lay-icon type="layui-icon-chart" />
                      </div>
                      <div class="stat-info">
                        <div class="stat-number">{{ selectedDepartment.level }}</div>
                        <div class="stat-label">部门层级</div>
                      </div>
                    </div>
                  </lay-col>
                </lay-row>
              </div>

              <!-- 部门成员 -->
              <div class="detail-section">
                <div class="section-header">
                  <h4>部门成员</h4>
                  <lay-button size="sm" @click="addDepartmentMember">
                    <lay-icon type="layui-icon-add-1" />
                    添加成员
                  </lay-button>
                </div>

                <div class="members-list" v-if="selectedDepartment.members && selectedDepartment.members.length > 0">
                  <div v-for="member in selectedDepartment.members" :key="member.id" class="member-item">
                    <div class="member-avatar">
                      <img v-if="member.avatar" :src="member.avatar" :alt="member.name" />
                      <div v-else class="avatar-placeholder">
                        {{ member.name.charAt(0) }}
                      </div>
                    </div>
                    <div class="member-info">
                      <div class="member-name">{{ member.name }}</div>
                      <div class="member-position">{{ member.position || '员工' }}</div>
                    </div>
                    <div class="member-contact">
                      <div class="member-email">{{ member.email }}</div>
                      <div class="member-phone">{{ member.phone || '未设置' }}</div>
                    </div>
                    <div class="member-actions">
                      <lay-button size="xs" @click="editMember(member)">编辑</lay-button>
                      <lay-button size="xs" type="danger" @click="removeMember(member)">移除</lay-button>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-members">
                  <lay-icon type="layui-icon-username" />
                  <p>该部门暂无成员</p>
                </div>
              </div>
            </div>
          </lay-card>

          <!-- 未选择部门时的提示 -->
          <lay-card v-else>
            <div class="empty-selection">
              <lay-icon type="layui-icon-group" />
              <h3>请选择部门</h3>
              <p>从左侧组织架构中选择一个部门查看详细信息</p>
            </div>
          </lay-card>
        </lay-col>
      </lay-row>
    </div>

    <!-- 添加/编辑部门弹窗 -->
    <lay-layer v-model="showDepartmentModal" :title="departmentModalTitle" :area="['600px', '500px']">
      <div class="department-modal-content">
        <lay-form :model="departmentForm" ref="departmentFormRef" label-width="100px">
          <lay-form-item label="部门名称" prop="name" required>
            <lay-input v-model="departmentForm.name" placeholder="请输入部门名称" />
          </lay-form-item>

          <lay-form-item label="部门编码" prop="code" required>
            <lay-input v-model="departmentForm.code" placeholder="请输入部门编码" />
          </lay-form-item>

          <lay-form-item label="上级部门" prop="parentId" v-if="!isAddingRoot">
            <lay-select v-model="departmentForm.parentId" placeholder="选择上级部门">
              <lay-select-option v-for="dept in getSelectableDepartments()" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </lay-select-option>
            </lay-select>
          </lay-form-item>

          <lay-form-item label="部门类型" prop="type">
            <lay-select v-model="departmentForm.type" placeholder="选择部门类型">
              <lay-select-option value="company">公司</lay-select-option>
              <lay-select-option value="department">部门</lay-select-option>
              <lay-select-option value="team">团队</lay-select-option>
              <lay-select-option value="group">小组</lay-select-option>
            </lay-select>
          </lay-form-item>

          <lay-form-item label="部门负责人" prop="manager">
            <lay-select v-model="departmentForm.manager" placeholder="选择部门负责人">
              <lay-select-option value="">暂不设置</lay-select-option>
              <lay-select-option v-for="user in availableUsers" :key="user.id" :value="user.name">
                {{ user.name }} ({{ user.username }})
              </lay-select-option>
            </lay-select>
          </lay-form-item>

          <lay-form-item label="排序" prop="sort">
            <lay-input-number v-model="departmentForm.sort" :min="0" placeholder="排序号" />
          </lay-form-item>

          <lay-form-item label="部门状态" prop="status">
            <lay-radio-group v-model="departmentForm.status">
              <lay-radio value="active">启用</lay-radio>
              <lay-radio value="inactive">禁用</lay-radio>
            </lay-radio-group>
          </lay-form-item>

          <lay-form-item label="部门描述" prop="description">
            <lay-textarea v-model="departmentForm.description" placeholder="请输入部门描述" :rows="3" />
          </lay-form-item>
        </lay-form>

        <div class="modal-actions">
          <lay-button type="primary" @click="saveDepartment">
            <lay-icon type="layui-icon-ok" />
            保存
          </lay-button>
          <lay-button @click="closeDepartmentModal">
            <lay-icon type="layui-icon-close" />
            取消
          </lay-button>
        </div>
      </div>
    </lay-layer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';

// 响应式数据
const selectedDepartment = ref(null);
const showDepartmentModal = ref(false);
const isEditMode = ref(false);
const isAddingRoot = ref(false);
const departmentFormRef = ref();

// 部门表单
const departmentForm = reactive({
  id: '',
  name: '',
  code: '',
  parentId: '',
  type: 'department',
  manager: '',
  sort: 0,
  status: 'active',
  description: ''
});

// 模拟用户数据
const availableUsers = ref([
  { id: 1, name: '张三', username: 'zhangsan' },
  { id: 2, name: '李四', username: 'lisi' },
  { id: 3, name: '王五', username: 'wangwu' },
  { id: 4, name: '赵六', username: 'zhaoliu' }
]);

// 部门树形数据
const departmentTree = ref([
  {
    id: 1,
    name: 'Newbeall科技有限公司',
    code: 'NEWBEALL',
    type: 'company',
    level: 1,
    parentId: null,
    manager: '张三',
    status: 'active',
    description: '公司总部',
    createTime: '2024-01-01 10:00:00',
    sort: 1,
    userCount: 128,
    activeUserCount: 95,
    expanded: true,
    members: [
      { id: 1, name: '张三', position: '总经理', email: 'zhangsan@newbeall.com', phone: '13800138000' }
    ],
    children: [
      {
        id: 2,
        name: '销售部',
        code: 'SALES',
        type: 'department',
        level: 2,
        parentId: 1,
        manager: '李四',
        status: 'active',
        description: '负责产品销售和客户关系管理',
        createTime: '2024-01-02 09:00:00',
        sort: 1,
        userCount: 25,
        activeUserCount: 23,
        expanded: false,
        members: [
          { id: 2, name: '李四', position: '销售总监', email: 'lisi@newbeall.com', phone: '13800138001' },
          { id: 3, name: '王五', position: '销售经理', email: 'wangwu@newbeall.com', phone: '13800138002' }
        ],
        children: [
          {
            id: 5,
            name: '华北销售组',
            code: 'SALES_NORTH',
            type: 'team',
            level: 3,
            parentId: 2,
            manager: '王五',
            status: 'active',
            description: '负责华北地区销售业务',
            createTime: '2024-01-03 10:00:00',
            sort: 1,
            userCount: 12,
            activeUserCount: 11,
            expanded: false,
            members: [
              { id: 5, name: '王五', position: '组长', email: 'wangwu@newbeall.com', phone: '13800138002' }
            ]
          },
          {
            id: 6,
            name: '华南销售组',
            code: 'SALES_SOUTH',
            type: 'team',
            level: 3,
            parentId: 2,
            manager: '赵六',
            status: 'active',
            description: '负责华南地区销售业务',
            createTime: '2024-01-03 11:00:00',
            sort: 2,
            userCount: 13,
            activeUserCount: 12,
            expanded: false,
            members: [
              { id: 6, name: '赵六', position: '组长', email: 'zhaoliu@newbeall.com', phone: '13800138003' }
            ]
          }
        ]
      },
      {
        id: 3,
        name: '设计部',
        code: 'DESIGN',
        type: 'department',
        level: 2,
        parentId: 1,
        manager: '钱七',
        status: 'active',
        description: '负责产品设计和用户体验',
        createTime: '2024-01-02 10:00:00',
        sort: 2,
        userCount: 18,
        activeUserCount: 16,
        expanded: false,
        members: [
          { id: 7, name: '钱七', position: '设计总监', email: 'qianqi@newbeall.com', phone: '13800138004' }
        ]
      },
      {
        id: 4,
        name: '技术部',
        code: 'TECH',
        type: 'department',
        level: 2,
        parentId: 1,
        manager: '孙八',
        status: 'active',
        description: '负责技术开发和系统维护',
        createTime: '2024-01-02 11:00:00',
        sort: 3,
        userCount: 35,
        activeUserCount: 32,
        expanded: false,
        members: [
          { id: 8, name: '孙八', position: '技术总监', email: 'sunba@newbeall.com', phone: '13800138005' }
        ]
      }
    ]
  }
]);

// 计算属性
const departmentModalTitle = computed(() => {
  if (isAddingRoot.value) return '添加顶级部门';
  return isEditMode.value ? '编辑部门' : '添加子部门';
});

// 方法实现
const selectDepartment = (department: any) => {
  selectedDepartment.value = department;
};

const toggleExpand = (department: any) => {
  department.expanded = !department.expanded;
};

const expandAll = () => {
  const expandNode = (nodes: any[]) => {
    nodes.forEach(node => {
      node.expanded = true;
      if (node.children) {
        expandNode(node.children);
      }
    });
  };
  expandNode(departmentTree.value);
};

const collapseAll = () => {
  const collapseNode = (nodes: any[]) => {
    nodes.forEach(node => {
      node.expanded = false;
      if (node.children) {
        collapseNode(node.children);
      }
    });
  };
  collapseNode(departmentTree.value);
};

const refreshDepartments = () => {
  console.log('刷新部门列表');
};

const addRootDepartment = () => {
  isAddingRoot.value = true;
  isEditMode.value = false;
  resetDepartmentForm();
  showDepartmentModal.value = true;
};

const addSubDepartment = (parentDept: any) => {
  isAddingRoot.value = false;
  isEditMode.value = false;
  resetDepartmentForm();
  departmentForm.parentId = parentDept.id;
  showDepartmentModal.value = true;
};

const editDepartment = (department: any) => {
  isEditMode.value = true;
  isAddingRoot.value = false;
  Object.keys(departmentForm).forEach(key => {
    departmentForm[key as keyof typeof departmentForm] = department[key] || '';
  });
  showDepartmentModal.value = true;
};

const deleteDepartment = (department: any) => {
  console.log('删除部门:', department.name);
};

const resetDepartmentForm = () => {
  Object.keys(departmentForm).forEach(key => {
    if (key === 'type') {
      departmentForm[key as keyof typeof departmentForm] = 'department';
    } else if (key === 'status') {
      departmentForm[key as keyof typeof departmentForm] = 'active';
    } else if (key === 'sort') {
      departmentForm[key as keyof typeof departmentForm] = 0;
    } else {
      departmentForm[key as keyof typeof departmentForm] = '';
    }
  });
};

const closeDepartmentModal = () => {
  showDepartmentModal.value = false;
  resetDepartmentForm();
};

const saveDepartment = () => {
  console.log('保存部门:', departmentForm);
  closeDepartmentModal();
};

const getSelectableDepartments = () => {
  // 获取可选择的上级部门列表
  const flattenDepartments = (nodes: any[], result: any[] = []) => {
    nodes.forEach(node => {
      result.push(node);
      if (node.children) {
        flattenDepartments(node.children, result);
      }
    });
    return result;
  };
  return flattenDepartments(departmentTree.value);
};

const getDeptTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    'company': 'danger',
    'department': 'primary',
    'team': 'normal',
    'group': 'warm'
  };
  return colorMap[type] || 'normal';
};

const getDeptTypeName = (type: string) => {
  const nameMap: Record<string, string> = {
    'company': '公司',
    'department': '部门',
    'team': '团队',
    'group': '小组'
  };
  return nameMap[type] || type;
};

const getParentDepartmentName = (parentId: string | null) => {
  if (!parentId) return '无';
  const findParent = (nodes: any[]): string => {
    for (const node of nodes) {
      if (node.id === parentId) return node.name;
      if (node.children) {
        const found = findParent(node.children);
        if (found) return found;
      }
    }
    return '未找到';
  };
  return findParent(departmentTree.value);
};

const getSubDepartmentCount = (department: any) => {
  return department.children ? department.children.length : 0;
};

const addDepartmentMember = () => {
  console.log('添加部门成员');
};

const editMember = (member: any) => {
  console.log('编辑成员:', member);
};

const removeMember = (member: any) => {
  console.log('移除成员:', member);
};
</script>

<style scoped lang="scss">
.department-management-page {
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

.toolbar {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
}

.department-tree {
  .tree-node {
    margin-bottom: 4px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:hover {
      background: #f8f9fa;
    }

    &.selected {
      background: #e6f7ff;
      border: 1px solid #409eff;
    }

    .node-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;

      .node-info {
        display: flex;
        align-items: center;
        gap: 8px;

        .expand-icon {
          font-size: 12px;
          color: #666;
          cursor: pointer;
          width: 16px;

          &:hover {
            color: #409eff;
          }
        }

        .dept-icon {
          color: #409eff;
          font-size: 16px;
        }

        .dept-name {
          font-weight: 500;
          color: #333;
        }

        .dept-code {
          font-size: 12px;
          color: #999;
        }
      }

      .node-actions {
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }

    &:hover .node-actions {
      opacity: 1;
    }

    &.child-node {
      margin-left: 24px;

      .tree-line {
        width: 16px;
        height: 1px;
        background: #e0e0e0;
        margin-right: 8px;
      }
    }

    &.grandchild-node {
      margin-left: 48px;

      .tree-line.double {
        width: 32px;
      }
    }
  }

  .children-nodes {
    margin-left: 16px;
    border-left: 1px solid #e0e0e0;
    padding-left: 8px;
  }
}

.department-detail {
  .detail-section {
    margin-bottom: 32px;

    h4 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 16px;
      font-weight: 600;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 8px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h4 {
        margin: 0;
        border: none;
        padding: 0;
      }
    }
  }
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;

  .stat-icon {
    width: 48px;
    height: 48px;
    background: #409eff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;

    .layui-icon {
      color: white;
      font-size: 20px;
    }
  }

  .stat-info {
    .stat-number {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
    }
  }
}

.members-list {
  .member-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 8px;

    .member-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 12px;
      overflow: hidden;

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
      }
    }

    .member-info {
      flex: 1;
      margin-right: 12px;

      .member-name {
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }

      .member-position {
        font-size: 12px;
        color: #666;
      }
    }

    .member-contact {
      flex: 2;
      margin-right: 12px;

      .member-email,
      .member-phone {
        font-size: 14px;
        color: #666;
        margin-bottom: 2px;
      }
    }

    .member-actions {
      display: flex;
      gap: 4px;
    }
  }
}

.empty-members,
.empty-selection {
  text-align: center;
  padding: 40px 20px;
  color: #999;

  .layui-icon {
    font-size: 48px;
    margin-bottom: 16px;
    display: block;
  }

  h3 {
    margin: 0 0 8px 0;
    color: #666;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}

.department-modal-content {
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