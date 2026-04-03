import { defineEventHandler, getQuery } from 'h3'
import prisma from '~/server/utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const query = getQuery(event)
  const start = query.start ? new Date(query.start as string) : undefined
  const end = query.end ? new Date(query.end as string) : undefined

  return await prisma.event.findMany({
    where: {
      userId: session.user.id,
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
