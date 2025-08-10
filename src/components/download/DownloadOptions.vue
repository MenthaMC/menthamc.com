<template>
    <section class="download-section">
        <div class="container">
            <!-- 标题区域 -->
            <div class="section-header">
                <h2 class="section-title">{{ $t('download.options.title') }}</h2>
                <p class="section-subtitle">{{ $t('download.options.description') }}</p>
            </div>

            <!-- 主要下载卡片 -->
            <div class="download-card">
                <!-- 版本信息 -->
                <div class="version-info">
                    <div class="version-badge">
                        <span class="badge-text">{{ $t('download.options.badges.latest') }}</span>
                        <div class="badge-dot"></div>
                    </div>
                    <h3 class="version-title">Mint {{ currentVersion }}</h3>
                    <p class="version-description">{{ $t('download.options.stableDescription') }}</p>
                </div>

                <!-- 文件详情 -->
                <div class="file-details">
                    <div class="detail-item">
                        <div class="detail-icon">📦</div>
                        <div class="detail-content">
                            <span class="detail-label">{{ $t('download.options.fileSpecs.fileSize') }}</span>
                            <span class="detail-value">{{ fileSize }}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">🔧</div>
                        <div class="detail-content">
                            <span class="detail-label">{{ $t('download.options.fileSpecs.buildNumber') }}</span>
                            <span class="detail-value">#{{ buildNumber }}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">📅</div>
                        <div class="detail-content">
                            <span class="detail-label">{{ $t('download.options.fileSpecs.releaseDate') }}</span>
                            <span class="detail-value">{{ releaseDate }}</span>
                        </div>
                    </div>
                </div>

                <!-- 下载按钮 -->
                <div class="download-actions">
                    <button class="download-btn primary" @click="downloadLatest">
                        <div class="btn-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7,10 12,15 17,10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </div>
                        <div class="btn-content">
                            <span class="btn-text">{{ $t('download.options.actions.download') }}</span>
                            <span class="btn-subtext">Mint {{ currentVersion }}</span>
                        </div>
                    </button>

                    <div class="secondary-actions">
                        <button class="action-btn" @click="viewChangelog">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14,2 14,8 20,8" />
                            </svg>
                            {{ $t('download.options.actions.changelog') }}
                        </button>
                        <button class="action-btn" @click="viewDocs">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                            {{ $t('download.options.actions.docs') }}
                        </button>
                        <button class="action-btn" @click="verifyFile">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 12l2 2 4-4" />
                                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                            </svg>
                            {{ $t('download.options.actions.verify') }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- 其他版本 -->
            <div class="other-versions">
                <h4 class="versions-title">{{ $t('download.options.otherVersions') }}</h4>
                <div class="versions-grid">
                    <div 
                        v-for="version in otherVersions" 
                        :key="version.id"
                        class="version-card"
                        :class="{ deprecated: version.status === 'deprecated' }"
                    >
                        <div class="version-header">
                            <span class="version-name">{{ version.name }}</span>
                            <span class="version-status" :class="version.status">
                                {{ getStatusText(version.status) }}
                            </span>
                        </div>
                        <div class="version-meta">
                            <span class="version-size">{{ version.size }}</span>
                            <span class="version-date">{{ version.date }}</span>
                        </div>
                        <button class="version-download-btn" @click="downloadVersion(version)">
                            {{ $t('download.options.actions.download') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GithubRelease } from '@/types'
import { renderSize } from '@/utils/helpers'
import { callApi } from '@zayne-labs/callapi'

const { t } = useI18n()

// 响应式数据
const currentVersion = ref('1.21.8')
const fileSize = ref('45.2MB')
const buildNumber = ref('95')
const releaseDate = ref('2024-01-15')

const otherVersions = ref([
    {
        id: 1,
        name: 'Mint 1.21.4',
        status: 'stable',
        size: '44.8MB',
        date: '2024-01-10'
    },
    {
        id: 2,
        name: 'Mint 1.21.3',
        status: 'legacy',
        size: '44.5MB',
        date: '2024-01-05'
    },
    {
        id: 3,
        name: 'Mint 1.21.2',
        status: 'deprecated',
        size: '44.2MB',
        date: '2023-12-28'
    }
])

// 防止重复请求的标志
let isLoading = false
let abortController: AbortController | null = null

// 获取最新版本信息
const fetchReleaseInfo = async () => {
    if (isLoading) {
        console.log('Request already in progress, skipping...')
        return
    }

    try {
        isLoading = true
        
        // 取消之前的请求
        if (abortController) {
            abortController.abort()
        }
        
        abortController = new AbortController()
        const timeoutId = setTimeout(() => {
            if (abortController) {
                abortController.abort()
            }
        }, 5000)

        const release = '/api/repos/MenthaMC/Mint/releases/latest'
        const response = await callApi<GithubRelease>(release, { 
            signal: abortController.signal 
        })

        clearTimeout(timeoutId)

        if (response.data) {
            currentVersion.value = response.data.tag_name.split('-')[0]
            buildNumber.value = response.data.tag_name.split('-')[1]
            fileSize.value = renderSize(response.data.assets[0]?.size as string)
            releaseDate.value = new Date(response.data.published_at).toLocaleDateString('zh-CN')
        }
    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
            console.warn('Failed to fetch release info:', error)
        }
    } finally {
        isLoading = false
        abortController = null
    }
}

onMounted(() => {
    fetchReleaseInfo()
})

// 组件卸载时取消请求
onUnmounted(() => {
    if (abortController) {
        abortController.abort()
        abortController = null
    }
    isLoading = false
})

// 方法
const downloadLatest = () => {
    const filename = `mint-${currentVersion.value}-${buildNumber.value}.jar`
    const downloadUrl = `https://github.com/MenthaMC/Mint/releases/download/v${currentVersion.value}/${filename}`
    
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

const downloadVersion = (version: any) => {
    console.log(t('download.options.downloadingVersion'), version.name)
}

const viewChangelog = () => {
    window.open(`https://github.com/MenthaMC/Mint/releases/tag/v${currentVersion.value}`, '_blank')
}

const viewDocs = () => {
    window.open('https://menthamc.github.io/docs/', '_blank')
}

const verifyFile = () => {
    alert(t('download.options.alerts.verifyInDevelopment'))
}

const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
        stable: t('download.options.badges.stable'),
        legacy: t('download.options.badges.legacy'),
        deprecated: t('download.options.badges.deprecated')
    }
    return statusMap[status] || status
}
</script>

<style scoped>
.download-section {
    padding: 80px 0;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%);
    backdrop-filter: blur(10px);
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 24px;
}

/* 标题区域 */
.section-header {
    text-align: center;
    margin-bottom: 48px;
    animation: headerFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(20px);
}

@keyframes headerFadeIn {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.section-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #ffffff 0%, #10b981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.section-subtitle {
    font-size: 1.1rem;
    color: #94a3b8;
    margin: 0;
}

/* 主下载卡片 */
.download-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 32px;
    backdrop-filter: blur(20px);
    margin-bottom: 48px;
    animation: cardSlideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.2s;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes cardSlideIn {
    0% {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.download-card:hover {
    border-color: rgba(16, 185, 129, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

/* 版本信息 */
.version-info {
    text-align: center;
    margin-bottom: 32px;
}

.version-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 20px;
    color: #10b981;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
}

.badge-dot {
    width: 6px;
    height: 6px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.2);
    }
}

.version-title {
    font-size: 2rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 8px 0;
}

.version-description {
    color: #94a3b8;
    margin: 0;
}

/* 文件详情 */
.file-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-item:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(16, 185, 129, 0.2);
    transform: translateY(-2px);
}

.detail-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.detail-label {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
}

.detail-value {
    font-size: 14px;
    color: #ffffff;
    font-weight: 600;
}

/* 下载按钮 */
.download-actions {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.download-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    width: 100%;
    padding: 20px 32px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border: none;
    border-radius: 16px;
    color: white;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4);
}

.download-btn:hover::before {
    left: 100%;
}

.download-btn:active {
    transform: translateY(-1px);
}

.btn-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
}

.btn-text {
    font-size: 16px;
    font-weight: 600;
}

.btn-subtext {
    font-size: 12px;
    opacity: 0.8;
}

/* 辅助操作 */
.secondary-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: #94a3b8;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(16, 185, 129, 0.3);
    color: #10b981;
    transform: translateY(-2px);
}

.action-btn svg {
    width: 16px;
    height: 16px;
}

/* 其他版本 */
.other-versions {
    animation: versionsSlideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.4s;
    opacity: 0;
    transform: translateY(30px);
}

@keyframes versionsSlideIn {
    0% {
        opacity: 0;
        transform: translateY(40px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.versions-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 24px;
    text-align: center;
}

.versions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
}

.version-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.version-card:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
}

.version-card.deprecated {
    opacity: 0.6;
}

.version-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.version-name {
    font-weight: 600;
    color: #ffffff;
}

.version-status {
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
}

.version-status.stable {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
}

.version-status.legacy {
    background: rgba(107, 114, 128, 0.2);
    color: #9ca3af;
}

.version-status.deprecated {
    background: rgba(239, 68, 68, 0.2);
    color: #f87171;
}

.version-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    font-size: 14px;
    color: #64748b;
}

.version-download-btn {
    width: 100%;
    padding: 8px 16px;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 8px;
    color: #10b981;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.version-download-btn:hover {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.5);
    transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .container {
        padding: 0 16px;
    }
    
    .download-card {
        padding: 24px;
    }
    
    .file-details {
        grid-template-columns: 1fr;
    }
    
    .secondary-actions {
        flex-direction: column;
    }
    
    .action-btn {
        justify-content: center;
    }
    
    .versions-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .section-title {
        font-size: 2rem;
    }
    
    .download-btn {
        flex-direction: column;
        gap: 8px;
    }
    
    .btn-content {
        align-items: center;
    }
}
</style>