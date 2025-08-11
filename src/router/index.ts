import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

interface RouteConfig extends RouteRecordRaw {
  meta?: {
    title?: string;
    requiresAuth?: boolean;
  };
}

// 路由配置
const routes: RouteConfig[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomePage.vue'),
        meta: {
            title: 'MenthaUI - 现代化服务端',
        },
    },
    {
        path: '/download',
        name: 'Download',
        component: () => import('../views/DownloadPage.vue'),
        meta: {
            title: '下载 - MenthaUI',
        },
    },
    {
        path: '/community',
        name: 'Community',
        component: () => import('../views/CommunityPage.vue'),
        meta: {
            title: '社区 - MenthaUI',
        },
    },
]

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
})

// 路由守卫 - 设置页面标题和过渡效果
router.beforeEach((to, from, next) => {
    if (to.meta?.title) {
        document.title = to.meta.title as string
    }
    
    // 添加页面切换时的loading状态
    document.body.classList.add('page-transitioning')
    next()
})

// 路由切换完成后的处理
router.afterEach(() => {
    // 移除loading状态
    setTimeout(() => {
        document.body.classList.remove('page-transitioning')
    }, 250) // 与动画时长保持一致
})

export default router
