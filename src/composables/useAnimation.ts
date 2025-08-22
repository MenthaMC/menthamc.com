import { nextTick, ref } from 'vue'
import { logger } from '../utils/logger'

// 动画配置接口
interface AnimationConfig {
    delay?: number
    duration?: number
    ease?: string
}

// 默认动画配置
const DEFAULT_CONFIG: AnimationConfig = {
    delay: 0,
    duration: 0.6,
    ease: 'power3.out',
}

export function useAnimation() {
    const isAnimating = ref(false)

    /**
     * 创建淡入动画
     */
    const fadeIn = (
        element: HTMLElement | HTMLElement[],
        config: Partial<AnimationConfig> = {},
    ) => {
        const finalConfig = { ...DEFAULT_CONFIG, ...config }
        
        // 使用CSS动画替代gsap
        const elements = Array.isArray(element) ? element : [element]
        elements.forEach((el, index) => {
            el.style.opacity = '0'
            el.style.transform = 'translateY(30px)'
            el.style.transition = `opacity ${finalConfig.duration}s ${finalConfig.ease}, transform ${finalConfig.duration}s ${finalConfig.ease}`
            
            setTimeout(() => {
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
            }, (finalConfig.delay || 0) * 1000 + index * 100)
        })
        
        return Promise.resolve()
    }

    /**
     * 创建交错动画
     */
    const staggerAnimation = (
        elements: HTMLElement[] | Element[],
        config: Partial<AnimationConfig> & { stagger?: number } = {},
    ) => {
        const finalConfig = { ...DEFAULT_CONFIG, stagger: 0.1, ...config }
        const elementsArray = Array.from(elements) as HTMLElement[]
        
        elementsArray.forEach((el, index) => {
            el.style.opacity = '0'
            el.style.transform = 'translateY(20px) scale(0.9)'
            el.style.transition = `opacity ${finalConfig.duration}s ${finalConfig.ease}, transform ${finalConfig.duration}s ${finalConfig.ease}`
            
            setTimeout(() => {
                el.style.opacity = '1'
                el.style.transform = 'translateY(0) scale(1)'
            }, (finalConfig.delay || 0) * 1000 + index * (finalConfig.stagger || 0.1) * 1000)
        })
        
        return Promise.resolve()
    }

    /**
     * 创建时间线动画
     */
    const createTimeline = (config: Partial<AnimationConfig> = {}) => {
        // 使用config参数避免未使用警告
        logger.debug('Timeline created with config', config)
        
        // 简单的时间线实现
        const timeline = {
            animations: [] as Array<() => Promise<void>>,
            add: function(animation: () => Promise<void>) {
                this.animations.push(animation)
                return this
            },
            play: async function() {
                for (const animation of this.animations) {
                    await animation()
                }
            }
        }
        
        return timeline
    }

    /**
     * 等待下一帧
     */
    const waitForNextTick = () => nextTick()

    return {
        isAnimating,
        fadeIn,
        staggerAnimation,
        createTimeline,
        waitForNextTick,
    }
}
