<template>
  <div class="layout">
    <div class="blur-color-block">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <!-- 左上角紫色块 -->
        <path
          d="M0,0 Q10,10 50,40 T70,60 L0,60 Z"
          fill="#BAB0FF"
          filter="blur(6px)"
          opacity="1"
        />
        <!-- 右上角蓝色块 -->
        <path
          d="M40,0 Q100,-10 100,30 T50,50 L40,0 Z"
          fill="#65B1F0"
          filter="blur(6px)"
          opacity="0.7"
        />
        <!-- 左下角深蓝色块 -->
        <ellipse
          cx="20"
          cy="80"
          rx="30"
          ry="25"
          fill="#2E7BFF"
          filter="blur(6px)"
          opacity="0.7"
        />
        <!-- 右下角青色块 -->
        <path
          d="M75,50 Q100,90 100,70 T80,60 L75,100 Z"
          fill="#2FCAED"
          filter="blur(6px)"
          opacity="0.7"
        />
      </svg>
    </div>
    <slot name="content"></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.layout {
  overflow: hidden;

  .blur-color-block {
    position: fixed;
    top: 0;
    left: 0;
    background-color: #bab0ff;
    width: 100vw;
    height: 100vh;
    z-index: -1;

    svg {
      display: block;
      width: 100%;
      height: 100%;
      transform: translateZ(0); // 硬件加速，提升性能
      backface-visibility: hidden; // 优化渲染
    }
  }
}
</style>
