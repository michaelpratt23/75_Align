'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import LoadingSpinner from '@/components/LoadingSpinner'
import DailyChecklist from '@/components/DailyChecklist'
import DailyQuote from '@/components/DailyQuote'
import CommitmentsAcknowledgment from '@/components/CommitmentsAcknowledgment'

interface User {
  id: string
  email: string
  profile?: {
    challengeStartDate?: string
    fullName?: string
  }
}

interface Commitment {
  id: string
  text: string
  category: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [dayCount, setDayCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showCommitmentsPopup, setShowCommitmentsPopup] = useState(false)
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }

      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const userData = response.data.user
      if (!userData.profile?.challengeStartDate) {
        router.push('/onboarding')
        return
      }

      setUser(userData)
      
      // Calculate day count
      const startDate = new Date(userData.profile.challengeStartDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - startDate.getTime())
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
      setDayCount(Math.min(diffDays, 75))

      // Check if user needs to acknowledge commitments today
      await checkCommitmentsAcknowledgment(token)

    } catch (error) {
      localStorage.removeItem('token')
      router.push('/')
    }
    setIsLoading(false)
  }

  const checkCommitmentsAcknowledgment = async (token: string) => {
    try {
      // Check if user just completed onboarding (within the last 5 minutes)
      const userResponse = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const challengeStartDate = userResponse.data.user?.profile?.challengeStartDate
      if (challengeStartDate) {
        const startTime = new Date(challengeStartDate)
        const now = new Date()
        const timeDifference = now.getTime() - startTime.getTime()
        const minutesDifference = timeDifference / (1000 * 60)
        
        // If onboarding was completed less than 5 minutes ago, don't show popup
        if (minutesDifference < 5) {
          return
        }
      }

      // Check if already acknowledged today
      const ackResponse = await axios.get('/api/daily-acknowledgment', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!ackResponse.data.acknowledged) {
        // Fetch only commitments to show
        const pledgesResponse = await axios.get('/api/pledges', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (pledgesResponse.data.commitments && pledgesResponse.data.commitments.length > 0) {
          setCommitments(pledgesResponse.data.commitments)
          setShowCommitmentsPopup(true)
        }
      }
    } catch (error) {
      console.error('Error checking commitments acknowledgment:', error)
    }
  }

  const handleCommitmentsAcknowledgment = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      await axios.post('/api/daily-acknowledgment', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setShowCommitmentsPopup(false)
    } catch (error) {
      console.error('Error acknowledging commitments:', error)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen zen-gradient-bg">
      {/* Commitments Acknowledgment Popup */}
      {showCommitmentsPopup && (
        <CommitmentsAcknowledgment 
          commitments={commitments}
          onAcknowledge={handleCommitmentsAcknowledgment}
        />
      )}

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-sakura-100/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-bamboo-100/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-gradient-to-br from-earth-100/15 to-transparent rounded-full blur-3xl"></div>
      </div>

      <header className="zen-glass-effect border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center py-6">
          <h1 className="zen-title text-2xl md:text-3xl bg-gradient-to-r from-zen-900 to-earth-700 bg-clip-text text-transparent">
            75 Align
          </h1>
          <button
            onClick={handleSignOut}
            className="text-zen-600 hover:text-zen-800 text-sm font-medium transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/50 backdrop-blur-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-6 py-8 md:py-12 relative z-10">
        <div className="text-center mb-12 md:mb-16 zen-fade-in">
          <div className="mb-6 md:mb-8">
            <h2 className="zen-title text-4xl md:text-5xl lg:text-6xl mb-4">
              Day <span className="bg-gradient-to-r from-earth-400 to-earth-600 bg-clip-text text-transparent">{dayCount}</span> <span className="bg-gradient-to-br from-zen-900 via-zen-800 to-earth-700 bg-clip-text text-transparent">of 75</span>
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="zen-text text-lg md:text-xl text-zen-600 mb-4">
              {user?.profile?.fullName ? `Keep going, ${user.profile.fullName.split(' ')[0]}!` : 'Keep going!'}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <DailyQuote />
          
          {dayCount >= 75 && (
            <div className="zen-card-glass text-center bg-gradient-to-br from-bamboo-50/80 to-earth-50/80 border-bamboo-200/50 zen-shadow-soft">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-bamboo-400 to-bamboo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🎉</span>
                </div>
                <h3 className="zen-heading text-3xl mb-4 text-bamboo-800">
                  Congratulations!
                </h3>
                <p className="zen-text text-lg text-bamboo-700 leading-relaxed">
                  You've completed your 75 Align challenge! Your dedication and discipline have transformed you.
                </p>
              </div>
              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-sm text-bamboo-600 font-medium">
                  Journey Complete
                </p>
              </div>
            </div>
          )}
          
          <DailyChecklist />
        </div>
      </main>
    </div>
  )
} 