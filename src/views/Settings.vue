<template>
  <div class="container mx-auto px-4 mb-6">
    <Notification
      :show="notification.show"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      @close="notification.show = false"
    />
    <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('nav.settings') }}</h1>

    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'insulin'"
            :class="[
              activeTab === 'insulin'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ $t('settings.insulinSettings') }}
          </button>
          <button
            @click="activeTab = 'preferences'"
            :class="[
              activeTab === 'preferences'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ $t('settings.preferences') }}
          </button>
        </nav>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6 mt-6">
        <!-- Tab de Configurações de Insulina -->
        <div v-if="activeTab === 'insulin'">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('calculator.icrLabel') }}</label>
              <div class="space-y-2">
                <div>
                  <label class="text-sm text-gray-600">{{ $t('calculator.icrNormal') }}</label>
                  <input
                    v-model.number="preferences.insulinSettings.icr.normal"
                    type="number"
                    required
                    step="0.1"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label class="text-sm text-gray-600">{{ $t('calculator.icrMorning') }}</label>
                  <input
                    v-model.number="preferences.insulinSettings.icr.morning"
                    type="number"
                    required
                    step="0.1"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('calculator.targetGlucoseLabel') }}</label>
              <input
                v-model.number="preferences.insulinSettings.targetGlucose"
                type="number"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('calculator.isfLabel') }}</label>
              <input
                v-model.number="preferences.insulinSettings.isf"
                type="number"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('calculator.roundingLabel') }}</label>
              <div class="flex items-center mt-1">
                <input
                  type="radio"
                  id="floor"
                  name="rounding"
                  value="floor"
                  v-model="preferences.insulinSettings.rounding"
                  class="mr-1"
                />
                <label for="floor" class="mr-4">{{ $t('calculator.floorOption') }}</label>
                <input
                  type="radio"
                  id="round"
                  name="rounding"
                  value="round"
                  v-model="preferences.insulinSettings.rounding"
                  class="mr-1"
                />
                <label for="round">{{ $t('calculator.roundOption') }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab de Preferências -->
        <div v-if="activeTab === 'preferences'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('settings.language') }}</label>
            <select
              v-model="preferences.language"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('settings.theme') }}</label>
            <select
              v-model="preferences.theme"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="light">{{ $t('settings.lightTheme') }}</option>
              <option value="dark">{{ $t('settings.darkTheme') }}</option>
            </select>
          </div>

          <div class="mt-4">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="preferences.notifications"
                class="rounded border-gray-300 text-green-500 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <span class="ml-2 text-sm text-gray-700">{{ $t('settings.notifications') }}</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            {{ $t('common.save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAuth } from 'firebase/auth';
import { getUserPreferences, updateUserPreferences } from '../services/userService';
import Notification from '@/components/common/Notification.vue';

const { t, locale } = useI18n();
const auth = getAuth();
const activeTab = ref('insulin');

const preferences = ref({
  language: locale.value,
  theme: 'light',
  notifications: true,
  insulinSettings: {
    icr: { normal: 0, morning: 0 },
    isf: 50,
    targetGlucose: 100,
    rounding: 'floor'
  }
});

const notification = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
});

// Observar mudanças no idioma
watch(locale, (newLocale) => {
  preferences.value.language = newLocale;
});

const loadPreferences = async () => {
  if (auth.currentUser) {
    const userPrefs = await getUserPreferences(auth.currentUser);
    if (userPrefs) {
      // Garantir que a estrutura do objeto esteja completa
      const defaultPreferences = {
        language: locale.value,
        theme: 'light',
        notifications: true,
        insulinSettings: {
          icr: { normal: 0, morning: 0 },
          isf: 50,
          targetGlucose: 100,
          rounding: 'floor'
        }
      };

      // Mesclar as preferências do usuário com as padrões
      preferences.value = {
        ...defaultPreferences,
        ...userPrefs,
        insulinSettings: {
          ...defaultPreferences.insulinSettings,
          ...userPrefs.insulinSettings,
          icr: {
            ...defaultPreferences.insulinSettings.icr,
            ...(userPrefs.insulinSettings?.icr || {})
          }
        }
      };

      // Sincronizar o idioma com o i18n
      if (preferences.value.language !== locale.value) {
        locale.value = preferences.value.language;
      }
    }
  }
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
    await updateUserPreferences(auth.currentUser, preferences.value);
    // Atualizar o idioma da aplicação
    locale.value = preferences.value.language;
    showNotification('success', t('common.success'), t('settings.saveSuccess'));
  } catch (error) {
    console.error('Erro ao salvar preferências:', error);
    showNotification('error', t('common.error'), t('settings.saveError'));
  }
};

onMounted(() => {
  loadPreferences();
});
</script> 