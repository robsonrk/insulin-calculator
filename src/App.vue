<template>
  <div id="app">
    <h1>{{ $t('app.title') }}</h1>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>