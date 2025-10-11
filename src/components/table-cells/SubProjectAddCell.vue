<template>
  <div class="sub-project-add-cell">
    <!-- 如果是子项目行，显示新增按钮 -->
    <div v-if="isSubProjectRow" class="sub-project-row">
      <SvgIcon
        name="add_to"
        class="add-button"
        title="添加子项目"
        width="1.25rem"
        @click="handleAddClick"
      />
      <span class="sub-project-name">{{ data.name ? data.name : '' }}</span>
    </div>
    <!-- 如果是普通行，显示编号或空 -->
    <span v-else class="row-id">{{ data.id || '' }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';

interface Props {
  data: Record<string, unknown>;
  index: number;
  column: any;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'button-click': [
    action: string,
    data: Record<string, unknown>,
    index: number,
  ];
}>();

// 判断是否为子项目行
const isSubProjectRow = computed(() => {
  return props.data.isSubProject === true;
});

const handleAddClick = () => {
  emit('button-click', 'add-sub-project', props.data, props.index);
};
</script>

<style scoped lang="scss">
.sub-project-add-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  .sub-project-row {
    .add-button {
      cursor: pointer;
      color: $text-primary;
      height: 20px;
      width: 20px;
      transition: all 0.3s ease;
      padding: 2px;
      border-radius: 4px;

      &:hover {
        color: $primary-color;
        background-color: $primary-color-light;
        transform: scale(1.1);
      }
    }

    .sub-project-name {
      margin-left: 8px;
    }
  }

  .row-id {
    font-size: 14px;
    color: #606266;
    text-align: center;
  }
}
</style>
