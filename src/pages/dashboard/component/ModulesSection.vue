<template>
  <section class="modules-section">
    <lay-container fluid>
      <lay-row space="24">
        <lay-col
          v-for="module in moduleCards"
          :key="module.id"
          md="4"
          sm="8"
          xs="12"
        >
          <div
            class="module-card"
            :class="module.colorClass"
            @click="handleModuleClick(module)"
          >
            <div class="module-icon">
              <lay-icon :type="module.icon" size="32" />
            </div>
            <div class="module-label">{{ module.label }}</div>
          </div>
        </lay-col>
      </lay-row>
    </lay-container>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 定义模块卡片的类型接口
interface ModuleCard {
  id: number;
  label: string;
  icon: string;
  route: string;
  colorClass:
    | 'module-blue'
    | 'module-purple'
    | 'module-pink'
    | 'module-orange'
    | 'module-green'
    | 'module-lime';
}

// 功能模块数据
const moduleCards = ref<ModuleCard[]>([
  {
    id: 1,
    label: '新建报价',
    icon: 'layui-icon-add-circle',
    route: '/design/new-quote',
    colorClass: 'module-blue',
  },
  {
    id: 2,
    label: '历史报价',
    icon: 'layui-icon-time',
    route: '/design/history-quote',
    colorClass: 'module-purple',
  },
  {
    id: 3,
    label: '客户管理',
    icon: 'layui-icon-user',
    route: '/supply/customer-management',
    colorClass: 'module-pink',
  },
  {
    id: 4,
    label: '公司云盘',
    icon: 'layui-icon-upload-drag',
    route: '/cloud/company-disk',
    colorClass: 'module-orange',
  },
  {
    id: 5,
    label: '自建产品',
    icon: 'layui-icon-component',
    route: '/product/library',
    colorClass: 'module-green',
  },
  {
    id: 6,
    label: '用户管理',
    icon: 'layui-icon-username',
    route: '/system/user-management',
    colorClass: 'module-lime',
  },
]);

// 处理功能模块点击
const handleModuleClick = (module: ModuleCard) => {
  console.log('点击功能模块:', module.label);
  if (module.route) {
    router.push(module.route);
  }
};
</script>

<style lang="scss" scoped>
.modules-section {
  margin-bottom: 10px;

  .module-card {
    background: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
    height: 100px;
    @include flex(column, center, center);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .module-icon {
      transition: all 0.3s ease;

      .layui-icon {
        font-size: 32px;
      }
    }

    .module-label {
      font-size: 14px;
      color: #676a6c;
    }

    &.module-blue .module-icon {
      color: #62a4e9;
    }
    &.module-purple .module-icon {
      color: #a2aefe;
    }
    &.module-pink .module-icon {
      color: #f191a2;
    }
    &.module-orange .module-icon {
      color: #f9ab54;
    }
    &.module-green .module-icon {
      color: #4fd4b0;
    }
    &.module-lime .module-icon {
      color: #9ac640;
    }
  }
}
</style>
