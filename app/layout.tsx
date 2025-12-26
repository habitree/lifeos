import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LIFE OS',
  description: '기준으로 돌아오는 루틴 앱',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

