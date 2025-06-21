import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: Request) {
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

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const acknowledgment = await prisma.dailyAcknowledgment.findUnique({
      where: {
        userId_date: {
          userId: decoded.userId,
          date: today
        }
      }
    })

    return NextResponse.json({ 
      acknowledged: !!acknowledgment,
      acknowledgment 
    })
  } catch (error) {
    console.error('Error checking acknowledgment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Create or update acknowledgment for today
    const acknowledgment = await prisma.dailyAcknowledgment.upsert({
      where: {
        userId_date: {
          userId: decoded.userId,
          date: today
        }
      },
      update: {
        acknowledgedAt: new Date()
      },
      create: {
        userId: decoded.userId,
        date: today,
        acknowledgedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true,
      acknowledgment 
    })
  } catch (error) {
    console.error('Error creating acknowledgment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 