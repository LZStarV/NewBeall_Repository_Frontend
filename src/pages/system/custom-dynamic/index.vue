<template>
    <div class="custom-dynamic-page">
        <div class="page-header">
            <h1>自定义动态</h1>
            <p>配置系统动态消息和通知设置，管理用户界面的各种提示信息</p>
        </div>

        <div class="content-area">
            <lay-row :space="24">
                <!-- 动态配置 -->
                <lay-col :md="16">
                    <lay-card title="动态配置">
                        <div class="toolbar">
                            <lay-button type="primary" @click="showAddDynamicModal">
                                <lay-icon type="layui-icon-add-1" />
                                新建动态
                            </lay-button>
                            <lay-button @click="refreshDynamics">
                                <lay-icon type="layui-icon-refresh-3" />
                                刷新
                            </lay-button>
                            <lay-button @click="batchDelete" :disabled="selectedDynamics.length === 0">
                                <lay-icon type="layui-icon-delete" />
                                批量删除
                            </lay-button>
                            <lay-button @click="exportDynamics">
                                <lay-icon type="layui-icon-export" />
                                导出配置
                            </lay-button>
                        </div>

                        <!-- 筛选器 -->
                        <div class="filter-section">
                            <lay-form :model="filterForm" layout="inline">
                                <lay-form-item label="动态类型">
                                    <lay-select v-model="filterForm.type" placeholder="选择类型">
                                        <lay-select-option value="">全部类型</lay-select-option>
                                        <lay-select-option value="notice">公告通知</lay-select-option>
                                        <lay-select-option value="promotion">营销推广</lay-select-option>
                                        <lay-select-option value="update">功能更新</lay-select-option>
                                        <lay-select-option value="warning">警告提醒</lay-select-option>
                                    </lay-select>
                                </lay-form-item>
                                <lay-form-item label="显示位置">
                                    <lay-select v-model="filterForm.position" placeholder="选择位置">
                                        <lay-select-option value="">全部位置</lay-select-option>
                                        <lay-select-option value="banner">顶部横幅</lay-select-option>
                                        <lay-select-option value="popup">弹窗通知</lay-select-option>
                                        <lay-select-option value="sidebar">侧边栏</lay-select-option>
                                        <lay-select-option value="floating">浮动提示</lay-select-option>
                                    </lay-select>
                                </lay-form-item>
                                <lay-form-item label="状态">
                                    <lay-select v-model="filterForm.status" placeholder="选择状态">
                                        <lay-select-option value="">全部状态</lay-select-option>
                                        <lay-select-option value="enabled">启用</lay-select-option>
                                        <lay-select-option value="disabled">禁用</lay-select-option>
                                        <lay-select-option value="expired">已过期</lay-select-option>
                                    </lay-select>
                                </lay-form-item>
                                <lay-form-item>
                                    <lay-button type="primary" @click="applyFilter">筛选</lay-button>
                                    <lay-button @click="resetFilter">重置</lay-button>
                                </lay-form-item>
                            </lay-form>
                        </div>

                        <div class="dynamics-list">
                            <lay-checkbox-group v-model="selectedDynamics">
                                <div v-for="dynamic in filteredDynamics" :key="dynamic.id" class="dynamic-item">
                                    <div class="dynamic-header">
                                        <div class="dynamic-select">
                                            <lay-checkbox :value="dynamic.id" />
                                        </div>
                                        <div class="dynamic-type">
                                            <lay-tag :type="getTypeColor(dynamic.type)">{{ getTypeName(dynamic.type)
                                                }}</lay-tag>
                                        </div>
                                        <div class="dynamic-status">
                                            <lay-tag :type="getStatusColor(dynamic)">{{ getStatusText(dynamic)
                                                }}</lay-tag>
                                        </div>
                                        <div class="dynamic-actions">
                                            <lay-switch v-model="dynamic.enabled" @change="toggleDynamic(dynamic)"
                                                :disabled="isDynamicExpired(dynamic)" />
                                            <lay-button size="xs" @click="previewDynamic(dynamic)">预览</lay-button>
                                            <lay-button size="xs" @click="editDynamic(dynamic)">编辑</lay-button>
                                            <lay-button size="xs" @click="copyDynamic(dynamic)">复制</lay-button>
                                            <lay-button size="xs" type="danger"
                                                @click="deleteDynamic(dynamic)">删除</lay-button>
                                        </div>
                                    </div>

                                    <div class="dynamic-content">
                                        <h4>{{ dynamic.title }}</h4>
                                        <p>{{ dynamic.content }}</p>
                                        <div v-if="dynamic.linkUrl" class="dynamic-link">
                                            <lay-icon type="layui-icon-link" />
                                            <span>链接: {{ dynamic.linkUrl }}</span>
                                        </div>
                                    </div>

                                    <div class="dynamic-settings">
                                        <div class="setting-item">
                                            <span class="label">显示位置：</span>
                                            <span class="value">{{ getPositionName(dynamic.position) }}</span>
                                        </div>
                                        <div class="setting-item">
                                            <span class="label">显示时间：</span>
                                            <span class="value">{{ dynamic.startTime }} ~ {{ dynamic.endTime }}</span>
                                        </div>
                                        <div class="setting-item">
                                            <span class="label">目标用户：</span>
                                            <span class="value">{{ getTargetName(dynamic.target) }}</span>
                                        </div>
                                        <div class="setting-item">
                                            <span class="label">优先级：</span>
                                            <span class="value">{{ getPriorityName(dynamic.priority) }}</span>
                                        </div>
                                    </div>

                                    <div class="dynamic-stats">
                                        <span>创建时间：{{ dynamic.createTime }}</span>
                                        <span>创建人：{{ dynamic.creator }}</span>
                                        <span>浏览次数：{{ dynamic.viewCount }}</span>
                                        <span>点击次数：{{ dynamic.clickCount }}</span>
                                        <span>转化率：{{ getConversionRate(dynamic) }}%</span>
                                    </div>
                                </div>
                            </lay-checkbox-group>

                            <!-- 空状态 -->
                            <div v-if="filteredDynamics.length === 0" class="empty-state">
                                <lay-icon type="layui-icon-face-cry" />
                                <h3>暂无动态配置</h3>
                                <p>{{ filterForm.type || filterForm.position || filterForm.status ? '没有符合条件的动态配置' :
                                    '还没有创建任何动态配置' }}</p>
                                <lay-button type="primary" @click="showAddDynamicModal"
                                    v-if="!filterForm.type && !filterForm.position && !filterForm.status">
                                    立即创建
                                </lay-button>
                            </div>
                        </div>

                        <!-- 分页 -->
                        <div class="pagination-wrapper" v-if="pagination.total > pagination.pageSize">
                            <lay-page v-model="pagination.current" :total="pagination.total"
                                :limit="pagination.pageSize" :pages="5" :prev="true" :next="true" :jump="true"
                                :limits="[10, 20, 30, 50]" @change="handlePageChange" />
                        </div>
                    </lay-card>
                </lay-col>

                <!-- 预览区域 -->
                <lay-col :md="8">
                    <lay-card title="实时预览">
                        <div class="preview-container">
                            <div class="preview-header">
                                <h4>动态效果预览</h4>
                                <p>查看动态在不同位置的显示效果</p>
                                <div class="preview-controls">
                                    <lay-button size="sm" @click="refreshPreview">
                                        <lay-icon type="layui-icon-refresh-3" />
                                        刷新预览
                                    </lay-button>
                                </div>
                            </div>

                            <!-- 顶部横幅预览 -->
                            <div class="preview-section">
                                <h5>顶部横幅</h5>
                                <div class="banner-preview">
                                    <div v-for="banner in getBannerDynamics()" :key="banner.id" class="banner-item"
                                        :class="banner.type">
                                        <lay-icon :type="getTypeIcon(banner.type)" />
                                        <span class="banner-text">{{ banner.title }}</span>
                                        <lay-button v-if="banner.linkUrl" size="xs"
                                            class="banner-button">查看详情</lay-button>
                                    </div>
                                    <div v-if="getBannerDynamics().length === 0" class="preview-empty">
                                        <span>暂无横幅动态</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 弹窗预览 -->
                            <div class="preview-section">
                                <h5>弹窗通知</h5>
                                <div class="popup-preview">
                                    <div v-for="popup in getPopupDynamics()" :key="popup.id" class="popup-item"
                                        :class="popup.type">
                                        <div class="popup-header">
                                            <lay-icon :type="getTypeIcon(popup.type)" />
                                            <span>{{ popup.title }}</span>
                                            <lay-icon type="layui-icon-close" class="close-icon" />
                                        </div>
                                        <div class="popup-content">{{ popup.content }}</div>
                                        <div class="popup-actions" v-if="popup.linkUrl">
                                            <lay-button size="sm" type="primary">确定</lay-button>
                                            <lay-button size="sm">取消</lay-button>
                                        </div>
                                    </div>
                                    <div v-if="getPopupDynamics().length === 0" class="preview-empty">
                                        <span>暂无弹窗动态</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 侧边栏预览 -->
                            <div class="preview-section">
                                <h5>侧边栏通知</h5>
                                <div class="sidebar-preview">
                                    <div v-for="sidebar in getSidebarDynamics()" :key="sidebar.id" class="sidebar-item"
                                        :class="sidebar.type">
                                        <lay-icon :type="getTypeIcon(sidebar.type)" />
                                        <div class="sidebar-text">
                                            <div class="sidebar-title">{{ sidebar.title }}</div>
                                            <div class="sidebar-content">{{ sidebar.content }}</div>
                                            <div class="sidebar-time">{{ formatTime(sidebar.createTime) }}</div>
                                        </div>
                                        <div class="sidebar-actions">
                                            <lay-icon type="layui-icon-close" />
                                        </div>
                                    </div>
                                    <div v-if="getSidebarDynamics().length === 0" class="preview-empty">
                                        <span>暂无侧边栏动态</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 浮动提示预览 -->
                            <div class="preview-section">
                                <h5>浮动提示</h5>
                                <div class="floating-preview">
                                    <div v-for="floating in getFloatingDynamics()" :key="floating.id"
                                        class="floating-item" :class="floating.type">
                                        <lay-icon :type="getTypeIcon(floating.type)" />
                                        <span>{{ floating.title }}</span>
                                    </div>
                                    <div v-if="getFloatingDynamics().length === 0" class="preview-empty">
                                        <span>暂无浮动提示</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </lay-card>

                    <!-- 统计信息 -->
                    <lay-card title="统计信息" style="margin-top: 24px;">
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <lay-icon type="layui-icon-chart" />
                                </div>
                                <div class="stat-info">
                                    <div class="stat-number">{{ getTotalDynamics() }}</div>
                                    <div class="stat-label">总动态数</div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon active">
                                    <lay-icon type="layui-icon-ok" />
                                </div>
                                <div class="stat-info">
                                    <div class="stat-number">{{ getActiveDynamics() }}</div>
                                    <div class="stat-label">启用中</div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon warning">
                                    <lay-icon type="layui-icon-time" />
                                </div>
                                <div class="stat-info">
                                    <div class="stat-number">{{ getExpiredDynamics() }}</div>
                                    <div class="stat-label">已过期</div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon success">
                                    <lay-icon type="layui-icon-rate" />
                                </div>
                                <div class="stat-info">
                                    <div class="stat-number">{{ getAverageClickRate() }}%</div>
                                    <div class="stat-label">平均点击率</div>
                                </div>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>
            </lay-row>
        </div>

        <!-- 添加/编辑动态弹窗 -->
        <lay-layer v-model="showDynamicModal" :title="dynamicModalTitle" :area="['800px', '700px']">
            <div class="dynamic-modal-content">
                <lay-form :model="dynamicForm" ref="dynamicFormRef" label-width="120px">
                    <lay-row :space="16">
                        <lay-col :md="12">
                            <lay-form-item label="动态类型" prop="type" required>
                                <lay-select v-model="dynamicForm.type">
                                    <lay-select-option value="notice">公告通知</lay-select-option>
                                    <lay-select-option value="promotion">营销推广</lay-select-option>
                                    <lay-select-option value="update">功能更新</lay-select-option>
                                    <lay-select-option value="warning">警告提醒</lay-select-option>
                                </lay-select>
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="12">
                            <lay-form-item label="显示位置" prop="position" required>
                                <lay-select v-model="dynamicForm.position">
                                    <lay-select-option value="banner">顶部横幅</lay-select-option>
                                    <lay-select-option value="popup">弹窗通知</lay-select-option>
                                    <lay-select-option value="sidebar">侧边栏</lay-select-option>
                                    <lay-select-option value="floating">浮动提示</lay-select-option>
                                </lay-select>
                            </lay-form-item>
                        </lay-col>
                    </lay-row>

                    <lay-form-item label="标题" prop="title" required>
                        <lay-input v-model="dynamicForm.title" placeholder="请输入动态标题" maxlength="50" />
                    </lay-form-item>

                    <lay-form-item label="内容" prop="content" required>
                        <lay-textarea v-model="dynamicForm.content" placeholder="请输入动态内容" :rows="4" maxlength="200" />
                    </lay-form-item>

                    <lay-row :space="16">
                        <lay-col :md="12">
                            <lay-form-item label="开始时间" prop="startTime" required>
                                <lay-date-picker v-model="dynamicForm.startTime" type="datetime" />
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="12">
                            <lay-form-item label="结束时间" prop="endTime" required>
                                <lay-date-picker v-model="dynamicForm.endTime" type="datetime" />
                            </lay-form-item>
                        </lay-col>
                    </lay-row>

                    <lay-row :space="16">
                        <lay-col :md="12">
                            <lay-form-item label="优先级" prop="priority">
                                <lay-select v-model="dynamicForm.priority">
                                    <lay-select-option value="low">低</lay-select-option>
                                    <lay-select-option value="normal">普通</lay-select-option>
                                    <lay-select-option value="high">高</lay-select-option>
                                    <lay-select-option value="urgent">紧急</lay-select-option>
                                </lay-select>
                            </lay-form-item>
                        </lay-col>
                        <lay-col :md="12">
                            <lay-form-item label="显示频率" prop="frequency">
                                <lay-select v-model="dynamicForm.frequency">
                                    <lay-select-option value="once">仅显示一次</lay-select-option>
                                    <lay-select-option value="daily">每日显示</lay-select-option>
                                    <lay-select-option value="always">始终显示</lay-select-option>
                                </lay-select>
                            </lay-form-item>
                        </lay-col>
                    </lay-row>

                    <lay-form-item label="目标用户" prop="target">
                        <lay-checkbox-group v-model="dynamicForm.target">
                            <lay-checkbox value="all">所有用户</lay-checkbox>
                            <lay-checkbox value="admin">管理员</lay-checkbox>
                            <lay-checkbox value="sales">销售人员</lay-checkbox>
                            <lay-checkbox value="designer">设计师</lay-checkbox>
                            <lay-checkbox value="new">新用户</lay-checkbox>
                            <lay-checkbox value="vip">VIP用户</lay-checkbox>
                        </lay-checkbox-group>
                    </lay-form-item>

                    <lay-form-item label="链接地址">
                        <lay-input v-model="dynamicForm.linkUrl" placeholder="点击动态后跳转的链接（可选）" />
                    </lay-form-item>

                    <lay-form-item label="样式设置">
                        <lay-row :space="16">
                            <lay-col :md="8">
                                <lay-form-item label="背景色">
                                    <lay-input v-model="dynamicForm.backgroundColor" placeholder="#ffffff" />
                                </lay-form-item>
                            </lay-col>
                            <lay-col :md="8">
                                <lay-form-item label="文字色">
                                    <lay-input v-model="dynamicForm.textColor" placeholder="#333333" />
                                </lay-form-item>
                            </lay-col>
                            <lay-col :md="8">
                                <lay-form-item label="边框色">
                                    <lay-input v-model="dynamicForm.borderColor" placeholder="#e0e0e0" />
                                </lay-form-item>
                            </lay-col>
                        </lay-row>
                    </lay-form-item>

                    <lay-form-item label="高级设置">
                        <lay-checkbox-group v-model="dynamicForm.features">
                            <lay-checkbox value="closable">可关闭</lay-checkbox>
                            <lay-checkbox value="animation">显示动画</lay-checkbox>
                            <lay-checkbox value="sound">声音提示</lay-checkbox>
                            <lay-checkbox value="sticky">置顶显示</lay-checkbox>
                        </lay-checkbox-group>
                    </lay-form-item>

                    <lay-form-item label="状态">
                        <lay-radio-group v-model="dynamicForm.enabled">
                            <lay-radio :value="true">立即启用</lay-radio>
                            <lay-radio :value="false">暂不启用</lay-radio>
                        </lay-radio-group>
                    </lay-form-item>
                </lay-form>

                <div class="modal-actions">
                    <lay-button type="primary" @click="saveDynamic">
                        <lay-icon type="layui-icon-ok" />
                        保存
                    </lay-button>
                    <lay-button @click="saveDynamicAndPreview">
                        <lay-icon type="layui-icon-about" />
                        保存并预览
                    </lay-button>
                    <lay-button @click="closeDynamicModal">
                        <lay-icon type="layui-icon-close" />
                        取消
                    </lay-button>
                </div>
            </div>
        </lay-layer>

        <!-- 预览弹窗 -->
        <lay-layer v-model="showPreviewModal" title="动态预览" :area="['600px', '400px']">
            <div class="preview-modal-content" v-if="previewDynamic">
                <div class="preview-demo" :class="previewDynamic.position">
                    <div v-if="previewDynamic.position === 'banner'" class="banner-demo" :class="previewDynamic.type">
                        <lay-icon :type="getTypeIcon(previewDynamic.type)" />
                        <span>{{ previewDynamic.title }}</span>
                        <lay-button v-if="previewDynamic.linkUrl" size="xs">查看详情</lay-button>
                    </div>

                    <div v-if="previewDynamic.position === 'popup'" class="popup-demo" :class="previewDynamic.type">
                        <div class="popup-header">
                            <lay-icon :type="getTypeIcon(previewDynamic.type)" />
                            <span>{{ previewDynamic.title }}</span>
                            <lay-icon type="layui-icon-close" />
                        </div>
                        <div class="popup-content">{{ previewDynamic.content }}</div>
                        <div class="popup-actions" v-if="previewDynamic.linkUrl">
                            <lay-button size="sm" type="primary">确定</lay-button>
                            <lay-button size="sm">取消</lay-button>
                        </div>
                    </div>

                    <div v-if="previewDynamic.position === 'sidebar'" class="sidebar-demo" :class="previewDynamic.type">
                        <lay-icon :type="getTypeIcon(previewDynamic.type)" />
                        <div class="sidebar-text">
                            <div class="sidebar-title">{{ previewDynamic.title }}</div>
                            <div class="sidebar-content">{{ previewDynamic.content }}</div>
                        </div>
                    </div>

                    <div v-if="previewDynamic.position === 'floating'" class="floating-demo"
                        :class="previewDynamic.type">
                        <lay-icon :type="getTypeIcon(previewDynamic.type)" />
                        <span>{{ previewDynamic.title }}</span>
                    </div>
                </div>

                <div class="preview-info">
                    <h4>预览信息</h4>
                    <p><strong>类型：</strong>{{ getTypeName(previewDynamic.type) }}</p>
                    <p><strong>位置：</strong>{{ getPositionName(previewDynamic.position) }}</p>
                    <p><strong>目标用户：</strong>{{ getTargetName(previewDynamic.target) }}</p>
                    <p><strong>显示时间：</strong>{{ previewDynamic.startTime }} ~ {{ previewDynamic.endTime }}</p>
                </div>
            </div>
        </lay-layer>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';

// 响应式数据
const showDynamicModal = ref(false);
const showPreviewModal = ref(false);
const isEditMode = ref(false);
const dynamicFormRef = ref();
const selectedDynamics = ref([]);


// 筛选表单
const filterForm = reactive({
    type: '',
    position: '',
    status: ''
});

// 分页配置
const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0
});

// 动态表单
const dynamicForm = reactive({
    id: '',
    type: 'notice',
    position: 'banner',
    title: '',
    content: '',
    startTime: '',
    endTime: '',
    target: ['all'],
    linkUrl: '',
    priority: 'normal',
    frequency: 'always',
    backgroundColor: '',
    textColor: '',
    borderColor: '',
    features: [],
    enabled: true
});

// 动态数据
const dynamicsList = ref([
    {
        id: 1,
        type: 'notice',
        position: 'banner',
        title: '系统维护通知',
        content: '系统将于今晚23:00-24:00进行维护升级，期间可能影响正常使用',
        startTime: '2024-01-20 09:00',
        endTime: '2024-01-21 09:00',
        target: ['all'],
        linkUrl: '',
        priority: 'high',
        frequency: 'always',
        enabled: true,
        creator: '管理员',
        createTime: '2024-01-20 08:30',
        viewCount: 145,
        clickCount: 23
    },
    {
        id: 2,
        type: 'promotion',
        position: 'popup',
        title: '新功能上线',
        content: 'AI智能报价助手正式上线，帮您快速生成专业报价单',
        startTime: '2024-01-19 10:00',
        endTime: '2024-01-25 18:00',
        target: ['sales'],
        linkUrl: '/features/ai-quote',
        priority: 'normal',
        frequency: 'once',
        enabled: true,
        creator: '产品经理',
        createTime: '2024-01-19 09:15',
        viewCount: 89,
        clickCount: 34
    },
    {
        id: 3,
        type: 'update',
        position: 'sidebar',
        title: '版本更新说明',
        content: 'v2.1.0版本已发布，新增多项实用功能，优化用户体验',
        startTime: '2024-01-18 14:00',
        endTime: '2024-01-22 14:00',
        target: ['all'],
        linkUrl: '/changelog',
        priority: 'low',
        frequency: 'daily',
        enabled: false,
        creator: '开发团队',
        createTime: '2024-01-18 13:45',
        viewCount: 67,
        clickCount: 12
    },
    {
        id: 4,
        type: 'warning',
        position: 'floating',
        title: '账户余额不足',
        content: '您的账户余额不足，请及时充值以确保服务正常使用',
        startTime: '2024-01-20 00:00',
        endTime: '2024-01-30 23:59',
        target: ['vip'],
        linkUrl: '/billing/recharge',
        priority: 'urgent',
        frequency: 'always',
        enabled: true,
        creator: '系统',
        createTime: '2024-01-20 10:00',
        viewCount: 25,
        clickCount: 8
    }
]);

// 计算属性
const dynamicModalTitle = computed(() => {
    return isEditMode.value ? '编辑动态' : '新建动态';
});

const filteredDynamics = computed(() => {
    let filtered = dynamicsList.value;

    if (filterForm.type) {
        filtered = filtered.filter(d => d.type === filterForm.type);
    }

    if (filterForm.position) {
        filtered = filtered.filter(d => d.position === filterForm.position);
    }

    if (filterForm.status) {
        if (filterForm.status === 'enabled') {
            filtered = filtered.filter(d => d.enabled && !isDynamicExpired(d));
        } else if (filterForm.status === 'disabled') {
            filtered = filtered.filter(d => !d.enabled);
        } else if (filterForm.status === 'expired') {
            filtered = filtered.filter(d => isDynamicExpired(d));
        }
    }

    pagination.total = filtered.length;
    return filtered;
});

// 辅助方法
const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
        'notice': 'primary',
        'promotion': 'normal',
        'update': 'warm',
        'warning': 'danger'
    };
    return colorMap[type] || 'normal';
};

const getTypeName = (type: string) => {
    const nameMap: Record<string, string> = {
        'notice': '公告通知',
        'promotion': '营销推广',
        'update': '功能更新',
        'warning': '警告提醒'
    };
    return nameMap[type] || type;
};

const getTypeIcon = (type: string) => {
    const iconMap: Record<string, string> = {
        'notice': 'layui-icon-notice',
        'promotion': 'layui-icon-gift',
        'update': 'layui-icon-release',
        'warning': 'layui-icon-close-fill'
    };
    return iconMap[type] || 'layui-icon-notice';
};

const getPositionName = (position: string) => {
    const positionMap: Record<string, string> = {
        'banner': '顶部横幅',
        'popup': '弹窗通知',
        'sidebar': '侧边栏',
        'floating': '浮动提示'
    };
    return positionMap[position] || position;
};

const getTargetName = (target: string[] | string) => {
    const targetArray = Array.isArray(target) ? target : [target];
    const targetMap: Record<string, string> = {
        'all': '所有用户',
        'admin': '管理员',
        'sales': '销售人员',
        'designer': '设计师',
        'new': '新用户',
        'vip': 'VIP用户'
    };
    return targetArray.map(t => targetMap[t] || t).join(', ');
};

const getPriorityName = (priority: string) => {
    const priorityMap: Record<string, string> = {
        'low': '低',
        'normal': '普通',
        'high': '高',
        'urgent': '紧急'
    };
    return priorityMap[priority] || priority;
};

const isDynamicExpired = (dynamic: any) => {
    return new Date(dynamic.endTime) < new Date();
};

const getStatusColor = (dynamic: any) => {
    if (isDynamicExpired(dynamic)) return 'warm';
    return dynamic.enabled ? 'normal' : 'danger';
};

const getStatusText = (dynamic: any) => {
    if (isDynamicExpired(dynamic)) return '已过期';
    return dynamic.enabled ? '启用中' : '已禁用';
};

const getConversionRate = (dynamic: any) => {
    if (dynamic.viewCount === 0) return 0;
    return Math.round((dynamic.clickCount / dynamic.viewCount) * 100);
};

const formatTime = (time: string) => {
    return new Date(time).toLocaleString();
};

// 获取不同位置的动态
const getBannerDynamics = () => {
    return dynamicsList.value.filter(d => d.position === 'banner' && d.enabled && !isDynamicExpired(d));
};

const getPopupDynamics = () => {
    return dynamicsList.value.filter(d => d.position === 'popup' && d.enabled && !isDynamicExpired(d));
};

const getSidebarDynamics = () => {
    return dynamicsList.value.filter(d => d.position === 'sidebar' && d.enabled && !isDynamicExpired(d));
};

const getFloatingDynamics = () => {
    return dynamicsList.value.filter(d => d.position === 'floating' && d.enabled && !isDynamicExpired(d));
};

// 统计方法
const getTotalDynamics = () => dynamicsList.value.length;
const getActiveDynamics = () => dynamicsList.value.filter(d => d.enabled && !isDynamicExpired(d)).length;
const getExpiredDynamics = () => dynamicsList.value.filter(d => isDynamicExpired(d)).length;
const getAverageClickRate = () => {
    const totalViews = dynamicsList.value.reduce((sum, d) => sum + d.viewCount, 0);
    const totalClicks = dynamicsList.value.reduce((sum, d) => sum + d.clickCount, 0);
    return totalViews ? Math.round((totalClicks / totalViews) * 100) : 0;
};

// 方法实现
const showAddDynamicModal = () => {
    isEditMode.value = false;
    resetDynamicForm();
    showDynamicModal.value = true;
};

const resetDynamicForm = () => {
    Object.assign(dynamicForm, {
        id: '',
        type: 'notice',
        position: 'banner',
        title: '',
        content: '',
        startTime: '',
        endTime: '',
        target: ['all'],
        linkUrl: '',
        priority: 'normal',
        frequency: 'always',
        backgroundColor: '',
        textColor: '',
        borderColor: '',
        features: [],
        enabled: true
    });
};

const closeDynamicModal = () => {
    showDynamicModal.value = false;
    resetDynamicForm();
};

const saveDynamic = () => {
    console.log('保存动态:', dynamicForm);
    closeDynamicModal();
};

const saveDynamicAndPreview = () => {
    console.log('保存并预览动态:', dynamicForm);
    // 这里可以先保存，然后触发预览
    previewDynamic.value = { ...dynamicForm };
    showPreviewModal.value = true;
};

const editDynamic = (dynamic: any) => {
    isEditMode.value = true;
    Object.assign(dynamicForm, dynamic);
    showDynamicModal.value = true;
};

const copyDynamic = (dynamic: any) => {
    isEditMode.value = false;
    Object.assign(dynamicForm, { ...dynamic, id: '', title: dynamic.title + ' (副本)' });
    showDynamicModal.value = true;
};

const previewDynamic = (dynamic: any) => {
    previewDynamic.value = dynamic;
    showPreviewModal.value = true;
};

const deleteDynamic = (dynamic: any) => {
    console.log('删除动态:', dynamic);
};

const toggleDynamic = (dynamic: any) => {
    console.log('切换动态状态:', dynamic);
};

const refreshDynamics = () => {
    console.log('刷新动态列表');
};

const batchDelete = () => {
    console.log('批量删除动态:', selectedDynamics.value);
};

const exportDynamics = () => {
    console.log('导出动态配置');
};

const applyFilter = () => {
    console.log('应用筛选:', filterForm);
};

const resetFilter = () => {
    Object.assign(filterForm, {
        type: '',
        position: '',
        status: ''
    });
};

const refreshPreview = () => {
    console.log('刷新预览');
};

const handlePageChange = (page: any) => {
    pagination.current = page.current;
    pagination.pageSize = page.limit;
};
</script>

<style scoped lang="scss">
.custom-dynamic-page {
    padding: 24px;
}

.page-header {
    margin-bottom: 32px;

    h1 {
        margin: 0;
        color: #333;
        font-size: 28px;
        font-weight: 600;
    }

    p {
        margin: 8px 0 0 0;
        color: #666;
        font-size: 16px;
    }
}

.toolbar {
    margin-bottom: 20px;
    display: flex;
    gap: 8px;
}

.filter-section {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
}

.dynamics-list {
    .dynamic-item {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 16px;
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .dynamic-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;

            .dynamic-select {
                flex-shrink: 0;
            }

            .dynamic-type {
                flex-shrink: 0;
            }

            .dynamic-status {
                flex-shrink: 0;
            }

            .dynamic-actions {
                margin-left: auto;
                display: flex;
                align-items: center;
                gap: 8px;
            }
        }

        .dynamic-content {
            margin-bottom: 16px;

            h4 {
                margin: 0 0 8px 0;
                color: #333;
                font-size: 16px;
                font-weight: 600;
            }

            p {
                margin: 0 0 8px 0;
                color: #666;
                line-height: 1.5;
            }

            .dynamic-link {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 14px;
                color: #409eff;

                .layui-icon {
                    font-size: 12px;
                }
            }
        }

        .dynamic-settings {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
            margin-bottom: 12px;

            .setting-item {
                .label {
                    font-size: 12px;
                    color: #999;
                    font-weight: 500;
                }

                .value {
                    font-size: 14px;
                    color: #333;
                    margin-left: 4px;
                }
            }
        }

        .dynamic-stats {
            display: flex;
            gap: 20px;
            font-size: 12px;
            color: #999;
            padding-top: 12px;
            border-top: 1px solid #f0f0f0;
        }
    }
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #999;

    .layui-icon {
        font-size: 64px;
        margin-bottom: 16px;
        display: block;
        opacity: 0.5;
    }

    h3 {
        margin: 0 0 8px 0;
        color: #666;
        font-size: 18px;
    }

    p {
        margin: 0 0 20px 0;
        font-size: 14px;
        line-height: 1.5;
    }
}

.pagination-wrapper {
    margin-top: 24px;
    text-align: center;
}

.preview-container {
    .preview-header {
        text-align: center;
        margin-bottom: 24px;

        h4 {
            margin: 0 0 8px 0;
            color: #333;
            font-size: 16px;
        }

        p {
            margin: 0 0 12px 0;
            font-size: 14px;
            color: #666;
        }

        .preview-controls {
            display: flex;
            justify-content: center;
        }
    }
}

.preview-section {
    margin-bottom: 24px;

    h5 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 14px;
        font-weight: 600;
        border-left: 3px solid #409eff;
        padding-left: 8px;
    }
}

.banner-preview {
    .banner-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        border-radius: 4px;
        margin-bottom: 8px;
        font-size: 14px;

        &.notice {
            background: #e6f7ff;
            border: 1px solid #91d5ff;
            color: #1890ff;
        }

        &.promotion {
            background: #fff2e8;
            border: 1px solid #ffbb96;
            color: #fa8c16;
        }

        &.update {
            background: #f6ffed;
            border: 1px solid #b7eb8f;
            color: #52c41a;
        }

        &.warning {
            background: #fff1f0;
            border: 1px solid #ffa39e;
            color: #f5222d;
        }

        .banner-text {
            flex: 1;
            margin: 0 12px;
        }

        .banner-button {
            flex-shrink: 0;
        }
    }
}

.popup-preview {
    .popup-item {
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

        .popup-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            font-weight: 600;

            .close-icon {
                cursor: pointer;
                opacity: 0.6;

                &:hover {
                    opacity: 1;
                }
            }
        }

        .popup-content {
            font-size: 14px;
            color: #666;
            line-height: 1.5;
            margin-bottom: 12px;
        }

        .popup-actions {
            text-align: right;

            .lay-btn+.lay-btn {
                margin-left: 8px;
            }
        }
    }
}

.sidebar-preview {
    .sidebar-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        margin-bottom: 8px;
        border-left: 3px solid #409eff;

        .sidebar-text {
            flex: 1;

            .sidebar-title {
                font-size: 14px;
                font-weight: 600;
                color: #333;
                margin-bottom: 4px;
            }

            .sidebar-content {
                font-size: 12px;
                color: #666;
                line-height: 1.4;
                margin-bottom: 4px;
            }

            .sidebar-time {
                font-size: 11px;
                color: #999;
            }
        }

        .sidebar-actions {
            flex-shrink: 0;

            .layui-icon {
                cursor: pointer;
                opacity: 0.6;

                &:hover {
                    opacity: 1;
                }
            }
        }
    }
}

.floating-preview {
    .floating-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        margin: 4px;

        &.notice {
            background: #e6f7ff;
            color: #1890ff;
        }

        &.promotion {
            background: #fff2e8;
            color: #fa8c16;
        }

        &.update {
            background: #f6ffed;
            color: #52c41a;
        }

        &.warning {
            background: #fff1f0;
            color: #f5222d;
        }
    }
}

.preview-empty {
    text-align: center;
    padding: 20px;
    color: #999;
    font-size: 14px;
    border: 1px dashed #e0e0e0;
    border-radius: 4px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    .stat-item {
        display: flex;
        align-items: center;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;

        .stat-icon {
            width: 40px;
            height: 40px;
            background: #409eff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;

            &.active {
                background: #52c41a;
            }

            &.warning {
                background: #fa8c16;
            }

            &.success {
                background: #13c2c2;
            }

            .layui-icon {
                color: white;
                font-size: 16px;
            }
        }

        .stat-info {
            .stat-number {
                font-size: 20px;
                font-weight: bold;
                color: #333;
                line-height: 1;
                margin-bottom: 4px;
            }

            .stat-label {
                font-size: 12px;
                color: #666;
            }
        }
    }
}

.dynamic-modal-content,
.preview-modal-content {
    padding: 20px;
}

.preview-demo {
    margin-bottom: 20px;

    .banner-demo,
    .popup-demo,
    .sidebar-demo,
    .floating-demo {
        border-radius: 6px;
        padding: 12px;
    }

    .banner-demo {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #e6f7ff;
        border: 1px solid #91d5ff;

        &.promotion {
            background: #fff2e8;
            border-color: #ffbb96;
        }

        &.update {
            background: #f6ffed;
            border-color: #b7eb8f;
        }

        &.warning {
            background: #fff1f0;
            border-color: #ffa39e;
        }
    }

    .popup-demo {
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

        .popup-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .popup-actions {
            text-align: right;
            margin-top: 12px;
        }
    }

    .sidebar-demo {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        background: #f8f9fa;
        border-left: 3px solid #409eff;
    }

    .floating-demo {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #e6f7ff;
        border-radius: 20px;
    }
}

.preview-info {
    padding: 16px;
    background: #f8f9fa;
    border-radius: 6px;

    h4 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 14px;
    }

    p {
        margin: 4px 0;
        font-size: 13px;
        color: #666;
    }
}

.modal-actions {
    text-align: right;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e0e0e0;

    .lay-btn+.lay-btn {
        margin-left: 8px;
    }
}
</style>
