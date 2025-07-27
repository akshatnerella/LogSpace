'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      // Check if there's a saved redirect URL
      const savedRedirect = sessionStorage.getItem('auth_redirect')
      if (savedRedirect) {
        sessionStorage.removeItem('auth_redirect')
        router.push(savedRedirect)
      } else {
        router.push('/dashboard')
      }
    } else if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-text-secondary">Completing sign in...</p>
      </div>
    </div>
  )
}
