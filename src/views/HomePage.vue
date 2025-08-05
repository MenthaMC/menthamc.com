<template>
  <main class="home-page">
    <!-- 欢迎区域 -->
    <WelcomeSection />

    <!-- 特性展示区域 -->
    <FeaturesShowcase />

    <!-- 项目展示区域 -->
    <ProjectsShowcase />
  </main>
</template>

<script setup lang="ts">
import FeaturesShowcase from '../components/home/FeaturesShowcase.vue';
import ProjectsShowcase from '../components/home/ProjectsShowcase.vue';
import WelcomeSection from '../components/home/WelcomeSection.vue';
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(180deg,
      rgba(17, 24, 39, 1) 0%,
      rgba(31, 41, 55, 0.95) 25%,
      rgba(55, 65, 81, 0.9) 50%,
      rgba(31, 41, 55, 0.95) 75%,
      rgba(17, 24, 39, 1) 100%);
  position: relative;
  overflow-x: hidden;
}

.home-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.home-page>* {
  position: relative;
  z-index: 1;
}

/* 全局滚动优化 */
@media (prefers-reduced-motion: no-preference) {
  .home-page {
    scroll-behavior: smooth;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-page {
    background: linear-gradient(180deg,
        rgba(17, 24, 39, 1) 0%,
        rgba(31, 41, 55, 0.98) 50%,
        rgba(17, 24, 39, 1) 100%);
  }
}
</style>
