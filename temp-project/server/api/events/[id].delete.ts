import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '~/server/utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ statusCode: 400, message: 'Event ID is required' })
  }

  // Проверяем, принадлежит ли ивент пользователю
  const existingEvent = await prisma.event.findFirst({
    where: { id, userId: session.user.id }
  })

  if (!existingEvent) {
    throw createError({ statusCode: 404, message: 'Event not found' })
  }

  await prisma.event.delete({
    where: { id }
  })

  return { success: true }
})
