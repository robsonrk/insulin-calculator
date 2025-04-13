<template>
  <div class="space-y-6">
    <Notification
      :show="notification.show"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      @close="notification.show = false"
    />
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">{{ $t('inventory.input.title') }}</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700">
              {{ $t('inventory.input.registrationDate') }}
            </label>
            <input
              type="date"
              v-model="registrationDate"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="product in products" :key="product.id" class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">
                  {{ product.name }} ({{ product.unit }})
                </label>
                <input
                  type="number"
                  v-model="productQuantities[product.id]"
                  min="0"
                  step="0.01"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            :disabled="isSubmitting"
          >
            {{ $t('inventory.input.register') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de Batches -->
    <div v-if="history.length > 0" class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">{{ $t('inventory.history.title') }}</h2>
      
      <div class="divide-y">
        <button
          v-for="batch in history"
          :key="batch.id"
          class="w-full py-4 text-left hover:bg-gray-50 transition-colors"
          @click="openBatchDetails(batch)"
        >
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-sm font-medium text-gray-900">
                {{ formatDate(batch.date) }}
              </span>
              <p class="text-sm text-gray-500">
                {{ batch.products.length }} {{ $t('inventory.history.items') }}
              </p>
            </div>
            <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </button>
      </div>
    </div>

    <div v-else-if="!isLoading" class="bg-white rounded-lg shadow p-6 text-center text-gray-600">
      {{ $t('inventory.history.empty') }}
    </div>

    <!-- Modal de Detalhes do Batch -->
    <Modal v-model="showDetailsModal">
      <template #title>
        <div class="space-y-1">
          <h3 class="text-lg font-medium text-gray-900">
            {{ selectedEntry ? formatDate(selectedEntry.date) : '' }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ selectedEntry?.products.length }} {{ $t('inventory.history.items') }}
          </p>
        </div>
      </template>
      
      <div v-if="selectedEntry">
        <div v-if="isEditing" class="space-y-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('inventory.input.registrationDate') }}
            </label>
            <input
              type="date"
              v-model="editForm.date"
              required
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div v-for="product in editForm.products" :key="product.productId" class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">
                  {{ product.name }} ({{ product.unit }})
                </label>
                <input
                  type="number"
                  v-model="product.quantity"
                  min="0"
                  step="0.01"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="divide-y">
          <div 
            v-for="product in selectedEntry.products" 
            :key="product.productId"
            class="py-4 first:pt-0 last:pb-0"
          >
            <div class="flex justify-between items-start">
              <div class="space-y-1">
                <span class="text-gray-900 font-medium">{{ product.name }}</span>
                <p class="text-sm text-gray-500">{{ product.unit }}</p>
              </div>
              <span class="text-lg font-medium text-gray-900">
                {{ product.quantity }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div v-if="isEditing" class="flex space-x-3">
          <button
            @click="cancelEdit"
            class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="saveBatch"
            class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {{ $t('common.save') }}
          </button>
        </div>
        <div v-else class="flex space-x-3">
          <button
            @click="editBatch"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {{ $t('common.edit') }}
          </button>
          <button
            @click="confirmDelete"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ $t('common.delete') }}
          </button>
        </div>
      </template>
    </Modal>

    <!-- Modal de Confirmação de Exclusão -->
    <Modal v-model="showDeleteConfirmModal">
      <template #title>
        <h3 class="text-lg font-medium text-gray-900">
          {{ $t('inventory.history.deleteConfirmTitle') }}
        </h3>
      </template>
      
      <div class="mt-2">
        <p class="text-sm text-gray-500">
          {{ $t('inventory.history.deleteConfirmMessage') }}
        </p>
      </div>

      <div class="mt-4 flex space-x-3 justify-end">
        <button
          @click="showDeleteConfirmModal = false"
          class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          @click="deleteBatch"
          class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {{ $t('common.delete') }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInventoryService } from '@/services/inventoryService';
import { getAuth } from 'firebase/auth';
import Modal from '@/components/common/Modal.vue';
import Notification from '@/components/common/Notification.vue';

const { t } = useI18n();
const auth = getAuth();
const inventoryService = useInventoryService();
const products = ref([]);
const productQuantities = ref({});
const registrationDate = ref('');
const isSubmitting = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const history = ref([]);
const showDetailsModal = ref(false);
const selectedEntry = ref(null);
const showDeleteConfirmModal = ref(false);
const isEditing = ref(false);
const editForm = ref({
  date: '',
  products: []
});

const notification = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
});

const showNotification = (type, title, message) => {
  notification.value = {
    show: true,
    type,
    title,
    message
  };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

const loadProducts = async () => {
  try {
    if (!auth.currentUser) return;
    const allProducts = await inventoryService.getProducts(auth.currentUser);
    // Filtra apenas produtos ativos para entrada de estoque
    products.value = allProducts.filter(product => product.active);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
};

const loadHistory = async () => {
  try {
    if (!auth.currentUser) return;
    isLoading.value = true;
    const entries = await inventoryService.getInventoryHistory(auth.currentUser);
    // Ordena os batches por data de forma decrescente
    history.value = entries.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    if (!auth.currentUser) {
      showNotification('error', t('common.error'), t('auth.notAuthenticated'));
      return;
    }

    isLoading.value = true;

    const entries = Object.entries(productQuantities.value)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({
        productId,
        quantity,
        date: new Date(registrationDate.value)
      }));

    if (entries.length === 0) {
      showNotification('error', t('common.error'), t('inventory.input.noEntries'));
      return;
    }

    await inventoryService.registerInventoryEntry(auth.currentUser, entries);
    showNotification('success', t('common.success'), t('inventory.input.success'));
    
    // Reseta o formulário
    registrationDate.value = new Date().toISOString().split('T')[0];
    productQuantities.value = Object.keys(productQuantities.value).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    // Recarrega o histórico
    await loadHistory();
  } catch (error) {
    console.error('Erro ao salvar entrada:', error);
    showNotification('error', t('common.error'), t('inventory.input.error'));
  } finally {
    isLoading.value = false;
  }
};

const openBatchDetails = (batch) => {
  selectedEntry.value = batch;
  showDetailsModal.value = true;
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0].replace(/-/g, '/');
};

const editBatch = () => {
  if (!selectedEntry.value) return;
  
  editForm.value = {
    date: selectedEntry.value.date.toISOString().split('T')[0],
    products: selectedEntry.value.products.map(p => ({
      productId: p.productId,
      name: p.name || '',
      unit: p.unit || '',
      quantity: p.quantity
    }))
  };
  
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  editForm.value = {
    date: '',
    products: []
  };
};

const saveBatch = async () => {
  if (!selectedEntry.value?.id || !auth.currentUser) return;
  
  try {
    await inventoryService.updateBatch(auth.currentUser, selectedEntry.value.id, {
      date: new Date(editForm.value.date),
      products: editForm.value.products.map(p => ({
        productId: p.productId,
        quantity: p.quantity
      }))
    });
    
    showNotification('success', t('common.success'), t('inventory.input.updateSuccess'));
    isEditing.value = false;
    await loadHistory();
    showDetailsModal.value = false;
  } catch (error) {
    console.error('Erro ao atualizar batch:', error);
    showNotification('error', t('common.error'), t('inventory.input.updateError'));
  }
};

const confirmDelete = () => {
  showDeleteConfirmModal.value = true;
};

const deleteBatch = async () => {
  if (!selectedEntry.value?.id) return;
  
  try {
    await inventoryService.deleteBatch(auth.currentUser, selectedEntry.value.id);
    showNotification('success', t('common.success'), t('inventory.input.deleteSuccess'));
    showDeleteConfirmModal.value = false;
    showDetailsModal.value = false;
    await loadHistory();
  } catch (error) {
    console.error('Erro ao deletar batch:', error);
    showNotification('error', t('common.error'), t('inventory.input.deleteError'));
  }
};

onMounted(async () => {
  await loadProducts();
  await loadHistory();
});
</script> 