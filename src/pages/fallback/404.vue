<template>
  <main class="container">
    <lay-exception status="404" title="404" describe="页面未找到">
      <template #extra>
        <div class="error-desc">抱歉，页面好像去火星了~</div>
        <lay-button type="primary" @click="$router.push('/')">返回首页</lay-button>
      </template>
    </lay-exception>
  </main>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  .layui-exception {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    text-align: center;

    .error-desc {
      font-size: 13px;
      color: #676a6c;
      margin-bottom: 1rem;
      margin-top: -1rem;
      white-space: nowrap;
    }

    :deep(.error-404) {
      height: 250px;
    }
  }
}

/* 小屏幕手机适配 */
@media screen and (max-width: 480px) {
  .container {
    .layui-exception {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      :deep(.layui-exception-image) {}

      :deep(.layui-exception-details-title) {
        font-size: 2rem;
        margin-top: 0;
      }

      :deep(.layui-exception-details-content) {
        margin: auto;
      }
    }
  }
}
</style>
