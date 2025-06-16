import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { pledgeId, completed } = await request.json()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.dailyProgress.upsert({
      where: {
        userId_pledgeId_date: {
          userId: decoded.userId,
          pledgeId,
          date: today
        }
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null
      },
      create: {
        userId: decoded.userId,
        pledgeId,
        date: today,
        completed,
        completedAt: completed ? new Date() : null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 