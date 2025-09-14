<template>
  <div class="video-container">
    <!-- 视频列表 -->
    <div class="video-tabs">
      <div class="tab-list">
        <div
          v-for="(item, index) in videoList"
          :key="index"
          class="tab-item"
          :class="{ active: openCategories[index] }"
          @click="toggleCategory(index)"
        >
          <SvgIcon :name="`${iconSvgMap[item.icon]}`" class="icon" />
          {{ item.name }}
        </div>
      </div>

      <div
        v-if="currentCategory && currentCategory.child"
        class="sub-tabs-wrapper"
      >
        <!-- 移动端当前选中项展示 -->
        <div class="mobile-selected" @click="toggleSubMenu">
          <span>{{
            selectedVideo?.name || currentCategory.child[0].name
          }}</span>
          <SvgIcon
            :name="isSubMenuOpen ? 'expand_light_reverse' : 'expand_light'"
            class="toggle-icon"
            width="0.75rem"
            height="0.75rem"
          />
        </div>
        <!-- 子菜单列表 -->
        <div class="sub-tabs" :class="{ 'sub-tabs-open': isSubMenuOpen }">
          <div
            v-for="(subItem, subIndex) in currentCategory.child"
            :key="subIndex"
            class="sub-tab-item"
            :class="{ active: selectedVideo?.url === subItem.url }"
            @click="selectVideo(subItem)"
          >
            {{ subItem.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 视频播放区域 -->
    <div v-if="selectedVideo" class="video-player">
      <div class="video-title">{{ selectedVideo.name }}-指引视频</div>
      <video
        controls
        :poster="`${env.getApiBaseUrl()}/static/img/helpImg/video.gif`"
        :src="`${env.getBaseStaticUrl()}${selectedVideo.url}`"
        class="player"
      >
        你的浏览器不支持此视频播放
      </video>
      <!-- 视频描述 -->
      <div v-if="selectedVideo.videoDesc" class="video-description">
        {{ selectedVideo.videoDesc }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import videoApi from '@/api/video/videoApi';
import type { VideoData } from '@/api/video/videoApi.type';
import env from '@/utils/env';
import SvgIcon from '@/components/SvgIcon.vue';
import notify from '@/utils/notify';

const videoList = ref<VideoData[]>([]);
const openCategories = ref<boolean[]>([]);
const selectedVideo = ref<VideoData | null>(null);
const isSubMenuOpen = ref(false);

// 图标
const iconSvgMap: Record<string, string> = {
  'glyphicon glyphicon-blackboard': 'admin',
  'glyphicon glyphicon-folder-open': 'product',
  'glyphicon glyphicon-user': 'groups',
  'glyphicon glyphicon-list-alt': 'historical_quotation',
  'glyphicon glyphicon-list': 'order_large',
  'glyphicon glyphicon-search': 'approval',
};

const currentCategory = computed(() => {
  const activeIndex = openCategories.value.findIndex((isOpen) => isOpen);
  return activeIndex !== -1 ? videoList.value[activeIndex] : null;
});

const getVideoList = async () => {
  try {
    const response =
      (await videoApi.getVideoHelpList()) as unknown as VideoData[];
    videoList.value = response;
    openCategories.value = new Array(response.length).fill(false);
    // 默认选中第一个标签
    if (response.length > 0) {
      toggleCategory(0);
    }
  } catch {
    notify.error('网络请求失败，请重试');
  }
};

const toggleCategory = (index: number) => {
  openCategories.value = openCategories.value.map((_, i) => i === index);
  // 自动选择第一个子视频
  if (videoList.value[index]?.child?.length > 0) {
    selectVideo(videoList.value[index].child[0]);
  }
  // 重置子菜单状态
  isSubMenuOpen.value = false;
};

const toggleSubMenu = () => {
  isSubMenuOpen.value = !isSubMenuOpen.value;
};

const selectVideo = (video: VideoData) => {
  selectedVideo.value = video;
  // 选择视频后关闭子菜单
  isSubMenuOpen.value = false;
};

onMounted(() => {
  getVideoList();
});
</script>

<style scoped lang="scss">
.video-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: 12px;

  @media (max-width: 768px) {
    gap: 0.75rem;
    padding: 0.75rem;
  }
}

.video-tabs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0.5rem;
    gap: 0.5rem;
    border-radius: 8px;
  }
}

.tab-list {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  position: relative;
  justify-content: space-between;
  padding-top: 1px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 0.25rem;
  }

  @media (max-width: 480px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    padding: 0.2rem;
  }

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;

    &:hover {
      background: #cbd5e1;
    }
  }
}

.tab-item {
  padding: 0.8rem 2rem;
  cursor: pointer;
  border-radius: 8px;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  position: relative;
  border: 1px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    padding: 0.5rem 0.25rem;
    font-size: 0.8rem;
    min-height: 2.5rem;
    gap: 0.25rem;
  }

  &:hover {
    background: #f1f5f9;
    border-color: #e2e8f0;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &.active {
    background: $primary-color;
    color: white;
    border-color: $primary-color;
    box-shadow: 0 2px 8px $border-color-base;

    .icon {
      color: white;
    }
  }

  .icon {
    color: $primary-color;
  }
}

.sub-tabs-wrapper {
  position: relative;
  width: 100%;

  @media (max-width: 768px) {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
  }
}

.mobile-selected {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    cursor: pointer;
    background: white;
    border-radius: 6px;

    &:hover {
      background: #f1f5f9;
    }

    .toggle-icon {
      width: 0.9rem;
      height: 0.9rem;
      transition: transform 0.3s ease;

      &.rotated {
        transform: rotate(90deg);
      }
    }
  }
}

.sub-tabs {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-radius: 8px;
    margin-top: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 10;

    &.sub-tabs-open {
      display: flex;
    }
  }

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;

    &:hover {
      background: #cbd5e1;
    }
  }
}

.sub-tab-item {
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  border-radius: 6px;
  white-space: nowrap;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    border-radius: 0;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #f1f5f9;
    }
  }

  &:hover {
    color: $primary-color;
  }

  &.active {
    color: $primary-color;
    @media (max-width: 768px) {
      background-color: #f1f5f9;
    }
  }
}

.video-player {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.75rem;
    border-radius: 8px;
  }

  .player {
    width: 100%;
    height: calc(100% - 60px);
    border-radius: 8px;
    background: #000;
    object-fit: contain;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .video-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    padding: 0.2rem;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 1rem;
      padding: 0.1rem;
    }
  }

  .video-description {
    padding: 1rem;
    background-color: #f8fafc;
    border-radius: 8px;
    color: #334155;
    font-size: 0.95rem;
    line-height: 1.6;

    @media (max-width: 768px) {
      padding: 0.75rem;
      font-size: 0.85rem;
      line-height: 1.5;
    }
  }
}
</style>
