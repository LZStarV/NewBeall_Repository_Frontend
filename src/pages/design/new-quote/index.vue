<template>
  <div class="new-quote-page">
    <div class="page-header">
      <h1>新建报价</h1>
      <p>创建新的设计项目报价</p>
    </div>

    <div class="content-area">
      <lay-card title="报价信息">
        <lay-form ref="formRef" :model="quoteForm">
          <lay-row>
            <lay-col :md="12">
              <lay-form-item label="项目名称" prop="projectName">
                <lay-input
                  v-model="quoteForm.projectName"
                  placeholder="请输入项目名称"
                />
              </lay-form-item>
            </lay-col>
            <lay-col :md="12">
              <lay-form-item label="客户名称" prop="customerName">
                <lay-input
                  v-model="quoteForm.customerName"
                  placeholder="请输入客户名称"
                />
              </lay-form-item>
            </lay-col>
          </lay-row>

          <lay-form-item label="项目描述" prop="description">
            <lay-textarea
              v-model="quoteForm.description"
              placeholder="请输入项目描述"
              :rows="4"
            />
          </lay-form-item>

          <lay-form-item>
            <lay-button type="primary">保存报价</lay-button>
            <lay-button>取消</lay-button>
          </lay-form-item>
        </lay-form>
      </lay-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const formRef = ref();

const quoteForm = reactive({
  projectName: '',
  customerName: '',
  description: '',
});
</script>

<style scoped lang="scss">
.new-quote-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;

  h1 {
    margin: 0;
    color: #333;
    font-size: 28px;
  }

  p {
    margin: 8px 0 0 0;
    color: #666;
    font-size: 16px;
  }
}
</style>
