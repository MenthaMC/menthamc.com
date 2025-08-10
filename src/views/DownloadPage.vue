<template>
    <div class="download-page">
        <!-- 背景动画元素 -->
        <div class="animated-background">
            <div class="floating-particles">
                <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
            </div>
            <div class="gradient-orbs">
                <div class="orb orb-1"></div>
                <div class="orb orb-2"></div>
                <div class="orb orb-3"></div>
            </div>
        </div>
        
        <!-- 页面内容 -->
        <div class="page-content">
            <DownloadHero />
            <DownloadOptions />
            <BuildHistory />
        </div>
    </div>
</template>

<script setup lang="ts">
import BuildHistory from '@/components/download/BuildHistory.vue'
import DownloadHero from '@/components/download/DownloadHero.vue'
import DownloadOptions from '@/components/download/DownloadOptions.vue'

// 生成粒子样式
const getParticleStyle = (index: number) => {
    const size = Math.random() * 4 + 2
    const left = Math.random() * 100
    const animationDelay = Math.random() * 8
    const animationDuration = Math.random() * 6 + 8
    
    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        animationDelay: `${animationDelay}s`,
        animationDuration: `${animationDuration}s`
    }
}
</script>

<style scoped>
.download-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a0f1c 0%, #1a1f2e 50%, #2a2f3e 100%);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    position: relative;
    overflow-x: hidden;
}

/* 动画背景 */
.animated-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
}

/* 浮动粒子 */
.floating-particles {
    position: absolute;
    width: 100%;
    height: 100%;
}

.particle {
    position: absolute;
    background: rgba(16, 185, 129, 0.6);
    border-radius: 50%;
    animation: floatUp infinite linear;
    opacity: 0;
}

@keyframes floatUp {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
    }
}

/* 渐变光球 */
.gradient-orbs {
    position: absolute;
    width: 100%;
    height: 100%;
}

.orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.3;
    animation: orbFloat 20s infinite ease-in-out;
}

.orb-1 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%);
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.orb-2 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
    top: 60%;
    right: 15%;
    animation-delay: -7s;
}

.orb-3 {
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
    bottom: 20%;
    left: 50%;
    animation-delay: -14s;
}

@keyframes orbFloat {
    0%, 100% {
        transform: translate(0, 0) scale(1);
    }
    25% {
        transform: translate(30px, -50px) scale(1.1);
    }
    50% {
        transform: translate(-20px, -30px) scale(0.9);
    }
    75% {
        transform: translate(40px, 20px) scale(1.05);
    }
}

/* 页面内容 */
.page-content {
    position: relative;
    z-index: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .orb {
        filter: blur(20px);
    }
    
    .orb-1 {
        width: 200px;
        height: 200px;
    }
    
    .orb-2 {
        width: 150px;
        height: 150px;
    }
    
    .orb-3 {
        width: 180px;
        height: 180px;
    }
}
</style>
