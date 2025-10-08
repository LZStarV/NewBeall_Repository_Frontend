<template>
  <div class="user-center">
    <!-- 用户头部信息卡片 -->
    <div class="user-header-card">
      <div class="user-avatar-section">
        <div class="avatar-container">
          <lay-avatar :src="userInfo.avatar || defaultAvatar" size="lg" />
          <div class="avatar-edit-btn" @click="handleAvatarEdit">
            <lay-icon type="layui-icon-camera" />
          </div>
        </div>
        <div class="user-basic-info">
          <h2 class="username">{{ userInfo.name }}</h2>
          <p class="user-role">
            {{ userInfo.department }} · {{ userInfo.position }}
          </p>
          <div class="user-score">
            <lay-icon type="layui-icon-diamond" />
            <span>公司积分：{{ userInfo.companyScore }}</span>
          </div>
        </div>
      </div>
      <div class="company-info">
        <div class="company-logo">
          <div class="logo-text">{{ userInfo.companyName.charAt(0) }}</div>
        </div>
        <div class="company-details">
          <h3>{{ userInfo.companyName }}</h3>
          <p class="company-time">创建时间：{{ userInfo.createTime }}</p>
          <p class="member-expiry">会员有效期：{{ userInfo.memberExpiry }}</p>
        </div>
      </div>
    </div>

    <!-- 功能卡片区域 -->
    <div class="content-section">
      <!-- 左侧信息展示 -->
      <div class="info-cards">
        <div class="info-card">
          <h3 class="card-title">
            <lay-icon type="layui-icon-user" />
            基本信息
          </h3>
          <div class="info-list">
            <div class="info-item">
              <lay-icon type="layui-icon-username" />
              <span class="label">登录名称</span>
              <span class="value">{{ userInfo.loginName }}</span>
            </div>
            <div class="info-item">
              <lay-icon type="layui-icon-cellphone" />
              <span class="label">手机号码</span>
              <span class="value">{{ userInfo.phone }}</span>
            </div>
            <div class="info-item">
              <lay-icon type="layui-icon-email" />
              <span class="label">邮箱地址</span>
              <span class="value">{{ userInfo.email }}</span>
            </div>
            <div class="info-item">
              <lay-icon type="layui-icon-date" />
              <span class="label">创建时间</span>
              <span class="value">{{ userInfo.createTime }}</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <h3 class="card-title">
            <lay-icon type="layui-icon-engine" />
            组织信息
          </h3>
          <div class="info-list">
            <div class="info-item">
              <lay-icon type="layui-icon-home" />
              <span class="label">所属公司</span>
              <span class="value">{{ userInfo.companyName }}</span>
            </div>
            <div class="info-item">
              <lay-icon type="layui-icon-group" />
              <span class="label">所属部门</span>
              <span class="value">{{ userInfo.department }}</span>
            </div>
            <div class="info-item">
              <lay-icon type="layui-icon-star-fill" />
              <span class="label">当前职位</span>
              <span class="value">{{ userInfo.position }}</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <h3 class="card-title">
            <lay-icon type="layui-icon-chart" />
            充值记录
          </h3>
          <div class="record-item" @click="viewChargeRecord">
            <span class="record-text">查看详细充值记录</span>
            <lay-icon type="layui-icon-right" />
          </div>
        </div>
      </div>

      <!-- 右侧编辑表单 -->
      <div class="edit-section">
        <div class="edit-card">
          <div class="edit-header">
            <h3>
              <lay-icon type="layui-icon-edit" />
              {{ isEditing ? '修改密码' : '基本资料' }}
            </h3>
            <div class="tab-buttons">
              <button
                class="tab-btn"
                :class="{ active: !isEditing }"
                @click="isEditing = false"
              >
                基本资料
              </button>
              <button
                class="tab-btn"
                :class="{ active: isEditing }"
                @click="isEditing = true"
              >
                修改密码
              </button>
            </div>
          </div>

          <!-- 基本资料编辑 -->
          <div v-if="!isEditing" class="edit-form">
            <div class="form-row">
              <label>姓名：</label>
              <lay-input v-model="editForm.name" placeholder="请输入姓名" />
            </div>
            <div class="form-row">
              <label>邮箱：</label>
              <lay-input v-model="editForm.email" placeholder="请输入邮箱" />
            </div>
            <div class="form-row">
              <label>电话：</label>
              <lay-input
                v-model="editForm.phone"
                placeholder="请输入电话号码"
              />
            </div>
            <div class="form-row">
              <label>出生日期：</label>
              <lay-date-picker
                v-model="editForm.birthday"
                placeholder="请选择出生日期"
              />
            </div>
            <div class="form-row">
              <label>性别：</label>
              <div class="gender-options">
                <lay-radio-group v-model="editForm.gender">
                  <lay-radio :value="1">男</lay-radio>
                  <lay-radio :value="0">女</lay-radio>
                </lay-radio-group>
              </div>
            </div>
          </div>

          <!-- 密码修改 -->
          <div v-else class="edit-form">
            <div class="form-row">
              <label>当前密码：</label>
              <lay-input
                v-model="passwordForm.oldPassword"
                type="password"
                placeholder="请输入当前密码"
              />
            </div>
            <div class="form-row">
              <label>新密码：</label>
              <lay-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="请输入新密码"
              />
            </div>
            <div class="form-row">
              <label>确认密码：</label>
              <lay-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="请确认新密码"
              />
            </div>
          </div>

          <div class="form-actions">
            <lay-button type="primary" @click="handleSubmit">
              {{ isEditing ? '修改密码' : '保存修改' }}
            </lay-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import defaultAvatar from '@/assets/image/default/defaultAvatar.png';

// 编辑状态
const isEditing = ref(false);

// 用户信息
const userInfo = reactive({
  name: '张三',
  loginName: 'zhangsan',
  phone: '18569452675',
  email: 'wen_yao_1999@163.com',
  companyName: '广州喜新网络科技有限公司',
  department: '管理员',
  position: '管理员',
  companyScore: 161,
  createTime: '2021-11-01',
  memberExpiry: '2026-02-27',
  avatar: '',
  birthday: '',
  gender: 1,
});

// 编辑表单
const editForm = reactive({
  name: userInfo.name,
  email: userInfo.email,
  phone: userInfo.phone,
  birthday: userInfo.birthday,
  gender: userInfo.gender,
});

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// 处理头像编辑
const handleAvatarEdit = () => {
  console.log('编辑头像');
};

// 查看充值记录
const viewChargeRecord = () => {
  console.log('查看充值记录');
};

// 提交表单
const handleSubmit = () => {
  if (isEditing.value) {
    // 处理密码修改
    console.log('修改密码', passwordForm);
  } else {
    // 处理基本信息修改
    console.log('保存基本信息', editForm);
  }
};
</script>

<style scoped lang="scss">
.user-center {
  padding: 24px;
  background-color: #fff;
  min-height: 85vh;
  border-radius: 16px;
}

.user-header-card {
  @include flex(row, space-between, center);
  background: var(--global-checked-color);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  .user-avatar-section {
    display: flex;
    align-items: center;
    gap: 20px;

    .avatar-container {
      position: relative;

      .avatar-edit-btn {
        position: absolute;
        bottom: -5px;
        right: -5px;
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--global-primary-color, #2d72eb);
        transition: all 0.3s ease;

        &:hover {
          background: white;
          transform: scale(1.1);
        }
      }
    }

    .user-basic-info {
      .username {
        font-size: 28px;
        font-weight: 600;
        margin: 0 0 8px 0;
      }

      .user-role {
        font-size: 16px;
        opacity: 0.9;
        margin: 0 0 12px 0;
      }

      .user-score {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        opacity: 0.8;

        .layui-icon {
          color: #ffd700;
        }
      }
    }
  }

  .company-info {
    display: flex;
    align-items: center;
    gap: 16px;

    .company-logo {
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);

      .logo-text {
        font-size: 24px;
        font-weight: bold;
      }
    }

    .company-details {
      h3 {
        font-size: 18px;
        margin: 0 0 8px 0;
      }

      p {
        font-size: 14px;
        opacity: 0.8;
        margin: 4px 0;
      }
    }
  }
}

.content-section {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 20px 0;
    color: #303133;

    .layui-icon {
      color: var(--global-primary-color, #2d72eb);
    }
  }

  .info-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .layui-icon {
      color: var(--global-primary-color, #2d72eb);
      width: 16px;
    }

    .label {
      color: #909399;
      min-width: 80px;
      font-size: 14px;
    }

    .value {
      color: #303133;
      font-weight: 500;
      flex: 1;
    }
  }

  .record-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: var(--global-primary-color, #2d72eb);
    }

    .record-text {
      font-size: 14px;
    }
  }
}

.edit-section {
  .edit-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  .edit-header {
    background: linear-gradient(90deg, #f8faff 0%, #e8f3ff 100%);
    padding: 20px 24px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 16px;
      color: #303133;

      .layui-icon {
        color: var(--global-primary-color, #2d72eb);
      }
    }

    .tab-buttons {
      display: flex;
      gap: 8px;

      .tab-btn {
        padding: 8px 16px;
        border: 1px solid #e4e7ed;
        background: white;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;

        &.active {
          background: var(--global-primary-color, #2d72eb);
          color: white;
          border-color: var(--global-primary-color, #2d72eb);
        }

        &:hover:not(.active) {
          border-color: var(--global-primary-color, #2d72eb);
          color: var(--global-primary-color, #2d72eb);
        }
      }
    }
  }

  .edit-form {
    padding: 24px;

    .form-row {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      label {
        min-width: 80px;
        color: #606266;
        font-size: 14px;
        margin-right: 12px;
      }

      .lay-input,
      .lay-date-picker {
        flex: 1;
      }

      .gender-options {
        flex: 1;
      }
    }
  }

  .form-actions {
    padding: 0 24px 24px;
    display: flex;
    justify-content: flex-end;

    .lay-button {
      min-width: 120px;
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .content-section {
    grid-template-columns: 1fr;

    .edit-section {
      order: -1;
    }
  }
}

@media (max-width: 768px) {
  .user-center {
    padding: 16px;
  }

  .user-header-card {
    flex-direction: column;
    gap: 20px;
    text-align: center;
    padding: 24px;

    .user-avatar-section {
      flex-direction: column;
      gap: 16px;
    }

    .company-info {
      justify-content: center;
    }
  }

  .content-section {
    gap: 16px;
  }

  .edit-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start !important;
  }
}
</style>
