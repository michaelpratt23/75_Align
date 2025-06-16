'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import AuthForm from '@/components/AuthForm'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.user) {
        setIsAuthenticated(true)
        // Check if onboarding is completed
        if (response.data.user.profile?.onboardingCompleted) {
          router.push('/dashboard')
        } else {
          router.push('/onboarding')
        }
      }
    } catch (error) {
      localStorage.removeItem('token')
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center zen-gradient-bg">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-sakura-100/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-bamboo-100/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-gradient-to-br from-earth-100/40 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      <div className="zen-container relative z-10">
        <div className="text-center mb-12 zen-fade-in">
          <div className="mb-6">
            <h1 className="zen-title text-6xl md:text-7xl lg:text-8xl mb-4 bg-gradient-to-br from-zen-900 via-zen-800 to-earth-700 bg-clip-text text-transparent">
              75 Align
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-earth-400 to-bamboo-400 mx-auto rounded-full"></div>
          </div>
          <p className="zen-text text-xl md:text-2xl text-zen-600 max-w-2xl mx-auto leading-relaxed">
            Your journey to wellness, discipline, and inner harmony
          </p>
          <p className="zen-text text-lg text-zen-500 mt-4">
            75 days of transformation
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <AuthForm />
        </div>
        
        {/* Subtle decorative elements */}
        <div className="mt-16 flex justify-center space-x-8 opacity-60">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-earth-300 to-earth-400 rounded-full flex items-center justify-center mb-2">
              <span className="text-white font-bold text-lg">💪</span>
            </div>
            <p className="text-xs text-zen-500">Body</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-bamboo-300 to-bamboo-400 rounded-full flex items-center justify-center mb-2">
              <span className="text-white font-bold text-lg">🧠</span>
            </div>
            <p className="text-xs text-zen-500">Mind</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-sakura-300 to-sakura-400 rounded-full flex items-center justify-center mb-2">
              <span className="text-white font-bold text-lg">✨</span>
            </div>
            <p className="text-xs text-zen-500">Soul</p>
          </div>
        </div>
      </div>
    </div>
  )
} 