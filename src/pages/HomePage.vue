<template>
    <div>
        Hello, {{ userInfo.username }}!
        <lay-button type="primary" @click="changeName()">点击改变名称</lay-button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/user';
import type { UserType } from '@/types/user';

const userStore = useUserStore();

const userInfo = ref(userStore.userData);

// 定义一个新用户信息
const userInfo2: UserType = {
    username: '张三'
};

const changeName = () => {
    console.log('已点击！');
    userStore.setUser(userInfo2);
    userInfo.value = userStore.userData;
};

</script>

<style lang="scss" scoped></style>