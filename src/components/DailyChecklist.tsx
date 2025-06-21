'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Pledge {
  id: string
  text: string
  category: string
  isDaily: boolean
  timeOrder: string | null
  completed?: boolean
}

export default function DailyChecklist() {
  const [pledges, setPledges] = useState<Pledge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [animatingPledges, setAnimatingPledges] = useState<Set<string>>(new Set())
  const [showCommitmentsModal, setShowCommitmentsModal] = useState(false)

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

      // Combine pledges and commitments for display
      const allPledges = [
        ...(response.data.pledges || []),
        ...(response.data.commitments || [])
      ]
      setPledges(allPledges)
    } catch (error) {
      console.error('Error fetching pledges:', error)
    }
    setIsLoading(false)
  }

  const togglePledge = async (pledgeId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const pledge = pledges.find(p => p.id === pledgeId)
      if (!pledge) return

      // If we're marking as complete, add to animating set and show animation first
      if (!pledge.completed) {
        setAnimatingPledges(prev => new Set(Array.from(prev).concat(pledgeId)))
        
        // Update the pledge to show as completed for animation
        setPledges(prev => prev.map(p => 
          p.id === pledgeId 
            ? { ...p, completed: true }
            : p
        ))

        // Wait for the check animation to play
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Remove from animating set so it moves to completed section
        setAnimatingPledges(prev => {
          const newSet = new Set(prev)
          newSet.delete(pledgeId)
          return newSet
        })
      } else {
        // If unchecking, just update immediately
        setPledges(prev => prev.map(p => 
          p.id === pledgeId 
            ? { ...p, completed: false }
            : p
        ))
      }

      // Make the API call
      await axios.post('/api/daily-progress', {
        pledgeId,
        completed: !pledge.completed
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

    } catch (error) {
      console.error('Error updating progress:', error)
      // Revert the UI change if API call fails
      setAnimatingPledges(prev => {
        const newSet = new Set(prev)
        newSet.delete(pledgeId)
        return newSet
      })
      setPledges(prev => prev.map(p => 
        p.id === pledgeId 
          ? { ...p, completed: !p.completed }
          : p
      ))
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
  const incompletePledges = dailyPledges.filter(p => !p.completed || animatingPledges.has(p.id))
  const completedPledges = dailyPledges.filter(p => p.completed && !animatingPledges.has(p.id))
  const completedCount = completedPledges.length
  const totalCount = dailyPledges.length

  // Group pledges by time order
  const groupPledgesByTime = (pledgesList: Pledge[]) => {
    const grouped = {
      morning: pledgesList.filter(p => p.timeOrder === 'morning'),
      afternoon: pledgesList.filter(p => p.timeOrder === 'afternoon'),
      evening: pledgesList.filter(p => p.timeOrder === 'evening'),
      noTime: pledgesList.filter(p => !p.timeOrder)
    }
    return grouped
  }

  const groupedIncompletePledges = groupPledgesByTime(incompletePledges)
  const groupedCompletedPledges = groupPledgesByTime(completedPledges)

  const renderPledgeGroup = (title: string, pledgesList: Pledge[], completed: boolean = false) => {
    if (pledgesList.length === 0) return null

    return (
      <div key={title} className="mb-6">
        <div className="flex items-center mb-3">
          <h4 className="zen-heading text-base text-zen-700">{title}</h4>
          <div className="flex-1 h-px bg-zen-200 ml-3"></div>
          <span className="text-xs text-zen-500 ml-3 font-medium">
            {pledgesList.length} {pledgesList.length === 1 ? 'pledge' : 'pledges'}
          </span>
        </div>
        <div className="space-y-3">
          {pledgesList.map((pledge, index) => (
            <div
              key={pledge.id}
              onClick={() => togglePledge(pledge.id)}
              className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                completed
                  ? 'bg-gradient-to-r from-bamboo-50/60 to-earth-50/60 border-bamboo-200/60 shadow-sm hover:shadow-md'
                  : pledge.completed 
                    ? 'bg-gradient-to-r from-bamboo-50/80 to-earth-50/80 border-bamboo-200 shadow-lg' 
                    : 'bg-white/70 border-zen-200/50 hover:border-earth-300 hover:shadow-lg backdrop-blur-sm transform hover:-translate-y-1'
              }`}
              style={{ 
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={pledge.completed || false}
                  onChange={() => {}} // Empty handler since parent div handles the click
                  className="zen-checkbox pointer-events-none"
                />
                {pledge.completed && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-${completed ? '2' : '3'} h-${completed ? '2' : '3'} bg-bamboo-500 rounded-full ${completed ? '' : 'animate-ping'}`}></div>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`zen-text transition-all duration-300 ${
                  pledge.completed 
                    ? 'line-through text-zen-500' 
                    : 'text-zen-800 group-hover:text-zen-900'
                } ${completed ? 'text-sm' : 'text-lg'}`}>
                  {pledge.text}
                </p>
                <div className="flex items-center mt-2 space-x-3">
                  <span className={`inline-flex items-center px-${completed ? '2' : '3'} py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                    pledge.category === 'ACTIVITY' ? `bg-earth-100${completed ? '/60' : ''} text-earth-${completed ? '600' : '700'}` :
                    pledge.category === 'NUTRITION' ? `bg-bamboo-100${completed ? '/60' : ''} text-bamboo-${completed ? '600' : '700'}` :
                    pledge.category === 'MIND' ? `bg-sakura-100${completed ? '/60' : ''} text-sakura-${completed ? '600' : '700'}` :
                    `bg-zen-100${completed ? '/60' : ''} text-zen-${completed ? '600' : '700'}`
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
      </div>
    )
  }

  return (
    <>
    <div className="zen-card-glass zen-fade-in zen-shadow-soft">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="zen-heading text-2xl mb-2">Today's Pledges</h3>
          <button 
            onClick={() => setShowCommitmentsModal(true)}
            className="text-zen-500 hover:text-zen-700 text-sm font-medium transition-colors duration-200 hover:underline hover:decoration-dotted hover:underline-offset-2 cursor-pointer"
          >
            Daily Commitments
          </button>
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

      {/* Incomplete Pledges Section - Organized by Time */}
      <div className="space-y-2">
        {renderPledgeGroup('Morning', groupedIncompletePledges.morning)}
        {renderPledgeGroup('Afternoon', groupedIncompletePledges.afternoon)}
        {renderPledgeGroup('Evening', groupedIncompletePledges.evening)}
        {renderPledgeGroup('Other', groupedIncompletePledges.noTime)}
      </div>

      {/* Perfect Day Celebration */}
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

      {/* Completed Pledges Section - Organized by Time */}
      {completedPledges.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <h4 className="zen-heading text-lg text-zen-700">Completed Pledges</h4>
            <div className="flex-1 h-px bg-zen-200 ml-4"></div>
            <span className="text-xs text-zen-500 ml-4 font-medium">
              {completedPledges.length} complete
            </span>
          </div>
          <div className="space-y-2">
            {renderPledgeGroup('Morning', groupedCompletedPledges.morning, true)}
            {renderPledgeGroup('Afternoon', groupedCompletedPledges.afternoon, true)}
            {renderPledgeGroup('Evening', groupedCompletedPledges.evening, true)}
            {renderPledgeGroup('Other', groupedCompletedPledges.noTime, true)}
          </div>
        </div>
      )}
    </div>
    
    {/* Commitments Modal - Matching daily popup design */}
    {showCommitmentsModal && (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 99999,
          isolation: 'isolate'
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-8 text-center border-b border-gray-100">
            <h1 className="zen-heading text-3xl text-zen-900 mb-3">
              Your 75 Align Commitments
            </h1>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="space-y-8">
              {['ACTIVITY', 'NUTRITION', 'MIND', 'GROWTH'].map((category) => {
                const categoryCommitments = pledges.filter(p => p.category === category && !p.isDaily)
                if (categoryCommitments.length === 0) return null
                
                const categoryData = {
                  'ACTIVITY': {
                    title: 'Activity',
                    subtitle: 'I strengthen my body and discipline by agreeing to:'
                  },
                  'NUTRITION': {
                    title: 'Nutrition', 
                    subtitle: 'I nourish my body and mind by committing to:'
                  },
                  'MIND': {
                    title: 'Mind',
                    subtitle: 'I protect and focus my mind by pledging to:'
                  },
                  'GROWTH': {
                    title: 'Growth',
                    subtitle: 'I grow and develop myself by promising to:'
                  }
                }
                
                return (
                  <div key={category} className="border-l-4 border-earth-300 pl-6">
                    <div className="mb-4">
                      <h2 className="zen-heading text-2xl text-zen-900 mb-2">
                        {categoryData[category as keyof typeof categoryData].title}
                      </h2>
                      <p className="zen-text text-zen-600 italic text-lg">
                        {categoryData[category as keyof typeof categoryData].subtitle}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {categoryCommitments.map((commitment) => (
                        <div 
                          key={commitment.id}
                          className="flex items-start space-x-3"
                        >
                          <div className="w-2 h-2 bg-zen-400 rounded-full mt-3 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="zen-text text-zen-800 text-lg leading-relaxed">
                              {commitment.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {pledges.filter(p => !p.isDaily).length === 0 && (
                <div className="text-center py-12">
                  <p className="zen-text text-zen-500 text-lg">
                    No commitments found. You're all set!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer with Close Button */}
          <div className="border-t border-gray-100 p-8 bg-white rounded-b-2xl">
            <div className="text-center">
              <button
                onClick={() => setShowCommitmentsModal(false)}
                className="w-full max-w-md mx-auto block bg-gradient-to-r from-earth-500 to-earth-600 hover:from-earth-600 hover:to-earth-700 text-white py-4 px-8 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
} 