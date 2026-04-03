export function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  // Определяем день недели для 1-го числа (0 - воскресенье, 1 - понедельник, ...)
  const startDayOfWeek = firstDayOfMonth.getDay()
  // Корректируем, чтобы неделя начиналась с понедельника
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
  
  const days: Date[] = []
  
  // Добавляем дни предыдущего месяца
  for (let i = adjustedStartDay - 1; i >= 0; i--) {
    const prevMonthDay = new Date(year, month, -i)
    days.push(prevMonthDay)
  }
  
  // Добавляем дни текущего месяца
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    days.push(new Date(year, month, day))
  }
  
  // Добавляем дни следующего месяца, чтобы заполнить сетку
  const remainingDays = 42 - days.length // 6 недель * 7 дней
  for (let day = 1; day <= remainingDays; day++) {
    const nextMonthDay = new Date(year, month + 1, day)
    days.push(nextMonthDay)
  }
  
  return days
}

export function getWeekDays(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  
  const currentDate = new Date(year, month, day)
  const dayOfWeek = currentDate.getDay()
  const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  
  const weekDays: Date[] = []
  
  // Добавляем 7 дней недели
  for (let i = 0; i < 7; i++) {
    const weekDay = new Date(year, month, day - adjustedDayOfWeek + i)
    weekDays.push(weekDay)
  }
  
  return weekDays
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatTime(date: Date): string {
  return date.toTimeString().slice(0, 5)
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function getMonthName(date: Date): string {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]
  return months[date.getMonth()]
}

export function getDayName(date: Date): string {
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
  return days[date.getDay()]
}

export function getShortDayName(date: Date): string {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  return days[date.getDay()]
}
