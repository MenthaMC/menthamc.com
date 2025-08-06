<template>
  <div class="features-section" ref="featureCardsContainer">
    <div class="features-grid">
      <FeatureCard 
        type="free" 
        :title="$t('home.features.items.free.title')"
        :description="$t('home.features.items.free.description')"
        :number="$t('home.features.items.free.number')"
      />

      <FeatureCard 
        type="modern" 
        :title="$t('home.features.items.modern.title')"
        :description="$t('home.features.items.modern.description')"
        :highlight="$t('home.features.items.modern.highlight')"
      />

      <FeatureCard 
        type="components" 
        :title="$t('home.features.items.components.title')"
        :description="$t('featureGrid.components.description')" 
        :number="$t('featureGrid.components.number')" 
      />

      <FeatureCard 
        type="long" 
        :title="$t('featureGrid.long.title')" 
        :description="$t('featureGrid.long.description')" 
        :tech-stack="techStack" 
      />
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
