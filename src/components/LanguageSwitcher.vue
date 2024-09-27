<!-- src/components/LanguageSwitcher.vue -->
<template>
    <div class="flex space-x-2 mb-4">
        <button v-for="(language, key) in languages" :key="key" @click="switchLanguage(key)" :class="[
            'px-4 py-2 rounded',
            currentLocale === key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700',
            'hover:bg-blue-400 hover:text-white transition'
        ]">
            {{ language }}
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'LanguageSwitcher',
    setup() {
        const { locale } = useI18n();

        const languages = {
            'pt-BR': 'Português (BR)',
            en: 'English',
            ja: '日本語',
        };

        const currentLocale = computed(() => locale.value);

        const switchLanguage = (lang: string) => {
            locale.value = lang;
        };

        return {
            languages,
            switchLanguage,
            currentLocale
        };
    }
});
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>