/**
 * API相关类型定义
 */

// GitHub API 响应类型
export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  owner: GitHubUser
  private: boolean
  html_url: string
  description: string | null
  fork: boolean
  created_at: string
  updated_at: string
  pushed_at: string
  clone_url: string
  size: number
  stargazers_count: number
  watchers_count: number
  language: string | null
  forks_count: number
  open_issues_count: number
  default_branch: string
  topics: string[]
  license: {
    key: string
    name: string
    spdx_id: string
    url: string | null
  } | null
}

export interface GitHubRelease {
  id: number
  tag_name: string
  target_commitish: string
  name: string
  body: string
  draft: boolean
  prerelease: boolean
  created_at: string
  published_at: string
  author: GitHubUser
  assets: GitHubAsset[]
  html_url: string
}

export interface GitHubAsset {
  id: number
  name: string
  label: string | null
  content_type: string
  size: number
  download_count: number
  created_at: string
  updated_at: string
  browser_download_url: string
}

export interface GitHubCommit {
  sha: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    committer: {
      name: string
      email: string
      date: string
    }
    message: string
    tree: {
      sha: string
      url: string
    }
    url: string
    comment_count: number
  }
  url: string
  html_url: string
  author: GitHubUser | null
  committer: GitHubUser | null
  parents: Array<{
    sha: string
    url: string
    html_url: string
  }>
}

export interface GitHubBranch {
  name: string
  commit: {
    sha: string
    url: string
  }
  protected: boolean
}

// 项目特定类型
export interface MintReleaseInfo {
  version: string
  tagName: string
  publishedAt: string
  downloadUrl: string
  fileSize: string
  changelog: string
  changelogUrl: string
  isPrerelease: boolean
  commitInfo: {
    sha: string
    shortMessage: string
    author: string
    date: string
  }
  assets: Array<{
    name: string
    size: number
    downloadUrl: string
    downloadCount: number
  }>
}

export interface BranchInfo {
  name: string
  displayName: string
  description: string
  status: 'stable' | 'beta' | 'alpha' | 'development' | 'default'
  commit: string
  protected: boolean
  hasRelease: boolean
  downloadUrl?: string
  fileSize?: string
}

// API响应包装类型
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

// 缓存相关类型
export interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
  headers?: Record<string, string>
}

export interface CacheFirstResponse<T> {
  data: T
  fromCache: boolean
  error?: string
  timestamp: number
}

// 请求配置类型
export interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: string | FormData | URLSearchParams
  timeout?: number
  cacheTtl?: number
}

// 错误类型
export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: Record<string, unknown>
  timestamp: Date
}

// GitHub API 特定响应类型
export interface GitHubApiCommitResponse {
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
}

export interface GitHubApiContributorResponse {
  login: string
  id: number
  avatar_url: string
  html_url: string
  contributions: number
}

export interface GitHubApiPullRequestResponse {
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
}

export interface GitHubApiRepositoryResponse {
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
  license: {
    name: string
  } | null
  updated_at: string
  html_url: string
  default_branch: string
}

// 缓存统计类型
export interface CacheStats {
  size: number
  maxSize: number
  items: Array<{
    key: string
    timestamp: number
    ttl: number
  }>
}

// 项目信息类型
export interface MintProjectInfo {
  name: string
  description: string
  repository: GitHubRepository
  latestRelease: MintReleaseInfo | null
  branches: BranchInfo[]
  stats: {
    stars: number
    forks: number
    issues: number
    contributors: number
  }
}

// 下载统计类型
export interface DownloadStats {
  totalDownloads: number
  releaseDownloads: Record<string, number>
}

// 服务状态类型
export interface ServiceStatus {
  isHealthy: boolean
  lastUpdate: string
  cacheSize: number
  [key: string]: unknown
}
