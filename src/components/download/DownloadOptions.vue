<template>
    <section class="download-section">
        <div class="container">
            <!-- 标题区域 -->
            <div class="section-header">
                <h2 class="section-title">{{ $t('download.options.title') }}</h2>
                <p class="section-subtitle">{{ $t('download.options.description') }}</p>
            </div>

            <!-- 版本选择下拉框 -->
            <div class="version-selector">
                <div class="selector-wrapper">
                    <label class="selector-label">选择版本</label>
                    <div class="dropdown-container">
                        <button 
                            class="dropdown-trigger" 
                            @click="toggleDropdown"
                            :class="{ active: isDropdownOpen }"
                        >
                            <div class="selected-version">
                                <div class="version-info">
                                    <span class="version-name">{{ selectedVersion.name }}</span>
                                    <span class="version-status" :class="selectedVersion.status">
                                        {{ getStatusText(selectedVersion.status) }}
                                    </span>
                                </div>
                                <div class="version-meta">
                                    <span class="version-size">{{ selectedVersion.size }}</span>
                                    <span class="version-date">{{ selectedVersion.date }}</span>
                                </div>
                            </div>
                            <div class="dropdown-icon" :class="{ rotated: isDropdownOpen }">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="6,9 12,15 18,9"></polyline>
                                </svg>
                            </div>
                        </button>
                        
                        <div class="dropdown-menu" :class="{ open: isDropdownOpen }">
                            <div 
                                v-for="version in allVersions" 
                                :key="version.id"
                                class="dropdown-item"
                                :class="{ 
                                    selected: selectedVersion.id === version.id,
                                    deprecated: version.status === 'deprecated'
                                }"
                                @click="selectVersion(version)"
                            >
                                <div class="item-content">
                                    <div class="item-header">
                                        <span class="item-name">{{ version.name }}</span>
                                        <span class="item-status" :class="version.status">
                                            {{ getStatusText(version.status) }}
                                        </span>
                                    </div>
                                    <div class="item-meta">
                                        <span class="item-size">{{ version.size }}</span>
                                        <span class="item-date">{{ version.date }}</span>
                                    </div>
                                </div>
                                <div class="item-check" v-if="selectedVersion.id === version.id">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20,6 9,17 4,12"></polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 选中版本的详细信息 -->
                <div class="selected-details">
                    <div class="detail-item">
                        <div class="detail-icon">📦</div>
                        <div class="detail-content">
                            <span class="detail-label">{{ $t('download.options.fileSpecs.fileSize') }}</span>
                            <span class="detail-value">{{ selectedVersion.size }}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">🔧</div>
                        <div class="detail-content">
                            <span class="detail-label">{{ $t('download.options.fileSpecs.buildNumber') }}</span>
                            <span class="detail-value">#{{ selectedVersion.buildNumber || buildNumber }}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">📅</div>
                        <div class="detail-content">
                            <span class="detail-label">{{ $t('download.options.fileSpecs.releaseDate') }}</span>
                            <span class="detail-value">{{ selectedVersion.date }}</span>
                        </div>
                    </div>
                </div>

                <!-- 下载按钮 -->
                <div class="download-actions">
                    <button class="download-btn primary" @click="downloadSelected">
                        <div class="btn-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7,10 12,15 17,10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </div>
                        <div class="btn-content">
                            <span class="btn-text">{{ $t('download.options.actions.download') }}</span>
                            <span class="btn-subtext">{{ selectedVersion.name }}</span>
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
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { mintProjectService } from '@/services/mint-project.service'

const { t } = useI18n()

// 响应式数据
const currentVersion = ref('1.21.8')
const fileSize = ref('45.2MB')
const buildNumber = ref('95')
const releaseDate = ref('2024-01-15')
const downloadUrl = ref('')
const isLoading = ref(false)
const isDropdownOpen = ref(false)

const allVersions = ref([
    {
        id: 1,
        name: 'Mint 1.21.8',
        status: 'latest',
        size: '45.2MB',
        date: '2024-01-15',
        downloadUrl: '',
        buildNumber: '95'
    },
    {
        id: 2,
        name: 'Mint 1.21.4',
        status: 'stable',
        size: '44.8MB',
        date: '2024-01-10',
        downloadUrl: '',
        buildNumber: '92'
    },
    {
        id: 3,
        name: 'Mint 1.21.3',
        status: 'legacy',
        size: '44.5MB',
        date: '2024-01-05',
        downloadUrl: '',
        buildNumber: '89'
    },
    {
        id: 4,
        name: 'Mint 1.21.2',
        status: 'deprecated',
        size: '44.2MB',
        date: '2023-12-28',
        downloadUrl: '',
        buildNumber: '86'
    }
])

const selectedVersion = ref(allVersions.value[0])

// 获取最新版本信息
const fetchReleaseInfo = async () => {
    if (isLoading.value) {
        return
    }

    try {
        isLoading.value = true
        
        const latestRelease = await mintProjectService.getLatestRelease()
        
        if (latestRelease) {
            currentVersion.value = latestRelease.version
            buildNumber.value = latestRelease.buildNumber
            fileSize.value = latestRelease.fileSize
            releaseDate.value = latestRelease.releaseDate
            downloadUrl.value = latestRelease.downloadUrl
        }

        // 获取所有版本
        const allReleases = await mintProjectService.getAllReleases(10)
        if (allReleases.length > 0) {
            const versions = allReleases.map((release, index) => ({
                id: index + 1,
                name: `Mint ${release.version}`,
                status: index === 0 ? 'latest' : index === 1 ? 'stable' : index === 2 ? 'legacy' : 'deprecated',
                size: release.fileSize,
                date: release.releaseDate,
                downloadUrl: release.downloadUrl,
                version: release.version,
                buildNumber: release.buildNumber
            }))
            
            allVersions.value = versions
            selectedVersion.value = versions[0]
        }
        
    } catch (error) {
        console.error('获取版本信息失败:', error)
    } finally {
        isLoading.value = false
    }
}

// 方法
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
}

const selectVersion = (version: any) => {
    selectedVersion.value = version
    isDropdownOpen.value = false
}

const downloadSelected = () => {
    if (selectedVersion.value.downloadUrl) {
        const link = document.createElement('a')
        link.href = selectedVersion.value.downloadUrl
        link.download = `mint-${selectedVersion.value.version || selectedVersion.value.name.split(' ')[1]}.jar`
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } else {
        // 备用下载方式
        const version = selectedVersion.value.version || selectedVersion.value.name.split(' ')[1]
        const filename = `mint-${version}.jar`
        const fallbackUrl = `https://github.com/MenthaMC/Mint/releases/download/v${version}/${filename}`
        
        const link = document.createElement('a')
        link.href = fallbackUrl
        link.download = filename
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

const viewChangelog = () => {
    const version = selectedVersion.value.version || selectedVersion.value.name.split(' ')[1]
    window.open(`https://github.com/MenthaMC/Mint/releases/tag/v${version}`, '_blank')
}

const viewDocs = () => {
    window.open('https://menthamc.github.io/docs/', '_blank')
}

const verifyFile = () => {
    alert(t('download.options.alerts.verifyInDevelopment'))
}

const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
        latest: t('download.options.badges.latest'),
        stable: t('download.options.badges.stable'),
        legacy: t('download.options.badges.legacy'),
        deprecated: t('download.options.badges.deprecated')
    }
    return statusMap[status] || status
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.dropdown-container')) {
        isDropdownOpen.value = false
    }
}

onMounted(() => {
    fetchReleaseInfo()
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
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

/* 版本选择器 */
.version-selector {
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

.version-selector:hover {
    border-color: rgba(16, 185, 129, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

/* 选择器标签 */
.selector-label {
    display: block;
    font-size: 1.2rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 16px;
    text-align: center;
}

/* 下拉容器 */
.dropdown-container {
    position: relative;
    margin-bottom: 32px;
}

.dropdown-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    color: #ffffff;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-trigger:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(16, 185, 129, 0.3);
}

.dropdown-trigger.active {
    border-color: rgba(16, 185, 129, 0.5);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.selected-version {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
}

.version-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.version-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #ffffff;
}

.version-status {
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
}

.version-status.latest {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
}

.version-status.stable {
    background: rgba(59, 130, 246, 0.2);
    color: #60a5fa;
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
    gap: 16px;
    font-size: 14px;
    color: #94a3b8;
}

.dropdown-icon {
    width: 24px;
    height: 24px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-icon.rotated {
    transform: rotate(180deg);
}

.dropdown-icon svg {
    width: 100%;
    height: 100%;
}

/* 下拉菜单 */
.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(30, 41, 59, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    z-index: 1000;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: 8px;
}

.dropdown-menu.open {
    max-height: 400px;
    opacity: 1;
    transform: translateY(0);
}

.dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.dropdown-item:last-child {
    border-bottom: none;
}

.dropdown-item:hover {
    background: rgba(255, 255, 255, 0.08);
}

.dropdown-item.selected {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.2);
}

.dropdown-item.deprecated {
    opacity: 0.6;
}

.item-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.item-header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.item-name {
    font-weight: 600;
    color: #ffffff;
}

.item-status {
    padding: 3px 6px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
}

.item-status.latest {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
}

.item-status.stable {
    background: rgba(59, 130, 246, 0.2);
    color: #60a5fa;
}

.item-status.legacy {
    background: rgba(107, 114, 128, 0.2);
    color: #9ca3af;
}

.item-status.deprecated {
    background: rgba(239, 68, 68, 0.2);
    color: #f87171;
}

.item-meta {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: #94a3b8;
}

.item-check {
    width: 20px;
    height: 20px;
    color: #10b981;
}

.item-check svg {
    width: 100%;
    height: 100%;
}

/* 选中版本详情 */
.selected-details {
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

/* 响应式设计 */
@media (max-width: 768px) {
    .container {
        padding: 0 16px;
    }
    
    .version-selector {
        padding: 24px;
    }
    
    .selected-details {
        grid-template-columns: 1fr;
    }
    
    .secondary-actions {
        flex-direction: column;
    }
    
    .action-btn {
        justify-content: center;
    }
    
    .dropdown-trigger {
        padding: 16px 20px;
    }
    
    .version-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .version-meta {
        flex-direction: column;
        gap: 8px;
    }
    
    .dropdown-menu {
        max-height: 300px;
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
    
    .dropdown-trigger {
        padding: 14px 16px;
    }
    
    .selected-version {
        gap: 6px;
    }
    
    .version-name {
        font-size: 1rem;
    }
    
    .dropdown-item {
        padding: 12px 16px;
    }
}
</style>