<template>
  <section class="calendar-month" aria-label="Месячный вид календаря">
    <!-- Заголовок с днями недели -->
    <header class="grid grid-cols-7 gap-px mb-2" role="rowgroup">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-sm font-semibold text-gray-600 py-2"
        role="columnheader"
      >
        {{ day }}
      </div>
    </header>

    <!-- Сетка календаря -->
    <div class="grid grid-cols-7 gap-px flex-grow" role="grid">
      <article
        v-for="(day, index) in days"
        :key="index"
        class="min-h-24 bg-white border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 transition-colors"
        :class="{
          'bg-gray-50': day.getMonth() !== currentDate.getMonth(),
          'ring-2 ring-blue-500': isToday(day),
          'bg-blue-50 border-blue-300': isDropTarget === formatDate(day)
        }"
        role="gridcell"
        :aria-label="`${day.getDate()} ${getMonthName(day)}`"
        @click="handleDayClick(day)"
        @dragover.prevent="handleDragOver(day)"
        @dragleave="handleDragLeave"
        @drop="handleDrop(day)"
      >
        <time
          :datetime="formatDate(day)"
          class="block text-sm mb-1"
          :class="{
            'text-gray-400': day.getMonth() !== currentDate.getMonth(),
            'font-bold text-blue-600': isToday(day),
            'font-semibold': !isToday(day)
          }"
        >
          {{ day.getDate() }}
        </time>

        <!-- Ивенты на день -->
        <ul class="space-y-1" aria-label="Ивенты на {{ day.getDate() }}">
          <li
            v-for="event in getEventsForDay(day)"
            :key="event.id"
            class="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
            :style="{ backgroundColor: event.color || event.category?.color || '#3B82F6' }"
            :title="event.title"
            role="listitem"
            draggable="true"
            @click.stop="handleEventClick(event)"
            @dragstart="handleDragStart($event, event)"
            @dragend="handleDragEnd"
          >
            {{ event.title }}
          </li>
          <li
            v-if="getEventsForDay(day).length > 3"
            class="text-xs text-gray-500 pl-2"
          >
            +{{ getEventsForDay(day).length - 3 }} ещё
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CalendarEvent } from '~/types/calendar'
import { getDaysInMonth, getShortDayName, isToday, formatDate, getMonthName } from '~/utils/date'

const props = defineProps<{
  currentDate: Date
  events: CalendarEvent[]
}>()

const emit = defineEmits<{
  dayClick: [date: Date]
  eventClick: [event: CalendarEvent]
  eventMove: [eventId: string, newDate: Date]
}>()

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const draggedEvent = ref<CalendarEvent | null>(null)
const isDropTarget = ref<string | null>(null)

const days = computed(() => getDaysInMonth(props.currentDate))

const getEventsForDay = (date: Date) => {
  return props.events.filter(event => {
    const eventDate = new Date(event.start)
    return (
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate()
    )
  })
}

const handleDayClick = (date: Date) => {
  emit('dayClick', date)
}

const handleEventClick = (event: CalendarEvent) => {
  emit('eventClick', event)
}

const handleDragStart = (event: DragEvent, calendarEvent: CalendarEvent) => {
  draggedEvent.value = calendarEvent
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', calendarEvent.id)
  }
}

const handleDragEnd = () => {
  draggedEvent.value = null
  isDropTarget.value = null
}

const handleDragOver = (day: Date) => {
  isDropTarget.value = formatDate(day)
}

const handleDragLeave = () => {
  isDropTarget.value = null
}

const handleDrop = (day: Date) => {
  isDropTarget.value = null
  
  if (draggedEvent.value) {
    emit('eventMove', draggedEvent.value.id, day)
    draggedEvent.value = null
  }
}
</script>
