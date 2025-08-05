<template>
  <section class="history-section">
    <div class="history-container">
      <div class="section-header">
        <h2>版本历史</h2>
        <p>浏览所有可用的构建版本和更新记录</p>
      </div>

      <div class="history-timeline">
        <div v-for="(build, index) in buildHistory" :key="build.id" class="timeline-item"
          :class="{ latest: index === 0 }">
          <div class="timeline-marker">
            <div class="marker-dot"></div>
            <div v-if="index !== buildHistory.length - 1" class="marker-line"></div>
          </div>

          <div class="timeline-content">
            <div class="build-header">
              <div class="build-info">
                <h3 class="build-title">构建 #{{ build.number }}</h3>
                <div class="build-meta">
                  <span class="build-date">{{ build.date }}</span>
                  <span class="build-author">by {{ build.author }}</span>
                </div>
              </div>
              <div class="build-status" :class="build.status">
                {{ getStatusText(build.status) }}
              </div>
            </div>

            <div class="build-description">
              <p>{{ build.description }}</p>
            </div>

            <div class="build-changes">
              <div class="change-stats">
                <span class="stat additions">+{{ build.additions }}</span>
                <span class="stat deletions">-{{ build.deletions }}</span>
                <span class="stat files">{{ build.files }} 文件</span>
              </div>
            </div>

            <div class="build-actions">
              <button class="action-btn primary" @click="downloadBuild(build)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                下载
              </button>
              <button class="action-btn secondary" @click="viewChangelog(build)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                </svg>
                更新日志
              </button>
              <button class="action-btn secondary" @click="viewCommit(build)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                {{ build.hash }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 构建历史数据
const buildHistory = ref([
  {
    id: 1,
    number: '95',
    date: '2024-01-15',
    author: 'DF-Plugin',
    description: '安全更新和性能优化，修复了多个关键漏洞，提升了服务器稳定性',
    hash: 'b04ebcb',
    status: 'stable',
    additions: 156,
    deletions: 43,
    files: 12
  },
  {
    id: 2,
    number: '82',
    date: '2024-01-10',
    author: 'DF-Plugin',
    description: '修复了 optimized-sun-burn 空指针异常问题 (#478)',
    hash: 'f553c53',
    status: 'stable',
    additions: 89,
    deletions: 21,
    files: 8
  },
  {
    id: 3,
    number: '76',
    date: '2024-01-05',
    author: 'DF-Plugin',
    description: '修复了 tickChunks 中的空指针异常，提升了区块处理性能',
    hash: '290b140',
    status: 'stable',
    additions: 67,
    deletions: 15,
    files: 5
  },
  {
    id: 4,
    number: '71',
    date: '2023-12-28',
    author: 'DF-Plugin',
    description: '更新到最新的 Paper 变更，同步上游修复',
    hash: 'a1b2c3d',
    status: 'legacy',
    additions: 234,
    deletions: 78,
    files: 18
  },
  {
    id: 5,
    number: '68',
    date: '2023-12-20',
    author: 'DF-Plugin',
    description: '优化区块加载性能，减少内存占用',
    hash: 'e4f5g6h',
    status: 'legacy',
    additions: 123,
    deletions: 56,
    files: 9
  }
])

// 方法
const getStatusText = (status: string) => {
  const statusMap = {
    stable: '稳定',
    beta: '测试',
    legacy: '旧版'
  }
  return statusMap[status as keyof typeof statusMap] || '未知'
}

const downloadBuild = (build: any) => {
  console.log(`下载构建 #${build.number}`)
}

const viewChangelog = (build: any) => {
  console.log(`查看构建 #${build.number} 的更新日志`)
}

const viewCommit = (build: any) => {
  console.log(`查看提交 ${build.hash}`)
}
</script>

<style scoped>
.history-section {
  padding: 80px 0;
  background: rgba(0, 0, 0, 0.2);
}

.history-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.section-header p {
  font-size: 1.1rem;
  color: #94a3b8;
}

.history-timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  gap: 24px;
  margin-bottom: 48px;
  position: relative;
}

.timeline-item.latest .timeline-content {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.marker-dot {
  width: 16px;
  height: 16px;
  background: #10b981;
  border-radius: 50%;
  border: 4px solid rgba(16, 185, 129, 0.2);
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
}

.marker-line {
  width: 2px;
  height: 48px;
  background: linear-gradient(to bottom, #10b981, rgba(16, 185, 129, 0.3));
  margin-top: 8px;
}

.timeline-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.timeline-content:hover {
  border-color: rgba(16, 185, 129, 0.3);
  transform: translateX(4px);
}

.build-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.build-info {
  flex: 1;
}

.build-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.build-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #64748b;
}

.build-date {
  color: #94a3b8;
}

.build-author {
  color: #64748b;
}

.build-status {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.build-status.stable {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.build-status.legacy {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
}

.build-description {
  margin-bottom: 16px;
}

.build-description p {
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.build-changes {
  margin-bottom: 20px;
}

.change-stats {
  display: flex;
  gap: 16px;
}

.stat {
  font-size: 14px;
  font-weight: 600;
}

.stat.additions {
  color: #10b981;
}

.stat.deletions {
  color: #ef4444;
}

.stat.files {
  color: #64748b;
}

.build-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: transparent;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #10b981;
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
}

.action-btn.secondary:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timeline-item {
    gap: 16px;
  }

  .build-actions {
    justify-content: center;
  }
}
</style>
