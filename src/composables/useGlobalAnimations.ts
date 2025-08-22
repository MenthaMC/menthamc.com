import { onMounted, onUnmounted } from 'vue'
import { usePageTransition } from './usePageTransition'

export function useGlobalAnimations() {
    const { setupScrollAnimations, addHoverAnimations, addClickAnimations } = usePageTransition()
    let scrollObserver: IntersectionObserver | null = null
    let ticking = false
    // let animationFrameId: number | null = null // 暂时不需要

    /**
     * 初始化全局动画
     */
    const initGlobalAnimations = () => {
        // 为当前页面设置动画
        const pageElement = document.body
        if (pageElement) {
            scrollObserver = setupScrollAnimations(pageElement)
            addHoverAnimations(pageElement)
            addClickAnimations(pageElement)
        }

        // 添加页面加载动画
        addPageLoadAnimation()
        
        // 添加滚动优化
        addScrollOptimization()
        
        // 添加性能监控
        addPerformanceOptimization()
        
        // 添加视差滚动效果
        addParallaxEffect()
        
        // 添加鼠标跟随效果
        addMouseFollowEffect()
        
        // 添加页面切换动画
        addPageTransitionEffects()
        
        // 添加元素进入动画
        addElementEnterAnimations()
        
        // 添加背景动画
        addBackgroundAnimations()
    }

    /**
     * 页面加载动画
     */
    const addPageLoadAnimation = () => {
        const body = document.body
        body.style.opacity = '0'
        body.style.transform = 'translateY(20px)'
        body.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'
        
        setTimeout(() => {
            body.style.opacity = '1'
            body.style.transform = 'translateY(0)'
        }, 100)
    }

    /**
     * 滚动优化
     */
    const addScrollOptimization = () => {
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // 滚动时的性能优化
                    // const scrollY = window.scrollY // 暂时不需要
                    const elements = document.querySelectorAll('[data-scroll-animate]')
                    
                    elements.forEach(element => {
                        const rect = element.getBoundingClientRect()
                        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
                        
                        if (isVisible && !element.classList.contains('animate-in')) {
                            element.classList.add('animate-in')
                        }
                    })
                    
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        
        // 初始检查
        handleScroll()
        
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }

    /**
     * 性能优化
     */
    const addPerformanceOptimization = () => {
        // 减少动画在低性能设备上的影响
        const isLowPerformance = () => {
            return navigator.hardwareConcurrency <= 2 || 
                   (navigator as Navigator & { deviceMemory?: number }).deviceMemory <= 2 ||
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches
        }

        if (isLowPerformance()) {
            document.documentElement.classList.add('reduced-animations')
        }

        // 页面可见性API优化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.documentElement.classList.add('animations-paused')
            } else {
                document.documentElement.classList.remove('animations-paused')
            }
        })
    }

    /**
     * 添加页面切换动画
     */
    const addPageTransitionEffects = () => {
        // 页面切换时的淡入淡出效果
        const addPageFadeEffect = () => {
            const pageElements = document.querySelectorAll('[data-page-transition]')
            pageElements.forEach(element => {
                const el = element as HTMLElement
                el.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out'
            })
        }
        
        addPageFadeEffect()
    }

    /**
     * 添加元素进入动画
     */
    const addElementEnterAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target as HTMLElement
                    const animationType = element.getAttribute('data-enter-animation') || 'fadeInUp'
                    
                    element.classList.add('animate-in', animationType)
                    observer.unobserve(element)
                }
            })
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        })

        // 观察所有带有进入动画属性的元素
        const animatedElements = document.querySelectorAll('[data-enter-animation]')
        animatedElements.forEach(element => observer.observe(element))
        
        return observer
    }

    /**
     * 添加背景动画
     */
    const addBackgroundAnimations = () => {
        // 添加动态背景粒子
        const createFloatingParticles = () => {
            const particleContainer = document.querySelector('.floating-particles-container')
            if (!particleContainer) return

            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div')
                particle.className = 'floating-particle'
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 4 + 2}px;
                    height: ${Math.random() * 4 + 2}px;
                    background: rgba(16, 185, 129, ${Math.random() * 0.5 + 0.2});
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: floatUp ${Math.random() * 10 + 15}s linear infinite;
                    animation-delay: ${Math.random() * 5}s;
                `
                particleContainer.appendChild(particle)
            }
        }

        // 添加渐变背景动画
        const addGradientAnimation = () => {
            const gradientElements = document.querySelectorAll('[data-gradient-animation]')
            gradientElements.forEach(element => {
                const el = element as HTMLElement
                el.style.backgroundSize = '400% 400%'
                el.style.animation = 'gradientShift 15s ease infinite'
            })
        }

        createFloatingParticles()
        addGradientAnimation()
    }

    /**
     * 添加视差滚动效果
     */
    const addParallaxEffect = () => {
        const parallaxElements = document.querySelectorAll('[data-parallax]')
        
        const handleParallax = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY
                    
                    parallaxElements.forEach(element => {
                        const speed = parseFloat(element.getAttribute('data-parallax') || '0.5')
                        const yPos = -(scrollY * speed)
                        const el = element as HTMLElement
                        el.style.transform = `translateY(${yPos}px)`
                    })
                    
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', handleParallax, { passive: true })
        
        return () => {
            window.removeEventListener('scroll', handleParallax)
        }
    }

    /**
     * 添加鼠标跟随效果
     */
    const addMouseFollowEffect = () => {
        const followElements = document.querySelectorAll('[data-mouse-follow]')
        
        const handleMouseMove = (e: MouseEvent) => {
            followElements.forEach(element => {
                const rect = element.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                
                const deltaX = (e.clientX - centerX) * 0.1
                const deltaY = (e.clientY - centerY) * 0.1
                
                const el = element as HTMLElement
                el.style.transform = `translate(${deltaX}px, ${deltaY}px)`
            })
        }

        document.addEventListener('mousemove', handleMouseMove, { passive: true })
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
        }
    }

    /**
     * 清理动画
     */
    const cleanup = () => {
        if (scrollObserver) {
            scrollObserver.disconnect()
        }
        
        // 移除所有事件监听器
        window.removeEventListener('scroll', () => {})
        document.removeEventListener('mousemove', () => {})
        document.removeEventListener('visibilitychange', () => {})
    }

    // 自动初始化和清理
    onMounted(() => {
        initGlobalAnimations()
    })

    onUnmounted(() => {
        cleanup()
    })

    return {
        initGlobalAnimations,
        addPageLoadAnimation,
        addScrollOptimization,
        addPerformanceOptimization,
        addParallaxEffect,
        addMouseFollowEffect,
        cleanup
    }
}