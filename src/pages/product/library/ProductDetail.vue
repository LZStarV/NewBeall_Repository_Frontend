<template>
  <!-- 产品详情弹窗 -->
  <ModalWindow 
    :visible="visible" 
    :title="selectedProduct ? `${selectedProduct.name}--详情` : '产品详情'"
    :btn="productDetailButtons" 
    :sync-height="true" 
    @close="handleClose"
  >
    <div v-if="selectedProduct" class="product-detail">
      <!-- 产品头部信息 -->
      <div class="product-header">
        <div class="product-image">
          <div class="image-placeholder">
            <span class="placeholder-text">暂无图片信息</span>
          </div>
        </div>

        <div class="product-basic-info">
          <div class="info-row">
            <span class="label">创建时间：</span>
            <span class="value">{{ selectedProduct.createtime || '暂无' }}</span>
          </div>
          <div class="info-row">
            <span class="label">产品编号：</span>
            <span class="value">{{ selectedProduct.proId }}</span>
          </div>
          <div class="info-row">
            <span class="label">品牌：</span>
            <span class="value">{{ selectedProduct.brand }}</span>
          </div>
          <div class="info-row">
            <span class="label">型号：</span>
            <span class="value">{{ selectedProduct.model }}</span>
          </div>
          <div class="info-row">
            <span class="label">数量单位：</span>
            <span class="value">{{ selectedProduct.unit }}</span>
          </div>

          <!-- 价格信息表格 -->
          <div class="price-table-section">
            <div class="price-table">
              <lay-table :columns="priceColumns" :data-source="priceData" />
            </div>
          </div>
        </div>
      </div>

      <!-- 选项卡内容 -->
      <div class="tabs-container">
        <lay-tab v-model="activeTab" type="card">
          <lay-tab-item id="1" title="产品参数">
            <div class="tab-content">
              <div class="param-list">
                <div class="param-item">
                  <span class="param-label">产品参数：</span>
                  <span class="param-value">{{ selectedProduct.param || '暂无参数' }}</span>
                </div>
                <div class="param-item">
                  <span class="param-label">产品特征：</span>
                  <span class="param-value">{{ selectedProduct.trait || '暂无特征' }}</span>
                </div>
                <div class="param-item">
                  <span class="param-label">库存数量：</span>
                  <span class="param-value">{{ selectedProduct.inventory }}</span>
                </div>
                <div class="param-item">
                  <span class="param-label">销售数量：</span>
                  <span class="param-value">{{ selectedProduct.sales }}</span>
                </div>
              </div>
            </div>
          </lay-tab-item>
          <lay-tab-item id="2" title="产品特点">
            <div class="tab-content">
              <div class="features-content">
                <p>{{ selectedProduct.trait }}</p>
                <br />
                <h4>产品信息：</h4>
                <ul>
                  <li>品牌：{{ selectedProduct.brand }}</li>
                  <li>型号：{{ selectedProduct.model }}</li>
                  <li>创建用户：{{ selectedProduct.uname }}</li>
                  <li>公司：{{ selectedProduct.company }}</li>
                  <li>默认折扣：{{ selectedProduct.defaultDiscount }}%</li>
                </ul>
              </div>
            </div>
          </lay-tab-item>
        </lay-tab>
      </div>

      <!-- 设置状态信息 -->
      <div class="status-section">
        <h3>产品设置状态</h3>
        <div class="status-grid">
          <div class="status-item">
            <label>开放状态：</label>
            <span :class="['status', selectedProduct.isOpen ? 'enabled' : 'disabled']">
              {{ selectedProduct.isOpen ? '已开放' : '未开放' }}
            </span>
          </div>
          <div class="status-item">
            <label>自动处理：</label>
            <span :class="['status', selectedProduct.autoHandle ? 'enabled' : 'disabled']">
              {{ selectedProduct.autoHandle ? '已启用' : '已禁用' }}
            </span>
          </div>
          <div class="status-item">
            <label>审核状态：</label>
            <span :class="['status', selectedProduct.approved ? 'enabled' : 'disabled']">
              {{ selectedProduct.approved ? '已审核' : '未审核' }}
            </span>
          </div>
          <div class="status-item">
            <label>库存管理：</label>
            <span :class="['status', selectedProduct.isInventory ? 'enabled' : 'disabled']">
              {{ selectedProduct.isInventory ? '已启用' : '已禁用' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </ModalWindow>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import ModalWindow from '@/components/ModalWindow.vue'

// 定义产品接口类型
interface Product {
  checked?: boolean
  approved: boolean
  area: string
  autoHandle: boolean
  brand: string
  company: string
  condition: string
  createtime: string
  defaultDiscount: number
  getdate: string
  inventory: number
  isInventory: boolean
  isOpen: number
  model: string
  name: string
  param: string
  pictureaddress: string
  pictureaddressOne: string
  price: number
  proId: string
  purchaseprice: number
  marketprice: string
  sales: number
  trait: string
  uname: string
  unit: string
  version: string
}

// 定义组件的props
interface Props {
  visible: boolean
  selectedProduct?: Product | null
}

const props = defineProps<Props>()

// 定义组件的emits
const emit = defineEmits<{
  close: []
}>()

// 当前激活的选项卡
const activeTab = ref('1')

// 产品详情弹窗按钮配置
const productDetailButtons = ref([
  {
    text: '关闭',
    callback: () => handleClose()
  }
])

// 价格表格配置
const priceColumns: any[] = [
  { title: '成本价', key: 'cost', width: '120px' },
  { title: '参考售价', key: 'referencePrice', width: '120px' },
  { title: '市场指导价', key: 'marketPrice', width: '130px' }
]

// 价格数据
const priceData = computed(() => {
  if (!props.selectedProduct) return []

  return [
    {
      cost: `¥${props.selectedProduct.purchaseprice}`,
      referencePrice: `¥${props.selectedProduct.price}`,
      marketPrice: `¥${props.selectedProduct.marketprice}`
    }
  ]
})

// 关闭弹窗
const handleClose = () => {
  activeTab.value = '1'
  emit('close')
}
</script>

<style lang="scss" scoped>
// 产品详情弹窗样式
.product-detail {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;

  .product-header {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 2px solid #f0f0f0;

    .product-image {
      flex: 0 0 180px;

      .image-placeholder {
        width: 180px;
        height: 180px;
        background: #f5f5f5;
        border: 2px dashed #d9d9d9;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;

        .placeholder-text {
          color: #999;
          font-size: 14px;
        }
      }
    }

    .product-basic-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .info-row {
        display: flex;
        align-items: center;

        .label {
          font-weight: 500;
          color: #333;
          min-width: 80px;
        }

        .value {
          color: #666;
          flex: 1;
        }
      }

      .price-table-section {
        margin-top: 16px;

        .price-table {
          :deep(.layui-table) {
            border: 1px solid #e8e8e8;
            border-radius: 6px;
            overflow: hidden;
            font-size: 12px;

            .layui-table-header {
              background: #f8f9fa;
            }

            th,
            td {
              border-color: #e8e8e8;
              text-align: center;
              padding: 8px 12px;
            }

            .layui-table-cell-content {
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 13px;
              font-weight: 500;
            }
          }
        }
      }
    }
  }

  .tabs-container {
    margin-bottom: 24px;

    .tab-content {
      padding: 16px 0;

      .param-list {
        .param-item {
          display: flex;
          margin-bottom: 12px;
          align-items: flex-start;

          .param-label {
            font-weight: 500;
            color: #333;
            min-width: 100px;
            flex-shrink: 0;
          }

          .param-value {
            color: #666;
            flex: 1;
            word-break: break-word;
          }
        }
      }

      .features-content {
        color: #666;
        line-height: 1.8;

        h4 {
          color: #333;
          margin: 16px 0 8px 0;
          font-size: 16px;
        }

        ul {
          margin: 8px 0;
          padding-left: 20px;

          li {
            margin-bottom: 6px;
          }
        }

        p {
          margin-bottom: 12px;
        }
      }
    }
  }

  .status-section {
    h3 {
      color: #333;
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;

      .status-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: #f8f9fa;
        border-radius: 6px;

        label {
          font-weight: 500;
          color: #333;
          font-size: 14px;
        }

        .status {
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 500;

          &.enabled {
            background: #f6ffed;
            color: #52c41a;
            border: 1px solid #b7eb8f;
          }

          &.disabled {
            background: #fff2f0;
            color: #ff4d4f;
            border: 1px solid #ffccc7;
          }
        }
      }
    }
  }
}
</style>
