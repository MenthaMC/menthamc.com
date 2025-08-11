<template>
    <section class="build-history-section">
        <div class="container">
            <!-- 标题区域 -->
            <div class="section-header">
                <h3 class="section-title">{{ $t('download.buildHistory.title') || '构建历史' }}</h3>
                <p class="section-subtitle">{{ $t('download.buildHistory.description') || '查看Mint的版本发布历史和更新记录' }}</p>
            </div>

            <!-- 加载状态 -->
            <div v-if="isLoading" class="loading-container">
                <div class="loading-spinner"></div>
                <span class="loading-text">{{ $t('download.buildHistory.loading') || '加载中...' }}</span>
            </div>

            <!-- 构建历史列表 -->
            <div v-else class="history-timeline">
                <div 
                    v-for="(release, index) in releases" 
                    :key="release.version"
                    class="timeline-item"
                    :class="{ 'latest': index === 0 }"
                >
                    <!-- 时间线节点 -->
                    <div class="timeline-node">
                        <div class="node-dot"></div>
                        <div class="node-line" v-if="index < releases.length - 1"></div>
                    </div>

                    <!-- 版本信息卡片 -->
                    <div class="version-card">
                        <div class="card-header">
                            <div class="version-info">
                                <h4 class="version-name">Mint {{ release.version }}</h4>
                                <div class="version-badges">
                                    <span v-if="index === 0" class="badge latest-badge">
                                        {{ $t('download.buildHistory.badges.latest') || '最新版本' }}
                                    </span>
                                    <span class="badge build-badge">
                                        Build #{{ release.buildNumber }}
                                    </span>
                                </div>
                            </div>
                            <div class="release-date">
                                {{ release.releaseDate }}
                            </div>
                        </div>

                        <div class="card-content">
                            <!-- 提交信息区域 -->
                            <div v-if="release.commitInfo" class="commit-info">
                                <div class="commit-header">
                                    <div class="commit-avatar">
                                        <img 
                                            v-if="release.commitInfo.author.avatar_url" 
                                            :src="release.commitInfo.author.avatar_url" 
                                            :alt="release.commitInfo.author.name"
                                            class="avatar-img"
                                        >
                                        <div v-else class="avatar-placeholder">
                                            {{ release.commitInfo.author.name.charAt(0).toUpperCase() }}
                                        </div>
                                    </div>
                                    <div class="commit-details">
                                        <div class="commit-author">
                                            <span class="author-name">{{ release.commitInfo.author.name }}</span>
                                            <span class="commit-sha">#{{ release.commitInfo.sha }}</span>
                                        </div>
                                        <div class="commit-time">
                                            {{ formatCommitDate(release.commitInfo.committer.date) }}
                                        </div>
                                    </div>
                                </div>
                                <div class="commit-message">
                                    <p class="message-text">{{ release.commitInfo.shortMessage }}</p>
                                    <a 
                                        v-if="release.commitInfo.html_url" 
                                        :href="release.commitInfo.html_url" 
                                        target="_blank" 
                                        class="commit-link"
                                    >
                                        查看完整提交
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15,3 21,3 21,9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div class="release-stats">
                                <div class="stat-item">
                                    <div class="stat-icon">📦</div>
                                    <div class="stat-info">
                                        <span class="stat-label">{{ $t('download.buildHistory.fileSize') || '文件大小' }}</span>
                                        <span class="stat-value">{{ release.fileSize }}</span>
                                    </div>
                                </div>
                                <div class="stat-item" v-if="release.assets.length > 0">
                                    <div class="stat-icon">⬇️</div>
                                    <div class="stat-info">
                                        <span class="stat-label">{{ $t('download.buildHistory.downloads') || '下载次数' }}</span>
                                        <span class="stat-value">{{ getTotalDownloads(release) }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="card-actions">
                                <button 
                                    class="action-btn download-btn"
                                    @click="downloadRelease(release)"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7,10 12,15 17,10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    {{ $t('download.buildHistory.actions.download') || '下载' }}
                                </button>
                                <button 
                                    class="action-btn changelog-btn"
                                    @click="viewChangelog(release)"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14,2 14,8 20,8" />
                                    </svg>
                                    {{ $t('download.buildHistory.actions.changelog') || '更新日志' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 加载更多按钮 -->
            <div v-if="!isLoading && releases.length > 0" class="load-more-container">
                <button 
                    class="load-more-btn"
                    @click="loadMoreReleases"
                    :disabled="isLoadingMore"
                >
                    <span v-if="!isLoadingMore">
                        {{ $t('download.buildHistory.loadMore') || '加载更多版本' }}
                    </span>
                    <span v-else>
                        {{ $t('download.buildHistory.loading') || '加载中...' }}
                    </span>
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { mintProjectService } from '@/services/mint-project.service'
import type { MintReleaseInfo } from '@/services/mint-project.service'

const { t } = useI18n()

// 使用t函数避免未使用警告
console.log('Build history loaded with translations:', t('download.buildHistory.title'))

// 响应式数据
const releases = ref<MintReleaseInfo[]>([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const currentLimit = ref(5)

// 获取版本历史
const fetchReleases = async (limit: number = 5) => {
    try {
        console.log('开始获取版本历史，限制数量:', limit)
        const releaseList = await mintProjectService.getAllReleases(limit)
        console.log('获取到的版本数据:', releaseList)
        releases.value = releaseList
        
        if (releaseList.length === 0) {
            console.warn('没有获取到任何版本数据')
        }
    } catch (error) {
        console.error('获取版本历史失败:', error)
        // 设置一些测试数据以便调试
        releases.value = []
    }
}

// 加载更多版本
const loadMoreReleases = async () => {
    if (isLoadingMore.value) return
    
    try {
        isLoadingMore.value = true
        currentLimit.value += 5
        await fetchReleases(currentLimit.value)
    } catch (error) {
        console.error('加载更多版本失败:', error)
    } finally {
        isLoadingMore.value = false
    }
}

// 下载版本
const downloadRelease = (release: MintReleaseInfo) => {
    if (release.downloadUrl) {
        const link = document.createElement('a')
        link.href = release.downloadUrl
        link.download = `mint-${release.version}-${release.buildNumber}.jar`
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

// 查看更新日志
const viewChangelog = (release: MintReleaseInfo) => {
    if (release.changelogUrl) {
        window.open(release.changelogUrl, '_blank')
    }
}

// 获取总下载次数
const getTotalDownloads = (release: MintReleaseInfo): string => {
    const total = release.assets.reduce((sum, asset) => sum + asset.downloadCount, 0)
    return total.toLocaleString()
}

// 格式化提交日期
const formatCommitDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
        return '刚刚'
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `${minutes}分钟前`
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `${hours}小时前`
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400)
        return `${days}天前`
    } else {
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }
}

onMounted(async () => {
    try {
        await fetchReleases(currentLimit.value)
    } finally {
        isLoading.value = false
    }
})
</script>

<style scoped>
.build-history-section {
    padding: 60px 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(10px);
}

.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px;
}

/* 标题区域 */
.section-header {
    text-align: center;
    margin-bottom: 48px;
}

.section-title {
    font-size: 2rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #ffffff 0%, #64748b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.section-subtitle {
    font-size: 1rem;
    color: #94a3b8;
    margin: 0;
}

/* 加载状态 */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 60px 0;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(16, 185, 129, 0.2);
    border-top: 3px solid #10b981;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    color: #94a3b8;
    font-size: 14px;
}

/* 时间线 */
.history-timeline {
    position: relative;
}

.timeline-item {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
    position: relative;
}

.timeline-item.latest .version-card {
    border-color: rgba(16, 185, 129, 0.3);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
}

/* 时间线节点 */
.timeline-node {
    position: relative;
    flex-shrink: 0;
    width: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.node-dot {
    width: 12px;
    height: 12px;
    background: #10b981;
    border-radius: 50%;
    border: 3px solid rgba(15, 23, 42, 1);
    z-index: 2;
    position: relative;
}

.timeline-item.latest .node-dot {
    background: #10b981;
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
    animation: pulse 2s infinite;
}

.node-line {
    width: 2px;
    flex: 1;
    background: linear-gradient(to bottom, #334155, transparent);
    margin-top: 8px;
}

/* 版本卡片 */
.version-card {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 24px;
    backdrop-filter: blur(20px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.version-card:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
}

.version-info {
    flex: 1;
}

.version-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 8px 0;
}

.version-badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.latest-badge {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
}

.build-badge {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
}

.release-date {
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
}

/* 卡片内容 */
.card-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 提交信息样式 */
.commit-info {
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    margin-bottom: 4px;
}

.commit-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.commit-avatar {
    flex-shrink: 0;
}

.avatar-img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.1);
}

.avatar-placeholder {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #10b981, #059669);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    border: 2px solid rgba(255, 255, 255, 0.1);
}

.commit-details {
    flex: 1;
    min-width: 0;
}

.commit-author {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
}

.author-name {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
}

.commit-sha {
    font-size: 12px;
    color: #64748b;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    background: rgba(255, 255, 255, 0.05);
    padding: 2px 6px;
    border-radius: 4px;
}

.commit-time {
    font-size: 12px;
    color: #94a3b8;
}

.commit-message {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.message-text {
    font-size: 14px;
    color: #e2e8f0;
    line-height: 1.5;
    margin: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.commit-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #3b82f6;
    text-decoration: none;
    transition: all 0.2s ease;
    align-self: flex-start;
}

.commit-link:hover {
    color: #60a5fa;
    text-decoration: underline;
}

.commit-link svg {
    width: 12px;
    height: 12px;
}

.release-stats {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.stat-icon {
    font-size: 16px;
}

.stat-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.stat-label {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
}

.stat-value {
    font-size: 14px;
    color: #ffffff;
    font-weight: 600;
}

/* 操作按钮 */
.card-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid;
}

.action-btn svg {
    width: 16px;
    height: 16px;
}

.download-btn {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.3);
    color: #10b981;
}

.download-btn:hover {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.5);
    transform: translateY(-1px);
}

.changelog-btn {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.3);
    color: #3b82f6;
}

.changelog-btn:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
    transform: translateY(-1px);
}

/* 加载更多 */
.load-more-container {
    text-align: center;
    margin-top: 40px;
}

.load-more-btn {
    padding: 12px 24px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #94a3b8;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.load-more-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    transform: translateY(-2px);
}

.load-more-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .container {
        padding: 0 16px;
    }
    
    .timeline-item {
        gap: 16px;
    }
    
    .version-card {
        padding: 20px;
    }
    
    .card-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }
    
    .commit-info {
        padding: 12px;
    }
    
    .commit-header {
        gap: 10px;
    }
    
    .commit-author {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
    
    .message-text {
        font-size: 13px;
    }
    
    .release-stats {
        flex-direction: column;
        gap: 16px;
    }
    
    .card-actions {
        flex-direction: column;
    }
    
    .action-btn {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .section-title {
        font-size: 1.5rem;
    }
    
    .timeline-item {
        gap: 12px;
    }
    
    .version-card {
        padding: 16px;
    }
    
    .version-name {
        font-size: 1.1rem;
    }
    
    .commit-info {
        padding: 10px;
    }
    
    .avatar-img,
    .avatar-placeholder {
        width: 28px;
        height: 28px;
    }
    
    .avatar-placeholder {
        font-size: 12px;
    }
    
    .author-name {
        font-size: 13px;
    }
    
    .commit-sha {
        font-size: 11px;
    }
    
    .message-text {
        font-size: 12px;
        line-height: 1.4;
    }
    
    .commit-link {
        font-size: 11px;
    }
}
</style>