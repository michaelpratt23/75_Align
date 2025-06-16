import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '75 Align - 75-Day Wellness Challenge',
  description: 'Stay on track with your 75-day wellness journey. Build discipline, strengthen your body and mind through daily commitments.',
  keywords: ['wellness', 'challenge', '75 hard', 'fitness', 'discipline', 'habits'],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#f4f4f5',
  manifest: '/manifest.json',
  openGraph: {
    title: '75 Align - 75-Day Wellness Challenge',
    description: 'Your journey to wellness, discipline, and inner harmony',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: '75 Align - 75-Day Wellness Challenge',
    description: 'Your journey to wellness, discipline, and inner harmony',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-zen-50">
          {children}
        </div>
      </body>
    </html>
  )
} 