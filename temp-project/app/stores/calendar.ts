import { defineStore } from 'pinia'
import type { CalendarEvent, Category, CalendarView } from '~/types/calendar'

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    currentDate: new Date(),
    view: 'month' as CalendarView,
    events: [] as CalendarEvent[],
    categories: [] as Category[],
    selectedCategories: [] as string[],
    isLoading: false,
    selectedEvent: null as CalendarEvent | null,
    isEventModalOpen: false,
  }),

  getters: {
    filteredEvents: (state) => {
      if (state.selectedCategories.length === 0) {
        return state.events
      }
      return state.events.filter(event => 
        event.categoryId && state.selectedCategories.includes(event.categoryId)
      )
    },

    getEventsForDate: (state) => (date: Date) => {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      return state.filteredEvents.filter(event => {
        const eventStart = new Date(event.start)
        return eventStart >= startOfDay && eventStart <= endOfDay
      })
    },
  },

  actions: {
    setCurrentDate(date: Date) {
      this.currentDate = date
    },

    setView(view: CalendarView) {
      this.view = view
    },

    async fetchEvents(startDate: Date, endDate: Date) {
      this.isLoading = true
      try {
        const events = await $fetch<CalendarEvent[]>('/api/events', {
          query: {
            start: startDate.toISOString(),
            end: endDate.toISOString()
          }
        })
        this.events = events
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchCategories() {
      try {
        const categories = await $fetch<Category[]>('/api/categories')
        this.categories = categories
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    },

    async createEvent(data: any) {
      const event = await $fetch<CalendarEvent>('/api/events', {
        method: 'POST',
        body: data
      })
      this.events.push(event)
      this.isEventModalOpen = false
    },

    async updateEvent(id: string, data: any) {
      const event = await $fetch<CalendarEvent>(`/api/events/${id}`, {
        method: 'PUT',
        body: data
      })
      const index = this.events.findIndex(e => e.id === id)
      if (index !== -1) {
        this.events[index] = event
      }
      this.selectedEvent = null
      this.isEventModalOpen = false
    },

    async deleteEvent(id: string) {
      await $fetch(`/api/events/${id}`, {
        method: 'DELETE'
      })
      this.events = this.events.filter(e => e.id !== id)
      this.selectedEvent = null
      this.isEventModalOpen = false
    },

    openCreateModal() {
      this.selectedEvent = null
      this.isEventModalOpen = true
    },

    openEditModal(event: CalendarEvent) {
      this.selectedEvent = event
      this.isEventModalOpen = true
    },

    closeModal() {
      this.isEventModalOpen = false
      this.selectedEvent = null
    },

    toggleCategory(categoryId: string) {
      const index = this.selectedCategories.indexOf(categoryId)
      if (index === -1) {
        this.selectedCategories.push(categoryId)
      } else {
        this.selectedCategories.splice(index, 1)
      }
    },
  },
})
