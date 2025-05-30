import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strategic Backlog AI',
  description: 'Intelligent Product Management Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 