<template>
  <div class="sales-permission-config-page">
    <div class="content-area">
      <lay-card>
        <!-- 工具栏区域 -->
        <div class="fixed-table-toolbar">
          <div class="bs-bars pull-left">
            <div class="hidden-xs" id="SalesPermissionTableToolbar" role="group">
              <span data-title="添加" @click="handleAdd" class="btnIcon invite-but">
                <lay-icon type="layui-icon-add-circle" />
              </span>
              <span data-title="修改" @click="handleEdit" class="btnIcon invite-but">
                <lay-icon type="layui-icon-edit" />
              </span>
              <span data-title="删除" @click="handleDelete" class="btnIcon invite-but">
                <lay-icon type="layui-icon-delete" />
              </span>
              <span style="margin-right: 10px;" data-title="权限设置" @click="handlePermission" class="btnIcon invite-but">
                <lay-icon type="layui-icon-set" />
              </span>
            </div>
          </div>
        </div>

        <!-- 销售权限配置列表表格 -->
        <div class="table-container">
          <lay-table :columns="columns" :data-source="tableData" :page="pagination" @change="handleTableChange">
            <!-- 选择框列 -->
            <template #checkbox="{ row }">
              <div class="custom-checkbox" @click="toggleRowCheck(row)">
                <div class="checkbox-square" :class="{ checked: row.checked }">
                  <lay-icon v-if="row.checked" type="layui-icon-ok" />
                </div>
              </div>
            </template>

            <!-- 备注列 -->
            <template #remark="{ row }">
              <span class="remark-text" :title="row.tips">
                {{ row.tips }}
              </span>
            </template>
          </lay-table>
        </div>
      </lay-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import http from '@/utils/http';
import Notify from '@/utils/notify';

// 销售权限配置接口类型定义
interface SalesPermissionConfig {
  checked: boolean;
  pName: string;        // 父级名称
  num: number;          // 序号
  pid: number;          // 父级ID
  simplename: string;   // 部门简称
  id: number;           // 部门ID
  fullname: string;     // 部门全称
  pids: string;         // 父级IDs
  tips: string;         // 备注
  cid: number;          // 公司ID
}

// API返回的原始数据类型
interface DeptApiData {
  pName: string;
  num: number;
  pid: number;
  simplename: string;
  id: number;
  fullname: string;
  pids: string;
  tips: string;
  cid: number;
}

// 表格列配置
const columns = [
  { title: '', key: 'checkbox', width: '50px', customSlot: 'checkbox', type: 'custom' },
  { title: '部门简称', key: 'simplename', width: '150px', type: 'text' },
  { title: '部门全称', key: 'fullname', width: '200px', type: 'text' },
  { title: '父级部门', key: 'pName', width: '150px', type: 'text' },
  { title: '排序', key: 'num', width: '80px', type: 'text' },
  { title: '备注', key: 'tips', width: '200px', customSlot: 'remark', type: 'custom' }
];

// 获取部门列表
const fetchdeptList = async () => {
  try {
    const formData = new FormData();
    formData.append('order', 'desc');
    formData.append('offset', ((pagination.current - 1) * pagination.limit).toString());
    formData.append('limit', pagination.limit.toString());

    const response = await http.post('/dept/list', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if (response) {
      let dataList: DeptApiData[] = [];
      if (Array.isArray(response)) {
        // 如果响应直接是数组
        dataList = response;
        pagination.total = response.length;
        console.log('响应是数组，直接使用:', dataList);
      }
      tableData.value = dataList.map((item: DeptApiData): SalesPermissionConfig => ({
        ...item,
        checked: false
      }));
    }
  } catch {
    Notify.error({
      title: '获取数据失败',
      content: '无法获取部门数据，请稍后重试',
      time: 3000
    });
  }
};

// 表格数据
const tableData = ref<SalesPermissionConfig[]>([]);

// 分页配置
const pagination = reactive({
  current: 1,
  limit: 10,
  total: 0
});

// 切换行复选框状态
const toggleRowCheck = (row: SalesPermissionConfig) => {
  row.checked = !row.checked;
  console.log('选中行:', row);
};

// 表格变化处理
const handleTableChange = (pageData: { current: number; limit: number }) => {
  pagination.current = pageData.current;
  pagination.limit = pageData.limit;
  fetchdeptList(); // 重新获取数据
};

// 添加部门
const handleAdd = () => {
  console.log('添加新部门');
  // 这里可以打开添加部门的弹窗
};

// 修改部门
const handleEdit = () => {
  const selectedRows = tableData.value.filter(row => row.checked);
  if (selectedRows.length === 0) {
    console.log('请选择要修改的部门');
    return;
  }
  if (selectedRows.length > 1) {
    console.log('只能选择一个部门进行修改');
    return;
  }
  console.log('修改部门:', selectedRows[0]);
  // 这里可以打开编辑部门的弹窗
};

// 删除部门
const handleDelete = () => {
  const selectedRows = tableData.value.filter(row => row.checked);
  if (selectedRows.length === 0) {
    console.log('请选择要删除的部门');
    return;
  }
  console.log('删除部门:', selectedRows);
  // 这里可以执行删除操作
};

// 权限设置
const handlePermission = () => {
  const selectedRows = tableData.value.filter(row => row.checked);
  if (selectedRows.length === 0) {
    console.log('请选择要设置权限的部门');
    return;
  }
  console.log('设置部门权限:', selectedRows);
  // 这里可以打开权限设置弹窗
};

// 测试数据功能（用于调试）
const loadTestData = () => {
  const testData: DeptApiData[] = [
    {
      "pName": "--",
      "num": 1,
      "pid": 0,
      "simplename": "销售部",
      "id": 31,
      "fullname": "销售一部",
      "pids": "[0],",
      "tips": "用于测试",
      "cid": 99
    }
  ];

  tableData.value = testData.map((item: DeptApiData): SalesPermissionConfig => ({
    ...item,
    checked: false
  }));

  pagination.total = testData.length;
  console.log('加载测试数据:', tableData.value);
};

onMounted(() => {
  fetchdeptList();
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

  .pull-left {
    float: left;
  }

  .bs-bars {
    display: inline-block;
  }

  .btnIcon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 14px;
    margin-right: 8px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #495057;
    font-size: 12px;
    width: 40px;
    height: 40px;

    &:hover {
      background: #e9ecef;
      border-color: #adb5bd;
    }

    .layui-icon {
      font-size: 15px;
      vertical-align: middle;
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

  &::after {
    content: "";
    display: table;
    clear: both;
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

// 备注文本样式
.remark-text {
  font-size: 12px;
  color: #333;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
}
</style>