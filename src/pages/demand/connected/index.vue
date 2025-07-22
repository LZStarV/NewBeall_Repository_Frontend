<template>
    <div class="connected-demand-page">
        <div class="page-header">
            <h1>已对接需求</h1>
            <p>查看已成功对接的需求项目</p>
        </div>

        <div class="content-area">
            <lay-card title="对接列表">
                <p>已对接需求列表将在这里显示</p>
            </lay-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
// 已对接需求相关逻辑
</script>

<style scoped lang="scss">
.connected-demand-page {
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
