<template>
    <!-- 需求详情弹窗 -->
    <ModalWindow :visible="visible" title="需求详情" :btn="detailModalButtons" :sync-height="false"
        :size-args="['70%', '100%']" @close="handleClose">
        <div class="demand-detail-modal">
            <!-- 需求信息区域 -->
            <div class="detail-section">
                <div class="detail-row">
                    <label class="detail-label">需求概述</label>
                    <div class="detail-value">{{ demand?.demandName }}</div>
                </div>
                <div class="detail-row">
                    <label class="detail-label">需求预算</label>
                    <div class="detail-value">{{ demand?.price }}</div>
                </div>
                <div class="detail-row">
                    <label class="detail-label">需求详情</label>
                    <div class="detail-value detail-textarea">{{ demand?.demandDetails }}</div>
                </div>
                <div class="detail-row">
                    <label class="detail-label">需求文档</label>
                    <div class="detail-value detail-file">
                        <span>无纸化会议系统.pdf</span>
                        <button class="download-btn">下载</button>
                    </div>
                </div>
            </div>

            <!-- 对接公司信息表格 -->
            <div class="company-info-section">
                <div class="section-header">
                    <div class="toolbar-spacer"></div>
                    <button class="action-btn refresh-btn" @click="handleRefreshCompanyInfo">
                        <lay-icon type="layui-icon-refresh" />
                    </button>

                    <!-- 列可见性控制 -->
                    <div class="dropdown-container" ref="dropdownContainer">
                        <button type="button" aria-label="columns" class="action-btn dropdown-toggle"
                            @click="toggleCompanyColumnsDropdown">
                            <lay-icon type="layui-icon-shrink-right" />
                        </button>
                        <ul class="dropdown-menu" :class="{ 'show': showCompanyColumnsDropdown }"
                            :style="dropdownStyle">
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="companyColumnVisibility.demandId"
                                        @change="updateCompanyVisibleColumns" /> 需求编号
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="companyColumnVisibility.companyName"
                                        @change="updateCompanyVisibleColumns" /> 对接公司
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="companyColumnVisibility.contactPerson"
                                        @change="updateCompanyVisibleColumns" /> 对接人
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="companyColumnVisibility.phone"
                                        @change="updateCompanyVisibleColumns" /> 联系方式
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="companyColumnVisibility.position"
                                        @change="updateCompanyVisibleColumns" /> 职务
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="companyColumnVisibility.email"
                                        @change="updateCompanyVisibleColumns" /> 邮箱
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="companyColumnVisibility.website"
                                        @change="updateCompanyVisibleColumns" /> 网址
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="companyColumnVisibility.address"
                                        @change="updateCompanyVisibleColumns" /> 地址
                                </label>
                            </li>
                            <li role="menuitem">
                                <label>
                                    <input type="checkbox" v-model="companyColumnVisibility.status"
                                        @change="updateCompanyVisibleColumns" /> 状态
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
                <lay-table :columns="visibleCompanyInfoColumns" :data-source="companyInfoData"
                    :loading="companyInfoLoading">
                    <!-- 复选框列 -->
                    <template #checkbox="{ row }">
                        <input type="checkbox" v-model="row.selected">
                    </template>
                </lay-table>
            </div>
        </div>
    </ModalWindow>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, nextTick } from 'vue'
import ModalWindow from '@/components/ModalWindow.vue'
import type { ConnectedDemand } from './type'

// 定义组件属性
defineProps<{
    visible: boolean
    demand: ConnectedDemand | null
}>()

// 定义事件
const emit = defineEmits<{
    close: []
}>()

// 加载状态
const companyInfoLoading = ref(false)

// 下拉容器引用
const dropdownContainer = ref<HTMLElement | null>(null)
const dropdownStyle = ref<Record<string, string>>({})

// 对接公司信息表格列配置
const allCompanyInfoColumns = [
    { title: '', width: '50px', type: 'checkbox', customSlot: 'checkbox' },
    { title: '需求编号', key: 'demandId', width: '100px' },
    { title: '对接公司', key: 'companyName', width: '200px' },
    { title: '对接人', key: 'contactPerson', width: '120px' },
    { title: '联系方式', key: 'phone', width: '150px' },
    { title: '职务', key: 'position', width: '120px' },
    { title: '邮箱', key: 'email', width: '200px' },
    { title: '网址', key: 'website', width: '200px' },
    { title: '地址', key: 'address', width: '300px' },
    { title: '状态', key: 'status', width: '100px' }
]

// 对接公司列可见性控制
const companyColumnVisibility = reactive({
    demandId: false,        // 需求编号
    companyName: true,      // 对接公司
    contactPerson: true,    // 对接人
    phone: true,            // 联系方式
    position: true,         // 职务
    email: true,            // 邮箱
    website: true,          // 网址
    address: true,          // 地址
    status: true            // 状态
})

const showCompanyColumnsDropdown = ref(false)

// 计算对接公司可见列
const visibleCompanyInfoColumns = computed(() => {
    return allCompanyInfoColumns.filter(column => {
        if (column.type === 'checkbox') return true
        if (!column.key) return true
        return companyColumnVisibility[column.key as keyof typeof companyColumnVisibility] !== false
    })
})

// 对接公司信息数据
const companyInfoData = ref([
    {
        selected: false,
        demandId: '140',
        companyName: '广州创益信息技术有限公司',
        contactPerson: '颜福如',
        phone: '18664767123',
        position: '总经理',
        email: 'yanfuru@126.com',
        website: 'www.gzcyi.com.cn',
        address: '科学城既月路80号科技创新基地GC区304～310单元',
        status: '已完成'
    }
])

// 详情弹窗按钮配置
const detailModalButtons = ref([
    {
        text: '关闭',
        type: 'normal',
        callback: () => {
            handleClose()
        }
    }
])

// 关闭弹窗
const handleClose = () => {
    emit('close')
}

// 刷新对接公司信息
const handleRefreshCompanyInfo = () => {
    console.log('刷新对接公司信息')
    // 这里可以添加刷新对接公司信息的逻辑
}

// 切换对接公司列下拉菜单
const toggleCompanyColumnsDropdown = () => {
    showCompanyColumnsDropdown.value = !showCompanyColumnsDropdown.value

    if (showCompanyColumnsDropdown.value) {
        // 使用 nextTick 确保 DOM 已更新
        nextTick(() => {
            if (dropdownContainer.value) {
                const rect = dropdownContainer.value.getBoundingClientRect()
                dropdownStyle.value = {
                    top: `${rect.bottom + 2}px`,
                    left: `${rect.right - 160}px` // 160px 是下拉菜单的宽度
                }
            }
        })
    }
}

// 更新对接公司可见列
const updateCompanyVisibleColumns = () => {
    // 列显示状态更新时的处理逻辑
}
</script>

<style scoped lang="scss">
// 确保弹窗内容区域支持下拉菜单溢出显示
:deep(.layui-layer-content) {
    overflow: visible !important;
}

:deep(.modal-content) {
    overflow: visible !important;
}

.demand-detail-modal {
    padding: 20px;
    overflow: visible;

    .detail-section {
        background: white;
        border-radius: 8px;
        margin-bottom: 20px;

        .detail-row {
            display: flex;
            margin-bottom: 20px;
            align-items: flex-start;

            &:last-child {
                margin-bottom: 0;
            }

            .detail-label {
                min-width: 100px;
                font-size: 14px;
                color: #666;
                font-weight: 500;
                padding: 10px 15px;
                background-color: #f5f5f5;
                border: 1px solid #e8e8e8;
                border-radius: 4px 0 0 4px;
                display: flex;
                align-items: center;
            }

            .detail-value {
                flex: 1;
                font-size: 14px;
                color: #333;
                padding: 10px 15px;
                background-color: #fafafa;
                border: 1px solid #e8e8e8;
                border-left: none;
                border-radius: 0 4px 4px 0;
                min-height: 40px;
                display: flex;
                align-items: center;

                &.detail-textarea {
                    min-height: 100px;
                    align-items: flex-start;
                    line-height: 1.6;
                    white-space: pre-wrap;
                }

                &.detail-file {
                    justify-content: space-between;

                    .download-btn {
                        padding: 6px 20px;
                        background-color: #00bfbf;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: all 0.2s ease;

                        &:hover {
                            background-color: #00a5a5;
                        }
                    }
                }
            }
        }
    }

    .company-info-section {
        background: white;
        border-radius: 8px;
        overflow: visible;

        .section-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px;
            border-bottom: 1px solid #e8e8e8;
            overflow: visible;
            position: relative;

            .toolbar-spacer {
                flex: 1;
            }

            .action-btn {
                width: 32px;
                height: 32px;
                border: 1px solid #e8e8e8;
                background-color: #fff;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                color: #333;

                &:hover {
                    background-color: #f0f8ff;
                    border-color: #1890ff;
                    color: #1890ff;
                }

                i {
                    font-size: 14px;
                }
            }

            .dropdown-container {
                position: relative;
            }

            .dropdown-menu {
                position: fixed;
                z-index: 10000;
                display: none;
                min-width: 160px;
                max-height: 300px;
                overflow-y: auto;
                padding: 5px 0;
                margin: 2px 0 0;
                font-size: 12px;
                text-align: left;
                list-style: none;
                background-color: #fff;
                background-clip: padding-box;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);

                &.show {
                    display: block;
                }

                li {
                    &:hover {
                        background-color: #f5f5f5;
                    }

                    label {
                        display: block;
                        padding: 8px 15px;
                        font-weight: normal;
                        line-height: 1.4;
                        color: #333;
                        white-space: nowrap;
                        cursor: pointer;
                        margin: 0;

                        input[type="checkbox"] {
                            margin-right: 8px;
                        }
                    }
                }
            }
        }
    }
}
</style>
