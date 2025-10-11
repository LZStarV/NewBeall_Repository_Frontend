<template>
  <lay-layer
    v-model="visible"
    :shade="true"
    :area="modalArea"
    :btn="actionBtns"
    title="消息详情"
  >
    <div style="padding: 20px; min-height: 300px">
      <h3 class="notice-title">{{ noticeData.title }}</h3>
      <div class="notice-meta">
        <span class="creater">{{ noticeData.createrName || '未知' }}</span>
        <span class="time">{{ noticeData.createtime }}</span>
      </div>
      <div class="notice-content" v-html="noticeData.content || noticeData.contents || '暂无内容'">
      </div>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue';
import { layer } from '@layui/layui-vue';
import noticeApi from '@/api/notice/noticeApi.ts';
import Notify from '@/utils/notify.ts';
import env from '@/utils/env';
import { debounce } from '@/utils/debounce';
import { onMounted, onUnmounted } from 'vue';

// 定义组件属性
const props = defineProps<{
  visible: boolean;
  noticeData: {
    content?: string;
    contents?: string;
    creater?: number;
    createrName?: string;
    createtime?: string;
    id?: number;
    title?: string;
    type?: number;
    typeMsg?: string;
    unid?: string;
    isRead?: boolean;
  };
}>();

// 定义组件事件
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'notice-updated'): void;
}>();

// 绑定到lay-layer的visible属性
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

// 获取当前屏幕宽度
const getScreenWidth = () => {
  return window.innerWidth;
};

// 根据屏幕宽度设置弹窗大小
const getModalSize = () => {
  const screenWidth = getScreenWidth();
  if (screenWidth < env.getPadLayoutBreakpoint()) {
    // 移动端 - 宽度90%
    return ['90%', 'auto'];
  } else if (screenWidth < env.getDesktopLayoutBreakpoint()) {
    // 平板端 - 宽度70%
    return ['70%', 'auto'];
  } else {
    // 桌面端 - 固定宽度600px
    return ['600px', 'auto'];
  }
};

// 响应式弹窗大小
const modalArea = ref(getModalSize());

// 监听窗口大小变化，更新弹窗大小
const handleResize = debounce(() => {
  modalArea.value = getModalSize();
}, 200);

// 组件挂载时添加窗口大小变化监听
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

// 组件卸载时移除窗口大小变化监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 定义弹窗按钮
const actionBtns = ref([
  {
    text: '标记已读',
    callback: () => {
      handleMarkAsRead();
    },
  },
  {
    text: '删除',
    callback: () => {
      handleDelete();
    },
  }
]);

// 标记已读操作
const handleMarkAsRead = () => {
  // 显示确认对话框
  layer.confirm('是否将这条消息设为已读？', {
    title: '提示',
    btn: [
      {
        text: '确定',
        callback: async (id) => {
          try {
            // 获取当前消息ID
            const noticeId = props.noticeData.id;
            if (!noticeId) {
              Notify.warn('消息ID无效');
              layer.close(id);
              return;
            }

            // 调用API标记已读
            await noticeApi.clearNotice([noticeId]);

            Notify.success('已成功标记为已读');
            // 通知父组件刷新数据
            emit('notice-updated');
            // 关闭当前弹窗
            layer.close(id);
            emit('update:visible', false);
          } catch (error) {
            Notify.warn('标记已读失败，请重试');
            console.error(error);
          }
        },
      },
      {
        text: '取消',
        callback: (id) => {
          layer.close(id);
        },
      },
    ],
  });
};

// 删除操作
const handleDelete = () => {
  // 显示确认对话框
  layer.confirm('是否删除这条消息？', {
    title: '提示',
    btn: [
      {
        text: '确定',
        callback: async (id) => {
          try {
            // 获取当前消息ID
            const noticeId = props.noticeData.id;
            if (!noticeId) {
              Notify.warn('消息ID无效');
              layer.close(id);
              return;
            }

            // 调用API删除消息
            await noticeApi.deleteNotice([noticeId]);

            Notify.success('已成功删除该通知');
            // 通知父组件刷新数据
            emit('notice-updated');
            // 关闭当前弹窗
            layer.close(id);
            emit('update:visible', false);
          } catch (error) {
            Notify.warn('删除失败，请重试');
            console.error(error);
          }
        },
      },
      {
        text: '取消',
        callback: (id) => {
          layer.close(id);
        },
      },
    ],
  });
};

// 处理关闭按钮点击
const handleClose = () => {
  emit('update:visible', false);
};
</script>

<style scoped lang="scss">
.notice-title {
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.notice-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #666;
}

.notice-content {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 20px;

  // 确保html内容能正常显示
  & > * {
    max-width: 100%;
  }
}

:deep(.layui-layer-btn) {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  .layui-layer-btn0,
  .layui-layer-btn1,
  .layui-layer-btn2 {
    min-width: 80px;
  }
}
</style>
