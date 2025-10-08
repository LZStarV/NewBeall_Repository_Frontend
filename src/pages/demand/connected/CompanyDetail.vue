<template>
    <!-- 公司详情弹窗 -->
    <ModalWindow :visible="visible" :title="'公司信息'" :btn="companyDetailButtons" :sync-height="true"
        :size-args="['70%', '90%']" @close="handleClose">
        <div v-if="selectedCompany" class="company-detail">
            <!-- 左右分栏布局 -->
            <div class="company-layout">
                <!-- 左侧导航 -->
                <div class="sidebar">
                    <!-- 公司名称 -->
                    <div class="company-name">
                        {{ selectedCompany.company }}
                    </div>

                    <!-- 信息完善度 -->
                    <div class="completion-progress">
                        <div class="progress-label">信息完善度</div>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: completionRate + '%' }"></div>
                        </div>
                        <div class="progress-text">{{ completionRate }}%</div>
                    </div>

                    <!-- 导航菜单 -->
                    <div class="nav-menu">
                        <div v-for="item in menuItems" :key="item.key" class="nav-item"
                            :class="{ active: activeMenu === item.key }" @click="activeMenu = item.key">
                            <i :class="item.icon"></i>
                            <span>{{ item.label }}</span>
                        </div>
                    </div>
                </div>

                <!-- 右侧内容区域 -->
                <div class="content-area">
                    <!-- 公司基础信息 -->
                    <div v-if="activeMenu === 'basic'" class="content-section">
                        <div class="section-header">
                            <h3>公司基础信息</h3>
                        </div>
                        <div class="info-grid">
                            <div class="info-group">
                                <h4>公司基本信息</h4>
                                <div class="info-row">
                                    <span class="label">注册角色：</span>
                                    <span class="value">工程集成商</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">企业全称：</span>
                                    <span class="value">{{ selectedCompany.company }}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">企业简称：</span>
                                    <span class="value">{{ selectedCompany.company.replace('有限公司', '') }}</span>
                                </div>
                            </div>

                            <div class="info-group">
                                <h4>联系人信息</h4>
                                <div class="info-row">
                                    <span class="label">姓名：</span>
                                    <span class="value">{{ selectedCompany.contacts || '暂无' }}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">性别：</span>
                                    <span class="value">男</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">电话：</span>
                                    <span class="value">{{ selectedCompany.tel || '暂无' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 公司注册信息 -->
                    <div v-if="activeMenu === 'registration'" class="content-section">
                        <div class="section-header">
                            <h3>公司注册信息</h3>
                        </div>
                        <div class="info-grid">
                            <div class="info-group">
                                <div class="info-row">
                                    <span class="label">统一社会信用代码：</span>
                                    <span class="value">91440101MA5XXXXXXX</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">注册地址：</span>
                                    <span class="value">广东省广州市天河区</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">注册资本：</span>
                                    <span class="value">1000万元</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">成立日期：</span>
                                    <span class="value">2015-03-15</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">法定代表人：</span>
                                    <span class="value">张三</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 主营业务系统 -->
                    <div v-if="activeMenu === 'business'" class="content-section">
                        <div class="section-header">
                            <h3>主营业务系统</h3>
                        </div>
                        <div class="business-systems">
                            <div class="system-item">
                                <div class="system-name">无纸化会议系统</div>
                                <div class="system-desc">{{ selectedCompany.demandDetails || '暂无详情信息' }}</div>
                            </div>
                            <div class="system-item">
                                <div class="system-name">音视频集成系统</div>
                                <div class="system-desc">专业的音视频会议系统集成服务</div>
                            </div>
                        </div>
                    </div>

                    <!-- 业务覆盖区域 -->
                    <div v-if="activeMenu === 'coverage'" class="content-section">
                        <div class="section-header">
                            <h3>业务覆盖区域</h3>
                        </div>
                        <div class="coverage-area">
                            <div class="area-item">广东省</div>
                            <div class="area-item">广州市</div>
                            <div class="area-item">深圳市</div>
                            <div class="area-item">东莞市</div>
                            <div class="area-item">佛山市</div>
                        </div>
                    </div>

                    <!-- 企业信息简介 -->
                    <div v-if="activeMenu === 'profile'" class="content-section">
                        <div class="section-header">
                            <h3>企业信息简介</h3>
                        </div>
                        <div class="company-profile">
                            <p>{{ selectedCompany.demandDetails || '暂无企业简介信息' }}</p>
                            <p>公司专注于音视频会议系统集成，为客户提供专业的无纸化会议解决方案。</p>
                        </div>
                    </div>

                    <!-- 公司工程业绩 -->
                    <div v-if="activeMenu === 'performance'" class="content-section">
                        <div class="section-header">
                            <h3>公司工程业绩</h3>
                        </div>
                        <div class="performance-list">
                            <div class="performance-item">
                                <div class="project-name">政府无纸化会议系统项目</div>
                                <div class="project-desc">40席无纸化系统，含服务器、软件、发言表决等</div>
                                <div class="project-value">项目金额：{{ selectedCompany.price || '40万' }}</div>
                                <div class="project-date">完成时间：{{ selectedCompany.releaseTime }}</div>
                            </div>
                            <div class="performance-item">
                                <div class="project-name">企业会议室音视频系统</div>
                                <div class="project-desc">大型企业会议室音视频集成项目</div>
                                <div class="project-value">项目金额：25万</div>
                                <div class="project-date">完成时间：2023-08-15</div>
                            </div>
                        </div>
                    </div>

                    <!-- 公司资质证书 -->
                    <div v-if="activeMenu === 'certificates'" class="content-section">
                        <div class="section-header">
                            <h3>公司资质证书</h3>
                        </div>
                        <div class="certificates-list">
                            <div class="certificate-item">
                                <div class="cert-name">ISO9001质量管理体系认证</div>
                                <div class="cert-status">有效</div>
                            </div>
                            <div class="certificate-item">
                                <div class="cert-name">信息系统集成及服务资质</div>
                                <div class="cert-status">有效</div>
                            </div>
                            <div class="certificate-item">
                                <div class="cert-name">音视频工程企业资质</div>
                                <div class="cert-status">有效</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ModalWindow>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import ModalWindow from '@/components/ModalWindow.vue'
import type { ConnectedDemand } from './type'

// 定义组件属性
defineProps<{
    visible: boolean
    selectedCompany: ConnectedDemand | null
}>()

// 定义事件
const emit = defineEmits<{
    close: []
}>()

// 当前激活的菜单
const activeMenu = ref('basic')

// 信息完善度
const completionRate = computed(() => {
    return 100 // 可以根据实际数据计算
})

// 导航菜单配置
const menuItems = ref([
    { key: 'basic', label: '公司基础信息', icon: 'layui-icon-user' },
    { key: 'registration', label: '公司注册信息', icon: 'layui-icon-home' },
    { key: 'business', label: '主营业务系统', icon: 'layui-icon-template-1' },
    { key: 'coverage', label: '业务覆盖区域', icon: 'layui-icon-location' },
    { key: 'profile', label: '企业信息简介', icon: 'layui-icon-file' },
    { key: 'performance', label: '公司工程业绩', icon: 'layui-icon-trophy' },
    { key: 'certificates', label: '公司资质证书', icon: 'layui-icon-flag' }
])

// 弹窗按钮配置
const companyDetailButtons = ref([
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
</script>

<style scoped lang="scss">
// 调整弹窗位置
:deep(.layui-layer) {
    left: 30% !important; // 调整左边距，让弹窗向右移动
}

.company-detail {
    height: 100%;
    overflow: hidden;

    .company-layout {
        display: flex;
        height: 100%;

        // 左侧导航
        .sidebar {
            width: 280px;
            background-color: #f8f9fa;
            border-right: 1px solid #e8e8e8;
            padding: 20px;
            overflow-y: auto;

            .company-name {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #e8e8e8;
            }

            .completion-progress {
                margin-bottom: 25px;

                .progress-label {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 8px;
                }

                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background-color: #e8e8e8;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 5px;

                    .progress-fill {
                        height: 100%;
                        background-color: #52c41a;
                        transition: width 0.3s ease;
                    }
                }

                .progress-text {
                    font-size: 12px;
                    color: #52c41a;
                    text-align: right;
                }
            }

            .nav-menu {
                .nav-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 15px;
                    margin-bottom: 5px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #666;

                    i {
                        margin-right: 10px;
                        font-size: 16px;
                        width: 16px;
                    }

                    span {
                        font-size: 14px;
                    }

                    &:hover {
                        background-color: #e6f7ff;
                        color: #1890ff;
                    }

                    &.active {
                        background-color: #1890ff;
                        color: #fff;
                    }
                }
            }
        }

        // 右侧内容区域
        .content-area {
            flex: 1;
            padding: 20px;
            overflow-y: auto;

            .content-section {
                .section-header {
                    margin-bottom: 20px;

                    h3 {
                        font-size: 18px;
                        font-weight: 600;
                        color: #333;
                        margin: 0;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #1890ff;
                    }
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;

                    .info-group {
                        h4 {
                            font-size: 16px;
                            font-weight: 600;
                            color: #333;
                            margin-bottom: 15px;
                            padding-bottom: 8px;
                            border-bottom: 1px solid #e8e8e8;
                        }

                        .info-row {
                            display: flex;
                            align-items: center;
                            margin-bottom: 12px;
                            font-size: 14px;

                            .label {
                                min-width: 120px;
                                color: #666;
                                font-weight: 500;
                            }

                            .value {
                                color: #333;
                                flex: 1;
                            }
                        }
                    }
                }

                .business-systems {
                    .system-item {
                        background-color: #f8f9fa;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 15px;
                        border: 1px solid #e8e8e8;

                        .system-name {
                            font-size: 16px;
                            font-weight: 600;
                            color: #333;
                            margin-bottom: 10px;
                        }

                        .system-desc {
                            color: #666;
                            line-height: 1.6;
                        }
                    }
                }

                .coverage-area {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;

                    .area-item {
                        background-color: #e6f7ff;
                        color: #1890ff;
                        padding: 8px 15px;
                        border-radius: 20px;
                        font-size: 14px;
                        border: 1px solid #91d5ff;
                    }
                }

                .company-profile {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #e8e8e8;

                    p {
                        color: #333;
                        line-height: 1.8;
                        margin-bottom: 15px;

                        &:last-child {
                            margin-bottom: 0;
                        }
                    }
                }

                .performance-list {
                    .performance-item {
                        background-color: #f8f9fa;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 15px;
                        border: 1px solid #e8e8e8;

                        .project-name {
                            font-size: 16px;
                            font-weight: 600;
                            color: #333;
                            margin-bottom: 10px;
                        }

                        .project-desc {
                            color: #666;
                            line-height: 1.6;
                            margin-bottom: 10px;
                        }

                        .project-value {
                            color: #1890ff;
                            font-weight: 500;
                            margin-bottom: 5px;
                        }

                        .project-date {
                            color: #999;
                            font-size: 12px;
                        }
                    }
                }

                .certificates-list {
                    .certificate-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 15px 20px;
                        background-color: #f8f9fa;
                        border-radius: 8px;
                        margin-bottom: 10px;
                        border: 1px solid #e8e8e8;

                        .cert-name {
                            font-size: 14px;
                            color: #333;
                            font-weight: 500;
                        }

                        .cert-status {
                            background-color: #52c41a;
                            color: #fff;
                            padding: 4px 12px;
                            border-radius: 12px;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
}
</style>