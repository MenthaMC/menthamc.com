<template>
    <section class="history-section">
        <div class="history-container">
            <div class="section-header">
                <h2>{{ $t('download.history.title') }}</h2>
                <p>{{ $t('download.history.description') }}</p>
            </div>

            <div class="history-timeline">
                <div
                    v-for="(build, index) in buildHistory"
                    :key="build.id"
                    class="timeline-item"
                    :class="{ latest: index === 0 }"
                >
                    <div class="timeline-marker">
                        <div class="marker-dot"></div>
                        <div v-if="index !== buildHistory.length - 1" class="marker-line"></div>
                    </div>

                    <div class="timeline-content">
                        <div class="build-header">
                            <div class="build-info">
                                <h3 class="build-title">
                                    {{ $t('download.history.buildNumber') }}{{ build.number }}
                                </h3>
                                <div class="build-meta">
                                    <span class="build-date">{{ build.date }}</span>
                                    <span class="build-author">by {{ build.author }}</span>
                                </div>
                            </div>
                            <div class="build-status" :class="build.status">
                                {{ getStatusText(build.status) }}
                            </div>
                        </div>

                        <div class="build-description">
                            <p>{{ build.description }}</p>
                        </div>

                        <div class="build-changes">
                            <div class="change-stats">
                                <span class="stat additions">+{{ build.additions }}</span>
                                <span class="stat deletions">-{{ build.deletions }}</span>
                                <span class="stat files">{{
                                    $t('download.history.filesCount', { count: build.files })
                                }}</span>
                            </div>
                        </div>

                        <div class="build-actions">
                            <button class="action-btn primary" @click="downloadBuild(build)">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7,10 12,15 17,10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                {{ $t('download.history.actions.download') }}
                            </button>
                            <button class="action-btn secondary" @click="viewChangelog(build)">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                    />
                                    <polyline points="14,2 14,8 20,8" />
                                </svg>
                                {{ $t('download.history.actions.changelog') }}
                            </button>
                            <button class="action-btn secondary" @click="viewCommit(build)">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12,6 12,12 16,14" />
                                </svg>
                                {{ build.hash }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 构建历史数据
const buildHistory = ref([
    {
        id: 1,
        number: '95',
        date: '2024-01-15',
        author: 'DF-Plugin',
        description: '安全更新和性能优化，修复了多个关键漏洞，提升了服务器稳定性',
        hash: 'b04ebcb',
        status: 'stable',
        additions: 156,
        deletions: 43,
        files: 12,
    },
    {
        id: 2,
        number: '82',
        date: '2024-01-10',
        author: 'DF-Plugin',
        description: '修复了 optimized-sun-burn 空指针异常问题 (#478)',
        hash: 'f553c53',
        status: 'stable',
        additions: 89,
        deletions: 21,
        files: 8,
    },
    {
        id: 3,
        number: '76',
        date: '2024-01-05',
        author: 'DF-Plugin',
        description: '修复了 tickChunks 中的空指针异常，提升了区块处理性能',
        hash: '290b140',
        status: 'stable',
        additions: 67,
        deletions: 15,
        files: 5,
    },
    {
        id: 4,
        number: '71',
        date: '2023-12-28',
        author: 'DF-Plugin',
        description: '更新到最新的 Paper 变更，同步上游修复',
        hash: 'a1b2c3d',
        status: 'legacy',
        additions: 234,
        deletions: 78,
        files: 18,
    },
    {
        id: 5,
        number: '68',
        date: '2023-12-20',
        author: 'DF-Plugin',
        description: '优化区块加载性能，减少内存占用',
        hash: 'e4f5g6h',
        status: 'legacy',
        additions: 123,
        deletions: 56,
        files: 9,
    },
])

// 方法
const getStatusText = (status: string) => {
    return t(`download.history.status.${status}`)
}

const downloadBuild = (build: any) => {
    console.log(t('download.history.console.downloadBuild') + build.number)
}

const viewChangelog = (build: any) => {
    console.log(
        t('download.history.console.viewChangelog') +
            build.number +
            t('download.history.console.changelogSuffix'),
    )
}

const viewCommit = (build: any) => {
    console.log(t('download.history.console.viewCommit') + build.hash)
}
</script>

<style scoped>
.history-section {
    padding: 80px 0;
    background: rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
}

.history-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 24px;
}

/* 标题动画 */
.section-header {
    text-align: center;
    margin-bottom: 64px;
    animation: headerSlideIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(30px);
}

@keyframes headerSlideIn {
    0% {
        opacity: 0;
        transform: translateY(50px) scale(0.9);
        filter: blur(10px);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0px);
    }
}

.section-header h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 16px;
    color: #ffffff;
    background: linear-gradient(135deg, #ffffff 0%, #10b981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: titleGlow 3s ease-in-out infinite alternate;
}

@keyframes titleGlow {
    0% {
        filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.3));
    }
    100% {
        filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.6));
    }
}

.section-header p {
    font-size: 1.1rem;
    color: #94a3b8;
    animation: subtitleFadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.3s;
    opacity: 0;
}

@keyframes subtitleFadeIn {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 时间线动画 */
.history-timeline {
    position: relative;
}

.timeline-item {
    display: flex;
    gap: 24px;
    margin-bottom: 48px;
    position: relative;
    animation: timelineItemSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateX(-50px);
}

.timeline-item:nth-child(1) { animation-delay: 0.1s; }
.timeline-item:nth-child(2) { animation-delay: 0.15s; }
.timeline-item:nth-child(3) { animation-delay: 0.2s; }
.timeline-item:nth-child(4) { animation-delay: 0.25s; }
.timeline-item:nth-child(5) { animation-delay: 0.3s; }

@keyframes timelineItemSlideIn {
    0% {
        opacity: 0;
        transform: translateX(-80px) rotateY(-15deg);
        filter: blur(5px);
    }
    100% {
        opacity: 1;
        transform: translateX(0) rotateY(0deg);
        filter: blur(0px);
    }
}

.timeline-item.latest .timeline-content {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.05);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
    animation: latestGlow 2s ease-in-out infinite alternate;
}

@keyframes latestGlow {
    0% {
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
    }
    100% {
        box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
    }
}

/* 时间线标记动画 */
.timeline-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
}

.marker-dot {
    width: 16px;
    height: 16px;
    background: #10b981;
    border-radius: 50%;
    border: 4px solid rgba(16, 185, 129, 0.2);
    box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
    animation: dotPulse 2s ease-in-out infinite;
    position: relative;
}

@keyframes dotPulse {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
    }
    50% {
        transform: scale(1.1);
        box-shadow: 0 0 25px rgba(16, 185, 129, 0.6);
    }
}

.marker-dot::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: rgba(16, 185, 129, 0.2);
    animation: ripple 2s ease-out infinite;
}

@keyframes ripple {
    0% {
        transform: scale(0.8);
        opacity: 1;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

.marker-line {
    width: 2px;
    height: 48px;
    background: linear-gradient(to bottom, #10b981, rgba(16, 185, 129, 0.3));
    margin-top: 8px;
    animation: lineGrow 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.5s;
    transform: scaleY(0);
    transform-origin: top;
}

@keyframes lineGrow {
    0% {
        transform: scaleY(0);
        opacity: 0;
    }
    100% {
        transform: scaleY(1);
        opacity: 1;
    }
}

/* 时间线内容动画 */
.timeline-content {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 24px;
    backdrop-filter: blur(10px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.timeline-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
    transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-content:hover {
    border-color: rgba(16, 185, 129, 0.4);
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(8px) translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.timeline-content:hover::before {
    left: 100%;
}

/* 构建头部动画 */
.build-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.build-info {
    flex: 1;
}

.build-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 8px 0;
    animation: titleSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.3s;
    opacity: 0;
    transform: translateX(-20px);
}

@keyframes titleSlideIn {
    0% {
        opacity: 0;
        transform: translateX(-30px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

.build-meta {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: #64748b;
    animation: metaFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.5s;
    opacity: 0;
}

@keyframes metaFadeIn {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.build-date {
    color: #94a3b8;
    transition: color 0.3s ease;
}

.build-author {
    color: #64748b;
    transition: color 0.3s ease;
}

.timeline-content:hover .build-date,
.timeline-content:hover .build-author {
    color: #10b981;
}

/* 状态徽章动画 */
.build-status {
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    animation: statusBounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    animation-delay: 0.4s;
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes statusBounceIn {
    0% {
        opacity: 0;
        transform: scale(0.3) rotate(-10deg);
    }
    50% {
        opacity: 0.8;
        transform: scale(1.1) rotate(5deg);
    }
    100% {
        opacity: 1;
        transform: scale(1) rotate(0deg);
    }
}

.build-status:hover {
    transform: scale(1.05);
}

.build-status.stable {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
}

.build-status.legacy {
    background: rgba(107, 114, 128, 0.2);
    color: #6b7280;
    border: 1px solid rgba(107, 114, 128, 0.3);
}

/* 描述动画 */
.build-description {
    margin-bottom: 16px;
    animation: descriptionSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.6s;
    opacity: 0;
    transform: translateY(15px);
}

@keyframes descriptionSlideIn {
    0% {
        opacity: 0;
        transform: translateY(20px);
        filter: blur(3px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0px);
    }
}

.build-description p {
    color: #94a3b8;
    line-height: 1.6;
    margin: 0;
}

/* 变更统计动画 */
.build-changes {
    margin-bottom: 20px;
    animation: changesSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.7s;
    opacity: 0;
    transform: translateX(-20px);
}

@keyframes changesSlideIn {
    0% {
        opacity: 0;
        transform: translateX(-30px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

.change-stats {
    display: flex;
    gap: 16px;
}

.stat {
    font-size: 14px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: statCountUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.8s;
    opacity: 0;
    transform: scale(0.8);
}

.stat:nth-child(1) { animation-delay: 0.8s; }
.stat:nth-child(2) { animation-delay: 0.9s; }
.stat:nth-child(3) { animation-delay: 1.0s; }

@keyframes statCountUp {
    0% {
        opacity: 0;
        transform: scale(0.5) rotateY(-90deg);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.1) rotateY(10deg);
    }
    100% {
        opacity: 1;
        transform: scale(1) rotateY(0deg);
    }
}

.stat:hover {
    transform: scale(1.1);
}

.stat.additions {
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
}

.stat.deletions {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
}

.stat.files {
    color: #64748b;
    background: rgba(100, 116, 139, 0.1);
}

/* 操作按钮动画 */
.build-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    animation: actionsSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.9s;
    opacity: 0;
    transform: translateY(20px);
}

@keyframes actionsSlideIn {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: transparent;
    color: #94a3b8;
    font-size: 14px;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    animation: buttonSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(20px);
}

.action-btn:nth-child(1) { animation-delay: 1.0s; }
.action-btn:nth-child(2) { animation-delay: 1.1s; }
.action-btn:nth-child(3) { animation-delay: 1.2s; }

@keyframes buttonSlideIn {
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.9);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.action-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover::before {
    left: 100%;
}

.action-btn svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover svg {
    transform: scale(1.1);
}

.action-btn.primary {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-color: #10b981;
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.action-btn.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.action-btn.secondary:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .timeline-item {
        gap: 16px;
    }

    .build-actions {
        justify-content: center;
    }
    
    .section-header h2 {
        font-size: 2rem;
    }
    
    .timeline-content {
        padding: 20px;
    }
}

@media (max-width: 480px) {
    .section-header h2 {
        font-size: 1.75rem;
    }
    
    .build-header {
        flex-direction: column;
        gap: 12px;
    }
    
    .build-actions {
        flex-direction: column;
    }
    
    .action-btn {
        justify-content: center;
    }
}
</style>
