import { ref } from 'vue'
import { ANIMATION_CONSTANTS } from '../utils/constants'
import { useAnimation } from './useAnimation'
import { logger } from '../utils/logger'

export function useHeroAnimation() {
    // 响应式引用
    const heroDesc = ref<HTMLElement | null>(null)
    const heroActions = ref<HTMLElement | null>(null)

    // 使用动画composable
    const { fadeIn, waitForNextTick, staggerAnimation } = useAnimation()

    // 动画初始化 - 支持传入子组件的容器引用
    const initAnimation = async (containers?: {
        featureCardsContainer?: HTMLElement
        mainProjectsContainer?: HTMLElement
    }) => {
        await waitForNextTick()

        if (!heroDesc.value || !heroActions.value) {
            logger.warn('基础动画元素未找到')
            return
        }

        // 使用fadeIn动画替代timeline的fromTo方法
        // 描述文字动画
        await fadeIn(heroDesc.value, {
            duration: ANIMATION_CONSTANTS.DESC_DURATION,
            delay: ANIMATION_CONSTANTS.DESC_DELAY,
        })

        // 按钮动画
        await fadeIn(heroActions.value, {
            duration: ANIMATION_CONSTANTS.ACTIONS_DURATION,
        })

        // 特性卡片容器动画
        if (containers?.featureCardsContainer) {
            await fadeIn(containers.featureCardsContainer, {
                duration: ANIMATION_CONSTANTS.CARDS_DURATION,
                delay: ANIMATION_CONSTANTS.CARDS_DELAY,
            })

            // 单个特性卡片的交错动画
            const cards = containers.featureCardsContainer.querySelectorAll('.feature-card')
            if (cards.length > 0) {
                await staggerAnimation(Array.from(cards) as HTMLElement[], {
                    duration: 0.25,
                    stagger: 0.05,
                    delay: -0.1,
                })
            }
        }

        // 主要项目部分动画
        if (containers?.mainProjectsContainer) {
            await fadeIn(containers.mainProjectsContainer, {
                duration: 0.8,
                delay: 0.3,
            })

            // 项目卡片的交错动画
            const projectCards = containers.mainProjectsContainer.querySelectorAll('.project-card')
            if (projectCards.length > 0) {
                await staggerAnimation(Array.from(projectCards) as HTMLElement[], {
                    duration: 0.4,
                    stagger: 0.1,
                    delay: 0.2,
                })
            }
        }
    }

    return {
        heroDesc,
        heroActions,
        initAnimation,
    }
}
