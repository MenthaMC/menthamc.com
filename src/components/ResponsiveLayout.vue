<template>
  <div class="responsive-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式断点定义
const breakpoints = {
  xs: 320,   // 超小屏幕（小手机）
  sm: 576,   // 小屏幕（手机）
  md: 768,   // 中等屏幕（平板）
  lg: 992,   // 大屏幕（小桌面）
  xl: 1200,  // 超大屏幕（桌面）
  xxl: 1400  // 超超大屏幕（大桌面）
}

const screenSize = ref('xl')
const screenWidth = ref(window.innerWidth)

const updateScreenSize = () => {
  screenWidth.value = window.innerWidth
  
  if (screenWidth.value < breakpoints.sm) {
    screenSize.value = 'xs'
  } else if (screenWidth.value < breakpoints.md) {
    screenSize.value = 'sm'
  } else if (screenWidth.value < breakpoints.lg) {
    screenSize.value = 'md'
  } else if (screenWidth.value < breakpoints.xl) {
    screenSize.value = 'lg'
  } else if (screenWidth.value < breakpoints.xxl) {
    screenSize.value = 'xl'
  } else {
    screenSize.value = 'xxl'
  }
  
  // 更新CSS自定义属性
  document.documentElement.style.setProperty('--screen-width', `${screenWidth.value}px`)
  document.documentElement.setAttribute('data-screen-size', screenSize.value)
}

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})
</script>

<style>
/* 响应式容器基础样式 */
.responsive-layout {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

/* CSS自定义属性 */
:root {
  --container-max-width: 1200px;
  --container-padding: 20px;
  --nav-height: 64px;
  --mobile-nav-height: 56px;
  --content-spacing: 2rem;
  --mobile-content-spacing: 1rem;
}

/* 响应式容器 */
.container {
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  box-sizing: border-box;
}

/* 响应式网格系统 */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
}

.col {
  flex: 1;
  padding: 0 15px;
  box-sizing: border-box;
}

/* 超小屏幕适配 (< 576px) */
@media (max-width: 575.98px) {
  :root {
    --container-padding: 16px;
    --nav-height: 48px;
    --content-spacing: 1.25rem;
    --mobile-content-spacing: 1rem;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .row {
    margin: 0 -10px;
  }
  
  .col {
    padding: 0 10px;
    flex: 0 0 100%;
  }
  
  /* 文字大小调整 */
  html {
    font-size: 15px;
  }
  
  h1 { font-size: 2rem; }
  h2 { font-size: 1.6rem; }
  h3 { font-size: 1.4rem; }
  h4 { font-size: 1.2rem; }
  h5 { font-size: 1.1rem; }
  h6 { font-size: 1rem; }
  
  /* 移动端触摸优化 */
  a, button, input[type="button"], input[type="submit"] {
    min-height: 44px;
    min-width: 44px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* 移动端滚动优化 */
  .responsive-layout {
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
}

/* 小屏幕适配 (576px - 767.98px) */
@media (min-width: 576px) and (max-width: 767.98px) {
  :root {
    --container-padding: 20px;
    --nav-height: 56px;
    --content-spacing: 1.75rem;
    --mobile-content-spacing: 1.25rem;
  }
  
  .container {
    padding: 0 20px;
  }
  
  .row {
    margin: 0 -12px;
  }
  
  .col {
    padding: 0 12px;
  }
  
  .col-sm-6 { flex: 0 0 50%; }
  .col-sm-12 { flex: 0 0 100%; }
  
  html {
    font-size: 16px;
  }
  
  /* 平板触摸优化 */
  a, button, input[type="button"], input[type="submit"] {
    min-height: 44px;
    min-width: 44px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
}

/* 中等屏幕适配 (768px - 991.98px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  :root {
    --container-padding: 24px;
    --nav-height: 60px;
    --content-spacing: 2rem;
  }
  
  .container {
    padding: 0 24px;
    max-width: 720px;
  }
  
  .col-md-4 { flex: 0 0 33.333333%; }
  .col-md-6 { flex: 0 0 50%; }
  .col-md-8 { flex: 0 0 66.666667%; }
  .col-md-12 { flex: 0 0 100%; }
}

/* 大屏幕适配 (992px - 1199.98px) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  :root {
    --container-padding: 24px;
    --nav-height: 64px;
    --content-spacing: 2rem;
  }
  
  .col-lg-3 { flex: 0 0 25%; }
  .col-lg-4 { flex: 0 0 33.333333%; }
  .col-lg-6 { flex: 0 0 50%; }
  .col-lg-8 { flex: 0 0 66.666667%; }
  .col-lg-9 { flex: 0 0 75%; }
  .col-lg-12 { flex: 0 0 100%; }
}

/* 超大屏幕适配 (≥ 1200px) */
@media (min-width: 1200px) {
  :root {
    --container-max-width: 1200px;
    --container-padding: 30px;
    --nav-height: 64px;
    --content-spacing: 2.5rem;
  }
  
  .col-xl-2 { flex: 0 0 16.666667%; }
  .col-xl-3 { flex: 0 0 25%; }
  .col-xl-4 { flex: 0 0 33.333333%; }
  .col-xl-6 { flex: 0 0 50%; }
  .col-xl-8 { flex: 0 0 66.666667%; }
  .col-xl-9 { flex: 0 0 75%; }
  .col-xl-10 { flex: 0 0 83.333333%; }
  .col-xl-12 { flex: 0 0 100%; }
}

/* 超超大屏幕适配 (≥ 1400px) */
@media (min-width: 1400px) {
  :root {
    --container-max-width: 1320px;
    --container-padding: 40px;
    --content-spacing: 3rem;
  }
}

/* 响应式工具类 */
.d-none { display: none !important; }
.d-block { display: block !important; }
.d-flex { display: flex !important; }

/* 移动端显示/隐藏 */
@media (max-width: 767.98px) {
  .d-mobile-none { display: none !important; }
  .d-mobile-block { display: block !important; }
  .d-mobile-flex { display: flex !important; }
}

/* 桌面端显示/隐藏 */
@media (min-width: 768px) {
  .d-desktop-none { display: none !important; }
  .d-desktop-block { display: block !important; }
  .d-desktop-flex { display: flex !important; }
}

/* 文本对齐 */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

@media (max-width: 767.98px) {
  .text-mobile-center { text-align: center; }
  .text-mobile-left { text-align: left; }
}

/* 间距工具类 */
.m-0 { margin: 0 !important; }
.mt-1 { margin-top: 0.25rem !important; }
.mt-2 { margin-top: 0.5rem !important; }
.mt-3 { margin-top: 1rem !important; }
.mt-4 { margin-top: 1.5rem !important; }
.mt-5 { margin-top: 3rem !important; }

.mb-1 { margin-bottom: 0.25rem !important; }
.mb-2 { margin-bottom: 0.5rem !important; }
.mb-3 { margin-bottom: 1rem !important; }
.mb-4 { margin-bottom: 1.5rem !important; }
.mb-5 { margin-bottom: 3rem !important; }

.p-0 { padding: 0 !important; }
.pt-1 { padding-top: 0.25rem !important; }
.pt-2 { padding-top: 0.5rem !important; }
.pt-3 { padding-top: 1rem !important; }
.pt-4 { padding-top: 1.5rem !important; }
.pt-5 { padding-top: 3rem !important; }

.pb-1 { padding-bottom: 0.25rem !important; }
.pb-2 { padding-bottom: 0.5rem !important; }
.pb-3 { padding-bottom: 1rem !important; }
.pb-4 { padding-bottom: 1.5rem !important; }
.pb-5 { padding-bottom: 3rem !important; }

/* 移动端特殊间距 */
@media (max-width: 767.98px) {
  .mt-mobile-2 { margin-top: 0.5rem !important; }
  .mt-mobile-3 { margin-top: 1rem !important; }
  .mt-mobile-4 { margin-top: 1.5rem !important; }
  .mt-mobile-5 { margin-top: 2.5rem !important; }
  
  .mb-mobile-2 { margin-bottom: 0.5rem !important; }
  .mb-mobile-3 { margin-bottom: 1rem !important; }
  .mb-mobile-4 { margin-bottom: 1.5rem !important; }
  .mb-mobile-5 { margin-bottom: 2.5rem !important; }
  
  .mx-mobile-auto { margin-left: auto !important; margin-right: auto !important; }
  .my-mobile-2 { margin-top: 0.5rem !important; margin-bottom: 0.5rem !important; }
  .my-mobile-3 { margin-top: 1rem !important; margin-bottom: 1rem !important; }
  
  .px-mobile-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
  .px-mobile-3 { padding-left: 1rem !important; padding-right: 1rem !important; }
  .py-mobile-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
  .py-mobile-3 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
  
  /* 移动端字体大小 */
  .text-mobile-sm { font-size: 0.875rem !important; }
  .text-mobile-md { font-size: 1rem !important; }
  .text-mobile-lg { font-size: 1.25rem !important; }
  .text-mobile-xl { font-size: 1.5rem !important; }
  
  /* 移动端弹性布局 */
  .flex-mobile-column { flex-direction: column !important; }
  .flex-mobile-row { flex-direction: row !important; }
  .justify-mobile-center { justify-content: center !important; }
  .align-mobile-center { align-items: center !important; }
  .gap-mobile-2 { gap: 0.5rem !important; }
  .gap-mobile-3 { gap: 1rem !important; }
}
</style>