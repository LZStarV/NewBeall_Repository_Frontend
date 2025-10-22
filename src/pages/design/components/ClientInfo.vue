<template>
  <!-- 跟进记录面板按钮与容器 -->
  <div class="panel-toggle" v-if="clientInfo">
    <lay-button size="sm" type="normal" @click="toggleLogs">
      {{ showLogs ? '隐藏跟进记录' : '查看跟进记录' }}
    </lay-button>
  </div>
  <ClientInfoLogPanel
    v-if="clientInfo"
    :visible="showLogs"
    :notes="clientInfo.note"
    @update:visible="(v: boolean) => (showLogs = v)"
  />

  <main class="detail-container">
    <!-- 详情内容 -->
    <div v-if="clientInfo" class="detail-content">
      <h3 class="detail-title">客户信息</h3>
      <lay-row :gutter="20">
        <lay-col :xs="24" :md="12">
          <!-- 基本信息模块 -->
          <div class="module-card">
            <div class="module-content">
              <div class="form-row">
                <label class="form-head-label">客户单位</label>
                <lay-input v-model="clientInfo.contacts" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">联系人</label>
                <lay-input v-model="clientInfo.contactUser" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">手机号</label>
                <lay-input v-model="clientInfo.tel" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">职务</label>
                <lay-input v-model="clientInfo.job" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">邮箱</label>
                <lay-input v-model="clientInfo.email" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">网址</label>
                <lay-input v-model="clientInfo.clientWebsite" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">座机</label>
                <lay-input v-model="clientInfo.fax" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">创建人</label>
                <lay-input v-model="clientInfo.createUserName" disabled />
              </div>
            </div>
          </div>
        </lay-col>

        <lay-col :xs="24" :md="12">
          <!-- 分类信息模块 -->
          <div class="module-card">
            <div class="module-content">
              <div class="form-row">
                <label class="form-head-label">客户类型</label>
                <lay-input v-model="clientInfo.clientCategory" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">客户来源</label>
                <lay-input v-model="clientInfo.clientSource" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">人员规模</label>
                <lay-input v-model="clientInfo.clientSize" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">跟进状态</label>
                <lay-input v-model="clientInfo.clientStatus" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">QQ号</label>
                <lay-input v-model="clientInfo.qq" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">微信号</label>
                <lay-input v-model="clientInfo.wechat" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">创建时间</label>
                <lay-input v-model="clientInfo.createtime" disabled />
              </div>
              <div class="form-row">
                <label class="form-head-label">备注</label>
                <lay-input v-model="clientInfo.remark" disabled />
              </div>
            </div>
          </div>
        </lay-col>
      </lay-row>

      <!-- 详细地址信息 -->
      <lay-row :gutter="20">
        <div class="module-card">
          <div class="module-content">
            <div class="form-row">
              <label class="form-head-label">详细地址</label>
              <lay-input v-model="clientInfo.address" disabled />
            </div>
          </div>
        </div>
      </lay-row>
    </div>
  </main>
</template>

<script setup lang="ts">
import clinetApi from '@/api/client/clinetApi';
import type { ClientType } from '@/api/client/clinetApi.type';
import { getClientCategoryList, getClientSizeList } from '@/utils/clientUtils';
import { onMounted, ref } from 'vue';
import ClientInfoLogPanel from './ClientInfoLogPanel.vue';

const props = defineProps<{
  clientId: string | number;
}>();

const clientInfo = ref<ClientType | null>(null);

const getClientInfo = async () => {
  if (props.clientId) {
    const res = await clinetApi.clientDetail(props.clientId);
    clientInfo.value = res.data;
    if (res.data.clientCategory) {
      // 获取客户分类名称
      const categoryRes = await getClientCategoryList();
      const category = categoryRes.find(
        (item) => String(item.id) == clientInfo.value?.clientCategory,
      );
      clientInfo.value.clientCategory = category?.clientCategory || '';
      // 获取人员规模
      clientInfo.value.clientSize = getClientSizeList(
        Number(clientInfo.value.clientSize),
      );
      // 消除note的HTML换行实体
      clientInfo.value.note = clientInfo.value.note
        .replace(/&#10;/g, '\n')
        .replace(/&#13;/g, '\r');
    }
  }
};

const showLogs = ref(false);
const toggleLogs = () => {
  showLogs.value = !showLogs.value;
};

onMounted(() => {
  getClientInfo();
});
</script>

<style scoped lang="scss">
// 每个子卡片的样式
@mixin form-module {
  padding: 16px;
  box-sizing: border-box;
}

// 表单行布局
@mixin form-row-layout {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

// 表单标签样式
@mixin form-head-label-style {
  font-size: 14px;
  color: #333;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

// 面板展开按钮控制样式
.panel-toggle {
  padding: 12px 20px 0 20px;
  display: flex;
  justify-content: space-between;
}

.detail-container {
  height: 100%;
  overflow-y: auto;
}

.detail-content {
  padding: 20px;
  position: relative;

  .detail-title {
    text-align: center;
    margin-bottom: 20px;
  }
}

.module-card {
  @include form-module;
  height: 100%;

  &:last-child {
    padding-top: 0;
  }
}

.module-content {
  .form-row {
    @include form-row-layout;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-head-label {
    @include form-head-label-style;
  }

  :deep(.layui-input) {
    flex: 1;
    background-color: #f8f9fa;

    .layui-input-disabled {
      background-color: white;
      opacity: 1;

      * {
        opacity: 1;
        color: $text-primary;
        cursor: text !important;
      }
    }
  }
}
</style>

