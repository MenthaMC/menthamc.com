<template>
    <Navbar />
    
    <!-- 全局浮动粒子容器 -->
    <div class="floating-particles-container"></div>

    <main class="main-content" data-animate>
        <router-view v-slot="{ Component, route }">
            <transition name="page" mode="out-in">
                <component :is="Component" :key="route.path" />
            </transition>
        </router-view>
    </main>
    <Footer />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Footer from './components/Footer.vue'
import Navbar from './components/Navbar.vue'
import { useGlobalAnimations } from './composables/useGlobalAnimations'
import { logger } from './utils/logger'

const { initGlobalAnimations } = useGlobalAnimations()

onMounted(() => {
    // 为整个应用添加平滑滚动
    document.documentElement.style.scrollBehavior = 'smooth'
    
    // 初始化全局动画系统
    initGlobalAnimations()
    
    logger.debug('应用初始化完成')
})
</script>

<style>
@import './styles/global.css';

.main-content {
    padding: 0 !important;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    width: 100%;
}

/* 响应式布局适配 */
@media (max-width: 1024px) {
    .container {
        max-width: 100%;
        padding: 0 var(--spacing-sm);
    }
}

@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }

    .main-content {
        padding-top: 1rem;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 0.75rem;
    }
}

/* 应用内容容器 */
.app-content {
    opacity: 0;
    animation: appFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.2s;
}

@keyframes appFadeIn {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 页面切换过渡动画 */
.page-enter-active,
.page-leave-active {
    transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.page-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
}

.page-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(1.02);
}

.page-enter-to,
.page-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* 为不同设备优化动画性能 */
@media (prefers-reduced-motion: reduce) {
    .page-enter-active,
    .page-leave-active {
        transition: opacity 0.2s ease;
    }
    
    .page-enter-from,
    .page-leave-to {
        transform: none;
    }
}

/* 移动端优化 */
@media (max-width: 768px) {
    .page-enter-active,
    .page-leave-active {
        transition: all 0.2s ease-out;
    }
    
    .page-enter-from {
        transform: translateX(20px);
    }
    
    .page-leave-to {
        transform: translateX(-20px);
    }
}

/* 确保动画期间的层级关系 */
.page-enter-active {
    z-index: 2;
}

.page-leave-active {
    z-index: 1;
}
</style>
