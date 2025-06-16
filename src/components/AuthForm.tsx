'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setIsLoading(true)

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setErrors(['Passwords do not match'])
        setIsLoading(false)
        return
      }

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await axios.post(endpoint, {
        email: formData.email,
        password: formData.password
      })

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        if (isLogin && response.data.user.profile?.onboardingCompleted) {
          router.push('/dashboard')
        } else {
          router.push('/onboarding')
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'An error occurred'
      setErrors([errorMessage])
    }
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="zen-card-glass zen-slide-up zen-shadow-soft">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-center">
          <h2 className="zen-heading text-3xl mb-3">
            {isLogin ? 'Welcome Back' : 'Start Your Journey'}
          </h2>
          <p className="zen-text text-zen-500">
            {isLogin ? 'Continue your 75-day challenge' : 'Create your account to begin your transformation'}
          </p>
        </div>

        {errors.length > 0 && (
          <div className="bg-gradient-to-r from-sakura-50 to-red-50 border border-sakura-200 rounded-xl p-5 zen-slide-up">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-sakura-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
              </div>
              <div className="flex-1">
                {errors.map((error, index) => (
                  <p key={index} className="text-sakura-700 text-sm font-medium">{error}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-zen-700 mb-3 font-zen">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                required
                className="zen-input pl-12"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 bg-gradient-to-br from-earth-400 to-earth-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-zen-700 mb-3 font-zen">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                required
                className="zen-input pl-12"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 bg-gradient-to-br from-bamboo-400 to-bamboo-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {!isLogin && (
            <div className="zen-slide-up">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-zen-700 mb-3 font-zen">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  className="zen-input pl-12"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 bg-gradient-to-br from-sakura-400 to-sakura-500 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="zen-button relative overflow-hidden group"
        >
          <span className="relative z-10">
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            )}
          </span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zen-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/90 text-zen-500 font-zen">or</span>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="group text-earth-600 hover:text-earth-700 text-sm font-medium transition-all duration-300 px-4 py-2 rounded-lg hover:bg-earth-50"
          >
            <span className="relative">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="font-semibold group-hover:underline">
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </span>
          </button>
        </div>
      </form>
    </div>
  )
} 