<template>
    <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
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
                <label :for="'icr'" class="font-semibold">{{ $t('calculator.icrLabel') }}</label>
                <input type="number" id="icr" v-model.number="icr" required min="0.1" step="0.1"
                class="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <!-- Glicemia Atual -->
            <div class="flex flex-col">
                <label :for="'currentGlucose'" class="font-semibold">{{ $t('calculator.currentGlucoseLabel') }}</label>
                <input type="number" id="currentGlucose" v-model.number="currentGlucose" required min="0"
                    class="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <!-- Glicemia Alvo -->
            <div class="flex flex-col">
                <label :for="'targetGlucose'" class="font-semibold">{{ $t('calculator.targetGlucoseLabel') }}</label>
                <input type="number" id="targetGlucose" v-model.number="targetGlucose" required min="0"
                    class="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <!-- Fator de Sensibilidade à Insulina -->
            <div class="flex flex-col">
                <label :for="'isf'" class="font-semibold">{{ $t('calculator.isfLabel') }}</label>
                <input type="number" id="isf" v-model.number="isf" required min="1"
                    class="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <!-- Botão de Calcular -->
            <button type="submit" class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                {{ $t('calculator.calculateButton') }}
            </button>
        </form>

        <!-- Resultado -->
        <div v-if="totalInsulin !== null" class="mt-6 bg-blue-100 p-4 rounded">
            <h2 class="text-xl font-bold">{{ $t('calculator.resultTitle', { total: totalInsulin }) }}</h2>
            <p class="mt-2">{{ $t('calculator.resultDetail', {
                carbsInsulin: (insulinForCarbs/10).toFixed(2), correctionInsulin:
                correctionInsulin.toFixed(2) }) }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'InsulinCalculator',
    setup() {
        const carbs = ref<number>(55.5);
        const icr = ref<number>(1.1); // Exemplo: 1 unidade para cada 10g
        const currentGlucose = ref<number>(139);
        const targetGlucose = ref<number>(130);
        const isf = ref<number>(100); // Exemplo: 1 unidade reduz 50 mg/dL

        const insulinForCarbs = ref<number>(0);
        const correctionInsulin = ref<number>(0);
        const totalInsulin = ref<number | null>(null);

        const calculateInsulin = () => {
            // Cálculo para carboidratos
            insulinForCarbs.value = carbs.value / icr.value;
            console.log('insulinForCarbs', insulinForCarbs.value, carbs.value, icr.value);

            // Cálculo para correção
            const glucoseDifference = currentGlucose.value - targetGlucose.value;
            if (glucoseDifference > 0) {
                correctionInsulin.value = (glucoseDifference / isf.value);
            } else {
                correctionInsulin.value = 0;
            }

            // Dose total arredondada para o inteiro mais próximo
            totalInsulin.value = Math.round((insulinForCarbs.value / 10) + correctionInsulin.value);
        };

        return {
            carbs,
            icr,
            currentGlucose,
            targetGlucose,
            isf,
            insulinForCarbs,
            correctionInsulin,
            totalInsulin,
            calculateInsulin,
        };
    },
});
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>