<template>
  <section class="download-options">
    <div class="options-container">
      <!-- 下载详情 -->
      <div class="download-details">
        <div class="selected-version">
          <div class="version-display">
            <div class="version-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
            </div>
            <div class="version-text">
              <h3>Mint {{ currentVersionInfo.version }}</h3>
            </div>
          </div>

          <div class="file-specs">
            <div class="spec-item">
              <div class="spec-icon">📦</div>
              <div class="spec-details">
                <span class="spec-label">文件大小</span>
                <span class="spec-value">{{ currentVersionInfo.size }}</span>
              </div>
            </div>
            <div class="spec-item">
              <div class="spec-icon">☕</div>
              <div class="spec-details">
                <span class="spec-label">Java 版本</span>
                <span class="spec-value">{{ currentVersionInfo.java }}</span>
              </div>
            </div>
            <div class="spec-item">
              <div class="spec-icon">🔧</div>
              <div class="spec-details">
                <span class="spec-label">构建号</span>
                <span class="spec-value">#{{ currentVersionInfo.build }}</span>
              </div>
            </div>
            <div class="spec-item">
              <div class="spec-icon">📅</div>
              <div class="spec-details">
                <span class="spec-label">发布日期</span>
                <span class="spec-value">{{ currentVersionInfo.releaseDate }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- 所有按钮移到卡片底部 -->
      <div class="card-footer">
        <!-- 主下载按钮 -->
        <div class="primary-download">
          <button class="download-btn" @click="startDownload">
            <!-- 按钮内容 -->
            <div class="btn-content">
              <!-- 图标区域 -->
              <div class="btn-icon-wrapper">
                <svg class="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>

              <!-- 文字区域 -->
              <div class="btn-text-wrapper">
                <span class="btn-text">
                  {{ getButtonText() }}
                </span>
                <span class="btn-subtext">
                  {{ getButtonSubtext() }}
                </span>
              </div>
            </div>
          </button>

          <!-- 文件信息提示 -->
          <div class="download-info">
            <div class="file-size">{{ currentVersionInfo.size }}</div>
            <div class="file-type">JAR 文件</div>
          </div>
        </div>

        <!-- 辅助操作按钮 -->
        <div class="secondary-actions">
          <button class="action-btn verify-btn" @click="verifyFile">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
              </svg>
            </div>
            <span class="action-text">校验文件</span>
          </button>

          <button class="action-btn docs-btn" @click="openDocs">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
            </div>
            <span class="action-text">查看文档</span>
          </button>

          <button class="action-btn changelog-btn" @click="viewChangelog">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            </div>
            <span class="action-text">更新日志</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

// 响应式数据
const selectedVersion = ref('1218')
const isDropdownOpen = ref(false)

// 版本数据
const versions = ref([
  {
    id: '1218',
    version: '1.21.8',
    status: 'stable',
    build: '95',
    size: '45.2MB',
    java: '21+',
    releaseDate: '2024-01-15',
    recommended: true,
    latest: true
  },
  {
    id: '1214',
    version: '1.21.4',
    status: 'stable',
    build: '82',
    size: '44.8MB',
    java: '17+',
    releaseDate: '2024-01-10',
    recommended: false,
    latest: false
  },
  {
    id: '1213',
    version: '1.21.3',
    status: 'legacy',
    build: '76',
    size: '44.5MB',
    java: '17+',
    releaseDate: '2024-01-05',
    recommended: false,
    latest: false
  },
  {
    id: '1212',
    version: '1.21.2',
    status: 'legacy',
    build: '71',
    size: '44.2MB',
    java: '17+',
    releaseDate: '2023-12-28',
    recommended: false,
    latest: false
  },
  {
    id: '1211',
    version: '1.21.1',
    status: 'legacy',
    build: '68',
    size: '43.9MB',
    java: '17+',
    releaseDate: '2023-12-20',
    recommended: false,
    latest: false
  },
  {
    id: '1210',
    version: '1.21.0',
    status: 'legacy',
    build: '65',
    size: '43.6MB',
    java: '17+',
    releaseDate: '2023-12-15',
    recommended: false,
    latest: false
  }
])

// 计算属性
const currentVersionInfo = computed(() => {
  return versions.value.find(v => v.id === selectedVersion.value) || versions.value[0]
})

// 方法
const selectVersion = (versionId: string) => {
  selectedVersion.value = versionId
}

const selectVersionFromDropdown = (versionId: string) => {
  selectedVersion.value = versionId
  isDropdownOpen.value = false
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const startDownload = () => {
  // 创建下载链接并触发下载
  const filename = `mint-${currentVersionInfo.value.version}-${currentVersionInfo.value.build}.jar`
  const downloadUrl = `https://github.com/MenthaMC/Mint/releases/download/v${currentVersionInfo.value.version}/${filename}`

  // 创建临时链接进行下载
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 获取按钮文字
const getButtonText = () => {
  return '立即下载'
}

// 获取按钮副文字
const getButtonSubtext = () => {
  return `Mint ${currentVersionInfo.value.version}`
}

// 校验文件
const verifyFile = () => {
  alert('文件校验功能开发中...')
}

// 打开文档
const openDocs = () => {
  window.open('https://menthamc.github.io/docs/', '_blank')
}

// 查看更新日志
const viewChangelog = () => {
  const changelogUrl = `https://github.com/MenthaMC/Mint/releases/tag/v${currentVersionInfo.value.version}`
  window.open(changelogUrl, '_blank')
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.custom-select')) {
    isDropdownOpen.value = false
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

<style scoped>
.download-options {
  padding: 60px 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
}

.options-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.card-header {
  text-align: center;
  margin-bottom: 24px;
  animation: headerFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes headerFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.8) rotateX(-15deg);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.05) rotateX(5deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotateX(0deg);
  }
}

.card-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
}

.card-header p {
  font-size: 1.1rem;
  color: #94a3b8;
}

/* 版本选择器 */
.version-selector {
  margin-bottom: 24px;
  animation: selectorFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: 0.2s;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes selectorFadeIn {
  0% {
    opacity: 0;
    transform: translateX(-100px) rotate(-5deg);
    filter: blur(5px);
  }

  60% {
    opacity: 0.8;
    transform: translateX(10px) rotate(1deg);
    filter: blur(1px);
  }

  100% {
    opacity: 1;
    transform: translateX(0) rotate(0deg);
    filter: blur(0px);
  }
}

.selector-wrapper {
  max-width: 450px;
  margin: 0 auto;
}

.selector-label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
  text-align: center;
}

.custom-select {
  position: relative;
  background: rgba(30, 41, 59, 0.8);
  border: 2px solid rgba(51, 65, 85, 0.4);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-select:hover {
  border-color: rgba(16, 185, 129, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.custom-select.open {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  transform: translateY(-2px);
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  cursor: pointer;
}

.selected-version {
  flex: 1;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.version-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.version-badges {
  display: flex;
  gap: 6px;
}

.mini-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mini-badge.latest {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #000;
}

.version-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.build-info {
  color: #94a3b8;
}

.release-info {
  color: #94a3b8;
}

.dropdown-arrow {
  color: #10b981;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-select.open .dropdown-arrow {
  transform: rotate(180deg);
  color: #059669;
}

.dropdown-options {
  position: absolute;
  top: calc(100% + 10px);
  width: 100%;
  z-index: 10000;
  scrollbar-width: none;
  background-color: rgb(15, 23, 42);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 16px;
  margin-top: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  max-height: 400px;
  overflow-y: auto;
  animation: dropdownSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top center;
}

@keyframes dropdownSlideIn {
  0% {
    opacity: 0;
    transform: rotateX(-90deg) translateY(-20px);
    transform-origin: top center;
  }

  50% {
    opacity: 0.7;
    transform: rotateX(-10deg) translateY(-5px);
  }

  100% {
    opacity: 1;
    transform: rotateX(0deg) translateY(0);
  }
}

.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.options-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.options-list {
  padding: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(0);
  opacity: 1;
  animation: optionSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.option-item:nth-child(1) {
  animation-delay: 0.1s;
}

.option-item:nth-child(2) {
  animation-delay: 0.15s;
}

.option-item:nth-child(3) {
  animation-delay: 0.2s;
}

.option-item:nth-child(4) {
  animation-delay: 0.25s;
}

.option-item:nth-child(5) {
  animation-delay: 0.3s;
}

.option-item:nth-child(6) {
  animation-delay: 0.35s;
}

@keyframes optionSlideIn {
  0% {
    opacity: 0;
    transform: scale(0.3) rotateY(-180deg);
    filter: brightness(0.5);
  }

  70% {
    opacity: 0.9;
    transform: scale(1.1) rotateY(10deg);
    filter: brightness(1.2);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotateY(0deg);
    filter: brightness(1);
  }
}

.option-item:hover {
  background: rgba(30, 41, 59, 0.6);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.option-item.selected {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.option-main {
  flex: 1;
}

.option-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.option-version {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
}

.option-badges {
  display: flex;
  gap: 6px;
}

.option-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.option-badge.latest {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #000;
}

.option-details {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.detail {
  font-size: 12px;
  color: #94a3b8;
}

.option-check {
  color: #10b981;
  margin-left: 16px;
}

/* 滚动条样式 */
.dropdown-options::-webkit-scrollbar {
  width: 6px;
}

.dropdown-options::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.4);
  border-radius: 3px;
}

.dropdown-options::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.3);
  border-radius: 3px;
}

.dropdown-options::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.5);
}

/* 下载详情 */
.download-details {
  display: block;
}

.selected-version {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.version-display {
  display: flex;
  align-items: center;
  gap: 20px;
  animation: versionDisplayFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  transform: translateX(-30px);
}

@keyframes versionDisplayFadeIn {
  0% {
    opacity: 0;
    transform: translateY(50px) rotateZ(-10deg) scale(0.8);
    filter: blur(8px);
  }

  60% {
    opacity: 0.8;
    transform: translateY(-10px) rotateZ(2deg) scale(1.05);
    filter: blur(2px);
  }

  100% {
    opacity: 1;
    transform: translateY(0) rotateZ(0deg) scale(1);
    filter: blur(0px);
  }
}

.version-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.version-icon:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.version-icon svg {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.version-icon:hover svg {
  transform: scale(1.1);
}

.version-icon svg {
  width: 32px;
  height: 32px;
}

.version-text h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #ffffff;
}

.version-text p {
  font-size: 1rem;
  color: #94a3b8;
  margin: 0;
}

.file-specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
  opacity: 1;
  animation: specItemFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.spec-item:nth-child(1) {
  animation-delay: 0.1s;
}

.spec-item:nth-child(2) {
  animation-delay: 0.2s;
}

.spec-item:nth-child(3) {
  animation-delay: 0.3s;
}

.spec-item:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes specItemFadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px) rotateX(-45deg) scale(0.7);
    filter: saturate(0.3);
  }

  50% {
    opacity: 0.7;
    transform: translateY(-5px) rotateX(5deg) scale(1.1);
    filter: saturate(1.3);
  }

  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0deg) scale(1);
    filter: saturate(1);
  }
}

.spec-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.spec-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.spec-item:hover .spec-icon {
  transform: scale(1.1);
}

.spec-icon {
  font-size: 20px;
}

.spec-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.spec-label {
  font-size: 12px;
  color: #64748b;
}

.spec-value {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

/* 下载操作区域 */
.download-action {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 320px;
}

/* 主下载按钮容器 */
.primary-download {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 简化的下载按钮 */
.download-btn {
  width: 100%;
  padding: 20px 28px;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 16px;
  cursor: pointer;
  min-height: 70px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  position: relative;
  overflow: hidden;
}

.download-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.download-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  border-color: rgba(16, 185, 129, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.download-btn:hover::before {
  left: 100%;
}

.download-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

/* 按钮内容 */
.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

/* 图标包装器 */
.btn-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.download-icon {
  width: 28px;
  height: 28px;
}

/* 文字区域 */
.btn-text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.btn-text {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
}

.btn-subtext {
  font-size: 12px;
  opacity: 0.8;
  font-weight: 400;
}

/* 下载信息 */
.download-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.file-size {
  font-size: 14px;
  font-weight: 600;
  color: #10b981;
}

.file-type {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 卡片底部 */
.card-footer {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 辅助操作按钮 */
.secondary-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
  transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:active {
  transform: translateY(0);
}

.action-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover .action-icon {
  transform: scale(1.1);
}

.action-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon svg {
  width: 100%;
  height: 100%;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .download-details {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .download-action {
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .options-container {
    padding: 0 16px;
  }

  .card-header h2 {
    font-size: 2rem;
  }

  .file-specs {
    grid-template-columns: 1fr;
  }

  .secondary-actions {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .download-options {
    padding: 40px 0;
  }

  .card-header h2 {
    font-size: 1.75rem;
  }

  .version-display {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .btn-content {
    flex-direction: column;
    gap: 8px;
  }

  .btn-text-wrapper {
    align-items: center;
  }
}
</style>
