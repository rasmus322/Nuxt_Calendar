<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <section class="max-w-md w-full space-y-8">
      <header>
        <h1 class="text-3xl font-bold text-center text-gray-900">
          Вход в аккаунт
        </h1>
        <p class="mt-2 text-center text-sm text-gray-600">
          Или
          <NuxtLink to="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">
            зарегистрируйтесь
          </NuxtLink>
        </p>
      </header>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <article class="rounded-md shadow-sm -space-y-px">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Введите email"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Введите пароль"
            />
          </div>
        </article>

        <div v-if="error" class="text-red-600 text-sm text-center" role="alert">
          {{ error }}
        </div>

        <footer>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </button>
        </footer>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signIn } from '#auth'

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const result = await signIn('credentials', {
      email: email.value,
      password: password.value,
      redirect: true,
      callbackUrl: '/'
    })
  } catch (err: any) {
    error.value = err.message || 'Неверный email или пароль'
  } finally {
    isLoading.value = false
  }
}
</script>
