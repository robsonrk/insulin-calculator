<template>
  <div class="container mx-auto mb-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">{{ $t('nav.inventory') }}</h1>
    </div>

    <!-- Navegação por abas -->
    <div class="mb-6">
      <nav class="flex space-x-4 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            'px-4 py-2 text-sm font-medium',
            currentTab === tab.id
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ $t(tab.label) }}
        </button>
      </nav>
    </div>

    <!-- Conteúdo das abas -->
    <div class="mt-6">
      <!-- Aba de Resumo -->
      <InventorySummary v-if="currentTab === 'summary'" />

      <!-- Aba de Entrada -->
      <InventoryInput v-if="currentTab === 'input'" />

      <!-- Aba de Produtos -->
      <ProductsManagement v-if="currentTab === 'products'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import InventorySummary from '@/components/inventory/InventorySummary.vue';
import InventoryInput from '@/components/inventory/InventoryInput.vue';
import ProductsManagement from '@/components/inventory/ProductsManagement.vue';

const currentTab = ref('summary');

const tabs = [
  { id: 'summary', label: 'inventory.tabs.summary' },
  { id: 'input', label: 'inventory.tabs.input' },
  { id: 'products', label: 'inventory.tabs.products' }
];
</script> 