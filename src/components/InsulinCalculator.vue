<template>
    <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <form @submit.prevent="calculateInsulin" class="space-y-4">
            <div class="flex flex-col">
                <label :for="'carbs'" class="font-semibold">{{ $t('calculator.carbsLabel') }}</label>
                <input type="number" id="carbs" v-model.number="carbs" required min="0"
                    class="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="flex flex-col">
                <label :for="'icr'" class="font-semibold">{{ $t('calculator.icrLabel') }}</label>
                <input type="number" id="icr" v-model.number="icr" required min="1"
                    class="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="flex flex-col">
                <label :for="'currentGlucose'" class="font-semibold">{{ $t('calculator.currentGlucoseLabel') }}</label>
                <input type="number" id="currentGlucose" v-model.number="currentGlucose" required min="0"
                    class="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="flex flex-col">
                <label :for="'targetGlucose'" class="font-semibold">{{ $t('calculator.targetGlucoseLabel') }}</label>
                <input type="number" id="targetGlucose" v-model.number="targetGlucose" required min="0"
                    class="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="flex flex-col">
                <label :for="'isf'" class="font-semibold">{{ $t('calculator.isfLabel') }}</label>
                <input type="number" id="isf" v-model.number="isf" required min="1"
                    class="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <button type="submit" class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                {{ $t('calculator.calculateButton') }}
            </button>
        </form>

        <div v-if="totalInsulin !== null" class="mt-6 bg-blue-100 p-4 rounded">
            <h2 class="text-xl font-bold">{{ $t('calculator.resultTitle', { total: totalInsulin }) }}</h2>
            <p class="mt-2">{{ $t('calculator.resultDetail', {
                carbsInsulin: insulinForCarbs, correctionInsulin:
                correctionInsulin }) }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'InsulinCalculator',
    setup() {
        const carbs = ref<number>(0);
        const icr = ref<number>(10); // Exemplo: 1 unidade para cada 10g
        const currentGlucose = ref<number>(0);
        const targetGlucose = ref<number>(100);
        const isf = ref<number>(50); // Exemplo: 1 unidade reduz 50 mg/dL

        const insulinForCarbs = ref<number>(0);
        const correctionInsulin = ref<number>(0);
        const totalInsulin = ref<number | null>(null);

        const calculateInsulin = () => {
            // Cálculo para carboidratos
            insulinForCarbs.value = carbs.value / icr.value;

            // Cálculo para correção
            const glucoseDifference = currentGlucose.value - targetGlucose.value;
            if (glucoseDifference > 0) {
                correctionInsulin.value = glucoseDifference / isf.value;
            } else {
                correctionInsulin.value = 0;
            }

            // Dose total
            totalInsulin.value = parseFloat(
                (insulinForCarbs.value + correctionInsulin.value).toFixed(1)
            );
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
