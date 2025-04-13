<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="font-semibold mb-6 text-center">{{ $t('inventory.summary.title') }}</h2>
      
      <div v-if="lastTwoBatches.length === 0" class="text-center text-gray-500">
        {{ $t('inventory.summary.noBatches') }}
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th class="border border-gray-200 p-4 font-normal text-center bg-white w-1/2">
                {{ $t('inventory.summary.products') }}
              </th>
              <th class="border border-gray-200 p-4 text-center bg-white w-1/2">
                <div class="font-medium">{{ formatDate(lastTwoBatches[0]?.date) }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in currentProducts" :key="product.productId">
              <td class="border border-gray-200 p-4">
                <div>{{ product.name }}</div>
                <div class="text-sm text-gray-500">{{ product.unit }}</div>
              </td>
              <td class="border border-gray-200 p-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <span class="text-lg font-medium">{{ product.quantity }}</span>
                  <div 
                    v-if="lastTwoBatches.length > 1 && getQuantityDiff(product) !== 0"
                    class="flex items-center space-x-1"
                  >
                    <span class="text-sm text-gray-500">(&nbsp;</span>
                    <svg 
                      class="w-3 h-3"
                      :class="getQuantityDiff(product) > 0 ? 'text-green-500' : 'text-red-500'"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        :d="getQuantityDiff(product) > 0 
                          ? 'M5 10l7-7m0 0l7 7m-7-7v18' 
                          : 'M19 14l-7 7m0 0l-7-7m7 7V3'"
                      />
                    </svg>
                    <span 
                      :class="[
                        'text-sm',
                        getQuantityDiff(product) > 0 ? 'text-green-600' : 'text-red-600'
                      ]"
                    >
                      {{ Math.abs(getQuantityDiff(product)) }}
                    </span>
                    <span class="text-sm text-gray-500">&nbsp;)</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInventoryService } from '@/services/inventoryService';
import { getAuth } from 'firebase/auth';

const { t } = useI18n();
const auth = getAuth();
const inventoryService = useInventoryService();
const lastTwoBatches = ref([]);

const currentProducts = computed(() => {
  if (!lastTwoBatches.value[0]) return [];
  
  // Cria um mapa de todos os produtos (do batch atual e anterior)
  const allProducts = new Map();
  
  // Adiciona produtos do batch mais recente
  lastTwoBatches.value[0].products.forEach(product => {
    allProducts.set(product.productId, {
      ...product,
      quantity: product.quantity
    });
  });
  
  // Adiciona produtos do batch anterior que não estão no mais recente
  if (lastTwoBatches.value[1]) {
    lastTwoBatches.value[1].products.forEach(product => {
      if (!allProducts.has(product.productId)) {
        allProducts.set(product.productId, {
          ...product,
          quantity: 0 // Define como 0 já que não existe no batch atual
        });
      }
    });
  }
  
  return Array.from(allProducts.values());
});

const formatDate = (date) => {
  if (!date) return '';
  return date.toISOString().split('T')[0].replace(/-/g, '/');
};

const getPreviousQuantity = (currentProduct) => {
  if (!lastTwoBatches.value[1]) return 0;
  
  const previousProduct = lastTwoBatches.value[1].products.find(
    p => p.productId === currentProduct.productId
  );

  return previousProduct?.quantity || 0;
};

const getQuantityDiff = (currentProduct) => {
  if (!lastTwoBatches.value[1]) return 0;
  
  const previousQuantity = getPreviousQuantity(currentProduct);
  return currentProduct.quantity - previousQuantity;
};

const loadLastTwoBatches = async () => {
  try {
    if (!auth.currentUser) return;
    
    const history = await inventoryService.getInventoryHistory(auth.currentUser);
    // Garante que os batches estejam ordenados por data (mais recente primeiro)
    const sortedHistory = history.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    lastTwoBatches.value = sortedHistory.slice(0, 2);
  } catch (error) {
    console.error('Erro ao carregar batches:', error);
  }
};

onMounted(async () => {
  await loadLastTwoBatches();
});
</script>

<style scoped>
table {
  border-spacing: 0;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #e5e7eb;
}
</style> 