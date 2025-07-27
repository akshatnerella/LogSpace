import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'logspace - Build in Public. Stay Accountable. Get Discovered.',
  description: 'LogSpace helps creators and indie hackers share progress, ideas, and projects in public.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
