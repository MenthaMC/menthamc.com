<template>
    <h1 class="hero-title" ref="heroTitle">
        <div class="title-wrapper">
            <span
                class="title-char"
                v-for="(char, index) in titleChars"
                :key="index"
                :style="{ animationDelay: `${index * 0.05}s` }"
            >
                {{ char }}
            </span>
        </div>
        <div class="title-glow"></div>
    </h1>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { AnimatedTitleProps } from '../types'
import { ANIMATION_CONSTANTS } from '../utils/constants'
import { throttle } from '../utils/helpers'

// Props定义
interface Props extends AnimatedTitleProps {}
const props = withDefaults(defineProps<Props>(), {
    text: ANIMATION_CONSTANTS.TITLE_TEXT,
    animationDelay: 0,
})

// 响应式引用
const heroTitle = ref<HTMLElement | null>(null)

// 计算属性
const titleChars = computed(() => props.text.split(''))

// 鼠标跟踪处理函数
const handleMouseMove = throttle((e: MouseEvent) => {
    if (!heroTitle.value) return

    const titleGlow = heroTitle.value.querySelector('.title-glow') as HTMLElement
    if (!titleGlow) return

    const rect = heroTitle.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX
    const mouseY = e.clientY

    // 计算鼠标与标题中心的距离
    const distX = mouseX - centerX
    const distY = mouseY - centerY

    // 根据距离调整光晕位置
    if (Math.abs(distX) < rect.width && Math.abs(distY) < rect.height * 2) {
        titleGlow.style.opacity = '1'
        titleGlow.style.transform = `translate(${distX * 0.1}px, ${distY * 0.1}px)`
    } else {
        titleGlow.style.opacity = '0.5'
        titleGlow.style.transform = 'translate(0, 0)'
    }
}, 16) // 约60fps

// 生命周期
onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.hero-title {
    font-size: var(--font-size-5xl);
    font-weight: 800;
    margin: 0 0 var(--spacing-lg) 0;
    line-height: 1.1;
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.title-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
    position: relative;
    z-index: 2;
}

/* 标题字符动画 */
.title-char {
    display: inline-block;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0;
    transform: translateY(-20px) scale(0.8);
    animation: charAppear 0.6s forwards;
    white-space: pre;
    position: relative;
    filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.3));
    transition: all 0.3s ease;
}

.title-char:hover {
    transform: translateY(-5px) scale(1.1);
    filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.5));
}

@keyframes charAppear {
    0% {
        opacity: 0;
        transform: translateY(-20px) scale(0.8);
    }

    60% {
        opacity: 1;
        transform: translateY(5px) scale(1.1);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* 标题光晕效果 */
.title-glow {
    position: absolute;
    width: 150px;
    height: 150px;
    background: radial-gradient(
        circle,
        rgba(16, 185, 129, 0.3) 0%,
        rgba(59, 130, 246, 0.2) 30%,
        transparent 70%
    );
    border-radius: 50%;
    filter: blur(20px);
    opacity: 0.5;
    pointer-events: none;
    transition: all 0.3s ease;
    z-index: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .hero-title {
        font-size: var(--font-size-3xl);
        margin-bottom: var(--spacing-md);
        line-height: 1.2;
    }

    .title-wrapper {
        max-width: 100%;
    }

    .title-char {
        margin: 0 0.01em;
    }

    .title-glow {
        width: 100px;
        height: 100px;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: var(--font-size-2xl);
    }

    .title-char {
        margin: 0;
    }

    .title-glow {
        width: 80px;
        height: 80px;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .hero-title {
        font-size: var(--font-size-4xl);
    }
}

@media (min-width: 1025px) {
    .hero-title {
        font-size: var(--font-size-6xl);
    }
}
</style>
