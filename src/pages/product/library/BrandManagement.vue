<template>
  <!-- 品牌管理页面覆盖层 -->
  <div v-if="visible" class="brand-management-overlay">
    <div class="brand-management-page">
      <div class="brand-header">
        <h2>品牌管理</h2>
        <button class="close-btn" @click="handleClose">
          <lay-icon type="layui-icon-close" />
        </button>
      </div>
      <div class="brand-content">
        <div class="brand-table-container">
          <table class="brand-table">
            <thead>
              <tr>
                <th>品牌</th>
                <th>云端库</th>
                <th>星标指定开放</th>
                <th>品牌指定开放</th>
                <th>默认折率(%)</th>
                <th>自动报价</th>
                <th>品牌自动报价管理</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="brand in brandList" :key="brand.id">
                <td>{{ brand.name }}</td>
                <td>
                  <lay-switch
                    :model-value="brand.isOpen === '1' || brand.isOpen === 1"
                    @update:model-value="(value) => updateBrandCloudLibrary(brand, value)"
                    onswitch-text="ON"
                    offswitch-text="OFF"
                  />
                </td>
                <td>
                  <span class="setting-link" @click="handleStarSetting(brand)">点击设置</span>
                </td>
                <td>
                  <span class="setting-link" @click="handleBrandSetting(brand)">点击设置</span>
                </td>
                <td>{{ brand.defaultDiscount }}</td>
                <td>
                  <lay-switch
                    :model-value="brand.autoPrice"
                    @update:model-value="(value) => updateBrandAutoPrice(brand, value)"
                    onswitch-text="ON"
                    offswitch-text="OFF"
                  />
                </td>
                <td>
                  <button class="management-btn" @click="handleBrandPriceManagement(brand)">
                    <lay-icon type="layui-icon-set" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import http from '@/utils/http';
import Notify from '@/utils/notify';

// 定义组件的props
interface Props {
  visible: boolean
  productBrand: Array<{
    value: string
    label: string
    isOpen: string | number
    autoPrice: boolean | number
    defaultDiscount: string
  }>
}

const props = defineProps<Props>()

// 定义组件的emits
const emit = defineEmits<{
  close: []
  brandPriceManagement: [brand: any]
}>()

// 计算品牌列表
const brandList = computed(() => {
  return props.productBrand.map((item, index) => ({
    id: index + 1,
    name: item.value,
    isOpen: item.isOpen,
    autoPrice: item.autoPrice,
    defaultDiscount: item.defaultDiscount
  }))
})

// 关闭品牌管理页面
const handleClose = () => {
  emit('close')
}

// 更新品牌云端库状态
const updateBrandCloudLibrary = (brand: any, value: boolean) => {
  brand.isOpen = value ? 1 : 0
  console.log('更新品牌云端库状态:', brand.name, '设置为:', value ? 'ON' : 'OFF')
  // 这里可以添加API调用来更新后端数据
}

// 更新品牌自动报价
const updateBrandAutoPrice = (brand: any, value: boolean) => {
  brand.autoPrice = value ? 1 : 0
  console.log('更新品牌自动报价:', brand.name, '设置为:', value ? 'ON' : 'OFF')
  // 这里可以添加API调用来更新后端数据
}

// 处理星标设置
const handleStarSetting = (brand: any) => {
  console.log('处理星标设置:', brand.name)
  // 这里可以打开星标设置弹窗或处理星标设置逻辑
  Notify.info({
    title: '星标设置',
    content: `正在为品牌 ${brand.name} 设置星标`,
    time: 3000
  })
}

// 处理品牌设置
const handleBrandSetting = (brand: any) => {
  console.log('处理品牌设置:', brand.name)
  // 这里可以打开品牌设置弹窗或处理品牌设置逻辑
  Notify.info({
    title: '品牌设置',
    content: `正在为品牌 ${brand.name} 进行设置`,
    time: 3000
  })
}

// 处理品牌自动报价管理
const handleBrandPriceManagement = (brand: any) => {
  console.log('处理品牌自动报价管理:', brand.name)
  emit('brandPriceManagement', brand)
}
</script>

<style lang="scss" scoped>
// 品牌管理页面覆盖层样式
.brand-management-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(2px);
  z-index: 1000;

  .brand-management-page {
    width: 100%;
    height: 100%;
    padding: 24px;
    background-color: white;
    overflow-y: auto;

    .brand-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #f0f0f0;

      h2 {
        font-size: 24px;
        color: #333;
        margin: 0;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #888;
        padding: 8px;
        border-radius: 4px;
        transition: all 0.2s;

        &:hover {
          background-color: #f5f5f5;
          color: #333;
        }
      }
    }

    .brand-content {
      .brand-table-container {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;

        .brand-table {
          width: 100%;
          border-collapse: collapse;

          thead tr {
            background: #f8f9fa;
          }

          th,
          td {
            padding: 12px 16px;
            text-align: center;
            border-bottom: 1px solid #e8e8e8;
          }

          th {
            font-weight: 600;
            color: #333;
            font-size: 14px;
          }

          td {
            color: #666;
            font-size: 13px;
          }

          tbody tr:hover {
            background-color: #f0f8ff;
          }

          .setting-link {
            color: #1890ff;
            cursor: pointer;
            text-decoration: none;

            &:hover {
              color: #40a9ff;
              text-decoration: underline;
            }
          }

          .management-btn {
            background: #1890ff;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              background: #40a9ff;
            }
          }
        }
      }
    }
  }
}
</style>
