'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '../Button'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string
}

export function SignInModal({ isOpen, onClose, redirectTo }: SignInModalProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(provider)
    setError('')

    try {
      // Use NextAuth signIn function
      const result = await signIn(provider, {
        callbackUrl: redirectTo || '/dashboard',
        redirect: false
      })

      if (result?.error) {
        setError('Authentication failed. Please try again.')
        setIsLoading(null)
      } else if (result?.url) {
        // Redirect to the callback URL
        window.location.href = result.url
      }
    } catch (err: any) {
      console.error('OAuth error:', err)
      setError('Something went wrong. Please try again.')
      setIsLoading(null)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Desktop/Tablet Modal */}
      <div className="hidden sm:fixed sm:inset-0 sm:bg-black/60 sm:flex sm:items-center sm:justify-center sm:p-4 sm:z-50">
        <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl animate-scale-in">
          <div className="p-8 relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                sign in to continue
              </h2>
              <p className="text-text-secondary text-sm">
                create an account or sign in to start building your project
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-4 mb-6">
              {/* Google Login Button */}
              <Button
                onClick={() => handleOAuthLogin('google')}
                disabled={isLoading !== null}
                variant="ghost"
                className="w-full h-12 bg-surface border border-border hover:bg-surface-light hover:border-primary hover:shadow-lg hover:shadow-primary/20 text-foreground transition-all duration-200 font-medium"
              >
                {isLoading === 'google' ? (
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

              {/* GitHub Login Button */}
              <Button
                onClick={() => handleOAuthLogin('github')}
                disabled={isLoading !== null}
                variant="ghost"
                className="w-full h-12 bg-surface border border-border hover:bg-surface-light hover:border-primary hover:shadow-lg hover:shadow-primary/20 text-foreground transition-all duration-200 font-medium"
              >
                {isLoading === 'github' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                  </>
                )}
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Modal */}
      <div className="sm:hidden fixed inset-0 bg-background z-50 animate-slide-up">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border bg-surface-light">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                sign in to continue
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
          
          <div className="flex-1 p-6">
            <p className="text-text-secondary text-sm mb-6">
              create an account or sign in to start building your project
            </p>

            <div className="space-y-4">
              {/* Google Button */}
              <Button
                onClick={() => handleOAuthLogin('google')}
                disabled={isLoading !== null}
                variant="ghost"
                className="w-full h-12 bg-surface border border-border hover:bg-surface-light hover:border-primary hover:shadow-lg hover:shadow-primary/20 text-foreground transition-all duration-200 font-medium"
              >
                {isLoading === 'google' ? (
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

              {/* GitHub Button */}
              <Button
                onClick={() => handleOAuthLogin('github')}
                disabled={isLoading !== null}
                variant="ghost"
                className="w-full h-12 bg-surface border border-border hover:bg-surface-light hover:border-primary hover:shadow-lg hover:shadow-primary/20 text-foreground transition-all duration-200 font-medium"
              >
                {isLoading === 'github' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                  </>
                )}
              </Button>
            </div>

            {/* Error Message */}
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
