<template>
    <div class="business-log-page">
        <div class="page-header">
            <h1>业务日志</h1>
            <p>查看系统业务操作记录和数据变更日志，监控业务活动和安全审计</p>
        </div>

        <div class="content-area">
            <!-- 统计概览 -->
            <lay-row :space="16" class="stats-section">
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon">
                                <lay-icon type="layui-icon-chart" />
                            </div>
                            <div class="stat-info">
                                <h3>今日操作</h3>
                                <span class="stat-number">{{ todayStats.operations }}</span>
                                <span class="stat-trend up">+{{ todayStats.operationsGrowth }}%</span>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon warning">
                                <lay-icon type="layui-icon-close-fill" />
                            </div>
                            <div class="stat-info">
                                <h3>异常操作</h3>
                                <span class="stat-number warning">{{ todayStats.errors }}</span>
                                <span class="stat-trend down">-{{ todayStats.errorsChange }}</span>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon success">
                                <lay-icon type="layui-icon-username" />
                            </div>
                            <div class="stat-info">
                                <h3>活跃用户</h3>
                                <span class="stat-number">{{ todayStats.activeUsers }}</span>
                                <span class="stat-trend up">+{{ todayStats.usersGrowth }}</span>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>
                <lay-col :md="6">
                    <lay-card class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon primary">
                                <lay-icon type="layui-icon-edit" />
                            </div>
                            <div class="stat-info">
                                <h3>数据变更</h3>
                                <span class="stat-number">{{ todayStats.dataChanges }}</span>
                                <span class="stat-trend up">+{{ todayStats.changesGrowth }}%</span>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>
            </lay-row>

            <!-- 操作工具栏 -->
            <lay-card class="toolbar-card">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <lay-button @click="refreshLogs">
                            <lay-icon type="layui-icon-refresh-3" />
                            刷新
                        </lay-button>
                        <lay-button @click="exportLogs">
                            <lay-icon type="layui-icon-export" />
                            导出日志
                        </lay-button>
                        <lay-button @click="cleanOldLogs">
                            <lay-icon type="layui-icon-delete" />
                            清理过期日志
                        </lay-button>
                        <lay-button @click="showLogAnalysis">
                            <lay-icon type="layui-icon-chart-screen" />
                            日志分析
                        </lay-button>
                    </div>
                    <div class="toolbar-right">
                        <lay-input v-model="searchKeyword" placeholder="搜索操作人、对象或描述" :suffix-icon="'layui-icon-search'"
                            @keyup.enter="searchLogs" style="width: 250px;" />
                        <lay-button @click="searchLogs">搜索</lay-button>
                    </div>
                </div>
            </lay-card>

            <!-- 筛选器 -->
            <lay-card class="filter-card">
                <lay-form :model="filterForm" layout="inline">
                    <lay-form-item label="操作模块">
                        <lay-select v-model="filterForm.module" placeholder="选择模块">
                            <lay-select-option value="">全部模块</lay-select-option>
                            <lay-select-option value="user">用户管理</lay-select-option>
                            <lay-select-option value="quote">报价管理</lay-select-option>
                            <lay-select-option value="order">订单管理</lay-select-option>
                            <lay-select-option value="customer">客户管理</lay-select-option>
                            <lay-select-option value="product">产品管理</lay-select-option>
                            <lay-select-option value="system">系统设置</lay-select-option>
                            <lay-select-option value="finance">财务管理</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item label="操作类型">
                        <lay-select v-model="filterForm.operation" placeholder="选择操作">
                            <lay-select-option value="">全部操作</lay-select-option>
                            <lay-select-option value="create">新增</lay-select-option>
                            <lay-select-option value="update">修改</lay-select-option>
                            <lay-select-option value="delete">删除</lay-select-option>
                            <lay-select-option value="view">查看</lay-select-option>
                            <lay-select-option value="export">导出</lay-select-option>
                            <lay-select-option value="import">导入</lay-select-option>
                            <lay-select-option value="approve">审批</lay-select-option>
                            <lay-select-option value="reject">拒绝</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item label="操作结果">
                        <lay-select v-model="filterForm.result" placeholder="选择结果">
                            <lay-select-option value="">全部结果</lay-select-option>
                            <lay-select-option value="success">成功</lay-select-option>
                            <lay-select-option value="failed">失败</lay-select-option>
                            <lay-select-option value="error">错误</lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item label="操作人">
                        <lay-select v-model="filterForm.operator" placeholder="选择操作人" filterable>
                            <lay-select-option value="">全部操作人</lay-select-option>
                            <lay-select-option v-for="user in operatorList" :key="user.id" :value="user.name">
                                {{ user.name }} ({{ user.username }})
                            </lay-select-option>
                        </lay-select>
                    </lay-form-item>
                    <lay-form-item label="操作时间">
                        <lay-date-picker v-model="filterForm.startDate" placeholder="开始日期" />
                        <span style="margin: 0 8px;">至</span>
                        <lay-date-picker v-model="filterForm.endDate" placeholder="结束日期" />
                    </lay-form-item>
                    <lay-form-item label="IP地址">
                        <lay-input v-model="filterForm.ipAddress" placeholder="输入IP地址" />
                    </lay-form-item>
                    <lay-form-item>
                        <lay-button type="primary" @click="applyFilter">筛选</lay-button>
                        <lay-button @click="resetFilter">重置</lay-button>
                        <lay-button @click="saveFilter">保存筛选条件</lay-button>
                    </lay-form-item>
                </lay-form>
            </lay-card>

            <!-- 快速筛选标签 -->
            <lay-card class="quick-filter-card">
                <div class="quick-filters">
                    <span class="filter-label">快速筛选：</span>
                    <lay-button size="sm" :type="quickFilter === 'today' ? 'primary' : 'normal'"
                        @click="setQuickFilter('today')">
                        今天
                    </lay-button>
                    <lay-button size="sm" :type="quickFilter === 'week' ? 'primary' : 'normal'"
                        @click="setQuickFilter('week')">
                        本周
                    </lay-button>
                    <lay-button size="sm" :type="quickFilter === 'month' ? 'primary' : 'normal'"
                        @click="setQuickFilter('month')">
                        本月
                    </lay-button>
                    <lay-button size="sm" :type="quickFilter === 'errors' ? 'primary' : 'normal'"
                        @click="setQuickFilter('errors')">
                        仅错误
                    </lay-button>
                    <lay-button size="sm" :type="quickFilter === 'sensitive' ? 'primary' : 'normal'"
                        @click="setQuickFilter('sensitive')">
                        敏感操作
                    </lay-button>
                </div>
            </lay-card>

            <!-- 日志列表 -->
            <lay-card title="操作日志">
                <div class="table-header">
                    <div class="table-info">
                        <span>共 {{ pagination.total }} 条记录</span>
                        <span>当前第 {{ pagination.current }} / {{ Math.ceil(pagination.total / pagination.pageSize) }}
                            页</span>
                    </div>
                    <div class="table-actions">
                        <lay-button size="sm" @click="toggleColumns">
                            <lay-icon type="layui-icon-cols" />
                            列设置
                        </lay-button>
                    </div>
                </div>

                <lay-table :columns="visibleColumns" :data-source="businessLogs" :pagination="pagination" :even="true"
                    :size="tableSize" :loading="tableLoading">
                    <template #level="{ row }">
                        <lay-tag :type="getLevelTagType(row.level)">{{ getLevelName(row.level) }}</lay-tag>
                    </template>

                    <template #module="{ row }">
                        <div class="module-info">
                            <lay-icon :type="getModuleIcon(row.module)" />
                            <lay-tag :type="getModuleTagType(row.module)">{{ getModuleName(row.module) }}</lay-tag>
                        </div>
                    </template>

                    <template #operation="{ row }">
                        <lay-tag :type="getOperationTagType(row.operation)">{{ getOperationName(row.operation)
                            }}</lay-tag>
                    </template>

                    <template #operator="{ row }">
                        <div class="operator-info">
                            <div class="operator-avatar">
                                <img v-if="row.operatorAvatar" :src="row.operatorAvatar" :alt="row.operator" />
                                <div v-else class="avatar-placeholder">
                                    {{ row.operator.charAt(0) }}
                                </div>
                            </div>
                            <div class="operator-details">
                                <div class="operator-name">{{ row.operator }}</div>
                                <div class="operator-role">{{ row.operatorRole || '未知' }}</div>
                            </div>
                        </div>
                    </template>

                    <template #details="{ row }">
                        <div class="operation-details">
                            <div class="detail-item">
                                <span class="label">对象:</span>
                                <span class="value">{{ row.targetObject }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">描述:</span>
                                <span class="value">{{ row.changeDescription }}</span>
                            </div>
                            <div v-if="row.requestId" class="detail-item">
                                <span class="label">请求ID:</span>
                                <span class="value code">{{ row.requestId }}</span>
                            </div>
                            <div v-if="hasDataChanges(row)" class="change-indicator">
                                <lay-icon type="layui-icon-edit" />
                                <span>包含数据变更</span>
                            </div>
                        </div>
                    </template>

                    <template #location="{ row }">
                        <div class="location-info">
                            <div class="ip-address">
                                <lay-icon type="layui-icon-location" />
                                <span>{{ row.ipAddress }}</span>
                            </div>
                            <div class="user-agent" v-if="row.userAgent">
                                <span>{{ getBrowserInfo(row.userAgent) }}</span>
                            </div>
                            <div class="geo-location" v-if="row.geoLocation">
                                <span>{{ row.geoLocation }}</span>
                            </div>
                        </div>
                    </template>

                    <template #result="{ row }">
                        <div class="result-info">
                            <lay-tag :type="getResultTagType(row.result)">
                                {{ getResultName(row.result) }}
                            </lay-tag>
                            <div v-if="row.responseTime" class="response-time">
                                {{ row.responseTime }}ms
                            </div>
                            <div v-if="row.errorCode && row.result !== 'success'" class="error-code">
                                错误码: {{ row.errorCode }}
                            </div>
                        </div>
                    </template>

                    <template #action="{ row }">
                        <div class="action-buttons">
                            <lay-button size="sm" @click="viewLogDetail(row)">
                                <lay-icon type="layui-icon-about" />
                                详情
                            </lay-button>
                            <lay-button v-if="hasDataChanges(row)" size="sm" @click="viewDataChanges(row)">
                                <lay-icon type="layui-icon-template-1" />
                                数据对比
                            </lay-button>
                            <lay-button v-if="row.result === 'error'" size="sm" type="danger" @click="viewError(row)">
                                <lay-icon type="layui-icon-close-fill" />
                                错误详情
                            </lay-button>
                            <lay-button v-if="row.relatedLogs && row.relatedLogs.length > 0" size="sm"
                                @click="viewRelatedLogs(row)">
                                <lay-icon type="layui-icon-link" />
                                关联日志
                            </lay-button>
                        </div>
                    </template>
                </lay-table>
            </lay-card>
        </div>

        <!-- 日志详情弹窗 -->
        <lay-layer v-model="showLogDetailModal" title="操作日志详情" :area="['900px', '700px']">
            <div class="log-detail-content" v-if="selectedLog">
                <!-- 基本信息 -->
                <div class="detail-section">
                    <h4>基本信息</h4>
                    <lay-form label-width="120px">
                        <lay-row :space="16">
                            <lay-col :md="12">
                                <lay-form-item label="日志ID">
                                    <span class="code">{{ selectedLog.id }}</span>
                                </lay-form-item>
                            </lay-col>
                            <lay-col :md="12">
                                <lay-form-item label="请求ID">
                                    <span class="code">{{ selectedLog.requestId || '无' }}</span>
                                </lay-form-item>
                            </lay-col>
                        </lay-row>
                        <lay-row :space="16">
                            <lay-col :md="12">
                                <lay-form-item label="操作模块">
                                    <lay-tag :type="getModuleTagType(selectedLog.module)">
                                        {{ getModuleName(selectedLog.module) }}
                                    </lay-tag>
                                </lay-form-item>
                            </lay-col>
                            <lay-col :md="12">
                                <lay-form-item label="操作类型">
                                    <lay-tag :type="getOperationTagType(selectedLog.operation)">
                                        {{ getOperationName(selectedLog.operation) }}
                                    </lay-tag>
                                </lay-form-item>
                            </lay-col>
                        </lay-row>
                        <lay-row :space="16">
                            <lay-col :md="12">
                                <lay-form-item label="操作人">
                                    <span>{{ selectedLog.operator }} ({{ selectedLog.operatorRole || '未知角色' }})</span>
                                </lay-form-item>
                            </lay-col>
                            <lay-col :md="12">
                                <lay-form-item label="操作时间">
                                    <span>{{ selectedLog.operationTime }}</span>
                                </lay-form-item>
                            </lay-col>
                        </lay-row>
                        <lay-row :space="16">
                            <lay-col :md="12">
                                <lay-form-item label="操作结果">
                                    <lay-tag :type="getResultTagType(selectedLog.result)">
                                        {{ getResultName(selectedLog.result) }}
                                    </lay-tag>
                                </lay-form-item>
                            </lay-col>
                            <lay-col :md="12">
                                <lay-form-item label="响应时间">
                                    <span>{{ selectedLog.responseTime || '未知' }}ms</span>
                                </lay-form-item>
                            </lay-col>
                        </lay-row>
                    </lay-form>
                </div>

                <!-- 操作详情 -->
                <div class="detail-section">
                    <h4>操作详情</h4>
                    <lay-form label-width="120px">
                        <lay-form-item label="目标对象">
                            <span>{{ selectedLog.targetObject }}</span>
                        </lay-form-item>
                        <lay-form-item label="变更描述">
                            <span>{{ selectedLog.changeDescription }}</span>
                        </lay-form-item>
                        <lay-form-item label="详细说明" v-if="selectedLog.detailDescription">
                            <span>{{ selectedLog.detailDescription }}</span>
                        </lay-form-item>
                    </lay-form>
                </div>

                <!-- 环境信息 -->
                <div class="detail-section">
                    <h4>环境信息</h4>
                    <lay-form label-width="120px">
                        <lay-row :space="16">
                            <lay-col :md="12">
                                <lay-form-item label="IP地址">
                                    <span>{{ selectedLog.ipAddress }}</span>
                                </lay-form-item>
                            </lay-col>
                            <lay-col :md="12">
                                <lay-form-item label="地理位置">
                                    <span>{{ selectedLog.geoLocation || '未知' }}</span>
                                </lay-form-item>
                            </lay-col>
                        </lay-row>
                        <lay-form-item label="用户代理">
                            <span class="user-agent-text">{{ selectedLog.userAgent }}</span>
                        </lay-form-item>
                        <lay-row :space="16" v-if="selectedLog.deviceInfo">
                            <lay-col :md="12">
                                <lay-form-item label="设备信息">
                                    <span>{{ selectedLog.deviceInfo.device || '未知' }}</span>
                                </lay-form-item>
                            </lay-col>
                            <lay-col :md="12">
                                <lay-form-item label="操作系统">
                                    <span>{{ selectedLog.deviceInfo.os || '未知' }}</span>
                                </lay-form-item>
                            </lay-col>
                        </lay-row>
                    </lay-form>
                </div>

                <!-- 数据变更 -->
                <div class="detail-section" v-if="hasDataChanges(selectedLog)">
                    <h4>数据变更</h4>
                    <div class="data-comparison">
                        <div v-if="selectedLog.oldValue" class="data-item">
                            <h5>变更前</h5>
                            <div class="data-viewer">
                                <lay-button size="xs" @click="formatJsonData('old')">格式化JSON</lay-button>
                                <pre class="data-content">{{ formatData(selectedLog.oldValue) }}</pre>
                            </div>
                        </div>
                        <div v-if="selectedLog.newValue" class="data-item">
                            <h5>变更后</h5>
                            <div class="data-viewer">
                                <lay-button size="xs" @click="formatJsonData('new')">格式化JSON</lay-button>
                                <pre class="data-content">{{ formatData(selectedLog.newValue) }}</pre>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 关联信息 -->
                <div class="detail-section" v-if="selectedLog.relatedLogs && selectedLog.relatedLogs.length > 0">
                    <h4>关联日志</h4>
                    <div class="related-logs">
                        <div v-for="relatedLog in selectedLog.relatedLogs" :key="relatedLog.id" class="related-log-item"
                            @click="viewLogDetail(relatedLog)">
                            <div class="related-log-info">
                                <span class="related-log-time">{{ relatedLog.operationTime }}</span>
                                <span class="related-log-operation">{{ getOperationName(relatedLog.operation) }}</span>
                                <span class="related-log-desc">{{ relatedLog.changeDescription }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <lay-button @click="closeLogDetailModal">关闭</lay-button>
                    <lay-button v-if="hasDataChanges(selectedLog)" @click="exportLogData">导出数据</lay-button>
                </div>
            </div>
        </lay-layer>

        <!-- 数据对比弹窗 -->
        <lay-layer v-model="showDataCompareModal" title="数据变更对比" :area="['1000px', '600px']">
            <div class="data-compare-content" v-if="selectedLog">
                <div class="compare-header">
                    <h4>{{ selectedLog.targetObject }} - {{ selectedLog.changeDescription }}</h4>
                    <div class="compare-controls">
                        <lay-button size="sm" @click="toggleCompareMode">
                            {{ compareMode === 'side' ? '上下对比' : '左右对比' }}
                        </lay-button>
                        <lay-button size="sm" @click="highlightDifferences">高亮差异</lay-button>
                    </div>
                </div>

                <div class="compare-container" :class="compareMode">
                    <div class="compare-panel old-data">
                        <h5>变更前</h5>
                        <pre class="compare-content">{{ formatData(selectedLog.oldValue) }}</pre>
                    </div>
                    <div class="compare-panel new-data">
                        <h5>变更后</h5>
                        <pre class="compare-content">{{ formatData(selectedLog.newValue) }}</pre>
                    </div>
                </div>
            </div>
        </lay-layer>

        <!-- 日志分析弹窗 -->
        <lay-layer v-model="showAnalysisModal" title="日志分析" :area="['1200px', '800px']">
            <div class="analysis-content">
                <div class="analysis-tabs">
                    <lay-tab v-model="analysisTab">
                        <lay-tab-item title="操作统计" name="operations">
                            <div class="analysis-charts">
                                <div class="chart-item">
                                    <h4>操作类型分布</h4>
                                    <div class="chart-placeholder">
                                        <!-- 这里可以集成图表库 -->
                                        <p>操作类型统计图表</p>
                                    </div>
                                </div>
                                <div class="chart-item">
                                    <h4>模块活跃度</h4>
                                    <div class="chart-placeholder">
                                        <p>模块活跃度图表</p>
                                    </div>
                                </div>
                            </div>
                        </lay-tab-item>
                        <lay-tab-item title="用户行为" name="users">
                            <div class="analysis-charts">
                                <div class="chart-item">
                                    <h4>用户活跃度</h4>
                                    <div class="chart-placeholder">
                                        <p>用户活跃度图表</p>
                                    </div>
                                </div>
                                <div class="chart-item">
                                    <h4>操作时间分布</h4>
                                    <div class="chart-placeholder">
                                        <p>操作时间分布图表</p>
                                    </div>
                                </div>
                            </div>
                        </lay-tab-item>
                        <lay-tab-item title="异常分析" name="errors">
                            <div class="analysis-charts">
                                <div class="chart-item">
                                    <h4>错误趋势</h4>
                                    <div class="chart-placeholder">
                                        <p>错误趋势图表</p>
                                    </div>
                                </div>
                                <div class="chart-item">
                                    <h4>错误类型分布</h4>
                                    <div class="chart-placeholder">
                                        <p>错误类型分布图表</p>
                                    </div>
                                </div>
                            </div>
                        </lay-tab-item>
                    </lay-tab>
                </div>
            </div>
        </lay-layer>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';

// 响应式数据
const searchKeyword = ref('');
const showLogDetailModal = ref(false);
const showDataCompareModal = ref(false);
const showAnalysisModal = ref(false);
const selectedLog = ref(null);
const tableLoading = ref(false);
const tableSize = ref('md');
const quickFilter = ref('');
const compareMode = ref('side');
const analysisTab = ref('operations');

// 统计数据
const todayStats = reactive({
    operations: 156,
    operationsGrowth: 23,
    errors: 5,
    errorsChange: 2,
    activeUsers: 28,
    usersGrowth: 4,
    dataChanges: 89,
    changesGrowth: 15
});

// 筛选表单
const filterForm = reactive({
    module: '',
    operation: '',
    result: '',
    operator: '',
    startDate: '',
    endDate: '',
    ipAddress: ''
});

// 操作人列表
const operatorList = ref([
    { id: 1, name: '张三', username: 'zhangsan' },
    { id: 2, name: '李四', username: 'lisi' },
    { id: 3, name: '王五', username: 'wangwu' },
    { id: 4, name: '赵六', username: 'zhaoliu' }
]);

// 表格列配置
const allColumns = [
    { title: '日志级别', key: 'level', width: 80, customSlot: 'level' },
    { title: '操作时间', key: 'operationTime', width: 150, fixed: 'left' },
    { title: '操作模块', key: 'module', width: 120, customSlot: 'module' },
    { title: '操作类型', key: 'operation', width: 100, customSlot: 'operation' },
    { title: '操作人', key: 'operator', width: 150, customSlot: 'operator' },
    { title: '操作详情', key: 'details', width: 300, customSlot: 'details' },
    { title: '位置信息', key: 'location', width: 200, customSlot: 'location' },
    { title: '操作结果', key: 'result', width: 120, customSlot: 'result' },
    { title: '操作', key: 'action', width: 200, fixed: 'right', customSlot: 'action' }
];

const visibleColumns = ref([...allColumns]);

// 业务日志数据
const businessLogs = ref([
    {
        id: 'LOG20240120001',
        level: 'info',
        operationTime: '2024-01-20 14:30:25',
        module: 'quote',
        operation: 'create',
        operator: '张三',
        operatorRole: '销售经理',
        operatorAvatar: '',
        targetObject: '报价单Q202401001',
        changeDescription: '创建新报价单',
        detailDescription: '为客户ABC公司创建办公室装修报价单，总金额50000元',
        ipAddress: '192.168.1.100',
        geoLocation: '北京市朝阳区',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        deviceInfo: {
            device: 'PC',
            os: 'Windows 10'
        },
        result: 'success',
        responseTime: 245,
        requestId: 'REQ20240120001',
        oldValue: null,
        newValue: '{"title":"办公室装修报价","amount":50000,"customer":"ABC公司","items":[{"name":"地板","price":20000},{"name":"墙面","price":30000}]}',
        errorCode: null,
        relatedLogs: []
    },
    {
        id: 'LOG20240120002',
        level: 'warn',
        operationTime: '2024-01-20 13:45:18',
        module: 'customer',
        operation: 'update',
        operator: '李四',
        operatorRole: '客户经理',
        operatorAvatar: '',
        targetObject: '客户信息C001',
        changeDescription: '更新客户联系方式',
        detailDescription: '修改客户ABC公司的联系电话和邮箱地址',
        ipAddress: '192.168.1.101',
        geoLocation: '上海市浦东新区',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
        deviceInfo: {
            device: 'Mac',
            os: 'macOS'
        },
        result: 'success',
        responseTime: 156,
        requestId: 'REQ20240120002',
        oldValue: '{"phone":"138000000","email":"old@example.com","address":"旧地址"}',
        newValue: '{"phone":"139000000","email":"new@example.com","address":"新地址"}',
        errorCode: null,
        relatedLogs: [
            {
                id: 'LOG20240120003',
                operationTime: '2024-01-20 13:40:00',
                operation: 'view',
                changeDescription: '查看客户详情'
            }
        ]
    },
    {
        id: 'LOG20240120003',
        level: 'error',
        operationTime: '2024-01-20 12:20:05',
        module: 'user',
        operation: 'delete',
        operator: '王五',
        operatorRole: '系统管理员',
        operatorAvatar: '',
        targetObject: '用户账号U001',
        changeDescription: '删除无效用户账号',
        detailDescription: '尝试删除已停用的测试用户账号，但因为存在关联数据而失败',
        ipAddress: '192.168.1.102',
        geoLocation: '广东省深圳市',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        deviceInfo: {
            device: 'PC',
            os: 'Windows 11'
        },
        result: 'error',
        responseTime: 89,
        requestId: 'REQ20240120003',
        oldValue: '{"username":"testuser","status":"inactive","relatedOrders":5}',
        newValue: null,
        errorCode: 'USER_DELETE_FAILED_RELATED_DATA',
        relatedLogs: []
    },
    {
        id: 'LOG20240120004',
        level: 'info',
        operationTime: '2024-01-20 11:15:33',
        module: 'order',
        operation: 'approve',
        operator: '赵六',
        operatorRole: '审批主管',
        operatorAvatar: '',
        targetObject: '订单O202401001',
        changeDescription: '审批通过订单',
        detailDescription: '审批订单O202401001，订单金额45000元，审批意见：符合公司政策，同意执行',
        ipAddress: '192.168.1.103',
        geoLocation: '江苏省南京市',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        deviceInfo: {
            device: 'PC',
            os: 'Windows 10'
        },
        result: 'success',
        responseTime: 198,
        requestId: 'REQ20240120004',
        oldValue: '{"status":"pending","approver":null,"approveTime":null}',
        newValue: '{"status":"approved","approver":"赵六","approveTime":"2024-01-20 11:15:33","comment":"符合公司政策，同意执行"}',
        errorCode: null,
        relatedLogs: []
    }
]);

// 分页配置
const pagination = reactive({
    current: 1,
    pageSize: 20,
    total: businessLogs.value.length
});

// 辅助方法
const getLevelTagType = (level: string) => {
    const typeMap: Record<string, string> = {
        'info': 'normal',
        'warn': 'warm',
        'error': 'danger',
        'debug': 'primary'
    };
    return typeMap[level] || 'normal';
};

const getLevelName = (level: string) => {
    const nameMap: Record<string, string> = {
        'info': '信息',
        'warn': '警告',
        'error': '错误',
        'debug': '调试'
    };
    return nameMap[level] || level;
};

const getModuleTagType = (module: string) => {
    const typeMap: Record<string, string> = {
        'user': 'primary',
        'quote': 'normal',
        'order': 'warm',
        'customer': 'success',
        'product': 'primary',
        'system': 'danger',
        'finance': 'warm'
    };
    return typeMap[module] || 'normal';
};

const getModuleName = (module: string) => {
    const nameMap: Record<string, string> = {
        'user': '用户管理',
        'quote': '报价管理',
        'order': '订单管理',
        'customer': '客户管理',
        'product': '产品管理',
        'system': '系统设置',
        'finance': '财务管理'
    };
    return nameMap[module] || module;
};

const getModuleIcon = (module: string) => {
    const iconMap: Record<string, string> = {
        'user': 'layui-icon-username',
        'quote': 'layui-icon-file',
        'order': 'layui-icon-cart-simple',
        'customer': 'layui-icon-group',
        'product': 'layui-icon-component',
        'system': 'layui-icon-set',
        'finance': 'layui-icon-dollar'
    };
    return iconMap[module] || 'layui-icon-app';
};

const getOperationTagType = (operation: string) => {
    const typeMap: Record<string, string> = {
        'create': 'normal',
        'update': 'warm',
        'delete': 'danger',
        'view': 'primary',
        'export': 'success',
        'import': 'primary',
        'approve': 'success',
        'reject': 'danger'
    };
    return typeMap[operation] || 'normal';
};

const getOperationName = (operation: string) => {
    const nameMap: Record<string, string> = {
        'create': '新增',
        'update': '修改',
        'delete': '删除',
        'view': '查看',
        'export': '导出',
        'import': '导入',
        'approve': '审批',
        'reject': '拒绝'
    };
    return nameMap[operation] || operation;
};

const getResultTagType = (result: string) => {
    const typeMap: Record<string, string> = {
        'success': 'normal',
        'failed': 'warm',
        'error': 'danger'
    };
    return typeMap[result] || 'normal';
};

const getResultName = (result: string) => {
    const nameMap: Record<string, string> = {
        'success': '成功',
        'failed': '失败',
        'error': '错误'
    };
    return nameMap[result] || result;
};

const hasDataChanges = (log: any) => {
    return log.oldValue || log.newValue;
};

const getBrowserInfo = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return '未知浏览器';
};

const formatData = (data: string) => {
    if (!data) return '';
    try {
        const parsed = JSON.parse(data);
        return JSON.stringify(parsed, null, 2);
    } catch {
        return data;
    }
};

// 方法实现
const searchLogs = () => {
    console.log('搜索日志:', searchKeyword.value);
};

const applyFilter = () => {
    console.log('应用筛选:', filterForm);
};

const resetFilter = () => {
    Object.keys(filterForm).forEach(key => {
        filterForm[key as keyof typeof filterForm] = '';
    });
    quickFilter.value = '';
};

const saveFilter = () => {
    console.log('保存筛选条件');
};

const setQuickFilter = (type: string) => {
    quickFilter.value = type;
    const now = new Date();

    switch (type) {
        case 'today':
            filterForm.startDate = now.toISOString().split('T')[0];
            filterForm.endDate = now.toISOString().split('T')[0];
            break;
        case 'week':
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            filterForm.startDate = weekStart.toISOString().split('T')[0];
            filterForm.endDate = new Date().toISOString().split('T')[0];
            break;
        case 'month':
            filterForm.startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            filterForm.endDate = new Date().toISOString().split('T')[0];
            break;
        case 'errors':
            filterForm.result = 'error';
            break;
        case 'sensitive':
            filterForm.operation = 'delete';
            break;
    }
    applyFilter();
};

const refreshLogs = () => {
    tableLoading.value = true;
    setTimeout(() => {
        tableLoading.value = false;
        console.log('刷新日志列表');
    }, 1000);
};

const exportLogs = () => {
    console.log('导出日志');
};

const cleanOldLogs = () => {
    console.log('清理过期日志');
};

const showLogAnalysis = () => {
    showAnalysisModal.value = true;
};

const toggleColumns = () => {
    console.log('列设置');
};

const viewLogDetail = (log: any) => {
    selectedLog.value = log;
    showLogDetailModal.value = true;
};

const closeLogDetailModal = () => {
    showLogDetailModal.value = false;
    selectedLog.value = null;
};

const viewDataChanges = (log: any) => {
    selectedLog.value = log;
    showDataCompareModal.value = true;
};

const viewError = (log: any) => {
    console.log('查看错误详情:', log);
};

const viewRelatedLogs = (log: any) => {
    console.log('查看关联日志:', log.relatedLogs);
};

const exportLogData = () => {
    console.log('导出日志数据');
};

const toggleCompareMode = () => {
    compareMode.value = compareMode.value === 'side' ? 'stack' : 'side';
};

const highlightDifferences = () => {
    console.log('高亮差异');
};

const formatJsonData = (type: string) => {
    console.log('格式化JSON数据:', type);
};
</script>

<style scoped lang="scss">
.business-log-page {
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

.stats-section {
    margin-bottom: 24px;
}

.stat-card {
    .stat-content {
        display: flex;
        align-items: center;
        padding: 20px;

        .stat-icon {
            width: 48px;
            height: 48px;
            background: #409eff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;

            &.warning {
                background: #e6a23c;
            }

            &.success {
                background: #67c23a;
            }

            &.primary {
                background: #409eff;
            }

            .layui-icon {
                color: white;
                font-size: 20px;
            }
        }

        .stat-info {
            flex: 1;

            h3 {
                margin: 0 0 8px 0;
                color: #666;
                font-size: 14px;
                font-weight: normal;
            }

            .stat-number {
                display: block;
                font-size: 28px;
                font-weight: bold;
                color: #333;
                margin-bottom: 4px;

                &.warning {
                    color: #e6a23c;
                }
            }

            .stat-trend {
                font-size: 12px;
                color: #999;

                &.up {
                    color: #67c23a;

                    &::before {
                        content: '↗ ';
                    }
                }

                &.down {
                    color: #f56c6c;

                    &::before {
                        content: '↘ ';
                    }
                }
            }
        }
    }
}

.toolbar-card,
.filter-card,
.quick-filter-card {
    margin-bottom: 24px;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .toolbar-left,
    .toolbar-right {
        display: flex;
        align-items: center;
        gap: 8px;
    }
}

.quick-filters {
    display: flex;
    align-items: center;
    gap: 8px;

    .filter-label {
        font-weight: 500;
        color: #333;
        margin-right: 8px;
    }
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 12px 0;
    border-bottom: 1px solid #e0e0e0;

    .table-info {
        display: flex;
        gap: 20px;
        font-size: 14px;
        color: #666;
    }

    .table-actions {
        display: flex;
        gap: 8px;
    }
}

.module-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .layui-icon {
        font-size: 16px;
        color: #666;
    }
}

.operator-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .operator-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .avatar-placeholder {
            width: 100%;
            height: 100%;
            background: #409eff;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
        }
    }

    .operator-details {
        .operator-name {
            font-weight: 500;
            color: #333;
            font-size: 14px;
        }

        .operator-role {
            font-size: 12px;
            color: #999;
        }
    }
}

.operation-details {
    .detail-item {
        margin-bottom: 6px;
        font-size: 13px;

        .label {
            color: #999;
            margin-right: 4px;
            font-weight: 500;
        }

        .value {
            color: #333;

            &.code {
                font-family: 'Courier New', monospace;
                background: #f5f5f5;
                padding: 2px 4px;
                border-radius: 2px;
                font-size: 12px;
            }
        }
    }

    .change-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #409eff;
        margin-top: 8px;

        .layui-icon {
            font-size: 12px;
        }
    }
}

.location-info {
    .ip-address {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 4px;
        font-size: 13px;

        .layui-icon {
            font-size: 12px;
            color: #666;
        }
    }

    .user-agent,
    .geo-location {
        font-size: 12px;
        color: #999;
        margin-bottom: 2px;
    }
}

.result-info {

    .response-time,
    .error-code {
        font-size: 12px;
        color: #666;
        margin-top: 4px;
    }

    .error-code {
        color: #f56c6c;
    }
}

.action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    .lay-btn {
        margin: 0;
    }
}

.log-detail-content {
    padding: 20px;
    max-height: 600px;
    overflow-y: auto;

    .detail-section {
        margin-bottom: 24px;

        h4 {
            margin: 0 0 16px 0;
            color: #333;
            font-size: 16px;
            font-weight: 600;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 8px;
        }
    }

    .code {
        font-family: 'Courier New', monospace;
        background: #f5f5f5;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 13px;
        color: #666;
    }

    .user-agent-text {
        font-size: 12px;
        color: #666;
        word-break: break-all;
    }
}

.data-comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    .data-item {
        h5 {
            margin: 0 0 8px 0;
            color: #666;
            font-size: 14px;
            font-weight: 600;
        }

        .data-viewer {
            .data-content {
                background: #f8f9fa;
                padding: 12px;
                border-radius: 4px;
                font-size: 12px;
                font-family: 'Courier New', monospace;
                white-space: pre-wrap;
                word-break: break-word;
                max-height: 300px;
                overflow-y: auto;
                margin-top: 8px;
                border: 1px solid #e0e0e0;
            }
        }
    }
}

.related-logs {
    .related-log-item {
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background: #f8f9fa;
            border-color: #409eff;
        }

        .related-log-info {
            display: flex;
            gap: 12px;
            font-size: 13px;

            .related-log-time {
                color: #666;
                min-width: 130px;
            }

            .related-log-operation {
                color: #409eff;
                min-width: 60px;
            }

            .related-log-desc {
                color: #333;
                flex: 1;
            }
        }
    }
}

.data-compare-content {
    padding: 20px;

    .compare-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e0e0e0;

        h4 {
            margin: 0;
            color: #333;
        }

        .compare-controls {
            display: flex;
            gap: 8px;
        }
    }

    .compare-container {
        display: grid;
        gap: 16px;

        &.side {
            grid-template-columns: 1fr 1fr;
        }

        &.stack {
            grid-template-rows: 1fr 1fr;
        }

        .compare-panel {
            h5 {
                margin: 0 0 8px 0;
                color: #666;
                font-size: 14px;
                padding: 8px 12px;
                background: #f8f9fa;
                border-radius: 4px 4px 0 0;
            }

            .compare-content {
                background: #fff;
                border: 1px solid #e0e0e0;
                border-top: none;
                padding: 12px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                white-space: pre-wrap;
                word-break: break-word;
                max-height: 400px;
                overflow-y: auto;
            }

            &.old-data h5 {
                background: #fff1f0;
                color: #f56c6c;
            }

            &.new-data h5 {
                background: #f6ffed;
                color: #52c41a;
            }
        }
    }
}

.analysis-content {
    padding: 20px;

    .analysis-charts {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;

        .chart-item {
            h4 {
                margin: 0 0 16px 0;
                color: #333;
                font-size: 16px;
            }

            .chart-placeholder {
                height: 300px;
                background: #f8f9fa;
                border: 1px dashed #e0e0e0;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
            }
        }
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
