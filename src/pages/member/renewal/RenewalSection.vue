<template>
    <div class="renewal-section">
        <div class="package-grid">
            <div v-for="item in packages" :key="item.key" class="package-card"
                :class="{ active: modelValue === item.key }" @click="$emit('update:modelValue', item.key)">
                <h3>会员续费</h3>
                <div class="duration">{{ item.duration }}</div>
                <div class="price">¥{{ item.price }}</div>
                <div v-if="item.savings" class="savings">节省 ¥{{ item.savings }}</div>
                <div v-if="modelValue === item.key" class="active-icon">✓</div>
            </div>
        </div>

        <!-- 积分抵扣 -->
        <div class="points-deduction">
            <lay-checkbox v-model="usePointsLocal" @change="$emit('update:usePoints', usePointsLocal)">
                使用积分抵扣 (可抵扣{{ deductionAmount }}元)
            </lay-checkbox>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['modelValue', 'usePoints', 'availablePoints'])
const emit = defineEmits(['update:modelValue', 'update:usePoints'])

const usePointsLocal = ref(props.usePoints)

const packages = [
    { key: 'month', duration: '1个月', price: '399.00' },
    { key: 'halfYear', duration: '6个月', price: '2199.00', savings: '195.00' },
    { key: 'year', duration: '12个月', price: '4199.00', savings: '589.00' },
    { key: 'threeYears', duration: '36个月', price: '9999.00', savings: '4365.00' }
]

const deductionRates = {
    month: { rate: 1.0, maxPoints: 100 },
    halfYear: { rate: 1.09, maxPoints: 600 },
    year: { rate: 1.14, maxPoints: 1300 },
    threeYears: { rate: 1.44, maxPoints: 2600 }
}

const deductionAmount = computed(() => {
    const config = deductionRates[props.modelValue] || deductionRates.month
    const maxPoints = Math.min(props.availablePoints || 0, config.maxPoints)
    return Math.floor(maxPoints * config.rate)
})
</script>

<style lang="scss" scoped>
.package-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.package-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.active {
        border-color: #667eea;
        background: #f0f4ff;
    }

    h3 {
        font-size: 16px;
        margin-bottom: 10px;
        color: #333;
    }

    .duration {
        font-size: 18px;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 8px;
    }

    .price {
        font-size: 20px;
        font-weight: bold;
        color: #e74c3c;
        margin-bottom: 5px;
    }

    .savings {
        font-size: 12px;
        color: #27ae60;
    }

    .active-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 20px;
        height: 20px;
        background: #667eea;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
    }
}

.points-deduction {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
}
</style>
