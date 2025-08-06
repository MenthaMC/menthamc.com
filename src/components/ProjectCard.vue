<template>
  <div class="project-card" :class="{ 'featured-project': featured }" :data-featured-text="$t('home.projects.featured')">
    <div class="project-header">
      <!-- 可以在这里添加项目图标或徽章 -->
    </div>
    <h3 class="project-title">{{ title }}</h3>
    <p class="project-description">{{ description }}</p>
    <div class="project-stats">
      <span v-for="stat in stats" :key="stat" class="stat-item">{{ stat }}</span>
    </div>
    <div class="project-actions">
      <button class="btn-primary" @click="handleDetail">{{ $t('home.projects.actions.viewDetail') }}</button>
      <button class="btn-secondary" @click="handleGitHub">{{ $t('home.projects.actions.github') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  stats: string[];
  githubUrl: string;
  featured?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  featured: false
});

// 事件定义
const emit = defineEmits<{
  detail: [projectType: string];
  github: [url: string];
}>();

// 事件处理函数
const handleDetail = () => {
  emit('detail', props.title);
};

const handleGitHub = () => {
  emit('github', props.githubUrl);
};
</script>

<script lang="ts">
export default {
  name: 'ProjectCard'
};
</script>

<style scoped>
.project-card {
  background: linear-gradient(135deg,
      rgba(31, 41, 55, 0.9) 0%,
      rgba(55, 65, 81, 0.7) 100%);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.project-card::before {
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

.project-card:hover::before {
  opacity: 1;
}

.project-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(16, 185, 129, 0.1);
}

.featured-project {
  border: 2px solid rgba(16, 185, 129, 0.3);
  background: linear-gradient(135deg,
      rgba(16, 185, 129, 0.1) 0%,
      rgba(31, 41, 55, 0.9) 20%,
      rgba(55, 65, 81, 0.7) 100%);
}

.featured-project::after {
  content: attr(data-featured-text);
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.project-header {
  height: 40px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  line-height: 1.2;
}

.project-description {
  color: #d1d5db;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
  flex-grow: 1;
}

.project-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.stat-item {
  background: rgba(75, 85, 99, 0.3);
  color: #d1d5db;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(75, 85, 99, 0.4);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.project-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  text-align: center;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-secondary {
  background: rgba(75, 85, 99, 0.3);
  color: #d1d5db;
  border: 1px solid rgba(75, 85, 99, 0.4);
}

.btn-secondary:hover {
  background: rgba(75, 85, 99, 0.5);
  color: #ffffff;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .project-card {
    padding: 24px;
  }

  .project-title {
    font-size: 24px;
  }

  .project-description {
    font-size: 14px;
  }

  .project-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    flex: none;
  }
}
</style>
