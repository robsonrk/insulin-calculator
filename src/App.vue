<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center p-4">
    <h1 class="text-2xl font-bold mb-4">{{ $t('app.title') }}</h1>
    <LanguageSwitcher />
    <InsulinCalculator />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import InsulinCalculator from './components/InsulinCalculator.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';

export default defineComponent({
  name: 'App',
  components: {
    InsulinCalculator,
    LanguageSwitcher
  }
});
</script>

<style>
/* Remova estilos anteriores se existirem */
</style>