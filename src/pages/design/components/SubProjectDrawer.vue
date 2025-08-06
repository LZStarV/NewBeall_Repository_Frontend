<template>
  <!-- 新建子项目 drawer -->
  <lay-layer
    v-model="showDrawer"
    title="新建子项目"
    :area="['400px', '100%']"
    offset="r"
    type="4"
    :move="false"
  >
    <div class="sub-project-form">
      <!-- 子项目名称输入框 -->
      <div class="form-item">
        <label class="form-label">子项目名称</label>
        <lay-input
          v-model="subProjectForm.name"
          placeholder="请输入子项目名称"
          class="form-input"
        />
      </div>

      <!-- 子项目类型选择 -->
      <div class="form-item">
        <label class="form-label">子项目类型</label>
        <div class="level-options">
          <!-- 一级子项目 -->
          <div
            class="level-option"
            :class="{ active: subProjectForm.selectedLevel === 'level1' }"
          >
            <div class="level-content">
              <div class="level-switch">
                <lay-switch
                  v-model="subProjectForm.level1Selected"
                  onswitch-text="ON"
                  unswitch-text="OFF"
                  @change="handleLevel1Change"
                />
                <span class="level-label">一级子项目</span>
              </div>
              <div class="color-picker">
                <span class="color-label">颜色:</span>
                <lay-color-picker v-model="subProjectForm.level1Color" />
              </div>
            </div>
          </div>

          <!-- 二级子项目 -->
          <div
            class="level-option"
            :class="{ active: subProjectForm.selectedLevel === 'level2' }"
          >
            <div class="level-content">
              <div class="level-switch">
                <lay-switch
                  v-model="subProjectForm.level2Selected"
                  onswitch-text="ON"
                  unswitch-text="OFF"
                  @change="handleLevel2Change"
                />
                <span class="level-label">二级子项目</span>
              </div>
              <div class="color-picker">
                <span class="color-label">颜色:</span>
                <lay-color-picker v-model="subProjectForm.level2Color" />
              </div>
            </div>
            <!-- 二级子项目的父级选择框 -->
            <div
              v-if="subProjectForm.selectedLevel === 'level2'"
              class="parent-selector"
            >
              <label class="parent-label">选择父级子项目:</label>
              <lay-select
                v-model="subProjectForm.level2Parent"
                placeholder="请选择一级子项目"
              >
                <lay-select-option
                  v-for="item in level1Projects"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </lay-select>
            </div>
          </div>

          <!-- 三级子项目 -->
          <div
            class="level-option"
            :class="{ active: subProjectForm.selectedLevel === 'level3' }"
          >
            <div class="level-content">
              <div class="level-switch">
                <lay-switch
                  v-model="subProjectForm.level3Selected"
                  onswitch-text="ON"
                  unswitch-text="OFF"
                  @change="handleLevel3Change"
                />
                <span class="level-label">三级子项目</span>
              </div>
              <div class="color-picker">
                <span class="color-label">颜色:</span>
                <lay-color-picker v-model="subProjectForm.level3Color" />
              </div>
            </div>
            <!-- 三级子项目的父级选择框 -->
            <div
              v-if="subProjectForm.selectedLevel === 'level3'"
              class="parent-selector"
            >
              <label class="parent-label">选择父级子项目:</label>
              <lay-select
                v-model="subProjectForm.level3Parent"
                placeholder="请选择二级子项目"
              >
                <lay-select-option
                  v-for="item in level2Projects"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </lay-select>
            </div>
          </div>
        </div>
      </div>

      <!-- 确认按钮 -->
      <div class="form-actions">
        <lay-button type="primary" class="submit-btn" @click="handleSubmit">
          确认
        </lay-button>
      </div>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import notify from '@/utils/notify';

// 定义 props
interface Props {
  visible: boolean;
}

const props = defineProps<Props>();

// 定义 emits
const emit = defineEmits<{
  'update:visible': [value: boolean];
  submit: [
    data: {
      name: string;
      level: string;
      color: string;
      parentId?: string;
    },
  ];
}>();

// 控制 drawer 显示
const showDrawer = ref(props.visible);

// 监听 visible 变化
watch(
  () => props.visible,
  (newVal) => {
    showDrawer.value = newVal;
  },
);

// 监听 showDrawer 变化，同步到父组件
watch(showDrawer, (newVal) => {
  emit('update:visible', newVal);

  // 如果关闭drawer，重置表单
  if (!newVal) {
    resetForm();
  }
});

// 子项目表单数据
const subProjectForm = reactive({
  name: '',
  level1Color: '#409EFF',
  level2Color: '#67C23A',
  level3Color: '#E6A23C',
  selectedLevel: '',
  level2Parent: '', // 新增：二级子项目的父级ID
  level3Parent: '', // 新增：三级子项目的父级ID
  level1Selected: false, // 新增：一级子项目开关状态
  level2Selected: false, // 新增：二级子项目开关状态
  level3Selected: false, // 新增：三级子项目开关状态
});

// 一级子项目列表 (用于父级选择)
const level1Projects = ref<Array<{ id: string; name: string }>>([]);
// 二级子项目列表 (用于父级选择)
const level2Projects = ref<Array<{ id: string; name: string }>>([]);

// 处理子项目提交
const handleSubmit = () => {
  if (!subProjectForm.name.trim()) {
    notify.error('请输入子项目名称');
    return;
  }

  if (!subProjectForm.selectedLevel) {
    notify.error('请选择子项目类型');
    return;
  }

  // 检查父级选择
  if (
    subProjectForm.selectedLevel === 'level2' &&
    !subProjectForm.level2Parent
  ) {
    notify.error('请选择父级子项目');
    return;
  }

  if (
    subProjectForm.selectedLevel === 'level3' &&
    !subProjectForm.level3Parent
  ) {
    notify.error('请选择父级子项目');
    return;
  }

  // 处理子项目的创建逻辑
  const subProjectData = {
    name: subProjectForm.name,
    level: subProjectForm.selectedLevel,
    color:
      subProjectForm.selectedLevel === 'level1'
        ? subProjectForm.level1Color
        : subProjectForm.selectedLevel === 'level2'
          ? subProjectForm.level2Color
          : subProjectForm.level3Color,
    parentId:
      subProjectForm.selectedLevel === 'level2'
        ? subProjectForm.level2Parent
        : subProjectForm.selectedLevel === 'level3'
          ? subProjectForm.level3Parent
          : undefined,
  };

  console.log('新建子项目数据:', subProjectData);

  // 发送数据给父组件
  emit('submit', subProjectData);

  // 重置表单
  resetForm();

  // 关闭drawer
  showDrawer.value = false;
};

// 重置表单
const resetForm = () => {
  subProjectForm.name = '';
  subProjectForm.selectedLevel = '';
  subProjectForm.level2Parent = '';
  subProjectForm.level3Parent = '';
  subProjectForm.level1Selected = false;
  subProjectForm.level2Selected = false;
  subProjectForm.level3Selected = false;
};

// 处理子项目类型切换
const handleLevel1Change = (value: boolean) => {
  if (value) {
    // 重置其他选项
    subProjectForm.level2Selected = false;
    subProjectForm.level3Selected = false;
    subProjectForm.selectedLevel = 'level1';
    subProjectForm.level2Parent = '';
    subProjectForm.level3Parent = '';
  } else {
    subProjectForm.selectedLevel = '';
  }
};

const handleLevel2Change = (value: boolean) => {
  if (value) {
    // 重置其他选项
    subProjectForm.level1Selected = false;
    subProjectForm.level3Selected = false;
    subProjectForm.selectedLevel = 'level2';
    subProjectForm.level2Parent = '';
    subProjectForm.level3Parent = '';
  } else {
    subProjectForm.selectedLevel = '';
  }
};

const handleLevel3Change = (value: boolean) => {
  if (value) {
    // 重置其他选项
    subProjectForm.level1Selected = false;
    subProjectForm.level2Selected = false;
    subProjectForm.selectedLevel = 'level3';
    subProjectForm.level2Parent = '';
    subProjectForm.level3Parent = '';
  } else {
    subProjectForm.selectedLevel = '';
  }
};

// 模拟获取一级子项目列表
const getLevel1Projects = () => {
  // 这里应该调用实际的 API，现在使用模拟数据
  level1Projects.value = [{ id: '1', name: '选择一级子项目' }];
};

// 模拟获取二级子项目列表
const getLevel2Projects = () => {
  // 这里应该调用实际的 API，现在使用模拟数据
  level2Projects.value = [{ id: '1', name: '选择二级子项目' }];
};

// 组件挂载时获取一级子项目
onMounted(() => {
  getLevel1Projects();
  getLevel2Projects();
});

// 当二级子项目父级改变时，获取二级子项目
watch(
  () => subProjectForm.level2Parent,
  (newVal: string) => {
    if (newVal) {
      getLevel2Projects();
    } else {
      level2Projects.value = [];
    }
  },
);
</script>

<style scoped lang="scss">
.sub-project-form {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.form-input {
  width: 100%;
}

.level-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.level-option {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    border-color: #409eff;
    background-color: #f0f8ff;
  }

  &:hover {
    border-color: #409eff;
  }
}

.level-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.level-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-label {
  font-size: 12px;
  color: #666;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-label {
  font-size: 12px;
  color: #666;
}

.parent-selector {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.parent-label {
  display: block;
  font-size: 13px;
  color: #555;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.submit-btn {
  width: 100%;
}
</style>
