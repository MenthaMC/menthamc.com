<template>
    <section class="hero-section" data-enter-animation="fadeInUp" data-scroll-animate>
        <!-- 浮动粒子容器 -->
        <div class="floating-particles-container"></div>
        
        <!-- 动态背景网格 -->
        <div class="grid-background" data-parallax="0.2">
            <div class="grid-line" v-for="i in 20" :key="'h-' + i" :style="{ top: (i * 5) + '%' }" data-direction="horizontal"></div>
            <div class="grid-line" v-for="i in 20" :key="'v-' + i" :style="{ left: (i * 5) + '%' }" data-direction="vertical"></div>
        </div>
        
        <!-- 浮动几何图形 -->
        <div class="floating-shapes" data-mouse-follow>
            <div class="shape shape-1" data-parallax="0.3"></div>
            <div class="shape shape-2" data-parallax="0.4"></div>
            <div class="shape shape-3" data-parallax="0.2"></div>
            <div class="shape shape-4" data-parallax="0.5"></div>
        </div>
        
        <div class="hero-container">
            <div class="hero-content">
                
                <!-- 主标题区域 -->
                <div class="title-section">
                    <div class="title-backdrop">
                        <h1 class="hero-title">
                            <span class="title-line">{{ $t('download.hero.title') }}</span>
                            <span class="brand-highlight">
                                <span class="brand-text">Mint</span>
                                <div class="brand-underline"></div>
                            </span>
                        </h1>
                    </div>
                </div>
                
                <!-- 副标题 -->
                <div class="subtitle-container" data-enter-animation="fadeInUp" data-scroll-animate>
                    <p class="hero-subtitle" data-parallax="0.1">{{ $t('download.hero.subtitle') }}</p>
                    <div class="subtitle-accent shimmer-animation"></div>
                </div>
                
                <!-- 行动号召 -->
                <div class="cta-section" data-enter-animation="slideInUp" data-scroll-animate>
                    <div class="cta-arrow bounce-animation interactive-hover" data-hover-animate data-click-animate>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="7,13 12,18 17,13"></polyline>
                            <polyline points="7,6 12,11 17,6"></polyline>
                        </svg>
                    </div>
                    <span class="cta-text" data-enter-animation="fadeInUp">{{ $t('download.hero.cta') || '立即下载' }}</span>
                </div>
            </div>
        </div>
        
        <!-- 光效叠加 -->
        <div class="light-overlay">
            <div class="light-beam light-beam-1"></div>
            <div class="light-beam light-beam-2"></div>
        </div>
    </section>
</template>

<script setup lang="ts">
// 现代化的Hero组件，专注于视觉效果
</script>

<style scoped>
.hero-section {
    position: relative;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    overflow: hidden;
    padding: 60px 0;
}

/* 动态网格背景 */
.grid-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.08;
}

.grid-line {
    position: absolute;
    background: linear-gradient(90deg, transparent, #10b981, transparent);
    animation: gridPulse 4s ease-in-out infinite;
}

.grid-line[data-direction="horizontal"] {
    width: 100%;
    height: 1px;
    animation-delay: calc(var(--i, 0) * 0.1s);
}

.grid-line[data-direction="vertical"] {
    width: 1px;
    height: 100%;
    background: linear-gradient(0deg, transparent, #10b981, transparent);
    animation-delay: calc(var(--i, 0) * 0.1s + 2s);
}

@keyframes gridPulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.25; }
}

/* 浮动几何图形 */
.floating-shapes {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.shape {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(16, 185, 129, 0.08), rgba(59, 130, 246, 0.08));
    animation: float 6s ease-in-out infinite;
}

.shape-1 {
    width: 80px;
    height: 80px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.shape-2 {
    width: 60px;
    height: 60px;
    top: 60%;
    right: 15%;
    animation-delay: 1.5s;
    border-radius: 20%;
}

.shape-3 {
    width: 40px;
    height: 40px;
    top: 30%;
    right: 30%;
    animation-delay: 3s;
    transform: rotate(45deg);
}

.shape-4 {
    width: 70px;
    height: 70px;
    bottom: 20%;
    left: 20%;
    animation-delay: 4.5s;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
    }
    33% {
        transform: translateY(-15px) rotate(120deg);
    }
    66% {
        transform: translateY(8px) rotate(240deg);
    }
}

/* 主容器 */
.hero-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
    position: relative;
    z-index: 2;
}

.hero-content {
    animation: contentReveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(30px);
}

@keyframes contentReveal {
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes statusGlow {
    0% {
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
        border-color: rgba(16, 185, 129, 0.3);
    }
    100% {
        box-shadow: 0 0 25px rgba(16, 185, 129, 0.4);
        border-color: rgba(16, 185, 129, 0.5);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.8;
    }
}

/* 标题区域 */
.title-section {
    margin-bottom: 20px;
    position: relative;
}

.title-backdrop {
    position: relative;
    display: inline-block;
}

.title-backdrop::before {
    content: '';
    position: absolute;
    top: -15px;
    left: -30px;
    right: -30px;
    bottom: -15px;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.04), rgba(59, 130, 246, 0.04));
    border-radius: 15px;
    filter: blur(15px);
    z-index: -1;
}

.hero-title {
    font-size: clamp(2rem, 6vw, 4rem);
    font-weight: 900;
    line-height: 1.1;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.title-line {
    color: #ffffff;
    animation: titleSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.1s;
    opacity: 0;
    transform: translateX(-40px);
}

@keyframes titleSlideIn {
    0% {
        opacity: 0;
        transform: translateX(-40px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

.brand-highlight {
    position: relative;
    display: inline-block;
    animation: brandReveal 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.3s;
    opacity: 0;
    transform: scale(0.8);
}

@keyframes brandReveal {
    0% {
        opacity: 0;
        transform: scale(0.8) rotateY(-15deg);
    }
    100% {
        opacity: 1;
        transform: scale(1) rotateY(0deg);
    }
}

.brand-text {
    background: linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 3s ease-in-out infinite;
    position: relative;
    z-index: 1;
}

@keyframes gradientShift {
    0%, 100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
}

.brand-underline {
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6);
    border-radius: 2px;
    animation: underlineExpand 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.5s;
    transform: scaleX(0);
    transform-origin: left;
}

@keyframes underlineExpand {
    0% {
        transform: scaleX(0);
    }
    100% {
        transform: scaleX(1);
    }
}

/* 副标题 */
.subtitle-container {
    position: relative;
    margin-bottom: 32px;
}

.hero-subtitle {
    font-size: clamp(0.9rem, 2.5vw, 1.3rem);
    color: #94a3b8;
    font-weight: 300;
    line-height: 1.6;
    margin: 0 0 10px 0;
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
    animation: subtitleFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.6s;
    opacity: 0;
    transform: translateY(15px);
}

@keyframes subtitleFadeIn {
    0% {
        opacity: 0;
        transform: translateY(15px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.subtitle-accent {
    width: 50px;
    height: 2px;
    background: linear-gradient(90deg, #10b981, #3b82f6);
    margin: 0 auto;
    border-radius: 1px;
    animation: accentExpand 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.8s;
    transform: scaleX(0);
}

@keyframes accentExpand {
    0% {
        transform: scaleX(0);
    }
    100% {
        transform: scaleX(1);
    }
}

/* 行动号召 */
.cta-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    animation: ctaFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 1s;
    opacity: 0;
    transform: translateY(15px);
}

@keyframes ctaFadeIn {
    0% {
        opacity: 0;
        transform: translateY(15px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.cta-arrow {
    width: 36px;
    height: 36px;
    color: #10b981;
    animation: bounce 2s infinite;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-arrow:hover {
    color: #059669;
    transform: scale(1.1);
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-8px);
    }
    60% {
        transform: translateY(-4px);
    }
}

.cta-text {
    color: #64748b;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.4px;
    text-transform: uppercase;
}

/* 光效叠加 */
.light-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.light-beam {
    position: absolute;
    background: linear-gradient(45deg, transparent, rgba(16, 185, 129, 0.08), transparent);
    animation: lightSweep 8s linear infinite;
}

.light-beam-1 {
    width: 2px;
    height: 100%;
    left: -2px;
    animation-delay: 0s;
}

.light-beam-2 {
    width: 100%;
    height: 2px;
    top: -2px;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.08), transparent);
    animation-delay: 4s;
}

@keyframes lightSweep {
    0% {
        transform: translateX(-100vw) translateY(-100vh);
    }
    100% {
        transform: translateX(100vw) translateY(100vh);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .hero-section {
        min-height: 70vh;
        padding: 40px 0;
    }
    
    .hero-container {
        padding: 0 16px;
    }
    
    .status-indicator {
        padding: 6px 12px;
        font-size: 10px;
    }
    
    .hero-title {
        gap: 8px;
    }
    
    .floating-shapes .shape {
        opacity: 0.4;
    }
    
    .title-backdrop::before {
        left: -20px;
        right: -20px;
        top: -10px;
        bottom: -10px;
    }
}

@media (max-width: 480px) {
    .hero-section {
        padding: 30px 0;
    }
    
    .brand-underline {
        bottom: -4px;
        height: 2px;
    }
    
    .subtitle-accent {
        width: 35px;
    }
    
    .cta-arrow {
        width: 30px;
        height: 30px;
    }
    
    .cta-text {
        font-size: 11px;
    }
}
</style>