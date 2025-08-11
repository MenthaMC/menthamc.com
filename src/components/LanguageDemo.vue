<template>
    <div class="language-demo">
        <div class="demo-container">
            <h2 class="demo-title">{{ $t('home.languageDemo.title') }}</h2>

            <div class="language-switcher">
                <h3>{{ $t('home.languageDemo.languageSwitcher.title') }}</h3>
                <div class="switcher-buttons">
                    <button
                        v-for="lang in availableLanguages"
                        :key="lang.code"
                        @click="switchLanguage(lang.code)"
                        :class="['lang-btn', { active: currentLanguage === lang.code }]"
                    >
                        <span class="flag">{{ lang.flag }}</span>
                        <span class="name">{{ lang.name }}</span>
                    </button>
                </div>
            </div>

            <div class="demo-sections">
                <div class="demo-section">
                    <h3>{{ $t('home.languageDemo.sections.nav.title') }}</h3>
                    <div class="translation-item">
                        <span class="key">nav.home:</span>
                        <span class="value">{{ $t('nav.home') }}</span>
                    </div>
                    <div class="translation-item">
                        <span class="key">nav.download:</span>
                        <span class="value">{{ $t('nav.download') }}</span>
                    </div>
                    <div class="translation-item">
                        <span class="key">nav.docs:</span>
                        <span class="value">{{ $t('nav.docs') }}</span>
                    </div>
                    <div class="translation-item">
                        <span class="key">nav.community:</span>
                        <span class="value">{{ $t('nav.community') }}</span>
                    </div>
                </div>

                <div class="demo-section">
                    <h3>{{ $t('home.languageDemo.sections.welcome.title') }}</h3>
                    <div class="translation-item">
                        <span class="key">home.welcome.title.highlight:</span>
                        <span class="value">{{ $t('home.welcome.title.highlight') }}</span>
                    </div>
                    <div class="translation-item">
                        <span class="key">home.welcome.description:</span>
                        <span class="value">{{ $t('home.welcome.description') }}</span>
                    </div>
                    <div class="translation-item">
                        <span class="key">home.welcome.actions.getStarted:</span>
                        <span class="value">{{ $t('home.welcome.actions.getStarted') }}</span>
                    </div>
                </div>

                <div class="demo-section">
                    <h3>{{ $t('home.languageDemo.sections.features.title') }}</h3>
                    <div class="translation-item">
                        <span class="key">home.features.title:</span>
                        <span class="value">{{ $t('home.features.title') }}</span>
                    </div>
                    <div class="translation-item">
                        <span class="key">home.features.items.performance.title:</span>
                        <span class="value">{{ $t('home.features.items.performance.title') }}</span>
                    </div>
                    <div class="translation-item">
                        <span class="key">home.features.items.stability.title:</span>
                        <span class="value">{{ $t('home.features.items.stability.title') }}</span>
                    </div>
                </div>

                <div class="demo-section">
                    <h3>{{ $t('home.languageDemo.sections.download.title') }}</h3>
                    <div class="translation-item">
                        <span class="key">download.hero.title:</span>
                        <span class="value">{{ $t('download.hero.title') }}</span>
                    </div>
                    <div class="translation-item">
                        <span class="key">download.hero.subtitle:</span>
                        <span class="value">{{ $t('download.hero.subtitle') }}</span>
                    </div>
                    <div class="translation-item">
                        <span class="key">download.status:</span>
                        <span class="value">{{ $t('download.status') }}</span>
                    </div>
                </div>
            </div>

            <div class="demo-info">
                <h3>{{ $t('home.languageDemo.features.title') }}</h3>
                <ul class="feature-list">
                    <li
                        v-for="(feature, index) in $t('home.languageDemo.features.list')"
                        :key="index"
                    >
                        {{ feature }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLanguage } from '../composables/useLanguage'

const { t } = useI18n()
const { currentLanguage, languages: availableLanguages, changeLanguage } = useLanguage()

const switchLanguage = (langCode: string) => {
    changeLanguage(langCode as 'zh-CN' | 'en-US')
}

// 使用t函数避免未使用警告
console.log('Language demo loaded with translations:', t('home.languageDemo.title'))
</script>

<style scoped>
.language-demo {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    color: #ffffff;
    padding: 120px 20px 80px;
}

.demo-container {
    max-width: 1200px;
    margin: 0 auto;
}

.demo-title {
    font-size: 3rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 60px;
    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.language-switcher {
    background: rgba(31, 41, 55, 0.6);
    border: 1px solid rgba(75, 85, 99, 0.3);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 40px;
    backdrop-filter: blur(10px);
}

.language-switcher h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #ffffff;
}

.switcher-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
}

.lang-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    background: rgba(75, 85, 99, 0.3);
    border: 1px solid rgba(75, 85, 99, 0.4);
    border-radius: 12px;
    color: #d1d5db;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
    font-weight: 500;
}

.lang-btn:hover {
    background: rgba(75, 85, 99, 0.5);
    border-color: rgba(16, 185, 129, 0.4);
    color: #ffffff;
    transform: translateY(-2px);
}

.lang-btn.active {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.5);
    color: #10b981;
}

.flag {
    font-size: 20px;
}

.demo-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
}

.demo-section {
    background: rgba(31, 41, 55, 0.6);
    border: 1px solid rgba(75, 85, 99, 0.3);
    border-radius: 16px;
    padding: 24px;
    backdrop-filter: blur(10px);
}

.demo-section h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: #ffffff;
    border-bottom: 2px solid rgba(16, 185, 129, 0.3);
    padding-bottom: 8px;
}

.translation-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(75, 85, 99, 0.2);
}

.translation-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.key {
    font-size: 12px;
    color: #9ca3af;
    font-family: 'Courier New', monospace;
    font-weight: 500;
}

.value {
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
}

.demo-info {
    background: rgba(31, 41, 55, 0.6);
    border: 1px solid rgba(75, 85, 99, 0.3);
    border-radius: 20px;
    padding: 32px;
    backdrop-filter: blur(10px);
}

.demo-info h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #ffffff;
}

.feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.feature-list li {
    padding: 8px 0;
    color: #d1d5db;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .demo-title {
        font-size: 2rem;
    }

    .switcher-buttons {
        flex-direction: column;
        align-items: center;
    }

    .lang-btn {
        width: 200px;
        justify-content: center;
    }

    .demo-sections {
        grid-template-columns: 1fr;
    }
}
</style>
