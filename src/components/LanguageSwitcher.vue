<!-- src/components/LanguageSwitcher.vue -->
<template>
    <div class="language-switcher">
        <button v-for="(language, key) in languages" :key="key" @click="switchLanguage(key)"
            :class="{ active: currentLocale === key }">
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
            ja: '日本語',
            en: 'English',
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
.language-switcher {
    margin-bottom: 1rem;
}

button {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #42b983;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button.active {
    background-color: #369870;
}

button:hover {
    background-color: #369870;
}
</style>