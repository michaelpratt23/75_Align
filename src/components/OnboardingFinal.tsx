'use client'

import { useState } from 'react'

interface Pledge {
  id: string
  text: string
  type: 'DAILY_PLEDGE' | 'COMMITMENT'
  isDaily: boolean
}

interface PledgesByCategory {
  ACTIVITY: Pledge[]
  NUTRITION: Pledge[]
  MIND: Pledge[]
  GROWTH: Pledge[]
}

interface OnboardingFinalProps {
  pledges: PledgesByCategory
  categoryHeaders: Record<string, string>
  onComplete: (fullName: string) => void
}

export default function OnboardingFinal({
  pledges,
  categoryHeaders,
  onComplete
}: OnboardingFinalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const categories = ['ACTIVITY', 'NUTRITION', 'MIND', 'GROWTH'] as const

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
    if (firstName.trim() && lastName.trim()) {
      onComplete(fullName)
    }
  }

  return (
    <div className="min-h-screen bg-zen-50 py-8">
      <div className="zen-container">
        <div className="zen-card zen-fade-in">
          <div className="text-center mb-8">
            <h2 className="zen-heading text-3xl mb-4">Your 75 Align Commitment</h2>
            <p className="zen-text">Review your pledges and make your commitment official</p>
          </div>

          <div className="space-y-8 mb-8">
            {categories.map((category) => (
              <div key={category} className="border-l-4 border-earth-400 pl-6">
                <h3 className="zen-heading text-xl mb-2">
                  {category.charAt(0) + category.slice(1).toLowerCase()}
                </h3>
                <p className="zen-text text-sm mb-4 italic">
                  {categoryHeaders[category]}
                </p>
                <ul className="space-y-2">
                  {pledges[category].map((pledge) => (
                    <li key={pledge.id} className="flex items-start">
                      <span className="text-earth-600 mr-2">•</span>
                      <div className="flex-1">
                        <span className="zen-text">{pledge.text}</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          pledge.type === 'DAILY_PLEDGE' 
                            ? 'bg-earth-100 text-earth-700' 
                            : 'bg-zen-200 text-zen-700'
                        }`}>
                          {pledge.type === 'DAILY_PLEDGE' ? 'Daily' : 'Commitment'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-zen-100 rounded-lg p-6 mb-8">
            <div className="zen-text leading-relaxed">
              <div className="mb-4">
                <p className="mb-4">I pledge to show up for myself every day for the next 75 days by following the commitments above, strengthening my body, mind, and character through daily action.</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-zen-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      className="zen-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zen-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      className="zen-input"
                      required
                    />
                  </div>
                </div>
              </div>
              <p className="text-center font-medium text-earth-700">
                This is my <strong>75 Align</strong>.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              disabled={!firstName.trim() || !lastName.trim()}
              className="zen-button"
            >
              Start 75 Align
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 