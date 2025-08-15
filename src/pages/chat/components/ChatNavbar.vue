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
      <div class="nav-item" title="微信客服" @click="showQRCode = true">
        <SvgIcon name="wechat" width="1.25rem" height="1.25rem" />
      </div>
    </div>
  </div>

  <!-- 微信客服二维码弹窗 -->
  <div v-if="showQRCode" class="qr-code-modal">
    <div class="qr-code-content">
      <div class="close-btn" @click="showQRCode = false">×</div>
      <h3>微信扫一扫，添加微信客服</h3>
      <div class="qr-code-img">
        <img
          src="@/assets/image/default/customer_service_QR.jpg"
          alt="微信客服二维码"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { ContactGroup, UserInfo } from '../Chat.type';
import { getContactGroup } from '@/api/chat/chatApi';
import { useChatStore } from '@/stores/chat';

const navItemsList = ref<ContactGroup[]>();

const activeNavItem = ref('临时聊天');
const showQRCode = ref(false);

const chatStore = useChatStore();

const setNavItem = (navItemName: string) => {
  activeNavItem.value = navItemName;
  if (navItemName == '临时聊天') {
    chatStore.setActiveNavItem('temp');
  }
  const url = navItemsList.value?.find(
    (item) => item.groupName === navItemName,
  )?.url;
  if (url) {
    chatStore.setActiveNavItem(url);
  }
};

const userInfo = ref<UserInfo>();

onMounted(async () => {
  await chatStore.setUserInfo();
  userInfo.value = chatStore.userInfoData!;
});

const emit = defineEmits<{
  (event: 'nav-items-list-loaded', navItemsList: ContactGroup[]): void;
}>();

watch(
  () => chatStore.activeNavItem,
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
  const res = await getContactGroup();
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

.qr-code-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .qr-code-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    position: relative;
    text-align: center;
    max-width: 300px;

    .close-btn {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;

      &:hover {
        color: #333;
      }
    }

    h3 {
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
      color: #333;
    }

    .qr-code-img {
      img {
        max-width: 100%;
        height: auto;
      }
    }
  }
}
</style>
