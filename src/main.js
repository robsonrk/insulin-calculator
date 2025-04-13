import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import ptBR from './locales/pt-BR.json'
import en from './locales/en.json'
import ja from './locales/ja.json'
import './config/firebase'
import './assets/main.css'

const i18n = createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'en',
  messages: {
    'pt-BR': ptBR,
    en,
    ja
  }
})

const app = createApp(App)

// Registrar plugins
app.use(router)
app.use(i18n)

// Montar a aplicação
app.mount('#app') 