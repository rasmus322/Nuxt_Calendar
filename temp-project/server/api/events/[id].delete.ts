import { defineEventHandler, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ statusCode: 400, message: 'Event ID is required' })
  }

  await prisma.event.delete({
    where: { id }
  })

  return { success: true }
})
