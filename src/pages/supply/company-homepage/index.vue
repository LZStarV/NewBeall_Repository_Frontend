<template>
  <div class="company-homepage-page">
    <lay-row space="20">
      <!-- 左侧固定导航区域 -->
      <lay-col md="8" sm="8" xs="24">
        <section class="left-sidebar">
          <header class="sidebar-header">
            <h4>企业信息管理</h4>
          </header>

          <!-- 完善企业介绍提示 -->
          <div class="intro-tip">
            完善的企业介绍，有助于平台用户更好的认识您。
          </div>

          <!-- 审核状态 -->
          <div class="audit-status">
            <div class="status-item pending">
              <i class="layui-icon layui-icon-time"></i>
              <span>等待审核</span>
            </div>
            <div class="status-item passed">
              <i class="layui-icon layui-icon-ok"></i>
              <span>审核通过</span>
            </div>
            <div class="status-item rejected">
              <i class="layui-icon layui-icon-close"></i>
              <span>审核不通过</span>
            </div>
          </div>

          <div class="audit-notice">注意：审核通过的模块才能对外展示</div>

          <!-- 信息完善度 -->
          <div class="completion-rate">
            <div class="rate-header">
              <span>信息完善度</span>
              <span class="percentage">67%</span>
            </div>
            <div class="layui-progress">
              <div class="layui-progress-bar" lay-percent="67%"></div>
            </div>
            <div class="rate-tip">
              <i class="layui-icon layui-icon-star"></i>
              当信息完善达到100，壹新将赠予您50积分奖励
            </div>
          </div>

          <!-- 导航菜单 -->
          <div class="nav-menu">
            <div
              v-for="item in menuItems"
              :key="item.key"
              class="menu-item"
              :class="{ active: activeMenu === item.key }"
              @click="switchMenu(item.key)"
            >
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
              <div class="layui-btn layui-btn-xs" :class="item.statusClass">
                {{ item.statusText }}
              </div>
            </div>
          </div>
        </section>
      </lay-col>
      <!-- 右侧内容区域 -->

      <lay-col md="16" sm="16" xs="24">
        <section class="right-content">
          <!-- 企业基础信息 -->
          <div v-if="activeMenu === 'basic'" class="content-section">
            <div class="section-header">
              <h4>企业信息管理</h4>
              <div class="view-count">
                <i class="layui-icon layui-icon-survey"></i>
                <span>122</span>
              </div>
            </div>

            <div class="layui-form">
              <div class="form-section">
                <div class="layui-form-item">
                  <label class="layui-form-label">注册角色</label>
                  <div class="layui-input-block">
                    <span class="form-value">工程集成商</span>
                  </div>
                </div>

                <div class="layui-form-item">
                  <label class="layui-form-label">企业全称</label>
                  <div class="layui-input-block">
                    <span class="form-value">广州壹新网络科技有限公司</span>
                  </div>
                </div>

                <div class="layui-form-item">
                  <label class="layui-form-label">企业简称</label>
                  <div class="layui-input-block">
                    <span class="form-value">广州壹新网络科技有限公司</span>
                  </div>
                </div>

                <div class="layui-form-item">
                  <label class="layui-form-label">客户单位</label>
                  <div class="layui-input-block">
                    <input
                      type="text"
                      class="layui-input"
                      placeholder="请输入客户单位"
                    />
                  </div>
                </div>

                <div class="layui-form-item">
                  <label class="layui-form-label">所在地区</label>
                  <div class="layui-input-block">
                    <div class="select-group">
                      <select name="province" class="layui-select">
                        <option value="">广东省</option>
                      </select>
                      <select name="city" class="layui-select">
                        <option value="">广州市</option>
                      </select>
                      <select name="district" class="layui-select">
                        <option value="">黄埔区</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 联系人信息 -->
              <div class="contact-section">
                <h5>联系人信息</h5>

                <div class="layui-form-item">
                  <label class="layui-form-label">*姓名</label>
                  <div class="layui-input-block">
                    <input type="text" class="layui-input" value="广东省" />
                  </div>
                </div>

                <div class="layui-form-item">
                  <label class="layui-form-label">*性别</label>
                  <div class="layui-input-block">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      title="男"
                      checked
                    />
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      title="女"
                    />
                  </div>
                </div>

                <div class="layui-form-item">
                  <label class="layui-form-label">*电话</label>
                  <div class="layui-input-block">
                    <input
                      type="text"
                      class="layui-input"
                      value="17728117013"
                    />
                  </div>
                </div>

                <div class="layui-form-item">
                  <label class="layui-form-label">*邮箱</label>
                  <div class="layui-input-block">
                    <input
                      type="text"
                      class="layui-input"
                      value="17728117013"
                    />
                  </div>
                </div>

                <div class="layui-form-item">
                  <label class="layui-form-label">*职位</label>
                  <div class="layui-input-block">
                    <input type="text" class="layui-input" placeholder="职位" />
                  </div>
                </div>
              </div>

              <div class="layui-form-item">
                <div class="layui-input-block">
                  <button type="submit" class="layui-btn">保存</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 其他模块内容 -->
          <div v-else class="content-section">
            <div class="section-header">
              <h4>{{ getCurrentMenuLabel() }}</h4>
              <div class="view-count">
                <i class="layui-icon layui-icon-survey"></i>
                <span>122</span>
              </div>
            </div>
            <div class="placeholder-content">
              {{ getCurrentMenuLabel() }}模块内容待开发...
            </div>
          </div>
        </section>
      </lay-col>
    </lay-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 当前激活的菜单
const activeMenu = ref('basic');

// 菜单项配置
const menuItems = ref([
  {
    key: 'basic',
    label: '企业基础信息',
    icon: 'layui-icon layui-icon-home',
    statusClass: 'layui-btn-primary',
    statusText: '隐藏',
  },
  {
    key: 'register',
    label: '企业注册信息',
    icon: 'layui-icon layui-icon-file',
    statusClass: '',
    statusText: '公开',
  },
  {
    key: 'business',
    label: '主营业务系统',
    icon: 'layui-icon layui-icon-app',
    statusClass: 'layui-btn-primary',
    statusText: '隐藏',
  },
  {
    key: 'coverage',
    label: '业务覆盖区域',
    icon: 'layui-icon layui-icon-location',
    statusClass: '',
    statusText: '公开',
  },
  {
    key: 'profile',
    label: '企业信息简介',
    icon: 'layui-icon layui-icon-list',
    statusClass: '',
    statusText: '公开',
  },
  {
    key: 'engineering',
    label: '企业工程业绩',
    icon: 'layui-icon layui-icon-chart-screen',
    statusClass: '',
    statusText: '公开',
  },
  {
    key: 'qualification',
    label: '企业资质证书',
    icon: 'layui-icon layui-icon-file-b',
    statusClass: '',
    statusText: '公开',
  },
  {
    key: 'operation',
    label: '企业宣传资料',
    icon: 'layui-icon layui-icon-video',
    statusClass: '',
    statusText: '公开',
  },
]);

// 切换菜单
const switchMenu = (key: string) => {
  activeMenu.value = key;
};

// 获取当前菜单标签
const getCurrentMenuLabel = () => {
  const currentItem = menuItems.value.find(
    (item) => item.key === activeMenu.value,
  );
  return currentItem?.label || '';
};
</script>

<style scoped lang="scss">
.company-homepage-page {
  height: 100%;
}

.left-sidebar {
  background: white;
  border-radius: 12px;
  padding: 20px;

  .sidebar-header {
    h4 {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
  }

  .intro-tip {
    margin: 15px 0;
    font-size: 12px;
    color: #868686;
    line-height: 1.4;
  }

  .audit-status {
    @include flex();
    gap: 25px;
    flex-wrap: wrap;

    .status-item {
      display: flex;
      align-items: center;
      font-size: 14px;

      i {
        font-weight: 600;
        margin-right: 4px;
      }

      &.pending {
        i {
          color: #fa8c16;
        }
      }

      &.passed {
        i {
          color: #52c41a;
        }
      }

      &.rejected {
        i {
          color: #ff4d4f;
        }
      }
    }
  }

  .audit-notice {
    font-size: 12px;
    color: #de0205;
    margin-bottom: 10px;
  }

  .completion-rate {
    border-top: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    padding: 12px 0;

    .rate-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;

      .percentage {
        color: #1890ff;
        font-weight: 600;
      }
    }

    .layui-progress {
      margin-bottom: 10px;
    }

    .rate-tip {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #1890ff;

      i {
        margin-right: 5px;
      }
    }
  }

  .nav-menu {
    .menu-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      transition: all 0.2s ease;
      margin-top: 10px;

      &:hover {
        background: #f8f9fa;
      }

      &.active {
        background: #e6f7ff;
        border-left: 3px solid #1890ff;
        padding-left: 10px;
        margin-left: -10px;
      }

      i {
        margin-right: 10px;
        font-size: 16px;
        color: #1890ff;
      }

      span {
        flex: 1;
        font-size: 14px;
        color: #333;
      }

      .layui-btn {
        margin-left: auto;

        &.layui-btn-primary {
          background-color: #f0f0f0;
          border-color: #f0f0f0;
          color: #666;
        }
      }
    }
  }
}

.right-content {
  background: white;
  border-radius: 12px;

  .content-section {
    padding: 20px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      h4 {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }

      .view-count {
        display: flex;
        align-items: center;
        color: #666;
        font-size: 14px;

        i {
          margin-right: 5px;
        }
      }
    }

    .form-section {
      margin-bottom: 40px;
    }

    .contact-section {
      h5 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 20px 0;
        padding-bottom: 10px;
        border-bottom: 2px solid #1890ff;
        display: inline-block;
      }
    }

    .form-value {
      font-size: 14px;
      color: #333;
      line-height: 38px;
    }

    .select-group {
      display: flex;
      gap: 10px;

      .layui-select {
        min-width: 120px;
      }
    }

    .placeholder-content {
      text-align: center;
      padding: 60px 0;
      color: #999;
      font-size: 16px;
    }
  }
}

// 覆盖 Layui 样式
:deep(.layui-progress-bar) {
  background-color: #1890ff;
}

:deep(.layui-form-label) {
  width: 120px;
}

:deep(.layui-input-block) {
  margin-left: 140px;
}
</style>
