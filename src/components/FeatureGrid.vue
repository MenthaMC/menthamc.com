<template>
  <div class="features-section" ref="featureCardsContainer">
    <div class="features-grid">
      <FeatureCard type="free" title="免费 & 开源" description="受到许多腐竹的信任" number="100" />

      <FeatureCard type="modern" title="高自定义" description="包含多种实用的功能和和原版修复, 可在配置中自定义" highlight="高度优化" />

      <FeatureCard type="components" title="Github" description="欢迎 Star 和 Fork" number="Star⭐ 35" />

      <FeatureCard type="long" title="更好的性能优化" description="基于Folia的分支，为大型服务器提供更好的性能优化" :tech-stack="techStack" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FeatureCard from './FeatureCard.vue';

// 模板引用
const featureCardsContainer = ref<HTMLElement>();

// 技术栈数据
const techStack = ['Vue 3', 'TypeScript', 'Vite', 'Tailwind CSS'];

// 暴露给父组件的引用
defineExpose({
  featureCardsContainer
});
</script>

<script lang="ts">
export default {
  name: 'FeatureGrid'
};
</script>

<style scoped>
.features-section {
  margin-top: 80px;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.features-section.animate {
  opacity: 1;
  transform: translateY(0);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .features-section {
    margin-top: 60px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
