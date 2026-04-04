import { defineEventHandler, getRouterParam, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ statusCode: 400, message: 'Event ID is required' })
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
