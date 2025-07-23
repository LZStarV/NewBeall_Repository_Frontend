<template>
  <div class="layout">
    <div class="blur-color-block">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <!-- 左上角紫色块 - 左右摇摆动画 -->
        <path
          d="M0,0 Q10,10 50,40 T70,60 L0,60 Z"
          fill="#BAB0FF"
          filter="blur(6px)"
          opacity="1"
        >
          <animate
            attributeName="d"
            values="
              M0,0 Q10,10 50,40 T70,60 L0,60 Z;
              M0,5 Q15,15 55,35 T75,65 L0,65 Z;
              M0,0 Q10,10 50,40 T70,60 L0,60 Z
            "
            dur="15s"
            repeatCount="indefinite"
          />
        </path>

        <!-- 右上角蓝色块 - 上下浮动动画 -->
        <path
          d="M40,0 Q100,-10 100,30 T50,50 L40,0 Z"
          fill="#65B1F0"
          filter="blur(6px)"
          opacity="0.7"
        >
          <animate
            attributeName="d"
            values="
              M40,0 Q100,-10 100,30 T50,50 L40,0 Z;
              M45,-5 Q100,-15 100,25 T55,55 L45,-5 Z;
              M40,0 Q100,-10 100,30 T50,50 L40,0 Z
            "
            dur="12s"
            repeatCount="indefinite"
          />
        </path>

        <!-- 左下角深蓝色块 - 椭圆缩放动画 -->
        <ellipse
          cx="20"
          cy="80"
          rx="30"
          ry="25"
          fill="#2E7BFF"
          filter="blur(6px)"
          opacity="0.7"
        >
          <animate
            attributeName="rx"
            values="30;35;30"
            dur="10s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="ry"
            values="25;30;25"
            dur="10s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cx"
            values="20;25;20"
            dur="10s"
            repeatCount="indefinite"
          />
        </ellipse>

        <!-- 右下角青色块 - 路径变形动画 -->
        <path
          d="M75,50 Q100,90 100,70 T80,60 L75,100 Z"
          fill="#2FCAED"
          filter="blur(6px)"
          opacity="0.7"
        >
          <animate
            attributeName="d"
            values="
              M75,50 Q100,90 100,70 T80,60 L75,100 Z;
              M80,55 Q100,95 100,75 T85,65 L70,100 Z;
              M75,50 Q100,90 100,70 T80,60 L75,100 Z
            "
            dur="14s"
            repeatCount="indefinite"
          />
        </path>
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
