<template>
  <div class="flex justify-center items-center min-h-full">
    <InsulinCalculator />
  </div>
</template>

<script>
import InsulinCalculator from '../components/InsulinCalculator.vue'

export default {
  name: 'Home',
  components: {
    InsulinCalculator
  }
};
</script> 