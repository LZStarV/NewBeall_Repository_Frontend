<template>
  <BaseCard title="我的临时报价">
    <div class="quote-content">
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
import BaseCard from './BaseCard.vue';

</script>

<style lang="scss" scoped>
.quote-content {
  height: 100%;
  @include flex(column);
}
</style>
