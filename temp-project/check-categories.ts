import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
  
  console.log('Categories in database:', categories.length)
  categories.forEach((cat, i) => {
    console.log(`${i + 1}. ${cat.name} (${cat.color})`)
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
