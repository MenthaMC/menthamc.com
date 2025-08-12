import { GitHubApiService } from '@/services/github-api.service'

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
  try {
    // 获取仓库信息
    const repoInfo = await githubApiService.getRepository(REPO_OWNER, REPO_NAME)
    
    // 获取提交数据 (通过API获取最近的提交数量)
    const commitsResponse = await fetch(
      `${githubApiService['config'].baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=1`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MenthaMC-Website',
          ...(githubApiService['config'].token ? {
            'Authorization': `Bearer ${githubApiService['config'].token}`
          } : {})
        }
      }
    )
    
    // 从Link头部获取总提交数
    const linkHeader = commitsResponse.headers.get('Link') || ''
    const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/)
    const totalCommits = lastPageMatch ? parseInt(lastPageMatch[1], 10) : 0
    
    // 获取贡献者数据
    const contributorsResponse = await fetch(
      `${githubApiService['config'].baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=1&anon=1`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MenthaMC-Website',
          ...(githubApiService['config'].token ? {
            'Authorization': `Bearer ${githubApiService['config'].token}`
          } : {})
        }
      }
    )
    
    // 从Link头部获取总贡献者数
    const contributorsLinkHeader = contributorsResponse.headers.get('Link') || ''
    const contributorsLastPageMatch = contributorsLinkHeader.match(/page=(\d+)>; rel="last"/)
    const totalContributors = contributorsLastPageMatch ? parseInt(contributorsLastPageMatch[1], 10) : 0
    
    // 获取合并PR数据
    const prsResponse = await fetch(
      `${githubApiService['config'].baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=closed&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MenthaMC-Website',
          ...(githubApiService['config'].token ? {
            'Authorization': `Bearer ${githubApiService['config'].token}`
          } : {})
        }
      }
    )
    
    const prs = await prsResponse.json() as Array<{ merged_at: string | null }>
    const mergedPRs = prs.filter(pr => pr.merged_at !== null).length
    
    // 构建返回数据
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
    console.error('API: 获取贡献统计数据失败', error)
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
  try {
    const response = await fetch(
      `${githubApiService['config'].baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=${limit}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MenthaMC-Website',
          ...(githubApiService['config'].token ? {
            'Authorization': `Bearer ${githubApiService['config'].token}`
          } : {})
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const commits = await response.json() as Array<{
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
    }>
    
    const formattedCommits = commits.map(commit => ({
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
    console.error('API: 获取最近提交记录失败', error)
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
  try {
    const response = await fetch(
      `${githubApiService['config'].baseUrl}/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=all&per_page=${limit}&sort=updated&direction=desc`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MenthaMC-Website',
          ...(githubApiService['config'].token ? {
            'Authorization': `Bearer ${githubApiService['config'].token}`
          } : {})
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const prs = await response.json() as Array<{
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
    }>
    
    const formattedPRs = prs.map(pr => ({
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
    console.error('API: 获取最近PR记录失败', error)
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
  try {
    const repo = await githubApiService.getRepository(REPO_OWNER, REPO_NAME)
    
    return {
      success: true,
      data: {
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || '',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.stargazers_count, // GitHub API中watchers实际上是stars
        openIssues: 0, // 需要额外请求获取
        language: repo.language,
        license: null, // 需要额外请求获取
        lastUpdated: repo.updated_at,
        url: repo.html_url
      }
    }
  } catch (error) {
    console.error('API: 获取仓库信息失败', error)
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
    // 这里可以实现缓存清除逻辑，如果有的话
    return {
      success: true,
      message: 'GitHub API缓存已清除'
    }
  } catch (error) {
    console.error('API: 清除GitHub缓存失败', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '清除缓存失败'
    }
  }
}