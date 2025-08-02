<template>
  <button @click="toggleTheme" class="theme-toggle" :class="{ 'switching': isSwitching }" :title="isDark ? '切换到浅色模式' : '切换到深色模式'">
    <!-- 太阳图标 (浅色模式) -->
    <svg v-show="!isDark" class="theme-icon sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
    </svg>
    
    <!-- 月亮图标 (深色模式) -->
    <svg v-show="isDark" class="theme-icon moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" fill="currentColor"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const isDark = ref(true) // 默认深色模式
const isSwitching = ref(false) // 切换动画状态

const toggleTheme = async () => {
  try {
    isSwitching.value = true
    
    // 添加页面切换动画 - 使用可选链操作符避免空引用错误
    const app = document.getElementById('app')
    if (app) {
      app.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      app.style.transform = 'scale(0.98)'
      app.style.filter = 'brightness(0.9)'
    }
    
    // 延迟切换主题
    setTimeout(async () => {
      isDark.value = !isDark.value
      await updateTheme()
      
      // 恢复页面动画 - 重新获取元素，避免使用可能已经过期的引用
      const appAfterUpdate = document.getElementById('app')
      if (appAfterUpdate) {
        setTimeout(() => {
          appAfterUpdate.style.transform = 'scale(1)'
          appAfterUpdate.style.filter = 'brightness(1)'
        }, 50)
      }
      
      // 重置切换状态
      setTimeout(() => {
        isSwitching.value = false
      }, 300)
    }, 100)
    
  } catch (error) {
    console.warn('主题切换失败:', error)
    isSwitching.value = false
  }
}

const updateTheme = async () => {
  try {
    await nextTick()
    
    const htmlElement = document.documentElement
    if (!htmlElement) return
    
    // 添加过渡效果
    htmlElement.style.transition = 'background-color 0.25s ease, color 0.25s ease'
    
    if (isDark.value) {
      htmlElement.classList.remove('light')
      htmlElement.classList.add('dark')
      try {
        localStorage.setItem('theme', 'dark')
      } catch (e) {
        console.warn('无法保存主题设置:', e)
      }
    } else {
      htmlElement.classList.remove('dark')
      htmlElement.classList.add('light')
      try {
        localStorage.setItem('theme', 'light')
      } catch (e) {
        console.warn('无法保存主题设置:', e)
      }
    }
  } catch (error) {
    console.warn('主题更新失败:', error)
  }
}

onMounted(async () => {
  try {
    await nextTick()
    
    let savedTheme = 'dark' // 默认值
    try {
      savedTheme = localStorage.getItem('theme') || 'dark'
    } catch (e) {
      console.warn('无法读取主题设置:', e)
    }
    
    isDark.value = savedTheme === 'dark'
    await updateTheme()
  } catch (error) {
    console.warn('主题初始化失败:', error)
  }
})
</script>

<style scoped>
.theme-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: transparent;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 44px;
  height: 44px;
  overflow: hidden;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* 移动端优化 */
@media (max-width: 767.98px) {
  .theme-toggle {
    padding: 8px;
    min-width: 36px;
    height: 36px;
    border-radius: 12px;
  }
  
  .theme-icon {
    width: 16px;
    height: 16px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 575.98px) {
  .theme-toggle {
    padding: 6px;
    min-width: 32px;
    height: 32px;
    border-radius: 10px;
  }
  
  .theme-icon {
    width: 14px;
    height: 14px;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .theme-toggle {
    min-width: 44px;
    min-height: 44px;
  }
  
  .theme-toggle:hover::before {
    width: 0;
    height: 0;
  }
  
  .theme-toggle:active::before {
    width: 60px;
    height: 60px;
  }
}

/* 添加按钮背景光晕效果 */
.theme-toggle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate(-50%, -50%);
  z-index: -1;
}

.theme-toggle:hover::before {
  width: 80px;
  height: 80px;
}

/* 切换动画状态 */
.theme-toggle.switching {
  transform: scale(0.9) rotate(180deg);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.theme-toggle.switching .theme-icon {
  opacity: 0.7;
  transform: scale(1.2) rotate(360deg);
}

/* 浅色模式样式 */
:global(.light) .theme-toggle {
  color: #f59e0b;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
}

:global(.light) .theme-toggle:hover {
  color: #d97706;
  background-color: rgba(245, 158, 11, 0.1);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
}

:global(.light) .theme-toggle::before {
  background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
}

/* 深色模式样式 */
:global(.dark) .theme-toggle {
  color: #60a5fa;
  box-shadow: 0 2px 8px rgba(96, 165, 250, 0.1);
}

:global(.dark) .theme-toggle:hover {
  color: #3b82f6;
  background-color: rgba(96, 165, 250, 0.1);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.2);
}

:global(.dark) .theme-toggle::before {
  background: radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%);
}

/* 图标动画 */
.theme-icon {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 0 8px transparent);
}

/* 太阳图标特殊效果 */
.sun-icon {
  filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.3));
  animation: sunRotate 4s linear infinite, iconPulse 1.5s ease-in-out infinite;
}

/* 月亮图标特殊效果 */
.moon-icon {
  filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.3));
  animation: moonFloat 2s ease-in-out infinite, iconPulse 1.5s ease-in-out infinite;
}

/* 悬停时的图标动画 */
.theme-toggle:hover .theme-icon {
  transform: rotate(15deg) scale(1.15);
  animation-play-state: paused;
}

.theme-toggle:hover .sun-icon {
  filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.5));
}

.theme-toggle:hover .moon-icon {
  filter: drop-shadow(0 0 12px rgba(96, 165, 250, 0.5));
}

/* 点击时的动画 */
.theme-toggle:active {
  transform: translateY(-1px) scale(0.95);
  transition: all 0.1s ease;
}

.theme-toggle:active .theme-icon {
  transform: rotate(0deg) scale(0.9);
}

/* 图标动画关键帧 */
@keyframes iconPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes sunRotate {
  0% {
    transform: rotate(0deg) scale(1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

@keyframes moonFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(-2px) rotate(5deg) scale(1.02);
  }
}

/* 全局主题过渡动画 */
:global(html) {
  transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
              color 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:global(body) {
  transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
              color 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:global(#app) {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
              filter 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
</style>
