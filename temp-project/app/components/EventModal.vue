<template>
  <Teleport to="body">
    <aside
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="dialogTitle"
      @click="handleBackdropClick"
    >
      <section class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
        <!-- Заголовок -->
        <header class="px-6 py-4 border-b border-gray-200">
          <h2 :id="dialogTitle" class="text-xl font-semibold text-gray-900">
            {{ isEditing ? 'Редактировать событие' : 'Создать событие' }}
          </h2>
        </header>

        <!-- Форма -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <!-- Название -->
          <div>
            <label for="event-title" class="block text-sm font-medium text-gray-700 mb-1">
              Название *
            </label>
            <input
              id="event-title"
              v-model="formData.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите название события"
            />
          </div>

          <!-- Описание -->
          <div>
            <label for="event-description" class="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              id="event-description"
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Добавьте описание (необязательно)"
            ></textarea>
          </div>

          <!-- Дата и время начала -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="event-start-date" class="block text-sm font-medium text-gray-700 mb-1">
                Дата начала *
              </label>
              <input
                id="event-start-date"
                v-model="formData.startDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="event-start-time" class="block text-sm font-medium text-gray-700 mb-1">
                Время начала *
              </label>
              <input
                id="event-start-time"
                v-model="formData.startTime"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Дата и время окончания -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="event-end-date" class="block text-sm font-medium text-gray-700 mb-1">
                Дата окончания *
              </label>
              <input
                id="event-end-date"
                v-model="formData.endDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="event-end-time" class="block text-sm font-medium text-gray-700 mb-1">
                Время окончания *
              </label>
              <input
                id="event-end-time"
                v-model="formData.endTime"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Категория -->
          <div>
            <label for="event-category" class="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              id="event-category"
              v-model="formData.categoryId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Без категории</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Ошибки -->
          <div v-if="error" class="text-red-600 text-sm" role="alert">
            {{ error }}
          </div>

          <!-- Кнопки -->
          <footer class="flex gap-3 pt-4">
            <button
              v-if="isEditing"
              type="button"
              class="flex-1 px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
              @click="handleDelete"
            >
              Удалить
            </button>
            <button
              type="button"
              class="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              @click="handleCancel"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Сохранение...' : (isEditing ? 'Сохранить' : 'Создать') }}
            </button>
          </footer>
        </form>
      </section>
    </aside>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { CalendarEvent, EventFormData, Category } from '~/types/calendar'

const props = defineProps<{
  isOpen: boolean
  event: CalendarEvent | null
  categories: Category[]
  selectedDate?: Date | null
}>()

const emit = defineEmits<{
  close: []
  save: [data: EventFormData]
  delete: [id: string]
}>()

const dialogTitle = computed(() => props.event ? 'Редактировать событие' : 'Создать событие')
const isEditing = computed(() => !!props.event)

const formData = ref<EventFormData>({
  title: '',
  description: '',
  startDate: '',
  startTime: '09:00',
  endDate: '',
  endTime: '10:00',
  categoryId: null,
  color: '#3B82F6'
})

const error = ref('')
const isSubmitting = ref(false)

const colorOptions = [
  '#3B82F6', // Синий
  '#10B981', // Зеленый
  '#EF4444', // Красный
  '#F59E0B', // Желтый
  '#8B5CF6', // Фиолетовый
  '#EC4899', // Розовый
  '#14B8A6', // Бирюзовый
  '#6B7280', // Серый
]

// Получаем цвет на основе выбранной категории
const selectedCategoryColor = computed(() => {
  if (!formData.value.categoryId) return '#3B82F6' // Default color
  const category = props.categories.find(c => c.id === formData.value.categoryId)
  return category?.color || '#3B82F6'
})

// Заполняем форму при открытии
watch(() => [props.event, props.isOpen, props.selectedDate], ([event, isOpen, selectedDate]) => {
  if (event) {
    const startDate = new Date(event.start)
    const endDate = new Date(event.end)

    formData.value = {
      title: event.title,
      description: event.description || '',
      startDate: startDate.toISOString().split('T')[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endDate: endDate.toISOString().split('T')[0],
      endTime: endDate.toTimeString().slice(0, 5),
      categoryId: event.categoryId || null,
      color: event.color || event.category?.color || '#3B82F6'
    }
  } else if (isOpen) {
    // Для нового события используем выбранную дату или сегодня
    const baseDate = selectedDate || new Date()
    const now = new Date()

    // Создаем дату начала на основе selectedDate, но с текущим временем
    // Используем локализованные методы для корректной работы с часовыми поясами
    const year = baseDate.getFullYear()
    const month = String(baseDate.getMonth() + 1).padStart(2, '0')
    const day = String(baseDate.getDate()).padStart(2, '0')
    const startDateStr = `${year}-${month}-${day}`
    
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const startTimeStr = `${hours}:${minutes}`
    
    // Создаем дату окончания (через час)
    const endHours = now.getHours() + 1
    const endTimeStr = `${String(endHours).padStart(2, '0')}:${minutes}`

    formData.value = {
      title: '',
      description: '',
      startDate: startDateStr,
      startTime: startTimeStr,
      endDate: startDateStr,
      endTime: endTimeStr,
      categoryId: null,
      color: selectedCategoryColor.value
    }
  }
}, { immediate: true })

// Автоматически обновляем цвет при смене категории
watch(() => formData.value.categoryId, () => {
  formData.value.color = selectedCategoryColor.value
})

const handleSubmit = async () => {
  error.value = ''
  isSubmitting.value = true

  try {
    // Валидация
    if (!formData.value.title) {
      error.value = 'Название обязательно'
      return
    }

    const startDateTime = new Date(`${formData.value.startDate}T${formData.value.startTime}`)
    const endDateTime = new Date(`${formData.value.endDate}T${formData.value.endTime}`)

    if (endDateTime <= startDateTime) {
      error.value = 'Дата окончания должна быть позже даты начала'
      return
    }

    emit('save', {
      ...formData.value,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString()
    })
  } catch (err: any) {
    error.value = err.message || 'Ошибка при сохранении'
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  emit('close')
}

const handleDelete = () => {
  if (props.event) {
    emit('delete', props.event.id)
  }
}

const handleBackdropClick = () => {
  emit('close')
}
</script>
