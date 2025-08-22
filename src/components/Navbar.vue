<template>
    <nav class="navbar">
        <div class="nav-container">
            <!-- Logo -->
            <div class="nav-logo">
                <a href="https://github.com/MenthaMC" class="logo-link">
                    <span class="logo-text">MenthaMC</span>
                </a>
            </div>

            <!-- 桌面端导航链接 -->
            <div class="nav-links">
                <router-link to="/" class="nav-link">{{ $t('nav.home') }}</router-link>
                <router-link to="/download" class="nav-link">{{ $t('nav.download') }}</router-link>
                <a
                    href="https://menthamc.github.io/docs/"
                    class="nav-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ $t('nav.docs') }}</a
                >
                <router-link to="/community" class="nav-link">{{
                    $t('nav.community')
                }}</router-link>
            </div>

            <!-- 右侧操作区 -->
            <div class="nav-actions">
                <div
                    class="language-selector"
                    @click="toggleLanguageMenu"
                    :class="{ active: isLanguageMenuOpen }"
                >
                    <div class="language-trigger">
                        <svg
                            class="translate-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="m5 8 6 6" />
                            <path d="m4 14 6-6 2-3" />
                            <path d="M2 5h12" />
                            <path d="M7 2h1" />
                            <path d="m22 22-5-10-5 10" />
                            <path d="M14 18h6" />
                        </svg>
                        <span class="current-language">{{ currentLanguageText }}</span>
                    </div>
                    <div class="language-menu" :class="{ show: isLanguageMenuOpen }">
                        <div
                            class="language-option"
                            :class="{ active: currentLanguage === 'en-US' }"
                            @click.stop="selectLanguage('en-US')"
                        >
                            <span class="language-flag">🇺🇸</span>
                            <span>{{ $t('nav.language.english') }}</span>
                            <svg
                                v-if="currentLanguage === 'en-US'"
                                class="check-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <polyline points="20,6 9,17 4,12" />
                            </svg>
                        </div>
                        <div
                            class="language-option"
                            :class="{ active: currentLanguage === 'zh-CN' }"
                            @click.stop="selectLanguage('zh-CN')"
                        >
                            <span class="language-flag">🇨🇳</span>
                            <span>{{ $t('nav.language.chinese') }}</span>
                            <svg
                                v-if="currentLanguage === 'zh-CN'"
                                class="check-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <polyline points="20,6 9,17 4,12" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 移动端菜单按钮 -->
            <button
                class="mobile-menu-btn"
                :class="{ 'menu-open': isMobileMenuOpen }"
                @click="toggleMobileMenu"
            >
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
        </div>

        <!-- 移动端菜单 -->
        <div class="mobile-menu" :class="{ active: isMobileMenuOpen }" v-if="isMobileMenuOpen">
            <div class="mobile-nav-links">
                <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">{{
                    $t('nav.home')
                }}</router-link>
                <router-link to="/download" class="mobile-nav-link" @click="closeMobileMenu">{{
                    $t('nav.download')
                }}</router-link>
                <a
                    href="https://menthamc.github.io/docs/"
                    class="mobile-nav-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ $t('nav.docs') }}</a
                >
                <router-link to="/community" class="mobile-nav-link" @click="closeMobileMenu">{{
                    $t('nav.community')
                }}</router-link>
            </div>
            <div class="mobile-actions">
                <div class="mobile-language-selector">
                    <div
                        class="mobile-language-option"
                        :class="{ active: currentLanguage === 'en-US' }"
                        @click="selectLanguage('en-US')"
                    >
                        <span class="language-flag">🇺🇸</span>
                        <span>{{ $t('nav.language.english') }}</span>
                        <svg
                            v-if="currentLanguage === 'en-US'"
                            class="check-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polyline points="20,6 9,17 4,12" />
                        </svg>
                    </div>
                    <div
                        class="mobile-language-option"
                        :class="{ active: currentLanguage === 'zh-CN' }"
                        @click="selectLanguage('zh-CN')"
                    >
                        <span class="language-flag">🇨🇳</span>
                        <span>{{ $t('nav.language.chinese') }}</span>
                        <svg
                            v-if="currentLanguage === 'zh-CN'"
                            class="check-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polyline points="20,6 9,17 4,12" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '../utils/logger'
import { getCurrentLanguage, switchLanguage } from '../locales'

const { t } = useI18n()

// 响应式状态
const isMobileMenuOpen = ref(false)
const isLanguageMenuOpen = ref(false)
const currentLanguage = ref(getCurrentLanguage())

// Emits定义
const emit = defineEmits<{
    languageChange: [{ language: string; previousLanguage: string }]
    mobileMenuToggle: [isOpen: boolean]
}>()

// 语言配置
const LANGUAGE_CONFIG = {
    'zh-CN': {
        name: '简体中文',
        flag: '🇨🇳',
    },
    'en-US': {
        name: 'English',
        flag: '🇺🇸',
    },
} as const

// 当前语言显示文本
const currentLanguageText = computed(() => {
    const langKey = currentLanguage.value as keyof typeof LANGUAGE_CONFIG
    const config = LANGUAGE_CONFIG[langKey]
    return config?.name || LANGUAGE_CONFIG['zh-CN'].name
})

// 事件处理函数
const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
    emit('mobileMenuToggle', isMobileMenuOpen.value)
}

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
    emit('mobileMenuToggle', false)
}

const toggleLanguageMenu = () => {
    isLanguageMenuOpen.value = !isLanguageMenuOpen.value
}

const selectLanguage = (lang: 'zh-CN' | 'en-US') => {
    const previousLanguage = currentLanguage.value
    currentLanguage.value = lang
    switchLanguage(lang)
    isLanguageMenuOpen.value = false

    emit('languageChange', {
        language: lang,
        previousLanguage,
    })

    logger.info(t('navbar.console.switchLanguage'), { language: lang })
}

// 点击外部处理函数
const handleClickOutside = (e: Event) => {
    const target = e.target as HTMLElement
    if (!target.closest('.language-selector')) {
        isLanguageMenuOpen.value = false
    }
}

// 生命周期
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<script lang="ts">
export default {
    name: 'AppNavbar'
}
</script>

<style scoped>
/* 导航栏基础样式 */
.navbar {
    position: fixed;
    margin: 10px 50%;
    transform: translateX(-50%);
    width: calc(100% - 40px);
    max-width: 1200px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 16px;
    z-index: 1000;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: slideInFromTop 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;

    /* 深色模式样式 */
    background: linear-gradient(
        135deg,
        rgba(17, 24, 39, 0.95) 0%,
        rgba(31, 41, 55, 0.9) 50%,
        rgba(55, 65, 81, 0.85) 100%
    );
    border: 1px solid rgba(75, 85, 99, 0.4);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 4px 16px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.navbar:hover {
    background: linear-gradient(
        135deg,
        rgba(17, 24, 39, 0.98) 0%,
        rgba(31, 41, 55, 0.95) 50%,
        rgba(55, 65, 81, 0.9) 100%
    );
    border-color: rgba(75, 85, 99, 0.6);
    box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.5),
        0 6px 20px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* 导航栏入场动画 */
@keyframes slideInFromTop {
    0% {
        opacity: 0;
        transform: translateX(-50%) translateY(-30px) scale(0.95);
    }

    100% {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1);
    }
}

.nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    height: 64px;
}

/* Logo样式 */
.nav-logo {
    display: flex;
    align-items: center;
}

.logo-link {
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: logoFadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
    opacity: 0;
    transform: translateY(10px);
}

.logo-link:hover {
    transform: translateY(-2px) scale(1.05);
}

.logo-text {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.logo-link:hover .logo-text {
    filter: brightness(1.1);
}

@keyframes logoFadeIn {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 导航链接 */
.nav-links {
    display: flex;
    align-items: center;
    gap: 32px;
}

.nav-link {
    color: #d1d5db;
    text-decoration: none;
    font-weight: 500;
    font-size: 18px;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: linkSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(20px);
}

.nav-link:nth-child(1) {
    animation-delay: 0.4s;
}

.nav-link:nth-child(2) {
    animation-delay: 0.5s;
}

.nav-link:nth-child(3) {
    animation-delay: 0.6s;
}

.nav-link:nth-child(4) {
    animation-delay: 0.7s;
}

.nav-link:hover {
    color: #ffffff;
    transform: translateY(-2px);
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
    width: 100%;
}

.nav-link.router-link-active {
    color: #ffffff;
}

@keyframes linkSlideIn {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 右侧操作区 */
.nav-actions {
    display: flex;
    align-items: center;
    height: 40px;
}

/* 语言选择器 */
.language-selector {
    position: relative;
    cursor: pointer;
    animation: buttonSlideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards;
    opacity: 0;
    transform: translateX(30px);
}

.language-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: rgba(75, 85, 99, 0.2);
    border: 1px solid rgba(75, 85, 99, 0.3);
    border-radius: 12px;
    color: #d1d5db;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
}

.language-selector:hover .language-trigger {
    background: rgba(75, 85, 99, 0.3);
    border-color: rgba(75, 85, 99, 0.5);
    color: #ffffff;
    transform: translateY(-2px);
}

.language-selector.active .language-trigger {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.3);
    color: #10b981;
}

.translate-icon {
    width: 16px;
    height: 16px;
    stroke-width: 2;
}

.current-language {
    font-size: 14px;
    white-space: nowrap;
}

.language-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 180px;
    background: linear-gradient(
        135deg,
        rgba(17, 24, 39, 0.98) 0%,
        rgba(31, 41, 55, 0.95) 50%,
        rgba(55, 65, 81, 0.9) 100%
    );
    border: 1px solid rgba(75, 85, 99, 0.4);
    border-radius: 12px;
    padding: 8px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px) scale(0.95);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    z-index: 1000;
}

.language-menu.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
}

.language-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    color: #d1d5db;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
}

.language-option:hover {
    background: rgba(75, 85, 99, 0.3);
    color: #ffffff;
}

.language-option.active {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
}

.language-flag {
    font-size: 16px;
}

.check-icon {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    margin-left: auto;
}

@keyframes buttonSlideIn {
    0% {
        opacity: 0;
        transform: translateX(30px);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    cursor: pointer;
    gap: 4px;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-btn:hover {
    transform: scale(1.1);
}

.mobile-menu-btn:active {
    transform: scale(0.95);
}

.hamburger-line {
    width: 20px;
    height: 2px;
    background: #d1d5db;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
    border-radius: 1px;
}

.mobile-menu-btn:hover .hamburger-line {
    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.mobile-menu-btn:hover .hamburger-line:nth-child(1) {
    transform: translateY(-1px) rotate(2deg);
}

.mobile-menu-btn:hover .hamburger-line:nth-child(2) {
    transform: scaleX(1.1);
}

.mobile-menu-btn:hover .hamburger-line:nth-child(3) {
    transform: translateY(1px) rotate(-2deg);
}

/* 菜单打开时的动画 - 通过Vue的class绑定控制 */
.mobile-menu-btn.menu-open .hamburger-line:nth-child(1) {
    transform: translateY(6px) rotate(45deg);
    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
}

.mobile-menu-btn.menu-open .hamburger-line:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
}

.mobile-menu-btn.menu-open .hamburger-line:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg);
    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
}

/* 移动端菜单 */
.mobile-menu {
    display: none;
    backdrop-filter: blur(15px);
    border-radius: 16px;
    margin-top: 10px;
    padding: 24px;
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1001;

    background: linear-gradient(
        135deg,
        rgba(17, 24, 39, 0.98) 0%,
        rgba(31, 41, 55, 0.95) 50%,
        rgba(55, 65, 81, 0.9) 100%
    );
    border: 1px solid rgba(75, 85, 99, 0.4);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 4px 16px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.mobile-menu.active {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.mobile-menu.active .mobile-nav-link {
    animation: mobileNavSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateX(-20px);
}

.mobile-menu.active .mobile-nav-link:nth-child(1) {
    animation-delay: 0.1s;
}

.mobile-menu.active .mobile-nav-link:nth-child(2) {
    animation-delay: 0.2s;
}

.mobile-menu.active .mobile-nav-link:nth-child(3) {
    animation-delay: 0.3s;
}

.mobile-menu.active .mobile-nav-link:nth-child(4) {
    animation-delay: 0.4s;
}

@keyframes mobileNavSlideIn {
    0% {
        opacity: 0;
        transform: translateX(-20px);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

.mobile-nav-links {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
}

.mobile-nav-link {
    color: #d1d5db;
    text-decoration: none;
    font-weight: 500;
    font-size: 16px;
    padding: 8px 0;
    transition: color 0.3s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
    color: #ffffff;
}

.mobile-nav-link.router-link-active {
    background: rgba(16, 185, 129, 0.1);
    border-radius: 8px;
    padding: 8px 12px;
    margin: -8px -12px;
}

.mobile-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
}

.mobile-language-selector {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.mobile-language-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(75, 85, 99, 0.2);
    border: 1px solid rgba(75, 85, 99, 0.3);
    border-radius: 12px;
    color: #d1d5db;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 44px;
}

.mobile-language-option:hover {
    background: rgba(75, 85, 99, 0.3);
    color: #ffffff;
}

.mobile-language-option.active {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.3);
    color: #10b981;
}

.mobile-language-option .language-flag {
    font-size: 18px;
}

.mobile-language-option .check-icon {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    margin-left: auto;
}

/* 响应式设计 */
@media (max-width: 767.98px) {
    .navbar {
        width: calc(100% - 24px);
        top: 12px;
        border-radius: 14px;
    }

    .nav-container {
        padding: 0 16px;
        height: 56px;
        min-height: 48px;
        position: relative;
    }

    .nav-logo {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
    }

    .nav-links,
    .nav-actions {
        display: none;
    }

    .mobile-menu-btn {
        display: flex;
        margin-left: auto;
        z-index: 3;
    }

    .hamburger-line {
        width: 18px;
        height: 2px;
    }

    .mobile-menu {
        display: block;
        padding: 16px;
        border-radius: 14px;
        margin-top: 6px;
    }

    .logo-text {
        font-size: 25px;
    }

    .mobile-nav-link {
        padding: 10px 0;
        min-height: 44px;
        display: flex;
        align-items: center;
    }

    .mobile-game-btn {
        padding: 12px 20px;
        border-radius: 10px;
        margin-top: 8px;
    }
}

@media (min-width: 768px) and (max-width: 991.98px) {
    .navbar {
        width: calc(100% - 20px);
        top: 10px;
    }

    .nav-container {
        padding: 8px 20px;
        height: 56px;
    }

    .nav-links {
        gap: 24px;
    }

    .nav-link {
        font-size: 16px;
    }

    .logo-text {
        font-size: 22px;
    }

    .game-btn {
        padding: 8px 16px;
        font-size: 13px;
    }
}

@media (min-width: 992px) and (max-width: 1199.98px) {
    .navbar {
        width: calc(100% - 30px);
        top: 15px;
    }

    .nav-container {
        padding: 10px 24px;
        height: 60px;
    }

    .nav-links {
        gap: 28px;
    }

    .nav-link {
        font-size: 17px;
    }

    .logo-text {
        font-size: 23px;
    }

    .game-btn {
        padding: 9px 18px;
    }
}

/* 横屏模式优化 */
@media (max-height: 500px) and (orientation: landscape) {
    .navbar {
        top: 5px;
    }

    .nav-container {
        height: 40px;
        padding: 4px 16px;
    }

    .logo-text {
        font-size: 16px;
    }

    .mobile-menu {
        padding: 8px;
        max-height: calc(100vh - 60px);
        overflow-y: auto;
    }

    .mobile-nav-links {
        gap: 8px;
        margin-bottom: 12px;
    }

    .mobile-nav-link {
        padding: 4px 0;
        font-size: 14px;
    }
}
</style>
