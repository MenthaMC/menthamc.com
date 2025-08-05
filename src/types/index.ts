// 动画配置类型
export interface AnimationConfig {
  delay: number
  duration: number
  ease: string
}

// AnimatedTitle组件Props类型
export interface AnimatedTitleProps {
  text?: string
  animationDelay?: number
}

// HeroActions组件Props类型
export interface HeroActionsProps {
  onDownload?: () => void
  onLearnMore?: () => void
}

// HeroActions组件实例类型
export interface HeroActions {
  $el: HTMLElement
}

// 路由配置类型
export interface RouteConfig {
  path: string
  name: string
  component: any
  meta?: {
    title?: string
    requiresAuth?: boolean
  }
}

// 语言配置类型
export interface LanguageConfig {
  code: 'zh-CN' | 'en-US'
  name: string
  flag: string
}
