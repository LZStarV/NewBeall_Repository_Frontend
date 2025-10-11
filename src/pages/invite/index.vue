<template>
  <div class="invite-page">
    <div class="invite-container">
      <!-- 邀请流程说明 -->
      <section class="invite-flow">
        <img src="@assets/image/invite/process_tell.png" alt="邀请流程说明" />
      </section>

      <!-- 分享我的邀请码 -->
      <section class="section-title">
        <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 0">
          分享我的邀请码
        </h2>
      </section>

      <!-- 邀请码内容区域 -->
      <section class="share-code-section">
        <div class="share-code-header"></div>
        <div class="share-code-body">
          <!-- 未生成状态 -->
          <div
            v-if="inviteCodeStatus === 'unenforced'"
            class="code-status"
            :class="{ show: inviteCodeStatus === 'unenforced' }"
          >
            <p class="status-text">您暂未生成邀请码，请点击下方按钮生成</p>
            <div class="button-group">
              <lay-button type="primary" @click="createInviteCode"
                >
生成邀请码
</lay-button
              >
            </div>
          </div>

          <!-- 已过期状态 -->
          <div
            v-else-if="inviteCodeStatus === 'failed'"
            class="code-status"
            :class="{ show: inviteCodeStatus === 'failed' }"
          >
            <p class="status-text">您的邀请码已过期，请重新生成</p>
            <div class="button-group">
              <lay-button type="primary" @click="createInviteCode"
                >
重新生成
</lay-button
              >
            </div>
          </div>

          <!-- 生效中状态 -->
          <div
            v-else-if="inviteCodeStatus === 'validity'"
            class="code-status"
            :class="{ show: inviteCodeStatus === 'validity' }"
          >
            <p class="status-text">邀请码</p>
            <div class="code-display">
              <input
                type="text"
                readonly
                :value="inviteCode"
                class="invite-code-input"
              />
            </div>
            <div class="button-group">
              <lay-button type="primary" @click="copyInviteCode"
                >
一键复制
</lay-button
              >
            </div>
            <p class="status-note text-center">您的邀请码已生效</p>
          </div>
        </div>
        <div class="share-code-footer"></div>
      </section>

      <div class="spacer-large"></div>

      <!-- 奖励一：邀请注册奖励 -->
      <section class="section-title">
        <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 0">
          奖励一：用户推广奖励
        </h2>
      </section>

      <div class="spacer-small"></div>

      <!-- 奖励一表格区域 -->
      <section class="reward-section">
        <lay-table
          :data-source="rewardOneData"
          :columns="rewardOneColumns"
          size="lg"
        />
      </section>

      <div class="spacer-large"></div>

      <!-- 奖励二：会员充值奖励 -->
      <section class="section-title">
        <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 0">
          奖励二：会员推广奖励
        </h2>
      </section>

      <div class="spacer-small"></div>

      <!-- 奖励二表格区域 -->
      <section class="reward-section">
        <lay-table
          :data-source="rewardTwoData"
          :columns="rewardTwoColumns"
          size="lg"
        />
      </section>

      <section class="reward-explanation">
        <div style="display: flex">
          <lay-icon type="layui-icon-form" />
          <p>奖励规则</p>
        </div>
      </section>

      <div class="spacer-large"></div>

      <!-- 奖励三：邀请注册奖励 -->
      <section class="section-title">
        <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 0">
          奖励三：邀请注册奖励
        </h2>
      </section>

      <div class="spacer-small"></div>

      <!-- 奖励三表格区域 -->
      <section class="reward-section">
        <div class="reward-header">
          <ul class="table-header">
            <li>奖励说明</li>
            <li>领取状态</li>
          </ul>
        </div>

        <div class="reward-table">
          <div class="table-top"></div>
          <div class="table-body">
            <div class="reward-row">
              <div class="layui-row">
                <div class="layui-col-md6">
                  <div class="row-item">
                    邀请好友首次注册平台获得积分奖励，具体奖励规则如下：<br />
                    1. 邀请1位好友注册并完善资料，获得20积分<br />
                    2. 邀请5位好友注册并完善资料，获得100积分<br />
                    3. 邀请10位好友注册并完善资料，获得200积分
                  </div>
                </div>
                <div class="layui-col-md6">
                  <div class="row-item">
                    <lay-button
                      type="primary"
                      disabled
                      @click="getReward({ vip: 0, num: 10 })"
                      >
已领取
</lay-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="table-bottom"></div>
        </div>
      </section>

      <div class="spacer-large"></div>

      <!-- 常见说明 -->
      <section class="faq-section">
        <h3 class="faq-title">常见说明</h3>
        <div class="faq-item">
          <p class="faq-question">1. 邀请码如何生成？</p>
          <p class="faq-answer">
            点击"生成邀请码"按钮即可生成专属邀请码，邀请码有效期为30天，过期后需要重新生成。
          </p>
        </div>
        <div class="faq-item">
          <p class="faq-question">2. 邀请好友如何获得奖励？</p>
          <p class="faq-answer">
            好友通过您的邀请码或邀请链接注册并完成相应任务后，系统会自动发放奖励到您的账户。
          </p>
        </div>
      </section>

      <div class="spacer-large"></div>

      <!-- 分享邀请链接 -->
      <section class="section-title">
        <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 0">
          分享邀请链接
        </h2>
      </section>

      <section class="share-link-section">
        <div class="share-link-header"></div>
        <div class="share-link-body">
          <!-- 未生成状态 -->
          <div
            v-if="inviteLinkStatus === 'unenforced'"
            class="link-status"
            :class="{ show: inviteLinkStatus === 'unenforced' }"
          >
            <p class="status-text">您暂未生成邀请链接，请点击下方按钮生成</p>
            <div class="button-group">
              <lay-button type="primary" @click="createInviteLink"
                >
生成邀请链接
</lay-button
              >
            </div>
          </div>

          <!-- 已过期状态 -->
          <div
            v-else-if="inviteLinkStatus === 'failed'"
            class="link-status"
            :class="{ show: inviteLinkStatus === 'failed' }"
          >
            <p class="status-text">您的邀请链接已过期，请重新生成</p>
            <div class="button-group">
              <lay-button type="primary" @click="createInviteLink"
                >
重新生成
</lay-button
              >
            </div>
          </div>

          <!-- 生效中状态 -->
          <div
            v-else-if="inviteLinkStatus === 'validity'"
            class="link-status"
            :class="{ show: inviteLinkStatus === 'validity' }"
          >
            <p class="status-text">邀请链接</p>
            <div class="link-display">
              <div class="invite-link">
                {{ inviteLinkText }}
              </div>
            </div>
            <div class="button-group">
              <lay-button type="primary" @click="copyInviteLink"
                >
一键复制
</lay-button
              >
            </div>
            <p class="status-note text-center">您的邀请链接已生效</p>
          </div>
        </div>
        <div class="share-link-footer"></div>
      </section>

      <div class="spacer-large"></div>

      <!-- 我邀请的好友 -->
      <section class="section-title">
        <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 0">
          我邀请的好友
        </h2>
      </section>

      <div class="spacer-small"></div>

      <!-- 我邀请的好友列表 -->
      <section class="reward-section friend-list">
        <lay-table
          :data-source="inviteRecords"
          :columns="inviteRecordColumns"
          style="width: 100%"
          :border="true"
        />

        <div class="pagination text-center">
          <lay-button
            class="pagination-btn"
            :disabled="currentPage <= 1"
            @click="prevPage"
          >
            <上一页
          </lay-button>
          &nbsp;&nbsp;
          <lay-button
            class="pagination-btn"
            :disabled="currentPage >= totalPages"
            @click="nextPage"
          >
            下一页>
          </lay-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Notify from '@/utils/notify.ts';

// 邀请码相关状态
const inviteCodeStatus = ref<'unenforced' | 'failed' | 'validity'>('validity');
const inviteCode = ref('567896');

// 邀请链接相关状态
const inviteLinkStatus = ref<'unenforced' | 'failed' | 'validity'>('validity');
const inviteLinkText = ref(
  '嗨！！！我在这里发现了一个高效，实用的设计报价平台，快来一起来体验吧！http://newbeall.com/register?code=fjopuyCFHIKSUX5',
);

// 统计数据
const totalPromoteVip = ref(0);
const totalPromoteUser = ref(0);

// 分页相关
const currentPage = ref(1);
const totalPages = ref(1);

// 奖励一表格类型
interface rewardOneType {
  identity: string;
  reward: string;
  rule: string;
}

// 奖励一表格数据
const rewardOneData = ref<rewardOneType[]>([
  {
    identity: '个人用户',
    reward: '10积分/账号',
    rule: '1. 邀请好友首次注册平台，您就可以获得积分奖励，无次数上限',
  },
  {
    identity: '产品供应商（企业用户）',
    reward: '20积分/账号',
    rule: '2. 推广奖励自动到账，您可以在积分明细列表查看详细记录',
  },
  {
    identity: '工程集成商（企业用户）',
    reward: '20积分/账号',
    rule: '',
  },
]);

// 奖励一表格列配置
const rewardOneColumns = ref([
  { key: 'identity', title: '', width: '25%' },
  { key: 'reward', title: '邀请奖励', width: '25%' },
  { key: 'rule', title: '奖励规则', width: '50%' },
]);

// 奖励二表格类型
interface rewardTwoType {
  individualMember: string;
  individualReward: string;
  companyMember: string;
  companyReward: string;
}

// 奖励二表格数据
const rewardTwoData = ref<rewardTwoType[]>([
  {
    individualMember: '个人月度会员',
    individualReward: '5积分',
    companyMember: '企业月度会员',
    companyReward: '100积分',
  },
  {
    individualMember: '个人季度会员',
    individualReward: '15积分',
    companyMember: '企业半年度会员',
    companyReward: '1个月会员',
  },
  {
    individualMember: '个人半年度会员',
    individualReward: '30积分',
    companyMember: '企业年度会员',
    companyReward: '2个月会员',
  },
  {
    individualMember: '个人年度会员',
    individualReward: '60积分',
    companyMember: '企业三年度会员',
    companyReward: '半年会员',
  }
]);

// 奖励二表格列配置
const rewardTwoColumns = ref([
  { key: 'individualMember', title: '个人会员', width: '25%' },
  { key: 'individualReward', title: '充值奖励', width: '25%' },
  { key: 'companyMember', title: '企业会员', width: '25%' },
  { key: 'companyReward', title: '充值奖励', width: '25%' }
]);

// 邀请记录数据
const inviteRecords = ref([
  {
    beInviteAccount: '张三',
    beInvitePhone: '138****1234',
    inviteTime: '2023-11-01 10:30:00',
    awardIntegral: 100,
    awardVip: 2,
  },
  {
    beInviteAccount: '李四',
    beInvitePhone: '139****5678',
    inviteTime: '2023-11-02 14:15:00',
    awardIntegral: 20,
    awardVip: 0,
  },
  {
    beInviteAccount: '王五',
    beInvitePhone: '137****9012',
    inviteTime: '2023-11-03 09:45:00',
    awardIntegral: 30,
    awardVip: 1,
  },
]);

// 邀请记录表格列配置
const inviteRecordColumns = ref([
  {
    field: 'beInviteAccount',
    title: '账户',
    width: 160,
  },
  {
    field: 'beInvitePhone',
    title: '手机号',
    width: 160,
  },
  {
    field: 'inviteTime',
    title: '注册时间',
    width: 240,
  },
  {
    field: 'awardIntegral',
    title: '累计积分奖励',
    width: 160,
    templet: (d: any) => `${d.awardIntegral}积分`,
  },
  {
    field: 'awardVip',
    title: '累计会员奖励',
    width: 160,
    templet: (d: any) => `${d.awardVip}个月`,
  },
]);

// 生成邀请码
const createInviteCode = () => {
  // TODO: 调用生成邀请码接口
  Notify.success('邀请码生成成功');
  inviteCodeStatus.value = 'validity';
  // 模拟生成邀请码
  inviteCode.value = Math.random().toString(36).substring(2, 8).toUpperCase();
};

// 复制邀请码
const copyInviteCode = async () => {
  try {
    await navigator.clipboard.writeText(inviteCode.value);
    Notify.success('邀请码复制成功');
  } catch (err) {
    Notify.error('复制失败，请手动复制');
    console.error('复制失败:', err);
  }
};

// 生成邀请链接
const createInviteLink = () => {
  // TODO: 调用生成邀请链接接口
  Notify.success('邀请链接生成成功');
  inviteLinkStatus.value = 'validity';
};

// 复制邀请链接
const copyInviteLink = async () => {
  try {
    await navigator.clipboard.writeText(inviteLinkText.value);
    Notify.success('邀请链接复制成功');
  } catch (err) {
    Notify.error('复制失败，请手动复制');
    console.error('复制失败:', err);
  }
};

// 领取奖励
const getReward = (data: { vip: number; num: number }) => {
  // TODO: 调用领取奖励接口
  Notify.success('奖励领取成功');
};

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadInviteRecords();
  }
};

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    loadInviteRecords();
  }
};

// 加载邀请记录
const loadInviteRecords = () => {
  // TODO: 调用加载邀请记录接口
  console.log('加载第', currentPage.value, '页邀请记录');
};

// 页面加载时初始化
onMounted(() => {
  // TODO: 调用接口获取用户邀请状态、统计数据等
  loadInviteRecords();
});
</script>

<style scoped lang="scss">
@import '/src/styles/_variables.scss';
@import '/src/styles/_mixins.scss';

.invite-page {
  padding: 20px;
  background-color: #f9f9f9;
}

.invite-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 间距样式 */
.spacer-small {
  clear: both;
  height: 20px;
}

.spacer-large {
  clear: both;
  height: 40px;
}

/* 标题样式 */
.section-title {
  text-align: center;
  margin: 20px 0;
}

/* 邀请流程样式 */
.invite-flow {
  text-align: center;
  margin-bottom: 40px;
}

.invite-flow img {
  max-width: 100%;
  height: auto;
}

/* 分享代码区域样式 */
.share-code-section,
.share-link-section {
  position: relative;
  margin: 20px 0;
}

.share-code-header,
.share-code-footer,
.share-link-header,
.share-link-footer {
  height: 10px;
  background: url('/static/img/invite/box.png') repeat-x 0 0;
}

.share-code-body,
.share-link-body {
  background: url('/static/img/invite/boxCenter.png') repeat-y;
  padding: 20px;
}

/* 代码/链接状态样式 */
.code-status,
.link-status {
  display: none;
}

.code-status.show,
.link-status.show {
  display: block;
}

.status-text {
  margin-bottom: 10px;
  text-align: center;
  font-size: 16px;
  color: #333;
}

.code-display,
.link-display {
  margin-bottom: 15px;
  text-align: center;
}

.invite-code-input {
  width: 300px;
  height: 55px;
  line-height: 55px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 0 auto;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.invite-link {
  width: 600px;
  min-height: 100px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 0 auto;
  padding: 10px;
  word-wrap: break-word;
  text-align: left;
}

.button-group {
  text-align: center;
  margin-bottom: 10px;
}

.status-note {
  text-align: center;
  color: #666;
  font-size: 14px;
}

/* 奖励区域样式 */
.reward-section {
  margin: 20px 0;
  padding: 0;
  width: 1000px;
}

.reward-explanation {
  width: 60%;
}

/* 统计数据样式 */
.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #ff6600;
}

.stat-unit {
  font-size: 16px;
  color: #666;
  margin-left: 5px;
}

/* 常见问题样式 */
.faq-section {
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.faq-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.faq-item {
  margin-bottom: 15px;
}

.faq-question {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.faq-answer {
  color: #666;
  line-height: 1.6;
  margin-top: 5px;
}

/* 好友列表样式 */
.friend-list .table-header li {
  text-align: center;
}

/* 分页样式 */
.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination-btn {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

/* 响应式设计 */
@media (max-width: 800px) {
  .invite-page {
    padding: 10px;
  }

  .invite-container {
    padding: 10px;
  }

  .layui-col-md3,
  .layui-col-md6 {
    width: 100%;
    margin-bottom: 10px;
  }

  .invite-code-input,
  .invite-link {
    width: 100%;
    max-width: 300px;
  }

  .table-header {
    flex-direction: column;
  }

  .table-header li {
    display: block;
    text-align: center;
    width: 100%;
  }
}
</style>
