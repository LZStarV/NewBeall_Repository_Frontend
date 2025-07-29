<template>
  <div v-if="isVisible && companyData">
    <!-- 移动端遮罩层 -->
    <div v-if="isMobileView" class="modal-overlay" @click="chatStore.setCompanyInfoVisiable(false)"></div>

    <div class="company-modal" :class="{ 'slide-in': isVisible }">
      <!-- Header -->
      <div class="modal-header">
        <div class="tab-container">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'company' }"
            @click="activeTab = 'company'"
          >
            公司信息
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'business' }"
            @click="activeTab = 'business'"
          >
            主营业务
          </button>
        </div>
        <button class="close-button" @click="chatStore.setCompanyInfoVisiable(false)">
          <SvgIcon name="cancel" />
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <div v-if="activeTab === 'company'" class="company-content">
          <!-- Company Header -->
          <div class="company-header">
            <div class="company-logo">
              <Avatar :url="companyData.logoUrl" size="5rem" />
            </div>
            <div class="company-info">
              <h2 class="company-name">
                {{ companyData.companyName }}
              </h2>
              <div class="tags">
                <div
                  v-for="(tag, index) of getCompnayAptitudeList(companyData)"
                  :key="index"
                  class="tag"
                >
                  {{ tag }}
                </div>
              </div>
            </div>
          </div>

          <!-- Basic Information -->
          <h3 class="section-title">公司介绍</h3>
          <div class="info-section">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">公司简称：</span>
                <span class="info-value">{{ companyData.abbreviation }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">公司类型：</span>
                <span class="info-value">{{ getCompanyType(companyData) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">联系人：</span>
                <span class="info-value">{{ companyData.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">职务：</span>
                <span class="info-value">{{ companyData.career }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">公司手机号：</span>
                <span class="info-value">{{ companyData.companyPhone }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">公司传真：</span>
                <span class="info-value">{{ companyData.companyFax }}</span>
              </div>
              <div class="info-item full-width">
                <span class="info-label">注册地址：</span>
                <span class="info-value">{{ companyData.companyAddress }}</span>
              </div>
            </div>
          </div>

          <!-- Company Description -->
          <h3 class="section-title">基本信息</h3>
          <div class="info-section">
            <div class="company-description">
              <p>{{ companyData.profile }}</p>
            </div>
          </div>
        </div>

        <div v-else class="business-content">
          <div
            v-if="companyBusinessList && companyBusinessList.length > 0"
            class="business-list"
          >
            <div
              v-for="(business, index) in companyBusinessList"
              :key="index"
              class="business-item"
            >
              <div class="business-header">
                <h3 class="business-title">{{ business.businessName }}</h3>
                <span class="business-tag">{{ business.businessType }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <SvgIcon name="none" class="empty-icon" />
            <p>暂无业务信息</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { getCompanyInfo } from '@/api/chat/chatApi';
import type { CompanyBusiness, CompanyData } from './Chat.type';
import Avatar from '@/components/Avatar.vue';
import { useChatStore } from '@/stores/chat';

// Reactive data
const activeTab = ref<'company' | 'business'>('company');

const companyData = ref<CompanyData>();
const companyBusinessList = ref<CompanyBusiness[]>();

// 获取公司类型
const getCompanyType = (data: CompanyData): string => {
  if (data.gy === 1) {
    return '产品供应商';
  } else if (data.cg === 1) {
    return '产品采购商';
  }
  return '';
};

// 获取公司资质
const getCompnayAptitudeList = (data: CompanyData): string[] => {
  const aptitudeList: string[] = [];
  if (data.qualification !== '' && data.qualification !== null) {
    aptitudeList.push('资质');
  }
  if (data.companyfile01 !== '' && data.companyfile01 !== null) {
    aptitudeList.push('施工资质');
  }
  if (data.companyfile02 !== '' && data.companyfile02 !== null) {
    aptitudeList.push('营业执照');
  }
  if (data.companyfile04 !== '' && data.companyfile04 !== null) {
    aptitudeList.push('安全生产许可证');
  }
  if (data.companyfile05 !== '' && data.companyfile05 !== null) {
    aptitudeList.push('开户许可证');
  }
  return aptitudeList;
};

const chatStore = useChatStore();

const isVisible = computed(() => {
  return chatStore.isCompanyInfoShow;
});

watch(
  () => chatStore.chatInfo,
  async (newValue) => {
    if (newValue?.toKey?.slice(0, 2) === 'PY' || newValue?.toKey?.slice(0, 3) === 'PRO') {
      const res = await getCompanyInfo(newValue.toKey); // 获取公司信息
      companyData.value = res.data.companyData;
      companyBusinessList.value = res.data.companyBusinessData;
      // 移动端默认不展开
      if (!isMobileView.value) {
        chatStore.setCompanyInfoVisiable(true);
      }
    } else {
      // 隐藏组件
      chatStore.setCompanyInfoVisiable(false);
    }
  },
  { immediate: true },
);

const isMobileView = computed(() => {
  return window.innerWidth <= 1400;
});
</script>

<style lang="scss" scoped>
@use "sass:color";

@mixin button-base {
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 190;
}

.company-modal {
  background: white;
  width: 100%;
  border-radius: $border-radius-extra-large;
  border: 1px solid #ededed;
  box-shadow: $box-shadow-base;
  max-height: 900px;
  min-width: 350px;
  max-width: 400px;
  height: 90%;
  margin-left: 1rem;
  overflow: hidden;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 200;

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #ededed;
    height: 75px;

    .tab-container {
      display: flex;
      gap: $spacing-base;
    }

    .tab-button {
      @include button-base;
      padding: 4px 25px;
      background: #f5f5f5;
      border-radius: $border-radius-middle;
      font-size: $font-size-base;
      letter-spacing: 2px;

      &:hover {
        background: #e2e8f0;
      }

      &.active {
        background: #dbeafe;
        color: $primary-color;
      }
    }

    .close-button {
      @include button-base;
      background: none;
      padding: 4px;
      color: #64748b;
      border-radius: $border-radius-base;

      &:hover {
        background: #f1f5f9;
        color: #374151;
      }
    }
  }

  .modal-content {
    padding: 1rem;
    height: calc(90vh - 75px);
    overflow-y: auto;
  }

  .company-header {
    display: flex;
    gap: 20px;
    margin-bottom: $spacing-extra-large;

    .company-logo {
      .layui-avatar {
        width: 4.5rem;
        height: 4.5rem;
      }
    }

    .company-info {
      flex: 1;

      .company-name {
        font-size: $font-size-extra-large;
        font-weight: 600;
        color: $text-primary;
        margin: 0 0 $spacing-medium 0;
      }

      .tags {
        display: flex;
        gap: 12px;

        .tag {
          background-color: #dbeafe;
          color: $primary-color;
          font-size: $font-size-base;
          padding: 2px $spacing-base;
          border-radius: $border-radius-base;
        }
      }
    }
  }

  .section-title {
    font-size: $font-size-large;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 1rem;
  }

  .info-section {
    margin-bottom: $spacing-extra-large;
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: $border-radius-middle;

    &:last-child {
      margin-bottom: 0;
    }

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .info-item {
        display: flex;
        align-items: flex-start;
        gap: $spacing-base;

        &.full-width {
          grid-column: 1 / -1;
        }

        .info-label {
          color: $text-secondary;
          font-size: $font-size-base;
          white-space: nowrap;
          min-width: 80px;
        }

        .info-value {
          color: $text-primary;
          font-size: $font-size-base;
          flex: 1;
        }
      }
    }

    .company-description {
      p {
        color: $text-regular;
        font-size: $font-size-base;
        line-height: 1.6;
        margin: 0;
      }
    }
  }

  .business-content {
    height: 100%;
    overflow-y: auto;
    padding-top: 2px;

    .business-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .business-item {
      background: white;
      border-radius: $border-radius-middle;
      padding: 1.25rem;
      border: 1px solid #ededed;
      transition: all 0.3s ease;
      border-left: 4px solid $primary-color;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($primary-color, 0.1);
        border-color: rgba($primary-color, 0.3);
      }

      .business-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .business-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: $primary-color;
          margin: 0;
        }

        .business-tag {
          background: rgba($primary-color, 0.1);
          color: $primary-color;
          padding: 0.25rem 0.75rem;
          border-radius: $border-radius-base;
          font-size: $font-size-small;
        }
      }

      .business-details {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        .detail-item {
          display: flex;
          align-items: flex-start;

          &.description {
            flex-direction: column;
            gap: 0.5rem;
          }

          .label {
            color: $text-secondary;
            min-width: 5rem;
            font-size: $font-size-small;
          }

          .value {
            color: $text-primary;
            flex: 1;
            font-size: $font-size-small;
            line-height: 1.5;
          }
        }
      }
    }

    .empty-state {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      gap: 1rem;

      .empty-icon {
        font-size: 3rem;
        color: #cbd5e1;
      }

      p {
        font-size: $font-size-small;
        margin: 0;
      }
    }
  }
}

// 平板/窄屏电脑模式
@media (max-width: 1400px) {
  .company-modal {
    position: fixed;
    top: 50%;
    right: 0;
    height: 90%;
    max-height: 900px;
    border-radius: $border-radius-extra-large 0 0 $border-radius-extra-large;
    border-left: 1px solid #ededed;
    border-right: none;
    transform: translate(100%, -50%);
    z-index: 200;

    &.slide-in {
      transform: translate(0, -50%);
    }
  }

  .modal-content {
    height: calc(100% - 75px);
  }
}

// 手机模式
@media (max-width: $pad_layout_breakpoint) {
  .company-modal {
    position: absolute;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80%;
    min-width: 100%;
    border-radius: $border-radius-extra-large $border-radius-extra-large 0 0;
    transform: translateY(100%);
    border: none;
    border-top: 1px solid #ededed;
    margin-left: 0;

    &.slide-in {
      transform: translateY(0);
    }
  }

  .modal-content {
    height: calc(80vh - 75px);
  }

  .modal-header {
    .tab-button {
      padding: 4px 15px;
      font-size: $font-size-small;
    }
  }

  .company-header {
    flex-direction: column;
    align-items: center;
    text-align: center;

    .company-info {
      .tags {
        justify-content: center;
      }
    }
  }
}
</style>
