export interface Category {
  id: string
  name: string
  color: string
}

export interface CalendarEvent {
  id: string
  title: string
  description: string | null
  start: string
  end: string
  color: string | null
  userId: string
  categoryId: string | null
  category?: Category
  createdAt: string
  updatedAt: string
}

export type CalendarView = 'month' | 'week' | 'day'

export interface EventFormData {
  title: string
  description: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  categoryId: string | null
  color: string
}
