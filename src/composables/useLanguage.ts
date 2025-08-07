import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { availableLanguages, getCurrentLanguage, switchLanguage } from '../locales'

export function useLanguage() {
    const { t, locale } = useI18n()

    // 当前语言
    const currentLanguage = computed(() => getCurrentLanguage())

    // 可用语言列表
    const languages = computed(() => availableLanguages)

    // 切换语言
    const changeLanguage = (langCode: 'zh-CN' | 'en-US') => {
        switchLanguage(langCode)
    }

    // 获取当前语言的显示名称
    const currentLanguageName = computed(() => {
        const current = languages.value.find((lang) => lang.code === currentLanguage.value)
        return current?.name || '简体中文'
    })

    // 获取当前语言的旗帜
    const currentLanguageFlag = computed(() => {
        const current = languages.value.find((lang) => lang.code === currentLanguage.value)
        return current?.flag || '🇨🇳'
    })

    // 判断是否为中文
    const isChinese = computed(() => currentLanguage.value === 'zh-CN')

    // 判断是否为英文
    const isEnglish = computed(() => currentLanguage.value === 'en-US')

    return {
        t,
        locale,
        currentLanguage,
        languages,
        changeLanguage,
        currentLanguageName,
        currentLanguageFlag,
        isChinese,
        isEnglish,
    }
}
