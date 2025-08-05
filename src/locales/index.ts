import { createI18n } from 'vue-i18n'
import enUS from './en-US'
import zhCN from './zh-CN'

// 获取浏览器语言
const getBrowserLanguage = (): 'zh-CN' | 'en-US' => {
  const language = navigator.language.toLowerCase()
  if (language.startsWith('zh')) {
    return 'zh-CN'
  }
  return 'en-US'
}

// 获取存储的语言或使用浏览器语言
const getStoredLanguage = (): 'zh-CN' | 'en-US' => {
  try {
    const stored = localStorage.getItem('language')
    if (stored === 'zh-CN' || stored === 'en-US') {
      return stored
    }
  } catch (error) {
    console.warn('无法访问localStorage:', error)
  }
  return getBrowserLanguage()
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: getStoredLanguage(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

// 语言切换函数
export const switchLanguage = (locale: 'zh-CN' | 'en-US') => {
  i18n.global.locale.value = locale
  try {
    localStorage.setItem('language', locale)
  } catch (error) {
    console.warn('无法保存语言设置到localStorage:', error)
  }
  document.documentElement.lang = locale
}

// 获取当前语言
export const getCurrentLanguage = (): 'zh-CN' | 'en-US' => {
  const current = i18n.global.locale.value
  return current === 'zh-CN' || current === 'en-US' ? current : 'zh-CN'
}

// 可用语言列表
export const availableLanguages = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' }
]

export default i18n
