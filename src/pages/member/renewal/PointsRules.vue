<template>
    <div class="points-rules">
        <div class="rules-header" @click="toggleRules">
            <div class="rules-title">
                <lay-icon type="layui-icon-util" />
                积分会员规则
            </div>
            <div class="rules-toggle" :class="{ expanded: showRules }">
                <lay-icon type="layui-icon-down" />
            </div>
        </div>

        <div v-show="showRules" class="rules-content">
            <ol>
                <li>积分永不过期。</li>
                <li>云空间跟随会员一起过期，会员过期积分可以保存3年。</li>
                <li>积分可通过充值获取，也可通过平台活动获取。</li>
                <li>会员续费时，可利用积分抵扣一定金额。</li>
                <li>用户可以直接使用积分下载共享报价等。</li>
                <li>成为会员，才能使用平台的核心功能。</li>
                <li>具体会员续费规则见上方【会员续费】</li>
                <li>本平台保留所有解释权。</li>
            </ol>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const showRules = ref(false);

const toggleRules = () => {
    showRules.value = !showRules.value;
};
</script>

<style lang="scss" scoped>
.points-rules {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    margin-top: 30px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .rules-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 20px;
        background: #f8f9fa;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background: #e9ecef;
        }

        .rules-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            color: #333;
            font-size: 16px;

            .layui-icon {
                color: #667eea;
            }
        }

        .rules-toggle {
            transition: transform 0.3s ease;
            color: #666;

            &.expanded {
                transform: rotate(180deg);
            }
        }
    }

    .rules-content {
        padding: 20px;
        background: white;
        border-top: 1px solid #eee;

        ol {
            margin: 0;
            padding-left: 20px;
            line-height: 1.8;
            color: #555;

            li {
                margin-bottom: 8px;
                font-size: 14px;

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
}

@media (max-width: 768px) {
    .points-rules {
        margin: 20px 0;

        .rules-header {
            padding: 12px 15px;

            .rules-title {
                font-size: 14px;
            }
        }

        .rules-content {
            padding: 15px;

            ol {
                padding-left: 15px;

                li {
                    font-size: 13px;
                }
            }
        }
    }
}
</style>
