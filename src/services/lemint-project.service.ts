import { BaseProjectService, type ProjectReleaseInfo, type ProjectBranchInfo, type ProjectInfo } from './base-project.service'

// 为了保持向后兼容性，重新导出类型并添加LemonMint前缀
export interface LemonMIntReleaseInfo extends ProjectReleaseInfo {}
export interface LemonMIntBranchInfo extends ProjectBranchInfo {}
export interface LemonMIntProjectInfo extends ProjectInfo {}

export class LemonMIntProjectService extends BaseProjectService {
  constructor() {
    super('MenthaMC', 'LemonMint', 'lemint')
  }

  /**
   * 获取模拟数据作为降级方案
   */
  protected getMockData(cacheKey: string): unknown {
    if (cacheKey === 'lemint:latest-release') {
      return {
        version: '1.0.0',
        buildNumber: '1',
        fileSize: '未知',
        releaseDate: new Date().toLocaleDateString('zh-CN'),
        downloadUrl: 'https://github.com/MenthaMC/LemonMint/releases',
        changelogUrl: 'https://github.com/MenthaMC/LemonMint/releases',
        assets: [{
          name: 'lemint-latest.jar',
          size: 0,
          downloadCount: 0,
          browserDownloadUrl: 'https://github.com/MenthaMC/LemonMint/releases'
        }]
      }
    }
    
    if (cacheKey.startsWith('lemint:all-releases')) {
      return [{
        version: '1.0.0',
        buildNumber: '1',
        fileSize: '未知',
        releaseDate: new Date().toLocaleDateString('zh-CN'),
        downloadUrl: 'https://github.com/MenthaMC/LemonMint/releases',
        changelogUrl: 'https://github.com/MenthaMC/LemonMint/releases',
        assets: [{
          name: 'lemint-latest.jar',
          size: 0,
          downloadCount: 0,
          browserDownloadUrl: 'https://github.com/MenthaMC/LemonMint/releases'
        }]
      }]
    }
    
    return null
  }
}

// 导出单例实例
export const lemintProjectService = new LemonMIntProjectService()