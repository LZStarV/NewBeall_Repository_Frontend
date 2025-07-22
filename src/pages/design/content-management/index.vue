<template>
    <div class="content-management-page">
        <div class="page-header">
            <h1>文案管理</h1>
            <p>管理项目文案和宣传材料</p>
        </div>

        <div class="content-area">
            <lay-row :space="24">
                <!-- 左侧分类 -->
                <lay-col :md="6">
                    <lay-card title="文案分类">
                        <div class="category-list">
                            <div v-for="category in categories" :key="category.id" class="category-item"
                                :class="{ active: selectedCategory === category.id }"
                                @click="selectCategory(category.id)">
                                <lay-icon :type="category.icon" />
                                <span>{{ category.name }}</span>
                                <span class="count">({{ category.count }})</span>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>

                <!-- 右侧内容 -->
                <lay-col :md="18">
                    <lay-card title="文案列表">
                        <div class="toolbar">
                            <lay-button type="primary">新建文案</lay-button>
                            <lay-button>批量操作</lay-button>
                            <lay-input placeholder="搜索文案" style="width: 200px;" />
                        </div>

                        <div class="content-list">
                            <div v-for="item in contentList" :key="item.id" class="content-item">
                                <div class="content-header">
                                    <h3>{{ item.title }}</h3>
                                    <div class="content-meta">
                                        <span>{{ item.createTime }}</span>
                                        <lay-tag :type="item.status === '已发布' ? 'normal' : 'warm'">{{ item.status
                                            }}</lay-tag>
                                    </div>
                                </div>
                                <div class="content-preview">
                                    <p>{{ item.preview }}</p>
                                </div>
                                <div class="content-actions">
                                    <lay-button size="sm" @click="editContent(item)">编辑</lay-button>
                                    <lay-button size="sm" @click="previewContent(item)">预览</lay-button>
                                    <lay-button size="sm" type="primary" @click="publishContent(item)">发布</lay-button>
                                    <lay-button size="sm" type="danger" @click="deleteContent(item)">删除</lay-button>
                                </div>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>
            </lay-row>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const selectedCategory = ref(1);

const categories = ref([
    { id: 1, name: '项目介绍', icon: 'layui-icon-file', count: 12 },
    { id: 2, name: '设计说明', icon: 'layui-icon-edit', count: 8 },
    { id: 3, name: '材料说明', icon: 'layui-icon-component', count: 15 },
    { id: 4, name: '施工指南', icon: 'layui-icon-engine', count: 6 }
]);

const contentList = ref([
    {
        id: 1,
        title: '现代简约办公室设计方案',
        preview: '本方案采用现代简约风格，以白色和灰色为主色调，营造简洁、明亮的办公环境...',
        createTime: '2024-01-20',
        status: '已发布'
    },
    {
        id: 2,
        title: '环保材料选择指南',
        preview: '在装修过程中，选择环保材料至关重要。本指南详细介绍了各类环保材料的特点...',
        createTime: '2024-01-18',
        status: '草稿'
    }
]);

const selectCategory = (categoryId: number) => {
    selectedCategory.value = categoryId;
};

const editContent = (item: any) => {
    console.log('编辑文案:', item);
};

const previewContent = (item: any) => {
    console.log('预览文案:', item);
};

const publishContent = (item: any) => {
    console.log('发布文案:', item);
};

const deleteContent = (item: any) => {
    console.log('删除文案:', item);
};
</script>

<style scoped lang="scss">
.content-management-page {
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

.category-list {
    .category-item {
        display: flex;
        align-items: center;
        padding: 12px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
            background-color: #f5f7fa;
        }

        &.active {
            background-color: #e6f7ff;
            color: #409eff;
        }

        .layui-icon {
            margin-right: 8px;
        }

        .count {
            margin-left: auto;
            font-size: 12px;
            color: #999;
        }
    }
}

.toolbar {
    margin-bottom: 24px;
    display: flex;
    gap: 12px;
    align-items: center;
}

.content-list {
    .content-item {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 16px;
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
    }
}

.content-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;

    h3 {
        margin: 0;
        color: #333;
        font-size: 16px;
    }

    .content-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 12px;
        color: #999;
    }
}

.content-preview {
    margin-bottom: 16px;

    p {
        margin: 0;
        color: #666;
        font-size: 14px;
        line-height: 1.5;
    }
}

.content-actions {
    display: flex;
    gap: 8px;
}
</style>
