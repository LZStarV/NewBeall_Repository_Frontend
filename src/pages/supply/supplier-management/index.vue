<template>
  <div class="supplier-management-page">
    <!-- 顶部字母索引 -->
    <div class="alphabet-nav">
      <span class="nav-label">按供应商名称字母搜索</span>
      <div class="alphabet-list">
        <span
          v-for="letter in alphabetList"
          :key="letter"
          class="alphabet-item"
          :class="{ active: activeLetter === letter }"
          @click="selectLetter(letter)"
        >
          {{ letter }}
        </span>
      </div>
      <lay-button type="normal" size="sm" @click="clearFilter">清除</lay-button>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="search-section">
      <div class="search-row">
        <div class="search-item">
          <lay-input
            v-model="searchForm.company"
            placeholder="供应商名称"
            allow-clear
          />
        </div>
        <div class="search-item">
          <lay-input
            v-model="searchForm.contact"
            placeholder="联系人"
            allow-clear
          />
        </div>
        <div class="search-item">
          <lay-select
            v-model="searchForm.category"
            placeholder="供应商类型"
            allow-clear
          >
            <lay-select-option value="设备供应商">设备供应商</lay-select-option>
            <lay-select-option value="材料供应商">材料供应商</lay-select-option>
            <lay-select-option value="服务供应商">服务供应商</lay-select-option>
            <lay-select-option value="技术供应商">技术供应商</lay-select-option>
          </lay-select>
        </div>
        <div class="search-item">
          <lay-select
            v-model="searchForm.status"
            placeholder="合作状态"
            allow-clear
          >
            <lay-select-option value="正在合作">正在合作</lay-select-option>
            <lay-select-option value="暂停合作">暂停合作</lay-select-option>
            <lay-select-option value="潜在合作">潜在合作</lay-select-option>
            <lay-select-option value="已终止">已终止</lay-select-option>
          </lay-select>
        </div>
        <div class="search-item">
          <lay-select
            v-model="searchForm.level"
            placeholder="供应商等级"
            allow-clear
          >
            <lay-select-option value="A级">A级</lay-select-option>
            <lay-select-option value="B级">B级</lay-select-option>
            <lay-select-option value="C级">C级</lay-select-option>
          </lay-select>
        </div>
        <lay-button type="primary" @click="searchSuppliers">
          <i class="layui-icon layui-icon-search"></i>
          查询
        </lay-button>
      </div>
    </div>

    <!-- 工具栏 -->
    <!-- <div class="toolbar">
      <div class="toolbar-left">
        <lay-button type="primary" size="sm" @click="addSupplier">
          <i class="layui-icon layui-icon-add-1"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="editSupplier">
          <i class="layui-icon layui-icon-edit"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="sortSuppliers">
          <i class="layui-icon layui-icon-up-down"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="exportSuppliers">
          <i class="layui-icon layui-icon-download-circle"></i>
        </lay-button>
        <lay-button type="danger" size="sm" @click="deleteSuppliers">
          <i class="layui-icon layui-icon-delete"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="shareSuppliers">
          <i class="layui-icon layui-icon-share"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="viewSuppliers">
          <i class="layui-icon layui-icon-survey"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="refreshSuppliers">
          <i class="layui-icon layui-icon-refresh-3"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="configColumns">
          <i class="layui-icon layui-icon-set"></i>
        </lay-button>
      </div>
    </div> -->

    <!-- 供应商列表 -->
    <div class="supplier-list">
      <div class="layui-row layui-col-space20">
        <div
          v-for="supplier in supplierList"
          :key="supplier.id"
          class="layui-col-md12 layui-col-lg6 layui-col-xl4"
        >
          <div class="supplier-card">
            <div class="card-header">
              <h4 class="company-name">{{ supplier.companyName }}</h4>
              <div class="card-actions">
                <!-- <i class="layui-icon layui-icon-edit" @click="editSupplier(supplier)"></i> -->
              </div>
            </div>

            <div class="card-body">
              <div class="supplier-info">
                <div class="contact-name">
                  <span class="name">{{ supplier.contactName }}</span>
                  <span class="position">{{ supplier.position }}</span>
                </div>

                <div class="supplier-meta">
                  <div class="meta-item">
                    <span class="meta-label">供应商类型:</span>
                    <span class="meta-value category-tag" :class="supplier.category">{{ supplier.category }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">合作状态:</span>
                    <span class="meta-value status-tag" :class="supplier.status">{{ supplier.status }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">供应商等级:</span>
                    <span class="meta-value level-tag" :class="supplier.level">{{ supplier.level }}</span>
                  </div>
                </div>

                <div class="contact-details">
                  <div class="detail-item">
                    <i class="layui-icon layui-icon-cellphone"></i>
                    <span>{{ supplier.phone }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="layui-icon layui-icon-email"></i>
                    <span>{{ supplier.email }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="layui-icon layui-icon-location"></i>
                    <span>{{ supplier.address }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="layui-icon layui-icon-website"></i>
                    <span>{{ supplier.website }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="layui-icon layui-icon-rmb"></i>
                    <span>合作金额: ¥{{ supplier.cooperationAmount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <div class="pagination-info">
        显示第 {{ pagination.current }} 到第 {{ Math.min(pagination.current * pagination.limit, pagination.total) }} 条记录，总共 {{ pagination.total }} 条记录 每页显示
        <lay-select v-model="pagination.limit" size="sm" style="width: 80px; margin: 0 5px">
          <lay-select-option value="10">10</lay-select-option>
          <lay-select-option value="20">20</lay-select-option>
          <lay-select-option value="50">50</lay-select-option>
        </lay-select>
        条记录
      </div>

      <lay-page
        v-model="pagination.current"
        :total="pagination.total"
        :limit="pagination.limit"
        :show-count="true"
        :show-skip="true"
        :show-limits="false"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';

// 字母表
const alphabetList = ref(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
const activeLetter = ref('A');

// 搜索表单
const searchForm = reactive({
  company: '',
  contact: '',
  category: '',
  status: '',
  level: ''
});

// 分页信息
const pagination = reactive({
  current: 1,
  total: 156,
  limit: 10
});

// 供应商列表数据
const supplierList = ref([
  {
    id: 1,
    companyName: '深圳智能设备有限公司',
    contactName: '李明',
    position: '销售经理',
    phone: '13800138001',
    email: 'liming@smart-device.com',
    address: '深圳市南山区科技园南区',
    website: 'www.smart-device.com',
    category: '设备供应商',
    status: '正在合作',
    level: 'A级',
    cooperationAmount: '2,580,000'
  },
  {
    id: 2,
    companyName: '上海新材料科技股份有限公司',
    contactName: '王芳',
    position: '业务总监',
    phone: '13900139001',
    email: 'wangfang@newmaterial.com',
    address: '上海市浦东新区张江高科技园区',
    website: 'www.newmaterial.com',
    category: '材料供应商',
    status: '正在合作',
    level: 'A级',
    cooperationAmount: '1,850,000'
  },
  {
    id: 3,
    companyName: '北京技术服务集团',
    contactName: '张强',
    position: '项目经理',
    phone: '13700137001',
    email: 'zhangqiang@techservice.com',
    address: '北京市海淀区中关村软件园',
    website: 'www.techservice.com',
    category: '技术供应商',
    status: '潜在合作',
    level: 'B级',
    cooperationAmount: '980,000'
  }
]);

// 选择字母
const selectLetter = (letter: string) => {
  activeLetter.value = letter;
  // 这里可以添加按字母筛选的逻辑
};

// 清除筛选
const clearFilter = () => {
  activeLetter.value = '';
  Object.keys(searchForm).forEach(key => {
    // searchForm[key] = '';
  });
};

// 搜索供应商
const searchSuppliers = () => {
  console.log('搜索供应商', searchForm);
  // 实现搜索逻辑
};

// 工具栏操作
// const addSupplier = () => {
//   console.log('添加供应商');
// };

// const editSupplier = (supplier?: any) => {
//   console.log('编辑供应商', supplier);
// };

// const sortSuppliers = () => {
//   console.log('排序供应商');
// };

// const exportSuppliers = () => {
//   console.log('导出供应商');
// };

// const deleteSuppliers = () => {
//   console.log('删除供应商');
// };

// const shareSuppliers = () => {
//   console.log('分享供应商');
// };

// const viewSuppliers = () => {
//   console.log('查看供应商');
// };

// const refreshSuppliers = () => {
//   console.log('刷新供应商');
// };

// const configColumns = () => {
//   console.log('配置列');
// };

// 分页变化
const handlePageChange = (current: number) => {
  pagination.current = current;
  // 加载对应页码的数据
};

onMounted(() => {
  // 初始化加载数据
});
</script>

<style scoped lang="scss">
.supplier-management-page {
  height: 100vh;
  padding: 0;
  background-color: #f5f5f5;
}

.alphabet-nav {
  background: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #e8e8e8;

  .nav-label {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
  }

  .alphabet-list {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    flex: 1;

    .alphabet-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 13px;
      font-weight: 500;
      color: #666;
      background: #fafafa;

      &:hover {
        border-color: var(--global-primary-color);
        color: var(--global-primary-color);
        background: #f0f8ff;
      }

      &.active {
        background-color: var(--global-primary-color);
        border-color: var(--global-primary-color);
        color: white;
      }
    }
  }
}

.search-section {
  background: white;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;

  .search-row {
    display: flex;
    gap: 15px;
    align-items: center;
    flex-wrap: wrap;

    .search-item {
      min-width: 200px;
      flex: 1;
    }
  }
}

.toolbar {
  background: white;
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;

  .toolbar-left {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}

.supplier-list {
  background: #f5f5f5;
  padding: 20px;
  min-height: calc(100vh - 300px);

  .supplier-card {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;
    height: 320px;
    background: white;
    margin-bottom: 20px;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-color: var(--global-primary-color);
      transform: translateY(-2px);
    }

    .card-header {
      background: linear-gradient(135deg, var(--global-primary-color), #40a9ff);
      color: white;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;

      .company-name {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .card-actions {
        i {
          cursor: pointer;
          font-size: 16px;
          opacity: 0.8;
          transition: opacity 0.2s ease;

          &:hover {
            opacity: 1;
          }
        }
      }
    }

    .card-body {
      padding: 20px;
      height: 260px;
      overflow: hidden;

      .supplier-info {
        .contact-name {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;

          .name {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }

          .position {
            font-size: 12px;
            color: #666;
            padding: 2px 8px;
            background: #f0f8ff;
            border-radius: 12px;
          }
        }

        .supplier-meta {
          margin-bottom: 15px;

          .meta-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 13px;

            .meta-label {
              color: #666;
              min-width: 80px;
            }

            .meta-value {
              font-weight: 500;

              &.category-tag {
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;

                &.设备供应商 {
                  background: #e6f7ff;
                  color: #1890ff;
                }
                &.材料供应商 {
                  background: #f6ffed;
                  color: #52c41a;
                }
                &.技术供应商 {
                  background: #fff2e6;
                  color: #fa8c16;
                }
                &.服务供应商 {
                  background: #f9f0ff;
                  color: #722ed1;
                }
              }

              &.status-tag {
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;

                &.正在合作 {
                  background: #f6ffed;
                  color: #52c41a;
                }
                &.暂停合作 {
                  background: #fff2e6;
                  color: #fa8c16;
                }
                &.潜在合作 {
                  background: #e6f7ff;
                  color: #1890ff;
                }
                &.已终止 {
                  background: #fff2f0;
                  color: #ff4d4f;
                }
              }

              &.level-tag {
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;

                &.A级 {
                  background: #fff2e6;
                  color: #fa8c16;
                }
                &.B级 {
                  background: #e6f7ff;
                  color: #1890ff;
                }
                &.C级 {
                  background: #f0f0f0;
                  color: #666;
                }
              }
            }
          }
        }

        .contact-details {
          .detail-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;
            font-size: 12px;
            color: #666;
            line-height: 1.4;

            i {
              color: var(--global-primary-color);
              width: 14px;
              text-align: center;
              font-size: 12px;
            }

            span {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}

.pagination-wrapper {
  background: white;
  padding: 15px 20px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .pagination-info {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666;
  }
}

// 响应式布局
@media screen and (max-width: 1200px) {
  .supplier-list {
    .layui-col-xl4 {
      width: 50% !important;
    }
  }
}

@media screen and (max-width: 768px) {
  .supplier-management-page {
    padding: 0;
  }

  .alphabet-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 15px;

    .alphabet-list {
      width: 100%;
      justify-content: center;
    }
  }

  .search-section {
    padding: 15px;

    .search-row {
      flex-direction: column;

      .search-item {
        width: 100%;
        min-width: auto;
      }
    }
  }

  .toolbar {
    padding: 15px;

    .toolbar-left {
      flex-wrap: wrap;
    }
  }

  .supplier-list {
    padding: 15px;

    .supplier-card {
      height: auto;
      min-height: 280px;

      .card-body {
        height: auto;
        padding: 15px;
      }
    }
  }

  .pagination-wrapper {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
    padding: 15px;
  }
}
</style>
