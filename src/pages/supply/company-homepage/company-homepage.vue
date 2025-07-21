<template>
    <div class="company-homepage-page">
        <div class="page-header">
            <h1>公司主页</h1>
            <p>设置和管理公司对外展示页面</p>
        </div>

        <div class="content-area">
            <lay-card title="主页设置">
                <p>配置公司主页信息和展示内容</p>
            </lay-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
// 公司主页相关逻辑
</script>

<style scoped lang="scss">
.company-homepage-page {
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
