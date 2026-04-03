<template>
  <section class="calendar-day bg-white" aria-label="Дневной вид календаря">
    <!-- Заголовок с датой -->
    <header class="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
      <div class="text-center">
        <div class="text-sm font-semibold text-gray-600">
          {{ getDayName(currentDate) }}
        </div>
        <time
          :datetime="formatDate(currentDate)"
          class="text-3xl font-bold text-gray-900 mt-1 inline-block"
          :class="{ 'text-blue-600': isToday(currentDate) }"
        >
          {{ currentDate.getDate() }} {{ getMonthName(currentDate) }}
        </time>
      </div>
    </header>

    <!-- Сетка с временными слотами -->
    <div class="grid grid-cols-4 overflow-auto" role="grid">
      <!-- Временная колонка -->
      <div class="col-span-1 border-r border-gray-200">
        <div
          v-for="hour in hours"
          :key="hour"
          class="h-20 text-xs text-gray-500 text-right pr-3 pt-2 border-b border-gray-100"
        >
          {{ `${String(hour).padStart(2, '0')}:00` }}
        </div>
      </div>

      <!-- Область ивентов -->
      <div class="col-span-3 relative" role="gridcell">
        <!-- Часовые слоты -->
        <div
          v-for="hour in hours"
          :key="hour"
          class="h-20 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
          :class="{ 'bg-blue-50': isDropTarget === hour }"
          @click="handleTimeSlotClick(hour)"
          @dragover.prevent="handleDragOver(hour)"
          @dragleave="handleDragLeave"
          @drop="handleDrop(hour)"
        ></div>

        <!-- Ивенты -->
        <div
          v-for="event in dayEvents"
          :key="event.id"
          class="absolute left-2 right-2 rounded px-3 py-2 text-sm cursor-pointer hover:opacity-80 overflow-hidden"
          :style="{
            backgroundColor: event.color || event.category?.color || '#3B82F6',
            color: 'white',
            top: `${getEventTopPosition(event)}px`,
            height: `${getEventHeight(event)}px`
          }"
          :title="event.title"
          draggable="true"
          @click="handleEventClick(event)"
          @dragstart="handleDragStart($event, event)"
          @dragend="handleDragEnd"
        >
          <div class="font-semibold">{{ event.title }}</div>
          <div class="text-xs opacity-90 mt-1">
            {{ formatTime(new Date(event.start)) }} - {{ formatTime(new Date(event.end)) }}
          </div>
          <div v-if="event.description" class="text-xs opacity-75 mt-1 truncate">
            {{ event.description }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CalendarEvent } from '~/types/calendar'
import { isToday, formatDate, formatTime, getDayName, getMonthName } from '~/utils/date'

const props = defineProps<{
  currentDate: Date
  events: CalendarEvent[]
}>()

const emit = defineEmits<{
  timeSlotClick: [hour: number]
  eventClick: [event: CalendarEvent]
  eventMove: [eventId: string, newHour: number]
}>()

const hours = Array.from({ length: 24 }, (_, i) => i)
const draggedEvent = ref<CalendarEvent | null>(null)
const isDropTarget = ref<number | null>(null)

const dayEvents = computed(() => {
  return props.events.filter(event => {
    const eventDate = new Date(event.start)
    return (
      eventDate.getFullYear() === props.currentDate.getFullYear() &&
      eventDate.getMonth() === props.currentDate.getMonth() &&
      eventDate.getDate() === props.currentDate.getDate()
    )
  })
})

const getEventTopPosition = (event: CalendarEvent) => {
  const startDate = new Date(event.start)
  const hours = startDate.getHours()
  const minutes = startDate.getMinutes()
  return (hours * 60 + minutes) / 60 * 80 // 80px - высота одного часа
}

const getEventHeight = (event: CalendarEvent) => {
  const startDate = new Date(event.start)
  const endDate = new Date(event.end)
  const durationMs = endDate.getTime() - startDate.getTime()
  const durationHours = durationMs / (1000 * 60 * 60)
  return durationHours * 80 // 80px - высота одного часа
}

const handleTimeSlotClick = (hour: number) => {
  emit('timeSlotClick', hour)
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

const handleDragOver = (hour: number) => {
  isDropTarget.value = hour
}

const handleDragLeave = () => {
  isDropTarget.value = null
}

const handleDrop = (hour: number) => {
  isDropTarget.value = null
  
  if (draggedEvent.value) {
    emit('eventMove', draggedEvent.value.id, hour)
    draggedEvent.value = null
  }
}
</script>
