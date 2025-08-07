<template>
    <div class="community-page">
        <!-- 页面头部 -->
        <section class="community-hero">
            <div class="hero-background">
                <div class="hero-particles"></div>
            </div>
            <div class="container">
                <div class="hero-content">
                    <h1 class="hero-title">{{ t('community.title') }}</h1>
                    <p class="hero-subtitle">{{ t('community.subtitle') }}</p>
                    <div class="hero-stats">
                        <div class="stat-item">
                            <span class="stat-number">25,000+</span>
                            <span class="stat-label">{{ t('community.stats.members') }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">3,500+</span>
                            <span class="stat-label">{{ t('community.stats.projects') }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">800+</span>
                            <span class="stat-label">{{ t('community.stats.contributors') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 社区平台 -->
        <section class="community-platforms">
            <div class="container">
                <h2 class="section-title">{{ t('community.platforms.title') }}</h2>
                <div class="platforms-grid">
                    <div class="platform-card discord">
                        <div class="platform-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                                />
                            </svg>
                        </div>
                        <h3>{{ t('community.platforms.discord.title') }}</h3>
                        <p>{{ t('community.platforms.discord.description') }}</p>
                        <div class="platform-stats">
                            <span>{{ t('community.platforms.discord.stats') }}</span>
                        </div>
                        <button class="platform-btn">
                            {{ t('community.platforms.discord.action') }}
                        </button>
                    </div>

                    <div class="platform-card github">
                        <div class="platform-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                />
                            </svg>
                        </div>
                        <h3>{{ t('community.platforms.github.title') }}</h3>
                        <p>{{ t('community.platforms.github.description') }}</p>
                        <div class="platform-stats">
                            <span>2,500+ Stars</span>
                        </div>
                        <button class="platform-btn">
                            {{ t('community.platforms.github.action') }}
                        </button>
                    </div>

                    <div class="platform-card forum">
                        <div class="platform-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                />
                            </svg>
                        </div>
                        <h3>{{ t('community.platforms.forum.title') }}</h3>
                        <p>{{ t('community.platforms.forum.description') }}</p>
                        <div class="platform-stats">
                            <span>{{ t('community.platforms.forum.stats') }}</span>
                        </div>
                        <button class="platform-btn">
                            {{ t('community.platforms.forum.action') }}
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- 贡献指南 -->
        <section class="contribution-guide">
            <div class="container">
                <div class="guide-content">
                    <div class="guide-text">
                        <h2>{{ t('community.contribute.title') }}</h2>
                        <p>{{ t('community.contribute.description') }}</p>
                        <div class="guide-steps">
                            <div class="step-item">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h4>{{ t('community.contribute.steps.0.title') }}</h4>
                                    <p>{{ t('community.contribute.steps.0.description') }}</p>
                                </div>
                            </div>
                            <div class="step-item">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h4>{{ t('community.contribute.steps.1.title') }}</h4>
                                    <p>{{ t('community.contribute.steps.1.description') }}</p>
                                </div>
                            </div>
                            <div class="step-item">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h4>{{ t('community.contribute.steps.2.title') }}</h4>
                                    <p>{{ t('community.contribute.steps.2.description') }}</p>
                                </div>
                            </div>
                        </div>
                        <button class="cta-btn">{{ t('community.contribute.action') }}</button>
                    </div>
                    <div class="guide-visual">
                        <div class="code-preview">
                            <div class="code-header">
                                <span class="code-title">{{
                                    t('community.contribute.stats.title')
                                }}</span>
                            </div>
                            <div class="code-content">
                                <div class="contrib-stat">
                                    <span class="contrib-label">{{
                                        t('community.contribute.stats.commits')
                                    }}</span>
                                    <span class="contrib-value">156</span>
                                </div>
                                <div class="contrib-stat">
                                    <span class="contrib-label">{{
                                        t('community.contribute.stats.contributors')
                                    }}</span>
                                    <span class="contrib-value">42</span>
                                </div>
                                <div class="contrib-stat">
                                    <span class="contrib-label">{{
                                        t('community.contribute.stats.mergedPRs')
                                    }}</span>
                                    <span class="contrib-value">89</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'
import { onMounted } from 'vue'

const { t } = useLanguage()

onMounted(() => {
    document.title = `MenthaMC - ${t('community.title')}`
})
</script>

<style scoped>
.community-page {
    min-height: 100vh;
    background: #0f0f23;
    color: #ffffff;
    animation: pageLoad 0.8s ease-out;
}

@keyframes pageLoad {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* 页面头部 */
.community-hero {
    position: relative;
    padding: 140px 0 100px;
    overflow: hidden;
}

.hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    opacity: 0.1;
}

.hero-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image:
        radial-gradient(2px 2px at 20px 30px, #ffffff, transparent),
        radial-gradient(2px 2px at 40px 70px, #ffffff, transparent),
        radial-gradient(1px 1px at 90px 40px, #ffffff, transparent);
    background-repeat: repeat;
    background-size: 100px 100px;
    animation: particleFloat 20s linear infinite;
    opacity: 0.3;
}

@keyframes particleFloat {
    0% {
        transform: translateY(0px);
    }

    100% {
        transform: translateY(-100px);
    }
}

.hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
}

.hero-title {
    font-size: 4rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
}

.hero-subtitle {
    font-size: 1.5rem;
    color: #a0a0a0;
    margin-bottom: 3rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
}

.hero-stats {
    display: flex;
    justify-content: center;
    gap: 4rem;
    flex-wrap: wrap;
}

.stat-item {
    text-align: center;
    animation: statSlideUp 0.4s ease-out both;
}

.stat-item:nth-child(1) {
    animation-delay: 0.1s;
}

.stat-item:nth-child(2) {
    animation-delay: 0.2s;
}

.stat-item:nth-child(3) {
    animation-delay: 0.3s;
}

@keyframes statSlideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.stat-number {
    display: block;
    font-size: 3rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
    animation: numberCount 2s ease-out 1.5s both;
}

@keyframes numberCount {
    from {
        transform: scale(0.8);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.stat-label {
    color: #a0a0a0;
    font-size: 1.1rem;
}

/* 社区平台 */
.community-platforms {
    padding: 100px 0;
    background: #1a1a2e;
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 4rem;
    color: #ffffff;
}

.platforms-grid {
    display: flex;
    gap: 2rem;
    justify-content: space-between;
    align-items: stretch;
}

.platform-card {
    background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    opacity: 1;
    transform: translateY(0) scale(1);
}

.platform-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    animation: none;
}

.platform-card:hover::before {
    opacity: 1;
}

.platform-card.discord {
    border-color: #5865f2;
}

.platform-card.github {
    border-color: #24292e;
}

.platform-card.forum {
    border-color: #00d4aa;
}

.platform-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
}

.platform-icon svg {
    width: 40px;
    height: 40px;
}

.discord .platform-icon {
    color: #5865f2;
}

.github .platform-icon {
    color: #ffffff;
}

.forum .platform-icon {
    color: #00d4aa;
}

.platform-card h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #ffffff;
}

.platform-card p {
    color: #a0a0a0;
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.platform-stats {
    margin-bottom: 2rem;
}

.platform-stats span {
    color: #667eea;
    font-weight: 600;
}

.platform-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
}

.platform-btn:hover {
    cursor: pointer;
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

/* 贡献指南 */
.contribution-guide {
    padding: 100px 0;
    background: #1a1a2e;
}

.guide-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.guide-text h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #ffffff;
}

.guide-text p {
    color: #a0a0a0;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
}

.guide-steps {
    margin-bottom: 2rem;
}

.step-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
    animation: stepSlideIn 0.4s ease-out both;
}

.step-item:nth-child(1) {
    animation-delay: 0.1s;
}

.step-item:nth-child(2) {
    animation-delay: 0.2s;
}

.step-item:nth-child(3) {
    animation-delay: 0.3s;
}

@keyframes stepSlideIn {
    from {
        opacity: 0;
        transform: translateX(-40px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.step-number {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
    animation: numberBounce 1s ease-out both;
    animation-delay: inherit;
}

@keyframes numberBounce {
    0% {
        transform: scale(0) rotate(180deg);
        opacity: 0;
    }

    50% {
        transform: scale(1.2) rotate(90deg);
    }

    100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}

.step-content h4 {
    color: #ffffff;
    margin-bottom: 0.5rem;
}

.step-content p {
    color: #a0a0a0;
    margin: 0;
}

.cta-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 15px 40px;
    border-radius: 30px;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
}

.guide-visual {
    display: flex;
    justify-content: center;
}

.code-preview {
    background: #0d1117;
    border-radius: 15px;
    overflow: hidden;
    width: 100%;
    max-width: 400px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.code-header {
    background: #161b22;
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.code-title {
    color: #ffffff;
    font-weight: 600;
}

.code-content {
    padding: 1.5rem;
}

.contrib-stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.contrib-stat:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.contrib-label {
    color: #a0a0a0;
    font-size: 0.9rem;
}

.contrib-value {
    color: #667eea;
    font-weight: 600;
    font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .guide-content {
        grid-template-columns: 1fr;
        gap: 3rem;
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }

    .hero-subtitle {
        font-size: 1.2rem;
    }

    .hero-stats {
        gap: 2rem;
    }

    .stat-number {
        font-size: 2rem;
    }

    .platforms-grid {
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .platform-card {
        padding: 2rem;
        max-width: 500px;
        width: 100%;
    }

    .guide-text h2 {
        font-size: 2rem;
    }

    .step-item {
        flex-direction: column;
        text-align: center;
    }

    .step-number {
        margin-bottom: 1rem;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 15px;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-stats {
        flex-direction: column;
        gap: 1.5rem;
    }

    .section-title {
        font-size: 2rem;
    }

    .platform-card {
        padding: 1.5rem;
    }
}
</style>
