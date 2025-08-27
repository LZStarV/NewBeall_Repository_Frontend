<template>
  <!-- 品牌自动报价管理弹窗 -->
  <RightSideModal 
    :visible="visible" 
    :title="`品牌自动报价管理`" 
    :width="rightModalWidth"
    :mask-closable="true" 
    @close="handleClose"
  >
    <div class="brand-price-management">
      <!-- 顶部输入搜索区域 -->
      <div class="search-section">
        <div class="search-row">
          <label>请输入公司名称</label>
          <input 
            type="text" 
            v-model="formData.companyName" 
            placeholder="请输入公司名称"
            class="search-input" 
          />
          <span class="highlight-text">{{ brandDisplayText }}</span>
        </div>
      </div>

      <!-- 添加按钮和表格 -->
      <div class="table-section">
        <!-- 添加按钮 -->
        <div class="add-button-row">
          <button class="add-btn" @click="handleAddCompany">
            <lay-icon type="layui-icon-add-1" />
          </button>
          <div class="column-filter">
            <lay-icon type="layui-icon-shrink-right" @click="toggleColumnsDropdown" />
            <div v-if="showColumnsDropdown" class="columns-dropdown">
              <div class="dropdown-header">
                <span>选择显示列</span>
                <button @click="toggleColumnsDropdown" class="close-dropdown">×</button>
              </div>
              <div class="column-options">
                <label v-for="column in allColumns" :key="column.key">
                  <input type="checkbox" v-model="columnVisibility[column.key]" />
                  {{ column.title }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 品牌自动报价表格 -->
        <div class="brand-price-table-container">
          <table class="brand-price-table">
            <thead>
              <tr>
                <th v-if="columnVisibility.companyName">公司名称</th>
                <th v-if="columnVisibility.entryTime">载至时间</th>
                <th v-if="columnVisibility.defaultPrice">默认折率</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="company in companyList" :key="company.id">
                <td v-if="columnVisibility.companyName">{{ company.name }}</td>
                <td v-if="columnVisibility.entryTime">{{ company.entryTime }}</td>
                <td v-if="columnVisibility.defaultPrice">{{ company.defaultPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="pagination-section">
          <div class="pagination-controls">
            <span class="pagination-info">共 {{ totalCount }} 条</span>
            <div class="pagination-buttons">
              <button class="page-btn current">{{ pagination.currentPage }}</button>
            </div>
            <div class="page-size-selector">
              <select v-model="pagination.pageSize">
                <option value="10">10 条/页</option>
                <option value="20">20 条/页</option>
                <option value="50">50 条/页</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </RightSideModal>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import RightSideModal from '@/components/RightSideModal.vue'
import http from '@/utils/http';
import Notify from '@/utils/notify';

// 定义组件的props
interface Props {
  visible: boolean
  selectedBrand?: any
  rightModalWidth: string
}

const props = withDefaults(defineProps<Props>(), {
  rightModalWidth: '35%'
})

// 定义组件的emits
const emit = defineEmits<{
  close: []
}>()

// 表单数据
const formData = reactive({
  companyName: ''
})

// 显示当前操作的品牌
const brandDisplayText = computed(() => {
  return props.selectedBrand ? `当前操作品牌${props.selectedBrand.name}` : '当前操作品牌自产优质'
})

// 表格列配置
const allColumns = ref([
  { key: 'companyName', title: '公司名称' },
  { key: 'entryTime', title: '载至时间' },
  { key: 'defaultPrice', title: '默认折率' }
])

// 表格列显示控制
const columnVisibility = reactive<Record<string, boolean>>({
  companyName: true,
  entryTime: true,
  defaultPrice: true
})

// 表格数据（模拟数据）
const companyList = ref([
  { id: 1, name: '公司A', entryTime: '2023-01-01', defaultPrice: '80%' },
  { id: 2, name: '公司B', entryTime: '2023-01-02', defaultPrice: '75%' },
  { id: 3, name: '公司C', entryTime: '2023-01-03', defaultPrice: '70%' }
])

// 总条数
const totalCount = computed(() => companyList.value.length)

// 分页配置
const pagination = reactive({
  pageSize: 10,
  currentPage: 1
})

// 控制列显示下拉框
const showColumnsDropdown = ref(false)

// 关闭弹窗
const handleClose = () => {
  formData.companyName = ''
  showColumnsDropdown.value = false
  emit('close')
}

// 添加公司
const handleAddCompany = () => {
  console.log('添加公司')
  // 这里可以添加添加公司的逻辑
}

// 切换列显示下拉框
const toggleColumnsDropdown = () => {
  showColumnsDropdown.value = !showColumnsDropdown.value
}
</script>

<style lang="scss" scoped>
// 品牌自动报价管理弹窗样式
.brand-price-management {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;

  .search-section {
    margin-bottom: 24px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #eee;

    .search-row {
      display: flex;
      align-items: center;
      gap: 16px;

      label {
        font-weight: 500;
        color: #333;
        font-size: 14px;
      }

      .search-input {
        flex: 1;
        height: 36px;
        padding: 8px 12px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        font-size: 14px;
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
          font-size: 13px;
        }
      }

      .highlight-text {
        font-size: 12px;
        color: #888;
      }
    }
  }

  .table-section {
    .add-button-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .add-btn {
        background: #1890ff;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
          background: #40a9ff;
        }

        .layui-icon {
          font-size: 12px;
        }
      }

      .column-filter {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;

        .layui-icon {
          font-size: 16px;
          cursor: pointer;
          color: #666;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;

          &:hover {
            background: #f0f0f0;
            color: #333;
          }
        }

        .columns-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 1000;
          min-width: 160px;
          background: white;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          margin-top: 4px;

          .dropdown-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: #f8f9fa;
            border-bottom: 1px solid #eee;

            span {
              font-weight: 500;
              color: #333;
              font-size: 14px;
            }

            .close-dropdown {
              background: none;
              border: none;
              font-size: 16px;
              cursor: pointer;
              color: #888;
              padding: 4px;
              border-radius: 4px;
              transition: all 0.2s;

              &:hover {
                background-color: #f5f5f5;
                color: #333;
              }
            }
          }

          .column-options {
            padding: 8px 0;

            label {
              display: block;
              padding: 8px 12px;
              font-weight: normal;
              line-height: 1.4;
              color: #333;
              white-space: nowrap;
              cursor: pointer;
              margin: 0;
              transition: background-color 0.2s;

              &:hover {
                background-color: #f5f5f5;
              }

              input[type="checkbox"] {
                margin-right: 8px;
              }
            }
          }
        }
      }
    }

    .brand-price-table-container {
      background: white;
      border-radius: 8px;
      border: 1px solid #e8e8e8;
      overflow: hidden;
      margin-bottom: 16px;

      .brand-price-table {
        width: 100%;
        border-collapse: collapse;

        thead tr {
          background: #f8f9fa;
        }

        th,
        td {
          padding: 12px 16px;
          text-align: center;
          border-bottom: 1px solid #e8e8e8;
        }

        th {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        td {
          color: #666;
          font-size: 13px;
        }

        tbody tr:hover {
          background-color: #f0f8ff;
        }
      }
    }

    .pagination-section {
      .pagination-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;

        .pagination-info {
          color: #666;
          font-size: 14px;
        }

        .pagination-buttons {
          display: flex;
          gap: 4px;

          .page-btn {
            background: #1890ff;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;

            &.current {
              background: #1890ff;
            }
          }
        }

        .page-size-selector {
          select {
            padding: 6px 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 12px;
            background: white;
            cursor: pointer;

            &:focus {
              border-color: #1890ff;
              outline: none;
            }
          }
        }
      }
    }
  }
}
</style>
