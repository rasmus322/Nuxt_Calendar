import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Создаем начальные категории
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Работа' },
      update: {},
      create: { name: 'Работа', color: '#3B82F6' },
    }),
    prisma.category.upsert({
      where: { name: 'Личное' },
      update: {},
      create: { name: 'Личное', color: '#10B981' },
    }),
    prisma.category.upsert({
      where: { name: 'Важное' },
      update: {},
      create: { name: 'Важное', color: '#EF4444' },
    }),
    prisma.category.upsert({
      where: { name: 'Здоровье' },
      update: {},
      create: { name: 'Здоровье', color: '#F59E0B' },
    }),
    prisma.category.upsert({
      where: { name: 'Образование' },
      update: {},
      create: { name: 'Образование', color: '#8B5CF6' },
    }),
  ])

  console.log('Created categories:', categories)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
