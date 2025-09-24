<template>
  <div class="customer-management-page">
    <div class="header">
      <!-- 顶部字母索引 -->
      <section class="alphabet-nav">
        <span class="nav-label">按姓名字母搜索</span>
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
        <lay-button type="normal" size="sm" @click="clearFilter"
          >清除</lay-button
        >
      </section>
      <!-- 搜索筛选区域 -->
      <div class="search-section">
        <div class="search-item">
          <lay-input
            v-model="listParams.contacts"
            placeholder="综合搜索"
            allow-clear
          />
        </div>
        <div class="search-item">
          <lay-select
            v-model="listParams.clientStatus"
            placeholder="跟进状态"
            allow-clear
          >
            <lay-select-option value="初访">初访</lay-select-option>
            <lay-select-option value="意向">意向</lay-select-option>
            <lay-select-option value="报价">报价</lay-select-option>
            <lay-select-option value="成交">成交</lay-select-option>
            <lay-select-option value="暂时搁置">暂时搁置</lay-select-option>
          </lay-select>
        </div>
        <div class="search-item">
          <lay-select
            v-model="listParams.clientSource"
            placeholder="客户来源"
            allow-clear
          >
            <lay-select-option value="广告">广告</lay-select-option>
            <lay-select-option value="社交推广">社交推广</lay-select-option>
            <lay-select-option value="研讨会">研讨会</lay-select-option>
            <lay-select-option value="搜索引擎">搜索引擎</lay-select-option>
            <lay-select-option value="客户介绍">客户介绍</lay-select-option>
            <lay-select-option value="独立开发">独立开发</lay-select-option>
            <lay-select-option value="代理商">代理商</lay-select-option>
            <lay-select-option value="其他">其他</lay-select-option>
          </lay-select>
        </div>
        <div class="search-item">
          <lay-select
            v-model="listParams.categoryName"
            placeholder="客户类型"
            allow-clear
            :options="CategoryOptions"
          >
          </lay-select>
        </div>
        <lay-button type="primary" @click="searchCustomers">
          <i class="layui-icon layui-icon-search"></i>
          查询
        </lay-button>
      </div>
    </div>

    <div class="details">
      <!-- 工具栏 -->
      <div class="toolbar">
        <SvgIcon name="add_to"></SvgIcon>
        <SvgIcon name="edit"></SvgIcon>
        <SvgIcon name="export"></SvgIcon>
        <SvgIcon name="download"></SvgIcon>
        <SvgIcon name="delete"></SvgIcon>
        <SvgIcon name="share"></SvgIcon>
        <SvgIcon name="eye"></SvgIcon>
      </div>
      <!-- 客户列表 -->
      <div class="customer-list">
        <div class="layui-row layui-col-space20">
          <div
            v-for="customer in customerList"
            :key="customer.id"
            class="layui-col-md12 layui-col-lg6 layui-col-xl4"
          >
            <div class="customer-card">
              <div class="card-header">
                <h4 class="company-name">{{ customer.contacts }}</h4>
                <div class="card-actions">
                  <!-- <i class="layui-icon layui-icon-edit" @click="editCustomer(customer)"></i> -->
                </div>
              </div>

              <div class="card-body">
                <div class="contact-info">
                  <div class="contact-name">
                    <span class="name">{{ customer.contactUser }}</span>
                    <span class="position">{{ customer.job }}</span>
                  </div>

                  <div class="contact-details">
                    <div class="detail-item">
                      <i class="layui-icon layui-icon-cellphone"></i>
                      <span>{{ customer.tel }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="layui-icon layui-icon-login-qq"></i>
                      <span>{{ customer.qq }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="layui-icon layui-icon-email"></i>
                      <span>{{ customer.email }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="layui-icon layui-icon-location"></i>
                      <span>{{ customer.address }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="layui-icon layui-icon-website"></i>
                      <span>{{ customer.clientWebsite }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
    <!-- <div class="toolbar">
      <div class="toolbar-left">
        <lay-button type="primary" size="sm" @click="addCustomer">
          <i class="layui-icon layui-icon-add-1"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="editCustomer">
          <i class="layui-icon layui-icon-edit"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="sortCustomers">
          <i class="layui-icon layui-icon-up-down"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="exportCustomers">
          <i class="layui-icon layui-icon-download-circle"></i>
        </lay-button>
        <lay-button type="danger" size="sm" @click="deleteCustomers">
          <i class="layui-icon layui-icon-delete"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="shareCustomers">
          <i class="layui-icon layui-icon-share"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="viewCustomers">
          <i class="layui-icon layui-icon-survey"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="refreshCustomers">
          <i class="layui-icon layui-icon-refresh-3"></i>
        </lay-button>
        <lay-button type="normal" size="sm" @click="configColumns">
          <i class="layui-icon layui-icon-set"></i>
        </lay-button>
      </div>
    </div> -->

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <div class="pagination-info">
        显示第 {{ pagination.current }} 到第
        {{ Math.min(pagination.current * pagination.limit, pagination.total) }}
        条记录，总共 {{ pagination.total }} 条记录 每页显示
        <lay-select
          v-model="pagination.limit"
          size="sm"
          style="width: 80px; margin: 0 5px"
        >
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
import clinetApi from '@/api/client/clinetApi';
import type { ClientQueryListType, ClientType } from '@/api/client/clinetApi.type';
import SvgIcon from '@/components/SvgIcon.vue';
import { ref, reactive, onMounted } from 'vue';

// 字母表
const alphabetList = ref([
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]);
const activeLetter = ref('');

// 列表参数
const listParams = ref<ClientQueryListType>({
  order: 'desc',  // 排序
  limit: 50, // 每页数量
  offset: 0, // 目前浏览的总数
  contacts: '', // 综合查询
  clientStatus: '', // 跟进状态
  clientSource: '', // 客户来源
  categoryName: '', // 客户类型
  sort: '', // 筛选方式
  pinyin: '', // 拼音查询
});

// 分页信息
const pagination = reactive({
  current: 1,
  total: 238,
  limit: 10,
});

// 客户类型选项
const CategoryOptions = ref();

// 客户列表数据
const customerList = ref<ClientType[]>();

// 选择字母
const selectLetter = (letter: string) => {
  activeLetter.value = letter;
  // 这里可以添加按字母筛选的逻辑
};

// 清除筛选
const clearFilter = () => {
  activeLetter.value = '';
  Object.keys(listParams).forEach((key) => {
    // listParams[key] = '';
  });
};

// 搜索客户
const searchCustomers = () => {
  console.log('搜索客户', listParams);
  // 实现搜索逻辑
};

// // 工具栏操作
// const addCustomer = () => {
//   console.log('添加客户');
// };

// const editCustomer = (customer?: any) => {
//   console.log('编辑客户', customer);
// };

// const sortCustomers = () => {
//   console.log('排序客户');
// };

// const exportCustomers = () => {
//   console.log('导出客户');
// };

// const deleteCustomers = () => {
//   console.log('删除客户');
// };

// const shareCustomers = () => {
//   console.log('分享客户');
// };

// const viewCustomers = () => {
//   console.log('查看客户');
// };

// const refreshCustomers = () => {
//   console.log('刷新客户');
// };

// const configColumns = () => {
//   console.log('配置列');
// };

// 分页变化
const handlePageChange = (current: number) => {
  pagination.current = current;
  // 加载对应页码的数据
};
const handler = {
  // 获取客户列表
  async getClientList() {
    const res = await clinetApi.clientList(listParams.value);
    customerList.value = res.rows;
  },

  // 获取客户类型列表
  async getClientCategoryName() {
    const res = await clinetApi.getClientCategoryName();
  }
}

onMounted(async () => {
  // 初始化加载数据
  await handler.getClientList();
  await handler.getClientCategoryName();
});
</script>

<style scoped lang="scss">
.header {
  background-color: #fff;
  border-radius: 16px;
  margin-bottom: 10px;
}

.alphabet-nav {
  @include flex(row, space-between, center);
  padding: 20px;
  gap: 15px;
  border-bottom: 1px solid #e8e8e8;

  .nav-label {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
  }

  .alphabet-list {
    @include flex(row, flex-start, center);
    gap: 5px;
    flex-wrap: wrap;
    flex: 1;

    .alphabet-item {
      @include flex-center();
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
  @include flex-center();
  padding: 20px;
  gap: 15px;
  flex-wrap: wrap;

  .search-item {
    min-width: 200px;
    flex: 1;
  }
}
.details {
  background-color: #fff;
  border-radius: 16px;
}
.toolbar {
  @include flex(row, flex-end, center);
  gap: 10px;
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;

  .toolbar-left {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}

.customer-list {
  padding: 20px;
  min-height: calc(55vh);

  .customer-card {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;
    height: 280px;
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
      height: 220px;
      overflow: hidden;

      .contact-info {
        .contact-name {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;

          .name {
            font-size: 18px;
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

        .contact-details {
          .detail-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-size: 13px;
            color: #666;
            line-height: 1.4;

            i {
              color: var(--global-primary-color);
              width: 16px;
              text-align: center;
              font-size: 14px;
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
</style>
