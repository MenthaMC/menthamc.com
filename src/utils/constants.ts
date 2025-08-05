// 应用常量
export const APP_CONFIG = {
  name: 'MenthaMC',
  version: '1.0.0',
  defaultLanguage: 'zh-CN',
  github: 'https://github.com/MenthaMC'
} as const

// 动画常量
export const ANIMATION_CONSTANTS = {
  TITLE_TEXT: 'MenthaMC',
  CHAR_DELAY: 0.03,
  DESC_DELAY: 0.1,
  DESC_DURATION: 0.3,
  ACTIONS_DURATION: 0.25,
  CARDS_DELAY: 0.05,
  CARDS_DURATION: 0.35,
  EASE: "power3.out"
} as const

// 语言配置
export const LANGUAGE_CONFIG = {
  'zh-CN': {
    name: '简体中文',
    flag: '🇨🇳'
  },
  'en-US': {
    name: 'English',
    flag: '🇺🇸'
  }
} as const

// 导航链接
export const NAVIGATION_LINKS = [
  { key: 'home', href: '#' },
  { key: 'download', href: '#' },
  { key: 'docs', href: '#' },
  { key: 'community', href: '#' }
] as const
