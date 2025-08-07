import { ref } from 'vue'
import { ANIMATION_CONSTANTS } from '../utils/constants'
import { useAnimation } from './useAnimation'

export function useHeroAnimation() {
    // 响应式引用
    const heroDesc = ref<HTMLElement | null>(null)
    const heroActions = ref<HTMLElement | null>(null)

    // 使用动画composable
    const { createTimeline, waitForNextTick, staggerAnimation } = useAnimation()

    // 动画初始化 - 支持传入子组件的容器引用
    const initAnimation = async (containers?: {
        featureCardsContainer?: HTMLElement
        mainProjectsContainer?: HTMLElement
    }) => {
        await waitForNextTick()

        if (!heroDesc.value || !heroActions.value) {
            console.warn('基础动画元素未找到')
            return
        }

        const tl = createTimeline({ ease: ANIMATION_CONSTANTS.EASE })

        // 描述文字动画
        tl.fromTo(
            heroDesc.value,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: ANIMATION_CONSTANTS.DESC_DURATION,
                delay: ANIMATION_CONSTANTS.DESC_DELAY,
            },
        )

        // 按钮动画
        tl.fromTo(
            heroActions.value,
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: ANIMATION_CONSTANTS.ACTIONS_DURATION,
            },
        )

        // 特性卡片容器动画
        if (containers?.featureCardsContainer) {
            tl.fromTo(
                containers.featureCardsContainer,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: ANIMATION_CONSTANTS.CARDS_DURATION,
                    delay: ANIMATION_CONSTANTS.CARDS_DELAY,
                },
            )

            // 单个特性卡片的交错动画
            const cards = containers.featureCardsContainer.querySelectorAll('.feature-card')
            if (cards.length > 0) {
                staggerAnimation(cards, {
                    duration: 0.25,
                    stagger: 0.05,
                    ease: 'back.out(1.7)',
                    delay: -0.1,
                })
            }
        }

        // 主要项目部分动画
        if (containers?.mainProjectsContainer) {
            tl.fromTo(
                containers.mainProjectsContainer,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.3,
                },
            )

            // 项目卡片的交错动画
            const projectCards = containers.mainProjectsContainer.querySelectorAll('.project-card')
            if (projectCards.length > 0) {
                staggerAnimation(projectCards, {
                    duration: 0.4,
                    stagger: 0.1,
                    ease: 'back.out(1.4)',
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
