<template>
  <section class="projects-showcase">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">我们的项目</h2>
        <p class="section-description">
          探索我们为 Minecraft 社区开发的高质量开源项目
        </p>
      </div>

      <div class="projects-grid">
        <div class="project-card featured" v-for="(project, index) in projects" :key="index"
          :class="{ featured: project.featured }">
          <!-- 左侧图标区域 -->
          <div class="project-left">
            <div class="project-icon">
              <span v-html="project.icon"></span>
            </div>
            <div class="project-status" v-if="project.status">
              <span class="status-badge" :class="project.status.type">
                {{ project.status.text }}
              </span>
            </div>
          </div>

          <!-- 中间内容区域 -->
          <div class="project-content">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ project.description }}</p>

            <div class="project-features">
              <div class="feature-tag" v-for="feature in project.features" :key="feature">
                {{ feature }}
              </div>
            </div>

            <div class="project-stats">
              <div class="stat-item">
                <span class="stat-icon">⭐</span>
                <span class="stat-value">{{ project.stats.stars }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon">🍴</span>
                <span class="stat-value">{{ project.stats.forks }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon">📦</span>
                <span class="stat-value">{{ project.stats.version }}</span>
              </div>
            </div>
          </div>

          <!-- 右侧操作区域 -->
          <div class="project-actions">
            <button class="action-btn primary" @click="handleDownload(project)">
              <span class="btn-icon">⬇️</span>
              <span>下载</span>
            </button>
            <button class="action-btn secondary" @click="handleGitHub(project.githubUrl)">
              <span class="btn-icon">🔗</span>
              <span>GitHub</span>
            </button>
          </div>

          <div class="project-glow" v-if="project.featured"></div>
        </div>
      </div>

      <div class="more-projects">
        <p class="more-text">还有更多项目正在开发中...</p>
        <button class="more-btn" @click="handleViewAll">
          <span>查看全部项目</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const projects = [
  {
    title: 'Mint',
    description: 'Mint 是基于 Folia 的分支，致力于提供更好的整体性能和原版机制支持。经过深度优化，为大型服务器提供卓越的性能表现。',
    icon: '🌿',
    featured: true,
    status: {
      type: 'stable',
      text: '稳定版'
    },
    features: ['多线程优化', '原版兼容', '高性能', '稳定可靠'],
    stats: {
      stars: '35',
      forks: '2',
      version: '1.21.8'
    },
    githubUrl: 'https://github.com/MenthaMC/Mint'
  },
  {
    title: 'LemonMint',
    description: '基于 Mint 制作的服务端，正努力让更多的 Bukkit 插件能够运行，并且在原基础上修复被破坏的特性和改进性能。',
    icon: '🍋',
    featured: false,
    status: {
      type: 'beta',
      text: '测试版'
    },
    features: ['插件兼容', '性能优化', '特性修复', '持续更新'],
    stats: {
      stars: '9',
      forks: '1',
      version: '1.21.8'
    },
    githubUrl: 'https://github.com/MenthaMC/LemonMint'
  }
];

const handleDownload = (project: any) => {
  console.log('下载项目:', project.title);
  router.push('/download');
};

const handleGitHub = (url: string) => {
  window.open(url, '_blank');
};

const handleViewAll = () => {
  window.open('https://github.com/MenthaMC', '_blank');
};
</script>

<style scoped>
.projects-showcase {
  padding: 120px 0;
  background: linear-gradient(180deg,
      rgba(17, 24, 39, 0.8) 0%,
      rgba(31, 41, 55, 0.6) 50%,
      rgba(17, 24, 39, 0.8) 100%);
  position: relative;
  overflow: hidden;
}

.projects-showcase::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-description {
  font-size: 1.25rem;
  color: #9ca3af;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.projects-grid {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 80px;
}

.project-card {
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 24px;
  padding: 32px;
  position: relative;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 32px;
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
  transform: translateY(-8px);
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.project-card.featured {
  border: 2px solid rgba(16, 185, 129, 0.3);
  background: linear-gradient(135deg,
      rgba(16, 185, 129, 0.1) 0%,
      rgba(31, 41, 55, 0.8) 20%,
      rgba(31, 41, 55, 0.8) 100%);
}

.project-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.project-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  position: relative;
}

.project-icon::after {
  content: '';
  position: absolute;
  inset: 2px;
  background: rgba(17, 24, 39, 0.9);
  border-radius: 18px;
  z-index: -1;
}

.project-status {
  position: relative;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.status-badge.stable {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.status-badge.beta {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.project-content {
  flex: 1;
  padding: 0 16px;
}

.project-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
}

.project-description {
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 24px;
  font-size: 16px;
}

.project-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.feature-tag {
  background: rgba(75, 85, 99, 0.3);
  color: #d1d5db;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(75, 85, 99, 0.4);
  transition: all 0.3s ease;
}

.feature-tag:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.project-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9ca3af;
  font-size: 14px;
  font-weight: 500;
}

.stat-icon {
  font-size: 16px;
}

.project-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
  min-width: 120px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn.primary {
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.action-btn.secondary {
  background: rgba(75, 85, 99, 0.3);
  color: #d1d5db;
  border: 1px solid rgba(75, 85, 99, 0.4);
}

.action-btn.secondary:hover {
  background: rgba(75, 85, 99, 0.5);
  color: #ffffff;
  transform: translateY(-2px);
}

.more-projects {
  text-align: center;
  padding: 40px;
  background: rgba(17, 24, 39, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.more-text {
  color: #9ca3af;
  font-size: 1.125rem;
  margin-bottom: 24px;
}

.more-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #10b981;
  border: 2px solid rgba(16, 185, 129, 0.3);
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.more-btn:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.5);
  transform: translateY(-2px);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.more-btn:hover .btn-arrow {
  transform: translateX(4px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .projects-showcase {
    padding: 80px 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 32px;
    margin-bottom: 60px;
  }

  .project-card {
    padding: 32px 24px;
  }

  .project-title {
    font-size: 1.5rem;
  }

  .project-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.75rem;
  }

  .project-card {
    padding: 24px 20px;
  }

  .project-features {
    gap: 6px;
  }

  .feature-tag {
    font-size: 12px;
    padding: 4px 8px;
  }
}
</style>
