<template>
  <main class="min-h-screen bg-gray-50">
    <!-- Навигация -->
    <header class="bg-white border-b border-gray-200 px-3 sm:px-4 py-3">
      <nav class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" aria-label="Навигация по календарю">
        <section class="flex items-center justify-between gap-2">
          <h1 class="text-lg sm:text-2xl font-bold text-gray-900">
            {{ getMonthName(currentDate) }} {{ currentDate.getFullYear() }}
          </h1>
          <button
            class="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50"
            @click="goToToday"
          >
            Сегодня
          </button>
        </section>

        <section class="flex items-center gap-2 flex-wrap">
          <!-- Переключение вида -->
          <nav class="inline-flex rounded-md shadow-sm" aria-label="Переключение вида календаря">
            <button
              v-for="viewOption in viewOptions"
              :key="viewOption.value"
              class="px-2 sm:px-4 py-2 text-xs sm:text-sm border"
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
            class="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="createEvent"
          >
            + Создать
          </button>
          <!-- Мобильная кнопка для категорий -->
          <button
            class="lg:hidden px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded bg-white hover:bg-gray-50"
            @click="toggleMobileCategoryFilter"
          >
            Фильтр
          </button>
        </section>
      </nav>
    </header>

    <!-- Основной контент -->
    <section class="flex">
      <!-- Боковая панель с категориями -->
      <aside class="w-64 p-4 border-r border-gray-200 bg-white hidden lg:block">
        <CategoryFilter
          :categories="categories"
          :selected-categories="selectedCategories"
          @toggle="toggleCategory"
          @clear="clearCategoryFilters"
        />
      </aside>

      <!-- Контент календаря -->
      <section class="flex-1 p-4">
      <CalendarMonth
        v-if="view === 'month'"
        :current-date="currentDate"
        :events="filteredEvents"
        @day-click="handleDayClick"
        @event-click="handleEventClick"
        @event-move="handleEventMove"
      />
      <CalendarWeek
        v-else-if="view === 'week'"
        :current-date="currentDate"
        :events="filteredEvents"
        @time-slot-click="handleTimeSlotClick"
        @event-click="handleEventClick"
        @event-move="handleEventMoveWeek"
      />
      <CalendarDay
        v-else-if="view === 'day'"
        :current-date="currentDate"
        :events="filteredEvents"
        @time-slot-click="handleDayTimeSlotClick"
        @event-click="handleEventClick"
        @event-move="handleEventMoveDay"
      />
      </section>
    </section>

    <!-- Мобильный фильтр -->
    <Teleport to="body">
      <aside
        v-if="isMobileFilterOpen"
        class="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
        @click="calendarStore.closeMobileFilter()"
      >
        <section
          class="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg p-4 max-h-[70vh] overflow-y-auto"
          @click.stop
        >
          <header class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Фильтр по категориям</h2>
            <button
              class="p-2 hover:bg-gray-100 rounded"
              @click="calendarStore.closeMobileFilter()"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>
          <CategoryFilter
            :categories="categories"
            :selected-categories="selectedCategories"
            @toggle="toggleCategory"
            @clear="clearCategoryFilters"
          />
        </section>
      </aside>
    </Teleport>

    <!-- Модальное окно для создания/редактирования -->
    <EventModal
      :is-open="isEventModalOpen"
      :event="selectedEvent"
      :categories="categories"
      :selected-date="selectedDateForNewEvent || currentDate"
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

const calendarStore = useCalendarStore()

const currentDate = computed(() => calendarStore.currentDate)
const view = computed(() => calendarStore.view)
const filteredEvents = computed(() => calendarStore.filteredEvents)
const categories = computed(() => calendarStore.categories)
const selectedCategories = computed(() => calendarStore.selectedCategories)
const isEventModalOpen = computed(() => calendarStore.isEventModalOpen)
const selectedEvent = computed(() => calendarStore.selectedEvent)
const isMobileFilterOpen = computed(() => calendarStore.isMobileFilterOpen)
const selectedDateForNewEvent = computed(() => calendarStore.selectedDateForNewEvent)

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
  calendarStore.openCreateModal(new Date())
}

const handleDayClick = (date: Date) => {
  calendarStore.setCurrentDate(date)
  calendarStore.openCreateModal(date)
}

const handleEventClick = (event: any) => {
  calendarStore.openEditModal(event)
}

const handleTimeSlotClick = (date: Date, hour: number) => {
  calendarStore.setCurrentDate(date)
  calendarStore.openCreateModal(date)
}

const handleDayTimeSlotClick = (hour: number) => {
  calendarStore.openCreateModal(currentDate.value)
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

const clearCategoryFilters = () => {
  calendarStore.selectedCategories = []
}

const toggleMobileCategoryFilter = () => {
  calendarStore.toggleMobileFilter()
}

// Drag & Drop handlers
const handleEventMove = async (eventId: string, newDate: Date) => {
  // Находим событие
  const event = calendarStore.events.find(e => e.id === eventId)
  if (!event) return

  const oldStart = new Date(event.start)
  const oldEnd = new Date(event.end)
  const duration = oldEnd.getTime() - oldStart.getTime()

  // Создаем новые даты с сохранением времени
  const newStart = new Date(newDate)
  newStart.setHours(oldStart.getHours(), oldStart.getMinutes(), oldStart.getSeconds())
  
  const newEnd = new Date(newStart.getTime() + duration)

  await calendarStore.updateEvent(eventId, {
    start: newStart.toISOString(),
    end: newEnd.toISOString()
  })

  // Перезагружаем ивенты
  const start = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  const end = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)
  await calendarStore.fetchEvents(start, end)
}

const handleEventMoveWeek = async (eventId: string, newDate: Date, newHour: number) => {
  const event = calendarStore.events.find(e => e.id === eventId)
  if (!event) return

  const oldStart = new Date(event.start)
  const oldEnd = new Date(event.end)
  const duration = oldEnd.getTime() - oldStart.getTime()

  const newStart = new Date(newDate)
  newStart.setHours(newHour, oldStart.getMinutes(), oldStart.getSeconds())
  
  const newEnd = new Date(newStart.getTime() + duration)

  await calendarStore.updateEvent(eventId, {
    start: newStart.toISOString(),
    end: newEnd.toISOString()
  })

  const start = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  const end = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)
  await calendarStore.fetchEvents(start, end)
}

const handleEventMoveDay = async (eventId: string, newHour: number) => {
  const event = calendarStore.events.find(e => e.id === eventId)
  if (!event) return

  const oldStart = new Date(event.start)
  const oldEnd = new Date(event.end)
  const duration = oldEnd.getTime() - oldStart.getTime()

  const newStart = new Date(oldStart)
  newStart.setHours(newHour, oldStart.getMinutes(), oldStart.getSeconds())
  
  const newEnd = new Date(newStart.getTime() + duration)

  await calendarStore.updateEvent(eventId, {
    start: newStart.toISOString(),
    end: newEnd.toISOString()
  })

  const start = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  const end = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)
  await calendarStore.fetchEvents(start, end)
}
</script>
