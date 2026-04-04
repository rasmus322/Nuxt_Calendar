import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
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
      userId: 'demo-user'
    },
    include: {
      category: true
    }
  })
})
