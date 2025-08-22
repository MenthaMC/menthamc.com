import { BaseProjectService, type ProjectReleaseInfo, type ProjectBranchInfo, type ProjectInfo } from './base-project.service'

// 为了保持向后兼容性，重新导出类型并添加Mint前缀
export interface MintReleaseInfo extends ProjectReleaseInfo {}
export interface MintBranchInfo extends ProjectBranchInfo {}
export interface MintProjectInfo extends ProjectInfo {}

export class MintProjectService extends BaseProjectService {
  constructor() {
    super('MenthaMC', 'Mint', 'mint')
  }

  /**
   * 获取模拟数据作为降级方案
   */
  protected getMockData(cacheKey: string): unknown {
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
}

// 导出单例实例
export const mintProjectService = new MintProjectService()