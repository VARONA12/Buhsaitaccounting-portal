import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { memoryOtpStore } from '@/lib/otpStore'

export async function POST(request: Request) {
  try {
    const { name, company, phone, code } = await request.json()

    if (!name || !company || !phone || !code) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 })
    }

    // Проверка кода
    const storedData = memoryOtpStore.get(phone)
    if (!storedData || Date.now() > storedData.expiresAt || storedData.code !== code) {
      return NextResponse.json({ error: 'Неверный или устаревший код' }, { status: 400 })
    }

    // Проверяем, существует ли уже такой пользователь
    const existingUser = await db.user.findUnique({
      where: { phone }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Пользователь с таким номером уже зарегистрирован' }, { status: 400 })
    }

    // Создаем пользователя в БД
    const newUser = await db.user.create({
      data: {
        name,
        company,
        phone,
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
