<template>
    <div class="supplier-management-page">
        <div class="page-header">
            <h1>供应商管理</h1>
            <p>管理供应商信息和合作关系</p>
        </div>

        <div class="content-area">
            <lay-card title="供应商列表">
                <div class="toolbar">
                    <lay-button type="primary">添加供应商</lay-button>
                    <lay-button>导入供应商</lay-button>
                    <lay-button>导出数据</lay-button>
                </div>

                <div class="supplier-table">
                    <p>供应商列表表格将在这里显示</p>
                </div>
            </lay-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
// 供应商管理相关逻辑
</script>

<style scoped lang="scss">
.supplier-management-page {
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
