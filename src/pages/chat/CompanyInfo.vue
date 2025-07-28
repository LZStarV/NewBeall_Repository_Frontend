<template>
  <div v-if="isVisible && companyData" class="company-modal">
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
      chatStore.setCompanyInfoVisiable(true);
    } else {
      // 隐藏组件
      chatStore.setCompanyInfoVisiable(false);
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.company-modal {
  background: white;
  width: 100%;
  border-radius: 16px;
  border: 1px solid #ededed;
  box-shadow: $box-shadow-base;
  max-height: 900px;
  min-width: 350px;
  max-width: 400px;
  height: 90%;
  margin-left: 1rem;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #ededed;
  height: 75px;

  .tab-container {
    display: flex;
    gap: 8px;
  }

  .tab-button {
    padding: 4px 25px;
    border: none;
    background: #f5f5f5;
    border-radius: $border-radius-middle;
    font-size: 14px;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #e2e8f0;
    }

    &.active {
      background: #dbeafe;
      color: #2b5bb2;
    }
  }

  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #64748b;
    border-radius: 4px;
    transition: all 0.2s ease;

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
  margin-bottom: 32px;

  .company-logo {
    .layui-avatar {
      width: 4.5rem;
      height: 4.5rem;
    }
  }

  .company-info {
    flex: 1;

    .company-name {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .tags {
      display: flex;
      gap: 12px;

      .tag {
        background-color: #dbeafe;
        color: #2b5bb2;
        font-size: 14px;
        padding: 2px 8px;
        border-radius: $border-radius-base;
      }
    }
  }
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.info-section {
  margin-bottom: 32px;
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
      gap: 8px;

      &.full-width {
        grid-column: 1 / -1;
      }

      .info-label {
        color: #64748b;
        font-size: 14px;
        white-space: nowrap;
        min-width: 80px;
      }

      .info-value {
        color: #1e293b;
        font-size: 14px;
        flex: 1;
      }
    }
  }

  .company-description {
    p {
      color: #374151;
      font-size: 14px;
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
        font-size: 0.85rem;
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
          color: #64748b;
          min-width: 5rem;
          font-size: 0.9rem;
        }

        .value {
          color: #1e293b;
          flex: 1;
          font-size: 0.9rem;
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
      font-size: 0.9rem;
      margin: 0;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }

  .company-modal {
    max-width: 100%;
  }

  .modal-header {
    padding: 16px 20px;

    .tab-button {
      padding: 6px 16px;
      font-size: 13px;
    }
  }

  .modal-content {
    padding: 20px;
  }

  .company-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;

    .company-info {
      .action-buttons {
        justify-content: center;
      }
    }
  }

  .info-grid {
    grid-template-columns: 1fr !important;
    gap: 12px;

    .info-item {
      flex-direction: column;
      gap: 4px;

      .info-label {
        min-width: auto;
        font-weight: 500;
      }
    }
  }
}
</style>
