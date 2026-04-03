// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt',
    '@sidebase/nuxt-auth',
  ],

  css: ['~/assets/css/main.css'],

  auth: {
    provider: {
      type: 'authjs',
      origin: process.env.AUTH_ORIGIN || 'http://localhost:3000',
    },
  },

  typescript: {
    strict: true,
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
})
