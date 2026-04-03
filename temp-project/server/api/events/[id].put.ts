import { defineEventHandler, getRouterParam, readBody } from 'h3'
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

  const body = await readBody(event)
  const { title, description, start, end, categoryId, color } = body

  return await prisma.event.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(start && { start: new Date(start) }),
      ...(end && { end: new Date(end) }),
      ...(categoryId !== undefined && { categoryId }),
      ...(color !== undefined && { color })
    },
    include: {
      category: true
    }
  })
})
