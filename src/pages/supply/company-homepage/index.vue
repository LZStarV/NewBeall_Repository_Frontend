<template>
  <div class="company-homepage-page">
    <lay-row space="20">
      <!-- 左侧固定导航区域 -->
      <lay-col md="8" sm="8" xs="24">
        <section class="left-sidebar">
          <header class="sidebar-header">
            <h4>企业信息管理</h4>
          </header>

          <div class="sidebar-content">
            <div class="intro-tip">
              完善的企业介绍，有助于平台用户更好的认识您。
            </div>
            <div class="intro-notice" @click="handleClickNotice">
              请认真阅读并遵守《
              <span style="color: red">公司信息填写须知</span>
              》
              <lay-icon type="layui-icon-question"></lay-icon>
            </div>

            <!-- 审核状态 -->
            <div class="audit-status">
              <div class="status-item pending">
                <i class="layui-icon layui-icon-log"></i>
                <span>等待审核</span>
              </div>
              <div class="status-item passed">
                <i class="layui-icon layui-icon-ok-circle"></i>
                <span>审核通过</span>
              </div>
              <div class="status-item rejected">
                <i class="layui-icon layui-icon-close-fill"></i>
                <span>审核不通过</span>
              </div>
            </div>

            <div class="audit-notice">注意：审核通过的模块才能对外展示</div>

            <!-- 信息完善度 -->
            <div class="completion-rate">
              <div class="rate-header">
                <span>信息完善度</span>
              </div>
              <div class="layui-progress">
                <lay-progress
                  :percent="companyDetails?.perfection || 0"
                  size="big"
                  :show-text="true"
                ></lay-progress>
              </div>
              <div class="rate-tip">
                <i class="layui-icon layui-icon-star"></i>
                <span>当信息完善达到100，壹新将赠予您50积分奖励</span>
              </div>
            </div>

            <!-- 导航菜单 -->
            <div class="nav-menu">
              <lay-form>
                <div
                  v-for="item in menuItems"
                  :key="item.key"
                  class="menu-item"
                  :class="{ active: activeMenu === item.key }"
                  @click="switchMenu(item.key)"
                >
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                  <i
                    class="layui-icon"
                    :class="[
                      item.statusIcon,
                      {
                        'status-pending': item.statusIcon === 'layui-icon-log',
                        'status-passed':
                          item.statusIcon === 'layui-icon-ok-circle',
                        'status-rejected':
                          item.statusIcon === 'layui-icon-close-fill',
                      },
                    ]"
                  ></i>
                  <div class="switch">
                    <lay-form-item mode="inline">
                      <lay-switch
                        v-model="item.isOpen"
                        onswitch-text="公开"
                        unswitch-text="隐藏"
                        @change="handleSwitchChange(item)"
                        @click.stop
                      ></lay-switch>
                    </lay-form-item>
                  </div>
                </div>
              </lay-form>
            </div>
          </div>
        </section>
      </lay-col>
      <!-- 右侧内容区域 -->

      <lay-col md="16" sm="16" xs="24">
        <section class="right-content">
          <div class="view-count">
            <i class="layui-icon layui-icon-eye"></i>
            <span>{{ companyDetails?.browseCount }}</span>
          </div>
          <!-- 动态组件渲染 -->
          <component
            :is="currentComponent"
            :company-data="companyDetails"
            @data-updated="getMyCompanyDetails"
          />
        </section>
      </lay-col>
    </lay-row>
  </div>
</template>

<script lang="ts" setup>
import companyApi from '@/api/company/companyApi';
import type { CompanyDetailResponseData } from '@/api/company/companyApi.type';
import { layer } from '@layui/layui-vue';
import { computed, onMounted, ref } from 'vue';
import BasicInfo from './components/BasicInfo.vue';
import RegisterInfo from './components/RegisterInfo.vue';
import BusinessInfo from './components/BusinessInfo.vue';
import BusinessAreaInfo from './components/BusinessAreaInfo.vue';
import ProfileInfo from './components/ProfileInfo.vue';
import AchievementInfo from './components/AchievementInfo.vue';
import QualificationInfo from './components/QualificationInfo.vue';
import AttachmentInfo from './components/AttachmentInfo.vue';

// 公司信息
const companyDetails = ref<CompanyDetailResponseData>();

// 当前激活的菜单
const activeMenu = ref('basicInfo');

const menuConfig = [
  {
    key: 'basicInfo',
    label: '企业基础信息',
    icon: 'layui-icon layui-icon-home',
  },
  {
    key: 'registerInfo',
    label: '企业注册信息',
    icon: 'layui-icon layui-icon-file',
  },
  {
    key: 'businessInfo',
    label: '主营业务系统',
    icon: 'layui-icon layui-icon-app',
  },
  {
    key: 'businessAreaInfo',
    label: '业务覆盖区域',
    icon: 'layui-icon layui-icon-location',
  },
  {
    key: 'profile',
    label: '企业信息简介',
    icon: 'layui-icon layui-icon-list',
  },
  {
    key: 'achievement',
    label: '企业工程业绩',
    icon: 'layui-icon layui-icon-chart-screen',
  },
  {
    key: 'qualifica',
    label: '企业资质证书',
    icon: 'layui-icon layui-icon-file-b',
  },
  {
    key: 'companyAttachment',
    label: '企业宣传资料',
    icon: 'layui-icon layui-icon-video',
  },
];

// 组件映射
const componentMap = {
  basicInfo: BasicInfo,
  registerInfo: RegisterInfo,
  businessInfo: BusinessInfo,
  businessAreaInfo: BusinessAreaInfo,
  profile: ProfileInfo,
  achievement: AchievementInfo,
  qualifica: QualificationInfo,
  companyAttachment: AttachmentInfo,
};

// 当前组件
const currentComponent = computed(() => {
  return (
    componentMap[activeMenu.value as keyof typeof componentMap] || BasicInfo
  );
});

// 菜单配置项
const menuItems = ref(
  menuConfig.map((item) => ({
    ...item,
    isOpen: false,
    statusIcon: 'layui-icon-log', // 默认等待状态
  })),
);

// 切换菜单
const switchMenu = (key: string) => {
  activeMenu.value = key;
};

// 处理开关变化
const handleSwitchChange = async (item: any) => {
  // 调用接口--点击前状态isOpen
  await companyApi.openModel(item.isOpen ? 1 : 0, item.key);

  //点击后状态isOpen
  if (item.isOpen) layer.msg('取消隐藏', { icon: 1 });
  else layer.msg('信息隐藏成功', { icon: 1 });

  // 更新菜单配置
  getMyCompanyDetails();
};

// 根据 API 数据更新菜单项
const updateMenuItems = () => {
  if (companyDetails.value?.roleMap) {
    const roleMap = companyDetails.value.roleMap;

    menuItems.value.forEach((item) => {
      const roleData = roleMap[item.key as keyof typeof roleMap];
      if (roleData) {
        item.isOpen = !(roleData.isOpen === 1);
        item.statusIcon = roleData.statusIcon;
      }
    });
  }
};

// 获取我司详情
const getMyCompanyDetails = async () => {
  const res = await companyApi.getMyCompanyDetailed();
  companyDetails.value = res.data || res;

  // 数据加载完成后更新菜单项
  updateMenuItems();
};

// 获取当前菜单标签
const getCurrentMenuLabel = () => {
  const currentItem = menuItems.value.find(
    (item) => item.key === activeMenu.value,
  );
  return currentItem?.label || '';
};

// 显示公司填写须知
const handleClickNotice = () => {
  layer.open({
    type: 0,
    title: '公司信息填写须知',
    area: ['50%'],
    isHtmlFragment: true,
    content: `
      <div style="
        padding: 20px;
        line-height: 1.6;
        color: #333;
        font-size: 14px;
      ">
        <p style="margin-bottom: 16px; text-align: justify;">
          您在本页面编辑、上传的公司信息将作为云端产品库下的公司主页展示，供平台采购商浏览。为保障采购商合法权益并确保您的产品效果，您承诺并确认：
        </p>

        <ul style="padding-left: 0px">
          <li style="margin-bottom: 12px; text-align: justify;">
            1、您的填写行为已获得所在公司的授权，相关内容经过公司确认。
          </li>

          <li style="margin-bottom: 12px; text-align: justify;">
            2、填写、上传真实、合法、有效的公司信息，据实填写并及时更新公司介绍、规模、产品等，以免对采购商造成误导。
          </li>

          <li style="margin-bottom: 12px; text-align: justify;">
            3、填写、上传的图文、视频等资料不存在违法违规或涉嫌侵犯第三方合法权益的情形，如由此产生相关法律风险或造成损失，由您及所在公司承担法律责任。
          </li>

          <li style="margin-bottom: 12px; text-align: justify;">
            4、您授权设计报价管理平台以提供产品服务为目的在其他场景下免费使用您在本页面填写的公司信息，以便为您提供更佳的服务体验。
          </li>
        </ul>
      </div>
    `,
  });
};

onMounted(async () => {
  await getMyCompanyDetails();
});
</script>

<style scoped lang="scss">
.company-homepage-page {
  height: 100%;
}

h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  border-left: 3px solid var(--global-primary-color);
  padding-left: 15px;
}

.left-sidebar {
  background: white;
  border-radius: 12px;
  padding: 20px 0;

  .sidebar-content {
    padding: 0 20px;
  }

  .intro-tip {
    margin: 15px 0;
    font-size: 12px;
    color: #868686;
    line-height: 1.4;
  }

  .intro-notice {
    margin: 15px 0;
    color: #868686;
    font-size: 12px;
    cursor: pointer;

    .layui-icon {
      font-size: 12px;
    }
  }

  .audit-status {
    @include flex(row, space-between, center);
    flex-wrap: wrap;

    .status-item {
      display: flex;
      align-items: center;
      font-size: 14px;

      i {
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
      margin-bottom: 10px;
      font-size: 15px;
    }

    .layui-progress {
      margin-bottom: 20px;
      :deep(.layui-progress-bar) {
        background-color: var(--global-primary-color) !important;
      }
    }

    .rate-tip {
      @include flex(row, center, center);
      max-width: 320px;
      font-size: 12px;
      color: var(--global-primary-color);
      border: 1px solid var(--global-primary-color);
      border-radius: 12px;
      padding: 3px;

      i {
        margin-right: 5px;
      }
    }
  }

  .nav-menu {
    .menu-item {
      @include flex(row, flex-start, center);
      padding: 4px 0;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 10px;
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px;

      &.active {
        background: color-mix(
          in srgb,
          var(--global-primary-color),
          transparent 90%
        );
        border-left: 3px solid var(--global-primary-color);
        padding-left: 7px;
        margin-left: -10px;
      }

      i {
        margin-right: 10px;
        font-size: 16px;
        color: var(--global-primary-color);
      }

      span {
        font-size: 14px;
        color: #333;
        margin-right: 5px;
      }

      // 状态图标颜色
      .status-pending {
        color: #fa8c16;
      }

      .status-passed {
        color: #52c41a;
      }

      .status-rejected {
        color: #ff4d4f;
      }

      .switch {
        @include flex(row, flex-end, center);
        flex: 1;

        :deep(.layui-form-item) {
          margin-bottom: 8px;
          overflow: hidden;
        }
      }
    }
  }
}

.right-content {
  background: white;
  border-radius: 12px;
  position: relative;
  padding: 20px 0;
  min-height: 765px;

  .view-count {
    position: absolute;
    right: 20px;
    top: 10px;
    color: #666;
    font-size: 14px;

    i {
      margin-right: 5px;
    }
  }
}
</style>
