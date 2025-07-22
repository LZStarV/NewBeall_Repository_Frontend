<template>
    <div class="quote-template-page">
        <div class="page-header">
            <h1>报价模块</h1>
            <p>管理报价模板和标准化模块</p>
        </div>

        <div class="content-area">
            <lay-card title="模板管理">
                <div class="toolbar">
                    <lay-button type="primary">新建模板</lay-button>
                    <lay-button>导入模板</lay-button>
                    <lay-button>导出模板</lay-button>
                </div>

                <div class="template-grid">
                    <div v-for="template in templates" :key="template.id" class="template-item">
                        <div class="template-preview">
                            <lay-icon type="layui-icon-template-1" size="48" />
                        </div>
                        <div class="template-info">
                            <h3>{{ template.name }}</h3>
                            <p>{{ template.description }}</p>
                            <div class="template-meta">
                                <span>创建时间: {{ template.createTime }}</span>
                                <span>使用次数: {{ template.useCount }}</span>
                            </div>
                        </div>
                        <div class="template-actions">
                            <lay-button size="sm" @click="useTemplate(template)">使用</lay-button>
                            <lay-button size="sm" @click="editTemplate(template)">编辑</lay-button>
                            <lay-button size="sm" type="danger" @click="deleteTemplate(template)">删除</lay-button>
                        </div>
                    </div>
                </div>
            </lay-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const templates = ref([
    {
        id: 1,
        name: '办公室装修标准模板',
        description: '适用于一般办公室装修项目的标准报价模板',
        createTime: '2024-01-10',
        useCount: 15
    },
    {
        id: 2,
        name: '商业空间设计模板',
        description: '商场、店铺等商业空间的设计报价模板',
        createTime: '2024-01-08',
        useCount: 8
    }
]);

const useTemplate = (template: any) => {
    console.log('使用模板:', template);
};

const editTemplate = (template: any) => {
    console.log('编辑模板:', template);
};

const deleteTemplate = (template: any) => {
    console.log('删除模板:', template);
};
</script>

<style scoped lang="scss">
.quote-template-page {
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

.template-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
}

.template-item {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
}

.template-preview {
    margin-bottom: 16px;
    color: #666;
}

.template-info {
    flex: 1;
    margin-bottom: 16px;

    h3 {
        margin: 0 0 8px 0;
        color: #333;
        font-size: 16px;
    }

    p {
        margin: 0 0 12px 0;
        color: #666;
        font-size: 14px;
        line-height: 1.5;
    }

    .template-meta {
        font-size: 12px;
        color: #999;

        span {
            display: block;
            margin-bottom: 4px;
        }
    }
}

.template-actions {
    display: flex;
    gap: 8px;
}
</style>
