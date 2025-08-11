import { mintProjectService } from '@/services/mint-project.service'

/**
 * 测试MintProjectService的功能
 */
export async function testMintService() {
  console.log('🧪 开始测试 MintProjectService...')
  
  try {
    // 测试获取最新版本
    console.log('📦 测试获取最新版本...')
    const latestRelease = await mintProjectService.getLatestRelease()
    if (latestRelease) {
      console.log('✅ 最新版本获取成功:', {
        version: latestRelease.version,
        buildNumber: latestRelease.buildNumber,
        fileSize: latestRelease.fileSize,
        releaseDate: latestRelease.releaseDate
      })
    } else {
      console.log('❌ 最新版本获取失败')
    }

    // 测试获取所有版本
    console.log('📋 测试获取版本列表...')
    const allReleases = await mintProjectService.getAllReleases(5)
    console.log(`✅ 获取到 ${allReleases.length} 个版本`)
    allReleases.forEach((release, index) => {
      console.log(`  ${index + 1}. Mint ${release.version} (Build #${release.buildNumber}) - ${release.fileSize}`)
    })

    // 测试获取项目信息
    console.log('📊 测试获取项目信息...')
    const projectInfo = await mintProjectService.getProjectInfo()
    if (projectInfo) {
      console.log('✅ 项目信息获取成功:', {
        stars: projectInfo.stats.stars,
        forks: projectInfo.stats.forks,
        repositoryName: projectInfo.repository.name
      })
    } else {
      console.log('❌ 项目信息获取失败')
    }

    // 测试获取下载统计
    console.log('📈 测试获取下载统计...')
    const downloadStats = await mintProjectService.getDownloadStats()
    console.log('✅ 下载统计获取成功:', {
      totalDownloads: downloadStats.totalDownloads,
      releaseCount: Object.keys(downloadStats.releaseDownloads).length
    })

    // 测试服务状态
    console.log('🔍 测试服务状态...')
    const status = mintProjectService.getStatus()
    console.log('✅ 服务状态:', {
      cacheSize: status.cacheStats.size,
      lastUpdate: status.lastUpdate ? new Date(status.lastUpdate).toLocaleString() : '无'
    })

    console.log('🎉 所有测试完成!')
    return true

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
    return false
  }
}

/**
 * 在浏览器控制台中运行测试
 */
export function runTestInConsole() {
  // 将测试函数挂载到全局对象，方便在控制台调用
  if (typeof window !== 'undefined') {
    (window as Window & { testMintService?: typeof testMintService }).testMintService = testMintService
    console.log('💡 在控制台中运行 testMintService() 来测试服务功能')
  }
}
