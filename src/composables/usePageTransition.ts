import { ref, nextTick } from 'vue'
import { useAnimation } from './useAnimation'

export function usePageTransition() {
    const isTransitioning = ref(false)
    const { staggerAnimation } = useAnimation()

    /**
     * 页面进入动画
     */
    const pageEnter = async (element: HTMLElement) => {
        isTransitioning.value = true
        
        // 设置初始状态
        element.style.opacity = '0'
        element.style.transform = 'translateY(20px)'
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'
        
        await nextTick()
        
        // 执行进入动画
        element.style.opacity = '1'
        element.style.transform = 'translateY(0)'
        
        // 为页面内的元素添加交错动画
        const animatedElements = element.querySelectorAll('[data-animate]')
        if (animatedElements.length > 0) {
            setTimeout(() => {
                staggerAnimation(Array.from(animatedElements) as HTMLElement[], {
                    duration: 0.5,
                    stagger: 0.1,
                    delay: 0.2
                })
            }, 100)
        }
        
        setTimeout(() => {
            isTransitioning.value = false
        }, 600)
    }

    /**
     * 页面离开动画
     */
    const pageLeave = async (element: HTMLElement) => {
        isTransitioning.value = true
        
        element.style.transition = 'opacity 0.3s ease-in, transform 0.3s ease-in'
        element.style.opacity = '0'
        element.style.transform = 'translateY(-10px)'
        
        return new Promise(resolve => {
            setTimeout(() => {
                isTransitioning.value = false
                resolve(void 0)
            }, 300)
        })
    }

    /**
     * 滚动触发动画
     */
    const setupScrollAnimations = (container: HTMLElement) => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target as HTMLElement
                        
                        // 添加进入视口的动画
                        element.style.opacity = '1'
                        element.style.transform = 'translateY(0)'
                        
                        // 移除观察
                        observer.unobserve(element)
                    }
                })
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        )

        // 观察所有带有 data-scroll-animate 属性的元素
        const scrollElements = container.querySelectorAll('[data-scroll-animate]')
        scrollElements.forEach(element => {
            const el = element as HTMLElement
            // 设置初始状态
            el.style.opacity = '0'
            el.style.transform = 'translateY(30px)'
            el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out'
            
            observer.observe(el)
        })

        return observer
    }

    /**
     * 悬停动画效果
     */
    const addHoverAnimations = (container: HTMLElement) => {
        const hoverElements = container.querySelectorAll('[data-hover-animate]')
        
        hoverElements.forEach(element => {
            const el = element as HTMLElement
            el.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease'
            
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'translateY(-5px) scale(1.02)'
                el.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)'
            })
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translateY(0) scale(1)'
                el.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)'
            })
        })
    }

    /**
     * 按钮点击动画
     */
    const addClickAnimations = (container: HTMLElement) => {
        const clickElements = container.querySelectorAll('[data-click-animate]')
        
        clickElements.forEach(element => {
            const el = element as HTMLElement
            
            el.addEventListener('click', () => {
                el.style.transform = 'scale(0.95)'
                
                setTimeout(() => {
                    el.style.transform = 'scale(1)'
                }, 150)
            })
        })
    }

    return {
        isTransitioning,
        pageEnter,
        pageLeave,
        setupScrollAnimations,
        addHoverAnimations,
        addClickAnimations
    }
}