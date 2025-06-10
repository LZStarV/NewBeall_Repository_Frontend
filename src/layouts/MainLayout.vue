<!-- src/layouts/MainLayout.vue -->
<template>
  <div>
    <div>我是MainLayout,下面是我的下层路由内容：</div>
    <!--面包屑-->
    <BaseBreadcrumb />
    <RouterView />
  </div>
</template>

<script lang="ts" setup>
</script>
