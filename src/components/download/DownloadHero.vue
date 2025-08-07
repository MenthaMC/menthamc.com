<template>
    <section class="hero-section">
        <div class="hero-container">
            <div class="hero-content">
                <div class="badge-dot"></div>
                <h1 class="hero-title">
                    {{ $t('download.hero.title') }} <span class="brand-name">Mint</span>
                </h1>
                <p class="hero-subtitle">{{ $t('download.hero.subtitle') }}</p>
                <div class="quick-stats">
                    <div class="stat-item">
                        <span class="stat-number">{{ latest_version }}</span>
                        <span class="stat-label">{{ $t('download.stats.versionLabel') }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">{{ file_size }}</span>
                        <span class="stat-label">{{ $t('download.stats.sizeLabel') }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">{{ download_cout }}</span>
                        <span class="stat-label">{{ $t('download.stats.downloadsLabel') }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { token } from '@/main'
import type { GithubRelease, GithubReleases } from '@/types'
import { renderSize } from '@/utils/helpers'
import { callApi } from '@zayne-labs/callapi'
import { onMounted, ref } from 'vue'

const latest_version = ref<string | undefined>()
const file_size = ref<string | undefined>()
const download_cout = ref(0)
const download_cout_buffer = ref(0)

onMounted(async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    // Release
    const totalReleases = '/api/repos/MenthaMC/Mint/releases'
    const totalReleases_call = await callApi<GithubReleases>(totalReleases, {
        signal: controller.signal, headers: {"request_token": token}
    })

    clearTimeout(timeoutId)

    totalReleases_call.data?.forEach((v) => {
        v.assets.forEach((assets) => {
            download_cout_buffer.value = download_cout.value + assets.download_count
        })

        download_cout.value = download_cout_buffer.value
    })

    const release = '/api/repos/MenthaMC/Mint/releases/latest'
    const release_call = await callApi<GithubRelease>(release, { signal: controller.signal })

    clearTimeout(timeoutId)
    latest_version.value = release_call.data?.tag_name.split('-')[0]
    file_size.value = renderSize(release_call.data?.assets[0].size as string)
})
</script>

<style scoped>
.hero-section {
    padding: 180px 0 80px;
    background:
        radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%);
}

.hero-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    text-align: center;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 24px;
    color: #10b981;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 32px;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.hero-title {
    font-size: 4.5rem;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 24px;
    letter-spacing: -0.02em;
    color: #ffffff;
}

.brand-name {
    background: linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-subtitle {
    font-size: 1.5rem;
    color: #94a3b8;
    margin-bottom: 48px;
    font-weight: 300;
}

.quick-stats {
    display: flex;
    justify-content: center;
    gap: 48px;
    margin-top: 48px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #10b981;
}

.stat-label {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 3rem;
    }

    .quick-stats {
        gap: 32px;
    }
}
</style>
