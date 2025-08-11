<template>
    <footer class="footer">
        <div class="footer-container">
            <!-- 主要内容区域 -->
            <div class="footer-content">
                <!-- 品牌信息 -->
                <div class="footer-section">
                    <h3 class="footer-title">{{ $t('footer.brand.title') }}</h3>
                    <p class="footer-description">
                        {{ $t('footer.brand.description') }}
                    </p>
                    <div class="social-links">
                        <a href="#" class="social-link" aria-label="GitHub">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                />
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="Discord">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                                />
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- 快速链接 -->
                <div class="footer-section">
                    <h4 class="footer-subtitle">{{ $t('footer.links.title') }}</h4>
                    <ul class="footer-links">
                        <li>
                            <router-link to="/" class="footer-link">{{
                                $t('footer.links.home')
                            }}</router-link>
                        </li>
                        <li>
                            <router-link to="/download" class="footer-link">{{
                                $t('footer.links.download')
                            }}</router-link>
                        </li>
                        <li>
                            <router-link to="/community" class="footer-link">{{
                                $t('footer.links.community')
                            }}</router-link>
                        </li>
                        <li>
                            <a href="#" class="footer-link">{{ $t('footer.links.docs') }}</a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- 底部版权信息 -->
            <div class="footer-bottom">
                <div class="footer-copyright">
                    <p>{{ $t('footer.copyright') }}</p>
                    <p class="footer-note">{{ $t('footer.note') }}</p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>

<script lang="ts">
export default {
    name: 'AppFooter'
}
</script>

<style scoped>
.footer {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #e2e8f0;
    margin-top: auto;
    position: relative;
    z-index: 1;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 1rem 1rem;
}

.footer-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    margin-bottom: 2rem;
    align-items: start;
}

.footer-section {
    display: flex;
    flex-direction: column;
}

.footer-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #60a5fa;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #60a5fa, #34d399);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.footer-subtitle {
    font-size: 1.1rem;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 1rem;
}

.footer-description {
    color: #cbd5e1;
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-links li {
    margin-bottom: 0.5rem;
}

.footer-link {
    color: #cbd5e1;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;
}

.footer-link:hover {
    color: #60a5fa;
    transform: translateX(4px);
}

.social-links {
    display: flex;
    gap: 1rem;
}

.social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(96, 165, 250, 0.1);
    border: 1px solid rgba(96, 165, 250, 0.2);
    border-radius: 8px;
    color: #cbd5e1;
    text-decoration: none;
    transition: all 0.3s ease;
}

.social-link:hover {
    background: rgba(96, 165, 250, 0.2);
    border-color: #60a5fa;
    color: #60a5fa;
    transform: translateY(-2px);
}

.footer-bottom {
    border-top: 1px solid rgba(96, 165, 250, 0.2);
    padding-top: 1.5rem;
    text-align: center;
}

.footer-copyright {
    color: #94a3b8;
}

.footer-copyright p {
    margin: 0.25rem 0;
}

.footer-note {
    font-size: 0.875rem;
    opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .footer-container {
        padding: 2rem 1rem 1rem;
    }

    .footer-content {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .footer-title {
        font-size: 1.25rem;
    }

    .social-links {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .footer-link:hover {
        transform: none;
    }
}
</style>
