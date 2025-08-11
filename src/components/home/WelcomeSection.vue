<template>
    <section class="welcome-section">
        <div class="welcome-background">
            <div class="gradient-orb orb-1"></div>
            <div class="gradient-orb orb-2"></div>
            <div class="gradient-orb orb-3"></div>
        </div>

        <div class="welcome-content">
            <div class="welcome-badge"></div>

            <h1 class="welcome-title">
                <span class="title-line">{{ $t('home.welcome.title.line1') }}</span>
                <span class="title-highlight">{{ $t('home.welcome.title.highlight') }}</span>
                <span class="title-line">{{ $t('home.welcome.title.line2') }}</span>
            </h1>

            <p class="welcome-description">
                {{ $t('home.welcome.description') }}
            </p>

            <div class="welcome-actions">
                <button class="action-btn primary" @click="handleGetStarted">
                    <span class="btn-icon">⚡</span>
                    <span>{{ $t('home.welcome.actions.getStarted') }}</span>
                    <span class="btn-arrow">→</span>
                </button>

                <button class="action-btn secondary" @click="handleViewDocs">
                    <span class="btn-icon">📚</span>
                    <span>{{ $t('home.welcome.actions.viewDocs') }}</span>
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { callApi } from '@zayne-labs/callapi'
import type { GithubRepo, TimeSeriesData } from '@/types'

const router = useRouter()

const handleGetStarted = () => {
    router.push('/download')
}

const handleViewDocs = () => {
    window.open('https://menthamc.github.io/docs/', '_blank')
}

const players = ref<undefined | number>()
const stargazers = ref<undefined | number>()

onMounted(async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    // Bstatus
    const bstatus = ['https://bstats.org/api/v1/plugins/26215/charts/players/data']

    const bstatus_promises = bstatus.map((url) =>
        callApi<TimeSeriesData>(url, { signal: controller.signal }).then((response) => {
            if (response.data === null) {
                throw new Error(`Unable to retrieve time series for ${url}`)
            }
            return response.data[response.data.length - 1][1]
        }),
    )

    const bstatus_results = await Promise.all(bstatus_promises)
    clearTimeout(timeoutId)
    players.value = bstatus_results.reduce((total, num) => total + num, 0)

    // Stars
    const repos = [
        '/api/repos/MenthaMC/Mint',
        '/api/repos/MenthaMC/LemonMint',
    ]

    const repos_promises = repos.map((url) =>
        callApi<GithubRepo>(url, { signal: controller.signal }).then((response) => {
            if (response.data === null) {
                throw new Error(`Unable to retrieve time series for ${url}`)
            }
            return response.data.stargazers_count
        }),
    )

    const repos_results = await Promise.all(repos_promises)
    clearTimeout(timeoutId)
    stargazers.value = repos_results.reduce((total, num) => total + num, 0)
})
</script>

<style scoped>
.welcome-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 20px 80px;
    overflow: hidden;
}

.welcome-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
}

.gradient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.6;
    animation: float 6s ease-in-out infinite;
}

.orb-1 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #10b981, #3b82f6);
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.orb-2 {
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    top: 60%;
    right: 15%;
    animation-delay: 2s;
}

.orb-3 {
    width: 150px;
    height: 150px;
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(180deg);
    }
}

.welcome-content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
}

.welcome-title {
    font-size: 4rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 24px;
    animation: slideInUp 0.8s ease-out 0.2s both;
}

.title-line {
    margin-top: 15px;
    display: block;
    color: #ffffff;
}

.title-highlight {
    display: block;
    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
}

.title-highlight::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 4px;
    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
    border-radius: 2px;
    opacity: 0.7;
}

.welcome-description {
    font-size: 1.25rem;
    color: #d1d5db;
    line-height: 1.7;
    margin-bottom: 48px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    animation: slideInUp 0.8s ease-out 0.4s both;
}

.welcome-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 64px;
    animation: slideInUp 0.8s ease-out 0.6s both;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 32px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.action-btn.primary {
    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
    color: white;
    box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
}

.action-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(16, 185, 129, 0.4);
}

.action-btn.primary .btn-arrow {
    transition: transform 0.3s ease;
}

.action-btn.primary:hover .btn-arrow {
    transform: translateX(4px);
}

.action-btn.secondary {
    background: rgba(75, 85, 99, 0.3);
    color: #d1d5db;
    border: 1px solid rgba(75, 85, 99, 0.4);
    backdrop-filter: blur(10px);
}

.action-btn.secondary:hover {
    background: rgba(75, 85, 99, 0.5);
    color: #ffffff;
    transform: translateY(-2px);
}

.stat-divider {
    width: 1px;
    height: 40px;
    background: rgba(75, 85, 99, 0.3);
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .welcome-section {
        padding: 100px 16px 60px;
    }

    .welcome-title {
        font-size: 2.5rem;
    }

    .welcome-description {
        font-size: 1.125rem;
    }

    .welcome-actions {
        flex-direction: column;
        align-items: center;
    }

    .action-btn {
        width: 100%;
        max-width: 280px;
        justify-content: center;
    }

    .stat-number {
        font-size: 1.5rem;
    }

    .gradient-orb {
        filter: blur(40px);
    }

    .orb-1 {
        width: 200px;
        height: 200px;
    }

    .orb-2 {
        width: 150px;
        height: 150px;
    }

    .orb-3 {
        width: 100px;
        height: 100px;
    }
}

@media (max-width: 480px) {
    .welcome-title {
        font-size: 2rem;
    }

    .welcome-description {
        font-size: 1rem;
    }

    .welcome-stats {
        flex-direction: column;
        gap: 16px;
    }

    .stat-divider {
        width: 40px;
        height: 1px;
    }
}
</style>
