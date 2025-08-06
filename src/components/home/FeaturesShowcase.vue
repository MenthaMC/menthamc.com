<template>
  <section class="features-showcase">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ $t('home.features.title') }}</h2>
      </div>

      <div class="features-grid">
        <div class="feature-item" v-for="(feature, index) in features" :key="index">
          <div class="feature-icon">
            <span v-html="feature.icon"></span>
          </div>
          <div class="feature-content">
            <h3 class="feature-title">{{ $t(`home.features.items.${feature.key}.title`) }}</h3>
            <p class="feature-description">{{ $t(`home.features.items.${feature.key}.description`) }}</p>
          </div>
          <div class="feature-highlight" v-if="feature.highlight">
            <span class="highlight-badge">{{ $t(`home.features.items.${feature.key}.highlight`) }}</span>
          </div>
        </div>
      </div>

      <div class="performance-comparison">
        <h3 class="comparison-title">{{ $t('home.features.comparison.title') }}</h3>
        <div class="comparison-chart">
          <div class="chart-item">
            <div class="chart-bar">
              <div class="bar-fill vanilla" style="height: 40%"></div>
            </div>
            <span class="chart-label">{{ $t('home.features.comparison.vanilla') }}</span>
          </div>
          <div class="chart-item">
            <div class="chart-bar">
              <div class="bar-fill paper" style="height: 65%"></div>
            </div>
            <span class="chart-label">Paper</span>
          </div>
          <div class="chart-item">
            <div class="chart-bar">
              <div class="bar-fill folia" style="height: 80%"></div>
            </div>
            <span class="chart-label">Folia</span>
          </div>
          <div class="chart-item highlight">
            <div class="chart-bar">
              <div class="bar-fill mint" style="height: 95%"></div>
            </div>
            <span class="chart-label">Mint</span>
            <div class="performance-badge">{{ $t('home.features.comparison.best') }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const features = [
  {
    key: 'performance',
    icon: '⚡',
    highlight: true
  },
  {
    key: 'stability',
    icon: '🛡️',
    highlight: true
  },
  {
    key: 'configurable',
    icon: '🔧',
    highlight: true
  },
  {
    key: 'compatible',
    icon: '🌟',
    highlight: true
  },
  {
    key: 'updates',
    icon: '🚀',
    highlight: true
  },
  {
    key: 'free',
    icon: '💝',
    highlight: true
  }
];
</script>

<style scoped>
.features-showcase {
  padding: 120px 0;
  background: linear-gradient(180deg,
      rgba(17, 24, 39, 0.5) 0%,
      rgba(31, 41, 55, 0.8) 50%,
      rgba(17, 24, 39, 0.5) 100%);
  position: relative;
}

.features-showcase::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(16,185,129,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
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

.features-grid {
  /*
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 24px;
  justify-content: center; */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  margin-bottom: 100px;
}

.feature-item {
  width: 515px;
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 20px;
  padding: 32px;
  position: relative;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  text-align: left;
}

.feature-item::before {
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

.feature-item:hover::before {
  opacity: 1;
}

.feature-item:hover {
  transform: translateY(-8px);
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  border-radius: 20px;
  position: relative;
  flex-shrink: 0;
}

.feature-icon::after {
  content: '';
  position: absolute;
  inset: 2px;
  background: rgba(17, 24, 39, 0.9);
  border-radius: 18px;
  z-index: -1;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

.feature-description {
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 16px;
}

.feature-highlight {
  flex-shrink: 0;
  margin-left: auto;
}

.highlight-badge {
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.performance-comparison {
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 24px;
  padding: 48px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.comparison-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 40px;
}

.comparison-chart {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 32px;
  height: 200px;
}

.chart-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
}

.chart-item.highlight {
  transform: scale(1.1);
}

.chart-bar {
  width: 60px;
  height: 150px;
  background: rgba(75, 85, 99, 0.3);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 8px;
  transition: height 1s ease-out;
}

.bar-fill.vanilla {
  background: linear-gradient(180deg, #6b7280 0%, #4b5563 100%);
}

.bar-fill.paper {
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
}

.bar-fill.folia {
  background: linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%);
}

.bar-fill.mint {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.chart-label {
  font-size: 14px;
  font-weight: 600;
  color: #d1d5db;
}

.performance-badge {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.performance-badge::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #10b981;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .features-showcase {
    padding: 80px 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-description {
    font-size: 1.125rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 60px;
  }

  .feature-item {
    padding: 32px 24px;
  }

  .performance-comparison {
    padding: 32px 20px;
  }

  .comparison-chart {
    gap: 20px;
    height: 160px;
  }

  .chart-bar {
    width: 40px;
    height: 120px;
  }

  .chart-item.highlight {
    transform: scale(1.05);
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.75rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .comparison-chart {
    gap: 16px;
  }

  .chart-bar {
    width: 32px;
    height: 100px;
  }

  .chart-label {
    font-size: 12px;
  }
}
</style>
