import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/contexts/AppContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { MainLayout } from '@/components/layout/MainLayout'

/**
 * 폰트 설정 (Inter)
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LIFE OS',
  description: '기준으로 돌아오는 루틴 앱',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <AppProvider>
            <MainLayout>{children}</MainLayout>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

