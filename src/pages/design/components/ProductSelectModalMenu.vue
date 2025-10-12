<template>
  <div class="product-menu">
    <div class="menu-header">
      <h5>产品分类</h5>
    </div>
    <div class="menu-content">
      <!-- 一级目录 -->
      <div class="category-tags">
        <span v-for="item in categoryData" :key="item.id" class="category-tag"
          :class="{ active: activeFirstLevel === item.id }" @click="handleFirstLevelClick(item)">
          {{ item.categoryName }}
        </span>
      </div>

      <!-- 二级目录 -->
      <div class="second-level-category" v-if="secondLevelData.length > 0">
        <ul class="menu-list">
          <li class="second-menu-item" v-for="item in secondLevelData" :key="item.id"
            :class="{ active: activeSecondLevel === item.id }" @click="handleSecondLevelClick(item)">
            <span class="second-category-name">{{ item.categoryName }}</span>
            <!-- 三级目录 -->
            <ul class="sub-menu-list">
              <li class="third-menu-item" v-for="subitem in item.productItems" :key="subitem.id"
                :class="{ active: activeThirdLevel === subitem.id }" @click="handleThirdLevelClick(subitem)">
                {{ subitem.categoryName }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import productApi from '@/api/product/productApi';

// 定义产品项接口
interface ProductItem {
  categoryName: string;
  id: string;
  levels: string;
  parentName: string;
  pid: string;
  productItems: ProductItem[];
}

// 定义组件属性
const props = defineProps({
  flag: {
    type: Number,
    default: 1 // 默认为自建库
  }
});

// 定义组件事件
const emit = defineEmits(['select-item']);

// 数据状态
const categoryData = ref<ProductItem[]>([]); // 一级目录数据
const secondLevelData = ref<ProductItem[]>([]); // 二级目录数据
const thirdLevelData = ref<ProductItem[]>([]); // 三级目录数据

// 当前激活的目录ID
const activeFirstLevel = ref<string>('');
const activeSecondLevel = ref<string>('');
const activeThirdLevel = ref<string>('');

// 获取产品分类数据
const fetchCategoryData = async () => {
  try {
    const result = await productApi.queryProItem();
    if (result && Array.isArray(result)) {
      categoryData.value = result;
      // 默认选中第一个一级目录
      if (result.length > 0) {
        handleFirstLevelClick(result[0]);
      }
    }
  } catch (error) {
    console.error('获取产品分类数据失败:', error);
  }
};

// 处理一级目录点击
const handleFirstLevelClick = (item: ProductItem) => {
  activeFirstLevel.value = item.id;
  activeSecondLevel.value = '';
  activeThirdLevel.value = '';

  // 更新二级目录数据
  secondLevelData.value = item.productItems || [];
  thirdLevelData.value = [];

  // 默认选中第一个二级目录
  if (secondLevelData.value.length > 0) {
    handleSecondLevelClick(secondLevelData.value[0]);
  } else {
    // 如果没有二级目录，直接触发选择事件
    emit('select-item', {
      itemId: item.id,
      flag: props.flag
    });
  }
};

// 处理二级目录点击
const handleSecondLevelClick = (item: ProductItem) => {
  activeSecondLevel.value = item.id;
  activeThirdLevel.value = '';

  // 更新三级目录数据
  thirdLevelData.value = item.productItems || [];

  // 默认选中第一个三级目录
  if (thirdLevelData.value.length > 0) {
    handleThirdLevelClick(thirdLevelData.value[0]);
  } else {
    // 如果没有三级目录，直接触发选择事件
    emit('select-item', {
      itemId: item.id,
      flag: props.flag
    });
  }
};

// 处理三级目录点击
const handleThirdLevelClick = (item: ProductItem) => {
  activeThirdLevel.value = item.id;

  // 触发选择事件
  emit('select-item', {
    itemId: item.id,
    flag: props.flag
  });
};

// 监听flag变化，重新加载数据
watch(() => props.flag, () => {
  fetchCategoryData();
});

// 组件挂载时获取数据
onMounted(() => {
  fetchCategoryData();
});
</script>

<style scoped lang="scss">
.product-menu {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;

  .menu-header {

    margin-bottom: 0.8rem;
  }

  .menu-content {
    .category-tags {
      width: 100%;
      white-space: nowrap;
      overflow-x: auto;
      padding: 6px 0;

      .category-tag {
        padding: 8px 12px;
        background: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 16px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s ease;
        margin-right: 0.5rem;
        white-space: nowrap;

        &:hover {
          border-color: $primary-color;
          color: $primary-color;
        }

        &.active {
          background: $primary-color;
          color: #fff;
          border-color: $primary-color;
        }
      }
    }

    .second-level-category {
      width: 100%;

      .menu-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0;
        margin-top: 1rem;
        margin-bottom: 0;

        .second-menu-item {
          display: flex;
          transition: all 0.2s ease;
          font-size: 13px;
          padding-left: 0;

          .second-category-name {
            cursor: pointer;
            width: 130px;
            transition: all 0.2s ease;
            font-size: 13px;
            font-weight: 600;
            text-align: end;
            padding-top: 4px;
          }
        }

        .sub-menu-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          width: calc(100% - 130px);

          .third-menu-item {
            padding: 4px 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 13px;
            border-radius: 16px;

            &:hover {
              background: #e9ecef;
            }
          }
        }
      }
    }
  }
}
</style>
