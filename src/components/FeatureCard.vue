<template>
  <div class="feature-card" :class="cardClass">
    <!-- 免费开源卡片 -->
    <div v-if="type === 'free'" class="feature-number">
      {{ number }}<span class="percentage">%</span>
    </div>

    <!-- 现代技术卡片 -->
    <div v-if="type === 'modern'" class="feature-highlight">
      {{ highlight }}
    </div>

    <!-- 组件库卡片 -->
    <div v-if="type === 'components'" class="feature-number">
      {{ number }}<span class="plus">+</span>
    </div>

    <!-- 长卡片内容 -->
    <div v-if="type === 'long'" class="long-card-content">
      <div class="long-card-left">
        <h3 class="feature-title">{{ title }}</h3>
        <p class="feature-description">{{ description }}</p>
      </div>
      <div class="long-card-right">
        <div class="tech-stack">
          <span v-for="tech in techStack" :key="tech" class="tech-item">{{ tech }}</span>
        </div>
      </div>
    </div>

    <!-- 普通卡片内容 -->
    <template v-if="type !== 'long'">
      <h3 class="feature-title">{{ title }}</h3>
      <p class="feature-description">{{ description }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: 'free' | 'modern' | 'components' | 'long'
  title: string
  description: string
  number?: string
  highlight?: string
  techStack?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  techStack: () => []
})

// 计算卡片样式类
const cardClass = computed(() => {
  switch (props.type) {
    case 'free':
      return 'free-card'
    case 'modern':
      return 'modern-card'
    case 'components':
      return 'components-card'
    case 'long':
      return 'long-card'
    default:
      return ''
  }
})
</script>

<script lang="ts">
import { computed } from 'vue';
export default {
  name: 'FeatureCard'
}
</script>

<style scoped>
.feature-card {
  background: linear-gradient(135deg,
      rgba(31, 41, 55, 0.8) 0%,
      rgba(55, 65, 81, 0.6) 100%);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
      rgba(16, 185, 129, 0.05) 0%,
      rgba(59, 130, 246, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(16, 185, 129, 0.1);
}

.feature-number {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  line-height: 1;
}

.percentage,
.plus {
  font-size: 24px;
  opacity: 0.8;
}

.feature-highlight {
  display: inline-block;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.feature-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.2;
}

.feature-description {
  color: #d1d5db;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

/* 长卡片特殊样式 */
.long-card {
  grid-column: span 2;
}

.long-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.long-card-left {
  flex: 1;
}

.long-card-right {
  flex-shrink: 0;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tech-item {
  background: rgba(75, 85, 99, 0.3);
  color: #d1d5db;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(75, 85, 99, 0.4);
  transition: all 0.3s ease;
}

.tech-item:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .feature-card {
    padding: 24px;
  }

  .long-card {
    grid-column: span 1;
  }

  .long-card-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .feature-number {
    font-size: 36px;
  }

  .feature-title {
    font-size: 20px;
  }

  .feature-description {
    font-size: 14px;
  }
}
</style>
