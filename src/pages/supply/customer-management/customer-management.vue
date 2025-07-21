<template>
    <div class="customer-management-page">
        <div class="page-header">
            <h1>客户管理</h1>
            <p>管理客户信息和关系维护</p>
        </div>

        <div class="content-area">
            <lay-card title="客户列表">
                <div class="toolbar">
                    <lay-button type="primary">添加客户</lay-button>
                    <lay-button>导入客户</lay-button>
                    <lay-button>导出数据</lay-button>
                </div>

                <div class="customer-table">
                    <p>客户列表表格将在这里显示</p>
                </div>
            </lay-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
// 客户管理相关逻辑
</script>

<style scoped lang="scss">
.customer-management-page {
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

.toolbar {
    margin-bottom: 24px;
    display: flex;
    gap: 12px;
}
</style>
