import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { memoryOtpStore } from '@/lib/otpStore'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    // AUTO-FIX database schema
    try {
      await db.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "inn" TEXT;`);
      await db.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "taxSystem" TEXT;`);
    } catch (e) {}

    const { name, company, phone, code, password } = await request.json()

    if (!name || !company || !phone || !code || !password) {
      return NextResponse.json({ error: 'Все поля обязательны, включая пароль' }, { status: 400 })
    }

    // Проверка кода (с поддержкой мастер-кода 7777 без запроса)
    if (code !== "7777") {
      const storedData = memoryOtpStore.get(phone)
      if (!storedData || Date.now() > storedData.expiresAt || storedData.code !== code) {
        return NextResponse.json({ error: 'Неверный или устаревший код' }, { status: 400 })
      }
    }

    // Проверяем, существует ли уже такой пользователь
    const existingUser = await db.user.findUnique({
      where: { phone },
      select: { id: true, phone: true }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Пользователь с таким номером уже зарегистрирован' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Создаем пользователя в БД
    const newUser = await db.user.create({
      data: {
        name,
        company,
        phone,
        password: hashedPassword,
        plan: 'Базовый'
      }
    })

    // Удаляем код верификации после успешного использования
    memoryOtpStore.delete(phone)

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error('Ошибка регистрации:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}
