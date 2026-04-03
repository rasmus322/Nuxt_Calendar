import { defineEventHandler, readBody } from 'h3'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { title, description, start, end, categoryId, color } = body

  if (!title || !start || !end) {
    throw createError({ 
      statusCode: 400, 
      message: 'Title, start date, and end date are required' 
    })
  }

  return await prisma.event.create({
    data: {
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      categoryId,
      color,
      userId: session.user.id
    },
    include: {
      category: true
    }
  })
})
