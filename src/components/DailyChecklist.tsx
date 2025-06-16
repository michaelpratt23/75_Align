'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Pledge {
  id: string
  text: string
  category: string
  isDaily: boolean
  completed?: boolean
}

export default function DailyChecklist() {
  const [pledges, setPledges] = useState<Pledge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPledges()
  }, [])

  const fetchPledges = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await axios.get('/api/pledges', {
        headers: { Authorization: `Bearer ${token}` }
      })

      setPledges(response.data.pledges)
    } catch (error) {
      console.error('Error fetching pledges:', error)
    }
    setIsLoading(false)
  }

  const togglePledge = async (pledgeId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      await axios.post('/api/daily-progress', {
        pledgeId,
        completed: !pledges.find(p => p.id === pledgeId)?.completed
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setPledges(prev => prev.map(pledge => 
        pledge.id === pledgeId 
          ? { ...pledge, completed: !pledge.completed }
          : pledge
      ))
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="zen-card-glass zen-shadow-soft">
        <div className="flex justify-between items-center mb-8">
          <div className="h-6 bg-zen-200 rounded-lg w-1/3"></div>
          <div className="h-6 bg-zen-200 rounded-full w-12"></div>
        </div>
        <div className="animate-pulse space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-start space-x-4 p-4 bg-zen-50/50 rounded-xl">
              <div className="h-6 w-6 bg-zen-200 rounded-lg mt-1"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zen-200 rounded-lg w-3/4"></div>
                <div className="h-3 bg-zen-200 rounded-lg w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const dailyPledges = pledges.filter(p => p.isDaily)
  const completedCount = dailyPledges.filter(p => p.completed).length
  const totalCount = dailyPledges.length

  return (
    <div className="zen-card-glass zen-fade-in zen-shadow-soft">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="zen-heading text-2xl mb-2">Today's Pledges</h3>
          <p className="text-zen-500 text-sm font-medium">Daily commitments</p>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg ${
            completedCount === totalCount && totalCount > 0
              ? 'bg-gradient-to-br from-bamboo-400 to-bamboo-600 text-white' 
              : 'bg-gradient-to-br from-earth-400 to-earth-600 text-white'
          } transition-all duration-500`}>
            <span className="font-bold text-lg">
              {completedCount}/{totalCount}
            </span>
          </div>
          <p className="text-xs text-zen-500 mt-2 font-medium">
            {Math.round((completedCount / totalCount) * 100) || 0}% complete
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {dailyPledges.map((pledge, index) => (
          <div
            key={pledge.id}
            className={`group flex items-start space-x-4 p-5 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${
              pledge.completed 
                ? 'bg-gradient-to-r from-bamboo-50/80 to-earth-50/80 border-bamboo-200 shadow-lg' 
                : 'bg-white/70 border-zen-200/50 hover:border-earth-300 hover:shadow-lg backdrop-blur-sm'
            }`}
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={pledge.completed || false}
                onChange={() => togglePledge(pledge.id)}
                className="zen-checkbox"
              />
              {pledge.completed && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3 h-3 bg-bamboo-500 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`zen-text text-lg transition-all duration-300 ${
                pledge.completed 
                  ? 'line-through text-zen-500' 
                  : 'text-zen-800 group-hover:text-zen-900'
              }`}>
                {pledge.text}
              </p>
              <div className="flex items-center mt-2 space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                  pledge.category === 'ACTIVITY' ? 'bg-earth-100 text-earth-700' :
                  pledge.category === 'NUTRITION' ? 'bg-bamboo-100 text-bamboo-700' :
                  pledge.category === 'MIND' ? 'bg-sakura-100 text-sakura-700' :
                  'bg-zen-100 text-zen-700'
                }`}>
                  {pledge.category}
                </span>
                {pledge.completed && (
                  <div className="flex items-center space-x-1 text-xs text-bamboo-600">
                    <span>✓</span>
                    <span className="font-medium">Complete</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {completedCount === totalCount && totalCount > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-bamboo-50 to-earth-50 rounded-2xl border border-bamboo-200 text-center zen-slide-up">
          <div className="w-12 h-12 bg-gradient-to-br from-bamboo-400 to-bamboo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">🎉</span>
          </div>
          <h4 className="zen-heading text-xl text-bamboo-800 mb-2">
            Perfect Day!
          </h4>
          <p className="text-bamboo-700 font-medium mb-3">
            All pledges completed today! Your consistency is building something beautiful.
          </p>
          <p className="text-xs text-bamboo-600 font-medium">
            A perfect day
          </p>
        </div>
      )}
    </div>
  )
} 