<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-4xl mx-auto">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-bold">{{ $t('calculator.historyTitle') }}</h1>
                <router-link 
                    to="/" 
                    class="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    {{ $t('common.back') }}
                </router-link>
            </div>

            <div v-if="calculations.length === 0" class="bg-white rounded-lg p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">{{ $t('calculator.emptyHistory') }}</h3>
                <p class="mt-2 text-sm text-gray-500">{{ $t('calculator.emptyHistoryDescription') }}</p>
            </div>

            <div v-else class="space-y-4">
                <div v-for="calc in calculations" :key="calc.id" 
                    class="bg-white rounded-lg p-4 hover:bg-gray-50 cursor-pointer shadow-sm"
                    @click="selectedCalculation = calc">
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="font-semibold">{{ calc.carbs }}g</span> de carboidratos
                        </div>
                        <div class="text-blue-600 font-bold">
                            {{ calc.totalInsulin }} unidades
                        </div>
                    </div>
                    <div class="text-sm text-gray-500 mt-1">
                        {{ new Date(calc.timestamp.seconds * 1000).toLocaleString() }}
                    </div>
                </div>
            </div>

            <!-- Modal de detalhes -->
            <div v-if="selectedCalculation" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div class="bg-white rounded-lg p-6 max-w-md w-full">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold">{{ $t('calculator.calculationDetails') }}</h3>
                        <button @click="selectedCalculation = null" class="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <div class="text-sm text-blue-600">{{ $t('calculator.carbsLabel') }}</div>
                                <div class="text-2xl font-bold text-blue-700">{{ selectedCalculation.carbs }}g</div>
                            </div>
                            <div class="bg-green-50 p-4 rounded-lg">
                                <div class="text-sm text-green-600">{{ $t('calculator.currentGlucoseLabel') }}</div>
                                <div class="text-2xl font-bold text-green-700">{{ selectedCalculation.currentGlucose }} mg/dL</div>
                            </div>
                        </div>

                        <!-- Total insulin -->
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <div class="text-sm text-purple-600">{{ $t('calculator.resultTitle', { total: selectedCalculation.totalInsulin }) }}</div>
                            <div class="text-2-2xl font-bold text-purple-700">{{ selectedCalculation.totalInsulin }} unidades</div>
                            <div class="text-sm text-purple-600">{{ $t('calculator.resultDetail', { carbsInsulin: selectedCalculation.insulinForCarbs, correctionInsulin: selectedCalculation.correctionInsulin }) }}</div>
                        </div>

                        <div class="p-4 rounded-lg border">
                            <div class="text-sm text-gray-600">{{ $t('calculator.icrLabel') }}</div>
                            <div class="font-semibold">
                                {{ selectedCalculation.icr.selected === 'normal' ? $t('calculator.icrNormal') : $t('calculator.icrMorning') }}:
                                1:{{ selectedCalculation.icr[selectedCalculation.icr.selected] }}
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="p-4 rounded-lg border">
                                <div class="text-sm text-gray-600">{{ $t('calculator.targetGlucoseLabel') }}</div>
                                <div class="font-semibold">{{ selectedCalculation.targetGlucose }} mg/dL</div>
                            </div>
                            <div class="p-4 rounded-lg border">
                                <div class="text-sm text-gray-600">{{ $t('calculator.isfLabel') }}</div>
                                <div class="font-semibold">{{ selectedCalculation.isf }} mg/dL</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { getCalculations } from '../services/calculationService';

export default defineComponent({
    name: 'CalculationHistory',
    setup() {
        const calculations = ref([]);
        const selectedCalculation = ref(null);

        const loadCalculations = async () => {
            try {
                calculations.value = await getCalculations();
            } catch (error) {
                console.error('Erro ao carregar cálculos:', error);
            }
        };

        onMounted(() => {
            loadCalculations();
        });

        return {
            calculations,
            selectedCalculation
        };
    }
});
</script> 