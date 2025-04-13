<template>
  <nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-gray-800">Insulin Calculator</span>
          </router-link>
        </div>

        <div class="flex items-center space-x-4">
          <LanguageSwitcher />
          <button
            v-if="isAuthenticated"
            @click="handleLogout"
            class="p-2 rounded-md hover:bg-gray-100 transition-colors"
            :title="$t('auth.logout')"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getAuth, signOut } from 'firebase/auth';
import LanguageSwitcher from './LanguageSwitcher.vue';

const router = useRouter();
const { t } = useI18n();
const isAuthenticated = ref(false);

const handleLogout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

// Monitorar mudanças no estado de autenticação
getAuth().onAuthStateChanged((user) => {
  isAuthenticated.value = !!user;
});
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style> 