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
        <a href="#" class="nav-link">首页</a>
        <a href="#" class="nav-link">下载</a>
        <a href="#" class="nav-link">文档</a>
        <a href="#" class="nav-link">社区</a>
      </div>

      <!-- 右侧操作区 -->
      <div class="nav-actions">
        <ThemeToggle />
        <button class="game-btn">
          立即开始
        </button>
      </div>

      <!-- 移动端菜单按钮 -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>

    <!-- 移动端菜单 -->
    <div class="mobile-menu" :class="{ active: isMobileMenuOpen }">
      <div class="mobile-nav-links">
        <a href="#" class="mobile-nav-link">首页</a>
        <a href="#" class="mobile-nav-link">下载</a>
        <a href="#" class="mobile-nav-link">文档</a>
        <a href="#" class="mobile-nav-link">社区</a>
      </div>
      <div class="mobile-actions">
        <ThemeToggle />
        <button class="mobile-game-btn">
          立即开始
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeToggle from './ThemeToggle.vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<style scoped>
/* 导航栏基础样式 - 浅色模式 */
.navbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 1200px;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInFromTop 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  transform: translateX(-50%) translateY(-30px);
  
  /* 浅色模式样式 */
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
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

/* 深色模式 */
:global(html.dark) .navbar {
  background: linear-gradient(135deg, 
    rgba(17, 24, 39, 0.95) 0%, 
    rgba(31, 41, 55, 0.9) 50%,
    rgba(55, 65, 81, 0.85) 100%) !important;
  border: 1px solid rgba(75, 85, 99, 0.4) !important;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

/* 浅色模式 */
:global(html.light) .navbar {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.9) 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
}

/* 浅色模式悬停效果 */
:global(html.light) .navbar:hover {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(248, 250, 252, 0.95) 100%) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.12),
    0 6px 20px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8) !important;
}

/* 深色模式悬停效果 */
:global(html.dark) .navbar:hover {
  background: linear-gradient(135deg, 
    rgba(17, 24, 39, 0.98) 0%, 
    rgba(31, 41, 55, 0.95) 50%,
    rgba(55, 65, 81, 0.9) 100%) !important;
  border-color: rgba(75, 85, 99, 0.6) !important;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.5),
    0 6px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.logo-link:hover .logo-text {
  filter: brightness(1.1);
}

/* Logo动画 */
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
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  font-size: 18px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: linkSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}

.nav-link:nth-child(1) { animation-delay: 0.4s; }
.nav-link:nth-child(2) { animation-delay: 0.5s; }
.nav-link:nth-child(3) { animation-delay: 0.6s; }
.nav-link:nth-child(4) { animation-delay: 0.7s; }

.nav-link:hover {
  color: #1f2937;
  transform: translateY(-2px);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 100%;
}

/* 导航链接动画 */
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

:global(.dark) .nav-link {
  color: #d1d5db;
}

:global(.dark) .nav-link:hover {
  color: #ffffff;
}

/* 右侧操作区 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 40px;
}

/* 确保所有子组件垂直居中对齐 */
.nav-actions > * {
  display: flex;
  align-items: center;
  height: 100%;
}

.game-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: buttonSlideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards;
  opacity: 0;
  transform: translateX(30px);
}

.game-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.5);
}

.game-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.game-btn:hover::before {
  left: 100%;
}

/* 按钮动画 */
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
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: #6b7280;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.mobile-menu-btn:hover .hamburger-line {
  background: #1f2937;
}

.mobile-menu-btn:hover .hamburger-line:nth-child(1) {
  transform: translateY(-1px);
}

.mobile-menu-btn:hover .hamburger-line:nth-child(3) {
  transform: translateY(1px);
}

:global(html.dark) .hamburger-line {
  background: #d1d5db;
}

:global(html.light) .hamburger-line {
  background: #6b7280;
}

/* 移动端菜单 */
.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  backdrop-filter: blur(15px);
  border-radius: 16px;
  margin-top: 10px;
  padding: 24px;
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 浅色模式移动端菜单 */
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(248, 250, 252, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.15),
    0 6px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* 浅色模式移动端菜单 */
:global(html.light) .mobile-menu {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(248, 250, 252, 0.95) 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
}

/* 深色模式移动端菜单 */
:global(html.dark) .mobile-menu {
  background: linear-gradient(135deg, 
    rgba(17, 24, 39, 0.98) 0%, 
    rgba(31, 41, 55, 0.95) 50%,
    rgba(55, 65, 81, 0.9) 100%) !important;
  border: 1px solid rgba(75, 85, 99, 0.4) !important;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.mobile-menu.active {
  opacity: 1;
  transform: translateY(0) scale(1);
  box-shadow: 
    0 15px 50px rgba(0, 0, 0, 0.2),
    0 8px 25px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.mobile-menu.active .mobile-nav-link {
  animation: mobileNavSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  transform: translateX(-20px);
}

.mobile-menu.active .mobile-nav-link:nth-child(1) { animation-delay: 0.1s; }
.mobile-menu.active .mobile-nav-link:nth-child(2) { animation-delay: 0.2s; }
.mobile-menu.active .mobile-nav-link:nth-child(3) { animation-delay: 0.3s; }
.mobile-menu.active .mobile-nav-link:nth-child(4) { animation-delay: 0.4s; }

/* 移动端导航链接动画 */
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
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 0;
  transition: color 0.3s ease;
}

.mobile-nav-link:hover {
  color: #1f2937;
}

:global(html.dark) .mobile-nav-link {
  color: #d1d5db;
}

:global(html.dark) .mobile-nav-link:hover {
  color: #ffffff;
}

:global(html.light) .mobile-nav-link {
  color: #6b7280;
}

:global(html.light) .mobile-nav-link:hover {
  color: #1f2937;
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
}

/* 移动端组件对齐 */
.mobile-actions > * {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
}

.mobile-game-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  width: 100%;
}

.mobile-game-btn:active {
  transform: scale(0.98);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.2);
}

.mobile-game-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.mobile-game-btn:active::before {
  left: 100%;
}

/* 响应式设计 */
/* 超小屏幕 (< 576px) */
@media (max-width: 575.98px) {
  .navbar {
    width: calc(100% - 20px);
    top: 10px;
    border-radius: 14px;
  }
  
  .nav-container {
    padding: 6px 16px;
    height: 48px;
    min-height: 48px;
  }
  
  .nav-links {
    display: none;
  }
  
  .nav-actions {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
    width: 32px;
    height: 32px;
  }
  
  .hamburger-line {
    width: 18px;
    height: 2px;
    gap: 4px;
  }
  
  .mobile-menu {
    display: block;
    padding: 16px;
    border-radius: 14px;
    margin-top: 6px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
  
  .logo-text {
    font-size: 18px;
  }
  
  .mobile-nav-link {
    font-size: 16px;
    padding: 10px 0;
  }
  
  .mobile-game-btn {
    padding: 12px 20px;
    font-size: 16px;
    border-radius: 10px;
    margin-top: 8px;
  }
}

/* 小屏幕 (576px - 767.98px) */
@media (min-width: 576px) and (max-width: 767.98px) {
  .navbar {
    width: calc(100% - 16px);
    top: 8px;
    border-radius: 14px;
  }
  
  .nav-container {
    padding: 6px 16px;
    height: 48px;
  }
  
  .nav-links {
    display: none;
  }
  
  .nav-actions {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
    width: 30px;
    height: 30px;
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
    font-size: 18px;
  }
  
  .mobile-nav-link {
    font-size: 15px;
    padding: 8px 0;
  }
  
  .mobile-game-btn {
    padding: 10px 18px;
    font-size: 15px;
    border-radius: 10px;
  }
}

/* 中等屏幕 (768px - 991.98px) */
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
  
  .mobile-menu-btn {
    display: none;
  }
  
  .mobile-menu {
    display: none;
  }
  
  .logo-text {
    font-size: 22px;
  }
  
  .game-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}

/* 大屏幕 (992px - 1199.98px) */
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
    font-size: 14px;
  }
}

/* 超大屏幕 (≥ 1200px) */
@media (min-width: 1200px) {
  .navbar {
    width: calc(100% - 40px);
    top: 20px;
  }
  
  .nav-container {
    padding: 12px 24px;
    height: 64px;
  }
  
  .nav-links {
    gap: 32px;
  }
  
  .nav-link {
    font-size: 18px;
  }
  
  .logo-text {
    font-size: 24px;
  }
  
  .game-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}

/* 移动端菜单按钮动画优化 */
@media (max-width: 767.98px) {
  .mobile-menu-btn:hover .hamburger-line:nth-child(1) {
    transform: translateY(-0.5px);
  }
  
  .mobile-menu-btn:hover .hamburger-line:nth-child(3) {
    transform: translateY(0.5px);
  }
  
  /* 移动端触摸优化 */
  .mobile-nav-link,
  .mobile-game-btn {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
  }
  
  .mobile-nav-link {
    justify-content: flex-start;
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