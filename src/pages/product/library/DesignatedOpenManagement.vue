<template>
  <!-- 指定开放管理弹窗 -->
  <RightSideModal 
    :visible="visible" 
    :title="`指定开放管理`" 
    :width="rightModalWidth"
    :mask-closable="true" 
    @close="handleClose"
  >
    <div class="permission-management">
      <!-- 注意提示 -->
      <div class="notice-section">
        <div class="notice-content">
          <span class="notice-text">注意：当前操作产品：</span>
          <span class="product-name">{{ selectedProduct?.name || '测试产品' }}</span>
        </div>
      </div>

      <!-- 授权公司选择 -->
      <div class="company-select-section">
        <div class="select-container">
          <lay-select v-model="selectedCompany" :placeholder="companySearchText" style="width: 200px;">
            <lay-select-option value="">请选择授权公司</lay-select-option>
            <lay-select-option
v-for="company in authorizedCompanies" :key="company.id"
              :value="company.id">
              {{ company.name }}
            </lay-select-option>
          </lay-select>
          <button class="add-btn">
            <lay-icon type="layui-icon-addition" />
          </button>
        </div>
      </div>

      <!-- 公司列表表格 -->
      <div class="company-table-section">
        <div class="table-toolbar">
          <div class="dropdown-container">
            <button
type="button" aria-label="columns"
              class="btn btn-default btn-outline dropdown-toggle"
              @click="toggleColumnsDropdown">
              <lay-icon type="layui-icon-shrink-right" />
            </button>
            <ul class="dropdown-menu" :class="{ 'show': showColumnsDropdown }">
              <li role="menuitem">
                <label>
                  <input
v-model="columnVisibility.companyName" type="checkbox"
                    @change="updateVisibleColumns" /> 公司名称
                </label>
              </li>
              <li role="menuitem">
                <label>
                  <input
v-model="columnVisibility.deleteRule" type="checkbox"
                    @change="updateVisibleColumns" /> 删除规则
                </label>
              </li>
              <li role="menuitem">
                <label>
                  <input
v-model="columnVisibility.status" type="checkbox"
                    @change="updateVisibleColumns" /> 状态
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="company-table">
          <table class="simple-table">
            <thead>
              <tr>
                <th v-if="columnVisibility.companyName">公司名称</th>
                <th v-if="columnVisibility.deleteRule">删除规则</th>
                <th v-if="columnVisibility.status">状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="company in authorizedCompanies" :key="company.id">
                <td v-if="columnVisibility.companyName">{{ company.name }}</td>
                <td v-if="columnVisibility.deleteRule">默认规则</td>
                <td v-if="columnVisibility.status">
                  <span
                    :class="['status-badge', company.status === '已授权' ? 'authorized' : 'unauthorized']">
                    {{ company.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="authorizedCompanies.length === 0">
                <td :colspan="getVisibleColumnsCount()" class="no-data">无数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </RightSideModal>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import RightSideModal from '@/components/RightSideModal.vue';
import http from '@/utils/http';

// 公司接口类型定义
interface Company {
  id: number | string
  name: string
  status: string
}

// 定义组件的props
interface Props {
  visible: boolean
  selectedProduct?: any
  rightModalWidth: string
  authorizedCompanies: Company[]
}

const props = withDefaults(defineProps<Props>(), {
  rightModalWidth: '35%',
  authorizedCompanies: () => []
});

// 定义组件的emits
const emit = defineEmits<{
  close: []
  updateAuthorizedCompanies: [companies: Company[]]
}>();

// 选中的公司
const selectedCompany = ref('');

// 公司搜索文本
const companySearchText = ref('请选择授权公司');

// 表格列显示控制
const columnVisibility = reactive({
  companyName: true,
  deleteRule: true,
  status: true
});

// 控制列显示下拉框
const showColumnsDropdown = ref(false);

// 计算属性：本地授权公司列表
const authorizedCompanies = computed(() => props.authorizedCompanies);

// 关闭弹窗
const handleClose = () => {
  selectedCompany.value = '';
  showColumnsDropdown.value = false;
  emit('close');
};

// 切换列显示下拉框
const toggleColumnsDropdown = () => {
  showColumnsDropdown.value = !showColumnsDropdown.value;
};

// 获取可见列数量
const getVisibleColumnsCount = () => {
  return Object.values(columnVisibility).filter(Boolean).length;
};

// 更新可见列
const updateVisibleColumns = () => {
  // 列显示状态更新时的处理逻辑
};
</script>

<style lang="scss" scoped>
// 指定开放管理弹窗样式
.permission-management {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;

  .notice-section {
    margin-bottom: 20px;
    padding: 12px 16px;
    background: #f0f8ff;
    border: 1px solid #d6eaff;
    border-radius: 6px;

    .notice-content {
      display: flex;
      align-items: center;
      gap: 8px;

      .notice-text {
        color: #666;
        font-size: 14px;
      }

      .product-name {
        color: #1890ff;
        font-weight: 500;
        font-size: 14px;
      }
    }
  }

  .company-select-section {
    margin-bottom: 20px;

    .select-container {
      display: flex;
      align-items: center;
      gap: 12px;

      .add-btn {
        background: #1890ff;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease;

        &:hover {
          background: #40a9ff;
        }

        .layui-icon {
          font-size: 14px;
        }
      }
    }
  }

  .company-table-section {
    .table-toolbar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 12px;

      .dropdown-container {
        position: relative;

        .btn {
          background: #f0f0f0;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;

          &:hover {
            background: #e6f7ff;
            border-color: #91d5ff;
          }

          .layui-icon {
            font-size: 14px;
            color: #666;
          }
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
    }

    .company-table {
      .simple-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;

        th,
        td {
          border: 1px solid #e8e8e8;
          padding: 8px 12px;
          text-align: left;
        }

        th {
          background-color: #f8f9fa;
          font-weight: 500;
          color: #333;
        }

        td {
          color: #666;
        }

        .status-badge {
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 11px;
          
          &.authorized {
            background: #f6ffed;
            color: #52c41a;
            border: 1px solid #b7eb8f;
          }

          &.unauthorized {
            background: #fff2f0;
            color: #ff4d4f;
            border: 1px solid #ffccc7;
          }
        }

        .no-data {
          text-align: center;
          padding: 20px;
          color: #888;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
