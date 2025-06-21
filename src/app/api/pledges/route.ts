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

    const pledges = await prisma.pledge.findMany({
      where: { 
        userId: decoded.userId,
        isActive: true
      },
      include: {
        dailyProgress: {
          where: {
            date: today
          }
        }
      },
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    })

    const pledgesWithCompletion = pledges.map(pledge => ({
      id: pledge.id,
      text: pledge.text,
      category: pledge.category,
      type: pledge.type,
      isDaily: pledge.isDaily,
      timeOrder: pledge.timeOrder,
      completed: pledge.dailyProgress.length > 0 ? pledge.dailyProgress[0].completed : false
    }))

    // Separate daily pledges and commitments
    const dailyPledges = pledgesWithCompletion.filter(pledge => pledge.isDaily)
    const commitments = pledgesWithCompletion.filter(pledge => !pledge.isDaily)

    return NextResponse.json({ 
      pledges: dailyPledges,
      commitments: commitments
    })
  } catch (error) {
    console.error('Error fetching pledges:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 