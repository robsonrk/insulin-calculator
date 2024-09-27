// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createI18n } from 'vue-i18n';

// Importação das traduções
import en from './locales/en.json';
import ja from './locales/ja.json';
import ptBR from './locales/pt-BR.json'; // Adicione esta linha

// Configuração do i18n
const i18n = createI18n({
    locale: 'pt-BR', // Defina o idioma padrão conforme necessário
    fallbackLocale: 'en',
    messages: {
        en,
        ja,
        'pt-BR': ptBR // Adicione esta linha
    }
});

const app = createApp(App);

app.use(i18n);

app.mount('#app');