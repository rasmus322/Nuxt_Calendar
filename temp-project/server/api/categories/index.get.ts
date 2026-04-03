import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })
})
