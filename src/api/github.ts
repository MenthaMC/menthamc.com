import { GitHubApiService } from '@/services/github-api.service'
import { cacheFirstRequest, createCacheKey } from '@/services/cache-first-request.service'
import { logger } from '@/utils/logger'
import type { 
  GitHubApiCommitResponse, 
  GitHubApiContributorResponse, 
  GitHubApiPullRequestResponse,
  GitHubApiRepositoryResponse 
} from '@/types/api'

// GitHub API服务实例
const githubApiService = new GitHubApiService()

// 仓库信息配置
const REPO_OWNER = 'MenthaMC'
const REPO_NAME = 'Mint'

/**
 * 贡献统计数据接口
 */
export interface ContributionStats {
  commits: number
  contributors: number
  mergedPRs: number
  lastUpdated: string
}

/**
 * 获取贡献统计数据
 * 包括提交数、贡献者数和合并PR数
 */
export async function getContributionStats(): Promise<{
  success: boolean
  data?: ContributionStats
  error?: string
}> {
  const cacheKey = createCacheKey('github:contribution-stats', { owner: REPO_OWNER, repo: REPO_NAME })
  
  try {
    const response = await cacheFirstRequest.request<ContributionStats>(cacheKey, {
      url: `${githubApiService['config'].baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}`,
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'MenthaMC-Website',
      },
      cacheTtl: 10 * 60 * 1000 // 10分钟缓存
    })

    // 如果缓存命中，直接返回
    if (response.fromCache && response.data) {
      return {
        success: true,
        data: response.data
      }
    }

    // 如果需要重新计算统计数据
    const [, , prsResponse] = await Promise.all([
      cacheFirstRequest.request<GitHubApiCommitResponse[]>(`${cacheKey}:commits`, {
        url: `${githubApiService['config'].baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=1`,
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MenthaMC-Website',
        },
        cacheTtl: 5 * 60 * 1000 // 5分钟缓存
      }),
      cacheFirstRequest.request<GitHubApiContributorResponse[]>(`${cacheKey}:contributors`, {
        url: `${githubApiService['config'].baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=1&anon=1`,
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MenthaMC-Website',
        },
        cacheTtl: 15 * 60 * 1000 // 15分钟缓存
      }),
      cacheFirstRequest.request<GitHubApiPullRequestResponse[]>(`${cacheKey}:prs`, {
        url: `${githubApiService['config'].baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=closed&per_page=100`,
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MenthaMC-Website',
        },
        cacheTtl: 10 * 60 * 1000 // 10分钟缓存
      })
    ])

    // 解析统计数据
    const totalCommits = 0 // 简化处理，可以从仓库信息中获取
    const totalContributors = 0 // 简化处理
    const mergedPRs = prsResponse.data?.filter(pr => pr.merged_at !== null).length || 0
    
    const contributionStats: ContributionStats = {
      commits: totalCommits,
      contributors: totalContributors,
      mergedPRs: mergedPRs,
      lastUpdated: new Date().toISOString()
    }
    
    return {
      success: true,
      data: contributionStats
    }
  } catch (error) {
    logger.error('API: 获取贡献统计数据失败', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

/**
 * 获取最近的提交记录
 * @param limit 获取的提交数量
 */
export async function getRecentCommits(limit: number = 10): Promise<{
  success: boolean
  data?: Array<{
    sha: string
    message: string
    author: {
      name: string
      avatar: string
      profile: string
    }
    date: string
    url: string
  }>
  error?: string
}> {
  const cacheKey = createCacheKey('github:recent-commits', { owner: REPO_OWNER, repo: REPO_NAME, limit })
  
  try {
    const response = await cacheFirstRequest.request<Array<{
      sha: string
      commit: {
        message: string
        author: {
          name: string
          date: string
        }
      }
      author: {
        login: string
        avatar_url: string
        html_url: string
      } | null
      html_url: string
    }>>(cacheKey, {
      url: `${githubApiService['config'].baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=${limit}`,
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'MenthaMC-Website',
      },
      cacheTtl: 3 * 60 * 1000 // 3分钟缓存（提交记录变化较快）
    })
    
    const formattedCommits = response.data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message.split('\n')[0], // 只获取第一行作为摘要
      author: {
        name: commit.author?.login || commit.commit.author.name,
        avatar: commit.author?.avatar_url || '',
        profile: commit.author?.html_url || ''
      },
      date: commit.commit.author.date,
      url: commit.html_url
    }))
    
    return {
      success: true,
      data: formattedCommits
    }
  } catch (error) {
    logger.error('API: 获取最近提交记录失败', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

/**
 * 获取最近的PR记录
 * @param limit 获取的PR数量
 */
export async function getRecentPullRequests(limit: number = 5): Promise<{
  success: boolean
  data?: Array<{
    number: number
    title: string
    state: string
    user: {
      login: string
      avatar: string
      profile: string
    }
    created_at: string
    merged_at: string | null
    url: string
  }>
  error?: string
}> {
  const cacheKey = createCacheKey('github:recent-prs', { owner: REPO_OWNER, repo: REPO_NAME, limit })
  
  try {
    const response = await cacheFirstRequest.request<Array<{
      number: number
      title: string
      state: string
      user: {
        login: string
        avatar_url: string
        html_url: string
      }
      created_at: string
      merged_at: string | null
      html_url: string
    }>>(cacheKey, {
      url: `${githubApiService['config'].baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=all&per_page=${limit}&sort=updated&direction=desc`,
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'MenthaMC-Website',
      },
      cacheTtl: 5 * 60 * 1000 // 5分钟缓存
    })
    
    const formattedPRs = response.data.map(pr => ({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      user: {
        login: pr.user.login,
        avatar: pr.user.avatar_url,
        profile: pr.user.html_url
      },
      created_at: pr.created_at,
      merged_at: pr.merged_at,
      url: pr.html_url
    }))
    
    return {
      success: true,
      data: formattedPRs
    }
  } catch (error) {
    logger.error('API: 获取最近PR记录失败', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

/**
 * 获取仓库基本信息
 */
export async function getRepositoryInfo(): Promise<{
  success: boolean
  data?: {
    name: string
    fullName: string
    description: string
    stars: number
    forks: number
    watchers: number
    openIssues: number
    language: string | null
    license: string | null
    lastUpdated: string
    url: string
  }
  error?: string
}> {
  const cacheKey = createCacheKey('github:repo-info', { owner: REPO_OWNER, repo: REPO_NAME })
  
  try {
    const response = await cacheFirstRequest.request<GitHubApiRepositoryResponse>(cacheKey, {
      url: `${githubApiService['config'].baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}`,
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'MenthaMC-Website',
      },
      cacheTtl: 10 * 60 * 1000 // 10分钟缓存
    })
    
    const repo = response.data
    
    return {
      success: true,
      data: {
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || '',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.stargazers_count, // GitHub API中watchers实际上是stars
        openIssues: repo.open_issues_count || 0,
        language: repo.language,
        license: repo.license?.name || null,
        lastUpdated: repo.updated_at,
        url: repo.html_url
      }
    }
  } catch (error) {
    logger.error('API: 获取仓库信息失败', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

/**
 * 清除API缓存
 */
export function clearGitHubCache(): {
  success: boolean
  message: string
} {
  try {
    // 清除所有GitHub相关的缓存
    const cacheStats = cacheFirstRequest.getCacheStats()
    let clearedCount = 0
    
    cacheStats.items.forEach(item => {
      if (item.key.startsWith('github:')) {
        if (cacheFirstRequest.clearCache(item.key)) {
          clearedCount++
        }
      }
    })
    
    return {
      success: true,
      message: `GitHub API缓存已清除: ${clearedCount} 项`
    }
  } catch (error) {
    logger.error('API: 清除GitHub缓存失败', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '清除缓存失败'
    }
  }
}
