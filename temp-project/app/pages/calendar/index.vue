<template>
  <main class="min-h-screen bg-gray-50">
    <!-- Навигация -->
    <header class="bg-white border-b border-gray-200 px-4 py-3">
      <nav class="flex items-center justify-between" aria-label="Навигация по календарю">
        <section class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ getMonthName(currentDate) }} {{ currentDate.getFullYear() }}
          </h1>
          <button
            class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            @click="goToToday"
          >
            Сегодня
          </button>
        </section>

        <section class="flex items-center gap-2">
          <!-- Переключение вида -->
          <nav class="inline-flex rounded-md shadow-sm" aria-label="Переключение вида календаря">
            <button
              v-for="viewOption in viewOptions"
              :key="viewOption.value"
              class="px-4 py-2 text-sm border"
              :class="{
                'bg-blue-600 text-white border-blue-600': view === viewOption.value,
                'bg-white text-gray-700 hover:bg-gray-50 border-gray-300': view !== viewOption.value
              }"
              @click="changeView(viewOption.value)"
            >
              {{ viewOption.label }}
            </button>
          </nav>

          <!-- Навигация по месяцам/неделям/дням -->
          <button
            class="p-2 hover:bg-gray-100 rounded"
            :aria-label="view === 'month' ? 'Предыдущий месяц' : view === 'week' ? 'Предыдущая неделя' : 'Предыдущий день'"
            @click="goToPrev"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            class="p-2 hover:bg-gray-100 rounded"
            :aria-label="view === 'month' ? 'Следующий месяц' : view === 'week' ? 'Следующая неделя' : 'Следующий день'"
            @click="goToNext"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </section>

        <section class="flex items-center gap-2">
          <button
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="createEvent"
          >
            + Создать
          </button>
          <!-- Фильтр по категориям -->
          <details class="relative">
            <summary class="px-4 py-2 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 cursor-pointer">
              Категории
            </summary>
            <ul class="absolute right-0 mt-2 p-2 bg-white border border-gray-200 rounded shadow-lg min-w-48">
              <li v-for="category in categories" :key="category.id">
                <label class="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    :checked="selectedCategories.includes(category.id)"
                    :value="category.id"
                    @change="toggleCategory(category.id)"
                  />
                  <span
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: category.color }"
                  ></span>
                  <span class="text-sm">{{ category.name }}</span>
                </label>
              </li>
            </ul>
          </details>
        </section>
      </nav>
    </header>

    <!-- Контент календаря -->
    <section class="flex-1 p-4">
      <CalendarMonth
        v-if="view === 'month'"
        :current-date="currentDate"
        :events="filteredEvents"
        @day-click="handleDayClick"
        @event-click="handleEventClick"
      />
      <CalendarWeek
        v-else-if="view === 'week'"
        :current-date="currentDate"
        :events="filteredEvents"
        @time-slot-click="handleTimeSlotClick"
        @event-click="handleEventClick"
      />
      <CalendarDay
        v-else-if="view === 'day'"
        :current-date="currentDate"
        :events="filteredEvents"
        @time-slot-click="handleDayTimeSlotClick"
        @event-click="handleEventClick"
      />
    </section>

    <!-- Модальное окно для создания/редактирования -->
    <EventModal
      :is-open="isEventModalOpen"
      :event="selectedEvent"
      :categories="categories"
      @close="closeModal"
      @save="handleSaveEvent"
      @delete="handleDeleteEvent"
    />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCalendarStore } from '~/stores/calendar'
import { getMonthName } from '~/utils/date'

definePageMeta({
  middleware: 'auth'
})

const calendarStore = useCalendarStore()

const currentDate = computed(() => calendarStore.currentDate)
const view = computed(() => calendarStore.view)
const filteredEvents = computed(() => calendarStore.filteredEvents)
const categories = computed(() => calendarStore.categories)
const selectedCategories = computed(() => calendarStore.selectedCategories)
const isEventModalOpen = computed(() => calendarStore.isEventModalOpen)
const selectedEvent = computed(() => calendarStore.selectedEvent)

const viewOptions = [
  { label: 'День', value: 'day' },
  { label: 'Неделя', value: 'week' },
  { label: 'Месяц', value: 'month' }
]

onMounted(async () => {
  // Загружаем категории
  await calendarStore.fetchCategories()
  
  // Загружаем ивенты для текущего месяца
  const start = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  const end = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)
  await calendarStore.fetchEvents(start, end)
})

const changeView = (view: any) => {
  calendarStore.setView(view)
}

const goToToday = () => {
  calendarStore.setCurrentDate(new Date())
}

const goToPrev = () => {
  const date = new Date(currentDate.value)
  if (view.value === 'month') {
    date.setMonth(date.getMonth() - 1)
  } else if (view.value === 'week') {
    date.setDate(date.getDate() - 7)
  } else {
    date.setDate(date.getDate() - 1)
  }
  calendarStore.setCurrentDate(date)
}

const goToNext = () => {
  const date = new Date(currentDate.value)
  if (view.value === 'month') {
    date.setMonth(date.getMonth() + 1)
  } else if (view.value === 'week') {
    date.setDate(date.getDate() + 7)
  } else {
    date.setDate(date.getDate() + 1)
  }
  calendarStore.setCurrentDate(date)
}

const createEvent = () => {
  calendarStore.openCreateModal()
}

const handleDayClick = (date: Date) => {
  calendarStore.setCurrentDate(date)
  calendarStore.openCreateModal()
}

const handleEventClick = (event: any) => {
  calendarStore.openEditModal(event)
}

const handleTimeSlotClick = (date: Date, hour: number) => {
  calendarStore.setCurrentDate(date)
  calendarStore.openCreateModal()
}

const handleDayTimeSlotClick = (hour: number) => {
  calendarStore.openCreateModal()
}

const closeModal = () => {
  calendarStore.closeModal()
}

const handleSaveEvent = async (data: any) => {
  if (selectedEvent.value) {
    await calendarStore.updateEvent(selectedEvent.value.id, data)
  } else {
    await calendarStore.createEvent(data)
  }
  
  // Перезагружаем ивенты
  const start = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  const end = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)
  await calendarStore.fetchEvents(start, end)
}

const handleDeleteEvent = async (id: string) => {
  await calendarStore.deleteEvent(id)
  
  // Перезагружаем ивенты
  const start = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  const end = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)
  await calendarStore.fetchEvents(start, end)
}

const toggleCategory = (categoryId: string) => {
  calendarStore.toggleCategory(categoryId)
}
</script>
