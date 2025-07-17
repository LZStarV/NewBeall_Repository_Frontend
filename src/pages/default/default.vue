<template>
  <div class="all">
    <!-- 背景 -->
    <section class="blur-color-block">
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
    </section>

    <!-- 返回顶部 -->
    <lay-backtop
      style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12)"
      bgcolor="rgba(255, 255, 255, 0.5)"
      circle
    >
      <template #default>
        <SvgIcon name="back_to_top" class="back-to-top-icon" />
      </template>
    </lay-backtop>

    <!--  侧边固钉-->
    <lay-affix
      style="left: unset"
      class="right-nav-affix"
      v-if="target"
      :target="target"
      position="top"
      :offset="350"
    >
      <div class="right-nav">
        <lay-tooltip trigger="hover">
          <template #content>
            <img
              style="width: 10rem"
              :src="customer_service_QR"
              alt="客服二维码"
            />
          </template>
          <div class="right-nav-item">
            <SvgIcon name="message_2" class="right-nav-img" />
            <div class="right-nav-text">添加客服</div>
          </div>
        </lay-tooltip>
        <div @click="onlineConsultation" class="right-nav-item">
          <SvgIcon name="consultation" class="right-nav-img" />
          <div class="right-nav-text">在线咨询</div>
        </div>
        <div class="right-nav-item">
          <SvgIcon name="feedback" class="right-nav-img" />
          <div class="right-nav-text">反馈建议</div>
        </div>
      </div>
    </lay-affix>

    <lay-layout class="content">
      <!-- 头部导航 -->
      <lay-header class="header-container">
        <lay-menu class="menu">
          <lay-menu-item @click="refreshPage">首页</lay-menu-item>
          <lay-menu-item @click="jumpToSection('function-section')"
            >宣传片</lay-menu-item
          >
          <lay-menu-item>登录 </lay-menu-item>
          <lay-menu-item>
            <lay-button> 注册 </lay-button>
          </lay-menu-item>
        </lay-menu>
      </lay-header>

      <!-- 主内容区 -->
      <lay-body class="main-content">
        <!-- logo区域 -->
        <section class="title-section">
          <img :src="cover_logo" alt="Newbeall" class="img-bottom" />
          <img :src="cover_logo" alt="Newbeall" class="img-top" />

          <div class="text-section">
            <div class="dash"></div>
            <div class="title-text">设计报价管理云平台</div>
            <div class="dash"></div>
          </div>
        </section>

        <!-- 特性展示 -->
        <lay-row space="10" gutter="20" class="features-section">
          <lay-col
            v-for="(feature, index) in features"
            :key="index"
            md="6"
            class="feature-col"
          >
            <lay-container class="feature-item">
              <span class="feature-text">{{ feature.title }}</span>
              <div class="feature-content">
                <p>{{ feature.desc }}</p>
              </div>
            </lay-container>
          </lay-col>
        </lay-row>

        <!-- 数据指标 -->
        <section ref="statsRef" class="stats-section">
          <div v-for="(stat, index) in stats" :key="index">
            <div class="stat-card">
              <div class="stat-value">
                <lay-count-up
                  :ref="(el) => (countUpRefs[index] = el)"
                  :startVal="0"
                  :endVal="stat.value"
                  :autoplay="false"
                  suffix="%"
                ></lay-count-up>
              </div>

              <p class="stat-label">
                {{ stat.label }}
              </p>
            </div>
          </div>
        </section>

        <!-- 功能展示区 -->
        <section class="function-section" id="function-section">
          <p class="function-text">设计报价功能展示</p>

          <div class="function-video-container">
            <video
              class="function-video"
              controls
              preload="metadata"
              :src="video_url"
            >
              您的浏览器不支持视频标签。
            </video>
          </div>
        </section>

        <!-- 谁可以用？ -->
        <section class="usage-section">
          <h1>谁可以用</h1>
          <p>
            针对智能化工程领域<br />无论你是工程集成、产品销售、顾问设计<br />
            只要你有给客户报价的需求<br />都是我们的客户
          </p>
          <lay-row space="10" class="usage-img-container">
            <lay-col
              md="4"
              sm="12"
              xs="24"
              v-for="(item, index) in usageImg"
              :key="index"
            >
              <img class="usage-img" :src="item.url" :alt="item.name" />
            </lay-col>
          </lay-row>
        </section>

        <!-- 平台特权 -->
        <section class="privileged-section">
          <h1>平台会员特别服务</h1>

          <lay-table
            class="privileged-table"
            even
            size="sm"
            height="30rem"
            cellClassName="privileged-table-cell"
            :default-toolbar="false"
            :columns="privilegedColumn"
            :data-source="privilegedData"
          >
          </lay-table>
        </section>

        <!-- 常见问题 -->
        <section class="question-section">
          <h1>常见问题</h1>

          <div class="accordion" id="alternatingAccordion">
            <!-- 循环生成面板项，通过index判断左右 -->
            <div
              v-for="(item, index) in questions"
              :key="index"
              class="accordion-item mb-3"
            >
              <!-- 标题栏：左右交替对齐 -->
              <h2 class="accordion-header" :id="`heading${item.question}`">
                <button
                  class="accordion-button"
                  :class="{ 'ms-auto': index % 2 !== 0 }"
                  type="button"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  :data-bs-target="`#heading${item.question}`"
                  :aria-controls="`heading${item.question}`"
                >
                  {{ item.question }}
                </button>
              </h2>

              <!-- 内容区域：左右交替布局 -->
              <div
                :id="`heading${item.question}`"
                class="accordion-collapse collapse show"
                :aria-labelledby="`heading${item.question}`"
                data-bs-parent="#alternatingAccordion"
              >
                <div class="accordion-body">
                  <div class="row">
                    <!-- 奇数项：内容居左；偶数项：内容居右 -->
                    <div
                      :class="index % 2 === 0 ? 'col-12' : 'col-12 text-end'"
                    >
                      {{ item.answer }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </lay-body>
    </lay-layout>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

import cover_logo from '@assets/image/default/cover_logo.png';
import customer_service_QR from '@assets/image/default/customer_service_QR.jpg';

import {
  features,
  stats,
  usageImg,
  privilegedColumn,
  privilegedData,
  questions,
} from './defaultData.ts';

import SvgIcon from '@com/SvgIcon.vue';

const router = useRouter();

// 展示视频链接
const video_url =
  'https://yx.newbeall.com/video/homeVideo/PlatformPublicity.mp4';
// 固钉目标元素
const target = ref();
// 整个统计区域的DOM
const statsRef = ref(null);
// 存储所有count-up组件实例
const countUpRefs = ref([]);
// 避免重复触发
const hasAnimated = ref(false);

// 刷新页面
const refreshPage = () => {
  window.location.reload();
};

// 跳转至指定id位置，并向上偏移60px
const jumpToSection = (section: string) => {
  const element = document.querySelector(`#${section}`);
  if (element) {
    const y = element.getBoundingClientRect().top - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

// 点击在线咨询事件
const onlineConsultation = () => {
  window.open(
    'https://wpa.qq.com/msgrd?v=1&uin=1473749408&site=qq&menu=yes',
    '_blank',
  );
};

// 判断是否在视口
const isInViewport = (el) => {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  // 宽松判断：元素顶部进入视口底部100px内即触发
  return rect.top < window.innerHeight + 100 && rect.bottom > 0;
};

// 滚动监听逻辑
const handleScroll = () => {
  if (hasAnimated.value) return; // 已执行过则跳过
  if (isInViewport(statsRef.value)) {
    // 触发所有count-up动画
    countUpRefs.value.forEach((instance) => {
      instance?.start(); // 安全调用start方法
    });
    hasAnimated.value = true;
  }
};

nextTick(() => {
  target.value = document.querySelector('.all');
});

onMounted(() => {
  // 挂载时监听滚动
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // 初始检查一次
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
.all {
  height: 500vh;
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
$right-nav-width: 4.5rem;

.right-nav-affix {
  right: 0;
  transition: right $transition-duration $transition-timing-function;
  z-index: 999;

  &::before {
    content: '';
    position: absolute;
    top: 6rem;
    right: 0;
    transform: translateY(-50%);
    width: 10px;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: $border-radius-large 0 0 $border-radius-large;
  }

  &:hover {
    right: $right-nav-width;
  }

  .right-nav {
    width: $right-nav-width;
    padding: 0 1px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: calc($border-radius-large * 2) 0 0
      calc($border-radius-large * 2);
    box-shadow: $box-shadow-base;

    position: absolute;

    .right-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: $spacing-large 0;

      &:hover {
        cursor: pointer;
      }

      .right-nav-img {
        height: 1.2rem;
      }

      .right-nav-text {
        margin-top: $spacing-small;
        font-size: $font-size-extra-small;
      }
    }
  }
}

$header-container-height: 4rem;

.header-container {
  width: 100%;
  height: $header-container-height;
  display: flex;
  justify-content: flex-end;
  background-color: rgba(186, 176, 255, 0.2);
  backdrop-filter: blur(6px);

  position: fixed;
  top: 0;
  left: 0;
  z-index: 3000;

  .menu {
    height: $header-container-height;
    background: rgba(0, 0, 0, 0);
    margin-left: auto;
    align-items: center;
  }
}

$logo-height: 10rem;

// 标题动态模糊效果
@keyframes pulse-blur {
  0%,
  100% {
    filter: blur(2px);
  }
  50% {
    filter: blur(8px);
  }
}

.main-content {
  overflow: hidden;

  .title-section {
    width: 100vw;
    display: flex;
    justify-content: center;

    position: relative;
    top: calc(3 * $header-container-height);
  }
  .img-bottom,
  .img-top {
    height: $logo-height;
    position: absolute;
    top: 0;
    object-fit: cover;
  }

  .img-top {
    opacity: 0.8;
    animation: pulse-blur 5s infinite ease-in-out;
  }

  $text-section-height: 2rem;

  .text-section {
    margin-top: calc($logo-height + 1rem);
    height: $text-section-height;
    display: flex;
    flex-direction: row;
    align-items: center;

    .dash {
      height: 2px;
      width: 2rem;
      background: #ffffff;

      &:nth-child(1) {
        margin-right: $spacing-small;
      }
      &:nth-child(2) {
        margin-left: $spacing-small;
      }
    }

    $title-text-letter-spacing: 2rem;
    .title-text {
      color: #ffffff;
      font-size: $text-section-height;
      letter-spacing: $title-text-letter-spacing;
      text-indent: $title-text-letter-spacing;
    }
  }
}

.features-section {
  margin-top: 23rem;
  background-color: rgba(45, 114, 235, 0.2);

  .feature-col {
    position: relative;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 25%;
      bottom: 25%;
      right: 0;
      width: 1px;
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  .feature-item {
    display: flex;
    flex-direction: column;
    background-color: #00000000;
    color: #ffffff;

    .feature-text {
      margin-top: $spacing-base;
      font-size: $font-size-medium;
      text-align: center;
    }

    .feature-content {
      text-align: center;
      line-height: 1.2rem;
      padding: $spacing-medium 0;
      font-size: $font-size-base;
      opacity: 0.7;
    }
  }
}

.stats-section {
  margin-top: 5rem;
  margin-bottom: $spacing-extra-large;
  width: 100%;
  display: grid;
  grid-auto-flow: column;

  .stat-card {
    text-align: center;

    .stat-value {
      font-size: calc($font-size-extra-large * 3);
      font-weight: bold;
      color: $primary-color;
      opacity: 0.8;
    }

    .stat-label {
      margin-top: $spacing-large;
      font-size: $font-size-extra-large;
      color: #ffffff;
    }
  }
}

.function-section {
  text-align: center;
  margin-top: calc($spacing-extra-large * 2);

  .function-text {
    color: #ffffff;
    font-size: calc($font-size-extra-large * 2);
    margin-bottom: $spacing-medium;
  }

  @media (max-width: 768px) {
    .video-container {
      width: 80%;
    }
  }

  .function-video-container {
    position: relative;
    width: 100%;
    max-width: 640px;
    margin: $spacing-large auto 0 auto;

    .function-video {
      width: 100%;
      height: auto;
      display: block;
    }
  }
}

.usage-section {
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    margin-top: calc($spacing-extra-large * 3);
    color: #ffffff;
    font-size: calc($font-size-extra-large * 3);
  }

  p {
    text-align: center;
    margin-top: $spacing-large;
    color: #ffffff;
    font-size: calc($font-size-large * 1.2);
    line-height: 1.8;
  }

  .usage-img-container {
    margin-top: $spacing-large;
    width: 80%;
  }
}

.privileged-section {
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    margin-top: calc($spacing-extra-large * 3);
    color: #ffffff;
    font-size: calc($font-size-extra-large * 2);
  }

  .privileged-table {
    margin-top: $spacing-large;
    width: 80%;
  }
  .privileged-table-cell {
  }
}

.question-section {
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    margin-top: calc($spacing-extra-large * 3);
    color: #ffffff;
    font-size: calc($font-size-extra-large * 2);
  }

  /* 左侧面板标题样式 */
  .accordion-item:nth-child(odd) .accordion-button {
    background-color: #f8f9fa;
  }

  /* 右侧面板标题样式 */
  .accordion-item:nth-child(even) .accordion-button {
    background-color: #e9ecef;
  }

  /* 内容区域左右间距调整 */
  .accordion-body .col-12 {
    padding: 1rem;
  }
}
</style>
