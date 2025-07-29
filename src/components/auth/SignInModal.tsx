'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { X, Loader2 } from 'lucide-react'
import { Button } from '../Button'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string
  pendingProjectData?: {
    name: string
    description: string
    visibility: 'public' | 'private'
  } | null
}

export function SignInModal({ isOpen, onClose, redirectTo, pendingProjectData }: SignInModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { signIn } = useAuth()

  const handleOAuthLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      console.log('Starting Google OAuth login')
      
      // Store pending project data in localStorage if it exists
      if (pendingProjectData) {
        localStorage.setItem('pendingProjectData', JSON.stringify(pendingProjectData))
      }
      
      await signIn()
      onClose()
      
    } catch (err: any) {
      console.error('OAuth error:', err)
      setError(`Something went wrong: ${err.message || 'Unknown error'}. Please try again.`)
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Desktop/Tablet Modal */}
      <div className="hidden sm:fixed sm:inset-0 sm:bg-black/60 sm:flex sm:items-center sm:justify-center sm:p-4 sm:z-[60]">
        <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl animate-scale-in">
          <div className="p-6 sm:p-8 relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                One step away from showing your greatness.
              </h2>
              <p className="text-text-secondary text-xs sm:text-sm">
                We know logins are annoying — but it helps us track your achievements and celebrate them with the world.
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {/* Google Login Button */}
              <Button
                onClick={handleOAuthLogin}
                disabled={isLoading}
                variant="ghost"
                className="w-full h-11 sm:h-12 bg-surface border border-border hover:bg-surface-light hover:border-primary hover:shadow-lg hover:shadow-primary/20 text-foreground transition-all duration-200 font-medium text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 sm:mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-xs sm:text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Modal */}
      <div className="sm:hidden fixed inset-0 bg-background z-[60] animate-slide-up">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border bg-surface-light">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                One step away from showing your greatness.
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-text-secondary hover:text-foreground transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 pb-safe">
            <p className="text-text-secondary text-sm mb-6">
              We know logins are annoying — but it helps us track your achievements and celebrate them with the world.
            </p>

            <div className="space-y-4">
              <Button
                onClick={handleOAuthLogin}
                disabled={isLoading}
                variant="ghost"
                className="w-full h-12 bg-surface border border-border hover:bg-surface-light hover:border-primary hover:shadow-lg hover:shadow-primary/20 text-foreground transition-all duration-200 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
