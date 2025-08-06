<template>
  <section class="community-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ $t('home.community.title') }}</h2>
        <p class="section-description">
          {{ $t('home.community.description') }}
        </p>
      </div>

      <div class="community-grid">
        <!-- GitHub 社区 -->
        <div class="community-card github">
          <div class="card-left">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
          </div>
          <div class="card-content">
            <div class="card-header">
              <h3 class="card-title">GitHub</h3>
            </div>
            <p class="card-description">
              {{ $t('home.community.github.description') }}
            </p>
            <div class="card-stats">
              <div class="stat">
                <span class="stat-number">35+</span>
                <span class="stat-label">Stars</span>
              </div>
              <div class="stat">
                <span class="stat-number">5+</span>
                <span class="stat-label">Contributors</span>
              </div>
            </div>
          </div>
          <div class="card-right">
            <button class="card-action" @click="openGitHub">
              <span>{{ $t('home.community.github.action') }}</span>
              <span class="action-arrow">→</span>
            </button>
          </div>
        </div>

        <!-- 文档中心 -->
        <div class="community-card docs">
          <div class="card-header">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
            </div>
            <h3 class="card-title">{{ $t('home.community.docs.title') }}</h3>
          </div>
          <p class="card-description">
            {{ $t('home.community.docs.description') }}
          </p>
          <div class="card-features">
            <div class="feature">📖 {{ $t('home.community.docs.features.0') }}</div>
            <div class="feature">⚙️ {{ $t('home.community.docs.features.1') }}</div>
            <div class="feature">🔧 {{ $t('home.community.docs.features.2') }}</div>
            <div class="feature">❓ {{ $t('home.community.docs.features.3') }}</div>
          </div>
          <button class="card-action" @click="openDocs">
            <span>{{ $t('home.community.docs.action') }}</span>
            <span class="action-arrow">→</span>
          </button>
        </div>

        <!-- 社区支持 -->
        <div class="community-card support">
          <div class="card-header">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <h3 class="card-title">{{ $t('home.community.support.title') }}</h3>
          </div>
          <p class="card-description">
            {{ $t('home.community.support.description') }}
          </p>
          <div class="support-channels">
            <div class="channel">
              <span class="channel-icon">💬</span>
              <span class="channel-name">GitHub Issues</span>
            </div>
            <div class="channel">
              <span class="channel-icon">📧</span>
              <span class="channel-name">{{ $t('home.community.support.channels.email') }}</span>
            </div>
          </div>
          <button class="card-action" @click="openSupport">
            <span>{{ $t('home.community.support.action') }}</span>
            <span class="action-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- 贡献指南 -->
      <div class="contribution-section">
        <div class="contribution-content">
          <h3 class="contribution-title">{{ $t('home.community.contribution.title') }}</h3>
          <p class="contribution-description">
            {{ $t('home.community.contribution.description') }}
          </p>
          <div class="contribution-steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>{{ $t('home.community.contribution.steps.0.title') }}</h4>
                <p>{{ $t('home.community.contribution.steps.0.description') }}</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>{{ $t('home.community.contribution.steps.1.title') }}</h4>
                <p>{{ $t('home.community.contribution.steps.1.description') }}</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>{{ $t('home.community.contribution.steps.2.title') }}</h4>
                <p>{{ $t('home.community.contribution.steps.2.description') }}</p>
              </div>
            </div>
          </div>
          <button class="contribution-btn" @click="openContributing">
            <span class="btn-icon">🚀</span>
            <span>{{ $t('home.community.contribution.action') }}</span>
          </button>
        </div>
      </div>

      <!-- 联系我们 -->
      <div class="contact-section">
        <h3 class="contact-title">{{ $t('home.community.contact.title') }}</h3>
        <p class="contact-description">
          {{ $t('home.community.contact.description') }}
        </p>
        <div class="contact-info">
          <div class="contact-item">
            <span class="contact-icon">📧</span>
            <span class="contact-text">support@menthamc.org</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">🌐</span>
            <span class="contact-text">https://github.com/MenthaMC</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const openGitHub = () => {
  window.open('https://github.com/MenthaMC', '_blank');
};

const openDocs = () => {
  window.open('https://menthamc.github.io/docs/', '_blank');
};

const openSupport = () => {
  window.open('https://github.com/MenthaMC/Mint/issues', '_blank');
};

const openContributing = () => {
  window.open('https://github.com/MenthaMC/Mint/blob/main/CONTRIBUTING.md', '_blank');
};
</script>

<style scoped>
.community-section {
  padding: 120px 0;
  background: linear-gradient(180deg,
      rgba(17, 24, 39, 0.9) 0%,
      rgba(31, 41, 55, 0.8) 50%,
      rgba(17, 24, 39, 0.9) 100%);
  position: relative;
}

.community-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
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

.community-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 80px;
}

.community-card {
  background: rgba(31, 41, 55, 0.8);
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

.community-card::before {
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

.community-card:hover::before {
  opacity: 1;
}

.community-card:hover {
  transform: translateY(-8px);
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.community-card.github {
  border-color: rgba(255, 255, 255, 0.2);
}

.community-card.docs {
  border-color: rgba(59, 130, 246, 0.3);
}

.community-card.support {
  border-color: rgba(16, 185, 129, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  border-radius: 12px;
  color: white;
}

.card-icon svg {
  width: 24px;
  height: 24px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.card-description {
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 16px;
}

.card-stats {
  display: flex;
  gap: 24px;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #10b981;
}

.stat-label {
  font-size: 0.75rem;
  color: #9ca3af;
}

.card-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.feature {
  background: rgba(75, 85, 99, 0.3);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  color: #d1d5db;
  white-space: nowrap;
}

.support-channels {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.channel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(75, 85, 99, 0.2);
  border-radius: 6px;
}

.channel-icon {
  font-size: 16px;
}

.channel-name {
  color: #d1d5db;
  font-weight: 500;
  font-size: 14px;
}

.card-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.card-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.action-arrow {
  transition: transform 0.3s ease;
}

.card-action:hover .action-arrow {
  transform: translateX(4px);
}

.contribution-section {
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 24px;
  padding: 48px;
  margin-bottom: 60px;
  backdrop-filter: blur(10px);
}

.contribution-content {
  text-align: center;
}

.contribution-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
}

.contribution-description {
  color: #d1d5db;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.contribution-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  text-align: left;
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content h4 {
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.step-content p {
  color: #9ca3af;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.contribution-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contribution-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.contact-section {
  text-align: center;
  padding: 40px;
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.contact-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

.contact-description {
  color: #9ca3af;
  margin-bottom: 24px;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d1d5db;
}

.contact-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .community-section {
    padding: 80px 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .community-grid {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 60px;
  }

  .community-card {
    padding: 24px;
  }

  .card-features {
    grid-template-columns: 1fr;
  }

  .contribution-section {
    padding: 32px 20px;
  }

  .contribution-steps {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .step {
    flex-direction: column;
    text-align: center;
  }

  .contact-info {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.75rem;
  }

  .contribution-title {
    font-size: 1.5rem;
  }

  .card-stats {
    justify-content: center;
  }
}
</style>
