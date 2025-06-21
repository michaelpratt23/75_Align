'use client'

import { useState } from 'react'

interface Commitment {
  id: string
  text: string
  category: string
}

interface CommitmentsAcknowledgmentProps {
  commitments: Commitment[]
  onAcknowledge: () => void
}

export default function CommitmentsAcknowledgment({ 
  commitments, 
  onAcknowledge 
}: CommitmentsAcknowledgmentProps) {
  const [isAcknowledging, setIsAcknowledging] = useState(false)

  const handleAcknowledge = async () => {
    setIsAcknowledging(true)
    await onAcknowledge()
    setIsAcknowledging(false)
  }

  // Fixed category order
  const categoryOrder = ['ACTIVITY', 'NUTRITION', 'MIND', 'GROWTH']
  
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

  // Group commitments by category in the specified order
  const orderedCommitments = categoryOrder.map(category => {
    const categoryCommitments = commitments.filter(c => c.category === category)
    return categoryCommitments.length > 0 ? { category, commitments: categoryCommitments } : null
  }).filter((item): item is { category: string; commitments: Commitment[] } => item !== null)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
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
            {orderedCommitments.map(({ category, commitments: categoryCommitments }) => (
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
            ))}

            {commitments.length === 0 && (
              <div className="text-center py-12">
                <p className="zen-text text-zen-500 text-lg">
                  No commitments found. You're all set!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer with Acknowledge Button */}
        <div className="border-t border-gray-100 p-8 bg-white rounded-b-2xl">
          <div className="text-center space-y-4">
            <p className="zen-text text-zen-600 text-lg max-w-2xl mx-auto">
              I acknowledge these commitments and understand they guide my choices throughout the day.
            </p>
            <button
              onClick={handleAcknowledge}
              disabled={isAcknowledging}
              className="w-full max-w-md mx-auto block bg-gradient-to-r from-earth-500 to-earth-600 hover:from-earth-600 hover:to-earth-700 text-white py-4 px-8 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
            >
              {isAcknowledging ? 'Acknowledging...' : 'I Acknowledge'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 