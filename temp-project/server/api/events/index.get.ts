import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const start = query.start ? new Date(query.start as string) : undefined
  const end = query.end ? new Date(query.end as string) : undefined

  return await prisma.event.findMany({
    where: {
      ...(start && end && {
        start: { gte: start },
        end: { lte: end }
      })
    },
    include: {
      category: true
    },
    orderBy: {
      start: 'asc'
    }
  })
})
