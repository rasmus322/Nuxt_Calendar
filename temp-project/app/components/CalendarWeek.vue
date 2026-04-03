<template>
  <section class="calendar-week bg-white" aria-label="Недельный вид календаря">
    <!-- Заголовок с днями недели -->
    <header class="grid grid-cols-8 border-b border-gray-200 sticky top-0 bg-white z-10">
      <div class="p-2 text-center text-xs text-gray-500 border-r border-gray-200">
        Время
      </div>
      <div
        v-for="(day, index) in weekDays"
        :key="index"
        class="p-2 text-center border-r border-gray-200 last:border-r-0"
        :class="{ 'bg-blue-50': isToday(day) }"
        role="columnheader"
      >
        <div class="text-sm font-semibold text-gray-900">
          {{ getShortDayName(day) }}
        </div>
        <time
          :datetime="formatDate(day)"
          class="text-2xl mt-1 inline-block"
          :class="{ 'text-blue-600 font-bold': isToday(day) }"
        >
          {{ day.getDate() }}
        </time>
      </div>
    </header>

    <!-- Сетка с временными слотами -->
    <div class="grid grid-cols-8 overflow-auto max-h-screen" role="grid">
      <!-- Временная колонка -->
      <div class="border-r border-gray-200">
        <div
          v-for="hour in hours"
          :key="hour"
          class="h-16 text-xs text-gray-500 text-right pr-2 pt-1"
        >
          {{ `${String(hour).padStart(2, '0')}:00` }}
        </div>
      </div>

      <!-- Дни недели -->
      <div
        v-for="(day, dayIndex) in weekDays"
        :key="dayIndex"
        class="border-r border-gray-200 last:border-r-0 relative"
        role="gridcell"
      >
        <!-- Часовые слоты -->
        <div
          v-for="hour in hours"
          :key="hour"
          class="h-16 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
          @click="handleTimeSlotClick(day, hour)"
        ></div>

        <!-- Ивенты -->
        <div
          v-for="event in getEventsForDay(day)"
          :key="event.id"
          class="absolute left-1 right-1 rounded px-2 py-1 text-xs cursor-pointer hover:opacity-80 overflow-hidden"
          :style="{
            backgroundColor: event.color || event.category?.color || '#3B82F6',
            color: 'white',
            top: `${getEventTopPosition(event)}px`,
            height: `${getEventHeight(event)}px`
          }"
          :title="event.title"
          @click="handleEventClick(event)"
        >
          <div class="font-semibold">{{ event.title }}</div>
          <div class="text-xs opacity-90">
            {{ formatTime(new Date(event.start)) }} - {{ formatTime(new Date(event.end)) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CalendarEvent } from '~/types/calendar'
import { getWeekDays, isToday, formatDate, formatTime, getShortDayName } from '~/utils/date'

const props = defineProps<{
  currentDate: Date
  events: CalendarEvent[]
}>()

const emit = defineEmits<{
  timeSlotClick: [date: Date, hour: number]
  eventClick: [event: CalendarEvent]
}>()

const weekDays = computed(() => getWeekDays(props.currentDate))
const hours = Array.from({ length: 24 }, (_, i) => i)

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

const getEventTopPosition = (event: CalendarEvent) => {
  const startDate = new Date(event.start)
  const hours = startDate.getHours()
  const minutes = startDate.getMinutes()
  return (hours * 60 + minutes) / 60 * 64 // 64px - высота одного часа
}

const getEventHeight = (event: CalendarEvent) => {
  const startDate = new Date(event.start)
  const endDate = new Date(event.end)
  const durationMs = endDate.getTime() - startDate.getTime()
  const durationHours = durationMs / (1000 * 60 * 60)
  return durationHours * 64 // 64px - высота одного часа
}

const handleTimeSlotClick = (date: Date, hour: number) => {
  emit('timeSlotClick', date, hour)
}

const handleEventClick = (event: CalendarEvent) => {
  emit('eventClick', event)
}
</script>
