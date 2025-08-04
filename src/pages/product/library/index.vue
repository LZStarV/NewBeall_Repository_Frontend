<template>
    <div class="product-library-page">
        <!-- 搜索过滤区域 -->
        <div class="filter-section">
            <lay-form :model="filterForm" layout="inline">
                <lay-form-item label="产品名称">
                    <lay-input v-model="filterForm.productName" placeholder="请输入产品名称" style="width: 140px" />
                </lay-form-item>
                <lay-form-item label="品牌">
                    <lay-select v-model="filterForm.brand" placeholder="请选择" style="width: 100px">
                        <lay-select-option value="">请选择</lay-select-option>
                        <lay-select-option value="中国税务">中国税务</lay-select-option>
                        <lay-select-option value="中国">中国</lay-select-option>
                    </lay-select>
                </lay-form-item>
                <lay-form-item label="创建人">
                    <lay-select v-model="filterForm.creator" placeholder="请选择" style="width: 100px">
                        <lay-select-option value="">请选择</lay-select-option>
                        <lay-select-option value="张三">张三</lay-select-option>
                    </lay-select>
                </lay-form-item>
                <lay-form-item label="修改时间">
                    <lay-date-picker v-model="filterForm.modifyTime" placeholder="选择日期" style="width: 140px" />
                </lay-form-item>
                <lay-form-item label="型号">
                    <lay-select v-model="filterForm.model" placeholder="型号" style="width: 100px">
                        <lay-select-option value="">请选择</lay-select-option>
                        <lay-select-option value="x80">x80</lay-select-option>
                    </lay-select>
                </lay-form-item>
                <lay-form-item>
                    <lay-select v-model="filterForm.libraryType" style="width: 120px; margin-left: 8px">
                        <lay-select-option value="">自建产品库</lay-select-option>
                        <lay-select-option value="">闲置产品</lay-select-option>
                    </lay-select>
                </lay-form-item>
                <lay-form-item>
                    <lay-button type="primary">
                        <lay-icon type="layui-icon-search" />
                    </lay-button>
                    <lay-button>
                        <lay-icon type="layui-icon-refresh" />
                    </lay-button>
                </lay-form-item>
            </lay-form>
        </div>
        <!-- 产品列表表格 -->
        <div class="content-area">
            <table class="product-table">
                <thead>
                    <tr>
                        <th class="checkbox-column">
                            <div class="custom-checkbox" @click="handleCheckAll(!allChecked)">
                                <div class="checkbox-square"
                                    :class="{ checked: allChecked, indeterminate: indeterminate }">
                                    <lay-icon v-if="allChecked" type="layui-icon-ok" />
                                </div>
                            </div>
                        </th>
                        <th class="product-name-column">产品名称</th>
                        <th>品牌</th>
                        <th>型号</th>
                        <th>参数/特性</th>
                        <th>单位</th>
                        <th>成本</th>
                        <th>参考售价</th>
                        <th>市场指导价</th>
                        <th>创建人</th>
                        <th>云端库</th>
                        <th>开放星标</th>
                        <th>指定开放</th>
                        <th>默认折率(%)</th>
                        <th>自动包价</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in tableData" :key="index" :data-index="index">
                        <td class="checkbox-column">
                            <div class="custom-checkbox" @click="toggleRowCheck(row)">
                                <div class="checkbox-square" :class="{ checked: row.checked }">
                                    <lay-icon v-if="row.checked" type="layui-icon-ok" />
                                </div>
                            </div>
                        </td>
                        <td class="product-name-column">
                            <a href="#" class="product-link">{{ row.productName }}</a>
                        </td>
                        <td>{{ row.brand }}</td>
                        <td>{{ row.model }}</td>
                        <td>
                            <a href="#" class="parameters-link">{{ row.parameters }}</a>
                        </td>
                        <td>{{ row.unit }}</td>
                        <td>{{ row.cost }}</td>
                        <td>{{ row.referencePrice }}</td>
                        <td>{{ row.marketPrice }}</td>
                        <td>{{ row.creator }}</td>
                        <td class="switch-column">
                            <lay-switch v-model="row.cloudLibrary" onswitch-text="ON" :style="{
                                '--lay-switch-on-color': '#5FB878',
                                '--lay-switch-off-color': '#d9d9d9'
                            }" />
                        </td>
                        <td class="action-column">
                            <span :style="{ color: row.openUpdate ? '#5FB878' : '#999' }">
                                {{ row.openUpdate ? '点击设置' : '点击设置' }}
                            </span>
                        </td>
                        <!-- 修改指定开放的颜色，与云端库保持一致 -->
                        <td class="action-column">
                            <span :style="{ color: row.designatedOpen ? '#5FB878' : '#999' }">
                                {{ row.designatedOpen ? '点击设置' : '点击设置' }}
                            </span>
                        </td>
                        <td>{{ row.defaultDiscount }}</td>
                        <td class="switch-column">
                            <div class="auto-price-switch">
                                <lay-switch v-model="row.autoPrice" onswitch-text="ON" />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- 分页器 -->
            <div class="pagination-wrapper">
                <lay-laypage :current="pagination.current" :limit="pagination.pageSize" :total="pagination.total"
                    :show-jumper="pagination.showJumper" :show-sizer="pagination.showSizer" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';

// 过滤表单
const filterForm = reactive({
    productName: '',
    brand: '',
    creator: '',
    modifyTime: '',
    model: '',
    serviceType: '',
    libraryType: ''
});

// 表格数据
const tableData = ref([
    {
        checked: false,
        productName: '湿测器',
        brand: 'VIVO',
        model: 'x80',
        parameters: '参数特性',
        unit: '套',
        cost: '22.00',
        referencePrice: '30.00',
        marketPrice: '300.00',
        creator: '张三',
        cloudLibrary: true,
        openUpdate: true,
        designatedOpen: true,
        defaultDiscount: '',
        autoPrice: false
    },
    {
        checked: false,
        productName: 'this is test product',
        brand: 'test',
        model: 'test product',
        parameters: '参数特性',
        unit: 'l',
        cost: '0.88',
        referencePrice: '0.99',
        marketPrice: '1.11',
        creator: '张三',
        cloudLibrary: false,
        openUpdate: true,
        designatedOpen: true,
        defaultDiscount: '80.00',
        autoPrice: false
    },
    {
        checked: false,
        productName: '24口万兆接入层交换机',
        brand: '华为',
        model: 'S5735S-L24T4X-A1',
        parameters: '参数特性',
        unit: '台',
        cost: '0.00',
        referencePrice: '0.00',
        marketPrice: '0.00',
        creator: '张三',
        cloudLibrary: false,
        openUpdate: true,
        designatedOpen: true,
        defaultDiscount: '',
        autoPrice: false
    },
    {
        checked: false,
        productName: '工业级全光口网络交换机',
        brand: '华为',
        model: 'S500-32S14X',
        parameters: '参数特性',
        unit: '台',
        cost: '0.00',
        referencePrice: '0.00',
        marketPrice: '0.00',
        creator: '张三',
        cloudLibrary: true,
        openUpdate: true,
        designatedOpen: true,
        defaultDiscount: '',
        autoPrice: false
    },
    {
        checked: false,
        productName: '接入层8口POE网络交换机',
        brand: '华为',
        model: 'S200-8P4S',
        parameters: '参数特性',
        unit: '台',
        cost: '0.00',
        referencePrice: '0.00',
        marketPrice: '0.00',
        creator: '张三',
        cloudLibrary: true,
        openUpdate: true,
        designatedOpen: true,
        defaultDiscount: '',
        autoPrice: false
    }
]);

// 分页配置
const pagination = reactive({
    current: 1,
    pageSize: 26,
    total: 80,
    showJumper: true,
    showSizer: true
});

// 全选状态
const allChecked = ref(false);
const indeterminate = ref(false);

// 全选功能
const handleCheckAll = (checked: boolean) => {
    tableData.value.forEach(item => {
        item.checked = checked;
    });
    updateCheckAllState();
};

// 更新全选状态
const updateCheckAllState = () => {
    const checkedCount = tableData.value.filter(item => item.checked).length;
    const total = tableData.value.length;

    if (checkedCount === 0) {
        allChecked.value = false;
        indeterminate.value = false;
    } else if (checkedCount === total) {
        allChecked.value = true;
        indeterminate.value = false;
    } else {
        allChecked.value = false;
        indeterminate.value = true;
    }
};

// 切换行复选框状态
const toggleRowCheck = (row: { checked: boolean }) => {
    row.checked = !row.checked;
    updateCheckAllState();
};
</script>

<style scoped lang="scss">
.product-library-page {
    padding: 16px;
    background: #f5f5f5;
    min-height: 100vh;
}

.page-header {
    margin-bottom: 16px;

    h1 {
        margin: 0;
        color: #333;
        font-size: 20px;
        font-weight: 500;
    }
}

.filter-section {
    background: white;
    padding: 16px 20px;
    margin-bottom: 16px;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

    :deep(.layui-form) {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        gap: 0;
        margin: 0;
        overflow-x: auto;
    }

    :deep(.layui-form-item) {
        margin: 0 8px 0 0;
        flex-shrink: 0;
        display: flex;
        align-items: stretch;
        position: relative;
    }

    :deep(.layui-form-label) {
        font-size: 11px;
        font-weight: 500;
        color: #333;
        background: #fafafa;
        border: 1px solid #d9d9d9;
        border-right: none;
        border-radius: 4px 0 0 4px;
        padding: 0 4px;
        margin: 0;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 28px;
        line-height: 1;
        width: 50px !important;

        &::after {
            display: none;
        }
    }

    :deep(.layui-input) {
        height: 28px;
        font-size: 11px;
        border: 1px solid #d9d9d9;
        border-left: none;
        border-radius: 0 4px 4px 0;
        padding: 0 10px;
        margin: 0;
        transition: all 0.2s ease;

        &:hover {
            border-color: #40a9ff;
        }

        &:focus {
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
            outline: none;
        }

        &::placeholder {
            color: #bfbfbf;
            font-size: 10px;
        }
    }

    :deep(.layui-select) {
        .layui-select-input {
            height: 28px;
            font-size: 11px;
            border: 1px solid #d9d9d9;
            border-left: none;
            border-radius: 0 4px 4px 0;
            padding: 0 10px;
            margin: 0;
            transition: all 0.2s ease;

            &:hover {
                border-color: #40a9ff;
            }

            &:focus {
                border-color: #1890ff;
                box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
            }
        }
    }

    :deep(.layui-date-picker) {
        .layui-input {
            height: 28px;
            font-size: 11px;
            border: 1px solid #d9d9d9;
            border-left: none;
            border-radius: 0 4px 4px 0;
            padding: 0 10px;
            margin: 0;
            transition: all 0.2s ease;

            &:hover {
                border-color: #40a9ff;
            }

            &:focus {
                border-color: #1890ff;
                box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
            }
        }
    }

    :deep(.layui-form-item) {
        &:focus-within {
            .layui-form-label {
                border-color: #1890ff;
                background: #e6f7ff;
            }
        }

        &:hover {
            .layui-form-label {
                border-color: #40a9ff;
                background: #f0f9ff;
            }
        }
    }

    :deep(.layui-button) {
        height: 18px;
        width: 18px;
        padding: 0;
        font-size: 8px;
        border-radius: 2px;
        margin-right: 3px;
        line-height: 18px;
        transition: all 0.2s ease;

        &[type="primary"] {
            background: #1890ff;
            border-color: #1890ff;

            &:hover {
                background: #40a9ff;
                border-color: #40a9ff;
            }
        }

        &:not([type="primary"]) {
            background: white;
            border: 1px solid #d9d9d9;
            color: #666;

            &:hover {
                border-color: #1890ff;
                color: #1890ff;
            }
        }

        .layui-icon {
            font-size: 8px;
            line-height: 1;
            width: auto;
            height: auto;
        }
    }

    :deep(.layui-form-item:nth-last-child(2)),
    :deep(.layui-form-item:last-child) {

        .layui-input,
        .layui-select .layui-select-input {
            border-left: 1px solid #d9d9d9;
            border-radius: 4px;
        }

        // 专门为自建产品库下拉框设置左内边距为0
        .layui-select .layui-input input {
            padding-left: 0;
        }
    }
}

.content-area {
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 0;

    .product-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        border: 1px solid rgb(230, 230, 230);

        thead {
            background: #fafafa;

            th {
                font-weight: 500;
                font-size: 12px;
                border-bottom: 1px solid rgb(230, 230, 230);
                border-right: 1px solid rgb(230, 230, 230);
                text-align: center;
                padding: 10px 6px;
                height: 36px;

                &:last-child {
                    border-right: none;
                }

                &.checkbox-column {
                    width: 50px;
                }

                &.product-name-column {
                    width: 120px;
                }
            }
        }

        tbody {
            tr {
                &:nth-child(even) {
                    background-color: #fafafa;
                }

                &:hover {
                    background-color: #f0f8ff;
                }

                td {
                    border-bottom: 1px solid rgb(230, 230, 230);
                    border-right: 1px solid rgb(230, 230, 230);
                    text-align: center;
                    vertical-align: middle;
                    font-size: 12px;
                    padding: 6px 4px;
                    height: 32px;

                    &:last-child {
                        border-right: none;
                    }

                    &.checkbox-column {
                        width: 50px;
                    }

                    &.product-name-column {
                        width: 120px;
                        text-align: center;
                        padding: 6px 4px;
                    }

                    &.switch-column {
                        padding: 4px;
                    }

                    &.action-column {
                        cursor: pointer;
                    }
                }
            }
        }

        .product-link,
        .parameters-link {
            font-size: 12px;
            color: #1890ff;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    // 复选框样式
    .custom-checkbox {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .checkbox-square {
        width: 14px;
        height: 14px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        .layui-icon {
            font-size: 10px;
            line-height: 1;
        }

        &.checked {
            background-color: #5FB878;
            border-color: #5FB878;
            color: white;
        }
    }

    // 开关样式优化
    :deep(.layui-switch) {
        transform: scale(0.8);

        // 确保开关文字正确显示
        em {
            margin-left: 5px;
            margin-right: 21px;
            font-size: 10px;
            display: inline-block;
            transition: color 0.3s ease;
        }
    }

    // 开启状态的开关
    :deep(.layui-form-onswitch) {
        border-color: #5FB878;
        background-color: #5FB878;

        em {
            color: #fff;
            font-weight: 100;
        }
    }

    // 关闭状态的开关 - 修复OFF文字不显示的问题
    :deep(.layui-switch:not(.layui-form-onswitch)) {
        background-color: #d9d9d9;
        border-color: #d9d9d9;

        em {
            color: #999;
            font-weight: 600;
        }

        // 确保滑块在正确位置显示OFF文字
        i {
            left: 0;
        }
    }

    // 分页器样式
    .pagination-wrapper {
        padding: 16px;
        display: flex;
        justify-content: center;
        border-top: 1px solid #e8e8e8;

        :deep(.layui-laypage) {
            font-size: 12px;
        }

        :deep(.layui-box) {
            font-size: 12px;
        }

        :deep(.layui-laypage-default) {
            font-size: 12px;

            .layui-laypage-count,
            .layui-laypage-curr,
            .layui-laypage-next,
            .layui-laypage-prev,
            .layui-laypage-skip,
            .layui-laypage-limits,
            a {
                font-size: 12px;
                line-height: 1.4;
            }
        }
    }
}
</style>
