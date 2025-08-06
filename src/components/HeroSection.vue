<template>
  <section class="hero-section">
    <AnimatedTitle />
    <p class="hero-description" ref="heroDesc">
      {{ $t('home.hero.description') }}
    </p>
    <HeroActions ref="heroActions" @download="handleDownload" @learn-more="handleLearnMore" />

    <!-- 使用新的特性网格组件 -->
    <FeatureGrid ref="featureGrid" />

    <!-- 使用新的项目网格组件 -->
    <ProjectGrid ref="projectGrid" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useHeroAnimation } from '../composables/useHeroAnimation';
import { useHeroEvents } from '../composables/useHeroEvents';
import AnimatedTitle from './AnimatedTitle.vue';
import FeatureGrid from './FeatureGrid.vue';
import HeroActions from './HeroActions.vue';
import ProjectGrid from './ProjectGrid.vue';

// 组件引用
const featureGrid = ref();
const projectGrid = ref();

// 使用动画逻辑
const {
  heroDesc,
  heroActions,
  initAnimation
} = useHeroAnimation();

// 使用事件处理
const { handleDownload, handleLearnMore } = useHeroEvents();

// 生命周期
onMounted(() => {
  // 初始化动画，传入子组件的容器引用
  const featureCardsContainer = featureGrid.value?.featureCardsContainer;
  const mainProjectsContainer = projectGrid.value?.mainProjectsContainer;

  initAnimation({
    featureCardsContainer,
    mainProjectsContainer
  });
});
</script>

<style scoped>
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  padding: 120px 0 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-description {
  font-size: 20px;
  color: #9ca3af;
  margin-bottom: 40px;
  max-width: 600px;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    padding: 100px 0 60px;
    min-height: calc(100vh - 100px);
  }

  .hero-description {
    font-size: 18px;
    margin-bottom: 32px;
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 80px 0 40px;
  }

  .hero-description {
    font-size: 16px;
    margin-bottom: 24px;
  }
}
</style>
