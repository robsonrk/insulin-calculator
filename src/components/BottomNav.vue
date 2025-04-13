<template>
  <nav class="bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.1)] h-16">
    <div class="max-w-7xl mx-auto h-full">
      <div class="grid grid-cols-3 h-full">
        <router-link 
          to="/" 
          class="flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          :class="{ 'text-blue-500': $route.path === '/' }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-xs mt-1">{{ $t('nav.home') }}</span>
        </router-link>

        <router-link 
          to="/inventory" 
          class="flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          :class="{ 'text-blue-500': $route.path === '/inventory' }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <span class="text-xs mt-1">{{ $t('nav.inventory') }}</span>
        </router-link>

        <router-link 
          to="/settings" 
          class="flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          :class="{ 'text-blue-500': $route.path === '/settings' }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="text-xs mt-1">{{ $t('nav.settings') }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script> 