'use client'

import { useState, useEffect } from 'react'

interface Quote {
  text: string
  author: string
}

export default function DailyQuote() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDailyQuote()
  }, [])

  const fetchDailyQuote = async () => {
    try {
      // Using ZenQuotes API as a fallback
      const response = await fetch('https://zenquotes.io/api/today')
      const data = await response.json()
      
      if (data && data[0]) {
        setQuote({
          text: data[0].q,
          author: data[0].a
        })
      } else {
        // Fallback quote
        setQuote({
          text: "The way to get started is to quit talking and begin doing.",
          author: "Walt Disney"
        })
      }
    } catch (error) {
      // Fallback quote on error
      setQuote({
        text: "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution.",
        author: "Aristotle"
      })
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="zen-card-glass text-center zen-shadow-soft">
        <div className="animate-pulse">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-earth-200 to-earth-300 rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-zen-200 rounded-lg w-3/4 mx-auto"></div>
            <div className="h-4 bg-zen-200 rounded-lg w-5/6 mx-auto"></div>
            <div className="h-4 bg-zen-200 rounded-lg w-2/3 mx-auto"></div>
          </div>
          <div className="mt-6">
            <div className="h-3 bg-zen-200 rounded-lg w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="zen-card-glass text-center zen-fade-in zen-shadow-soft relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-earth-100/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-sakura-100/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        {quote && (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-earth-400 to-earth-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-white text-xl">"</span>
              </div>
            </div>
            
            <blockquote className="zen-text text-xl md:text-2xl leading-relaxed mb-8 text-zen-800 font-medium max-w-2xl mx-auto">
              "{quote.text}"
            </blockquote>
            
            <div className="pt-4 border-t border-zen-200/50">
              <cite className="text-earth-600 font-semibold text-lg font-heading">
                — {quote.author}
              </cite>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 