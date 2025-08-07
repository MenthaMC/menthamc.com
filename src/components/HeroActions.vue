<template>
    <div class="hero-actions">
        <button class="btn btn--primary" @click="handleDownload">
            <span class="btn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
            </span>
            <span class="btn-text">{{ $t('home.hero.actions.download') }}</span>
            <span class="btn-shine"></span>
        </button>
        <button class="btn btn--secondary" @click="handleLearnMore">
            <span class="btn-text">{{ $t('home.hero.actions.learnMore') }}</span>
            <span class="btn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                </svg>
            </span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { HeroActionsProps } from '../types'

const { t } = useI18n()

// Props定义
const props = withDefaults(defineProps<HeroActionsProps>(), {
    onDownload: undefined,
    onLearnMore: undefined,
})

// Emits定义
const emit = defineEmits<{
    download: []
    learnMore: []
}>()

// 事件处理函数
const handleDownload = () => {
    console.log(t('hero.actions.download'))
    emit('download')
    props.onDownload?.()
    // TODO: 实现下载逻辑
}

const handleLearnMore = () => {
    console.log(t('hero.actions.learnMore'))
    emit('learnMore')
    props.onLearnMore?.()
    // TODO: 实现了解更多逻辑
}
</script>

<style scoped>
.hero-actions {
    display: flex;
    gap: var(--spacing-sm);
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    opacity: 0;
    transform: translateY(20px);
    position: relative;
    z-index: 10;
}

/* 按钮组件系统 */
.btn {
    padding: 14px 32px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    border: none;
    touch-action: manipulation;
    position: relative;
    overflow: hidden;
    transition: all var(--transition-smooth);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    border-radius: var(--radius-md);
}

.btn:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
}

.btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    transition: all var(--transition-smooth);
}

.btn-text {
    transition: all var(--transition-smooth);
}

/* 主要按钮 */
.btn--primary {
    background: var(--gradient-primary);
    color: var(--color-text-primary);
    font-weight: 700;
    font-size: 18px;
    min-width: 160px;
    box-shadow: var(--shadow-primary);
    gap: 10px;
    position: relative;
}

.btn--primary .btn-icon {
    margin-right: 4px;
}

.btn--primary:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.05);
    box-shadow: var(--shadow-primary-hover);
}

.btn--primary:hover .btn-icon {
    transform: translateY(-2px);
}

.btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s;
}

.btn--primary:hover .btn-shine {
    left: 100%;
}

/* 次要按钮 */
.btn--secondary {
    background: rgba(16, 185, 129, 0.1);
    color: var(--color-primary);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 14px 32px;
    font-weight: 700;
    font-size: 18px;
    min-width: 160px;
    transition: all var(--transition-fast);
    backdrop-filter: blur(10px);
    position: relative;
    gap: 10px;
}

.btn--secondary .btn-icon {
    margin-left: 4px;
    opacity: 0.8;
}

.btn--secondary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gradient-primary);
    opacity: 0;
    transition: all var(--transition-fast);
    z-index: -1;
    border-radius: inherit;
}

.btn--secondary::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: var(--gradient-primary);
    mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    opacity: 0.6;
    transition: opacity var(--transition-fast);
}

.btn--secondary:hover:not(:disabled) {
    color: var(--color-text-primary);
    transform: translateY(-2px) scale(1.02);
    border-color: transparent;
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
}

.btn--secondary:hover .btn-icon {
    transform: translateX(4px);
    opacity: 1;
}

.btn--secondary:hover::before {
    opacity: 1;
}

.btn--secondary:hover::after {
    opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .hero-actions {
        gap: 0.8rem;
        flex-direction: column;
        width: 100%;
        max-width: 320px;
        margin: 0 auto;
    }

    .btn {
        width: 100%;
    }

    .btn--primary {
        padding: 16px 32px;
        font-size: 18px;
        min-height: 52px;
        order: 1;
    }

    .btn--secondary {
        padding: 16px 32px;
        font-size: 18px;
        min-height: 52px;
        order: 2;
    }
}

@media (max-width: 480px) {
    .btn--primary,
    .btn--secondary {
        padding: 14px 24px;
        font-size: 16px;
    }

    .btn-icon {
        width: 18px;
        height: 18px;
    }
}
</style>
