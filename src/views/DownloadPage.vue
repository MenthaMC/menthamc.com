<template>
    <div class="download-page">
        <DownloadHero />
        <DownloadOptions />
        <BuildHistory />
    </div>
</template>

<script setup lang="ts">
import BuildHistory from '@/components/download/BuildHistory.vue'
import DownloadHero from '@/components/download/DownloadHero.vue'
import DownloadOptions from '@/components/download/DownloadOptions.vue'
</script>

<style scoped>
.download-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a0f1c 0%, #1a1f2e 50%, #2a2f3e 100%);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
