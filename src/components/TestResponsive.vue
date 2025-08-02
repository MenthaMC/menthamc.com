<template>
  <div class="test-responsive">
    <div class="container">
      <h2 class="test-title">响应式测试页面</h2>
      
      <!-- 屏幕尺寸显示 -->
      <div class="screen-info">
        <p>当前屏幕宽度: <span class="screen-width">{{ screenWidth }}px</span></p>
        <p>当前断点: <span class="screen-size">{{ screenSize }}</span></p>
      </div>
      
      <!-- 响应式网格测试 -->
      <div class="grid-test">
        <h3>响应式网格测试</h3>
        <div class="row">
          <div class="col col-xl-3 col-lg-4 col-md-6 col-sm-12">
            <div class="test-card">
              <h4>卡片 1</h4>
              <p>这是第一个测试卡片</p>
            </div>
          </div>
          <div class="col col-xl-3 col-lg-4 col-md-6 col-sm-12">
            <div class="test-card">
              <h4>卡片 2</h4>
              <p>这是第二个测试卡片</p>
            </div>
          </div>
          <div class="col col-xl-3 col-lg-4 col-md-6 col-sm-12">
            <div class="test-card">
              <h4>卡片 3</h4>
              <p>这是第三个测试卡片</p>
            </div>
          </div>
          <div class="col col-xl-3 col-lg-4 col-md-6 col-sm-12">
            <div class="test-card">
              <h4>卡片 4</h4>
              <p>这是第四个测试卡片</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 按钮测试 -->
      <div class="button-test">
        <h3>按钮响应式测试</h3>
        <div class="button-group">
          <button class="test-btn primary">主要按钮</button>
          <button class="test-btn secondary">次要按钮</button>
          <button class="test-btn outline">轮廓按钮</button>
        </div>
      </div>
      
      <!-- 文字大小测试 -->
      <div class="typography-test">
        <h3>文字响应式测试</h3>
        <h1>标题 H1</h1>
        <h2>标题 H2</h2>
        <h3>标题 H3</h3>
        <h4>标题 H4</h4>
        <p>这是一段普通的段落文字，用来测试在不同屏幕尺寸下的显示效果。</p>
      </div>
      
      <!-- 表单测试 -->
      <div class="form-test">
        <h3>表单响应式测试</h3>
        <form class="test-form">
          <div class="form-group">
            <label for="name">姓名</label>
            <input type="text" id="name" placeholder="请输入姓名">
          </div>
          <div class="form-group">
            <label for="email">邮箱</label>
            <input type="email" id="email" placeholder="请输入邮箱">
          </div>
          <div class="form-group">
            <label for="message">消息</label>
            <textarea id="message" rows="4" placeholder="请输入消息"></textarea>
          </div>
          <button type="submit" class="submit-btn">提交</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const screenWidth = ref(window.innerWidth)
const screenSize = ref('xl')

const breakpoints = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1400
}

const updateScreenInfo = () => {
  screenWidth.value = window.innerWidth
  
  if (screenWidth.value < breakpoints.xs) {
    screenSize.value = 'xs (超小屏幕)'
  } else if (screenWidth.value < breakpoints.sm) {
    screenSize.value = 'sm (小屏幕)'
  } else if (screenWidth.value < breakpoints.md) {
    screenSize.value = 'md (中等屏幕)'
  } else if (screenWidth.value < breakpoints.lg) {
    screenSize.value = 'lg (大屏幕)'
  } else if (screenWidth.value < breakpoints.xl) {
    screenSize.value = 'xl (超大屏幕)'
  } else {
    screenSize.value = 'xxl (超超大屏幕)'
  }
}

onMounted(() => {
  updateScreenInfo()
  window.addEventListener('resize', updateScreenInfo)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenInfo)
})
</script>

<style scoped>
.test-responsive {
  padding: 2rem 0;
  min-height: 100vh;
}

.test-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.screen-info {
  background: rgba(102, 126, 234, 0.1);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.screen-width, .screen-size {
  font-weight: 600;
  color: #667eea;
}

.grid-test, .button-test, .typography-test, .form-test {
  margin-bottom: 3rem;
}

.grid-test h3, .button-test h3, .typography-test h3, .form-test h3 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.test-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.test-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.test-card h4 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.test-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  min-width: 120px;
}

.test-btn.primary {
  background: #667eea;
  color: white;
}

.test-btn.secondary {
  background: #6b7280;
  color: white;
}

.test-btn.outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.test-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.typography-test h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.typography-test h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.typography-test h3 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.typography-test h4 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.typography-test p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.test-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  font-size: 16px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

/* 深色模式适配 */
:global(.dark) .test-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

:global(.light) .test-card {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.1);
}

:global(.dark) .screen-info {
  background: rgba(102, 126, 234, 0.15);
}

:global(.light) .screen-info {
  background: rgba(102, 126, 234, 0.1);
}

/* 移动端响应式适配 */
@media (max-width: 575.98px) {
  .test-title {
    font-size: 1.8rem;
  }
  
  .button-group {
    flex-direction: column;
    align-items: center;
  }
  
  .test-btn {
    width: 100%;
    max-width: 280px;
  }
  
  .typography-test h1 {
    font-size: 2rem;
  }
  
  .typography-test h2 {
    font-size: 1.75rem;
  }
  
  .typography-test h3 {
    font-size: 1.5rem;
  }
  
  .typography-test h4 {
    font-size: 1.25rem;
  }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .test-title {
    font-size: 2rem;
  }
  
  .button-group {
    justify-content: center;
  }
  
  .typography-test h1 {
    font-size: 2.5rem;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .test-title {
    font-size: 2.25rem;
  }
}
</style>