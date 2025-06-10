<template>
  <nav
    class="breadcrumb"
    aria-label="breadcrumb"
  >
    <ol class="breadcrumb-list">
      <li
        v-for="(item, index) in breadcrumbItems"
        :key="index"
        class="breadcrumb-item"
        :class="{ 'is-active': index === breadcrumbItems.length - 1 }"
      >
        <span
          v-if="index < breadcrumbItems.length - 1"
          class="breadcrumb-link"
          @click="navigateTo(item.path)"
        >
          {{ item.title }}
        </span>
        <span
          v-else
          class="breadcrumb-current"
        >
          {{ item.title }}
        </span>
        <span
          v-if="index < breadcrumbItems.length - 1"
          class="separator"
        >/</span>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const breadcrumbItems = computed(() => {
  const matched = route.matched;
  const items: { title: string; path: string }[] = [];
  matched.forEach((record) => {
    if (record.meta?.title && record.path) {
      items.push({
        title: record.meta.title as string,
        path: record.path,
      });
    }
  });
  return items;
});

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

  <style scoped>
  .breadcrumb {
    padding: 10px 0;
    font-size: 14px;
    color: #666;
  }

  .breadcrumb-list {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .breadcrumb-item {
    display: flex;
    align-items: center;
    transition: all 0.3s ease; /* 动画过渡效果 */
  }

  .breadcrumb-link {
    cursor: pointer;
    color: #007bff;
    text-decoration: none;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }

  .breadcrumb-link:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px); /* 微动画：轻微上移 */
  }

  .breadcrumb-current {
    color: #333;
    font-weight: 500;
    padding: 4px 8px;
  }

  .separator {
    margin: 0 8px;
    color: #999;
  }

  .is-active .breadcrumb-current {
    animation: fadeIn 0.5s ease; /* 当前项淡入动画 */
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>