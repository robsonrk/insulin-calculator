import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import ptBR from './locales/pt-BR.json'
import en from './locales/en.json'
import ja from './locales/ja.json'
import './config/firebase'
import './assets/main.css'

// Configuração do i18n
const i18n = createI18n({
    locale: 'pt-BR',
    fallbackLocale: 'en',
    messages: {
        'pt-BR': ptBR,
        'en': en,
        'ja': ja
    }
})

const app = createApp(App)

// Registrar plugins
app.use(router)
app.use(i18n)

// Montar a aplicação depois que o router estiver pronto
router.isReady().then(() => {
    app.mount('#app')
}) 