<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- Navbar fixa no topo -->
    <Navbar class="flex-none" />
    
    <!-- Conteúdo principal com scroll -->
    <main class="flex-1 overflow-y-auto">
      <div class="container mx-auto px-4 py-6">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </main>

    <!-- Bottom Nav fixo -->
    <BottomNav class="flex-none" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/Navbar.vue';
import BottomNav from './components/BottomNav.vue';
import { setupLanguage } from './utils/language'

const router = useRouter();
const { t } = useI18n();
const isAuthenticated = ref(false);

onMounted(() => {
  setupLanguage()
  
  // Monitorar mudanças no estado de autenticação
  onAuthStateChanged(getAuth(), (user) => {
    isAuthenticated.value = !!user;
  });
});
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
}

/* Estilos para scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>