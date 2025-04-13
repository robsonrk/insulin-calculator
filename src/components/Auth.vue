<template>
  <div class="auth-container">
    <div class="auth-form">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ isLogin ? $t('auth.login') : $t('auth.register') }}</h2>
        <p class="text-gray-600 mt-2">{{ isLogin ? $t('auth.welcome') : $t('auth.welcomeRegister') }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700">{{ $t('auth.email') }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            :placeholder="$t('auth.emailPlaceholder')"
            required
            class="input w-full"
          />
        </div>

        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-gray-700">{{ $t('auth.password') }}</label>
          <input
            id="password"
            v-model="password"
            type="password"
            :placeholder="$t('auth.passwordPlaceholder')"
            required
            class="input w-full"
          />
        </div>

        <button type="submit" class="button-primary w-full">
          {{ isLogin ? $t('auth.signIn') : $t('auth.signUp') }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">{{ isLogin ? $t('auth.noAccount') : $t('auth.haveAccount') }}</p>
        <button @click="toggleMode" class="button-secondary mt-2">
          {{ isLogin ? $t('auth.register') : $t('auth.login') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUserProfile } from '../services/userService';

const router = useRouter();
const { t } = useI18n();
const email = ref('');
const password = ref('');
const isLogin = ref(true);

const toggleMode = () => {
  isLogin.value = !isLogin.value;
};

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      await createUserProfile(userCredential.user);
    }
    email.value = '';
    password.value = '';
    router.push('/');
  } catch (error: any) {
    console.error(t('auth.error'), error);
    alert(error.message);
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.auth-form {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.button-primary {
  padding: 0.75rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.button-primary:hover {
  background-color: #45a049;
}

.button-secondary {
  padding: 0.5rem 1rem;
  background-color: white;
  color: #4CAF50;
  border: 2px solid #4CAF50;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.button-secondary:hover {
  background-color: #f0fdf4;
}
</style> 