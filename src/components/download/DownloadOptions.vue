<template>
    <section class="download-section" data-enter-animation="fadeInUp" data-scroll-animate>
        <div class="container">
            <!-- 标题区域 -->
            <div class="section-header" data-enter-animation="fadeInUp" data-scroll-animate>
                <h2 class="section-title text-reveal">{{ $t('download.options.title') }}</h2>
                <p class="section-subtitle" data-enter-animation="fadeInUp">{{ $t('download.options.description') }}</p>
            </div>

            <!-- 分支选择下拉框 -->
            <div class="version-selector animated-card interactive-hover" data-enter-animation="zoomIn" data-scroll-animate data-hover-animate>
                <div class="selector-wrapper">
                    <label class="selector-label">{{ $t('download.options.selectVersion') }}</label>
                    <div class="dropdown-container">
                        <button 
                            class="dropdown-trigger" 
                            @click="toggleDropdown"
                            :class="{ active: isDropdownOpen }"
                        >
                            <div class="selected-version">
                                <div class="version-info">
                                    <span class="version-name">{{ selectedBranch.name }}</span>
                                </div>
                                <div class="version-meta">
                                    <span class="version-size">{{ $t('download.options.latestCommit') }}: {{ selectedBranch.commit }}</span>
                                    <span class="version-date">{{ formatDate(selectedBranch.commitDate) }}</span>
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
                                v-for="branch in allBranches" 
                                :key="branch.id"
                                class="dropdown-item"
                                :class="{ 
                                    selected: selectedBranch.id === branch.id,
                                    deprecated: branch.status === 'deprecated'
                                }"
                                @click="selectBranch(branch)"
                            >
                                <div class="item-content">
                                    <div class="item-header">
                                        <span class="item-name">{{ branch.name }}</span>
                                    </div>
                                    <div class="item-meta">
                                        <span class="item-size">{{ $t('download.options.latestCommit') }}: {{ branch.commit }}</span>
                                        <span class="item-date">{{ formatDate(branch.commitDate) }}</span>
                                    </div>
                                </div>
                                <div class="item-check" v-if="selectedBranch.id === branch.id">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20,6 9,17 4,12"></polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 选中分支的详细信息 -->
                <div class="selected-details">
                    <div class="detail-item">
                        <div class="detail-icon">🚀</div>
                        <div class="detail-content">
                            <span class="detail-label">{{ $t('download.options.versionType') }}</span>
                            <span class="detail-value">{{ selectedBranch.versionType || $t('download.options.loading') }}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">🔧</div>
                        <div class="detail-content">
                            <span class="detail-label">{{ $t('download.options.commitHash') }}</span>
                            <span class="detail-value">{{ selectedBranch.commit || $t('download.options.loading') }}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">📅</div>
                        <div class="detail-content">
                            <span class="detail-label">{{ $t('download.options.releaseDate') }}</span>
                            <span class="detail-value">{{ formatDate(selectedBranch.commitDate) || $t('download.options.loading') }}</span>
                        </div>
                    </div>
                </div>

                <!-- 下载按钮 -->
                <div class="download-actions stagger-animation" data-enter-animation="slideInUp" data-scroll-animate>
                    <button class="download-btn primary animated-button interactive-hover" @click="downloadSelected" data-hover-animate data-click-animate>
                        <div class="btn-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7,10 12,15 17,10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </div>
                        <div class="btn-content">
                            <span class="btn-text">{{ $t('download.options.downloadNow') }}</span>
                        </div>
                    </button>

                    <div class="secondary-actions stagger-animation">
                        <button class="action-btn interactive-hover" @click="viewChangelog" data-hover-animate data-click-animate>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14,2 14,8 20,8" />
                            </svg>
                            {{ $t('download.options.actions.changelog') }}
                        </button>
                        <button class="action-btn interactive-hover" @click="viewDocs" data-hover-animate data-click-animate>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                            {{ $t('download.options.actions.docs') }}
                        </button>
                        <button class="action-btn interactive-hover" @click="verifyFile" data-hover-animate data-click-animate>
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/main'
import type { MintReleaseInfo } from '@/services/mint-project.service'
import { cacheFirstRequest } from '@/services/cache-first-request.service'
import { globalCache } from '@/services/cache.service'
import { logger } from '@/utils/logger'

const { t } = useI18n()

// 定义props接收最新构建信息
interface Props {
  latestBuild?: MintReleaseInfo
}

const props = defineProps<Props>()

// 定义emit事件
// const emit = defineEmits<{
//   latestBuildReady: [build: MintReleaseInfo]
// }>() // 暂时不需要

// GitHub API 服务实例
// const githubApi = new GitHubApiService() // 暂时不需要

// 带缓存、超时和回退的API调用函数
const fetchWithFallback = async (url: string, timeout: number = 10000): Promise<Response> => {
    const cacheKey = `api:${url}`
    
    try {
        const cachedResponse = await cacheFirstRequest.request<any>(cacheKey, {
            url,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'MenthaMC-Website'
            },
            cacheTtl: 5 * 60 * 1000,
            skipCache: false
        })
        
        if (cachedResponse.data && !cachedResponse.error) {
            logger.debug('缓存命中:', url)
            return new Response(JSON.stringify(cachedResponse.data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)
        
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'MenthaMC-Website'
                }
            })
            
            clearTimeout(timeoutId)
            
            if (response.ok) {
                logger.debug('代理API调用成功:', url)
                const responseData = await response.json()
                globalCache.set(cacheKey, responseData, 5 * 60 * 1000)
                
                return new Response(JSON.stringify(responseData), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            throw new Error(`代理API响应失败: ${response.status}`)
            
        } catch (error) {
            clearTimeout(timeoutId)
            logger.warn('代理API失败，尝试使用GitHub API回退:', error)
            
            const githubPath = url.replace(`${api}/`, '')
            const directUrl = `https://api.github.com/${githubPath}`
            
            try {
                const fallbackController = new AbortController()
                const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), timeout)
                
                const fallbackResponse = await fetch(directUrl, {
                    signal: fallbackController.signal,
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'MenthaMC-Website'
                    }
                })
                
                clearTimeout(fallbackTimeoutId)
                
                if (fallbackResponse.ok) {
                    logger.debug('GitHub API回退成功:', directUrl)
                    const responseData = await fallbackResponse.json()
                    globalCache.set(cacheKey, responseData, 5 * 60 * 1000)
                    
                    return new Response(JSON.stringify(responseData), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    })
                }
                
                throw new Error(`GitHub API也失败了: ${fallbackResponse.status}`)
                
            } catch (fallbackError) {
                logger.error('GitHub API回退也失败:', fallbackError)
                logger.warn('所有API都失败，使用模拟数据')
                
                return new Response(JSON.stringify({
                    default_branch: 'main',
                    message: 'API调用失败，使用默认数据'
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
        }
    } catch (error) {
        logger.error('缓存请求失败:', error)
        
        return new Response(JSON.stringify({
            default_branch: 'main',
            message: 'API调用失败，使用默认数据'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

// 增强的分支信息获取函数
const fetchBranchesWithFallback = async (): Promise<any[]> => {
    try {
        const branchesResponse = await fetchWithFallback(`${api}/repos/MenthaMC/Mint/branches?per_page=50`)
        const branches = await branchesResponse.json()
        
        if (Array.isArray(branches) && branches.length > 0) {
            return branches
        }
        
        throw new Error('分支列表为空')
        
    } catch (error) {
        logger.warn('获取分支列表失败，使用默认分支:', error)
        
        return [{
            name: 'main',
            commit: {
                sha: 'unknown'
            },
            protected: true
        }]
    }
}

// 增强的仓库信息获取函数
const fetchRepositoryWithFallback = async (): Promise<any> => {
    try {
        const repoResponse = await fetchWithFallback(`${api}/repos/MenthaMC/Mint`)
        const repoData = await repoResponse.json()
        
        if (repoData && repoData.default_branch) {
            return repoData
        }
        
        throw new Error('仓库信息无效')
        
    } catch (error) {
        logger.warn('获取仓库信息失败，使用默认值:', error)
        
        return {
            default_branch: 'main',
            name: 'Mint',
            full_name: 'MenthaMC/Mint'
        }
    }
}

// 响应式数据
const currentBranch = ref('main')
const isLoading = ref(false)
const isDropdownOpen = ref(false)

interface BranchInfo {
    id: number;
    name: string;
    status: string;
    commit: string;
    protected: boolean;
    fullCommit?: string;
    commitDate?: string;
    commitMessage?: string;
    fileSize?: string;
    fileSizeBytes?: number;
    versionType?: string;
}

const allBranches = ref<BranchInfo[]>([
    {
        id: 1,
        name: 'main',
        status: 'default',
        commit: '',
        protected: true
    },
])

const selectedBranch = ref<BranchInfo>(allBranches.value[0])

// 获取分支信息
const fetchBranchInfo = async () => {
    if (isLoading.value) {
        return
    }

    try {
        isLoading.value = true
        
        const repoInfo = await fetchRepositoryWithFallback()
        const defaultBranch: string = repoInfo.default_branch || 'main'
        logger.debug('默认分支:', defaultBranch)
        
        const branches = await fetchBranchesWithFallback()
        logger.debug('获取到分支数量:', branches.length)
        
        if (branches.length > 0) {
            const branchesWithTime = await Promise.all(
                branches.map(async (branch: any, index: number): Promise<BranchInfo> => {
                    try {
                        const commitResponse = await fetchWithFallback(`${api}/repos/MenthaMC/Mint/commits/${branch.commit.sha}`)
                        const commitData = await commitResponse.json()
                        
                        let fileSize = '计算中...'
                        let fileSizeBytes = 0
                        let releaseDate = commitData.commit?.committer?.date || commitData.commit?.author?.date || new Date().toISOString()

                        let versionType = ''
                        try {
                            const releaseResponse = await fetchWithFallback(`${api}/repos/MenthaMC/Mint/releases`)
                            const releases = await releaseResponse.json()
                            const hasRelease = releases.some((release: any) => 
                                release.target_commitish === branch.name || 
                                release.tag_name.includes(branch.name)
                            )
                            
                            if (hasRelease) {
                                const prerelease = releases.find((release: any) => 
                                    (release.target_commitish === branch.name || release.tag_name.includes(branch.name)) &&
                                    release.prerelease
                                )
                                
                                if (prerelease) {
                                    versionType = '预发布版'
                                } else {
                                    versionType = branch.name === defaultBranch ? '最新版本' : '发布版'
                                }
                            } else if (branch.name === defaultBranch) {
                                versionType = '最新版本'
                            } else if (branch.name.includes('dev') || branch.name.includes('develop')) {
                                versionType = '预发布版'
                            } else if (branch.name.includes('beta') || branch.name.includes('alpha')) {
                                versionType = '预发布版'
                            }
                        } catch (error) {
                            logger.warn(`获取分支 ${branch.name} 的版本类型失败:`, error)
                            if (branch.name === defaultBranch) {
                                versionType = '最新发布版'
                            } else if (branch.name.includes('dev') || branch.name.includes('develop') || 
                                      branch.name.includes('beta') || branch.name.includes('alpha')) {
                                versionType = '预发布版'
                            }
                        }

                        return {
                            id: index + 1,
                            name: branch.name,
                            status: branch.name === defaultBranch ? 'default' : 
                                   branch.name === 'dev' || branch.name === 'develop' ? 'development' : 
                                   branch.name.includes('release') ? 'release' : 'feature',
                            commit: branch.commit.sha.substring(0, 7),
                            protected: branch.protected,
                            fullCommit: branch.commit.sha,
                            commitDate: releaseDate,
                            commitMessage: commitData.commit?.message?.split('\n')[0] || '',
                            fileSize: fileSize,
                            fileSizeBytes: fileSizeBytes,
                            versionType: versionType
                        }
                    } catch (error) {
                        logger.warn(`获取分支 ${branch.name} 的提交信息失败:`, error)
                        return {
                            id: index + 1,
                            name: branch.name,
                            status: branch.name === defaultBranch ? 'default' : 
                                   branch.name === 'dev' || branch.name === 'develop' ? 'development' : 
                                   branch.name.includes('release') ? 'release' : 'feature',
                            commit: branch.commit.sha.substring(0, 7),
                            protected: branch.protected,
                            fullCommit: branch.commit.sha,
                            commitDate: new Date().toISOString(),
                            commitMessage: '',
                            fileSize: '大小未知',
                            fileSizeBytes: 0
                        }
                    }
                })
            )
            
            const sortedBranches = branchesWithTime.sort((a, b) => {
                if (a.name === defaultBranch) return -1
                if (b.name === defaultBranch) return 1
                
                const aDate = a.commitDate ? new Date(a.commitDate).getTime() : 0
                const bDate = b.commitDate ? new Date(b.commitDate).getTime() : 0
                return bDate - aDate
            })
            
            allBranches.value = sortedBranches
            selectedBranch.value = sortedBranches[0]
            
            if (sortedBranches[0]) {
                currentBranch.value = sortedBranches[0].name
            }
        }
        
    } catch (error) {
        logger.error('获取分支信息失败:', error)
        const defaultBranchInfo: BranchInfo = {
            id: 1,
            name: 'main',
            status: 'default',
            commit: 'unknown',
            protected: true,
            fullCommit: '',
            commitDate: new Date().toISOString(),
            commitMessage: '',
            fileSize: '大小未知',
            fileSizeBytes: 0,
        }
        allBranches.value = [defaultBranchInfo]
        selectedBranch.value = defaultBranchInfo
    } finally {
        isLoading.value = false
    }
}

// 方法
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
}

const selectBranch = (branch: BranchInfo) => {
    selectedBranch.value = branch
    isDropdownOpen.value = false
}

// 最新构建信息
const latestBuildInfo = ref<MintReleaseInfo | null>(null)

// 监听props中的latestBuild变化
watch(() => props.latestBuild, (newBuild) => {
    if (newBuild) {
        logger.debug('接收到最新构建信息:', newBuild)
        latestBuildInfo.value = newBuild
    }
})

const downloadSelected = async () => {
    try {
        const branchName = selectedBranch.value?.name || 'main'
        logger.debug('开始下载选中分支:', branchName)
        
        if (latestBuildInfo.value && latestBuildInfo.value.version.includes(branchName)) {
            if (latestBuildInfo.value.downloadUrl) {
                logger.debug('使用最新构建信息下载:', latestBuildInfo.value.downloadUrl)
                const link = document.createElement('a')
                link.href = latestBuildInfo.value.downloadUrl
                link.download = `mint-${latestBuildInfo.value.version}.jar`
                link.target = '_blank'
                link.style.display = 'none'
                
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                
                alert(`开始下载 Mint ${latestBuildInfo.value.version}`)
                return
            }
        }
        
        if (branchName === 'main' || branchName === 'master') {
            try {
                logger.debug('获取主分支最新Release...')
                const releasesResponse = await fetchWithFallback(`${api}/repos/MenthaMC/Mint/releases/latest`)
                const releaseData = await releasesResponse.json()
                
                logger.debug('获取到Release数据:', releaseData)
                
                const jarAsset = releaseData.assets?.find((asset: any) => 
                    asset.name.toLowerCase().endsWith('.jar') && 
                    !asset.name.toLowerCase().includes('sources') && 
                    !asset.name.toLowerCase().includes('javadoc')
                )
                
                if (jarAsset) {
                    logger.debug('找到JAR文件:', jarAsset.name)
                    const link = document.createElement('a')
                    link.href = jarAsset.browser_download_url
                    link.download = jarAsset.name
                    link.target = '_blank'
                    link.style.display = 'none'
                    
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    
                    alert(`开始下载 ${jarAsset.name}`)
                    return
                } else {
                    logger.warn('主分支Release中未找到JAR文件')
                }
            } catch (releaseError) {
                logger.warn('无法获取主分支Release信息:', releaseError)
            }
        } else {
            try {
                logger.debug(`查找分支 ${branchName} 的Release...`)
                const releasesResponse = await fetchWithFallback(`${api}/repos/MenthaMC/Mint/releases?per_page=50`)
                const releases = await releasesResponse.json()
                
                const branchRelease = releases.find((release: any) => 
                    release.target_commitish === branchName || 
                    release.tag_name.includes(branchName) ||
                    release.name?.includes(branchName)
                )
                
                if (branchRelease) {
                    logger.debug(`找到分支 ${branchName} 的Release:`, branchRelease.tag_name)
                    
                    const jarAsset = branchRelease.assets?.find((asset: any) => 
                        asset.name.toLowerCase().endsWith('.jar') && 
                        !asset.name.toLowerCase().includes('sources') && 
                        !asset.name.toLowerCase().includes('javadoc')
                    )
                    
                    if (jarAsset) {
                        logger.debug('找到分支JAR文件:', jarAsset.name)
                        const link = document.createElement('a')
                        link.href = jarAsset.browser_download_url
                        link.download = jarAsset.name
                        link.target = '_blank'
                        link.style.display = 'none'
                        
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        
                        alert(`开始下载 ${jarAsset.name}`)
                        return
                    } else {
                        logger.warn(`分支 ${branchName} 的Release中未找到JAR文件，下载源码包`)
                        const link = document.createElement('a')
                        link.href = branchRelease.zipball_url
                        link.download = `mint-${branchRelease.tag_name}-source.zip`
                        link.target = '_blank'
                        link.style.display = 'none'
                        
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        
                        alert(`分支 ${branchName} 暂无编译好的JAR文件，已下载源码包`)
                        return
                    }
                } else {
                    logger.debug(`分支 ${branchName} 没有对应的Release，下载最新提交的源码`)
                    const link = document.createElement('a')
                    link.href = `https://github.com/MenthaMC/Mint/archive/refs/heads/${branchName}.zip`
                    link.download = `mint-${branchName}-latest.zip`
                    link.target = '_blank'
                    link.style.display = 'none'
                    
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    
                    alert(`分支 ${branchName} 暂无发布版本，已下载最新源码`)
                    return
                }
            } catch (branchError) {
                logger.warn(`查找分支 ${branchName} 的Release失败:`, branchError)
                try {
                    const link = document.createElement('a')
                    link.href = `https://github.com/MenthaMC/Mint/archive/refs/heads/${branchName}.zip`
                    link.download = `mint-${branchName}-latest.zip`
                    link.target = '_blank'
                    link.style.display = 'none'
                    
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    
                    alert(`无法获取分支 ${branchName} 的发布信息，已下载最新源码`)
                    return
                } catch (sourceError) {
                    logger.error('下载分支源码也失败:', sourceError)
                }
            }
        }
        
        logger.debug('使用最终回退策略：打开GitHub Releases页面')
        window.open('https://github.com/MenthaMC/Mint/releases', '_blank')
        alert('正在跳转到GitHub Releases页面，请手动下载最新版本')
        
    } catch (error) {
        logger.error('下载过程中发生错误:', error)
        window.open('https://github.com/MenthaMC/Mint/releases', '_blank')
        alert('下载遇到问题，已为您打开GitHub页面，请手动下载')
    }
}

const viewChangelog = () => {
    try {
        const branchName = selectedBranch.value?.name || 'main'
        const changelogUrl = `https://github.com/MenthaMC/Mint/commits/${branchName}`
        logger.debug('打开更新日志:', changelogUrl)
        window.open(changelogUrl, '_blank')
    } catch (error) {
        logger.error('打开更新日志失败:', error)
        window.open('https://github.com/MenthaMC/Mint/commits/main', '_blank')
    }
}

const viewDocs = () => {
    try {
        const docsUrl = 'https://menthamc.github.io/docs/'
        logger.debug('打开文档:', docsUrl)
        window.open(docsUrl, '_blank')
    } catch (error) {
        logger.error('打开文档失败:', error)
        window.open('https://github.com/MenthaMC/Mint', '_blank')
    }
}

const verifyFile = async () => {
    try {
        logger.debug('尝试获取文件校验信息...')
        const releasesResponse = await fetchWithFallback(`${api}/repos/MenthaMC/Mint/releases/latest`)
        const releaseData = await releasesResponse.json()
        
        if (releaseData && releaseData.body) {
            const hasChecksum = releaseData.body.toLowerCase().includes('sha') || 
                              releaseData.body.toLowerCase().includes('md5') ||
                              releaseData.body.toLowerCase().includes('checksum')
            
            if (hasChecksum) {
                window.open(releaseData.html_url, '_blank')
                alert('请在Release页面查看文件校验信息')
                return
            }
        }
        
        alert(t('download.options.alerts.verifyInDevelopment') || '文件校验功能正在开发中')
        
      } catch (error) {
        logger.error('获取校验信息失败:', error)
        alert(t('download.options.alerts.verifyInDevelopment') || '文件校验功能正在开发中，请手动验证文件完整性')
    }
}

const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    
    try {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        
        if (diffMinutes < 60) {
            return `${diffMinutes} 分钟前`
        } else if (diffHours < 24) {
            return `${diffHours} 小时前`
        } else if (diffDays < 7) {
            return `${diffDays} 天前`
        } else {
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        }
    } catch (error) {
        return ''
    }
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.dropdown-container')) {
        isDropdownOpen.value = false
    }
}

onMounted(() => {
    fetchBranchInfo()
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

.selector-label {
    display: block;
    font-size: 1.2rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 16px;
    text-align: center;
}

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
    overflow-y: auto;
    overflow-x: hidden;
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

.download-btn:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4);
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
