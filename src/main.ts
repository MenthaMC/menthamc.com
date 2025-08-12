import { createApp } from 'vue'
import App from './App.vue'
import i18n from './locales'
import router from './router'
import './styles/components.css'
import './styles/mobile.css'

export const api = "http://43.163.120.17:32767/v2"

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
