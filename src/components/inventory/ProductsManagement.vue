<template>
  <div class="space-y-6">
    <Notification
      :show="notification.show"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      @close="notification.show = false"
    />
    <div class="bg-white rounded-lg shadow p-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">{{ $t('inventory.products.title') }}</h2>
        <button
          @click="openNewProductModal"
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          {{ $t('inventory.products.add') }}
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                {{ $t('common.active') }}
              </th>
              <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('inventory.products.name') }}
              </th>
              <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id" :class="{ 'opacity-50': !product.active }">
              <td class="px-2 py-2 whitespace-nowrap">
                <button
                  @click="toggleProductActive(product)"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  :class="[product.active ? 'bg-green-500' : 'bg-gray-200']"
                  role="switch"
                  :aria-checked="product.active"
                >
                  <span
                    aria-hidden="true"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="[product.active ? 'translate-x-5' : 'translate-x-0']"
                  />
                </button>
              </td>
              <td class="px-2 py-2 whitespace-nowrap">
                {{ product.name }}
                <div class="text-xs text-gray-400">{{ $t('inventory.products.unit') }}: {{ product.unit }}</div>
              </td>
              <td class="px-2 py-2 whitespace-nowrap text-center space-x-2 flex items-center justify-center">
                <button
                  @click="editProduct(product)"
                  class="text-indigo-600 hover:text-indigo-900"
                  :title="$t('common.edit')"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button
                  @click="deleteProduct(product)"
                  class="text-red-600 hover:text-red-900"
                  :title="$t('common.delete')"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para adicionar/editar produto -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingProduct ? $t('inventory.products.edit') : $t('inventory.products.add') }}
        </h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ $t('inventory.products.name') }}
              <span class="text-xs text-gray-500 ml-1">
                ({{ $t('inventory.products.nameHint') }})
              </span>
            </label>
            <input
              type="text"
              v-model="productForm.name"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ $t('inventory.products.unit') }}
              <span class="text-xs text-gray-500 ml-1">
                ({{ $t('inventory.products.unitHint') }})
              </span>
            </label>
            <input
              type="text"
              v-model="productForm.unit"
              required
              placeholder="un, kg, ml..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              {{ $t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAuth } from 'firebase/auth';
import { getProducts, addProduct, updateProduct, deleteProduct as deleteProductFromDb } from '@/services/inventoryService';
import Notification from '@/components/common/Notification.vue';

const { t } = useI18n();
const auth = getAuth();
const products = ref([]);
const showModal = ref(false);
const editingProduct = ref(null);
const productForm = ref({
  name: '',
  unit: ''
});

const notification = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
});

const loadProducts = async () => {
  if (!auth.currentUser) return;
  products.value = await getProducts(auth.currentUser);
};

const openNewProductModal = () => {
  editingProduct.value = null;
  productForm.value = { name: '', unit: '' };
  showModal.value = true;
};

const editProduct = (product) => {
  editingProduct.value = product;
  productForm.value = { 
    name: product.name,
    unit: product.unit
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingProduct.value = null;
  productForm.value = { name: '', unit: '' };
};

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

const handleSubmit = async () => {
  if (!auth.currentUser) return;

  try {
    if (editingProduct.value) {
      await updateProduct(auth.currentUser, {
        ...editingProduct.value,
        ...productForm.value
      });
      showNotification('success', t('common.success'), t('inventory.products.updateSuccess'));
    } else {
      await addProduct(auth.currentUser, {
        ...productForm.value,
        active: true
      });
      showNotification('success', t('common.success'), t('inventory.products.createSuccess'));
    }
    
    await loadProducts();
    closeModal();
  } catch (error) {
    console.error('Error saving product:', error);
    showNotification('error', t('common.error'), t('inventory.products.saveError'));
  }
};

const toggleProductActive = async (product) => {
  if (!auth.currentUser) return;

  try {
    await updateProduct(auth.currentUser, {
      ...product,
      active: !product.active
    });
    await loadProducts();
    showNotification('success', t('common.success'), t('inventory.products.statusSuccess'));
  } catch (error) {
    console.error('Error toggling product status:', error);
    showNotification('error', t('common.error'), t('inventory.products.statusError'));
  }
};

const deleteProduct = async (product) => {
  if (!auth.currentUser || !confirm(t('inventory.products.confirmDelete'))) return;

  try {
    await deleteProductFromDb(auth.currentUser, product.id);
    await loadProducts();
    showNotification('success', t('common.success'), t('inventory.products.deleteSuccess'));
  } catch (error) {
    console.error('Error deleting product:', error);
    showNotification('error', t('common.error'), t('inventory.products.deleteError'));
  }
};

onMounted(() => {
  loadProducts();
});
</script> 