import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user
    const hashedPassword = hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            onboardingCompleted: false
          }
        }
      },
      include: {
        profile: true
      }
    })

    // Generate token
    const token = generateToken(user.id)

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 