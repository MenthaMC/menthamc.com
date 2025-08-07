<template>
    <Navbar />

    <main class="main-content">
        <router-view />
    </main>
    <Footer />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Footer from './components/Footer.vue'
import Navbar from './components/Navbar.vue'
</script>

<style>
@import './styles/global.css';

.main-content {
    padding: 0 !important;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    width: 100%;
}

/* 响应式布局适配 */
@media (max-width: 1024px) {
    .container {
        max-width: 100%;
        padding: 0 var(--spacing-sm);
    }
}

@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }

    .main-content {
        padding-top: 1rem;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 0.75rem;
    }
}
</style>
