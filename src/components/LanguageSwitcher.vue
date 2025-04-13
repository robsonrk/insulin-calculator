<!-- src/components/LanguageSwitcher.vue -->
<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
    >
      <img
        :src="`/flags/${currentLocale}.svg`"
        :alt="languages[currentLocale]"
        class="w-6 h-4 rounded-sm border border-gray-200"
      />
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
    >
      <button
        v-for="(language, key) in languages"
        :key="key"
        @click="switchLanguage(key)"
        class="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        :class="{ 'bg-blue-50': currentLocale === key }"
      >
        <img
          :src="`/flags/${key}.svg`"
          :alt="language"
          class="w-6 h-4 rounded-sm border border-gray-200"
        />
        <span>{{ language }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { saveLanguage } from '../utils/language'

const { locale } = useI18n();
const isOpen = ref(false);

const languages = {
  'pt-BR': 'Português (BR)',
  en: 'English',
  ja: '日本語',
};

const currentLocale = computed(() => locale.value);

const switchLanguage = (lang) => {
  locale.value = lang;
  saveLanguage(lang);
  isOpen.value = false;
};

// Fechar o dropdown quando clicar fora
const handleClickOutside = (event) => {
  const target = event.target;
  if (!target.closest('.relative')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>