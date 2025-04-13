<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed top-4 right-4 z-50 flex items-start space-x-4 min-w-[320px]">
      <div 
        class="w-full bg-white shadow-lg rounded-lg pointer-events-auto overflow-hidden"
        :class="type === 'success' ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400'"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <!-- Ícone de sucesso -->
              <svg v-if="type === 'success'" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <!-- Ícone de erro -->
              <svg v-else-if="type === 'error'" class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <p 
                class="text-sm font-medium"
                :class="type === 'success' ? 'text-green-800' : 'text-red-800'"
              >
                {{ title }}
              </p>
              <p 
                v-if="message" 
                class="mt-1 text-sm"
                :class="type === 'success' ? 'text-green-600' : 'text-red-600'"
              >
                {{ message }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="$emit('close')"
                class="inline-flex rounded-md p-1.5"
                :class="type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-400' : 'text-red-500 hover:bg-red-100 focus:ring-red-400'"
              >
                <span class="sr-only">Close</span>
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  type: 'success' | 'error';
  title: string;
  message?: string;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script> 