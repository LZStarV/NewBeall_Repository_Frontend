<template>
  <!-- 表格区域 -->
  <lay-card>
    <!-- 工具栏区域 -->
    <div class="fixed-table-toolbar">
      <span data-title="AI填充数据" @click="handleAiFill" class="btnIcon invite-but">
        <lay-icon type="layui-icon-set" />
      </span>
      <span data-title="复制" @click="handleCopy" class="btnIcon invite-but">
        <lay-icon type="layui-icon-template" />
      </span>
      <span data-title="询价" @click="handleInquiry" class="btnIcon invite-but">
        <lay-icon type="layui-icon-dollar" />
      </span>
      <span data-title="显示重复产品" @click="handleShowDuplicate" class="btnIcon invite-but">
        <lay-icon type="layui-icon-table" />
      </span>
      <span data-title="单个新增" @click="handleSingleAdd" class="btnIcon invite-but">
        <lay-icon type="layui-icon-addition" />
      </span>
      <span data-title="批量新增" @click="handleBatchAdd" class="btnIcon invite-but">
        <lay-icon type="layui-icon-add-circle" />
      </span>
      <span data-title="修改" @click="handleEdit" class="btnIcon invite-but">
        <lay-icon type="layui-icon-edit" />
      </span>
      <span data-title="删除" @click="handleDelete" class="btnIcon invite-but">
        <lay-icon type="layui-icon-delete" />
      </span>
      <span data-title="批量导出" @click="handleBatchExport" class="btnIcon invite-but">
        <lay-icon type="layui-icon-export" />
      </span>
      <span data-title="全库备份" @click="handleFullBackup" class="btnIcon invite-but">
        <lay-icon type="layui-icon-download-circle" />
      </span>
      <span data-title="品牌管理" @click="handleBrandManagement" class="btnIcon invite-but">
        <lay-icon type="layui-icon-diamond" />
      </span>
      <span data-title="添加至闲置云" @click="handleAddToIdleCloud" class="btnIcon invite-but">
        <lay-icon type="layui-icon-upload" />
      </span>

      <div class="dropdown-container">
        <button type="button" aria-label="columns" class="btn btn-default btn-outline dropdown-toggle"
          @click="toggleColumnsDropdown">
          <lay-icon type="layui-icon-shrink-right" />
        </button>
        <ul class="dropdown-menu" :class="{ 'show': showColumnsDropdown }">
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.proId" @change="updateVisibleColumns" /> 产品编号
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.name" @change="updateVisibleColumns" /> 产品名称
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.brand" @change="updateVisibleColumns" /> 品牌
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.model" @change="updateVisibleColumns" /> 型号
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.trait" @change="updateVisibleColumns" /> 参数/特性
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.unit" @change="updateVisibleColumns" /> 单位
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.purchaseprice" @change="updateVisibleColumns" /> 成本
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.price" @change="updateVisibleColumns" /> 参考售价
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.marketprice" @change="updateVisibleColumns" /> 市场指导价
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.uname" @change="updateVisibleColumns" /> 创建人
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.cloudLibrary" @change="updateVisibleColumns" /> 云端库
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.openUpdate" @change="updateVisibleColumns" /> 开放星标
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.designatedOpen" @change="updateVisibleColumns" /> 指定开放
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.defaultDiscount" @change="updateVisibleColumns" />
              默认折率(%)
            </label>
          </li>
          <li role="menuitem">
            <label>
              <input type="checkbox" v-model="columnVisibility.autoHandle" @change="updateVisibleColumns" /> 自动报价
            </label>
          </li>
        </ul>
      </div>
    </div>

    <!-- 产品列表表格 -->
    <div class="content-area">
      <lay-table :columns="visibleColumns" :data-source="tableData" :page="pagination" @change="handleTableChange"
        :loading="loading">
        <!-- 复选框列 -->
        <template #checkbox="{ row }">
          <div class="custom-checkbox" @click="toggleRowCheck(row)">
            <div class="checkbox-square" :class="{ checked: row.checked }">
              <lay-icon v-if="row.checked" type="layui-icon-ok" />
            </div>
          </div>
        </template>

        <!-- 产品名称列 -->
        <template #productName="{ row }">
          <a href="#" class="product-link" @click.prevent="handleViewProduct(row)">{{ row.name }}</a>
        </template>


        <!-- 参数特性列 -->
        <template #parameters="{ row }">
          <a href="#" class="parameters-link" @click.prevent="handleViewParameters(row)">参数特性</a>
        </template>

        <!-- 云端库开关 -->
        <template #cloudLibrary="{ row }">
          <lay-switch :model-value="row.isOpen === '1' || row.isOpen === 1"
            @update:model-value="(value) => updateCloudLibraryStatus(row, value)" onswitch-text="ON"
            offswitch-text="OFF" :style="{
              '--lay-switch-on-color': '#5FB878',
              '--lay-switch-off-color': '#d9d9d9'
            }" />
        </template>

        <!-- 开放星标列 -->
        <template #openUpdate="{ row }">
          <span :style="{ color: '#5FB878' }" class="action-text" @click="handleOpenPermissionManagement(row)">
            点击设置
          </span>
        </template>

        <!-- 指定开放列 -->
        <template #designatedOpen="{ row }">
          <span :style="{ color: '#5FB878' }" class="action-text" @click="handleOpenDesignatedOpenManagement(row)">
            点击设置
          </span>
        </template>

        <!-- 自动报价开关 -->
        <template #autoPrice="{ row }">
          <lay-switch v-model="row.autoHandle" onswitch-text="开" offswitch-text="关" />
        </template>
      </lay-table>
    </div>
  </lay-card>

  <!-- 单个新增弹窗 -->
  <SingleProductAdd :visible="singleAddVisible" @close="closeSingleAdd" @success="handleAddSuccess" />

  <!-- 询价弹窗 -->
  <InquiryModal :visible="inquiryModalVisible" :selected-products="selectedProductsForInquiry"
    @close="closeInquiryModal" @success="handleInquirySuccess" />
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import http from '@/utils/http'
import Notify from '@/utils/notify'
import env from '@/utils/env'
import SingleProductAdd from './SingleProductAdd.vue'
import InquiryModal from './InquiryModal.vue'
import type { Product } from './type'
import { allColumns } from './type'


// 定义组件的emits
const emit = defineEmits<{
  viewProduct: [product: Product]
  viewParameters: [product: Product]
  openPermissionManagement: [product: Product]
  openDesignatedOpenManagement: [product: Product]
  brandManagement: []
  addToIdleCloud: [products: Product[]]
}>()

// 表格数据
const tableData = ref<Product[]>([])

// 加载状态
const loading = ref(false)

// 分页配置
const pagination = reactive({
  current: 1,
  limit: 80,
  total: 0
})

// 列显示控制
const columnVisibility = reactive({
  proId: true,             // 产品编号
  name: true,              // 产品名称
  brand: true,             // 品牌
  model: true,             // 型号
  trait: true,             // 产品特点
  unit: true,              // 单位
  purchaseprice: true,     // 成本
  price: true,             // 参考售价
  marketprice: true,       // 市场指导价
  uname: true,             // 创建人
  cloudLibrary: true,      // 云端库
  openUpdate: true,        // 开放星标
  designatedOpen: true,    // 指定开放
  defaultDiscount: true,   // 默认折率
  autoHandle: true         // 自动报价
})

const showColumnsDropdown = ref(false)

// 计算可见列
const visibleColumns = computed(() => {
  return allColumns.filter(column => {
    if (column.key === 'checkbox') return true
    return columnVisibility[column.key as keyof typeof columnVisibility] !== false
  })
})

// 全选状态
const allChecked = ref(false)
const indeterminate = ref(false)

// 显示重复产品状态
const showingDuplicates = ref(false)
const originalTableData = ref<Product[]>([])

// 单个新增弹窗状态
const singleAddVisible = ref(false)

// 询价弹窗状态
const inquiryModalVisible = ref(false)
const selectedProductsForInquiry = ref<Product[]>([])

// 获取产品数据
const fetchProductList = async (searchParams?: any) => {
  try {
    loading.value = true

    // 如果有搜索参数，重置分页到第一页
    if (searchParams && Object.keys(searchParams).length > 0) {
      pagination.current = 1;
    }

    const params = {
      page: pagination.current,
      limit: pagination.limit,
      ...searchParams
    }


    const response = await http.get('/product/productsList', params)
    const responseData = response.data || response
    if (responseData && responseData.rows && Array.isArray(responseData.rows)) {
      tableData.value = responseData.rows.map((item: any) => ({
        ...item,
        checked: false
      }))
      pagination.total = responseData.total || responseData.rows.length

      // 重置选择状态
      allChecked.value = false
      indeterminate.value = false
    } else {
      // 如果没有rows属性，尝试直接使用response作为数组
      if (Array.isArray(responseData)) {
        tableData.value = responseData.map((item: any) => ({
          ...item,
          checked: false
        }))
        pagination.total = responseData.length

        // 重置选择状态
        allChecked.value = false
        indeterminate.value = false
      }
    }
  } catch (error) {
    console.error('获取产品列表失败:', error)
    Notify.error({
      title: '错误',
      content: '获取产品列表失败，请稍后重试',
      time: 3000
    })
  } finally {
    loading.value = false
  }
}

// 表格变化处理
const handleTableChange = async (pageData: { current: number; limit: number }) => {
  pagination.current = pageData.current
  pagination.limit = pageData.limit
  await fetchProductList()
}

// 更新全选状态
const updateCheckAllState = () => {
  const checkedCount = tableData.value.filter(item => item.checked).length
  const total = tableData.value.length

  if (checkedCount === 0) {
    allChecked.value = false
    indeterminate.value = false
  } else if (checkedCount === total) {
    allChecked.value = true
    indeterminate.value = false
  } else {
    allChecked.value = false
    indeterminate.value = true
  }
}

// 切换行复选框状态
const toggleRowCheck = (row: { checked: boolean }) => {
  row.checked = !row.checked
  updateCheckAllState()
}

// 更新可见列
const updateVisibleColumns = () => {
  // 列显示状态更新时的处理逻辑
}

// 切换列下拉菜单
const toggleColumnsDropdown = () => {
  showColumnsDropdown.value = !showColumnsDropdown.value
}


// 工具栏功能方法

// AI填充数据
const handleAiFill = async () => {
  // 检查是否选中了产品
  const selectedRows = tableData.value.filter(row => row.checked)
  if (selectedRows.length === 0) {
    Notify.error({
      title: '提示',
      content: '请选择要进行AI填充的产品',
      time: 3000
    })
    return
  }

  // 弹出积分扣除确认提示
  const confirmed = confirm(
    `• 成功解析一个产品将扣除1个积分，最大可能扣除 ${selectedRows.length} 个积分\n` +
    `是否继续提交AI填充？`
  )

  if (!confirmed) {
    return // 用户选择取消，直接返回
  }

  // 用户确认后，执行实际的AI填充
  await performAiFill(selectedRows)
}

// 执行AI填充的实际逻辑
const performAiFill = async (selectedRows: Product[]) => {
  try {
    // 获取选中的产品编号
    const productIds = selectedRows.map(row => row.proId)

    // 直接使用 axios 发送请求，避免 HTTP 拦截器的自动跳转
    const response = await axios.post(`${env.getApiBaseUrl()}/AI/ProductAiParse`,
      { productIds }
    )

    // 处理成功响应
    console.log('AI填充数据:', response.data)
    Notify.success({
      title: 'AI填充成功',
      content: `已成功为 ${selectedRows.length} 个产品进行AI填充`,
      time: 3000
    })

    // 刷新产品列表以显示更新后的数据
    await fetchProductList()

  } catch (error: any) {
    console.error('AI填充失败:', error)

    // 检查是否是权限错误（401）
    if (error.response?.status === 401) {
      Notify.error({
        title: '权限不足',
        content: '您没有使用AI填充功能的权限，请联系管理员',
        time: 5000
      })
      return // 阻止进一步的错误处理，不会跳转
    }

    // 处理其他类型的错误
    const errorMessage = error.response?.data?.message || error.message || 'AI填充过程中发生未知错误'
    Notify.error({
      title: 'AI填充失败',
      content: errorMessage,
      time: 3000
    })
  }
}

// 复制
const handleCopy = () => {
  const selectedRows = tableData.value.filter(row => row.checked)
  if (selectedRows.length === 0) {
    Notify.error({
      title: '提示',
      content: '请选择要复制的产品',
      time: 3000
    })
    return
  }

  // 构建复制文本
  const headers = [
    '产品编号', '产品名称', '品牌', '型号', '单位', '成本', '参考售价', '市场指导价', '创建人', '创建时间'
  ]
  let copyText = headers.join('\t') + '\n'

  selectedRows.forEach(row => {
    const rowData = [
      row.proId || '',
      row.name || '',
      row.brand || '',
      row.model || '',
      row.unit || '',
      row.purchaseprice || '',
      row.price || '',
      row.marketprice || '',
      row.uname || '',
      row.createtime || ''
    ]
    copyText += rowData.join('\t') + '\n'
  })

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text)
    } else {
      return new Promise<void>((resolve, reject) => {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
          const successful = document.execCommand('copy')
          document.body.removeChild(textArea)
          if (successful) {
            resolve()
          } else {
            reject(new Error('复制失败'))
          }
        } catch (err) {
          document.body.removeChild(textArea)
          reject(err)
        }
      })
    }
  }

  copyToClipboard(copyText).then(() => {
    Notify.success({
      title: '复制成功',
      content: `已复制 ${selectedRows.length} 条产品数据`,
      time: 3000
    })
  }).catch((error) => {
    console.error('复制失败:', error)
    Notify.error({
      title: '复制失败',
      content: '请手动复制或检查浏览器权限',
      time: 3000
    })
  })
}

// 询价
const handleInquiry = () => {
  const selectedRows = tableData.value.filter(row => row.checked)
  if (selectedRows.length === 0) {
    Notify.error({
      title: '提示',
      content: '请选择要询价的产品',
      time: 3000
    })
    return
  }
  // 弹出积分扣除确认提示
  const confirmed = confirm(
    `• 产品名称：${selectedRows.map(row => row.name).join(', ')}\n` +
    `• 产品型号：${selectedRows.map(row => row.model).join(', ')}\n` +
    `• 产品数量：${selectedRows.map(row => row.num).join(', ')}\n` +
    `• 是否继续提交询价？`
  )
  if (!confirmed) {
    return // 用户选择取消，直接返回
  }
  // 保存选中的产品
  selectedProductsForInquiry.value = [...selectedRows]

  //点击确认后，弹出询价弹窗
  console.log('准备显示询价弹窗，当前状态:', inquiryModalVisible.value)
  inquiryModalVisible.value = true
  console.log('弹窗状态已设置为:', inquiryModalVisible.value)

}

// 显示重复产品
const handleShowDuplicate = () => {
  if (showingDuplicates.value) {
    // 如果当前正在显示重复产品，则恢复原始数据
    tableData.value = [...originalTableData.value]
    showingDuplicates.value = false
  } else {
    // 保存原始数据
    originalTableData.value = [...tableData.value]

    // 根据产品编号(proId)找出重复的产品
    const proIdMap = new Map<string, Product[]>()

    // 按产品编号分组
    tableData.value.forEach(product => {
      const proId = product.proId
      if (proId) {
        if (!proIdMap.has(proId)) {
          proIdMap.set(proId, [])
        }
        proIdMap.get(proId)!.push(product)
      }
    })

    // 找出有重复的产品
    const duplicateProducts: Product[] = []
    proIdMap.forEach(products => {
      if (products.length > 1) {
        duplicateProducts.push(...products)
      }
    })

    if (duplicateProducts.length > 0) {
      tableData.value = duplicateProducts
      showingDuplicates.value = true

      Notify.success({
        title: '重复产品筛选',
        content: `找到 ${duplicateProducts.length} 个重复产品`,
        time: 3000
      })
    } else {
      Notify.info({
        title: '无重复产品',
        content: '当前数据中没有发现重复产品',
        time: 3000
      })
    }
  }
}

// 单个新增
const handleSingleAdd = () => {
  singleAddVisible.value = true
}

// 关闭单个新增弹窗
const closeSingleAdd = () => {
  singleAddVisible.value = false
}

// 关闭询价弹窗
const closeInquiryModal = () => {
  inquiryModalVisible.value = false
  selectedProductsForInquiry.value = []
}

// 处理询价成功
const handleInquirySuccess = (data: any) => {
  console.log('询价表单数据:', data)

  // 显示询价成功提示
  Notify.success({
    title: '询价成功',
    content: '询价请求已提交',
    time: 3000
  })
}

// 处理新增成功
const handleAddSuccess = (product: any) => {
  console.log('产品新增成功:', product)
  Notify.success({
    title: '新增成功',
    content: `产品 "${product.name}" 已成功添加到产品库`,
    time: 3000
  })

  // 刷新产品列表
  fetchProductList()
}

// 批量新增
const handleBatchAdd = () => {
  console.log('批量新增产品')
  // 这里可以打开批量新增弹窗或导入功能
}

// 修改
const handleEdit = () => {
  const selectedRows = tableData.value.filter(row => row.checked)
  if (selectedRows.length === 0) {
    Notify.error({
      title: '提示',
      content: '请选择要修改的产品',
      time: 3000
    })
    return
  }
  console.log('修改产品:', selectedRows)
}

// 删除
const handleDelete = async () => {
  const selectedRows = tableData.value.filter(row => row.checked)
  if (selectedRows.length === 0) {
    Notify.error({
      title: '提示',
      content: '请选择要删除的产品',
      time: 3000
    })
    return
  }

  if (!confirm(`确定要删除选中的 ${selectedRows.length} 个产品吗？`)) {
    return
  }

  try {
    const productIds = selectedRows.map(row => row.proId)
    const formData = new FormData()
    productIds.forEach(id => formData.append('productIds[]', id))
    await http.post('/product/delete', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    await fetchProductList()
    // 重置选择状态
    allChecked.value = false
    indeterminate.value = false
    Notify.success({
      title: '删除成功',
      content: `已删除 ${selectedRows.length} 个产品`,
      time: 3000
    })
  } catch (error) {
    Notify.error({
      title: '删除失败',
      content: '删除操作失败，请稍后重试',
      time: 3000
    })
  }
}

// 批量导出
const handleBatchExport = () => {
  const selectedRows = tableData.value.filter(row => row.checked)
  if (selectedRows.length === 0) {
    Notify.error({
      title: '提示',
      content: '请选择要导出的产品',
      time: 3000
    })
    return
  }

  // 构建导出数据
  const exportData = selectedRows.map(row => ({
    '产品编号': row.proId,
    '产品名称': row.name,
    '品牌': row.brand,
    '型号': row.model,
    '详细参数': row.param || '',
    '库存数': row.inventory || '',
    '计量单位': row.unit,
    '成本': row.purchaseprice,
    '工程价': row.price,
    '市场指导价': row.marketprice,
    '类别': row.subprojectClass || '',
    '供应商公司': row.gyCompany || ''
  }))

  // 将数据转换为CSV格式
  const csvContent = convertToCSV(exportData)

  // 下载CSV文件
  downloadCSV(csvContent, `产品数据_${new Date().toISOString().slice(0, 10)}.csv`)

  Notify.success({
    title: '导出成功',
    content: `已导出 ${selectedRows.length} 条产品数据`,
    time: 3000
  })
}

// 将数据转换为CSV格式
const convertToCSV = (data: any[]) => {
  if (data.length === 0) return ''

  // 获取表头
  const headers = Object.keys(data[0])

  // 构建CSV内容
  const csvRows = []

  // 添加表头
  csvRows.push(headers.join(','))

  // 添加数据行
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] || ''
      // 处理包含逗号、引号或换行符的值
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    csvRows.push(values.join(','))
  })

  return csvRows.join('\n')
}

// 下载CSV文件
const downloadCSV = (csvContent: string, filename: string) => {
  // 添加BOM以支持中文
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })

  // 创建下载链接
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  // 触发下载
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // 释放URL对象
  URL.revokeObjectURL(url)
}

// 全库备份
const handleFullBackup = async () => {
  // 确认备份操作
  if (!confirm('确定要进行全库备份吗？此操作可能需要较长时间。')) {
    return
  }

  try {
    console.log('开始全库备份...')
    // 这里可以调用备份API

    Notify.success({
      title: '备份成功',
      content: '全库备份已完成',
      time: 3000
    })
  } catch (error) {
    Notify.error({
      title: '备份失败',
      content: '全库备份失败，请稍后重试',
      time: 3000
    })
  }
}

// 品牌管理
const handleBrandManagement = () => {
  emit('brandManagement')
}

// 添加至闲置云
const handleAddToIdleCloud = () => {
  const selectedRows = tableData.value.filter(row => row.checked)
  if (selectedRows.length === 0) {
    Notify.error({
      title: '提示',
      content: '请选择要添加至闲置云的产品',
      time: 3000
    })
    return
  }

  emit('addToIdleCloud', selectedRows)
}

// 查看产品详情
const handleViewProduct = (product: Product) => {
  emit('viewProduct', product)
}

// 查看参数详情（右侧弹窗）
const handleViewParameters = (product: Product) => {
  emit('viewParameters', product)
}

// 打开产品权限管理弹窗
const handleOpenPermissionManagement = (product: Product) => {
  emit('openPermissionManagement', product)
}

// 打开指定开放管理弹窗
const handleOpenDesignatedOpenManagement = (product: Product) => {
  emit('openDesignatedOpenManagement', product)
}

// 更新云端库状态
const updateCloudLibraryStatus = (row: Product, value: boolean) => {
  // 更新云端库状态：true -> 1, false -> 0
  row.isOpen = value ? 1 : 0
  // 这里可以添加调用API更新后端数据的逻辑
  console.log('更新云端库状态:', row.name, '设置为:', value ? 'ON' : 'OFF')
}


// 暴露方法给父组件
defineExpose({
  fetchProductList,
  tableData,
  pagination,
  loading
})

// 组件挂载时获取数据
fetchProductList()
</script>

<style lang="scss" scoped>
// 全局字体大小控制
:deep(.lay-card) {
  font-size: $font-size-extra-small;
}


// 工具栏样式
.fixed-table-toolbar {
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;

  .btnIcon,
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
    background-color: #fff;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      background-color: #f0f8ff;
      border-color: #1890ff;
      color: #1890ff;
    }

    .layui-icon {
      font-size: 14px;
    }
  }

  .invite-but {
    position: relative;

    &:before {
      content: attr(data-title);
      position: absolute;
      top: -35px;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      z-index: 1000;
    }

    &:hover:before {
      opacity: 1;
      visibility: visible;
    }
  }

  .dropdown-container {
    position: relative;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1000;
    display: none;
    min-width: 160px;
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

// 复选框样式
.custom-checkbox {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  .checkbox-square {
    width: 16px;
    height: 16px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &.checked {
      background: #1890ff;
      border-color: #1890ff;
      color: white;

      .layui-icon {
        font-size: 12px;
      }
    }
  }
}

// 链接样式
.product-link,
.parameters-link {
  color: #1890ff;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

// 操作文字样式
.action-text {
  cursor: pointer;
  font-size: 12px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}

// 表格内容区域
.content-area {
  position: relative; // 为右侧弹窗提供定位参考
}
</style>