<template>
    <div class="calculator">
        <form @submit.prevent="calculateInsulin">
            <div class="form-group">
                <label :for="'carbs'">{{ $t('calculator.carbsLabel') }}</label>
                <input type="number" id="carbs" v-model.number="carbs" required min="0" />
            </div>

            <div class="form-group">
                <label :for="'icr'">{{ $t('calculator.icrLabel') }}</label>
                <input type="number" id="icr" v-model.number="icr" required min="1" />
            </div>

            <div class="form-group">
                <label :for="'currentGlucose'">{{ $t('calculator.currentGlucoseLabel') }}</label>
                <input type="number" id="currentGlucose" v-model.number="currentGlucose" required min="0" />
            </div>

            <div class="form-group">
                <label :for="'targetGlucose'">{{ $t('calculator.targetGlucoseLabel') }}</label>
                <input type="number" id="targetGlucose" v-model.number="targetGlucose" required min="0" />
            </div>

            <div class="form-group">
                <label :for="'isf'">{{ $t('calculator.isfLabel') }}</label>
                <input type="number" id="isf" v-model.number="isf" required min="1" />
            </div>

            <button type="submit">{{ $t('calculator.calculateButton') }}</button>
        </form>

        <div v-if="totalInsulin !== null" class="result">
            <h2>{{ $t('calculator.resultTitle', { total: totalInsulin }) }}</h2>
            <p>
                {{ $t('calculator.resultDetail', { carbsInsulin: insulinForCarbs, correctionInsulin }) }}
            </p>
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

<style scoped>
.calculator {
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
    margin: 0 auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 1rem;
    text-align: left;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
}

button {
    padding: 0.75rem 1.5rem;
    background-color: #42b983;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #369870;
}

.result {
    margin-top: 2rem;
    padding: 1rem;
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 4px;
}
</style>