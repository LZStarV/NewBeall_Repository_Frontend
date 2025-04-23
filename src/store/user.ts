import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import type { UserType } from '@/types/user';

export const useUserStore = defineStore('user', () => {
    // 用户信息定义与默认值
    const userData: Ref<UserType | null> = ref({
        username: '用户'
    });

    // 判断用户信息是否为空
    const hasUser = (): boolean => !!userData.value;

    // 设置用户信息
    const setUser = (newUser: UserType) => {
        userData.value = newUser;
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    // 清除用户信息
    const clearUser = () => {
        userData.value = null;
        localStorage.removeItem('user');
    };

    return {
        userData,
        setUser,
        clearUser,
        hasUser
    };
});