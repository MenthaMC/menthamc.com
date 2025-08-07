import { useRouter } from 'vue-router'

export function useHeroEvents() {
    const router = useRouter()

    // 事件处理
    const handleDownload = () => {
        console.log('Hero区域：开始下载')
        // 跳转到下载页面
        router.push('/download')
    }

    const handleLearnMore = () => {
        console.log('Hero区域：了解更多')
        // 滚动到特性卡片区域
        const featuresSection = document.querySelector('.features-section')
        if (featuresSection) {
            featuresSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
    }

    return {
        handleDownload,
        handleLearnMore,
    }
}
