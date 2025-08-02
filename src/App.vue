<template>
  <ResponsiveLayout>
    <div id="app">
      <Navbar />
      <main class="main-content">
        <!-- 主要内容区域 -->
        <div class="container">
          <div class="hero-section">
            <h1 class="hero-title">欢迎来到 MenthaMC</h1>
            <p class="hero-description">体验最佳的 Minecraft 服务端</p>
            <div class="hero-actions">
              <button class="primary-btn" @click="showTest = !showTest">
                {{ showTest ? '隐藏测试' : '响应式测试' }}
              </button>
              <button class="secondary-btn">了解更多</button>
            </div>
          </div>
          
          <!-- 响应式测试组件 -->
          <TestResponsive v-if="showTest" />
        </div>
      </main>
    </div>
  </ResponsiveLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import ResponsiveLayout from './components/ResponsiveLayout.vue'
import TestResponsive from './components/TestResponsive.vue'

const showTest = ref(false)

// 确保主题在页面加载时正确初始化
onMounted(() => {
  try {
    let savedTheme = 'dark' // 默认值
    try {
      savedTheme = localStorage.getItem('theme') || 'dark'
    } catch (e) {
      console.warn('无法从 localStorage 读取主题设置:', e)
    }
    
    const htmlElement = document.documentElement
    if (!htmlElement) return
    
    if (savedTheme === 'light') {
      htmlElement.classList.remove('dark')
      htmlElement.classList.add('light')
    } else {
      // 默认深色模式
      htmlElement.classList.remove('light')
      htmlElement.classList.add('dark')
    }
  } catch (error) {
    console.warn('主题初始化失败:', error)
    // 确保至少有一个主题类
    try {
      const htmlElement = document.documentElement
      if (htmlElement) {
        htmlElement.classList.add('dark')
      }
    } catch (e) {
      console.warn('无法设置默认主题:', e)
    }
  }
})
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  height: 100%;
  position: relative;
  overflow-x: hidden;
  transition: all 0.3s ease;
  margin: 0;
  padding: 0;
  width: 100%;
}

/* 主要内容区域 */
.main-content {
  padding-top: calc(var(--nav-height) + 40px);
  min-height: 100vh;
  width: 100%;
}

/* 英雄区域 */
.hero-section {
  text-align: center;
  padding: 4rem 0;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.8;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.primary-btn, .secondary-btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  min-width: 120px;
  touch-action: manipulation;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.secondary-btn {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.secondary-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* 浅色模式文字颜色 */
:global(.light) .hero-description {
  color: #6b7280;
}

:global(.light) .secondary-btn {
  color: #667eea;
  border-color: #667eea;
}

/* 深色模式文字颜色 */
:global(.dark) .hero-description {
  color: #d1d5db;
}

:global(.dark) .secondary-btn {
  color: #8b5cf6;
  border-color: #8b5cf6;
}

:global(.dark) .secondary-btn:hover {
  background: #8b5cf6;
  color: white;
}

/* 移动端响应式适配 */
/* 超小屏幕 (< 576px) */
@media (max-width: 575.98px) {
  .main-content {
    padding-top: calc(var(--nav-height) + 30px);
  }
  
  .hero-section {
    padding: 2.5rem 0;
  }
  
  .hero-title {
    font-size: 2.2rem;
    margin-bottom: 1.2rem;
    line-height: 1.2;
  }
  
  .hero-description {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    padding: 0 1.2rem;
    line-height: 1.5;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1.5rem;
  }
  
  .primary-btn, .secondary-btn {
    width: 100%;
    max-width: 300px;
    padding: 16px 24px;
    font-size: 16px;
    border-radius: 14px;
  }
  
  .primary-btn {
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  
  .secondary-btn {
    border-width: 2px;
    margin-top: 0.5rem;
  }
}

/* 小屏幕 (576px - 767.98px) */
@media (min-width: 576px) and (max-width: 767.98px) {
  .main-content {
    padding-top: calc(var(--nav-height) + 35px);
  }
  
  .hero-section {
    padding: 3rem 0;
  }
  
  .hero-title {
    font-size: 2.8rem;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }
  
  .hero-description {
    font-size: 1.15rem;
    margin-bottom: 2.25rem;
    padding: 0 1.5rem;
    line-height: 1.6;
  }
  
  .hero-actions {
    gap: 1.25rem;
  }
  
  .primary-btn, .secondary-btn {
    padding: 14px 24px;
    font-size: 16px;
    min-width: 160px;
    border-radius: 14px;
  }
  
  .primary-btn {
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.35);
  }
}

/* 中等屏幕 (768px - 991.98px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .main-content {
    padding-top: calc(var(--nav-height) + 30px);
  }
  
  .hero-section {
    padding: 3rem 0;
  }
  
  .hero-title {
    font-size: 3rem;
    margin-bottom: 1.375rem;
  }
  
  .hero-description {
    font-size: 1.15rem;
    margin-bottom: 2.25rem;
  }
  
  .primary-btn, .secondary-btn {
    padding: 12px 20px;
    font-size: 15px;
    min-width: 130px;
  }
}

/* 大屏幕 (992px - 1199.98px) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  .main-content {
    padding-top: calc(var(--nav-height) + 35px);
  }
  
  .hero-section {
    padding: 3.5rem 0;
  }
  
  .hero-title {
    font-size: 3.25rem;
  }
  
  .hero-description {
    font-size: 1.2rem;
  }
}

/* 横屏模式优化 */
@media (max-height: 500px) and (orientation: landscape) {
  .main-content {
    padding-top: calc(var(--nav-height) + 20px);
  }
  
  .hero-section {
    padding: 1.5rem 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 90%;
  }
  
  .hero-title {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    width: 100%;
  }
  
  .hero-description {
    font-size: 1rem;
    margin-bottom: 1rem;
    width: 100%;
  }
  
  .hero-actions {
    gap: 1rem;
    flex-direction: row;
    width: 100%;
    justify-content: center;
  }
  
  .primary-btn, .secondary-btn {
    padding: 10px 20px;
    font-size: 14px;
    min-width: 120px;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .primary-btn, .secondary-btn {
    min-height: 50px;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  
  .primary-btn:hover, .secondary-btn:hover {
    transform: none;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
  
  .primary-btn:active {
    transform: scale(0.97);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
    transition: all 0.1s ease;
  }
  
  .secondary-btn:active {
    transform: scale(0.97);
    background: rgba(102, 126, 234, 0.1);
    transition: all 0.1s ease;
  }
  
  /* 确保按钮有足够的点击区域 */
  .hero-actions {
    margin: 0 auto;
    max-width: 320px;
  }
  
  .hero-actions button {
    margin: 0 auto;
    display: block;
  }
}

/* 浅色模式背景 */
.light #app {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%);
}

.light #app::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(99, 102, 241, 0.02) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

/* 深色模式背景 */
.dark #app {
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
}

.dark #app::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.06) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  height: 100%;
  overflow-x: hidden;
}

/* 浅色模式文字 */
.light body {
  background: #f8fafc !important;
  color: #1f2937;
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
  height: 100%;
}

/* 深色模式文字 */
.dark body {
  background: #0f0f0f !important;
  color: #ffffff;
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
  height: 100%;
}

/* 默认深色模式 */
html, body {
  background: #0f0f0f !important;
  color: #ffffff;
  line-height: 1.6;
  overflow-x: hidden;
  transition: all 0.3s ease;
  min-height: 100vh;
  height: 100%;
  margin: 0;
  padding: 0;
}

/* 确保页面完全覆盖 */
html {
  height: 100%;
  background: #0f0f0f !important;
}

/* 浅色模式html背景 */
html.light {
  background: #f8fafc !important;
}

/* 深色模式html背景 */
html.dark {
  background: #0f0f0f !important;
}
</style>