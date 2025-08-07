<template>
    <div class="main-projects-section" ref="mainProjectsContainer">
        <h2 class="projects-title">{{ $t('home.projects.title') }}</h2>
        <div class="projects-grid">
            <ProjectCard
                v-for="project in projects"
                :key="project.title"
                :title="project.title"
                :description="project.description"
                :stats="project.stats"
                :github-url="project.githubUrl"
                :featured="project.featured"
                @detail="handleProjectDetail"
                @github="handleGitHub"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProjectCard from './ProjectCard.vue'

// 模板引用
const mainProjectsContainer = ref<HTMLElement>()

// 路由和国际化
const router = useRouter()
const { t } = useI18n()

// 项目数据 - 使用计算属性以支持响应式翻译
const projects = computed(() => [
    {
        title: t('home.projects.items.mint.title'),
        description: t('home.projects.items.mint.description'),
        stats: t('home.projects.items.mint.stats'),
        githubUrl: 'https://github.com/MenthaMC/Mint',
        featured: true,
    },
    {
        title: t('home.projects.items.lemonMint.title'),
        description: t('home.projects.items.lemonMint.description'),
        stats: t('home.projects.items.lemonMint.stats'),
        githubUrl: 'https://github.com/MenthaMC/LemonMint',
        featured: false,
    },
])

// 事件处理函数
const handleProjectDetail = (projectType: string) => {
    console.log(t('home.projects.actions.viewDetail') + ':', projectType)
    // 可以根据项目类型跳转到不同的详情页面
    // 这里暂时跳转到下载页面
    router.push('/download')
}

const handleGitHub = (url: string) => {
    console.log(t('home.projects.actions.github') + ':', url)
    window.open(url, '_blank')
}

// 暴露给父组件的引用
defineExpose({
    mainProjectsContainer,
})
</script>

<script lang="ts">
export default {
    name: 'ProjectGrid',
}
</script>

<style scoped>
.main-projects-section {
    margin-top: 120px;
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-projects-section.animate {
    opacity: 1;
    transform: translateY(0);
}

.projects-title {
    font-size: 48px;
    font-weight: 800;
    text-align: center;
    margin-bottom: 60px;
    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
}

.projects-title::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
    border-radius: 2px;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 32px;
    max-width: 1200px;
    margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .main-projects-section {
        margin-top: 80px;
    }

    .projects-title {
        font-size: 32px;
        margin-bottom: 40px;
    }

    .projects-grid {
        grid-template-columns: 1fr;
        gap: 24px;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .projects-title {
        font-size: 40px;
    }

    .projects-grid {
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 28px;
    }
}

@media (min-width: 1025px) {
    .projects-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
