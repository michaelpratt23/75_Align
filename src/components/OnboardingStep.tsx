'use client'

import { useState, useEffect } from 'react'

interface Pledge {
  id: string
  text: string
  type: 'DAILY_PLEDGE' | 'COMMITMENT'
  isDaily: boolean
}

interface OnboardingStepProps {
  category: string
  title: string
  header: string
  initialPledges: Pledge[]
  onComplete: (pledges: Pledge[]) => void
}

export default function OnboardingStep({
  category,
  title,
  header,
  initialPledges,
  onComplete
}: OnboardingStepProps) {
  const [pledges, setPledges] = useState<Pledge[]>(initialPledges)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [newlyCreatedIds, setNewlyCreatedIds] = useState<Set<string>>(new Set())

  // Update pledges when initialPledges prop changes (when switching categories)
  useEffect(() => {
    setPledges(initialPledges)
    setEditingId(null)
    setEditText('')
    setNewlyCreatedIds(new Set())
  }, [initialPledges])

  const handleEdit = (pledge: Pledge) => {
    setEditingId(pledge.id)
    setEditText(pledge.text)
  }

  const handleSaveEdit = (id: string) => {
    setPledges(prev => prev.map(p => 
      p.id === id ? { ...p, text: editText } : p
    ))
    setEditingId(null)
    setEditText('')
    // Remove from newly created set once saved
    setNewlyCreatedIds(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const handleCancelEdit = () => {
    if (editingId && newlyCreatedIds.has(editingId)) {
      // If this is a newly created pledge that hasn't been saved, delete it
      setPledges(prev => prev.filter(p => p.id !== editingId))
      setNewlyCreatedIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(editingId)
        return newSet
      })
    }
    setEditingId(null)
    setEditText('')
  }

  const handleDelete = (id: string) => {
    setPledges(prev => prev.filter(p => p.id !== id))
  }

  const handleAddPledge = () => {
    const newPledge: Pledge = {
      id: `custom-${Date.now()}`,
      text: 'New commitment',
      type: 'DAILY_PLEDGE',
      isDaily: true
    }
    setPledges(prev => [...prev, newPledge])
    setEditingId(newPledge.id)
    setEditText(newPledge.text)
    // Track this as a newly created pledge
    setNewlyCreatedIds(prev => new Set(prev).add(newPledge.id))
  }

  const togglePledgeType = (id: string) => {
    setPledges(prev => prev.map(p => 
      p.id === id 
        ? { 
            ...p, 
            type: p.type === 'DAILY_PLEDGE' ? 'COMMITMENT' : 'DAILY_PLEDGE',
            isDaily: p.type === 'COMMITMENT'
          } 
        : p
    ))
  }

  return (
    <div className="zen-card zen-fade-in">
      <div className="text-center mb-8">
        <h2 className="zen-heading text-3xl mb-4">{title}</h2>
        <p className="zen-text text-lg">{header}</p>
      </div>

      <div className="space-y-4 mb-8">
        {pledges.map((pledge) => (
          <div key={pledge.id} className="border border-zen-200 rounded-lg p-4 bg-zen-50">
            {editingId === pledge.id ? (
              <div className="space-y-3">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-3 border border-zen-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-400 resize-none"
                  rows={2}
                />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSaveEdit(pledge.id)}
                      className="px-4 py-2 bg-earth-600 text-white rounded-lg text-sm hover:bg-earth-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-zen-200 text-zen-700 rounded-lg text-sm hover:bg-zen-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="zen-text mb-2">{pledge.text}</p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => togglePledgeType(pledge.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        pledge.type === 'DAILY_PLEDGE' 
                          ? 'bg-earth-100 text-earth-700' 
                          : 'bg-zen-200 text-zen-700'
                      }`}
                    >
                      {pledge.type === 'DAILY_PLEDGE' ? 'Daily Pledge' : 'Commitment'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(pledge)}
                    className="text-earth-600 hover:text-earth-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pledge.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleAddPledge}
          className="zen-button-secondary flex-1"
        >
          Add Custom Pledge
        </button>
        <button
          onClick={() => onComplete(pledges)}
          className="zen-button flex-1"
        >
          Continue
        </button>
      </div>
    </div>
  )
} 