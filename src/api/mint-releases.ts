import { mintProjectService } from '@/services/mint-project.service'
import { logger } from '@/utils/logger'
import type { MintReleaseInfo, MintProjectInfo } from '@/services/mint-project.service'

/**
 * API路由处理函数 - 获取最新版本
 */
export async function getLatestRelease(): Promise<{
  success: boolean
  data?: MintReleaseInfo
  error?: string
}> {
  try {
    const release = await mintProjectService.getLatestRelease()
    
    if (release) {
      return {
        success: true,
        data: release
      }
    } else {
      return {
        success: false,
        error: '无法获取最新版本信息'
      }
    }
  } catch (error) {
    logger.error('API: 获取最新版本失败', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

/**
 * API路由处理函数 - 获取所有版本
 */
export async function getAllReleases(limit: number = 10): Promise<{
  success: boolean
  data?: MintReleaseInfo[]
  error?: string
}> {
  try {
    const releases = await mintProjectService.getAllReleases(limit)
    
    return {
      success: true,
      data: releases
    }
  } catch (error) {
    logger.error('API: 获取所有版本失败', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

/**
 * API路由处理函数 - 获取项目完整信息
 */
export async function getProjectInfo(): Promise<{
  success: boolean
  data?: MintProjectInfo
  error?: string
}> {
  try {
    const projectInfo = await mintProjectService.getProjectInfo()
    
    if (projectInfo) {
      return {
        success: true,
        data: projectInfo
      }
    } else {
      return {
        success: false,
        error: '无法获取项目信息'
      }
    }
  } catch (error) {
    logger.error('API: 获取项目信息失败', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

/**
 * API路由处理函数 - 获取下载统计
 */
export async function getDownloadStats(): Promise<{
  success: boolean
  data?: { totalDownloads: number; releaseDownloads: Record<string, number> }
  error?: string
}> {
  try {
    const stats = await mintProjectService.getDownloadStats()
    
    return {
      success: true,
      data: stats
    }
  } catch (error) {
    logger.error('API: 获取下载统计失败', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

/**
 * API路由处理函数 - 清除缓存
 */
export async function clearCache(): Promise<{
  success: boolean
  message: string
}> {
  try {
    mintProjectService.clearCache()
    
    return {
      success: true,
      message: '缓存已清除'
    }
  } catch (error) {
    logger.error('API: 清除缓存失败', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '清除缓存失败'
    }
  }
}

/**
 * API路由处理函数 - 获取服务状态
 */
export async function getServiceStatus(): Promise<{
  success: boolean
  data?: {
    isHealthy: boolean
    lastUpdate: string
    cacheSize: number
    [key: string]: unknown
  }
  error?: string
}> {
  try {
    const status = mintProjectService.getStatus()
    
    return {
      success: true,
      data: status
    }
  } catch (error) {
    logger.error('API: 获取服务状态失败', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}
