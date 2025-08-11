import type { GitHubRelease, GitHubRepository, GitHubCommit, BuildCommitInfo } from '@/types'
import { renderSize } from '@/utils/helpers'
import { GitHubApiService, type GitHubBranch } from './github-api.service'

export interface MintReleaseInfo {
  version: string
  buildNumber: string
  fileSize: string
  releaseDate: string
  downloadUrl: string
  changelogUrl: string
  commitInfo?: BuildCommitInfo
  assets: Array<{
    name: string
    size: number
    downloadCount: number
    browserDownloadUrl: string
  }>
}

export interface MintBranchInfo {
  name: string
  displayName: string
  sha: string
  isDefault: boolean
  isProtected: boolean
  lastCommit?: {
    message: string
    author: string
    date: string
  }
}

export interface MintProjectInfo {
  repository: GitHubRepository
  latestRelease: MintReleaseInfo
  releases: MintReleaseInfo[]
  branches: MintBranchInfo[]
  stats: {
    stars: number
    forks: number
    issues: number
    lastUpdate: string
  }
}

interface CacheItem<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface CacheOptions {
  ttl?: number
  forceRefresh?: boolean
}

export class MintProjectService {
  private readonly OWNER = 'MenthaMC'
  private readonly REPO = 'Mint'
  private readonly DEFAULT_CACHE_TTL = 5 * 60 * 1000 // 5分钟缓存
  private readonly LONG_CACHE_TTL = 30 * 60 * 1000 // 30分钟缓存（用于稳定数据）
  private readonly SHORT_CACHE_TTL = 2 * 60 * 1000 // 2分钟缓存（用于频繁变化数据）
  
  private cache: Map<string, CacheItem<unknown>> = new Map()
  private githubApi: GitHubApiService
  private pendingRequests: Map<string, Promise<unknown>> = new Map()

  constructor() {
    this.githubApi = new GitHubApiService({
      token: import.meta.env.VITE_GITHUB_TOKEN,
      retryAttempts: 5,
      retryDelay: 3000,
      timeout: 20000
    })
    this.startCacheCleanup()
  }

  /**
   * 启动缓存清理定时器
   */
  private startCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now()
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiresAt) {
          this.cache.delete(key)
        }
      }
    }, 60 * 1000) // 每分钟清理一次过期缓存
  }

  /**
   * 检查缓存是否过期
   */
  private isExpired(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return true
    return Date.now() > item.expiresAt
  }

  /**
   * 设置缓存
   */
  private setCache<T>(key: string, data: T, ttl: number = this.DEFAULT_CACHE_TTL): void {
    const now = Date.now()
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    })
  }

  /**
   * 获取缓存数据
   */
  private getCache<T>(key: string): T | null {
    try {
      const item = this.cache.get(key)
      if (!item) return null
      
      if (Date.now() > item.expiresAt) {
        this.cache.delete(key)
        return null
      }
      
      return item.data as T
    } catch (error) {
      console.warn(`缓存读取失败 [${key}]:`, error)
      this.cache.delete(key)
      return null
    }
  }

  /**
   * 缓存优先的数据获取策略
   */
  private async getCachedOrFetch<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T | null> {
    const { ttl = this.DEFAULT_CACHE_TTL, forceRefresh = false } = options

    // 如果强制刷新，跳过缓存检查
    if (!forceRefresh) {
      // 首先检查缓存
      const cached = this.getCache<T>(cacheKey)
      if (cached !== null) {
        console.log(`缓存命中 [${cacheKey}]`)
        return cached
      }
    }

    // 检查是否有相同的请求正在进行
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`等待进行中的请求 [${cacheKey}]`)
      try {
        return await this.pendingRequests.get(cacheKey) as T
      } catch (error) {
        console.warn(`等待请求失败 [${cacheKey}]:`, error)
        this.pendingRequests.delete(cacheKey)
      }
    }

    // 创建新的请求
    const requestPromise = this.executeRequest(cacheKey, fetchFn, ttl)
    this.pendingRequests.set(cacheKey, requestPromise)

    try {
      const result = await requestPromise
      return result
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }

  /**
   * 执行请求并处理缓存
   */
  private async executeRequest<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    ttl: number
  ): Promise<T | null> {
    try {
      console.log(`发起API请求 [${cacheKey}]`)
      const result = await fetchFn()
      
      // 缓存成功结果
      this.setCache(cacheKey, result, ttl)
      console.log(`数据已缓存 [${cacheKey}], TTL: ${ttl}ms`)
      
      return result
    } catch (error) {
      console.error(`API请求失败 [${cacheKey}]:`, error)
      
      // 尝试返回过期的缓存数据作为降级方案
      const expiredCache = this.cache.get(cacheKey)
      if (expiredCache) {
        console.warn(`使用过期缓存作为降级方案 [${cacheKey}]`)
        return expiredCache.data as T
      }
      
      // 如果是GitHub API限制错误，返回模拟数据
      if (error instanceof Error && error.message.includes('GitHub API访问受限')) {
        console.warn(`GitHub API受限，返回模拟数据 [${cacheKey}]`)
        return this.getMockData(cacheKey) as T
      }
      
      return null
    }
  }

  /**
   * 获取模拟数据作为降级方案
   */
  private getMockData(cacheKey: string): unknown {
    if (cacheKey === 'mint:latest-release') {
      return {
        version: '1.0.0',
        buildNumber: '1',
        fileSize: '未知',
        releaseDate: new Date().toLocaleDateString('zh-CN'),
        downloadUrl: 'https://github.com/MenthaMC/Mint/releases',
        changelogUrl: 'https://github.com/MenthaMC/Mint/releases',
        assets: [{
          name: 'mint-latest.jar',
          size: 0,
          downloadCount: 0,
          browserDownloadUrl: 'https://github.com/MenthaMC/Mint/releases'
        }]
      }
    }
    
    if (cacheKey.startsWith('mint:all-releases')) {
      return [{
        version: '1.0.0',
        buildNumber: '1',
        fileSize: '未知',
        releaseDate: new Date().toLocaleDateString('zh-CN'),
        downloadUrl: 'https://github.com/MenthaMC/Mint/releases',
        changelogUrl: 'https://github.com/MenthaMC/Mint/releases',
        assets: [{
          name: 'mint-latest.jar',
          size: 0,
          downloadCount: 0,
          browserDownloadUrl: 'https://github.com/MenthaMC/Mint/releases'
        }]
      }]
    }
    
    return null
  }

  /**
   * 获取最新版本信息
   */
  async getLatestRelease(options: CacheOptions = {}): Promise<MintReleaseInfo | null> {
    const cacheKey = 'mint:latest-release'
    
    return this.getCachedOrFetch(
      cacheKey,
      async () => {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

        try {
          const response = await fetch(`https://api.github.com/repos/${this.OWNER}/${this.REPO}/releases/latest`, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'MenthaMC-Website/1.0'
            }
          })
          
          clearTimeout(timeoutId)
          
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('仓库或发布版本不存在')
            }
            if (response.status === 403) {
              throw new Error('GitHub API访问受限。请配置GITHUB_TOKEN环境变量以提高访问限制')
            }
            if (response.status === 429) {
              throw new Error('GitHub API速率限制，请稍后重试')
            }
            throw new Error(`GitHub API请求失败: ${response.status} ${response.statusText}`)
          }

          const release: GitHubRelease = await response.json()
          return await this.transformReleaseData(release)
        } finally {
          clearTimeout(timeoutId)
        }
      },
      { ttl: this.SHORT_CACHE_TTL, ...options }
    )
  }

  /**
   * 获取所有版本列表
   */
  async getAllReleases(limit: number = 10, options: CacheOptions = {}): Promise<MintReleaseInfo[]> {
    const cacheKey = `mint:all-releases:${limit}`
    
    const result = await this.getCachedOrFetch(
      cacheKey,
      async () => {
        const response = await fetch(
          `https://api.github.com/repos/${this.OWNER}/${this.REPO}/releases?per_page=${limit}`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'MenthaMC-Website/1.0'
            }
          }
        )
        
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('GitHub API访问受限。请配置GITHUB_TOKEN环境变量以提高访问限制')
          }
          if (response.status === 429) {
            throw new Error('GitHub API速率限制，请稍后重试')
          }
          throw new Error(`GitHub API请求失败: ${response.status}`)
        }

        const releases: GitHubRelease[] = await response.json()
        return await Promise.all(
          releases.map(release => this.transformReleaseData(release))
        )
      },
      { ttl: this.DEFAULT_CACHE_TTL, ...options }
    )

    return result || []
  }

  /**
   * 获取分支信息
   */
  async getBranches(options: CacheOptions = {}): Promise<MintBranchInfo[]> {
    const cacheKey = 'mint:branches'
    
    const result = await this.getCachedOrFetch(
      cacheKey,
      async () => {
        const branches = await this.githubApi.getBranches(this.OWNER, this.REPO, { per_page: 50 })
        
        const branchInfos: MintBranchInfo[] = branches.map(branch => ({
          name: branch.name,
          displayName: this.getBranchDisplayName(branch.name),
          sha: branch.commit.sha.substring(0, 7),
          isDefault: branch.name === 'main' || branch.name === 'master',
          isProtected: branch.protected
        }))

        // 按优先级排序：默认分支 > 开发分支 > 其他分支
        branchInfos.sort((a, b) => {
          if (a.isDefault && !b.isDefault) return -1
          if (!a.isDefault && b.isDefault) return 1
          if (a.name.includes('dev') && !b.name.includes('dev')) return -1
          if (!a.name.includes('dev') && b.name.includes('dev')) return 1
          return a.name.localeCompare(b.name)
        })
        
        return branchInfos
      },
      { ttl: this.DEFAULT_CACHE_TTL, ...options }
    )

    return result || []
  }

  /**
   * 获取分支显示名称
   */
  private getBranchDisplayName(branchName: string): string {
    const displayNames: Record<string, string> = {
      'main': '主分支 (稳定版)',
      'master': '主分支 (稳定版)',
      'develop': '开发分支 (最新功能)',
      'dev': '开发分支 (最新功能)',
      'beta': '测试分支 (预发布)',
      'alpha': '内测分支 (实验性)',
      'release': '发布分支',
      'hotfix': '热修复分支'
    }

    // 检查完全匹配
    if (displayNames[branchName]) {
      return displayNames[branchName]
    }

    // 检查包含关系
    for (const [key, value] of Object.entries(displayNames)) {
      if (branchName.includes(key)) {
        return `${value} (${branchName})`
      }
    }

    // 默认返回原名称
    return branchName
  }

  /**
   * 获取项目完整信息
   */
  async getProjectInfo(options: CacheOptions = {}): Promise<MintProjectInfo | null> {
    const cacheKey = 'mint:project-info'
    
    return this.getCachedOrFetch(
      cacheKey,
      async () => {
        // 并行获取仓库信息、最新版本和分支信息
        const [repoResponse, latestRelease, allReleases, branches] = await Promise.all([
          fetch(`https://api.github.com/repos/${this.OWNER}/${this.REPO}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'MenthaMC-Website/1.0'
            }
          }),
          this.getLatestRelease({ forceRefresh: true }),
          this.getAllReleases(5, { forceRefresh: true }),
          this.getBranches({ forceRefresh: true })
        ])

        if (!repoResponse.ok) {
          throw new Error(`获取仓库信息失败: ${repoResponse.status}`)
        }

        const repository: GitHubRepository = await repoResponse.json()

        if (!latestRelease) {
          throw new Error('无法获取最新版本信息')
        }

        return {
          repository,
          latestRelease,
          releases: allReleases,
          branches,
          stats: {
            stars: repository.stargazers_count,
            forks: repository.forks_count,
            issues: 0, // 可以通过额外API获取
            lastUpdate: repository.updated_at
          }
        }
      },
      { ttl: this.LONG_CACHE_TTL, ...options }
    )
  }

  /**
   * 获取下载统计信息
   */
  async getDownloadStats(options: CacheOptions = {}): Promise<{ totalDownloads: number; releaseDownloads: Record<string, number> }> {
    const cacheKey = 'mint:download-stats'
    
    const result = await this.getCachedOrFetch(
      cacheKey,
      async () => {
        const releases = await this.getAllReleases(20, { forceRefresh: true }) // 获取更多版本用于统计
        
        let totalDownloads = 0
        const releaseDownloads: Record<string, number> = {}

        releases.forEach(release => {
          let releaseTotal = 0
          release.assets.forEach(asset => {
            releaseTotal += asset.downloadCount
            totalDownloads += asset.downloadCount
          })
          releaseDownloads[release.version] = releaseTotal
        })

        return { totalDownloads, releaseDownloads }
      },
      { ttl: this.LONG_CACHE_TTL, ...options }
    )

    return result || { totalDownloads: 0, releaseDownloads: {} }
  }

  /**
   * 获取指定标签的提交信息
   */
  async getCommitInfoByTag(tagName: string, options: CacheOptions = {}): Promise<BuildCommitInfo | null> {
    const cacheKey = `mint:commit:${tagName}`
    
    return this.getCachedOrFetch(
      cacheKey,
      async () => {
        // 直接通过标签获取提交信息，简化API调用
        const commitResponse = await fetch(
          `https://api.github.com/repos/${this.OWNER}/${this.REPO}/commits/${tagName}`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'MenthaMC-Website/1.0'
            }
          }
        )

        if (!commitResponse.ok) {
          throw new Error(`无法获取标签 ${tagName} 的提交信息: ${commitResponse.status}`)
        }

        const commit: GitHubCommit = await commitResponse.json()
        return this.transformCommitData(commit)
      },
      { ttl: this.LONG_CACHE_TTL, ...options }
    )
  }

  /**
   * 转换GitHub提交数据为内部格式
   */
  private transformCommitData(commit: GitHubCommit): BuildCommitInfo {
    // 截取提交消息的第一行作为简短消息
    const shortMessage = commit.commit.message.split('\n')[0].trim()
    
    return {
      sha: commit.sha.substring(0, 7), // 使用短SHA
      author: {
        name: commit.commit.author.name,
        email: commit.commit.author.email,
        avatar_url: commit.author?.avatar_url
      },
      committer: {
        name: commit.commit.committer.name,
        email: commit.commit.committer.email,
        date: commit.commit.committer.date
      },
      message: commit.commit.message,
      shortMessage,
      html_url: commit.html_url
    }
  }

  /**
   * 转换GitHub Release数据为内部格式
   */
  private async transformReleaseData(release: GitHubRelease): Promise<MintReleaseInfo> {
    // 解析版本号和构建号
    const tagParts = release.tag_name.replace(/^v/, '').split('-')
    const version = tagParts[0] || release.tag_name
    const buildNumber = tagParts[1] || '0'

    // 获取主要资源文件（通常是.jar文件）
    const mainAsset = release.assets.find(asset => 
      asset.name.endsWith('.jar') && !asset.name.includes('sources') && !asset.name.includes('javadoc')
    ) || release.assets[0]

    // 尝试获取提交信息，但不让它阻塞主要数据
    let commitInfo: BuildCommitInfo | null = null
    try {
      commitInfo = await this.getCommitInfoByTag(release.tag_name)
    } catch (error) {
      console.warn(`获取版本 ${release.tag_name} 的提交信息失败，将跳过提交信息显示:`, error)
    }

    return {
      version,
      buildNumber,
      fileSize: mainAsset ? renderSize(mainAsset.size.toString()) : '未知',
      releaseDate: new Date(release.published_at || release.created_at).toLocaleDateString('zh-CN'),
      downloadUrl: mainAsset?.browser_download_url || '',
      changelogUrl: release.html_url,
      commitInfo: commitInfo || undefined,
      assets: release.assets.map(asset => ({
        name: asset.name,
        size: asset.size,
        downloadCount: asset.download_count,
        browserDownloadUrl: asset.browser_download_url
      }))
    }
  }

  /**
   * 强制刷新指定缓存
   */
  async refreshCache(cacheKey?: string): Promise<void> {
    if (cacheKey) {
      this.cache.delete(cacheKey)
      console.log(`已清除缓存 [${cacheKey}]`)
    } else {
      this.cache.clear()
      console.log('已清除所有缓存')
    }
  }

  /**
   * 预热缓存
   */
  async warmupCache(): Promise<void> {
    console.log('开始预热缓存...')
    
    try {
      await Promise.all([
        this.getLatestRelease(),
        this.getAllReleases(10),
        this.getBranches()
      ])
      console.log('缓存预热完成')
    } catch (error) {
      console.warn('缓存预热失败:', error)
    }
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear()
    this.pendingRequests.clear()
    console.log('Mint项目缓存已清除')
  }

  /**
   * 获取服务状态
   */
  getStatus(): {
    cacheStats: { 
      size: number
      keys: string[]
      pendingRequests: number
    }
    lastUpdate: number | null
  } {
    const latestRelease = this.getCache<MintReleaseInfo>('mint:latest-release')
    
    return {
      cacheStats: { 
        size: this.cache.size,
        keys: Array.from(this.cache.keys()),
        pendingRequests: this.pendingRequests.size
      },
      lastUpdate: latestRelease ? Date.now() : null
    }
  }

  /**
   * 获取缓存信息
   */
  getCacheInfo(): Array<{
    key: string
    timestamp: number
    expiresAt: number
    isExpired: boolean
    ttl: number
  }> {
    const now = Date.now()
    return Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      timestamp: item.timestamp,
      expiresAt: item.expiresAt,
      isExpired: now > item.expiresAt,
      ttl: Math.max(0, item.expiresAt - now)
    }))
  }
}

// 导出单例实例
export const mintProjectService = new MintProjectService()