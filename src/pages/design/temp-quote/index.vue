<template>
    <div class="temp-quote-page">
        <div class="page-header">
            <h1>临时报价</h1>
            <p>管理临时保存的报价草稿</p>
        </div>

        <div class="content-area">
            <lay-card title="临时报价列表">
                <div class="toolbar">
                    <lay-button type="primary">新建临时报价</lay-button>
                    <lay-button>批量删除</lay-button>
                </div>

                <div class="temp-quote-grid">
                    <div v-for="item in tempQuotes" :key="item.id" class="quote-item">
                        <div class="quote-header">
                            <h3>{{ item.projectName }}</h3>
                            <span class="save-time">{{ item.saveTime }}</span>
                        </div>
                        <div class="quote-content">
                            <p>{{ item.description }}</p>
                        </div>
                        <div class="quote-actions">
                            <lay-button size="sm" @click="continueEdit(item)">继续编辑</lay-button>
                            <lay-button size="sm" type="primary" @click="saveAsFormal(item)">转为正式报价</lay-button>
                            <lay-button size="sm" type="danger" @click="deleteTemp(item)">删除</lay-button>
                        </div>
                    </div>
                </div>
            </lay-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const tempQuotes = ref([
    {
        id: 1,
        projectName: '商场装修设计',
        description: '某购物中心的整体装修设计方案，包含空间规划、材料选择等...',
        saveTime: '2024-01-20 14:30'
    },
    {
        id: 2,
        projectName: '酒店大堂设计',
        description: '五星级酒店大堂的装修设计，需要考虑奢华感和实用性...',
        saveTime: '2024-01-19 16:45'
    }
]);

const continueEdit = (item: any) => {
    console.log('继续编辑:', item);
};

const saveAsFormal = (item: any) => {
    console.log('转为正式报价:', item);
};

const deleteTemp = (item: any) => {
    console.log('删除临时报价:', item);
};
</script>

<style scoped lang="scss">
.temp-quote-page {
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

.temp-quote-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 24px;
}

.quote-item {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
}

.quote-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;

    h3 {
        margin: 0;
        color: #333;
        font-size: 16px;
    }

    .save-time {
        font-size: 12px;
        color: #999;
    }
}

.quote-content {
    margin-bottom: 16px;

    p {
        margin: 0;
        color: #666;
        font-size: 14px;
        line-height: 1.5;
    }
}

.quote-actions {
    display: flex;
    gap: 8px;
}
</style>
