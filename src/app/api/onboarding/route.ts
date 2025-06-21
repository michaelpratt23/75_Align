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

    const { pledges, fullName } = await request.json()

    // Start transaction
    await prisma.$transaction(async (tx) => {
      // Update user profile
      await tx.userProfile.update({
        where: { userId: decoded.userId },
        data: {
          onboardingCompleted: true,
          challengeStartDate: new Date(),
          fullName
        }
      })

      // Create pledges
      const pledgeData: Array<{
        userId: string
        text: string
        category: string
        type: string
        isDaily: boolean
        order: number
        timeOrder: string | null
      }> = []
      
      Object.entries(pledges).forEach(([category, categoryPledges]) => {
        (categoryPledges as any[]).forEach((pledge, index) => {
          pledgeData.push({
            userId: decoded.userId,
            text: pledge.text,
            category: category,
            type: pledge.type,
            isDaily: pledge.isDaily,
            order: index,
            timeOrder: pledge.order || null // Store the time-based order (morning/afternoon/evening)
          })
        })
      })

      await tx.pledge.createMany({
        data: pledgeData
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 