'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import LoadingSpinner from '@/components/LoadingSpinner'
import DailyChecklist from '@/components/DailyChecklist'
import DailyQuote from '@/components/DailyQuote'

interface User {
  id: string
  email: string
  profile?: {
    challengeStartDate?: string
    fullName?: string
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [dayCount, setDayCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
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

    } catch (error) {
      localStorage.removeItem('token')
      router.push('/')
    }
    setIsLoading(false)
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
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-sakura-100/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-bamboo-100/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-gradient-to-br from-earth-100/15 to-transparent rounded-full blur-3xl"></div>
      </div>

      <header className="zen-glass-effect border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="zen-container flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <h1 className="zen-title text-3xl bg-gradient-to-r from-zen-900 to-earth-700 bg-clip-text text-transparent">
              75 Align
            </h1>
          </div>
          <button
            onClick={handleSignOut}
            className="group text-zen-600 hover:text-zen-800 text-sm font-medium transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/50 backdrop-blur-sm"
          >
            <span className="flex items-center space-x-2">
              <span>Sign Out</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </button>
        </div>
      </header>

      <main className="zen-container py-12 relative z-10">
        <div className="text-center mb-16 zen-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-earth-400 to-earth-600 rounded-full mb-6 shadow-lg">
              <span className="text-white font-bold text-2xl">{dayCount}</span>
            </div>
            <h2 className="zen-title text-5xl md:text-6xl mb-4 bg-gradient-to-br from-zen-900 via-zen-800 to-earth-700 bg-clip-text text-transparent">
              Day {dayCount} of 75
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-earth-400 via-bamboo-400 to-sakura-400 mx-auto rounded-full mb-6"></div>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="zen-text text-xl text-zen-600 mb-4">
              {user?.profile?.fullName ? `Keep going, ${user.profile.fullName}!` : 'Keep going!'}
            </p>
            <p className="zen-text text-zen-500">
              Consistency is strength
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
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
          </div>
          
          <div>
            <DailyChecklist />
          </div>
        </div>
      </main>
    </div>
  )
} 