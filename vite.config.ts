import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        host: '0.0.0.0',
        proxy: {
            '^/api': {
                target: 'http://43.163.120.17:8080',
                rewrite:(path) => {                    
                    return path.replace(/^\/api/,'')          
                }
            }
        }
    },
})
