import gsap from 'gsap'
import { nextTick, ref } from 'vue'
import type { AnimationConfig } from '../types'

// 默认动画配置
const DEFAULT_CONFIG: AnimationConfig = {
  delay: 0,
  duration: 0.6,
  ease: "power3.out"
}

export function useAnimation() {
  const isAnimating = ref(false)

  /**
   * 创建淡入动画
   */
  const fadeIn = (
    element: HTMLElement | HTMLElement[],
    config: Partial<AnimationConfig> = {}
  ) => {
    const finalConfig = { ...DEFAULT_CONFIG, ...config }

    return gsap.fromTo(element,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: finalConfig.duration,
        delay: finalConfig.delay,
        ease: finalConfig.ease
      }
    )
  }

  /**
   * 创建交错动画
   */
  const staggerAnimation = (
    elements: HTMLElement[] | NodeListOf<Element>,
    config: Partial<AnimationConfig> & { stagger?: number } = {}
  ) => {
    const finalConfig = { ...DEFAULT_CONFIG, stagger: 0.1, ...config }

    return gsap.fromTo(elements,
      { opacity: 0, y: 20, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: finalConfig.duration,
        stagger: finalConfig.stagger,
        ease: finalConfig.ease,
        delay: finalConfig.delay
      }
    )
  }

  /**
   * 创建时间线动画
   */
  const createTimeline = (config: Partial<AnimationConfig> = {}) => {
    const finalConfig = { ...DEFAULT_CONFIG, ...config }
    return gsap.timeline({
      defaults: { ease: finalConfig.ease }
    })
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
    waitForNextTick
  }
}
