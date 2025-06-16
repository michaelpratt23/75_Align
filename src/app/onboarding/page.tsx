'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import OnboardingStep from '@/components/OnboardingStep'
import OnboardingFinal from '@/components/OnboardingFinal'
import LoadingSpinner from '@/components/LoadingSpinner'
import { defaultPledges } from '@/data/defaultPledges'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [pledges, setPledges] = useState(defaultPledges)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const categories = ['ACTIVITY', 'NUTRITION', 'MIND', 'GROWTH'] as const
  const categoryHeaders = {
    ACTIVITY: "I strengthen my body and discipline by agreeing to:",
    NUTRITION: "I nourish my body and mind by committing to:",
    MIND: "I protect and focus my mind by pledging to:",
    GROWTH: "I grow and develop myself by promising to:"
  }

  useEffect(() => {
    checkAuthAndRedirect()
  }, [])

  const checkAuthAndRedirect = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }

      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.user?.profile?.onboardingCompleted) {
        router.push('/dashboard')
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      localStorage.removeItem('token')
      router.push('/')
    }
    setIsLoading(false)
  }

  const handleStepComplete = (stepPledges: any[]) => {
    const currentCategory = categories[currentStep]
    setPledges(prev => ({
      ...prev,
      [currentCategory]: stepPledges
    }))

    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setCurrentStep(4) // Final step
    }
  }

  const handleFinalComplete = async (fullName: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      await axios.post('/api/onboarding', {
        pledges,
        fullName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (currentStep === 4) {
    return (
      <OnboardingFinal
        pledges={pledges}
        categoryHeaders={categoryHeaders}
        onComplete={handleFinalComplete}
      />
    )
  }

  const currentCategory = categories[currentStep]

  return (
    <div className="min-h-screen bg-zen-50 py-8">
      <div className="zen-container">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            {categories.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-16 mx-1 rounded-full transition-all duration-300 ${
                  index <= currentStep ? 'bg-earth-500' : 'bg-zen-200'
                }`}
              />
            ))}
          </div>
          <p className="zen-text">Step {currentStep + 1} of {categories.length}</p>
        </div>

        <OnboardingStep
          category={currentCategory}
          title={currentCategory.charAt(0) + currentCategory.slice(1).toLowerCase()}
          header={categoryHeaders[currentCategory]}
          initialPledges={pledges[currentCategory]}
          onComplete={handleStepComplete}
        />
      </div>
    </div>
  )
} 