import { createError, defineEventHandler, readBody } from 'h3'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, message: 'Method not allowed' })
  }

  const body = await readBody(event)
  const { email, password, name } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    })
  }

  // Проверяем, существует ли пользователь
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'User with this email already exists'
    })
  }

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash(password, 10)

  // Создаем пользователя
  const user = await prisma.user.create({
    data: {
      email,
      name: name || email.split('@')[0],
      password: hashedPassword
    }
  })

  return {
    id: user.id,
    email: user.email,
    name: user.name
  }
})
