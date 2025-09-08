<template>
    <div class="points-section">
        <div class="package-grid">
            <div v-for="item in packages" :key="item.key" class="package-card"
                :class="{ active: modelValue === item.key }" @click="$emit('update:modelValue', item.key)">
                <h3>充值积分</h3>
                <div class="points">{{ item.points }}积分</div>
                <div class="price">¥{{ item.price }}</div>
                <div v-if="modelValue === item.key" class="active-icon">✓</div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])

const packages = [
    { key: '50', points: '50', price: '50.00' },
    { key: '110', points: '110', price: '100.00' },
    { key: '580', points: '580', price: '500.00' },
    { key: '1250', points: '1250', price: '1000.00' }
]
</script>

<style lang="scss" scoped>
.package-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
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

    .points {
        font-size: 18px;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 8px;
    }

    .price {
        font-size: 20px;
        font-weight: bold;
        color: #e74c3c;
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
</style>
