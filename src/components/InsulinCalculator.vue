<template>
    <div class="w-full max-w-md bg-white p-6 pt-2 rounded-lg shadow-md">
        <div class="flex justify-between items-center">
            <!-- <h1 class="text-xl font-bold">{{ $t('app.title') }}</h1> -->
            <!-- <div>&nbsp;</div> -->
            <router-link 
                to="/history"
                class="p-0 text-gray-600 hover:text-gray-800 ml-auto -mr-3.5"
                :title="$t('calculator.viewHistory')"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </router-link>
        </div>
        <form @submit.prevent="calculateInsulin" class="space-y-4">
            <!-- Quantidade de Carboidratos -->
            <div class="flex flex-col">
                <label :for="'carbs'" class="font-semibold">{{ $t('calculator.carbsLabel') }}</label>
                <input type="number" id="carbs" v-model.number="carbs" required min="0" step="0.1"
                class="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <!-- Razão Insulina-Carboidrato -->
            <div class="flex flex-col">
                <label class="font-semibold mb-2">{{ $t('calculator.icrLabel') }}</label>
                <div class="flex gap-2">
                    <button
                        type="button"
                        @click="selectedIcr = 'normal'"
                        :class="[
                            'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors',
                            !hasValidIcr ? 'bg-red-50 text-red-700 border border-red-300' :
                            selectedIcr === 'normal'
                                ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        ]"
                    >
                        {{ getIcrValue('normal') }}
                    </button>
                    <button
                        type="button"
                        @click="selectedIcr = 'morning'"
                        :class="[
                            'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors',
                            !hasValidIcr ? 'bg-red-50 text-red-700 border border-red-300' :
                            selectedIcr === 'morning'
                                ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        ]"
                    >
                        {{ getIcrValue('morning') }}
                    </button>
                </div>
                <div class="mt-1 text-sm" :class="{ 'text-red-600': !hasValidIcr, 'text-gray-500': hasValidIcr }">
                    <template v-if="!hasValidIcr">
                        <router-link 
                            :to="{ 
                                path: '/settings', 
                                query: { tab: 'insulin' }
                            }" 
                            class="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                            <span>{{ $t('calculator.icrMissing') }}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M11.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L13.586 11H3a1 1 0 110-2h10.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </router-link>
                    </template>
                    <template v-else>
                        {{ selectedIcr === 'normal' ? $t('calculator.icrNormal') : $t('calculator.icrMorning') }}
                    </template>
                </div>
            </div>

            <!-- Glicemia Atual -->
            <div class="flex flex-col">
                <label :for="'currentGlucose'" class="font-semibold">{{ $t('calculator.currentGlucoseLabel') }}</label>
                <input 
                    type="number" 
                    id="currentGlucose" 
                    v-model.number="currentGlucose" 
                    required 
                    min="0"
                    :class="[
                        'mt-1 p-2 border rounded focus:outline-none focus:ring-2',
                        currentGlucose < 60 
                            ? 'border-red-300 text-red-600 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                    ]"
                />
                <span v-if="currentGlucose < 60" class="mt-1 text-sm text-red-600">
                    {{ $t('calculator.lowGlucoseWarning') }}
                </span>
            </div>

            <!-- Configurações atuais -->
            <div class="p-2 bg-gray-50 rounded-md text-sm text-gray-600 space-y-1">
                <div class="flex items-center">
                    <span class="w-full">{{ $t('calculator.targetGlucoseLabel') }}: {{ targetGlucose }} mg/dL</span>
                </div>
                <div class="flex items-center">
                    <span class="w-full">{{ $t('calculator.isfLabel') }}: {{ isf }} mg/dL</span>
                </div>
                <div class="flex items-center">
                    <span class="w-full">{{ $t('calculator.roundingLabel') }}: {{ $t(`calculator.${rounding}Option`) }}</span>
                </div>
            </div>

            <!-- Botão de Calcular -->
            <button 
                type="submit" 
                :disabled="!hasValidIcr"
                :class="[
                    'w-full py-2 px-4 rounded transition',
                    hasValidIcr 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
            >
                {{ $t('calculator.calculateButton') }}
            </button>
        </form>

        <!-- Resultado -->
        <div v-if="totalInsulin !== null" class="mt-6 bg-blue-100 p-4 rounded">
            <h2 class="text-xl font-bold">{{ $t('calculator.resultTitle', { total: totalInsulin }) }}</h2>
            <p class="mt-2">{{ $t('calculator.resultDetail', {
                carbsInsulin: (insulinForCarbs).toFixed(2), correctionInsulin:
                correctionInsulin.toFixed(2) }) }}</p>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { getAuth } from 'firebase/auth';
import { getUserPreferences } from '../services/userService';
import { useI18n } from 'vue-i18n';
import { saveCalculation } from '../services/calculationService';

export default defineComponent({
    name: 'InsulinCalculator',
    setup() {
        const auth = getAuth();
        const carbs = ref(0);
        const currentGlucose = ref(80);
        const targetGlucose = ref(130);
        const isf = ref(100);
        const rounding = ref('floor');

        const selectedIcr = ref('normal');
        const icrSettings = ref({
            normal: 0,
            morning: 0
        });

        const insulinForCarbs = ref(0);
        const correctionInsulin = ref(0);
        const totalInsulin = ref(null);

        // Computed para verificar se os valores de ICR são válidos
        const hasValidIcr = computed(() => {
            return icrSettings.value.normal > 0 && icrSettings.value.morning > 0;
        });

        // Função para obter o valor do ICR com validação
        const getIcrValue = (type) => {
            const value = icrSettings.value[type];
            return value > 0 ? value.toString() : '---';
        };

        const loadUserPreferences = async () => {
            if (auth.currentUser) {
                const preferences = await getUserPreferences(auth.currentUser);
                if (preferences) {
                    targetGlucose.value = preferences.insulinSettings.targetGlucose;
                    isf.value = preferences.insulinSettings.isf;
                    rounding.value = preferences.insulinSettings.rounding;
                    
                    // Validação dos valores de ICR
                    if (preferences.insulinSettings.icr) {
                        icrSettings.value = {
                            normal: preferences.insulinSettings.icr.normal || 0,
                            morning: preferences.insulinSettings.icr.morning || 0
                        };
                    }
                }
            }
        };

        onMounted(() => {
            loadUserPreferences();
        });

        const calculateInsulin = async () => {
            if (!hasValidIcr.value) return;

            // Cálculo para carboidratos usando o ICR selecionado
            const currentIcr = icrSettings.value[selectedIcr.value];
            insulinForCarbs.value = (carbs.value / (1 / currentIcr)) / 10;

            // Cálculo para correção
            const glucoseDifference = currentGlucose.value - targetGlucose.value;
            correctionInsulin.value = (glucoseDifference / isf.value);

            // Dose total arredondada para o inteiro mais próximo
            const result = insulinForCarbs.value + correctionInsulin.value
            switch (rounding.value) {
                case 'round':
                    totalInsulin.value = Math.round(result);
                    break;
                case 'floor':
                default:
                    totalInsulin.value = Math.floor(result);
                    break;
            }
            // avoid total < 0
            if (totalInsulin.value < 0) {
                totalInsulin.value = 0;
            }

            // Salvar o cálculo no Firebase
            try {
                await saveCalculation({
                    carbs: carbs.value,
                    currentGlucose: currentGlucose.value,
                    targetGlucose: targetGlucose.value,
                    isf: isf.value,
                    icr: {
                        normal: icrSettings.value.normal,
                        morning: icrSettings.value.morning,
                        selected: selectedIcr.value
                    },
                    insulinForCarbs: insulinForCarbs.value,
                    correctionInsulin: correctionInsulin.value,
                    totalInsulin: totalInsulin.value
                });
            } catch (error) {
                console.error('Erro ao salvar cálculo:', error);
            }
        };

        return {
            carbs,
            currentGlucose,
            targetGlucose,
            isf,
            insulinForCarbs,
            correctionInsulin,
            totalInsulin,
            calculateInsulin,
            rounding,
            selectedIcr,
            icrSettings,
            hasValidIcr,
            getIcrValue
        };
    },
});
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>