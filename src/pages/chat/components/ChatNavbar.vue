<template>
  <div class="chat-nav-bar">
    <div class="avatar-wrapper">
      <Avatar :url="userInfo?.avatar" radius size="3rem" />
    </div>
    <div class="nav-items">
      <div
        class="nav-item"
        title="临时聊天"
        :class="{ active: activeNavItem === '临时聊天' }"
        @click="setNavItem('临时聊天')"
      >
        <SvgIcon name="information" width="1.25rem" height="1.25rem" />
      </div>
      <div
        v-for="item of navItemsList"
        :key="item.groupName"
        class="nav-item"
        :title="item.groupName"
        :class="{ active: activeNavItem === item.groupName }"
        @click="setNavItem(item.groupName)"
      >
        <SvgIcon :name="item.icon" width="1.25rem" height="1.25rem" />
      </div>
      <div class="nav-item" title="微信客服">
        <SvgIcon name="wechat" width="1.25rem" height="1.25rem" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';
import type { ContactGroup, UserInfo } from '../Chat.type';
import { getContactGroup } from '@/api/chat/chatApi';
import Avatar from '@/components/Avatar.vue';

const navItemsList = ref<ContactGroup[]>();

const activeNavItem = ref('临时聊天');

const setNavItem = (navItemName: string) => {
  activeNavItem.value = navItemName;
  if (navItemName == '临时聊天') {
    emit('update-contact-list', 'temp');
  }
  const url = navItemsList.value?.find(
    (item) => item.groupName === navItemName,
  )?.url;
  if (url) emit('update-contact-list', url);
};

const props = defineProps<{ userInfo: UserInfo; newItemUrl: string }>();

const emit = defineEmits<{
  (event: 'update-contact-list', contactListUrl: string): void;
  (event: 'nav-items-list-loaded', navItemsList: ContactGroup[]): void;
}>();

watch(
  () => props.newItemUrl,
  (val) => {
    if (val === 'temp') {
      setNavItem('临时聊天');
    }
  },
);

const iconSvgMap: Record<string, string> = {
  '&#xe62e;': 'company', // 公司
  '&#xe690;': 'group_chat', // 群聊
  '&#xe66f;': 'product_supplier', // 产品供应商
  '&#xe654;': 'historical_quotation', // 历史报价单
  '&#xe66b;': 'order_receive_order', // 订单接收单
  '&#xe7a1;': 'send', // 订单发送单
};

onMounted(async () => {
  const res: { data: ContactGroup[] } = await getContactGroup();
  res.data.forEach((element) => {
    element.icon = iconSvgMap[element.icon];
  });
  navItemsList.value = res.data;
  emit('nav-items-list-loaded', res.data);
});
</script>

<style scoped lang="scss">
.chat-nav-bar {
  height: 100%;
  width: 65px;
  padding: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-right: 1px solid #ededed;

  .avatar-wrapper {
    margin-bottom: 2rem;
  }

  .nav-items {
    display: flex;
    flex-direction: column;

    gap: 1rem;

    .nav-item {
      padding: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: $border-radius-base;
      cursor: pointer;

      &:hover {
        background-color: #deedff;
        color: #2b5bb2;
      }

      &.active {
        background-color: #deedff;
        color: #2b5bb2;
      }
    }
  }
}
</style>
