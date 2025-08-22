<template>
  <div class="language-demo">
    <h3>{{ t('home.languageDemo.title') }}</h3>
    <p>{{ t('home.languageDemo.description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const { t } = useI18n()

// 组件加载时记录日志
logger.debug('Language demo loaded with translations:', t('home.languageDemo.title'))
</script>

<style scoped>
.language-demo {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin: 16px 0;
}

.language-demo h3 {
  color: #ffffff;
  margin-bottom: 8px;
}

.language-demo p {
  color: #94a3b8;
  margin: 0;
}
</style>