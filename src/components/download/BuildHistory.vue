<template>
    <section class="build-history-section">
        <div class="container">
            <!-- 标题区域 -->
            <div class="section-header">
                <h3 class="section-title">{{ $t('download.buildHistory.title') || '构建历史' }}</h3>
                <p class="section-subtitle">{{ $t('download.buildHistory.description') || '查看Mint的版本发布历史和更新记录' }}</p>
            </div>

            <!-- 分页控制栏 -->
            <div class="pagination-controls">
                <div class="per-page-selector">
                    <label>{{ $t('download.buildHistory.perPage') }}：</label>
                    <div class="custom-select" :class="{ open: isPerPageDropdownOpen }">
                        <button 
                            class="select-trigger" 
                            @click="togglePerPageDropdown"
                        >
                        <span>{{ pagination.perPage }}{{ $t('download.buildHistory.items') }}</span>
                            <svg class="select-arrow" :class="{ rotated: isPerPageDropdownOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6,9 12,15 18,9"></polyline>
                            </svg>
                        </button>
                        <div class="select-options" v-show="isPerPageDropdownOpen">
                            <div 
                                v-for="option in perPageOptions" 
                                :key="option"
                                class="select-option"
                                :class="{ selected: pagination.perPage === option }"
                                @click="selectPerPage(option)"
                            >
                                {{ option }}{{ $t('download.buildHistory.items') }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pagination-info">
                    <span v-if="pagination.totalCount > 0">
                        {{ $t('download.buildHistory.showing') }} {{ (pagination.page - 1) * pagination.perPage + 1 }} - 
                        {{ Math.min(pagination.page * pagination.perPage, pagination.totalCount) }} {{ $t('download.buildHistory.items') }}，
                        {{ $t('download.buildHistory.total') }} {{ pagination.totalCount }} {{ $t('download.buildHistory.records') }}
                    </span>
                </div>
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
                    :class="{ 'latest': pagination.page === 1 && index === 0 }"
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
                                    <span v-if="pagination.page === 1 && index === 0" class="badge latest-badge">
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

            <!-- 分页导航 -->
            <div v-if="!isLoading && pagination.totalPages > 1" class="pagination-nav">
                <div class="pagination-buttons">
                    <button 
                        class="pagination-btn"
                        :disabled="pagination.page === 1"
                        @click="goToPage(1)"
                        :class="{ disabled: pagination.page === 1 }"
                    >
                        {{ $t('download.buildHistory.firstPage') }}
                    </button>
                    <button 
                        class="pagination-btn"
                        :disabled="!pagination.hasPrev"
                        @click="goToPage(pagination.page - 1)"
                        :class="{ disabled: !pagination.hasPrev }"
                    >
                        {{ $t('download.buildHistory.prevPage') }}
                    </button>
                    
                    <!-- 页码按钮 -->
                    <div class="page-numbers">
                        <button
                            v-for="pageNum in getVisiblePages()"
                            :key="pageNum"
                            class="page-btn"
                            :class="{ active: pageNum === pagination.page, ellipsis: pageNum === -1 }"
                            @click="pageNum !== -1 ? goToPage(pageNum) : null"
                            :disabled="pageNum === -1"
                        >
                            {{ pageNum === -1 ? '...' : pageNum }}
                        </button>
                    </div>
                    
                    <button 
                        class="pagination-btn"
                        :disabled="!pagination.hasNext"
                        @click="goToPage(pagination.page + 1)"
                        :class="{ disabled: !pagination.hasNext }"
                    >
                        {{ $t('download.buildHistory.nextPage') }}
                    </button>
                    <button 
                        class="pagination-btn"
                        :disabled="pagination.page === pagination.totalPages"
                        @click="goToPage(pagination.totalPages)"
                        :class="{ disabled: pagination.page === pagination.totalPages }"
                    >
                        {{ $t('download.buildHistory.lastPage') }}
                    </button>
                </div>
                
            </div>

            <!-- 分页统计信息 -->
            <div v-if="!isLoading && releases.length > 0" class="pagination-summary">
                <p class="summary-text">
                    {{ $t('download.buildHistory.showing') }} {{ pagination.page }} {{ $t('download.buildHistory.of') }} {{ pagination.totalPages }} {{ $t('download.buildHistory.pages') }} |
                    {{ $t('download.buildHistory.total') }} {{ pagination.totalCount }} {{ $t('download.buildHistory.versions') }}
                </p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/main'
import { GitHubApiService } from '@/services/github-api.service'
import type { MintReleaseInfo } from '@/services/mint-project.service'

// 定义 props 来接收选中的分支
interface Props {
  selectedBranch?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedBranch: 'main'
})

// 定义事件
const emit = defineEmits(['latestBuildReady'])

const { t } = useI18n()

// 分页接口定义
interface PaginationInfo {
    page: number
    perPage: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

// 响应式数据
const releases = ref<MintReleaseInfo[]>([])
const allReleases = ref<MintReleaseInfo[]>([]) // 存储所有版本数据
const isLoading = ref(true)
const currentBranch = ref(props.selectedBranch)

// 分页状态
const pagination = ref<PaginationInfo>({
    page: 1,
    perPage: 10, // 默认每页10条
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
})

// 自定义下拉菜单状态
const isPerPageDropdownOpen = ref(false)
const perPageOptions = [5, 10, 20, 50]

// 切换下拉菜单
const togglePerPageDropdown = () => {
    isPerPageDropdownOpen.value = !isPerPageDropdownOpen.value
}

// 选择每页数量
const selectPerPage = (value: number) => {
    pagination.value.perPage = value
    pagination.value.page = 1 // 重置到第一页
    isPerPageDropdownOpen.value = false
    applyPagination()
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.custom-select')) {
        isPerPageDropdownOpen.value = false
    }
}

// GitHub API 服务实例
const githubApi = new GitHubApiService()

// 更新分页信息
const updatePagination = (totalCount: number) => {
    pagination.value.totalCount = totalCount
    pagination.value.totalPages = Math.ceil(totalCount / pagination.value.perPage)
    pagination.value.hasNext = pagination.value.page < pagination.value.totalPages
    pagination.value.hasPrev = pagination.value.page > 1
}

// 应用分页到当前数据
const applyPagination = () => {
    const startIndex = (pagination.value.page - 1) * pagination.value.perPage
    const endIndex = startIndex + pagination.value.perPage
    releases.value = allReleases.value.slice(startIndex, endIndex)
    updatePagination(allReleases.value.length)
}

// 跳转到指定页面
const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.value.totalPages && page !== pagination.value.page) {
        pagination.value.page = page
        applyPagination()
        
        // 滚动到顶部
        const section = document.querySelector('.build-history-section')
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' })
        }
    }
}

// 每页数量变化处理
const onPerPageChange = () => {
    pagination.value.page = 1 // 重置到第一页
    applyPagination()
}

// 获取可见的页码
const getVisiblePages = (): number[] => {
    const current = pagination.value.page
    const total = pagination.value.totalPages
    const visible: number[] = []
    
    if (total <= 7) {
        // 总页数少于等于7页，显示所有页码
        for (let i = 1; i <= total; i++) {
            visible.push(i)
        }
    } else {
        // 总页数大于7页，显示部分页码
        if (current <= 4) {
            // 当前页在前4页
            for (let i = 1; i <= 5; i++) {
                visible.push(i)
            }
            visible.push(-1) // 省略号
            visible.push(total)
        } else if (current >= total - 3) {
            // 当前页在后4页
            visible.push(1)
            visible.push(-1) // 省略号
            for (let i = total - 4; i <= total; i++) {
                visible.push(i)
            }
        } else {
            // 当前页在中间
            visible.push(1)
            visible.push(-1) // 省略号
            for (let i = current - 1; i <= current + 1; i++) {
                visible.push(i)
            }
            visible.push(-1) // 省略号
            visible.push(total)
        }
    }
    
    return visible
}

import { cacheFirstRequest } from '@/services/cache-first-request.service'
import { globalCache } from '@/services/cache.service'

// 带缓存、超时和回退的API调用函数
const fetchWithFallback = async (url: string, timeout: number = 10000): Promise<Response> => {
    // 生成缓存键
    const cacheKey = `api:${url}`
    
    try {
        // 首先尝试从缓存获取数据
        const cachedResponse = await cacheFirstRequest.request<any>(cacheKey, {
            url,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'MenthaMC-Website'
            },
            cacheTtl: 5 * 60 * 1000, // 5分钟缓存
            skipCache: false
        })
        
        // 如果从缓存获取成功，返回缓存数据
        if (cachedResponse.data && !cachedResponse.error) {
            console.log('缓存命中:', url)
            return new Response(JSON.stringify(cachedResponse.data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        // 如果缓存未命中或已过期，尝试使用代理API
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)
        
        try {
            // 尝试使用代理API
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'MenthaMC-Website'
                }
            })
            
            clearTimeout(timeoutId)
            
            if (response.ok) {
                console.log('代理API调用成功:', url)
                
                // 获取响应数据并更新缓存
                const responseData = await response.json()
                // 手动更新缓存
                globalCache.set(cacheKey, responseData, 5 * 60 * 1000)
                
                // 返回新的响应对象
                return new Response(JSON.stringify(responseData), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            // 如果代理API失败，抛出错误以触发回退
            throw new Error(`代理API响应失败: ${response.status}`)
            
        } catch (error) {
            clearTimeout(timeoutId)
            
            // 如果是超时或其他错误，尝试直接使用GitHub API
            console.warn('代理API失败，尝试使用GitHub API回退:', error)
            
            // 提取GitHub API路径
            const githubPath = url.replace(`${api}/github/`, '')
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
                    console.log('GitHub API回退成功:', directUrl)
                    
                    // 获取响应数据并更新缓存
                    const responseData = await fallbackResponse.json()
                    // 手动更新缓存
                    globalCache.set(cacheKey, responseData, 5 * 60 * 1000)
                    
                    // 返回新的响应对象
                    return new Response(JSON.stringify(responseData), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    })
                }
                
                throw new Error(`GitHub API也失败了: ${fallbackResponse.status}`)
                
            } catch (fallbackError) {
                console.error('GitHub API回退也失败:', fallbackError)
                
                // 如果所有API都失败，返回模拟数据以保证基本功能
                console.warn('所有API都失败，使用模拟数据')
                const mockData = {
                    message: 'API调用失败，使用默认数据'
                }
                
                return new Response(JSON.stringify(mockData), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
        }
    } catch (error) {
        console.error('缓存请求失败:', error)
        
        // 如果缓存请求失败，返回模拟数据
        return new Response(JSON.stringify({
            message: 'API调用失败，使用默认数据'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

// 获取最新构建信息
const fetchLatestBuild = async (branch: string = 'main'): Promise<MintReleaseInfo | null> => {
    try {
        console.log('获取分支最新构建:', branch)
        
        if (branch === 'main' || branch === 'master') {
            // 主分支：获取最新的GitHub Release
            const response = await fetchWithFallback(`${api}/github/repos/MenthaMC/Mint/releases/latest`)
            const release = await response.json()
            
            // 获取提交信息
            let commitInfo = undefined
            try {
                const commitResponse = await fetchWithFallback(`${api}/github/repos/MenthaMC/Mint/commits/${release.target_commitish || 'main'}`)
                const commitData = await commitResponse.json()
                commitInfo = {
                    sha: commitData.sha?.substring(0, 7) || 'unknown',
                    shortMessage: commitData.commit?.message?.split('\n')[0] || release.name || `版本 ${release.tag_name}`,
                    author: {
                        name: commitData.commit?.author?.name || 'MenthaMC Team',
                        email: commitData.commit?.author?.email || '',
                        avatar_url: commitData.author?.avatar_url || 'https://github.com/MenthaMC.png'
                    },
                    committer: {
                        name: commitData.commit?.committer?.name || 'MenthaMC Team',
                        email: commitData.commit?.committer?.email || '',
                        date: commitData.commit?.committer?.date || release.published_at
                    },
                    message: commitData.commit?.message || release.body || `版本 ${release.tag_name} 发布`,
                    html_url: commitData.html_url || `https://github.com/MenthaMC/Mint/commit/${commitData.sha}`
                }
            } catch (commitError) {
                console.warn(`获取提交信息失败:`, commitError)
            }
            
            // 查找JAR文件
            const jarAsset = release.assets?.find((asset: any) => 
                asset.name.toLowerCase().endsWith('.jar') && 
                !asset.name.toLowerCase().includes('sources') && 
                !asset.name.toLowerCase().includes('javadoc')
            )
            
            // 计算文件大小
            const totalSize = release.assets?.reduce((sum: number, asset: any) => sum + (asset.size || 0), 0) || 0
            const fileSize = totalSize > 0 ? `${(totalSize / 1024 / 1024).toFixed(1)} MB` : '大小未知'
            
            const latestRelease: MintReleaseInfo = {
                version: release.tag_name?.replace(/^v/, '') || '最新版本',
                buildNumber: '1',
                releaseDate: new Date(release.published_at || release.created_at).toLocaleDateString('zh-CN'),
                fileSize,
                downloadUrl: jarAsset?.browser_download_url || release.assets?.[0]?.browser_download_url || release.zipball_url,
                changelogUrl: release.html_url,
                assets: release.assets?.map((asset: any) => ({
                    name: asset.name,
                    size: asset.size || 0,
                    downloadCount: asset.download_count || 0,
                    browserDownloadUrl: asset.browser_download_url
                })) || [],
                commitInfo
            }
            
            return latestRelease
        } else {
            // 非主分支：尝试查找该分支对应的Release，如果没有则获取最新提交
            try {
                // 首先尝试查找分支对应的Release
                const releasesResponse = await fetchWithFallback(`${api}/github/repos/MenthaMC/Mint/releases?per_page=50`)
                const releases = await releasesResponse.json()
                
                // 查找目标分支的Release
                const branchRelease = releases.find((release: any) => 
                    release.target_commitish === branch || 
                    release.tag_name.includes(branch) ||
                    release.name?.includes(branch)
                )
                
                if (branchRelease) {
                    console.log(`找到分支 ${branch} 的Release:`, branchRelease.tag_name)
                    
                    // 查找JAR文件
                    const jarAsset = branchRelease.assets?.find((asset: any) => 
                        asset.name.toLowerCase().endsWith('.jar') && 
                        !asset.name.toLowerCase().includes('sources') && 
                        !asset.name.toLowerCase().includes('javadoc')
                    )
                    
                    // 获取提交信息
                    let commitInfo = undefined
                    try {
                        const commitResponse = await fetchWithFallback(`${api}/github/repos/MenthaMC/Mint/commits/${branchRelease.target_commitish || branch}`)
                        const commitData = await commitResponse.json()
                        commitInfo = {
                            sha: commitData.sha?.substring(0, 7) || 'unknown',
                            shortMessage: commitData.commit?.message?.split('\n')[0] || branchRelease.name || `版本 ${branchRelease.tag_name}`,
                            author: {
                                name: commitData.commit?.author?.name || 'MenthaMC Team',
                                email: commitData.commit?.author?.email || '',
                                avatar_url: commitData.author?.avatar_url || 'https://github.com/MenthaMC.png'
                            },
                            committer: {
                                name: commitData.commit?.committer?.name || 'MenthaMC Team',
                                email: commitData.commit?.committer?.email || '',
                                date: commitData.commit?.committer?.date || branchRelease.published_at
                            },
                            message: commitData.commit?.message || branchRelease.body || `版本 ${branchRelease.tag_name} 发布`,
                            html_url: commitData.html_url || `https://github.com/MenthaMC/Mint/commit/${commitData.sha}`
                        }
                    } catch (commitError) {
                        console.warn(`获取分支Release提交信息失败:`, commitError)
                    }
                    
                    const totalSize = branchRelease.assets?.reduce((sum: number, asset: any) => sum + (asset.size || 0), 0) || 0
                    const fileSize = totalSize > 0 ? `${(totalSize / 1024 / 1024).toFixed(1)} MB` : '大小未知'
                    
                    return {
                        version: branchRelease.tag_name?.replace(/^v/, '') || `${branch}-release`,
                        buildNumber: '1',
                        releaseDate: new Date(branchRelease.published_at || branchRelease.created_at).toLocaleDateString('zh-CN'),
                        fileSize,
                        downloadUrl: jarAsset?.browser_download_url || branchRelease.assets?.[0]?.browser_download_url || branchRelease.zipball_url,
                        changelogUrl: branchRelease.html_url,
                        assets: branchRelease.assets?.map((asset: any) => ({
                            name: asset.name,
                            size: asset.size || 0,
                            downloadCount: asset.download_count || 0,
                            browserDownloadUrl: asset.browser_download_url
                        })) || [],
                        commitInfo
                    }
                }
            } catch (releaseError) {
                console.warn(`查找分支 ${branch} 的Release失败，回退到提交模式:`, releaseError)
            }
            
            // 如果没有找到Release，获取分支的最新提交
            const commitsResponse = await fetchWithFallback(`${api}/github/repos/MenthaMC/Mint/commits?sha=${branch}&per_page=1`)
            const commits = await commitsResponse.json()
            
            if (commits && commits.length > 0) {
                const commit = commits[0]
                const commitDate = new Date(commit.commit.committer.date)
                const shortSha = commit.sha.substring(0, 7)
                
                const latestBuild: MintReleaseInfo = {
                    version: `${branch}-${shortSha}`,
                    buildNumber: '1',
                    releaseDate: commitDate.toLocaleDateString('zh-CN'),
                    fileSize: '约 15-20 MB',
                    downloadUrl: `https://github.com/MenthaMC/Mint/archive/${commit.sha}.zip`,
                    changelogUrl: commit.html_url,
                    assets: [{
                        name: `mint-${branch}-${shortSha}.zip`,
                        size: 0,
                        downloadCount: 0,
                        browserDownloadUrl: `https://github.com/MenthaMC/Mint/archive/${commit.sha}.zip`
                    }],
                    commitInfo: {
                        sha: shortSha,
                        shortMessage: commit.commit.message.split('\n')[0],
                        author: {
                            name: commit.commit.author.name,
                            email: commit.commit.author.email,
                            avatar_url: commit.author?.avatar_url || 'https://github.com/MenthaMC.png'
                        },
                        committer: {
                            name: commit.commit.committer.name,
                            email: commit.commit.committer.email,
                            date: commit.commit.committer.date
                        },
                        message: commit.commit.message,
                        html_url: commit.html_url
                    }
                }
                
                return latestBuild
            }
        }
        
        return null
    } catch (error) {
        console.error('获取最新构建失败:', error)
        return null
    }
}

// 获取版本历史
const fetchReleases = async (limit: number = 100, branch: string = 'main') => {
    try {
        console.log('开始获取版本历史，分支:', branch, '限制数量:', limit)
        
        if (branch === 'main' || branch === 'master') {
            // 主分支：获取所有GitHub Releases
            const response = await fetchWithFallback(`${api}/github/repos/MenthaMC/Mint/releases?per_page=100`)
            const githubReleases = await response.json()
            
            if (githubReleases && githubReleases.length > 0) {
                // 转换GitHub Release数据为我们的格式
                const releaseList: MintReleaseInfo[] = await Promise.all(
                    githubReleases.map(async (release: any, index: number) => {
                        // 获取提交信息
                        let commitInfo = undefined
                        try {
                            const commitResponse = await fetchWithFallback(`${api}/github/repos/MenthaMC/Mint/commits/${release.target_commitish || 'main'}`)
                            const commitData = await commitResponse.json()
                            commitInfo = {
                                sha: commitData.sha?.substring(0, 7) || 'unknown',
                                shortMessage: commitData.commit?.message?.split('\n')[0] || release.name || `版本 ${release.tag_name}`,
                                author: {
                                    name: commitData.commit?.author?.name || 'MenthaMC Team',
                                    email: commitData.commit?.author?.email || '',
                                    avatar_url: commitData.author?.avatar_url || 'https://github.com/MenthaMC.png'
                                },
                                committer: {
                                    name: commitData.commit?.committer?.name || 'MenthaMC Team',
                                    email: commitData.commit?.committer?.email || '',
                                    date: commitData.commit?.committer?.date || release.published_at
                                },
                                message: commitData.commit?.message || release.body || `版本 ${release.tag_name} 发布`,
                                html_url: commitData.html_url || `https://github.com/MenthaMC/Mint/commit/${commitData.sha}`
                            }
                        } catch (commitError) {
                            console.warn(`获取提交信息失败:`, commitError)
                        }
                        
                        // 计算文件大小
                        const totalSize = release.assets?.reduce((sum: number, asset: any) => sum + (asset.size || 0), 0) || 0
                        const fileSize = totalSize > 0 ? `${(totalSize / 1024 / 1024).toFixed(1)} MB` : '大小未知'
                        
                        return {
                            version: release.tag_name?.replace(/^v/, '') || `未知版本-${index + 1}`,
                            buildNumber: String(githubReleases.length - index),
                            releaseDate: new Date(release.published_at || release.created_at).toLocaleDateString('zh-CN'),
                            fileSize,
                            downloadUrl: release.assets?.[0]?.browser_download_url || release.zipball_url,
                            changelogUrl: release.html_url,
                            assets: release.assets?.map((asset: any) => ({
                                name: asset.name,
                                size: asset.size || 0,
                                downloadCount: asset.download_count || 0,
                                browserDownloadUrl: asset.browser_download_url
                            })) || [],
                            commitInfo
                        }
                    })
                )
                
                allReleases.value = releaseList
                console.log('获取到的版本数据:', allReleases.value)
            } else {
                console.warn('没有获取到任何发布版本，创建模拟数据')
                allReleases.value = createMockReleases(branch, limit)
            }
        } else {
            // 非主分支：获取分支的所有提交历史作为构建信息
            const commitsResponse = await fetchWithFallback(`${api}/github/repos/MenthaMC/Mint/commits?sha=${branch}&per_page=100`)
            const commits = await commitsResponse.json()
            
            if (commits && commits.length > 0) {
                // 将提交转换为构建信息格式
                const buildList: MintReleaseInfo[] = commits.map((commit: any, index: number) => {
                    const commitDate = new Date(commit.commit.committer.date)
                    const shortSha = commit.sha.substring(0, 7)
                    
                    return {
                        version: `${branch}-${shortSha}`,
                        buildNumber: String(commits.length - index),
                        releaseDate: commitDate.toLocaleDateString('zh-CN'),
                        fileSize: '0 MB',
                        downloadUrl: `https://github.com/MenthaMC/Mint/archive/${commit.sha}.zip`,
                        changelogUrl: commit.html_url,
                        assets: [{
                            name: `mint-${branch}-${shortSha}.zip`,
                            size: 0,
                            downloadCount: 0,
                            browserDownloadUrl: `https://github.com/MenthaMC/Mint/archive/${commit.sha}.zip`
                        }],
                        commitInfo: {
                            sha: shortSha,
                            shortMessage: commit.commit.message.split('\n')[0],
                            author: {
                                name: commit.commit.author.name,
                                email: commit.commit.author.email,
                                avatar_url: commit.author?.avatar_url || 'https://github.com/MenthaMC.png'
                            },
                            committer: {
                                name: commit.commit.committer.name,
                                email: commit.commit.committer.email,
                                date: commit.commit.committer.date
                            },
                            message: commit.commit.message,
                            html_url: commit.html_url
                        }
                    }
                })
                
                allReleases.value = buildList
                console.log(`获取到分支 ${branch} 的构建数据:`, allReleases.value)
            } else {
                console.warn(`分支 ${branch} 没有提交记录，创建模拟数据`)
                allReleases.value = createMockReleases(branch, limit)
            }
        }
        
    } catch (error) {
        console.error('获取版本历史失败:', error)
        allReleases.value = createMockReleases(branch, limit)
    } finally {
        // 应用分页
        applyPagination()
    }
}

// 创建模拟发布数据
const createMockReleases = (branch: string, limit: number): MintReleaseInfo[] => {
    const mockReleases: MintReleaseInfo[] = []
    const now = new Date()
    
    for (let i = 0; i < Math.min(limit, 3); i++) {
        const releaseDate = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000) // 每周一个版本
        const version = branch === 'main' ? `1.${3 - i}.0` : `${branch}-${3 - i}`
        
        mockReleases.push({
            version,
            buildNumber: String(3 - i),
            releaseDate: releaseDate.toLocaleDateString('zh-CN'),
            fileSize: '0 MB',
            downloadUrl: `https://github.com/MenthaMC/Mint/releases/download/v${version}/mint-${version}.jar`,
            changelogUrl: `https://github.com/MenthaMC/Mint/releases/tag/v${version}`,
            assets: [{
                name: `mint-${version}.jar`,
                size: 16777216, // 16MB
                downloadCount: Math.floor(Math.random() * 1000) + 100,
                browserDownloadUrl: `https://github.com/MenthaMC/Mint/releases/download/v${version}/mint-${version}.jar`
            }],
            commitInfo: {
                sha: Math.random().toString(36).substring(2, 9),
                shortMessage: i === 0 ? '修复重要bug并优化性能' : i === 1 ? '添加新功能和改进' : '初始版本发布',
                author: {
                    name: 'MenthaMC Team',
                    email: 'team@menthamc.com',
                    avatar_url: 'https://github.com/MenthaMC.png'
                },
                committer: {
                    name: 'MenthaMC Team',
                    email: 'team@menthamc.com',
                    date: releaseDate.toISOString()
                },
                message: i === 0 ? '修复重要bug并优化性能\n\n- 修复内存泄漏问题\n- 优化启动速度\n- 改进错误处理' : 
                        i === 1 ? '添加新功能和改进\n\n- 新增配置选项\n- 改进用户界面\n- 修复已知问题' : 
                        '初始版本发布\n\n- 基础功能实现\n- 核心架构搭建',
                html_url: `https://github.com/MenthaMC/Mint/commit/${Math.random().toString(36).substring(2, 9)}`
            }
        })
    }
    
    return mockReleases
}

// 监听分支变化
watch(() => props.selectedBranch, (newBranch) => {
    if (newBranch && newBranch !== currentBranch.value) {
        currentBranch.value = newBranch
        pagination.value.page = 1 // 重置到第一页
        isLoading.value = true
        fetchReleases(100, newBranch).finally(() => {
            isLoading.value = false
        })
    }
})

// 下载版本
const downloadRelease = async (release: MintReleaseInfo) => {
    try {
        // 优先使用release中的下载链接
        if (release.downloadUrl) {
            // 检查是否是JAR文件
            if (release.downloadUrl.toLowerCase().endsWith('.jar')) {
                const link = document.createElement('a')
                link.href = release.downloadUrl
                link.download = `mint-${release.version}-${release.buildNumber}.jar`
                link.style.display = 'none'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                return
            }
        }
        
        // 如果不是JAR文件，尝试获取当前分支的最新JAR
        const branchJarUrl = await getBranchLatestJar(currentBranch.value)
        if (branchJarUrl) {
            const link = document.createElement('a')
            link.href = branchJarUrl
            link.download = `mint-${release.version}.jar`
            link.style.display = 'none'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            return
        }
        
        // 最后回退到原始下载链接
        if (release.downloadUrl) {
            const link = document.createElement('a')
            link.href = release.downloadUrl
            link.download = `mint-${release.version}-${release.buildNumber}.jar`
            link.style.display = 'none'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    } catch (error) {
        console.error('下载失败:', error)
        // 错误回退
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

// 获取并发送最新构建信息
const getAndEmitLatestBuild = async (branch: string) => {
    try {
        const latestBuild = await fetchLatestBuild(branch)
        if (latestBuild) {
            console.log(`获取到分支 ${branch} 的最新构建:`, latestBuild)
            emit('latestBuildReady', latestBuild)
            return latestBuild
        }
    } catch (error) {
        console.error(`获取分支 ${branch} 的最新构建失败:`, error)
    }
    return null
}

// 获取分支对应的最新JAR下载链接
const getBranchLatestJar = async (branch: string): Promise<string | null> => {
    try {
        console.log(`获取分支 ${branch} 的最新JAR...`)
        
        if (branch === 'main' || branch === 'master') {
            // 主分支：获取最新Release的JAR
            const response = await fetchWithFallback(`${api}/github/repos/MenthaMC/Mint/releases/latest`)
            const release = await response.json()
            
            const jarAsset = release.assets?.find((asset: any) => 
                asset.name.toLowerCase().endsWith('.jar') && 
                !asset.name.toLowerCase().includes('sources') && 
                !asset.name.toLowerCase().includes('javadoc')
            )
            
            if (jarAsset) {
                return jarAsset.browser_download_url
            }
        } else {
            // 非主分支：查找分支对应的Release
            const releasesResponse = await fetchWithFallback(`${api}/github/repos/MenthaMC/Mint/releases?per_page=50`)
            const releases = await releasesResponse.json()
            
            const branchRelease = releases.find((release: any) => 
                release.target_commitish === branch || 
                release.tag_name.includes(branch) ||
                release.name?.includes(branch)
            )
            
            if (branchRelease) {
                const jarAsset = branchRelease.assets?.find((asset: any) => 
                    asset.name.toLowerCase().endsWith('.jar') && 
                    !asset.name.toLowerCase().includes('sources') && 
                    !asset.name.toLowerCase().includes('javadoc')
                )
                
                if (jarAsset) {
                    return jarAsset.browser_download_url
                }
            }
        }
        
        return null
    } catch (error) {
        console.error(`获取分支 ${branch} 的JAR失败:`, error)
        return null
    }
}

onMounted(async () => {
    try {
        // 获取版本历史
        await fetchReleases(100, currentBranch.value)
        
        // 获取并发送最新构建信息
        await getAndEmitLatestBuild(currentBranch.value)
        
        // 添加点击外部关闭下拉菜单的事件监听
        document.addEventListener('click', handleClickOutside)
    } finally {
        isLoading.value = false
    }
})

// 组件卸载时移除事件监听器
import { onUnmounted } from 'vue'

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
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

/* 分页控制栏 */
.pagination-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
}

.per-page-selector {
    display: flex;
    align-items: center;
    gap: 8px;
}

.per-page-selector label {
    color: #94a3b8;
    font-size: 14px;
    font-weight: 500;
}

/* 自定义下拉菜单 */
.custom-select {
    position: relative;
    min-width: 80px;
}

.select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 80px;
    font-family: inherit;
}

.select-trigger:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
}

.custom-select.open .select-trigger {
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.select-arrow {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
}

.select-arrow.rotated {
    transform: rotate(180deg);
}

.select-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(30, 41, 59, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    backdrop-filter: blur(20px);
    z-index: 1000;
    margin-top: 4px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.select-option {
    padding: 8px 12px;
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.select-option:last-child {
    border-bottom: none;
}

.select-option:hover {
    background: rgba(255, 255, 255, 0.08);
}

.select-option.selected {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
}

.pagination-info {
    color: #94a3b8;
    font-size: 14px;
    font-weight: 500;
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

/* 分页导航 */
.pagination-nav {
    margin-top: 40px;
    padding: 24px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
}

.pagination-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 16px;
}

.pagination-btn {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 60px;
}

.pagination-btn:hover:not(.disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
}

.pagination-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.02);
}

.page-numbers {
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0 8px;
}

.page-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.page-btn:hover:not(.ellipsis) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
}

.page-btn.active {
    background: #10b981;
    border-color: #10b981;
    color: #ffffff;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.page-btn.ellipsis {
    cursor: default;
    opacity: 0.6;
}


/* 分页统计信息 */
.pagination-summary {
    text-align: center;
    margin-top: 24px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
}

.summary-text {
    color: #94a3b8;
    font-size: 14px;
    font-weight: 500;
    margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .container {
        padding: 0 16px;
    }
    
    .pagination-controls {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }
    
    .pagination-buttons {
        flex-direction: column;
        gap: 12px;
    }
    
    .page-numbers {
        margin: 0;
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
