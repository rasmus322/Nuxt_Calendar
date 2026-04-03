<template>
  <aside class="bg-white rounded-lg shadow p-4" aria-label="Фильтр по категориям">
    <header class="mb-3">
      <h2 class="text-sm font-semibold text-gray-900">Категории</h2>
    </header>

    <ul class="space-y-2">
      <li v-for="category in categories" :key="category.id">
        <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1">
          <input
            type="checkbox"
            :checked="selectedCategories.includes(category.id)"
            :value="category.id"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            @change="toggleCategory(category.id)"
          />
          <span
            class="w-3 h-3 rounded-full flex-shrink-0"
            :style="{ backgroundColor: category.color }"
            :aria-hidden="true"
          ></span>
          <span class="text-sm text-gray-700">{{ category.name }}</span>
        </label>
      </li>
    </ul>

    <footer v-if="selectedCategories.length > 0" class="mt-3 pt-3 border-t border-gray-200">
      <button
        class="text-xs text-blue-600 hover:text-blue-700"
        @click="clearFilters"
      >
        Сбросить фильтры
      </button>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import type { Category } from '~/types/calendar'

const props = defineProps<{
  categories: Category[]
  selectedCategories: string[]
}>()

const emit = defineEmits<{
  toggle: [categoryId: string]
  clear: []
}>()

const toggleCategory = (categoryId: string) => {
  emit('toggle', categoryId)
}

const clearFilters = () => {
  emit('clear')
}
</script>
